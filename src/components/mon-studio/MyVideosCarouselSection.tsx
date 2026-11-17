import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Edit3,
  Trash2,
  Video,
  Plus,
  Play,
  Pause,
  Check,
  X,
  Upload
} from 'lucide-react';
import { UserVideoSubmission } from '../../types';
import {
  MAX_VIDEO_TITLE_LENGTH,
  deleteUserVideoSubmission,
  updateUserVideoTitle,
  updateUserVideoThumbnail
} from '../../utils/userVideoService';
import {
  STAGE_CARD_DIMENSIONS_CLASS,
  STAGE_PERSPECTIVE,
  STAGE_CENTER_TRANSLATE_Z
} from '../../config/cardLayout';

interface MyVideosCarouselSectionProps {
  videos: UserVideoSubmission[];
  onRefreshVideos: () => void;
  onOpenStudioSubmit: () => void;
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

const STATUS_BADGE_MAP: Record<
  UserVideoSubmission['status'],
  { label: string; className: string }
> = {
  APPROVED: {
    label: 'En ligne',
    className: 'bg-emerald-950/80 text-emerald-300 border-emerald-400/35'
  },
  PENDING: {
    label: 'En examen',
    className: 'bg-amber-950/80 text-amber-200 border-amber-400/35'
  },
  REJECTED: {
    label: 'Refusée',
    className: 'bg-rose-950/80 text-rose-200 border-rose-400/35'
  }
};

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const MyVideosCarouselSection: React.FC<MyVideosCarouselSectionProps> = ({
  videos,
  onRefreshVideos,
  onOpenStudioSubmit,
  onBack,
  onShowToast
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Garder currentIndex dans les bornes si une vidéo est supprimée
  useEffect(() => {
    if (videos.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= videos.length) {
      setCurrentIndex(videos.length - 1);
    }
  }, [videos.length, currentIndex]);

  // Modales dédiées (jamais d'édition inline sur carte swipable)
  const [coverModalVideo, setCoverModalVideo] = useState<UserVideoSubmission | null>(null);
  const [titleModalVideo, setTitleModalVideo] = useState<UserVideoSubmission | null>(null);
  const [titleDraft, setTitleDraft] = useState<string>('');
  const [deleteConfirmVideo, setDeleteConfirmVideo] = useState<UserVideoSubmission | null>(null);

  // Contrôles du sélecteur de frame vidéo
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const coverImageUploadRef = useRef<HTMLInputElement>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoTime, setVideoTime] = useState<number>(0);
  const [captureError, setCaptureError] = useState<string | null>(null);

  // État swipe horizontal du carrousel
  const [dragOffset, setDragOffset] = useState<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number | null>(null);
  const didDragRef = useRef<boolean>(false);

  const anyModalOpen = Boolean(coverModalVideo || titleModalVideo || deleteConfirmVideo);

  const handlePrev = () => {
    if (videos.length <= 1) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : videos.length - 1));
  };

  const handleNext = () => {
    if (videos.length <= 1) return;
    setCurrentIndex((prev) => (prev < videos.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (anyModalOpen || videos.length <= 1) return;
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
    didDragRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (anyModalOpen || !isDraggingRef.current || startXRef.current === null) return;
    const diff = e.touches[0].clientX - startXRef.current;
    if (Math.abs(diff) > 6) {
      didDragRef.current = true;
    }
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (anyModalOpen || !isDraggingRef.current) {
      isDraggingRef.current = false;
      startXRef.current = null;
      setDragOffset(0);
      return;
    }
    isDraggingRef.current = false;
    const threshold = 48;
    if (dragOffset < -threshold) {
      handleNext();
    } else if (dragOffset > threshold) {
      handlePrev();
    }
    setDragOffset(0);
    startXRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (anyModalOpen || videos.length <= 1) return;
    startXRef.current = e.clientX;
    isDraggingRef.current = true;
    didDragRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (anyModalOpen || !isDraggingRef.current || startXRef.current === null) return;
    const diff = e.clientX - startXRef.current;
    if (Math.abs(diff) > 6) {
      didDragRef.current = true;
    }
    setDragOffset(diff);
  };

  const handleMouseUpOrLeave = () => {
    if (anyModalOpen || !isDraggingRef.current) {
      isDraggingRef.current = false;
      startXRef.current = null;
      setDragOffset(0);
      return;
    }
    isDraggingRef.current = false;
    const threshold = 48;
    if (dragOffset < -threshold) {
      handleNext();
    } else if (dragOffset > threshold) {
      handlePrev();
    }
    setDragOffset(0);
    startXRef.current = null;
  };

  const openCoverModal = (video: UserVideoSubmission) => {
    setIsPreviewPlaying(false);
    setVideoDuration(0);
    setVideoTime(0);
    setCaptureError(null);
    setCoverModalVideo(video);
  };

  const handleScrubVideo = (time: number) => {
    setVideoTime(time);
    setCaptureError(null);
    const el = videoPreviewRef.current;
    if (el) {
      el.pause();
      setIsPreviewPlaying(false);
      el.currentTime = time;
    }
  };

  const handleTogglePreviewPlay = () => {
    const el = videoPreviewRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().then(() => setIsPreviewPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setIsPreviewPlaying(false);
    }
  };

  const handleCaptureFrameAsCover = () => {
    if (!coverModalVideo) return;
    const el = videoPreviewRef.current;
    if (!el || !el.videoWidth || !el.videoHeight) {
      setCaptureError("Chargez la vidéo avant de capturer l'image.");
      return;
    }
    try {
      const maxWidth = 720;
      const scale = Math.min(1, maxWidth / el.videoWidth);
      const w = Math.max(1, Math.round(el.videoWidth * scale));
      const h = Math.max(1, Math.round(el.videoHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setCaptureError('Capture indisponible sur ce navigateur.');
        return;
      }
      ctx.drawImage(el, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      updateUserVideoThumbnail(coverModalVideo.id, dataUrl);
      onRefreshVideos();
      setCoverModalVideo(null);
      onShowToast('Couverture mise à jour.');
    } catch {
      setCaptureError('Capture bloquée pour cette vidéo. Vous pouvez importer une image.');
    }
  };

  const handleUploadCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !coverModalVideo) return;

    const reader = new FileReader();
    reader.onload = () => {
      const raw = typeof reader.result === 'string' ? reader.result : '';
      if (!raw) return;
      const img = new Image();
      img.onload = () => {
        const maxDim = 720;
        const scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
        const w = Math.max(1, Math.round((img.width || maxDim) * scale));
        const h = Math.max(1, Math.round((img.height || maxDim) * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          try {
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            updateUserVideoThumbnail(coverModalVideo.id, compressed);
            onRefreshVideos();
            setCoverModalVideo(null);
            onShowToast('Couverture mise à jour.');
            return;
          } catch {
            // fallback raw
          }
        }
        updateUserVideoThumbnail(coverModalVideo.id, raw);
        onRefreshVideos();
        setCoverModalVideo(null);
        onShowToast('Couverture mise à jour.');
      };
      img.onerror = () => {
        updateUserVideoThumbnail(coverModalVideo.id, raw);
        onRefreshVideos();
        setCoverModalVideo(null);
        onShowToast('Couverture mise à jour.');
      };
      img.src = raw;
    };
    reader.readAsDataURL(file);
  };

  const openTitleModal = (video: UserVideoSubmission) => {
    setTitleDraft(video.title.slice(0, MAX_VIDEO_TITLE_LENGTH));
    setTitleModalVideo(video);
  };

  const handleSaveTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleModalVideo) return;
    const clean = titleDraft.trim().slice(0, MAX_VIDEO_TITLE_LENGTH);
    if (!clean) return;
    updateUserVideoTitle(titleModalVideo.id, clean);
    onRefreshVideos();
    setTitleModalVideo(null);
    onShowToast('Titre enregistré.');
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmVideo) return;
    deleteUserVideoSubmission(deleteConfirmVideo.id);
    onRefreshVideos();
    setDeleteConfirmVideo(null);
    onShowToast('Vidéo supprimée.');
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans overflow-hidden">
      {/* Barre supérieure */}
      <header className="shrink-0 h-14 sm:h-16 px-4 sm:px-6 border-b border-stone-200/80 bg-white/95 flex items-center justify-between z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shrink-0"
            aria-label="Retour à Mon Studio"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-editorial text-base sm:text-lg font-bold text-stone-900 truncate">
            Mes Vidéos
          </h1>
        </div>

        <button
          type="button"
          onClick={onOpenStudioSubmit}
          className="px-3.5 py-2 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Déposer</span>
        </button>
      </header>

      {/* Scène principale */}
      {videos.length === 0 ? (
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-300 shadow-xs">
            <Video className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-stone-800">Aucune vidéo déposée</p>
            <p className="text-xs text-stone-500">Déposez votre premier récit depuis le Studio.</p>
          </div>
          <button
            type="button"
            onClick={onOpenStudioSubmit}
            className="px-5 py-2.5 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Ouvrir le Studio
          </button>
        </main>
      ) : (
        <main
          className="flex-1 min-h-0 flex flex-col items-center justify-center px-2 sm:px-6 py-2 overflow-hidden select-none touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {/* Carrousel 3D niveau 1 Studio */}
          <div className="relative w-full flex-1 min-h-0 flex items-center justify-center">
            {videos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="hidden sm:flex absolute left-2 md:left-6 z-40 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-stone-200 text-stone-800 items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
                aria-label="Vidéo précédente"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div
              className="relative w-full h-full flex items-center justify-center pointer-events-none"
              style={{
                perspective: STAGE_PERSPECTIVE,
                perspectiveOrigin: 'center center'
              }}
            >
              <div
                className="relative w-full h-full flex items-center justify-center pointer-events-none"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {videos.map((video, idx) => {
                  const n = videos.length;
                  let diff = idx - currentIndex;
                  if (n >= 3) {
                    const rawDiff = (idx - currentIndex) % n;
                    diff = rawDiff > n / 2 ? rawDiff - n : rawDiff < -n / 2 ? rawDiff + n : rawDiff;
                  }
                  if (Math.abs(diff) > 2) return null;

                  const isCenter = diff === 0;
                  let transformStyle = '';
                  let zIndex = 10;
                  let opacity = 0;

                  if (diff === 0) {
                    transformStyle = `translateX(${dragOffset}px) translateZ(${STAGE_CENTER_TRANSLATE_Z}px) rotateY(${dragOffset * -0.15}deg) scale(1)`;
                    zIndex = 30;
                    opacity = 1;
                  } else if (diff === 1) {
                    transformStyle = `translateX(calc(55% + ${dragOffset}px)) translateZ(-60px) rotateY(-26deg) scale(0.86)`;
                    zIndex = 20;
                    opacity = 0.75;
                  } else if (diff === -1) {
                    transformStyle = `translateX(calc(-55% + ${dragOffset}px)) translateZ(-60px) rotateY(26deg) scale(0.86)`;
                    zIndex = 20;
                    opacity = 0.75;
                  } else if (diff === 2) {
                    transformStyle = `translateX(calc(100% + ${dragOffset}px)) translateZ(-140px) rotateY(-40deg) scale(0.72)`;
                    zIndex = 10;
                    opacity = 0.35;
                  } else if (diff === -2) {
                    transformStyle = `translateX(calc(-100% + ${dragOffset}px)) translateZ(-140px) rotateY(40deg) scale(0.72)`;
                    zIndex = 10;
                    opacity = 0.35;
                  }

                  const statusMeta = STATUS_BADGE_MAP[video.status] || STATUS_BADGE_MAP.PENDING;

                  return (
                    <div
                      key={video.id}
                      onClick={() => {
                        if (didDragRef.current) {
                          didDragRef.current = false;
                          return;
                        }
                        if (!isCenter) {
                          setCurrentIndex(idx);
                        }
                      }}
                      style={{
                        transform: transformStyle,
                        zIndex,
                        opacity,
                        pointerEvents: 'auto',
                        transition: isDraggingRef.current
                          ? 'none'
                          : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease'
                      }}
                      className={`absolute ${STAGE_CARD_DIMENSIONS_CLASS} rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between p-2.5 sm:p-3.5 select-none bg-[#151513] text-white border transition-colors ${
                        isCenter ? 'border-stone-200/90 ring-1 ring-white/30' : 'border-white/15 cursor-pointer'
                      }`}
                    >
                      {/* Grande photo de couverture choisie par l'utilisateur */}
                      <img
                        src={video.thumbnailUrl || '/assets/images/selfie_video_story.jpg'}
                        alt={video.title}
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = '/assets/images/selfie_video_story.jpg';
                        }}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      />

                      {/* Voile cinématographique */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/90 pointer-events-none" />

                      {/* HAUT : Badge pilule titre en haut à gauche + Badge statut court en haut à droite */}
                      <div className="relative z-10 flex items-center justify-between gap-1.5 w-full min-w-0">
                        <div className="inline-flex w-fit max-w-[calc(100%-88px)] min-w-0 items-center rounded-full px-2.5 py-1 bg-black/75 border border-white/20 shadow-md">
                          <span
                            className="font-editorial text-[9.5px] sm:text-[10.5px] font-semibold text-white leading-tight tracking-wide block w-full min-w-0"
                            style={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            title={video.title}
                          >
                            {video.title}
                          </span>
                        </div>

                        <span
                          className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-bold border shadow-sm whitespace-nowrap ${statusMeta.className}`}
                        >
                          {statusMeta.label}
                        </span>
                      </div>

                      {/* BAS : Actions (Changer la couverture, Modifier le titre, Supprimer) */}
                      <div
                        className="relative z-10 w-full space-y-1.5 pt-2"
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isCenter) {
                              setCurrentIndex(idx);
                              return;
                            }
                            openCoverModal(video);
                          }}
                          className="w-full py-1.5 sm:py-2 px-2.5 rounded-xl bg-black/75 hover:bg-[#A2482B] border border-white/25 hover:border-[#A2482B] text-white text-[10px] sm:text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Changer la couverture</span>
                        </button>

                        <div className="flex items-center gap-1.5 w-full">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isCenter) {
                                setCurrentIndex(idx);
                                return;
                              }
                              openTitleModal(video);
                            }}
                            className="flex-1 min-w-0 py-1.5 sm:py-2 px-2 rounded-xl bg-black/75 hover:bg-white/20 border border-white/20 text-white text-[10px] sm:text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3 shrink-0" />
                            <span className="truncate">Modifier le titre</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isCenter) {
                                setCurrentIndex(idx);
                                return;
                              }
                              setDeleteConfirmVideo(video);
                            }}
                            className="shrink-0 py-1.5 sm:py-2 px-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-700 border border-rose-400/35 text-rose-100 text-[10px] sm:text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3 shrink-0" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {videos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="hidden sm:flex absolute right-2 md:right-6 z-40 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-stone-200 text-stone-800 items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
                aria-label="Vidéo suivante"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Indicateurs à points + petites flèches */}
          {videos.length > 1 && (
            <div
              className="shrink-0 mt-2 mb-2 flex items-center justify-center gap-3"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handlePrev}
                className="w-7 h-7 rounded-full border border-stone-200 bg-white text-stone-700 flex items-center justify-center cursor-pointer hover:bg-stone-50"
                aria-label="Vidéo précédente"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1.5">
                {videos.map((v, idx) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Afficher ${v.title}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? 'w-6 bg-[#A2482B]' : 'w-2 bg-stone-300 hover:bg-stone-400'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-7 h-7 rounded-full border border-stone-200 bg-white text-stone-700 flex items-center justify-center cursor-pointer hover:bg-stone-50"
                aria-label="Vidéo suivante"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </main>
      )}

      {/* ===================================================================== */}
      {/* MODALE 1 : SÉLECTEUR D'IMAGE DANS LA VIDÉO (CHANGER LA COUVERTURE)    */}
      {/* ===================================================================== */}
      {coverModalVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setCoverModalVideo(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-900">Changer la couverture</h2>
              <button
                type="button"
                onClick={() => setCoverModalVideo(null)}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5">
              <div className="relative w-full aspect-[9/12] max-h-[280px] rounded-2xl overflow-hidden bg-black border border-stone-200 flex items-center justify-center">
                <video
                  ref={videoPreviewRef}
                  src={coverModalVideo.videoUrl || '/sample.mp4'}
                  poster={coverModalVideo.thumbnailUrl || '/assets/images/selfie_video_story.jpg'}
                  crossOrigin="anonymous"
                  playsInline
                  muted
                  preload="metadata"
                  onLoadedMetadata={(e) => {
                    const dur = e.currentTarget.duration;
                    if (Number.isFinite(dur) && dur > 0) {
                      setVideoDuration(dur);
                    }
                  }}
                  onTimeUpdate={(e) => setVideoTime(e.currentTarget.currentTime)}
                  onEnded={() => setIsPreviewPlaying(false)}
                  className="w-full h-full object-contain"
                />

                <button
                  type="button"
                  onClick={handleTogglePreviewPlay}
                  className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-black/75 hover:bg-[#A2482B] text-white border border-white/25 flex items-center justify-center cursor-pointer transition-colors"
                  aria-label={isPreviewPlaying ? 'Pause' : 'Lecture'}
                >
                  {isPreviewPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  )}
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                  <span>{formatTime(videoTime)}</span>
                  <span>{formatTime(videoDuration)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={videoDuration > 0 ? videoDuration : 10}
                  step={0.05}
                  value={videoTime}
                  onChange={(e) => handleScrubVideo(parseFloat(e.target.value))}
                  className="w-full accent-[#A2482B] cursor-pointer"
                  aria-label="Choisir le moment de la vidéo"
                />
              </div>

              {captureError && (
                <p className="text-[11px] text-rose-600 font-medium">{captureError}</p>
              )}

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCaptureFrameAsCover}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Utiliser cette image</span>
                </button>

                <input
                  ref={coverImageUploadRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadCoverImage}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => coverImageUploadRef.current?.click()}
                  className="w-full py-2 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Importer une image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODALE 2 : MODIFIER LE TITRE (28 CARACTÈRES MAX + COMPTEUR VISIBLE)   */}
      {/* ===================================================================== */}
      {titleModalVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setTitleModalVideo(null)}
        >
          <form
            onSubmit={handleSaveTitle}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-900">Modifier le titre</h2>
              <button
                type="button"
                onClick={() => setTitleModalVideo(null)}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-stone-700">
                    Titre de la vidéo
                  </label>
                  <span
                    className={`text-xs font-mono font-bold ${
                      titleDraft.length >= MAX_VIDEO_TITLE_LENGTH
                        ? 'text-[#A2482B]'
                        : 'text-stone-400'
                    }`}
                  >
                    {titleDraft.length}/{MAX_VIDEO_TITLE_LENGTH}
                  </span>
                </div>

                <input
                  type="text"
                  value={titleDraft}
                  maxLength={MAX_VIDEO_TITLE_LENGTH}
                  onChange={(e) => setTitleDraft(e.target.value.slice(0, MAX_VIDEO_TITLE_LENGTH))}
                  autoFocus
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-[#A2482B]"
                  placeholder="Titre court"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTitleModalVideo(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!titleDraft.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODALE 3 : CONFIRMATION DE SUPPRESSION                                */}
      {/* ===================================================================== */}
      {deleteConfirmVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmVideo(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs bg-white rounded-3xl border border-stone-200 shadow-2xl p-5 space-y-4"
          >
            <div className="space-y-1.5">
              <h2 className="text-sm font-bold text-stone-900">Supprimer cette vidéo ?</h2>
              <p className="text-xs text-stone-500 leading-relaxed">
                « {deleteConfirmVideo.title} » sera supprimée définitivement de votre espace.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmVideo(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
