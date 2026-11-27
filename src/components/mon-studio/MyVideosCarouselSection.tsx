import React, { useState, useRef, useEffect } from 'react';
import {
  Image as ImageIcon,
  Edit3,
  Trash2,
  Plus,
  Play,
  Pause,
  Check,
  X,
  Upload,
  Volume2,
  VolumeX,
  ArrowRight,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import { UserAccount, UserVideoSubmission } from '../../types';
import {
  MAX_VIDEO_TITLE_LENGTH,
  ProfileVideoTab,
  PROFILE_TAB_LABELS,
  deleteUserVideoSubmission,
  updateUserVideoTitle,
  updateUserVideoThumbnail,
  trySaveUserVideoSubmission
} from '../../utils/userVideoService';
import { TvPlayerIcon, LegbaDoorIcon } from '../YonywoodBrandIcons';
import { StageCarousel3D } from '../shared/StageCarousel3D';
import { StageBreadcrumb } from '../shared/StageBreadcrumb';
import { CardWidthModal } from '../shared/CardWidthModal';

interface MyVideosCarouselSectionProps {
  profile: UserAccount;
  videos: UserVideoSubmission[];
  onRefreshVideos: () => void;
  onOpenStudioSubmit: () => void;
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

type CarouselSlot =
  | { kind: 'video'; video: UserVideoSubmission }
  | { kind: 'add'; id: '__add_video_card__' };

const STATUS_BADGE_MAP: Record<
  UserVideoSubmission['status'],
  { label: string; dotClassName: string }
> = {
  APPROVED: {
    label: 'En ligne',
    dotClassName: 'bg-emerald-400'
  },
  PENDING: {
    label: 'En examen',
    dotClassName: 'bg-amber-400'
  },
  REJECTED: {
    label: 'Refusée',
    dotClassName: 'bg-rose-400'
  }
};

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const MyVideosCarouselSection: React.FC<MyVideosCarouselSectionProps> = ({
  profile,
  videos,
  onRefreshVideos,
  onOpenStudioSubmit,
  onBack,
  onShowToast
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const carouselSlots: CarouselSlot[] = [
    ...videos.map((video): CarouselSlot => ({ kind: 'video', video })),
    { kind: 'add', id: '__add_video_card__' }
  ];

  // Garder currentIndex dans les bornes si une vidéo est supprimée
  useEffect(() => {
    if (videos.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= carouselSlots.length) {
      setCurrentIndex(carouselSlots.length - 1);
    }
  }, [videos.length, carouselSlots.length, currentIndex]);

  // Arrêter la lecture si on change de carte
  useEffect(() => {
    setPlayingVideoId(null);
  }, [currentIndex]);

  // Modales dédiées (strictement largeur carte)
  const [coverModalVideo, setCoverModalVideo] = useState<UserVideoSubmission | null>(null);
  const [titleModalVideo, setTitleModalVideo] = useState<UserVideoSubmission | null>(null);
  const [titleDraft, setTitleDraft] = useState<string>('');
  const [deleteConfirmVideo, setDeleteConfirmVideo] = useState<UserVideoSubmission | null>(null);

  // Modale d'ajout rapide avec étape de rattachement de catégorie
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [addStep, setAddStep] = useState<'category' | 'form'>('category');
  const [selectedCategory, setSelectedCategory] = useState<ProfileVideoTab>('parcours');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSynopsis, setNewSynopsis] = useState<string>('');
  const [newVideoFileName, setNewVideoFileName] = useState<string | null>(null);
  const [newVideoPreviewUrl, setNewVideoPreviewUrl] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  // Contrôles du sélecteur de frame vidéo
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const coverImageUploadRef = useRef<HTMLInputElement>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoTime, setVideoTime] = useState<number>(0);
  const [captureError, setCaptureError] = useState<string | null>(null);

  const anyModalOpen = Boolean(
    coverModalVideo || titleModalVideo || deleteConfirmVideo || addModalOpen
  );

  const openCoverModal = (video: UserVideoSubmission) => {
    setPlayingVideoId(null);
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
      setCaptureError('Capture bloquée pour cette vidéo. Importez une image.');
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

  const openAddModal = () => {
    setPlayingVideoId(null);
    setAddStep('category');
    setSelectedCategory('parcours');
    setNewTitle('');
    setNewSynopsis('');
    setNewVideoFileName(null);
    setNewVideoPreviewUrl(null);
    setAddError(null);
    setAddModalOpen(true);
  };

  const handleSelectCategory = (tab: ProfileVideoTab) => {
    setSelectedCategory(tab);
    setAddError(null);
    setAddStep('form');
  };

  const handleSubmitNewVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle =
      newTitle.trim().slice(0, MAX_VIDEO_TITLE_LENGTH) ||
      (newVideoFileName ? newVideoFileName.replace(/\.[^/.]+$/, '').slice(0, MAX_VIDEO_TITLE_LENGTH) : '');

    if (!cleanTitle) {
      setAddError('Veuillez renseigner un titre court.');
      return;
    }

    const result = trySaveUserVideoSubmission({
      userId: profile.id,
      userType: profile.accountType || 'INDIVIDUAL',
      authorName: profile.name || 'Roméo Nonvide',
      authorAvatarUrl: profile.avatarUrl || '/assets/duos/paroles-armel.jpg',
      title: cleanTitle,
      synopsis:
        newSynopsis.trim() ||
        `Vidéo déposée dans « ${PROFILE_TAB_LABELS[selectedCategory]} ».`,
      universe: selectedCategory,
      profileTab: selectedCategory,
      videoUrl: newVideoPreviewUrl || '/sample.mp4',
      thumbnailUrl: profile.avatarUrl || '/Posters/Onboardings/mes-videos-hero.jpg'
    });

    if ('error' in result) {
      setAddError(result.error);
      return;
    }

    onRefreshVideos();
    setAddModalOpen(false);
    setCurrentIndex(0);
    onShowToast(`Vidéo ajoutée dans « ${PROFILE_TAB_LABELS[selectedCategory]} ».`);
  };

  return (
    <div className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between text-[#1C1917] select-none bg-transparent">
      <div className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-6 min-h-0 overflow-hidden flex flex-col justify-between pt-1 sm:pt-2">
        <StageBreadcrumb
          items={[
            { label: 'Profil', onClick: onBack },
            { label: 'Mes Vidéos' }
          ]}
        />

        <StageCarousel3D
          items={carouselSlots}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
          getKey={(slot) => (slot.kind === 'add' ? slot.id : slot.video.id)}
          circular={carouselSlots.length >= 3}
          dragDisabled={anyModalOpen}
          showDesktopArrows={true}
          prevAriaLabel="Vidéo précédente"
          nextAriaLabel="Vidéo suivante"
          onActiveCardClick={(slot) => {
            if (slot.kind === 'add') {
              openAddModal();
            }
          }}
          renderCard={(slot, idx, { isCenter }) => {
            if (slot.kind === 'add') {
              return (
                <div className="relative w-full h-full flex flex-col justify-between p-2.5 sm:p-4 text-white bg-[#121F4B] cursor-pointer">
                  <img
                    src="/Posters/Onboardings/mes-videos-hero.jpg"
                    alt="Ajouter une vidéo"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-45 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#121F4B]/20 via-[#121F4B]/25 to-[#121F4B]/70 pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between gap-1 w-full">
                    <div className="inline-flex items-center rounded-full px-2.5 py-1 bg-[#121F4B]/70 backdrop-blur-sm border border-white/20 shadow-md">
                      <span className="font-editorial text-[8.5px] sm:text-[9.5px] md:text-[10.5px] font-semibold text-white leading-tight tracking-wide">
                        Déposer
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-2 space-y-2.5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#A2482B] text-white border border-white/25 shadow-xl flex items-center justify-center">
                      <Plus className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-editorial text-sm sm:text-base font-bold text-white leading-snug">
                        Ajouter une vidéo
                      </p>
                      <p className="text-[10.5px] sm:text-xs text-white/80 leading-relaxed max-w-[180px]">
                        Choisissez la catégorie et déposez votre récit.
                      </p>
                    </div>
                  </div>

                  <div
                    className="relative z-10 w-full flex items-center justify-end pt-2"
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
                        openAddModal();
                      }}
                      className="px-3 py-1.5 sm:py-2 rounded-xl bg-[#121F4B]/70 backdrop-blur-sm hover:bg-[#A2482B] text-white font-medium text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer border border-white/20 hover:border-[#A2482B] hover:scale-105 active:scale-95"
                    >
                      <LegbaDoorIcon className="w-3.5 h-3.5 text-white/90" />
                      <span>Déposer</span>
                    </button>
                  </div>
                </div>
              );
            }

            const { video } = slot;
            const statusMeta = STATUS_BADGE_MAP[video.status] || STATUS_BADGE_MAP.PENDING;
            const isPlaying = isCenter && playingVideoId === video.id;

            return (
              <div className="relative w-full h-full flex flex-col justify-between p-2.5 sm:p-4 text-white bg-[#121F4B]">
                {isPlaying ? (
                  <video
                    src={video.videoUrl || '/sample.mp4'}
                    poster={video.thumbnailUrl || '/Posters/Onboardings/mes-videos-hero.jpg'}
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={video.thumbnailUrl || '/Posters/Onboardings/mes-videos-hero.jpg'}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = '/Posters/Onboardings/mes-videos-hero.jpg';
                    }}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-[#121F4B]/22 via-transparent to-[#121F4B]/72 pointer-events-none" />

                {/* HAUT : Pastille titre en haut à gauche + TvPlayerIcon en haut à droite */}
                <div className="relative z-10 flex items-center justify-between gap-1.5 w-full min-w-0">
                  <div className="inline-flex w-fit max-w-[calc(100%-64px)] min-w-0 items-center rounded-full px-2.5 py-1 bg-[#121F4B]/70 backdrop-blur-sm border border-white/20 shadow-md">
                    <span
                      className="font-editorial text-[8.5px] sm:text-[9.5px] md:text-[10.5px] font-semibold text-white leading-tight tracking-wide block w-full min-w-0 truncate"
                      title={video.title}
                    >
                      {video.title}
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-1 shrink-0"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    {isPlaying && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsMuted((prev) => !prev);
                        }}
                        className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-[#121F4B]/70 backdrop-blur-sm hover:bg-[#A2482B] border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                        title={isMuted ? 'Activer le son' : 'Couper le son'}
                        aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isCenter) {
                          setCurrentIndex(idx);
                          return;
                        }
                        setPlayingVideoId((prev) => (prev === video.id ? null : video.id));
                      }}
                      className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl text-white border flex items-center justify-center transition-all cursor-pointer shadow-md ${
                        isPlaying
                          ? 'bg-[#A2482B] border-[#F3C677]/60'
                          : 'bg-[#121F4B]/70 backdrop-blur-sm hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B]'
                      }`}
                      title={isPlaying ? 'Mettre en pause' : 'Lire la vidéo'}
                      aria-label={isPlaying ? 'Mettre en pause' : 'Lire la vidéo'}
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
                      ) : (
                        <TvPlayerIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" strokeWidth={1.7} />
                      )}
                    </button>
                  </div>
                </div>

                {/* MILIEU DROITE : Icônes seules avec texte au survol */}
                <div
                  className="absolute right-2.5 sm:right-3.5 top-[56%] sm:top-[58%] -translate-y-1/2 z-30 flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
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
                    className="group/action relative w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-[#121F4B]/70 backdrop-blur-sm hover:bg-[#A2482B] border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                    aria-label="Changer la couverture"
                  >
                    <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="pointer-events-none opacity-0 translate-x-1 group-hover/action:opacity-100 group-hover/action:translate-x-0 group-focus-visible/action:opacity-100 group-focus-visible/action:translate-x-0 transition-all duration-150 absolute right-full mr-2 whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#121F4B]/85 backdrop-blur-sm border border-white/20 text-[10px] font-medium tracking-wide text-white shadow-lg">
                      Changer la couverture
                    </span>
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
                      openTitleModal(video);
                    }}
                    className="group/action relative w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-[#121F4B]/70 backdrop-blur-sm hover:bg-[#A2482B] border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                    aria-label="Modifier le titre"
                  >
                    <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="pointer-events-none opacity-0 translate-x-1 group-hover/action:opacity-100 group-hover/action:translate-x-0 group-focus-visible/action:opacity-100 group-focus-visible/action:translate-x-0 transition-all duration-150 absolute right-full mr-2 whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#121F4B]/85 backdrop-blur-sm border border-white/20 text-[10px] font-medium tracking-wide text-white shadow-lg">
                      Modifier le titre
                    </span>
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
                    className="group/action relative w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-[#121F4B]/70 backdrop-blur-sm hover:bg-[#A2482B] border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="pointer-events-none opacity-0 translate-x-1 group-hover/action:opacity-100 group-hover/action:translate-x-0 group-focus-visible/action:opacity-100 group-focus-visible/action:translate-x-0 transition-all duration-150 absolute right-full mr-2 whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#121F4B]/85 backdrop-blur-sm border border-white/20 text-[10px] font-medium tracking-wide text-white shadow-lg">
                      Supprimer
                    </span>
                  </button>
                </div>

                {/* BAS GAUCHE : Statut discret et élégant */}
                <div className="relative z-10 w-full flex items-end justify-start pt-2 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 bg-[#121F4B]/70 backdrop-blur-sm border border-white/20 text-[9px] sm:text-[9.5px] font-medium tracking-wide text-white/95 shadow-xs whitespace-nowrap">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusMeta.dotClassName}`} />
                    <span>{statusMeta.label}</span>
                  </span>
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* ===================================================================== */}
      {/* MODALE 1 : CHANGER LA COUVERTURE (STRICTEMENT LARGEUR CARTE)          */}
      {/* ===================================================================== */}
      <CardWidthModal
        isOpen={Boolean(coverModalVideo)}
        onClose={() => setCoverModalVideo(null)}
        ariaLabel="Changer la couverture"
        className="overflow-hidden flex flex-col"
      >
        {coverModalVideo && (
          <>
            <div className="px-3.5 py-2.5 border-b border-stone-200/80 flex items-center justify-between gap-2">
              <h2 className="font-editorial text-xs sm:text-sm font-bold text-stone-900 truncate">
                Changer la couverture
              </h2>
              <button
                type="button"
                onClick={() => setCoverModalVideo(null)}
                className="w-7 h-7 rounded-lg hover:bg-[#A2482B]/10 text-[#A2482B] hover:text-[#8A3B22] flex items-center justify-center cursor-pointer shrink-0 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 sm:p-3.5 space-y-2.5">
              <div className="relative w-full aspect-[9/11] max-h-[210px] sm:max-h-[235px] rounded-2xl overflow-hidden bg-[#121F4B] border border-stone-200 flex items-center justify-center">
                <video
                  ref={videoPreviewRef}
                  src={coverModalVideo.videoUrl || '/sample.mp4'}
                  poster={coverModalVideo.thumbnailUrl || '/Posters/Onboardings/mes-videos-hero.jpg'}
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
                  className="absolute bottom-2.5 left-2.5 w-8 h-8 rounded-full bg-[#121F4B]/72 backdrop-blur-sm hover:bg-[#A2482B] text-white border border-white/20 flex items-center justify-center cursor-pointer transition-colors"
                  aria-label={isPreviewPlaying ? 'Pause' : 'Lecture'}
                >
                  {isPreviewPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-white" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  )}
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10.5px] text-stone-500 font-mono tabular-nums">
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
                <p className="text-[10.5px] text-rose-600 font-medium leading-snug">
                  {captureError}
                </p>
              )}

              <div className="flex flex-col gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={handleCaptureFrameAsCover}
                  className="w-full py-2 px-3 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
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
                  className="w-full py-2 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Importer une image</span>
                </button>
              </div>
            </div>
          </>
        )}
      </CardWidthModal>

      {/* ===================================================================== */}
      {/* MODALE 2 : MODIFIER LE TITRE (STRICTEMENT LARGEUR CARTE)              */}
      {/* ===================================================================== */}
      <CardWidthModal
        isOpen={Boolean(titleModalVideo)}
        onClose={() => setTitleModalVideo(null)}
        ariaLabel="Modifier le titre"
      >
        {titleModalVideo && (
          <form onSubmit={handleSaveTitle} className="flex flex-col">
            <div className="px-3.5 py-2.5 border-b border-stone-200/80 flex items-center justify-between gap-2">
              <h2 className="font-editorial text-xs sm:text-sm font-bold text-stone-900 truncate">
                Modifier le titre
              </h2>
              <button
                type="button"
                onClick={() => setTitleModalVideo(null)}
                className="w-7 h-7 rounded-lg hover:bg-[#A2482B]/10 text-[#A2482B] hover:text-[#8A3B22] flex items-center justify-center cursor-pointer shrink-0 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3.5 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-stone-700">
                    Titre court
                  </label>
                  <span
                    className={`text-[10.5px] font-mono font-bold tabular-nums ${
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
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#A2482B]"
                  placeholder="Titre court"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setTitleModalVideo(null)}
                  className="flex-1 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 text-[11px] font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!titleDraft.trim()}
                  className="flex-1 py-2 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] disabled:opacity-40 text-white text-[11px] font-bold cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </form>
        )}
      </CardWidthModal>

      {/* ===================================================================== */}
      {/* MODALE 3 : SUPPRESSION (STRICTEMENT LARGEUR CARTE)                    */}
      {/* ===================================================================== */}
      <CardWidthModal
        isOpen={Boolean(deleteConfirmVideo)}
        onClose={() => setDeleteConfirmVideo(null)}
        ariaLabel="Supprimer cette vidéo"
        className="p-4 space-y-3"
      >
        {deleteConfirmVideo && (
          <>
            <div className="space-y-1">
              <h2 className="font-editorial text-xs sm:text-sm font-bold text-stone-900">
                Supprimer cette vidéo ?
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed">
                « {deleteConfirmVideo.title} » sera retirée de votre espace.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmVideo(null)}
                className="flex-1 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 text-[11px] font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </>
        )}
      </CardWidthModal>

      {/* ===================================================================== */}
      {/* MODALE 4 : AJOUTER UNE VIDÉO + CHOIX CATÉGORIE (LARGEUR CARTE)        */}
      {/* ===================================================================== */}
      <CardWidthModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        ariaLabel="Ajouter une vidéo"
      >
        <div className="px-3.5 py-2.5 border-b border-stone-200/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {addStep === 'form' && (
              <button
                type="button"
                onClick={() => {
                  setAddStep('category');
                  setAddError(null);
                }}
                className="w-6 h-6 rounded-lg hover:bg-[#A2482B]/10 text-[#A2482B] hover:text-[#8A3B22] flex items-center justify-center cursor-pointer shrink-0 transition-colors"
                aria-label="Changer de catégorie"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
            <h2 className="font-editorial text-xs sm:text-sm font-bold text-stone-900 truncate">
              {addStep === 'category' ? 'Quelle catégorie ?' : PROFILE_TAB_LABELS[selectedCategory]}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setAddModalOpen(false)}
            className="w-7 h-7 rounded-lg hover:bg-[#A2482B]/10 text-[#A2482B] hover:text-[#8A3B22] flex items-center justify-center cursor-pointer shrink-0 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {addStep === 'category' ? (
          <div className="p-3.5 space-y-2">
            <p className="text-[11px] text-stone-500 leading-snug">
              Choisissez où classer cette vidéo :
            </p>

            <button
              type="button"
              onClick={() => handleSelectCategory('parcours')}
              className="w-full p-2.5 rounded-2xl border border-stone-200 bg-white hover:border-[#A2482B] text-left flex items-center justify-between gap-2 transition-colors cursor-pointer"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-stone-900 truncate">Parcours de vie</p>
                <p className="text-[10px] text-stone-500 truncate">
                  Itinéraire & étapes personnelles
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#A2482B] shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => handleSelectCategory('projets')}
              className="w-full p-2.5 rounded-2xl border border-stone-200 bg-white hover:border-[#A2482B] text-left flex items-center justify-between gap-2 transition-colors cursor-pointer"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-stone-900 truncate">Initiative personnelle</p>
                <p className="text-[10px] text-stone-500 truncate">
                  Atelier, projet ou action
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#A2482B] shrink-0" />
            </button>

            <div className="pt-1 border-t border-stone-200/70">
              <button
                type="button"
                onClick={() => {
                  setAddModalOpen(false);
                  onOpenStudioSubmit();
                }}
                className="w-full p-2.5 rounded-2xl bg-[#1F44A8] hover:bg-[#A2482B] text-white text-left flex items-center justify-between gap-2 transition-colors cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">Répondre à une série</p>
                  <p className="text-[10px] text-white/75 truncate">
                    Passer par le Studio complet
                  </p>
                </div>
                <LegbaDoorIcon className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitNewVideo} className="p-3.5 space-y-2.5">
            {addError && (
              <div
                role="alert"
                className="p-2 rounded-xl bg-amber-50 border border-amber-300 text-[#8A3B22] text-[10.5px] font-semibold flex items-start gap-1.5 leading-snug"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#A2482B]" />
                <span>{addError}</span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-stone-700">Titre</label>
                <span className="text-[10px] font-mono text-stone-400 tabular-nums">
                  {newTitle.length}/{MAX_VIDEO_TITLE_LENGTH}
                </span>
              </div>
              <input
                type="text"
                value={newTitle}
                maxLength={MAX_VIDEO_TITLE_LENGTH}
                onChange={(e) => {
                  setNewTitle(e.target.value.slice(0, MAX_VIDEO_TITLE_LENGTH));
                  if (addError) setAddError(null);
                }}
                placeholder="Ex : Retour aux sources"
                required
                className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#A2482B]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Fichier vidéo
              </label>
              <label className="relative border border-dashed border-stone-300 hover:border-[#A2482B] rounded-xl px-2.5 py-2 bg-white flex items-center justify-between gap-2 cursor-pointer">
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewVideoFileName(file.name);
                      try {
                        setNewVideoPreviewUrl(URL.createObjectURL(file));
                      } catch {
                        setNewVideoPreviewUrl('/sample.mp4');
                      }
                      if (!newTitle.trim()) {
                        setNewTitle(
                          file.name.replace(/\.[^/.]+$/, '').slice(0, MAX_VIDEO_TITLE_LENGTH)
                        );
                      }
                    }
                  }}
                  className="sr-only"
                />
                <span className="text-[11px] text-stone-600 truncate">
                  {newVideoFileName || 'Choisir MP4 / MOV'}
                </span>
                <Upload className="w-3.5 h-3.5 text-[#A2482B] shrink-0" />
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Synopsis court
              </label>
              <textarea
                rows={2}
                value={newSynopsis}
                onChange={(e) => setNewSynopsis(e.target.value)}
                placeholder="En quelques mots…"
                className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#A2482B] resize-none"
              />
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 text-[11px] font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-[11px] font-bold cursor-pointer"
              >
                Déposer
              </button>
            </div>
          </form>
        )}
      </CardWidthModal>
    </div>
  );
};
