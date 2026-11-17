// Lecteur vocal naturel pour la lecture des synopsis (Niveau 1) et questions d'épisodes (Niveau 2) via /api/tts

export type VoiceReaderMode = 'episode' | 'synopsis';

export interface EpisodeVoicePayload {
  mode?: VoiceReaderMode;
  synopsis?: string;
  episodeLabel?: string;
  episodeTitle?: string;
  question?: string;
  onLoadStart?: () => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (message?: string) => void;
}

const PRONUNCIATION_HINT =
  'Prononcer « Vodoun » avec le son « ou » et prononcer le mot anglais « Rays » en anglais comme « Days » (/reɪz/).';

const STYLE_BY_MODE: Record<VoiceReaderMode, string> = {
  episode:
    `Voix de femme française très douce, chaleureuse, naturelle et posée, rythme intime et fluide de narratrice documentaire. ${PRONUNCIATION_HINT}`,
  synopsis:
    `Voix de femme française douce, chaleureuse, naturelle et posée, ton calme et incarné de bande-annonce documentaire. ${PRONUNCIATION_HINT}`,
};

const MAX_CLIENT_AUDIO_CACHE = 64;

function cleanSpokenSegment(text?: string): string {
  return (text || '')
    .trim()
    .replace(/[«»"]/g, '')
    .replace(/\bvodun\b/gi, 'Vodoun')
    .replace(/\s+/g, ' ');
}

function formatSpokenText(payload: EpisodeVoicePayload, mode: VoiceReaderMode): string {
  if (mode === 'synopsis') {
    return cleanSpokenSegment(payload.synopsis || payload.question);
  }

  const parts: string[] = [];
  const epLabel = cleanSpokenSegment(payload.episodeLabel);
  const epTitle = cleanSpokenSegment(payload.episodeTitle);
  const epQuestion = cleanSpokenSegment(payload.question);

  if (epLabel) parts.push(`${epLabel}.`);
  if (epTitle) parts.push(`${epTitle}.`);
  if (epQuestion) parts.push(epQuestion);

  return parts.join(' ');
}

interface ResolvedVoiceRequest {
  mode: VoiceReaderMode;
  text: string;
  style: string;
  cacheKey: string;
}

class QuotaExhaustedError extends Error {
  constructor(message = 'Quota vocal Gemini saturé') {
    super(message);
    this.name = 'QuotaExhaustedError';
  }
}

function buildWavBlobFromPcmChunks(chunks: Uint8Array[], sampleRate = 24000, channels = 1, bitsPerSample = 16): Blob {
  const totalBytes = chunks.reduce((sum, c) => sum + c.byteLength, 0);
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + totalBytes, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, 'data');
  view.setUint32(40, totalBytes, true);

  return new Blob([header, ...chunks], { type: 'audio/wav' });
}

class EpisodeVoiceReader {
  private sessionId = 0;
  private activeAudio: HTMLAudioElement | null = null;
  private activeStreamReader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private activeSources: AudioBufferSourceNode[] = [];
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private audioCtx: AudioContext | null = null;
  private urlCache = new Map<string, string>();
  private inFlightRequests = new Map<string, Promise<string>>();
  private quotaCooldownUntil = 0;

  isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      (typeof Audio !== 'undefined' || 'speechSynthesis' in window)
    );
  }

  private getOrUnlockAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      try {
        this.audioCtx = new AudioCtx({ sampleRate: 24000 });
      } catch {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {
        // ignore resume errors
      });
    }
    return this.audioCtx;
  }

  private resolveRequest(payload: EpisodeVoicePayload): ResolvedVoiceRequest | null {
    const mode: VoiceReaderMode = payload.mode ?? 'episode';
    const text = formatSpokenText(payload, mode);
    if (!text) return null;

    const style = STYLE_BY_MODE[mode];
    const cacheKey = `${mode}::${text}`;
    return { mode, text, style, cacheKey };
  }

  hasCached(payload: EpisodeVoicePayload): boolean {
    const resolved = this.resolveRequest(payload);
    return resolved ? this.urlCache.has(resolved.cacheKey) : false;
  }

  private setCachedUrl(key: string, objectUrl: string) {
    if (this.urlCache.size >= MAX_CLIENT_AUDIO_CACHE) {
      const oldestKey = this.urlCache.keys().next().value;
      if (oldestKey) {
        const oldUrl = this.urlCache.get(oldestKey);
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        this.urlCache.delete(oldestKey);
      }
    }
    this.urlCache.set(key, objectUrl);
  }

  private fetchAndCacheAudio(text: string, style: string, cacheKey: string, cacheOnly = false): Promise<string> {
    const cachedUrl = this.urlCache.get(cacheKey);
    if (cachedUrl) {
      return Promise.resolve(cachedUrl);
    }

    const existing = this.inFlightRequests.get(cacheKey);
    if (existing) {
      return existing;
    }

    const promise = (async () => {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          style,
          voiceName: 'Kore',
          cacheOnly,
        }),
      });

      if (response.status === 204 || response.status === 429) {
        if (response.status === 429) {
          this.quotaCooldownUntil = Date.now() + 5 * 60 * 1000;
        }
        throw new QuotaExhaustedError();
      }

      if (!response.ok) {
        let errorMessage = 'La lecture vocale est momentanément indisponible.';
        try {
          const errorBody = await response.json();
          if (errorBody?.code === 'QUOTA_EXHAUSTED') {
            this.quotaCooldownUntil = Date.now() + 5 * 60 * 1000;
            throw new QuotaExhaustedError(errorBody?.error);
          }
          if (typeof errorBody?.error === 'string' && errorBody.error.trim()) {
            errorMessage = errorBody.error.trim();
          }
        } catch (parseErr) {
          if (parseErr instanceof QuotaExhaustedError) throw parseErr;
        }
        throw new Error(errorMessage);
      }

      const audioBlob = await response.blob();
      const objectUrl = URL.createObjectURL(audioBlob);
      this.setCachedUrl(cacheKey, objectUrl);
      return objectUrl;
    })().finally(() => {
      this.inFlightRequests.delete(cacheKey);
    });

    this.inFlightRequests.set(cacheKey, promise);
    return promise;
  }

  preload(payload: EpisodeVoicePayload, options?: { cacheOnly?: boolean }) {
    const cacheOnly = Boolean(options?.cacheOnly);
    if (!this.isSupported() || typeof fetch === 'undefined') return;
    if (!cacheOnly && Date.now() < this.quotaCooldownUntil) return;

    const resolved = this.resolveRequest(payload);
    if (!resolved) return;

    if (this.urlCache.has(resolved.cacheKey) || this.inFlightRequests.has(resolved.cacheKey)) {
      return;
    }

    this.fetchAndCacheAudio(resolved.text, resolved.style, resolved.cacheKey, cacheOnly).catch(() => {
      // Préchargement silencieux : bascule transparente gérée au clic sur Lecture
    });
  }

  private pickBestFrenchVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const frVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('fr'));
    if (frVoices.length === 0) return null;

    const preferredKeywords = ['google', 'natural', 'neural', 'thomas', 'amélie', 'amelie', 'denise', 'hortense', 'audrey', 'virginie', 'julie', 'céline'];
    for (const kw of preferredKeywords) {
      const match = frVoices.find((v) => v.name.toLowerCase().includes(kw));
      if (match) return match;
    }
    return frVoices.find((v) => v.lang.toLowerCase() === 'fr-fr') || frVoices[0];
  }

  private speakWithBrowserVoice(text: string, activeSession: number, payload: EpisodeVoicePayload): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.96;
      utterance.pitch = 1.0;

      const preferredVoice = this.pickBestFrenchVoice();
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      this.activeUtterance = utterance;
      let didNotifyStart = false;

      const notifyStart = () => {
        if (!didNotifyStart && this.sessionId === activeSession) {
          didNotifyStart = true;
          payload.onStart?.();
        }
      };

      utterance.onstart = notifyStart;
      utterance.onend = () => {
        if (this.sessionId !== activeSession) return;
        this.activeUtterance = null;
        payload.onEnd?.();
      };
      utterance.onerror = () => {
        if (this.sessionId !== activeSession) return;
        this.activeUtterance = null;
        payload.onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
      // Certaines plateformes (Safari/iOS) retardent onstart : confirmer le démarrage immédiatement
      window.setTimeout(notifyStart, 80);
      return true;
    } catch {
      return false;
    }
  }

  private cleanupPlayback() {
    if (this.activeStreamReader) {
      try {
        this.activeStreamReader.cancel().catch(() => {});
      } catch {
        // ignore cancel errors
      }
      this.activeStreamReader = null;
    }

    if (this.activeSources.length > 0) {
      for (const src of this.activeSources) {
        try {
          src.onended = null;
          src.stop();
          src.disconnect();
        } catch {
          // ignore node teardown errors
        }
      }
      this.activeSources = [];
    }

    if (this.activeAudio) {
      try {
        this.activeAudio.onplay = null;
        this.activeAudio.onended = null;
        this.activeAudio.onerror = null;
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch {
        // ignore audio teardown errors
      }
      this.activeAudio = null;
    }

    if (this.activeUtterance && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        this.activeUtterance.onstart = null;
        this.activeUtterance.onend = null;
        this.activeUtterance.onerror = null;
        window.speechSynthesis.cancel();
      } catch {
        // ignore speechSynthesis cancel errors
      }
      this.activeUtterance = null;
    }
  }

  stop() {
    this.sessionId += 1;
    this.cleanupPlayback();
  }

  private async playAudioUrl(audioUrl: string, activeSession: number, payload: EpisodeVoicePayload) {
    const audio = new Audio(audioUrl);
    audio.preload = 'auto';
    this.activeAudio = audio;

    let didNotifyStart = false;
    const notifyStart = () => {
      if (!didNotifyStart && this.sessionId === activeSession) {
        didNotifyStart = true;
        payload.onStart?.();
      }
    };

    audio.onplay = notifyStart;

    audio.onended = () => {
      if (this.sessionId !== activeSession) return;
      this.cleanupPlayback();
      payload.onEnd?.();
    };

    audio.onerror = () => {
      if (this.sessionId !== activeSession) return;
      this.cleanupPlayback();
      payload.onError?.('Impossible de lire le fichier audio.');
    };

    await audio.play();
    notifyStart();
  }

  private async playStreamingPcm(
    response: Response,
    cacheKey: string,
    activeSession: number,
    payload: EpisodeVoicePayload,
    ctx: AudioContext
  ): Promise<boolean> {
    if (!response.body) return false;

    const reader = response.body.getReader();
    this.activeStreamReader = reader;

    const collectedChunks: Uint8Array[] = [];
    let carryByte: number | null = null;
    let nextStartTime = ctx.currentTime + 0.03;
    let didNotifyStart = false;
    let lastSource: AudioBufferSourceNode | null = null;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (this.sessionId !== activeSession) {
          return true;
        }
        if (done) break;
        if (!value || value.byteLength === 0) continue;

        collectedChunks.push(value);

        // Aligner sur un nombre pair d'octets (PCM 16 bits = 2 octets/échantillon)
        let bytesToDecode: Uint8Array;
        if (carryByte !== null) {
          bytesToDecode = new Uint8Array(value.byteLength + 1);
          bytesToDecode[0] = carryByte;
          bytesToDecode.set(value, 1);
          carryByte = null;
        } else {
          bytesToDecode = value;
        }

        if (bytesToDecode.byteLength % 2 !== 0) {
          carryByte = bytesToDecode[bytesToDecode.byteLength - 1];
          bytesToDecode = bytesToDecode.subarray(0, bytesToDecode.byteLength - 1);
        }

        const sampleCount = bytesToDecode.byteLength / 2;
        if (sampleCount === 0) continue;

        const float32 = new Float32Array(sampleCount);
        const view = new DataView(bytesToDecode.buffer, bytesToDecode.byteOffset, bytesToDecode.byteLength);
        for (let i = 0; i < sampleCount; i++) {
          float32[i] = view.getInt16(i * 2, true) / 32768;
        }

        const audioBuffer = ctx.createBuffer(1, sampleCount, 24000);
        audioBuffer.copyToChannel(float32, 0);

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);

        const startAt = Math.max(ctx.currentTime + 0.015, nextStartTime);
        source.start(startAt);
        nextStartTime = startAt + audioBuffer.duration;

        this.activeSources.push(source);
        lastSource = source;

        if (!didNotifyStart && this.sessionId === activeSession) {
          didNotifyStart = true;
          payload.onStart?.();
        }
      }

      if (this.sessionId !== activeSession) {
        return true;
      }

      if (collectedChunks.length > 0) {
        const wavBlob = buildWavBlobFromPcmChunks(collectedChunks);
        const wavUrl = URL.createObjectURL(wavBlob);
        this.setCachedUrl(cacheKey, wavUrl);
      }

      if (lastSource) {
        const tailSource = lastSource;
        tailSource.onended = () => {
          if (this.sessionId !== activeSession) return;
          this.cleanupPlayback();
          payload.onEnd?.();
        };
      } else {
        this.cleanupPlayback();
        payload.onEnd?.();
      }

      return didNotifyStart;
    } finally {
      if (this.activeStreamReader === reader) {
        this.activeStreamReader = null;
      }
    }
  }

  async speak(payload: EpisodeVoicePayload) {
    this.stop();

    if (!this.isSupported()) {
      payload.onError?.("La lecture audio n'est pas disponible sur cet appareil.");
      return;
    }

    const resolved = this.resolveRequest(payload);
    if (!resolved) {
      payload.onEnd?.();
      return;
    }

    const activeSession = this.sessionId;
    // Déverrouiller AudioContext de façon synchrone dans le geste utilisateur
    const unlockedCtx = this.getOrUnlockAudioContext();

    try {
      const cachedUrl = this.urlCache.get(resolved.cacheKey);
      if (cachedUrl) {
        await this.playAudioUrl(cachedUrl, activeSession, payload);
        return;
      }

      payload.onLoadStart?.();

      // Si un préchargement /api/tts est déjà en vol, le réutiliser directement
      const inFlight = this.inFlightRequests.get(resolved.cacheKey);
      if (inFlight) {
        const url = await inFlight;
        if (this.sessionId !== activeSession) return;
        await this.playAudioUrl(url, activeSession, payload);
        return;
      }

      const cacheOnly = Date.now() < this.quotaCooldownUntil;
      const response = await fetch('/api/tts-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: resolved.text,
          style: resolved.style,
          voiceName: 'Kore',
          cacheOnly,
        }),
      });

      if (this.sessionId !== activeSession) return;

      if (response.status === 204 || response.status === 429) {
        if (response.status === 429) {
          this.quotaCooldownUntil = Date.now() + 5 * 60 * 1000;
        }
        if (this.speakWithBrowserVoice(resolved.text, activeSession, payload)) {
          return;
        }
        throw new Error('La lecture vocale est momentanément indisponible.');
      }

      if (!response.ok) {
        if (this.speakWithBrowserVoice(resolved.text, activeSession, payload)) {
          return;
        }
        throw new Error('La lecture vocale est momentanément indisponible.');
      }

      const format = response.headers.get('X-TTS-Format');
      if (format === 'pcm-24000' && unlockedCtx && response.body) {
        const started = await this.playStreamingPcm(
          response,
          resolved.cacheKey,
          activeSession,
          payload,
          unlockedCtx
        );
        if (started || this.sessionId !== activeSession) return;
      }

      const audioBlob = await response.blob();
      if (this.sessionId !== activeSession) return;

      const audioUrl = URL.createObjectURL(audioBlob);
      this.setCachedUrl(resolved.cacheKey, audioUrl);
      await this.playAudioUrl(audioUrl, activeSession, payload);
    } catch (err: any) {
      if (this.sessionId !== activeSession) {
        return;
      }

      if (err?.name !== 'NotAllowedError' && this.speakWithBrowserVoice(resolved.text, activeSession, payload)) {
        return;
      }

      this.cleanupPlayback();
      payload.onError?.(
        err?.name === 'NotAllowedError'
          ? 'Touchez à nouveau pour autoriser la lecture audio.'
          : 'Impossible de lancer la lecture vocale.'
      );
    }
  }
}

export const episodeVoiceReader = new EpisodeVoiceReader();
