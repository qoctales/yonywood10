import React, { useState, useEffect } from 'react';
import { Scroll, Plus, Eye, Film, Users, X, Trash2 } from 'lucide-react';
import { StageCarousel3D } from '../shared/StageCarousel3D';
import { StageBreadcrumb } from '../shared/StageBreadcrumb';
import { CardWidthModal } from '../shared/CardWidthModal';
import { ProductionTokenIcon } from '../YonywoodBrandIcons';
import {
  UserCoproductionEntry,
  getUserCoproductions,
  removeUserCoproduction,
  getSeriesStats,
  formatViewsCompact,
  formatFcfa,
  DEMO_SHARE_UNIT_FCFA,
  COPRODUCTIONS_UPDATED_EVENT
} from '../../utils/coproductionService';
import { resolveSeriesById } from '../../data/seriesRegistry';

interface CoproductionsSectionProps {
  onOpenStudio: () => void;
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

type CoprodSlot =
  | { kind: 'entry'; entry: UserCoproductionEntry }
  | { kind: 'explore'; id: '__explore_coproductions__' };

export const CoproductionsSection: React.FC<CoproductionsSectionProps> = ({
  onOpenStudio,
  onBack,
  onShowToast
}) => {
  const [entries, setEntries] = useState<UserCoproductionEntry[]>(() =>
    getUserCoproductions()
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [detailEntry, setDetailEntry] = useState<UserCoproductionEntry | null>(null);

  useEffect(() => {
    const sync = () => setEntries(getUserCoproductions());
    window.addEventListener('storage', sync);
    window.addEventListener(COPRODUCTIONS_UPDATED_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(COPRODUCTIONS_UPDATED_EVENT, sync);
    };
  }, []);

  const slots: CoprodSlot[] = [
    ...entries.map((entry): CoprodSlot => ({ kind: 'entry', entry })),
    { kind: 'explore', id: '__explore_coproductions__' }
  ];

  useEffect(() => {
    if (currentIndex >= slots.length) {
      setCurrentIndex(Math.max(0, slots.length - 1));
    }
  }, [slots.length, currentIndex]);

  const handleRemove = (seriesId: string, seriesTitle: string) => {
    const updated = removeUserCoproduction(seriesId);
    setEntries(updated);
    setDetailEntry(null);
    onShowToast(`Coproduction retirée pour ${seriesTitle}.`);
  };

  return (
    <div className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between text-[#1C1917] select-none bg-transparent">
      <div className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-6 min-h-0 overflow-hidden flex flex-col justify-between pt-1 sm:pt-2">
        <StageBreadcrumb
          items={[
            { label: 'Profil', onClick: onBack },
            { label: 'Coproductions' }
          ]}
        />

        <StageCarousel3D
          items={slots}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
          getKey={(slot) => (slot.kind === 'entry' ? slot.entry.seriesId : slot.id)}
          circular={slots.length >= 3}
          dragDisabled={Boolean(detailEntry)}
          showDesktopArrows={true}
          prevAriaLabel="Coproduction précédente"
          nextAriaLabel="Coproduction suivante"
          onActiveCardClick={(slot) => {
            if (slot.kind === 'explore') {
              onOpenStudio();
            } else {
              setDetailEntry(slot.entry);
            }
          }}
          renderCard={(slot, _idx, { isCenter }) => {
            if (slot.kind === 'explore') {
              return (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-5 text-center bg-[#FAF7F2] text-[#1C1917]">
                  <div className="w-12 h-12 rounded-2xl bg-[#A2482B]/12 text-[#A2482B] flex items-center justify-center mb-3 border border-[#A2482B]/20">
                    {entries.length === 0 ? (
                      <ProductionTokenIcon className="w-6 h-6" strokeWidth={1.75} />
                    ) : (
                      <Plus className="w-6 h-6" />
                    )}
                  </div>
                  <h3 className="font-editorial text-sm sm:text-base font-bold text-[#1C1917] mb-1.5">
                    {entries.length === 0
                      ? 'Aucune coproduction'
                      : 'Coproduire une série'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed mb-4">
                    {entries.length === 0
                      ? 'Depuis le Studio, touchez l’icône de coproduction sur la série de votre choix.'
                      : 'Ajoutez une nouvelle série depuis le Studio.'}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCenter) onOpenStudio();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs font-semibold shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    Ouvrir le Studio
                  </button>
                </div>
              );
            }

            const { entry } = slot;
            const stats = getSeriesStats(entry.seriesId);
            const totalSimulated = entry.sharesCount * (entry.unitAmountFcfa || DEMO_SHARE_UNIT_FCFA);

            return (
              <div className="relative w-full h-full flex flex-col justify-between p-2.5 sm:p-4 text-white bg-[#151513]">
                <img
                  src={entry.posterUrl}
                  alt={entry.seriesTitle}
                  loading={isCenter ? 'eager' : 'lazy'}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-black/85 pointer-events-none" />

                {/* HAUT : Titre série */}
                <div className="relative z-10 flex items-center justify-between gap-1.5 w-full min-w-0">
                  <div className="inline-flex w-fit max-w-full min-w-0 items-center rounded-full px-2.5 py-1 bg-black/75 border border-white/20 shadow-md">
                    <span className="font-editorial text-[8.5px] sm:text-[10px] font-semibold text-white truncate">
                      {entry.seriesTitle}
                    </span>
                  </div>
                </div>

                {/* BAS : Détail papyrus + Parts */}
                <div
                  className="relative z-10 w-full flex items-end justify-between gap-2 pointer-events-auto pt-2"
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDetailEntry(entry);
                    }}
                    className="w-8 h-8 rounded-xl bg-black/75 hover:bg-[#A2482B] text-white border border-white/20 flex items-center justify-center shadow-md transition-all cursor-pointer"
                    title="Détails de la coproduction"
                    aria-label={`Détails de ${entry.seriesTitle}`}
                  >
                    <Scroll className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <div className="text-right bg-black/75 border border-white/20 rounded-xl px-2.5 py-1.5 shadow-md">
                    <div className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                      {entry.sharesCount} {entry.sharesCount > 1 ? 'parts' : 'part'} ({formatFcfa(totalSimulated)})
                    </div>
                    <div className="text-[9.5px] text-stone-300 leading-tight mt-0.5">
                      {formatViewsCompact(stats.viewsCount)} vues · {stats.duosCount} duos
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>

      <CardWidthModal
        isOpen={Boolean(detailEntry)}
        onClose={() => setDetailEntry(null)}
        ariaLabel={detailEntry ? `Coproduction — ${detailEntry.seriesTitle}` : 'Coproduction'}
        className="p-4 sm:p-5 space-y-3 text-[#1C1917]"
      >
        {detailEntry && (() => {
          const stats = getSeriesStats(detailEntry.seriesId);
          const seriesMeta = resolveSeriesById(detailEntry.seriesId);
          const totalSimulated = detailEntry.sharesCount * (detailEntry.unitAmountFcfa || DEMO_SHARE_UNIT_FCFA);

          return (
            <>
              <div className="flex items-center gap-2 border-b border-stone-200/80 pb-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center shrink-0">
                  <ProductionTokenIcon className="w-3.5 h-3.5" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-editorial text-xs sm:text-sm font-semibold text-[#1C1917] leading-tight truncate">
                    {detailEntry.seriesTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailEntry(null)}
                  className="w-7 h-7 rounded-lg hover:bg-stone-200/70 text-stone-500 hover:text-[#1C1917] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Fermer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-white border border-stone-200 p-2 text-center">
                  <Eye className="w-3.5 h-3.5 text-[#A2482B] mx-auto mb-0.5" />
                  <div className="text-xs font-bold text-[#1C1917]">
                    {formatViewsCompact(stats.viewsCount)}
                  </div>
                  <div className="text-[9.5px] text-stone-500">Vues</div>
                </div>
                <div className="rounded-xl bg-white border border-stone-200 p-2 text-center">
                  <Users className="w-3.5 h-3.5 text-[#A2482B] mx-auto mb-0.5" />
                  <div className="text-xs font-bold text-[#1C1917]">{stats.duosCount}</div>
                  <div className="text-[9.5px] text-stone-500">Duos</div>
                </div>
                <div className="rounded-xl bg-white border border-stone-200 p-2 text-center">
                  <Film className="w-3.5 h-3.5 text-[#A2482B] mx-auto mb-0.5" />
                  <div className="text-xs font-bold text-[#1C1917]">{stats.videosCount}</div>
                  <div className="text-[9.5px] text-stone-500">Vidéos</div>
                </div>
              </div>

              <div className="rounded-xl bg-white border border-stone-200 p-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Parts</span>
                  <span className="font-bold text-[#1C1917]">
                    {detailEntry.sharesCount} ({formatFcfa(totalSimulated)})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Statut</span>
                  <span className="font-semibold text-emerald-700">Active</span>
                </div>
              </div>

              {seriesMeta && (
                <p className="text-[11px] text-stone-600 leading-relaxed line-clamp-3">
                  {seriesMeta.synopsis}
                </p>
              )}

              <button
                type="button"
                onClick={() => handleRemove(detailEntry.seriesId, detailEntry.seriesTitle)}
                className="w-full py-2 rounded-xl border border-stone-300 hover:border-rose-300 hover:bg-rose-50 text-stone-700 hover:text-rose-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Retirer cette coproduction</span>
              </button>

              <p className="text-[9.5px] text-stone-400 text-center tracking-wide">
                Coproduction
              </p>
            </>
          );
        })()}
      </CardWidthModal>
    </div>
  );
};
