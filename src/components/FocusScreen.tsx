import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pause,
  Scroll,
  X
} from 'lucide-react';
import { ViewScreen } from '../types';
import { TvPlayerIcon } from './YonywoodBrandIcons';
import { LegbaArchButton } from './shared/LegbaArchButton';
import { FOCUS_DATA, FocusItem, FocusVideoItem } from '../data/focusData';
import { UnifiedVideoCardOverlay } from './UnifiedVideoCardOverlay';
import { StageCarousel3D } from './shared/StageCarousel3D';
import { CardWidthModal } from './shared/CardWidthModal';
import { celestialAudio } from '../utils/celestialAudio';
import { episodeVoiceReader } from '../utils/episodeVoiceReader';
import { SHOW_CAROUSEL_ARROWS } from '../config/flags';
import { STAGE_CARD_DIMENSIONS_CLASS, STAGE_CENTER_TRANSLATE_Z } from '../config/cardLayout';

interface FocusScreenProps {
  onNavigate?: (screen: ViewScreen) => void;
  initialTopicId?: string;
  selectedCompanyId?: string;
}

function formatCleanQuestion(rawQuestion?: string): string {
  if (!rawQuestion) return '';
  return rawQuestion
    .replace(/^[«"'\s]+|[»"'\s]+$/g, '')
    .replace(/\s*\?$/, '\u00A0?')
    .trim();
}

export const FocusScreen: React.FC<FocusScreenProps> = ({
  onNavigate,
  initialTopicId,
  selectedCompanyId
}) => {
  const [focusIndex, setFocusIndex] = useState<number>(() => {
    const targetId = initialTopicId || selectedCompanyId;
    if (targetId) {
      const idx = FOCUS_DATA.findIndex(
        (f) => f.id === targetId || f.titre.toLowerCase() === targetId.toLowerCase()
      );
      if (idx !== -1) return idx;
    }
    return 0;
  });

  const currentFocus: FocusItem = FOCUS_DATA[focusIndex] || FOCUS_DATA[0];

  const [isTopicOpened, setIsTopicOpened] = useState<boolean>(false);
  const [papyrusFocus, setPapyrusFocus] = useState<FocusItem | null>(null);
  const [isSynopsisPlaying, setIsSynopsisPlaying] = useState<boolean>(false);
  const [isSynopsisLoading, setIsSynopsisLoading] = useState<boolean>(false);
  const [synopsisAudioError, setSynopsisAudioError] = useState<string | null>(null);
  const [videoIndices, setVideoIndices] = useState<Record<string, number>>({});
  const currentVideoIndex = videoIndices[currentFocus.id] || 0;
  const currentVideo: FocusVideoItem =
    currentFocus.videos[currentVideoIndex % Math.max(1, currentFocus.videos.length)] ||
    currentFocus.videos[0];

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [isQuestionOpen, setIsQuestionOpen] = useState<boolean>(false);

  // Swipe vertical (navigation entre vidéos dans un Focus, identique à Duocumentaires)
  const touchStartPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isMouseDownRef = useRef<boolean>(false);
  const lastScrollTimeRef = useRef<number>(0);
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);
  const [isDraggingY, setIsDraggingY] = useState<boolean>(false);

  const stopSynopsisVoice = useCallback(() => {
    episodeVoiceReader.stop();
    setIsSynopsisPlaying(false);
    setIsSynopsisLoading(false);
  }, []);

  const closePapyrusModal = useCallback(() => {
    stopSynopsisVoice();
    setSynopsisAudioError(null);
    setPapyrusFocus(null);
  }, [stopSynopsisVoice]);

  useEffect(() => {
    return () => {
      episodeVoiceReader.stop();
    };
  }, []);

  useEffect(() => {
    if (isTopicOpened || !currentFocus?.synopsis) return;
    const timer = window.setTimeout(() => {
      episodeVoiceReader.preload(
        {
          mode: 'trailer',
          synopsis: currentFocus.synopsis,
        },
        { cacheOnly: false }
      );
    }, 300);
    return () => window.clearTimeout(timer);
  }, [isTopicOpened, currentFocus?.synopsis]);

  useEffect(() => {
    if (!papyrusFocus?.synopsis) return;
    episodeVoiceReader.preload(
      {
        mode: 'trailer',
        synopsis: papyrusFocus.synopsis,
      },
      { cacheOnly: false }
    );
  }, [papyrusFocus]);

  const handleToggleSynopsisVoice = useCallback(() => {
    if (!papyrusFocus?.synopsis) return;
    setSynopsisAudioError(null);

    if (isSynopsisPlaying || isSynopsisLoading) {
      stopSynopsisVoice();
      return;
    }

    episodeVoiceReader.speak({
      mode: 'trailer',
      synopsis: papyrusFocus.synopsis,
      onLoadStart: () => {
        setIsSynopsisLoading(true);
        setIsSynopsisPlaying(false);
      },
      onStart: () => {
        setIsSynopsisLoading(false);
        setIsSynopsisPlaying(true);
      },
      onEnd: () => {
        setIsSynopsisLoading(false);
        setIsSynopsisPlaying(false);
      },
      onError: (msg) => {
        setIsSynopsisLoading(false);
        setIsSynopsisPlaying(false);
        setSynopsisAudioError(msg || "La lecture vocale n'est pas disponible.");
      },
    });
  }, [papyrusFocus, isSynopsisPlaying, isSynopsisLoading, stopSynopsisVoice]);

  const handleEnterFocus = useCallback((idx?: number) => {
    if (typeof idx === 'number') {
      setFocusIndex(idx);
    }
    setIsTopicOpened(true);
    setIsPlaying(true);
    setIsQuestionOpen(false);
    setVideoProgress(0);
    celestialAudio.playOrbSelect();
  }, []);

  const handleBackToCarousel = useCallback(() => {
    setIsTopicOpened(false);
    setIsPlaying(false);
    setIsQuestionOpen(false);
    setVideoProgress(0);
    celestialAudio.playOrbSelect();
  }, []);

  const handleNextVideo = useCallback(() => {
    const total = currentFocus.videos.length;
    if (total <= 1) return;
    setVideoIndices((prev) => ({
      ...prev,
      [currentFocus.id]: ((prev[currentFocus.id] || 0) + 1) % total
    }));
    setVideoProgress(0);
    setIsQuestionOpen(false);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  }, [currentFocus]);

  const handlePrevVideo = useCallback(() => {
    const total = currentFocus.videos.length;
    if (total <= 1) return;
    setVideoIndices((prev) => ({
      ...prev,
      [currentFocus.id]: ((prev[currentFocus.id] || 0) - 1 + total) % total
    }));
    setVideoProgress(0);
    setIsQuestionOpen(false);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  }, [currentFocus]);

  // Synchronisation lecture/pause vidéo
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isTopicOpened && isPlaying) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isTopicOpened, isPlaying, currentVideo?.id]);

  // Progression vidéo
  useEffect(() => {
    if (!isTopicOpened || !isPlaying) return;
    const interval = window.setInterval(() => {
      if (videoRef.current && videoRef.current.duration) {
        setVideoProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
      }
    }, 100);
    return () => window.clearInterval(interval);
  }, [isTopicOpened, isPlaying, currentVideo?.id]);

  // Raccourcis clavier à l'intérieur d'un Focus
  useEffect(() => {
    if (!isTopicOpened) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'Escape') {
        if (isQuestionOpen) {
          setIsQuestionOpen(false);
        } else {
          handleBackToCarousel();
        }
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextVideo();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevVideo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTopicOpened, isQuestionOpen, handleBackToCarousel, handleNextVideo, handlePrevVideo]);

  const handleWheel = (e: React.WheelEvent) => {
    if (!isTopicOpened) return;
    const now = Date.now();
    if (now - lastScrollTimeRef.current < 450) return;
    if (Math.abs(e.deltaY) > 30) {
      lastScrollTimeRef.current = now;
      if (e.deltaY > 0) {
        handleNextVideo();
      } else {
        handlePrevVideo();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, input, a, [role="button"]')) return;
    touchStartPosRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
    setIsDraggingY(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPosRef.current) return;
    const deltaX = e.touches[0].clientX - touchStartPosRef.current.x;
    const deltaY = e.touches[0].clientY - touchStartPosRef.current.y;
    if (Math.abs(deltaY) >= Math.abs(deltaX)) {
      setDragOffsetY(Math.max(-130, Math.min(130, deltaY * 0.75)));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPosRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartPosRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartPosRef.current.y;
    const elapsed = Math.max(1, Date.now() - touchStartPosRef.current.time);
    touchStartPosRef.current = null;
    setIsDraggingY(false);
    setDragOffsetY(0);

    const velocityY = Math.abs(deltaY) / elapsed;
    if (Math.abs(deltaY) > Math.abs(deltaX) && (Math.abs(deltaY) > 35 || velocityY > 0.22)) {
      if (deltaY < 0) {
        handleNextVideo();
      } else {
        handlePrevVideo();
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, a, [role="button"]')) return;
    touchStartPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };
    isMouseDownRef.current = true;
    setIsDraggingY(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !touchStartPosRef.current) return;
    const deltaY = e.clientY - touchStartPosRef.current.y;
    setDragOffsetY(Math.max(-130, Math.min(130, deltaY * 0.75)));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !touchStartPosRef.current) return;
    const deltaX = e.clientX - touchStartPosRef.current.x;
    const deltaY = e.clientY - touchStartPosRef.current.y;
    const elapsed = Math.max(1, Date.now() - touchStartPosRef.current.time);
    isMouseDownRef.current = false;
    touchStartPosRef.current = null;
    setIsDraggingY(false);
    setDragOffsetY(0);

    const velocityY = Math.abs(deltaY) / elapsed;
    if (Math.abs(deltaY) > Math.abs(deltaX) && (Math.abs(deltaY) > 35 || velocityY > 0.22)) {
      if (deltaY < 0) {
        handleNextVideo();
      } else {
        handlePrevVideo();
      }
    }
  };

  const roleBadgeText =
    currentFocus.type !== 'theme' && currentVideo?.role
      ? currentVideo.role
      : undefined;

  const activeFocusQuestion =
    currentFocus.questions.find((q) => q.number === currentVideo?.questionNumber) ||
    currentFocus.questions[currentVideoIndex % Math.max(1, currentFocus.questions.length)] ||
    currentFocus.questions[0];

  return (
    <div className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between text-[#1C1917] select-none bg-transparent relative">
      {!isTopicOpened ? (
        <div className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-6 min-h-0 overflow-hidden flex flex-col justify-between pt-1 sm:pt-2">
          <StageCarousel3D
            items={FOCUS_DATA}
            currentIndex={focusIndex}
            onIndexChange={(nextIdx) => {
              setFocusIndex(nextIdx);
              celestialAudio.playOrbSelect();
            }}
            getKey={(item) => item.id}
            circular={true}
            dragDisabled={Boolean(papyrusFocus)}
            showDesktopArrows={SHOW_CAROUSEL_ARROWS}
            prevAriaLabel="Focus précédent"
            nextAriaLabel="Focus suivant"
            renderCard={(focus, idx, { isCenter }) => (
              <div className="relative w-full h-full flex flex-col justify-between p-2.5 sm:p-4 text-white bg-[#121F4B]">
                <img
                  src={focus.posterUrl}
                  alt={focus.titre}
                  loading={isCenter ? 'eager' : 'lazy'}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#121F4B]/15 via-transparent to-[#121F4B]/55 pointer-events-none" />

                {/* HAUT : Pastille Titre à gauche + Badge discret Partenaire uniquement si commandité */}
                <div className="relative z-10 flex items-center justify-between gap-1.5 w-full min-w-0">
                  <div
                    className={`inline-flex w-fit ${
                      focus.commandite ? 'max-w-[calc(100%-74px)]' : 'max-w-full'
                    } min-w-0 items-center rounded-full px-2.5 sm:px-3 py-1 bg-[#121F4B]/55 backdrop-blur-sm border border-white/20 shadow-md`}
                    title={focus.titre}
                  >
                    <span className="font-editorial text-[8.5px] sm:text-[11px] font-semibold text-white whitespace-nowrap leading-tight tracking-wide select-none truncate">
                      {focus.titre}
                    </span>
                  </div>

                  {focus.commandite && (
                    <span className="px-2 py-0.5 rounded-full bg-[#121F4B]/55 backdrop-blur-sm border border-[#FFE7A3]/40 text-[10px] font-semibold text-[#FFE7A3] tracking-wide shadow-md shrink-0">
                      Sponsorisé
                    </span>
                  )}
                </div>

                {/* BAS : Papyrus (gauche) + Porte Choisir (droite) */}
                <div
                  className="relative z-10 w-full flex items-end justify-between pointer-events-auto pt-2"
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPapyrusFocus(focus);
                      celestialAudio.playOrbSelect();
                    }}
                    className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-[#121F4B]/55 backdrop-blur-sm hover:bg-[#A2482B] active:bg-[#8A3B22] text-white border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                    title="Lire le synopsis et la question"
                    aria-label={`Synopsis et question — ${focus.titre}`}
                  >
                    <Scroll className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </button>

                  <LegbaArchButton
                    isCenterAction={isCenter}
                    resetKey={`focus-${focus.id}`}
                    onCenterCard={() => {
                      setFocusIndex(idx);
                      celestialAudio.playOrbSelect();
                    }}
                    onActivate={() => handleEnterFocus(idx)}
                  />
                </div>
              </div>
            )}
          />
        </div>
      ) : (
        /* MODE LECTURE VIDÉO À L'INTÉRIEUR DU FOCUS (SWIPE VERTICAL COMME DUOCUMENTAIRES) */
        <div
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            if (isMouseDownRef.current) {
              isMouseDownRef.current = false;
              touchStartPosRef.current = null;
              setIsDraggingY(false);
              setDragOffsetY(0);
            }
          }}
          className="relative flex-1 flex flex-col items-center justify-center min-h-0 py-1 sm:py-2 select-none overflow-hidden touch-none"
        >
          {SHOW_CAROUSEL_ARROWS && currentFocus.videos.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevVideo}
                className="hidden md:flex absolute left-4 lg:left-8 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#A2482B] hover:text-white border border-stone-200 shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                title="Histoire précédente"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextVideo}
                className="hidden md:flex absolute right-4 lg:right-8 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#A2482B] hover:text-white border border-stone-200 shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                title="Histoire suivante"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              perspective: '1200px',
              perspectiveOrigin: 'center center'
            }}
          >
            <div
              className={`relative ${STAGE_CARD_DIMENSIONS_CLASS} rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 bg-[#121F4B] text-white flex flex-col justify-between select-none shadow-2xl ring-1 ring-white/20`}
              style={{
                transform: `translateY(${dragOffsetY}px) translateZ(${STAGE_CENTER_TRANSLATE_Z}px)`,
                transition: isDraggingY ? 'none' : 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Fond vidéo / affiche */}
              <div
                onClick={() => setIsPlaying((prev) => !prev)}
                className="absolute inset-0 overflow-hidden cursor-pointer"
              >
                <video
                  ref={videoRef}
                  key={currentVideo.id}
                  src={currentVideo.videoUrl || '/sample.mp4'}
                  poster={currentVideo.posterUrl}
                  preload="metadata"
                  playsInline
                  autoPlay={isPlaying}
                  muted={isMuted}
                  onEnded={handleNextVideo}
                  className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121F4B]/60 via-transparent to-[#121F4B]/15 pointer-events-none" />
              </div>

              <UnifiedVideoCardOverlay
                videoId={currentVideo.id}
                titleBadge={currentFocus.titre}
                topLeftSlot={
                  <div className="flex flex-col items-start gap-1 max-w-full">
                    <div className="flex items-center gap-1.5 max-w-full">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBackToCarousel();
                        }}
                        className="px-2.5 py-1.5 rounded-full bg-[#121F4B]/55 backdrop-blur-sm hover:bg-[#A2482B] border border-white/20 font-editorial text-xs font-semibold text-white tracking-wide shadow-md flex items-center gap-1.5 truncate max-w-full transition-colors cursor-pointer"
                        title="Revenir aux Focus"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 shrink-0 text-white/90" />
                        <span className="truncate">{currentFocus.titre}</span>
                      </button>

                      {currentFocus.commandite && (
                        <span className="px-2 py-0.5 rounded-full bg-[#121F4B]/55 backdrop-blur-sm border border-[#FFE7A3]/40 text-[10px] font-semibold text-[#FFE7A3] shrink-0">
                          Sponsorisé
                        </span>
                      )}
                    </div>

                    {roleBadgeText && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#121F4B]/50 backdrop-blur-sm border border-white/20 text-[10.5px] font-semibold text-[#FFE7A3] tracking-wide shadow-xs capitalize">
                        {roleBadgeText}
                      </span>
                    )}
                  </div>
                }
                displayName={currentVideo.authorName}
                videoProgress={videoProgress}
                isPlaying={isPlaying}
                onTogglePlay={(e) => {
                  e?.stopPropagation();
                  setIsPlaying((prev) => !prev);
                }}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted((prev) => !prev)}
                questionText={activeFocusQuestion?.question || currentFocus.question}
                onOpenQuestionModal={() => {
                  setIsQuestionOpen((prev) => !prev);
                  celestialAudio.playOrbSelect();
                }}
                onOpenProfile={() =>
                  onNavigate?.({
                    type: 'profile',
                    protagonistId: currentVideo.protagonistId || 'senan-agossa'
                  })
                }
              >
                {/* Carte Question style Duocumentaires (boîte blanche épurée) */}
                {isQuestionOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute inset-x-3.5 sm:inset-x-4 bottom-14 sm:bottom-16 z-40 max-h-[58%] overflow-y-auto no-scrollbar bg-white text-stone-900 rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-white/40 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-auto"
                  >
                    <div className="flex items-start justify-between gap-2 pb-2 mb-2.5 border-b border-stone-100">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="p-1 rounded-full bg-[#A2482B] text-white flex items-center justify-center shrink-0">
                          <BookOpen className="w-3 h-3" />
                        </span>
                        <span className="text-[10.5px] uppercase tracking-wider font-semibold text-stone-500 leading-snug break-words">
                          {activeFocusQuestion?.title || 'Question'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsQuestionOpen(false)}
                        className="w-6 h-6 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center cursor-pointer shrink-0"
                        aria-label="Fermer la question"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-ui text-xs sm:text-[13px] leading-[1.75] text-stone-700 font-normal">
                      {formatCleanQuestion(activeFocusQuestion?.question || currentFocus.question)}
                    </p>
                  </div>
                )}
              </UnifiedVideoCardOverlay>
            </div>
          </div>
        </div>
      )}

      {/* MODALE PAPYRUS (SYNOPSIS FOCUS + LECTURE BANDE-ANNONCE) */}
      <CardWidthModal
        isOpen={Boolean(papyrusFocus)}
        onClose={closePapyrusModal}
        ariaLabel={papyrusFocus ? papyrusFocus.titre : 'Présentation Focus'}
        className="p-4 sm:p-5 space-y-3 text-stone-800 max-h-[78dvh] flex flex-col"
      >
        {papyrusFocus && (
          <>
            <div className="flex items-center gap-2 border-b border-stone-200/80 pb-2.5 shrink-0">
              <div className="w-7 h-7 rounded-xl bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center shrink-0">
                <Scroll className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="font-editorial text-xs sm:text-sm font-semibold text-stone-900 leading-snug break-words">
                  {papyrusFocus.titre}
                </h3>
                {papyrusFocus.sousTitre && (
                  <span className="text-[10.5px] font-medium text-stone-500 leading-snug">
                    {papyrusFocus.sousTitre}
                  </span>
                )}
                {papyrusFocus.commandite && (
                  <span className="text-[10px] font-semibold text-[#A2482B]">Sponsorisé</span>
                )}
              </div>
              <button
                type="button"
                onClick={handleToggleSynopsisVoice}
                className={`w-7.5 h-7.5 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 shadow-xs hover:scale-105 active:scale-95 ${
                  isSynopsisPlaying || isSynopsisLoading
                    ? 'bg-[#A2482B] border-[#A2482B] text-white'
                    : 'bg-[#1F44A8] hover:bg-[#A2482B] border-[#1F44A8]/20 hover:border-[#A2482B] text-white'
                }`}
                title={
                  isSynopsisLoading
                    ? 'Chargement de la voix...'
                    : isSynopsisPlaying
                      ? 'Arrêter la lecture du synopsis'
                      : 'Écouter le synopsis'
                }
                aria-label={isSynopsisPlaying ? 'Arrêter la lecture du synopsis' : 'Écouter le synopsis'}
              >
                {isSynopsisLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : isSynopsisPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <TvPlayerIcon className="w-4 h-4" strokeWidth={1.75} />
                )}
              </button>
            </div>

            <div className="py-0.5 overflow-y-auto pr-1 min-h-0 space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Synopsis
                </span>
                <p className="text-stone-700 text-xs sm:text-[13px] leading-relaxed">
                  {papyrusFocus.synopsis}
                </p>
              </div>
              {synopsisAudioError && (
                <p className="text-[11px] text-[#A2482B] font-medium">{synopsisAudioError}</p>
              )}
            </div>
          </>
        )}
      </CardWidthModal>
    </div>
  );
};
