import React, { useState, useEffect } from 'react';
import { Check, Scroll, Volume2, VolumeX, Pause, X } from 'lucide-react';
import { DOCUMENTARIES } from '../../data/mockData';
import {
  SERIES_REGISTRY,
  SeriesRegistryEntry,
  resolveCanonicalSeriesId
} from '../../data/seriesRegistry';
import { TvPlayerIcon } from '../YonywoodBrandIcons';
import { StageCarousel3D } from '../shared/StageCarousel3D';
import { StageBreadcrumb } from '../shared/StageBreadcrumb';
import { CardWidthModal } from '../shared/CardWidthModal';

interface SeriesSelectionSectionProps {
  selectedDocFilter: string[];
  onUpdateDocFilter: (filter: string[]) => void;
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

export const SeriesSelectionSection: React.FC<SeriesSelectionSectionProps> = ({
  selectedDocFilter,
  onUpdateDocFilter,
  onBack,
  onShowToast
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [playingSeriesId, setPlayingSeriesId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [synopsisSeries, setSynopsisSeries] = useState<SeriesRegistryEntry | null>(null);

  const normalizedSelection = Array.from(
    new Set(
      selectedDocFilter
        .map((id) => resolveCanonicalSeriesId(id) || id)
        .filter((id) => SERIES_REGISTRY.some((s) => s.id === id))
    )
  );

  useEffect(() => {
    setPlayingSeriesId(null);
  }, [currentIndex]);

  const handleToggleSeries = (seriesId: string) => {
    const isChecked = normalizedSelection.includes(seriesId);
    if (isChecked) {
      if (normalizedSelection.length <= 1) {
        onShowToast('Au moins une série doit rester sélectionnée.');
        return;
      }
      onUpdateDocFilter(normalizedSelection.filter((id) => id !== seriesId));
    } else {
      onUpdateDocFilter([...normalizedSelection, seriesId]);
    }
  };

  return (
    <div className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between text-[#1C1917] select-none bg-white">
      <div className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-6 min-h-0 overflow-hidden flex flex-col justify-between pt-1 sm:pt-2">
        <StageBreadcrumb
          items={[
            { label: 'Profil', onClick: onBack },
            { label: 'Mes Séries' }
          ]}
        />

        <StageCarousel3D
          items={SERIES_REGISTRY}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
          getKey={(series) => series.id}
          circular={true}
          dragDisabled={Boolean(synopsisSeries)}
          showDesktopArrows={true}
          prevAriaLabel="Série précédente"
          nextAriaLabel="Série suivante"
          renderCard={(series, idx, { isCenter }) => {
            const doc = DOCUMENTARIES.find((d) => d.id === series.id);
            const isChecked = normalizedSelection.includes(series.id);
            const hasVideo = Boolean(doc?.teaserVideoUrl);
            const isPlaying = isCenter && playingSeriesId === series.id && hasVideo;

            return (
              <div className="relative w-full h-full flex flex-col justify-between p-2.5 sm:p-4 text-white bg-[#151513]">
                {isPlaying && doc?.teaserVideoUrl ? (
                  <video
                    src={doc.teaserVideoUrl}
                    poster={doc?.coverImage || series.posterUrl}
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={doc?.coverImage || series.posterUrl}
                    alt={series.title}
                    loading={isCenter ? 'eager' : 'lazy'}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = '/assets/images/pillar_casting_phoenix.png';
                    }}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

                {/* HAUT : Pastille titre en haut à gauche + Lecture vidéo si disponible */}
                <div className="relative z-10 flex items-center justify-between gap-1 w-full min-w-0">
                  <div className="inline-flex w-fit max-w-[calc(100%-64px)] min-w-0 items-center rounded-full px-2.5 py-1 bg-black/75 border border-white/20 shadow-md">
                    <span
                      className="font-editorial text-[8.5px] sm:text-[9.5px] md:text-[10.5px] font-semibold text-white leading-tight tracking-wide select-none truncate"
                      title={series.title}
                    >
                      {series.title}
                    </span>
                  </div>

                  {hasVideo && (
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
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-black/75 hover:bg-[#A2482B] border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                          title={isMuted ? 'Activer le son' : 'Couper le son'}
                          aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                        >
                          {isMuted ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
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
                          setPlayingSeriesId((prev) =>
                            prev === series.id ? null : series.id
                          );
                        }}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-white border flex items-center justify-center transition-all cursor-pointer shadow-md ${
                          isPlaying
                            ? 'bg-[#A2482B] border-[#F3C677]/60'
                            : 'bg-black/75 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B]'
                        }`}
                        title={isPlaying ? 'Mettre en pause' : `Aperçu de ${series.title}`}
                        aria-label={isPlaying ? 'Mettre en pause' : `Aperçu de ${series.title}`}
                      >
                        {isPlaying ? (
                          <Pause className="w-3.5 h-3.5 fill-white" />
                        ) : (
                          <TvPlayerIcon className="w-4 h-4 text-white" strokeWidth={1.7} />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* BAS : Papyrus synopsis (gauche) + Encoche de validation (droite) */}
                <div
                  className="relative z-10 w-full flex items-center justify-between pointer-events-auto pt-2"
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSynopsisSeries(series);
                    }}
                    className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-black/70 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                    title="Lire le synopsis"
                    aria-label={`Synopsis de ${series.title}`}
                  >
                    <Scroll className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </button>

                  <button
                    type="button"
                    aria-pressed={isChecked}
                    aria-label={
                      isChecked
                        ? `${series.title} sélectionnée — cliquer pour retirer`
                        : `Sélectionner ${series.title}`
                    }
                    title={isChecked ? 'Série sélectionnée' : 'Sélectionner cette série'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!isCenter) {
                        setCurrentIndex(idx);
                        return;
                      }
                      handleToggleSeries(series.id);
                    }}
                    className="group/check p-1 -m-1 flex items-center justify-center cursor-pointer"
                  >
                    <span
                      className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-200 border shadow-sm group-hover/check:scale-110 group-active/check:scale-95 ${
                        isChecked
                          ? 'bg-[#A2482B]/90 border-[#F3C677]/75 text-white'
                          : 'bg-black/45 group-hover/check:bg-black/75 border-white/35 text-transparent group-hover/check:text-white/55'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </span>
                  </button>
                </div>
              </div>
            );
          }}
        />
      </div>

      <CardWidthModal
        isOpen={Boolean(synopsisSeries)}
        onClose={() => setSynopsisSeries(null)}
        ariaLabel={synopsisSeries ? `Synopsis — ${synopsisSeries.title}` : 'Synopsis'}
        className="p-4 sm:p-5 space-y-3"
      >
        {synopsisSeries && (
          <>
            <div className="flex items-center gap-2 border-b border-stone-200/80 pb-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center shrink-0">
                <Scroll className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-editorial text-xs sm:text-sm font-semibold text-stone-900 leading-tight flex-1 min-w-0 truncate">
                {synopsisSeries.title}
              </h3>
              <button
                type="button"
                onClick={() => setSynopsisSeries(null)}
                className="w-7 h-7 rounded-lg hover:bg-stone-200/70 text-stone-400 hover:text-stone-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Fermer"
                aria-label="Fermer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="py-0.5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Synopsis
              </span>
              <p className="text-stone-700 text-xs sm:text-[13px] leading-relaxed">
                {synopsisSeries.synopsis}
              </p>
            </div>
          </>
        )}
      </CardWidthModal>
    </div>
  );
};
