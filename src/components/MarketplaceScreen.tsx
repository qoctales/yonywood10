import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { ViewScreen, AffiliationPerson } from '../types';
import { ActionClapperboardIcon } from './YonywoodBrandIcons';
import { FocusVideoCard } from './FocusVideoCard';
import { VideoCardShareModal } from './VideoCardShareModal';
import { ACTION_SHAREHOLDERS, ActionShareholderProfile } from '../data/actionShareholdersData';
import { celestialAudio } from '../utils/celestialAudio';
import { ChunkErrorBoundary } from './ChunkErrorBoundary';
import { lazyWithRetry } from '../utils/lazyWithRetry';
import { SHOW_FINANCIAL_SCREENS, SHOW_CAROUSEL_ARROWS } from '../config/flags';
import { StageCarousel3D } from './shared/StageCarousel3D';

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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [shareItem, setShareItem] = useState<{ title: string; id: string } | null>(null);
  const [seriesModalPerson, setSeriesModalPerson] = useState<ActionShareholderProfile | null>(null);

  const total = ACTION_SHAREHOLDERS.length;
  const currentPerson: ActionShareholderProfile =
    ACTION_SHAREHOLDERS[cardIndex % Math.max(1, total)] || ACTION_SHAREHOLDERS[0];

  const handleSelectCard = useCallback((nextIdx: number) => {
    setCardIndex(nextIdx);
    setVideoProgress(0);
    setIsPlaying(false);
    celestialAudio.playOrbSelect();
  }, []);

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
    if (!shareItem && !seriesModalPerson) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShareItem(null);
        setSeriesModalPerson(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shareItem, seriesModalPerson]);

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

  return (
    <div className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between text-[#1C1917] select-none bg-white relative">
      <div className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-6 min-h-0 overflow-hidden flex flex-col justify-between pt-1 sm:pt-2">
        <StageCarousel3D
          items={ACTION_SHAREHOLDERS}
          currentIndex={cardIndex}
          onIndexChange={handleSelectCard}
          getKey={(person) => person.id}
          circular={total >= 3}
          dragDisabled={Boolean(shareItem || seriesModalPerson)}
          showDesktopArrows={SHOW_CAROUSEL_ARROWS}
          prevAriaLabel="Coproduction précédente"
          nextAriaLabel="Coproduction suivante"
          renderCard={(person, _idx, { isCenter }) => {
            const personFirstName = formatFirstName(person.name);
            return (
              <FocusVideoCard
                embeddedInCarousel={true}
                isActive={isCenter}
                mediaKey={person.id}
                videoUrl={person.video}
                photoUrl={person.photo}
                displayName={personFirstName}
                phrase={person.phrase}
                videoRef={videoRef}
                isPlaying={isCenter && isPlaying}
                isMuted={isMuted}
                videoProgress={isCenter ? videoProgress : 0}
                dragOffset={0}
                isDragging={false}
                onTogglePlay={() => {
                  if (!isCenter) return;
                  setIsPlaying((p) => !p);
                }}
                onToggleMute={() => setIsMuted((m) => !m)}
                onTimeUpdate={handleTimeUpdate}
                onOpenSeries={() => setSeriesModalPerson(person)}
                seriesTitle={
                  person.series.length > 1
                    ? 'Voir les séries'
                    : 'Voir la série'
                }
                onOpenPortrait={() => handleOpenPortrait(person)}
                portraitTitle={`Portrait de ${personFirstName}`}
                onOpenShare={() =>
                  setShareItem({
                    title: `${personFirstName} — ${person.series.join(' · ')}`,
                    id: person.id,
                  })
                }
              />
            );
          }}
        />
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
