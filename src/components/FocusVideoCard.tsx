import React from 'react';
import { Volume2, VolumeX, Play, ArrowLeft } from 'lucide-react';
import { ProfileSoloIcon, TvPlayerIcon, ActionClapperboardIcon, BriefcaseIcon } from './YonywoodBrandIcons';
import { ShareIcon } from './ShareIcon';
import { STAGE_CARD_DIMENSIONS_CLASS, STAGE_CENTER_TRANSLATE_Z } from '../config/cardLayout';

export interface FocusVideoCardProps {
  mediaKey: string;
  topLeftLabel?: string;
  topLeftBadges?: string[];
  topLeftFullTitle?: string;
  topLeftShowBackArrow?: boolean;
  onTopLeftClick?: () => void;
  videoUrl?: string;
  photoUrl?: string;
  displayName: string;
  phrase?: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  isMuted: boolean;
  videoProgress: number;
  dragOffset: number;
  isDragging: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onTimeUpdate: () => void;
  onVideoEnded?: () => void;
  onOpenSeries?: () => void;
  seriesTitle?: string;
  onOpenPortrait: () => void;
  portraitTitle: string;
  onOpenShare: () => void;
}

export const FocusVideoCard: React.FC<FocusVideoCardProps> = ({
  mediaKey,
  topLeftLabel,
  topLeftBadges,
  topLeftFullTitle,
  topLeftShowBackArrow = false,
  onTopLeftClick,
  videoUrl,
  photoUrl,
  displayName,
  phrase,
  videoRef,
  isPlaying,
  isMuted,
  videoProgress,
  dragOffset,
  isDragging,
  onTogglePlay,
  onToggleMute,
  onTimeUpdate,
  onVideoEnded,
  onOpenSeries,
  seriesTitle,
  onOpenPortrait,
  portraitTitle,
  onOpenShare,
}) => {
  const hasVideo = Boolean(videoUrl);
  const resolvedVideoUrl =
    !videoUrl || videoUrl.includes('commondatastorage.googleapis.com')
      ? '/sample.mp4'
      : videoUrl;

  return (
    <div
      className={`relative ${STAGE_CARD_DIMENSIONS_CLASS} rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 bg-[#12110F] text-white flex flex-col justify-between select-none shadow-2xl ring-1 ring-white/20`}
      style={{
        transform: `translateX(${dragOffset}px) translateZ(${STAGE_CENTER_TRANSLATE_Z}px)`,
        transition: isDragging ? 'none' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* EN-TÊTE DE LA CARTE : PASTILLES SÉRIE(S) EN HAUT À GAUCHE + CONTRÔLES LECTURE EN HAUT À DROITE */}
      <div className="relative z-30 pt-3 px-3 flex items-start justify-between gap-1 pointer-events-auto">
        {onTopLeftClick ? (
          <button
            type="button"
            onClick={onTopLeftClick}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 hover:bg-[#A2482B] border border-white/20 shadow-md text-white transition-colors cursor-pointer max-w-[calc(100%-80px)]"
            title={topLeftFullTitle || topLeftLabel}
          >
            {topLeftShowBackArrow && <ArrowLeft className="w-3.5 h-3.5 shrink-0 text-white/90" />}
            <span className="font-editorial text-xs font-semibold text-white whitespace-nowrap tracking-wide select-none truncate">
              {topLeftLabel}
            </span>
          </button>
        ) : topLeftBadges && topLeftBadges.length > 0 ? (
          <div className="flex flex-col items-start gap-1 max-w-[calc(100%-80px)]">
            {topLeftBadges.map((seriesTitle, idx) => (
              <div
                key={seriesTitle}
                className={`inline-flex items-center gap-1.5 rounded-full shadow-md max-w-full ${
                  idx === 0
                    ? 'px-2.5 sm:px-3 py-1 bg-black/75 border border-white/20 text-white'
                    : 'px-2.5 py-0.5 bg-black/70 border border-white/15 text-[#FFE7A3]'
                }`}
                title={seriesTitle}
              >
                <ActionClapperboardIcon
                  className={`shrink-0 ${idx === 0 ? 'w-3.5 h-3.5 text-[#FFE7A3]' : 'w-3 h-3 text-[#FFE7A3]'}`}
                  strokeWidth={1.75}
                  isActive={true}
                />
                <span
                  className={`font-editorial font-semibold whitespace-nowrap tracking-wide select-none truncate ${
                    idx === 0 ? 'text-xs text-white' : 'text-[10.5px] sm:text-[11px] text-[#FFE7A3]'
                  }`}
                >
                  {seriesTitle}
                </span>
              </div>
            ))}
          </div>
        ) : topLeftLabel ? (
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 border border-white/20 shadow-md text-white max-w-[calc(100%-80px)]"
            title={topLeftFullTitle || topLeftLabel}
          >
            <span className="font-editorial text-xs font-semibold text-white whitespace-nowrap tracking-wide select-none truncate">
              {topLeftLabel}
            </span>
          </div>
        ) : (
          <div />
        )}

        {/* Contrôles de lecture (Son & Télé) uniquement s'il y a une vidéo */}
        {hasVideo && (
          <div className="flex items-center gap-1.5">
            {isPlaying && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMute();
                }}
                className="w-8 h-8 rounded-xl bg-black/75 text-white hover:bg-black/85 border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
                title={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePlay();
              }}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                isPlaying
                  ? 'bg-[#A2482B] text-white border border-[#8A3B22]'
                  : 'bg-black/75 text-white border border-white/20 hover:bg-black/85'
              }`}
              title={isPlaying ? 'Mettre en pause' : 'Lancer la vidéo'}
            >
              <TvPlayerIcon className="w-4.5 h-4.5 text-current" />
            </button>
          </div>
        )}
      </div>

      {/* LECTEUR VIDÉO OU PHOTO PLEIN CADRE */}
      {hasVideo ? (
        <div
          onClick={onTogglePlay}
          className="absolute inset-0 overflow-hidden cursor-pointer"
        >
          <video
            ref={videoRef}
            key={mediaKey}
            src={resolvedVideoUrl}
            poster={photoUrl}
            preload="metadata"
            playsInline
            autoPlay={isPlaying}
            muted={isMuted}
            loop={!onVideoEnded}
            onTimeUpdate={onTimeUpdate}
            onEnded={onVideoEnded}
            className="w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

          {!isPlaying && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-black/65 border border-white/25 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
                <Play className="w-6 h-6 ml-0.5 fill-white text-white opacity-90" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="absolute inset-0 overflow-hidden">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={displayName}
              decoding="async"
              className="w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <div className="w-full h-full bg-stone-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/35 pointer-events-none" />
        </div>
      )}

      {/* BOUTONS CÔTÉ DROIT : SÉRIES (OPTIONNEL), PORTRAIT ET PARTAGE */}
      <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2.5 pointer-events-auto">
        {onOpenSeries && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSeries();
            }}
            className="w-8.5 h-8.5 rounded-xl bg-black/75 text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group active:scale-95"
            title={seriesTitle || 'Séries associées'}
          >
            <BriefcaseIcon
              className="w-4 h-4 text-white group-hover:scale-110 transition-transform"
              isActive={true}
            />
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenPortrait();
          }}
          className="w-8.5 h-8.5 rounded-xl bg-black/75 text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group active:scale-95"
          title={portraitTitle}
        >
          <ProfileSoloIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" isActive={true} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenShare();
          }}
          className="w-8.5 h-8.5 rounded-xl bg-black/75 text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group active:scale-95"
          title="Partager"
        >
          <ShareIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* BAS DE CARTE : PRÉNOM, PHRASE (SI PHOTO) & BARRE DE LECTURE */}
      <div className="absolute bottom-3.5 sm:bottom-4 left-3.5 sm:left-4 right-14 z-20 pointer-events-none flex flex-col items-start">
        <h2 className="font-editorial text-base sm:text-lg font-bold text-white tracking-wide drop-shadow-md truncate max-w-full leading-tight">
          {displayName}
        </h2>

        {!hasVideo && phrase && (
          <p className="mt-1.5 text-[11px] sm:text-xs text-white/90 italic leading-snug drop-shadow line-clamp-3">
            « {phrase} »
          </p>
        )}

        {hasVideo && (
          <div className="h-2 flex items-center mt-1">
            <div
              className={`w-20 sm:w-24 h-1 bg-white/25 rounded-full overflow-hidden shadow-xs transition-opacity duration-200 ${
                isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="h-full bg-white transition-all duration-100 rounded-full"
                style={{ width: `${Math.max(2, Math.min(100, videoProgress))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
