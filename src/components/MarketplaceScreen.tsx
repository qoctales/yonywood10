import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { ViewScreen, AffiliationPerson } from '../types';
import { ActionClapperboardIcon } from './YonywoodBrandIcons';
import { FocusVideoCard } from './FocusVideoCard';
import { STAGE_PERSPECTIVE } from '../config/cardLayout';
import { VideoCardShareModal } from './VideoCardShareModal';
import { ACTION_SHAREHOLDERS, ActionShareholderProfile } from '../data/actionShareholdersData';
import { celestialAudio } from '../utils/celestialAudio';
import { ChunkErrorBoundary } from './ChunkErrorBoundary';
import { lazyWithRetry } from '../utils/lazyWithRetry';
import { SHOW_FINANCIAL_SCREENS, SHOW_CAROUSEL_ARROWS } from '../config/flags';

// Masquage temporaire de l'ancien marché financier (dérivé de SHOW_FINANCIAL_SCREENS, conservé sans suppression)
const ENABLE_LEGACY_FINANCIAL_MARKETPLACE = SHOW_FINANCIAL_SCREENS;

const LazyLegacyMarketplaceScreen = lazyWithRetry(() =>
  import('./LegacyMarketplaceScreen').then((m) => ({ default: m.LegacyMarketplaceScreen }))
);

export interface MarketplaceScreenProps {
  onNavigate: (screen: ViewScreen) => void;
  initialPeerOfferId?: string;
  initialPeerIndex?: number;
  initialTab?: 'coproduire' | 'marche';
  restoreContext?: {
    offerId: string;
    offerIndex: number;
    sellerId: string;
    sellerName: string;
    sharesCount: number;
    unitPrice: number;
    seriesTitle: string;
  };
}

const ActionShareholdersFeed: React.FC<{ onNavigate: (screen: ViewScreen) => void }> = ({
  onNavigate,
}) => {
  const [cardIndex, setCardIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [shareItem, setShareItem] = useState<{ title: string; id: string } | null>(null);
  const [seriesModalPerson, setSeriesModalPerson] = useState<ActionShareholderProfile | null>(null);

  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const didSwipeRef = useRef<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);

  const total = ACTION_SHAREHOLDERS.length;
  const currentPerson: ActionShareholderProfile =
    ACTION_SHAREHOLDERS[cardIndex % Math.max(1, total)] || ACTION_SHAREHOLDERS[0];

  const handleNextCard = useCallback(() => {
    if (total <= 1) return;
    setCardIndex((prev) => (prev + 1) % total);
    setVideoProgress(0);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  }, [total]);

  const handlePrevCard = useCallback(() => {
    if (total <= 1) return;
    setCardIndex((prev) => (prev - 1 + total) % total);
    setVideoProgress(0);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  }, [total]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !currentPerson?.video) return;

    if (isPlaying) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isPlaying, cardIndex, currentPerson?.video]);

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid) return;
    const cTime = vid.currentTime;
    const dur = vid.duration || 176;
    setVideoProgress((cTime / dur) * 100);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (shareItem || seriesModalPerson) {
        if (e.key === 'Escape') {
          setShareItem(null);
          setSeriesModalPerson(null);
        }
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shareItem, seriesModalPerson, handleNextCard, handlePrevCard]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (shareItem || seriesModalPerson) return;
    if ((e.target as HTMLElement).closest('button, input, a, [role="button"]')) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = Date.now();
    isDraggingRef.current = true;
    didSwipeRef.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.touches[0].clientX - touchStartXRef.current;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 6) {
      didSwipeRef.current = true;
      setDragOffset(Math.max(-75, Math.min(75, deltaX * 0.45)));
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const elapsed = Date.now() - touchStartTimeRef.current;
    const velocity = Math.abs(deltaX) / Math.max(1, elapsed);

    if (Math.abs(deltaX) > 24 || velocity > 0.28) {
      didSwipeRef.current = true;
      if (deltaX < 0) handleNextCard();
      else handlePrevCard();
    }
    setDragOffset(0);
    setTimeout(() => {
      didSwipeRef.current = false;
    }, 60);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (shareItem || seriesModalPerson) return;
    if ((e.target as HTMLElement).closest('button, input, a, [role="button"]')) return;
    touchStartXRef.current = e.clientX;
    touchStartTimeRef.current = Date.now();
    isDraggingRef.current = true;
    didSwipeRef.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 6) {
      didSwipeRef.current = true;
      setDragOffset(Math.max(-75, Math.min(75, deltaX * 0.45)));
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const deltaX = e.clientX - touchStartXRef.current;
    const elapsed = Date.now() - touchStartTimeRef.current;
    const velocity = Math.abs(deltaX) / Math.max(1, elapsed);

    if (Math.abs(deltaX) > 24 || velocity > 0.28) {
      didSwipeRef.current = true;
      if (deltaX < 0) handleNextCard();
      else handlePrevCard();
    }
    setDragOffset(0);
    setTimeout(() => {
      didSwipeRef.current = false;
    }, 60);
  };

  const formatCleanFullName = (rawName: string) =>
    rawName.replace(/\s*\(EXEMPLE\)\s*/gi, '').trim();

  const formatFirstName = (rawName: string) => {
    const clean = formatCleanFullName(rawName);
    return clean.split(/\s+/)[0] || clean;
  };

  const handleOpenPortrait = (person: ActionShareholderProfile) => {
    const cleanName = formatCleanFullName(person.name);
    try {
      const previewProfile: AffiliationPerson = {
        id: person.protagonistId,
        name: cleanName,
        age: 34,
        role: `Coproducteur · ${person.series.join(' · ')}`,
        territory: 'Cotonou',
        country: 'Bénin',
        flag: '🇧🇯',
        universeTag: person.series[0] || 'YonyWood',
        photoUrl: person.photo,
        badge: 'Coproducteur',
        invitationStory: person.phrase,
        teaserVideoUrl: person.video || '/sample.mp4',
        teaserPitch: person.phrase,
      };
      localStorage.setItem(`yonywood_person_${person.protagonistId}`, JSON.stringify(previewProfile));
    } catch {
      // ignore storage quota errors
    }
    onNavigate({ type: 'profile', protagonistId: person.protagonistId });
  };

  if (!currentPerson) return null;

  const firstName = formatFirstName(currentPerson.name);

  return (
    <div className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-center text-[#1C1917] select-none bg-white relative">
      {/* Fil vertical de cartes vidéo (format et swipe identiques à Focus, sans bandeau haut) */}
      <div
        className="relative flex-1 flex flex-col items-center justify-center min-h-0 py-1 px-3 sm:px-4 my-auto select-none overflow-hidden touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => { isDraggingRef.current = false; setDragOffset(0); }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div
          className="relative w-full flex-1 flex items-center justify-center min-h-0 animate-in fade-in duration-200"
          style={{
            perspective: STAGE_PERSPECTIVE,
            perspectiveOrigin: 'center center'
          }}
        >
          {SHOW_CAROUSEL_ARROWS && total > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevCard}
                className="hidden md:flex absolute left-4 lg:left-8 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-[#1C1917] text-stone-800 hover:text-white border border-stone-200 shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                title="Carte précédente"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextCard}
                className="hidden md:flex absolute right-4 lg:right-8 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-[#1C1917] text-stone-800 hover:text-white border border-stone-200 shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                title="Carte suivante"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <FocusVideoCard
            mediaKey={currentPerson.id}
            videoUrl={currentPerson.video}
            photoUrl={currentPerson.photo}
            displayName={firstName}
            phrase={currentPerson.phrase}
            videoRef={videoRef}
            isPlaying={isPlaying}
            isMuted={isMuted}
            videoProgress={videoProgress}
            dragOffset={dragOffset}
            isDragging={isDraggingRef.current}
            onTogglePlay={() => {
              if (didSwipeRef.current) {
                didSwipeRef.current = false;
                return;
              }
              setIsPlaying((p) => !p);
            }}
            onToggleMute={() => setIsMuted((m) => !m)}
            onTimeUpdate={handleTimeUpdate}
            onOpenSeries={() => setSeriesModalPerson(currentPerson)}
            seriesTitle={
              currentPerson.series.length > 1
                ? 'Voir les séries'
                : 'Voir la série'
            }
            onOpenPortrait={() => handleOpenPortrait(currentPerson)}
            portraitTitle={`Portrait de ${firstName}`}
            onOpenShare={() =>
              setShareItem({
                title: `${firstName} — ${currentPerson.series.join(' · ')}`,
                id: currentPerson.id,
              })
            }
          />
        </div>
      </div>

      {seriesModalPerson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setSeriesModalPerson(null);
          }}
        >
          <div
            className="w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] bg-[#FAF7F2] rounded-3xl p-4 sm:p-5 shadow-2xl border border-stone-200 space-y-3 animate-in zoom-in-95 duration-200 text-stone-800 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête épuré : Icône Clap + Titre « Coproduction » */}
            <div className="flex items-center gap-2.5 border-b border-stone-200/80 pb-2.5">
              <div className="w-7.5 h-7.5 rounded-xl bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center shrink-0">
                <ActionClapperboardIcon className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="font-editorial text-sm sm:text-base font-semibold text-stone-900 leading-snug">
                  Coproduction
                </h3>
              </div>
            </div>

            {/* Liste simple des séries associées (sans encart ni bordure par ligne) */}
            <div className="py-0.5 space-y-1.5">
              {seriesModalPerson.series.map((seriesName) => (
                <p
                  key={seriesName}
                  className="text-stone-800 text-xs sm:text-[13px] font-medium leading-relaxed break-words"
                >
                  {seriesName}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {shareItem && (
        <VideoCardShareModal
          isOpen={true}
          onClose={() => setShareItem(null)}
          videoTitle={shareItem.title}
          videoId={shareItem.id}
          shareUrl={typeof window !== 'undefined' ? `${window.location.origin}/action` : ''}
        />
      )}
    </div>
  );
};

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = (props) => {
  if (!ENABLE_LEGACY_FINANCIAL_MARKETPLACE) {
    return <ActionShareholdersFeed onNavigate={props.onNavigate} />;
  }
  return (
    <ChunkErrorBoundary resetKey="legacy-marketplace">
      <Suspense fallback={<div className="w-full h-full bg-[#FAFAF9]" />}>
        <LazyLegacyMarketplaceScreen {...props} />
      </Suspense>
    </ChunkErrorBoundary>
  );
};
