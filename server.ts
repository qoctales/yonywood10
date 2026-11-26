import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { register as registerTsx } from 'tsx/esm/api';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Parse CLI arguments (--port 3000 --host 0.0.0.0) passed by AI Studio runner
const args = process.argv.slice(2);
function resolvePort(): number {
  const portIdx = args.indexOf('--port');
  if (portIdx !== -1 && args[portIdx + 1]) {
    const parsed = parseInt(args[portIdx + 1], 10);
    if (!isNaN(parsed) && parsed !== 8080) return parsed;
  }
  // Port 8080 is reserved for nginx reverse proxy in AI Studio.
  // The app dev server must always listen on port 3000.
  if (process.env.PORT && process.env.PORT !== '8080') {
    const parsed = parseInt(process.env.PORT, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return 3000;
}

function resolveHost(): string {
  const hostIdx = args.indexOf('--host');
  if (hostIdx !== -1 && args[hostIdx + 1]) {
    return args[hostIdx + 1];
  }
  return process.env.HOST || '0.0.0.0';
}

const PORT = resolvePort();
const HOST = resolveHost();
const isProd = process.env.NODE_ENV === 'production';

// In-memory data store for live collaboration and state
const inMemoryPledges: any[] = [];
const inMemoryMessages: any[] = [];
const inMemoryThreads: any[] = [];
const inMemoryUsers: Map<string, any> = new Map([
  ['qoctales@gmail.com', {
    id: 'usr-admin-romeo',
    email: 'qoctales@gmail.com',
    name: 'Romeo Nonvide',
    firstName: 'Romeo',
    lastName: 'Nonvide',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Fondateur & Directeur éditorial de YonyWood.',
    territory: 'Cotonou & Paris',
    country: 'Bénin',
    messagePermission: 'all',
    pushNewMessage: true,
    messagePreview: true,
    language: 'fr',
    sharesCount: 125,
    createdAt: '2026-01-15'
  }]
]);

// Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const connectedUsers = new Map<string, string>();

io.on('connection', (socket) => {
  socket.on('authenticate', (token: string) => {
    connectedUsers.set(token, socket.id);
    socket.emit('authenticated', { token });
  });

  socket.on('join_thread', (threadId: string) => {
    socket.join(`thread:${threadId}`);
  });

  socket.on('leave_thread', (threadId: string) => {
    socket.leave(`thread:${threadId}`);
  });

  socket.on('typing', (data: { threadId: string; isTyping: boolean; userId?: string }) => {
    socket.to(`thread:${data.threadId}`).emit('user_typing', data);
  });

  socket.on('message', (msg: any) => {
    if (msg?.threadId) {
      socket.to(`thread:${msg.threadId}`).emit('message', msg);
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, sId] of connectedUsers.entries()) {
      if (sId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// =============================================
// API ROUTES
// =============================================

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Yonywood API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Server-side Text-to-Speech via Gemini TTS (avec cache mémoire + disque et streaming PCM)
const ttsAudioCache = new Map<string, Buffer>();
const ttsInFlight = new Map<string, Promise<Buffer>>();
const ttsModelCooldownUntil = new Map<string, number>();
const MAX_TTS_CACHE_ITEMS = 160;
const TTS_CACHE_DIR = path.resolve(__dirname, '.cache', 'tts');
const TTS_MODELS = ['gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts'] as const;

try {
  fs.mkdirSync(TTS_CACHE_DIR, { recursive: true });
} catch {
  // ignore cache directory initialization errors
}

function getTtsDiskPath(key: string): string {
  const hash = crypto.createHash('sha256').update(key).digest('hex');
  return path.join(TTS_CACHE_DIR, `${hash}.wav`);
}

function getCachedTtsWav(key: string): Buffer | null {
  const mem = ttsAudioCache.get(key);
  if (mem) return mem;

  try {
    const filePath = getTtsDiskPath(key);
    if (fs.existsSync(filePath)) {
      const diskBuf = fs.readFileSync(filePath);
      if (diskBuf.length > 44) {
        if (ttsAudioCache.size >= MAX_TTS_CACHE_ITEMS) {
          const oldestKey = ttsAudioCache.keys().next().value;
          if (oldestKey) ttsAudioCache.delete(oldestKey);
        }
        ttsAudioCache.set(key, diskBuf);
        return diskBuf;
      }
    }
  } catch {
    // ignore disk cache read errors
  }
  return null;
}

function setTtsCache(key: string, wavBuffer: Buffer) {
  if (wavBuffer.length <= 44) return;
  if (ttsAudioCache.size >= MAX_TTS_CACHE_ITEMS) {
    const oldestKey = ttsAudioCache.keys().next().value;
    if (oldestKey) ttsAudioCache.delete(oldestKey);
  }
  ttsAudioCache.set(key, wavBuffer);
  fs.promises.writeFile(getTtsDiskPath(key), wavBuffer).catch(() => {
    // ignore disk cache write errors
  });
}

function buildWavHeader(pcmDataLength: number, sampleRate = 24000, channels = 1, bitsPerSample = 16): Buffer {
  const header = Buffer.alloc(44);
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmDataLength, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size (PCM)
  header.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcmDataLength, 40);
  return header;
}

const PCM_SILENCE_THRESHOLD = 180;
const PCM_LEAD_IN_SAMPLES = 240; // 10 ms à 24 kHz
const PCM_TAIL_SAMPLES = 2880; // 120 ms à 24 kHz

function trimSilenceFromPcm(pcm: Buffer): Buffer {
  const totalSamples = Math.floor(pcm.length / 2);
  if (totalSamples <= PCM_LEAD_IN_SAMPLES + 120) return pcm;

  let firstActive = -1;
  for (let i = 0; i < totalSamples; i++) {
    if (Math.abs(pcm.readInt16LE(i * 2)) >= PCM_SILENCE_THRESHOLD) {
      firstActive = i;
      break;
    }
  }
  if (firstActive === -1) return pcm;

  let lastActive = firstActive;
  for (let i = totalSamples - 1; i >= firstActive; i--) {
    if (Math.abs(pcm.readInt16LE(i * 2)) >= PCM_SILENCE_THRESHOLD) {
      lastActive = i;
      break;
    }
  }

  const startSample = Math.max(0, firstActive - PCM_LEAD_IN_SAMPLES);
  const endSample = Math.min(totalSamples, lastActive + PCM_TAIL_SAMPLES);
  if (startSample === 0 && endSample === totalSamples) return pcm;

  const trimmed = Buffer.from(pcm.subarray(startSample * 2, endSample * 2));
  const trimmedSamples = Math.floor(trimmed.length / 2);

  // Micro fondu d'entrée (6 ms) pour éviter tout clic
  const fadeInSamples = Math.min(144, trimmedSamples);
  for (let i = 0; i < fadeInSamples; i++) {
    const sample = trimmed.readInt16LE(i * 2);
    trimmed.writeInt16LE(Math.round(sample * (i / fadeInSamples)), i * 2);
  }

  return trimmed;
}

function findWavDataOffset(wavBuffer: Buffer): { dataOffset: number; dataSize: number } | null {
  if (wavBuffer.length < 44) return null;
  if (wavBuffer.toString('ascii', 0, 4) !== 'RIFF' || wavBuffer.toString('ascii', 8, 12) !== 'WAVE') {
    return null;
  }
  let offset = 12;
  while (offset + 8 <= wavBuffer.length) {
    const chunkId = wavBuffer.toString('ascii', offset, offset + 4);
    const chunkSize = wavBuffer.readUInt32LE(offset + 4);
    if (chunkId === 'data') {
      return {
        dataOffset: offset + 8,
        dataSize: Math.min(chunkSize, wavBuffer.length - (offset + 8)),
      };
    }
    offset += 8 + chunkSize + (chunkSize % 2);
  }
  return null;
}

function trimSilenceFromWav(wavBuffer: Buffer): Buffer {
  const info = findWavDataOffset(wavBuffer);
  if (!info || info.dataSize <= 0) return wavBuffer;

  const pcm = wavBuffer.subarray(info.dataOffset, info.dataOffset + info.dataSize);
  const trimmedPcm = trimSilenceFromPcm(pcm);
  if (trimmedPcm.length === pcm.length) return wavBuffer;

  const header = Buffer.from(wavBuffer.subarray(0, 44));
  header.writeUInt32LE(36 + trimmedPcm.length, 4);
  header.write('data', 36);
  header.writeUInt32LE(trimmedPcm.length, 40);
  return Buffer.concat([header, trimmedPcm]);
}

function isQuotaOrRateLimitError(err: any): boolean {
  const status = err?.status || err?.statusCode;
  const raw = typeof err?.message === 'string' ? err.message : '';
  return status === 429 || raw.includes('RESOURCE_EXHAUSTED') || raw.includes('Quota exceeded');
}

function markModelCooldown(model: string, err: any) {
  const raw = typeof err?.message === 'string' ? err.message : '';
  const isDailyQuota = raw.includes('PerDay') || raw.includes('free_tier_requests');
  const cooldownMs = isDailyQuota ? 30 * 60 * 1000 : 60 * 1000;
  ttsModelCooldownUntil.set(model, Date.now() + cooldownMs);
}

function getAvailableTtsModels(): string[] {
  const now = Date.now();
  return TTS_MODELS.filter((model) => (ttsModelCooldownUntil.get(model) ?? 0) <= now);
}

function createTtsClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error('Clé API Gemini absente côté serveur.');
    (err as any).statusCode = 503;
    throw err;
  }

  return new GoogleGenAI({
    apiKey,
    apiVersion: 'v1beta',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function prepareTtsParams(body: any): { spokenText: string; style: string; voiceName: string; cacheKey: string } | { error: string } {
  const rawText = typeof body?.text === 'string' ? body.text.trim() : '';
  if (!rawText) {
    return { error: 'Texte requis pour la lecture vocale.' };
  }
  if (rawText.length > 2500) {
    return { error: 'Le texte dépasse la longueur maximale autorisée.' };
  }

  const spokenText = rawText.replace(/\bvodun\b/gi, 'Vodoun');
  const baseStyle =
    typeof body?.style === 'string' && body.style.trim()
      ? body.style.trim()
      : 'Voix féminine française très douce, chaleureuse, naturelle, posée et expressive de narratrice documentaire.';
  const style =
    /\b(vodoun|rays)\b/i.test(spokenText) && !baseStyle.includes('Days')
      ? `${baseStyle} Prononcer « Vodoun » avec le son « ou » et prononcer le mot anglais « Rays » en anglais comme « Days » (/reɪz/).`
      : baseStyle;
  const voiceName =
    typeof body?.voiceName === 'string' && body.voiceName.trim()
      ? body.voiceName.trim()
      : 'Kore';

  const cacheKey = `${voiceName}::${style}::${spokenText}`;
  return { spokenText, style, voiceName, cacheKey };
}

async function synthesizeSpeechWav(text: string, style: string, voiceName: string): Promise<Buffer> {
  const ai = createTtsClient();
  const modelsToTry = getAvailableTtsModels();

  if (modelsToTry.length === 0) {
    const err = new Error('Quota vocal Gemini temporairement épuisé.');
    (err as any).statusCode = 429;
    throw err;
  }

  let lastError: any;
  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text,
                speechMetadata: {
                  style,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error('Réponse audio vide reçue du service TTS.');
      }

      return trimSilenceFromWav(Buffer.from(base64Audio, 'base64'));
    } catch (err: any) {
      lastError = err;
      if (isQuotaOrRateLimitError(err)) {
        markModelCooldown(model, err);
        continue;
      }
      throw err;
    }
  }

  throw lastError;
}

function formatTtsErrorMessage(err: any, status: number): string {
  const raw = typeof err?.message === 'string' ? err.message : '';
  if (status === 403 || status === 401 || raw.includes('API_KEY_INVALID') || raw.includes('PERMISSION_DENIED')) {
    return 'Service vocal indisponible : vérifiez la configuration de la clé API.';
  }
  if (status === 429 || raw.includes('RESOURCE_EXHAUSTED') || raw.includes('Quota')) {
    return 'Quota vocal Gemini temporairement saturé — bascule automatique active.';
  }
  if (raw.startsWith('{')) {
    try {
      const parsed = JSON.parse(raw);
      const nestedMsg = parsed?.error?.message;
      if (typeof nestedMsg === 'string' && nestedMsg.trim()) {
        return `Erreur lecture vocale : ${nestedMsg.trim().split('\n')[0]}`;
      }
    } catch {
      // ignore JSON parse errors
    }
    return 'La lecture vocale est momentanément indisponible.';
  }
  return raw || 'Erreur lors de la synthèse vocale.';
}

app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const prepared = prepareTtsParams(req.body);
    if ('error' in prepared) {
      res.status(400).json({ error: prepared.error });
      return;
    }

    const { spokenText, style, voiceName, cacheKey } = prepared;
    const cached = getCachedTtsWav(cacheKey);
    if (cached) {
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(cached);
      return;
    }

    if (req.body?.cacheOnly) {
      res.status(204).end();
      return;
    }

    let pending = ttsInFlight.get(cacheKey);
    if (!pending) {
      pending = synthesizeSpeechWav(spokenText, style, voiceName)
        .then((wavBuffer) => {
          setTtsCache(cacheKey, wavBuffer);
          return wavBuffer;
        })
        .finally(() => {
          ttsInFlight.delete(cacheKey);
        });
      ttsInFlight.set(cacheKey, pending);
    }

    const wavBuffer = await pending;
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(wavBuffer);
  } catch (err: any) {
    const isQuota = isQuotaOrRateLimitError(err);
    const status = isQuota
      ? 429
      : typeof err?.status === 'number'
        ? err.status
        : typeof err?.statusCode === 'number'
          ? err.statusCode
          : 500;
    const httpStatus = status >= 400 && status < 600 ? status : 500;
    if (isQuota) {
      console.warn('[YonyWood TTS Quota]: Bascule client recommandée (429 RESOURCE_EXHAUSTED).');
    } else {
      console.warn('[YonyWood TTS]:', formatTtsErrorMessage(err, httpStatus));
    }
    res.status(httpStatus).json({
      error: formatTtsErrorMessage(err, httpStatus),
      code: isQuota ? 'QUOTA_EXHAUSTED' : 'TTS_ERROR',
    });
  }
});

app.post('/api/tts-stream', async (req: Request, res: Response) => {
  try {
    const prepared = prepareTtsParams(req.body);
    if ('error' in prepared) {
      res.status(400).json({ error: prepared.error });
      return;
    }

    const { spokenText, style, voiceName, cacheKey } = prepared;
    const cached = getCachedTtsWav(cacheKey);
    if (cached) {
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('X-TTS-Format', 'wav');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(cached);
      return;
    }

    if (req.body?.cacheOnly) {
      res.status(204).end();
      return;
    }

    const existingPending = ttsInFlight.get(cacheKey);
    if (existingPending) {
      const wavBuffer = await existingPending;
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('X-TTS-Format', 'wav');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(wavBuffer);
      return;
    }

    const ai = createTtsClient();
    const modelsToTry = getAvailableTtsModels();
    if (modelsToTry.length === 0) {
      res.status(429).json({
        error: 'Quota vocal Gemini temporairement saturé — bascule automatique active.',
        code: 'QUOTA_EXHAUSTED',
      });
      return;
    }

    let lastError: any = null;
    for (const model of modelsToTry) {
      const pcmChunks: Buffer[] = [];
      let headersSent = false;
      let abortedByClient = false;
      let speechStarted = false;

      const onClose = () => {
        abortedByClient = true;
      };
      req.on('close', onClose);

      try {
        const responseStream = await ai.models.generateContentStream({
          model,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: spokenText,
                  speechMetadata: {
                    style,
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName },
              },
            },
          },
        });

        for await (const chunk of responseStream) {
          if (abortedByClient) break;
          const base64Data = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (!base64Data) continue;

          let pcm = Buffer.from(base64Data, 'base64');
          if (pcm.length === 0) continue;

          if (!speechStarted) {
            const sampleCount = Math.floor(pcm.length / 2);
            let firstActive = -1;
            for (let i = 0; i < sampleCount; i++) {
              if (Math.abs(pcm.readInt16LE(i * 2)) >= PCM_SILENCE_THRESHOLD) {
                firstActive = i;
                break;
              }
            }
            if (firstActive === -1) {
              continue;
            }
            speechStarted = true;
            const startByte = Math.max(0, firstActive - PCM_LEAD_IN_SAMPLES) * 2;
            if (startByte > 0) {
              pcm = Buffer.from(pcm.subarray(startByte));
            }
          }

          if (pcm.length === 0) continue;

          if (!headersSent) {
            headersSent = true;
            res.status(200);
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('X-TTS-Format', 'pcm-24000');
            res.setHeader('Cache-Control', 'no-store');
          }

          pcmChunks.push(pcm);
          res.write(pcm);
        }

        req.off('close', onClose);

        if (!headersSent) {
          throw new Error('Flux audio vide reçu du service TTS.');
        }

        if (!abortedByClient && pcmChunks.length > 0) {
          const pcmAll = trimSilenceFromPcm(Buffer.concat(pcmChunks));
          const wavBuffer = Buffer.concat([buildWavHeader(pcmAll.length), pcmAll]);
          setTtsCache(cacheKey, wavBuffer);
        }

        res.end();
        return;
      } catch (err: any) {
        req.off('close', onClose);
        lastError = err;
        if (headersSent) {
          res.end();
          return;
        }
        if (isQuotaOrRateLimitError(err)) {
          markModelCooldown(model, err);
          continue;
        }
        throw err;
      }
    }

    throw lastError;
  } catch (err: any) {
    const isQuota = isQuotaOrRateLimitError(err);
    const status = isQuota
      ? 429
      : typeof err?.status === 'number'
        ? err.status
        : typeof err?.statusCode === 'number'
          ? err.statusCode
          : 500;
    const httpStatus = status >= 400 && status < 600 ? status : 500;
    if (isQuota) {
      console.warn('[YonyWood TTS Stream Quota]: Bascule client activée (429 RESOURCE_EXHAUSTED).');
    } else {
      console.warn('[YonyWood TTS Stream]:', formatTtsErrorMessage(err, httpStatus));
    }
    if (!res.headersSent) {
      res.status(httpStatus).json({
        error: formatTtsErrorMessage(err, httpStatus),
        code: isQuota ? 'QUOTA_EXHAUSTED' : 'TTS_ERROR',
      });
    } else {
      res.end();
    }
  }
});

// Series
app.get('/api/series', async (_req: Request, res: Response, next) => {
  try {
    await ensureDataLoaded();
    res.json(DOCUMENTARIES);
  } catch (err) {
    next(err);
  }
});

app.get('/api/series/:id', async (req: Request, res: Response, next) => {
  try {
    await ensureDataLoaded();
    const { id } = req.params;
    const canonicalId = resolveCanonicalSeriesIdFn(id) || id;
    const doc = DOCUMENTARIES.find((d) => d.id === canonicalId || d.slug === canonicalId);
    if (!doc) {
      res.status(404).json({ error: 'Série non trouvée' });
      return;
    }
    const seriesProtagonists = PROTAGONISTS.filter(
      (p) => (resolveCanonicalSeriesIdFn(p.documentaryId) || p.documentaryId) === doc.id
    );
    const seriesDuos = DUOS.filter(
      (d) => (resolveCanonicalSeriesIdFn(d.documentaryId) || d.documentaryId) === doc.id
    );
    res.json({
      ...doc,
      protagonists: seriesProtagonists,
      duos: seriesDuos,
    });
  } catch (err) {
    next(err);
  }
});

// Duos
app.get('/api/duos', async (req: Request, res: Response, next) => {
  try {
    await ensureDataLoaded();
    const { series } = req.query;
    let result = DUOS;
    if (series && typeof series === 'string') {
      const filter = series
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => resolveCanonicalSeriesIdFn(s) || s);
      if (filter.length > 0) {
        result = DUOS.filter((d) => {
          const canonicalDocId = resolveCanonicalSeriesIdFn(d.documentaryId) || d.documentaryId;
          return filter.includes(canonicalDocId) || filter.includes(d.documentaryId);
        });
      }
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

app.get('/api/duos/:id', async (req: Request, res: Response, next) => {
  try {
    await ensureDataLoaded();
    const { id } = req.params;
    const duo = DUOS.find((d) => d.id === id || d.slug === id);
    if (!duo) {
      res.status(404).json({ error: 'Duo non trouvé' });
      return;
    }
    res.json(duo);
  } catch (err) {
    next(err);
  }
});

// Explorer (Astrolabe)
app.get('/api/explorer/categories', async (_req: Request, res: Response, next) => {
  try {
    await ensureDataLoaded();
    res.json(EXPLORER_CATEGORIES);
  } catch (err) {
    next(err);
  }
});

// Redirection permanente /memoires -> /sagesses
app.get('/memoires', (_req: Request, res: Response) => {
  res.redirect(301, '/sagesses');
});

// Redirection permanente /entreprises -> /focus
app.get(['/entreprises', '/entreprise', '/lumieres'], (_req: Request, res: Response) => {
  res.redirect(301, '/focus');
});

app.get('/api/explorer/topics/:category', async (req: Request, res: Response, next) => {
  try {
    await ensureDataLoaded();
    let { category } = req.params;
    if (category === 'memoires') {
      category = 'sagesses';
    }
    const topics = (EXPLORER_CATALOG as Record<string, any>)[category] || [];
    res.json(topics);
  } catch (err) {
    next(err);
  }
});

// Coproduction
app.post('/api/coproduction/pledge', (req: Request, res: Response) => {
  const { seriesId, sharesCount, amount } = req.body;
  const pledge = {
    id: `pledge-${Date.now()}`,
    seriesId,
    sharesCount: Number(sharesCount) || 1,
    amount: Number(amount) || 10,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
  };
  inMemoryPledges.push(pledge);
  res.status(201).json({ message: 'Coproduction confirmée avec succès', pledge });
});

app.get('/api/coproduction/portfolio', (_req: Request, res: Response) => {
  const totalShares = inMemoryPledges.reduce((sum, p) => sum + p.sharesCount, 0);
  const totalAmount = inMemoryPledges.reduce((sum, p) => sum + p.amount, 0);
  res.json({
    pledges: inMemoryPledges,
    summary: {
      totalShares,
      totalAmount,
      seriesCount: new Set(inMemoryPledges.map((p) => p.seriesId)).size,
    },
  });
});

app.get('/api/coproduction/simulation', async (req: Request, res: Response, next) => {
  try {
    await ensureDataLoaded();
    const { seriesId, sharesCount = '10' } = req.query;
    const shares = parseInt(sharesCount as string, 10) || 10;
    const PRICE_PER_SHARE = 10;
    const investedAmount = shares * PRICE_PER_SHARE;

    const scenarios = [
      {
        label: 'Scénario conservateur',
        viewerCount: 100000,
        revenuePerViewer: 0.05,
        projectedRevenue: 5000,
        yourShare: (shares / 1000) * 5000,
        roi: (((shares / 1000) * 5000 - investedAmount) / investedAmount) * 100,
      },
      {
        label: 'Scénario modéré',
        viewerCount: 500000,
        revenuePerViewer: 0.08,
        projectedRevenue: 40000,
        yourShare: (shares / 1000) * 40000,
        roi: (((shares / 1000) * 40000 - investedAmount) / investedAmount) * 100,
      },
      {
        label: 'Scénario optimiste',
        viewerCount: 2000000,
        revenuePerViewer: 0.12,
        projectedRevenue: 240000,
        yourShare: (shares / 1000) * 240000,
        roi: (((shares / 1000) * 240000 - investedAmount) / investedAmount) * 100,
      },
    ];

    const resolvedSeriesId =
      typeof seriesId === 'string' ? resolveCanonicalSeriesIdFn(seriesId) || seriesId : undefined;
    const series = resolvedSeriesId ? DOCUMENTARIES.find((d) => d.id === resolvedSeriesId) : undefined;

    res.json({
      sharesCount: shares,
      pricePerShare: PRICE_PER_SHARE,
      investedAmount,
      series: series ? { id: series.id, title: series.title } : null,
      scenarios,
    });
  } catch (err) {
    next(err);
  }
});

// Messaging
const handleGetThreads = (_req: Request, res: Response) => {
  res.json(inMemoryThreads);
};
const handleGetInvitations = (_req: Request, res: Response) => {
  res.json([]);
};
const handlePostMessage = (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;
  const message = {
    id: `msg-${Date.now()}`,
    threadId: id,
    content: text,
    createdAt: new Date().toISOString(),
  };
  inMemoryMessages.push(message);
  io.to(`thread:${id}`).emit('message', message);
  res.status(201).json(message);
};

app.get(['/api/messaging/threads', '/api/messages/threads'], handleGetThreads);
app.get(['/api/messaging/invitations', '/api/messages/invitations'], handleGetInvitations);
app.post(['/api/messaging/threads/:id/messages', '/api/messages/threads/:id/messages'], handlePostMessage);

app.post(['/api/messaging/invitations/:id/accept', '/api/messages/invitations/:id/accept'], (req: Request, res: Response) => {
  res.json({ success: true, invitationId: req.params.id, status: 'accepted' });
});

app.post(['/api/messaging/invitations/:id/decline', '/api/messages/invitations/:id/decline'], (req: Request, res: Response) => {
  res.json({ success: true, invitationId: req.params.id, status: 'declined' });
});

// Authentication & User preferences
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, firstName, lastName } = req.body || {};
  if (!email) {
    res.status(400).json({ error: 'Email requis' });
    return;
  }
  const cleanEmail = email.trim().toLowerCase();
  const existing = inMemoryUsers.get(cleanEmail);
  if (existing) {
    res.json({
      message: 'Compte existant',
      token: `demo-token-${existing.id}`,
      user: existing,
    });
    return;
  }
  const newUser = {
    id: `usr-${Date.now()}`,
    email: cleanEmail,
    name: `${firstName || ''} ${lastName || ''}`.trim() || cleanEmail.split('@')[0],
    firstName: firstName || cleanEmail.split('@')[0],
    lastName: lastName || '',
    role: cleanEmail === 'qoctales@gmail.com' ? 'ADMIN' : 'USER',
    sharesCount: 10,
    messagePermission: 'all',
    pushNewMessage: true,
    messagePreview: true,
    language: 'fr',
    createdAt: new Date().toISOString().split('T')[0],
  };
  inMemoryUsers.set(cleanEmail, newUser);
  res.status(201).json({
    message: 'Compte créé avec succès',
    token: `demo-token-${newUser.id}`,
    user: newUser,
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body || {};
  if (!email) {
    res.status(400).json({ error: 'Email requis' });
    return;
  }
  const cleanEmail = email.trim().toLowerCase();
  let user = inMemoryUsers.get(cleanEmail);
  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      firstName: cleanEmail.split('@')[0],
      role: cleanEmail === 'qoctales@gmail.com' ? 'ADMIN' : 'USER',
      sharesCount: 10,
      createdAt: new Date().toISOString().split('T')[0],
    };
    inMemoryUsers.set(cleanEmail, user);
  }
  res.json({
    message: 'Connexion réussie',
    token: `demo-token-${user.id}`,
    user,
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.json(inMemoryUsers.get('qoctales@gmail.com') || null);
    return;
  }
  for (const user of inMemoryUsers.values()) {
    if (authHeader.includes(user.id)) {
      res.json(user);
      return;
    }
  }
  res.json(inMemoryUsers.get('qoctales@gmail.com') || null);
});

app.put('/api/auth/preferences', (req: Request, res: Response) => {
  res.json({ success: true, preferences: req.body });
});

let DOCUMENTARIES: any[] = [];
let DUOS: any[] = [];
let PROTAGONISTS: any[] = [];
let EXPLORER_CATEGORIES: any[] = [];
let EXPLORER_CATALOG: Record<string, any> = {};
let resolveCanonicalSeriesIdFn: (rawId?: string | null) => string | null = (id) => id ?? null;

const TRAILER_VOICE_NAME = 'Algenib';
const TRAILER_STYLE =
  "Voix d'homme noire grave, rauque, ronde et profondément chaleureuse, avec une forte présence dans les graves et un timbre humain très naturel, posé et authentique, comme un conteur intime qui parle près du micro avec calme et intensité, sans ton robotique ni emphase artificielle. Prononcer « Vodoun » avec le son « ou » et prononcer le mot anglais « Rays » en anglais comme « Days » (/reɪz/).";

function cleanSpokenSegmentServer(text?: string): string {
  return (text || '')
    .trim()
    .replace(/[«»"]/g, '')
    .replace(/\bvodun\b/gi, 'Vodoun')
    .replace(/\s+/g, ' ');
}

let trailerPrewarmStarted = false;
async function prewarmTrailerSynopses(rawSynopses: string[]) {
  if (trailerPrewarmStarted || !process.env.GEMINI_API_KEY) return;
  trailerPrewarmStarted = true;

  const uniqueTexts = Array.from(
    new Set(rawSynopses.map((s) => cleanSpokenSegmentServer(s)).filter(Boolean))
  );

  for (const text of uniqueTexts) {
    const prepared = prepareTtsParams({
      text,
      style: TRAILER_STYLE,
      voiceName: TRAILER_VOICE_NAME,
    });
    if ('error' in prepared) continue;

    if (getCachedTtsWav(prepared.cacheKey)) continue;

    try {
      const existing = ttsInFlight.get(prepared.cacheKey);
      const pending =
        existing ||
        synthesizeSpeechWav(prepared.spokenText, prepared.style, prepared.voiceName)
          .then((wav) => {
            setTtsCache(prepared.cacheKey, wav);
            return wav;
          })
          .finally(() => {
            ttsInFlight.delete(prepared.cacheKey);
          });
      if (!existing) ttsInFlight.set(prepared.cacheKey, pending);
      await pending;
    } catch (err: any) {
      if (isQuotaOrRateLimitError(err)) {
        break;
      }
      // Continuer silencieusement sur les autres synopsis en cas d'erreur ponctuelle
    }

    await new Promise((resolve) => setTimeout(resolve, 450));
  }
}

let dataLoadPromise: Promise<void> | null = null;
function ensureDataLoaded(): Promise<void> {
  if (!dataLoadPromise) {
    dataLoadPromise = (async () => {
      let focusSynopses: string[] = [];
      let seriesSynopses: string[] = [];
      const unregisterTsx = registerTsx();
      try {
        const registry = await import('./src/data/seriesRegistry');
        resolveCanonicalSeriesIdFn = registry.resolveCanonicalSeriesId;
        seriesSynopses = (registry.SERIES_REGISTRY || []).map((s: any) => s?.synopsis || '');

        const focusModule = await import('./src/data/focusData');
        focusSynopses = (focusModule.FOCUS_DATA || []).map((f: any) => f?.synopsis || '');

        const mockData = await import('./src/data/mockData');
        DOCUMENTARIES = mockData.DOCUMENTARIES;
        DUOS = mockData.DUOS;
        PROTAGONISTS = mockData.PROTAGONISTS;

        const explorerData = await import('./src/data/explorerTopicsData');
        EXPLORER_CATEGORIES = explorerData.EXPLORER_CATEGORIES;
        EXPLORER_CATALOG = explorerData.EXPLORER_CATALOG;
      } finally {
        unregisterTsx();
      }

      prewarmTrailerSynopses([...focusSynopses, ...seriesSynopses]).catch(() => {
        // ignore background warmup failure
      });
    })();
  }
  return dataLoadPromise;
}

// Vite & Static Server
async function startServer() {
  app.use('/archive', (_req: Request, res: Response) => {
    res.status(404).end();
  });

  if (!isProd) {
    app.use(express.static(path.resolve(__dirname, 'public'), { maxAge: '1h' }));
    const srcAssetsStatic = express.static(path.resolve(__dirname, 'src/assets'), { maxAge: '1h' });
    app.use('/src/assets', (req: Request, res: Response, next) => {
      if ('import' in req.query || req.originalUrl.includes('?import')) {
        return next();
      }
      return srcAssetsStatic(req, res, next);
    });

    const vitePromise = (async () => {
      const { createServer: createViteServer } = await import('vite');
      return createViteServer({
        server: { 
          middlewareMode: true,
          hmr: false,
          ws: false,
          watch: null,
        },
        appType: 'spa',
      });
    })();
    vitePromise.catch((err) => {
      console.error('[YonyWood] Vite startup error:', err);
    });

    app.use((req: Request, res: Response, next) => {
      vitePromise
        .then((vite) => vite.middlewares(req, res, next))
        .catch(next);
    });

    app.use('*', async (req: Request, res: Response, next) => {
      if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/socket.io')) {
        return next();
      }
      if (req.originalUrl.match(/\.(jpg|jpeg|png|gif|svg|webp|avif|ico|mp4|webm|woff|woff2|ttf|eot)$/i)) {
        res.status(404).end();
        return;
      }
      try {
        const vite = await vitePromise;
        const url = req.originalUrl;
        const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const html = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e: any) {
        try {
          const vite = await vitePromise;
          vite.ssrFixStacktrace(e);
        } catch {
          // ignore if vite failed to initialize
        }
        next(e);
      }
    });

    // Express error handler
    app.use((err: any, _req: Request, res: Response, _next: any) => {
      console.error('[YonyWood Server Error]:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal Server Error', message: err?.message || String(err) });
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Exiting cleanly.`);
    } else {
      console.error('HTTP Server error:', err);
    }
    process.exit(1);
  });

  httpServer.listen(PORT, HOST, () => {
    console.log(`🚀 YonyWood server running at http://${HOST}:${PORT}`);
  });

  // Warm up in-memory data in background without delaying HTTP port binding
  ensureDataLoaded().catch((err) => {
    console.error('[YonyWood] Data warmup error:', err);
  });
}

// Global safety guards
process.on('uncaughtException', (err) => {
  console.error('[YonyWood] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[YonyWood] Unhandled Rejection at:', promise, 'reason:', reason);
});

const gracefulShutdown = () => {
  httpServer.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 2000).unref();
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
