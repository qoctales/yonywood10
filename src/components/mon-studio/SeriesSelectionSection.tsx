import React from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { DOCUMENTARIES } from '../../data/mockData';
import { SERIES_REGISTRY, resolveCanonicalSeriesId } from '../../data/seriesRegistry';

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
  const normalizedSelection = Array.from(
    new Set(
      selectedDocFilter
        .map((id) => resolveCanonicalSeriesId(id) || id)
        .filter((id) => SERIES_REGISTRY.some((s) => s.id === id))
    )
  );

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans select-none overflow-hidden">
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
            Séries
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            onUpdateDocFilter(SERIES_REGISTRY.map((s) => s.id));
            onShowToast('Toutes les séries sélectionnées.');
          }}
          className="text-xs font-semibold text-[#A2482B] hover:underline cursor-pointer shrink-0"
        >
          Tout sélectionner
        </button>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 py-5 sm:py-7 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {SERIES_REGISTRY.map((series) => {
            const doc = DOCUMENTARIES.find((d) => d.id === series.id);
            const isChecked = normalizedSelection.includes(series.id);

            return (
              <button
                key={series.id}
                type="button"
                onClick={() => {
                  if (isChecked) {
                    if (normalizedSelection.length <= 1) {
                      onShowToast('Au moins une série doit rester sélectionnée.');
                      return;
                    }
                    onUpdateDocFilter(normalizedSelection.filter((id) => id !== series.id));
                  } else {
                    onUpdateDocFilter([...normalizedSelection, series.id]);
                  }
                }}
                className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                  isChecked
                    ? 'border-[#A2482B] bg-white ring-1 ring-[#A2482B] shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white/75'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={doc?.coverImage || series.posterUrl}
                    alt={series.title}
                    className="w-11 h-11 rounded-xl object-cover shrink-0 border border-stone-200"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-stone-900 leading-snug truncate">
                      {series.title}
                    </p>
                    <p className="text-[10px] text-stone-500 truncate mt-0.5">
                      {`${series.partA.name} <> ${series.partB.name}`}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? 'border-[#A2482B] bg-[#A2482B] text-white'
                      : 'border-stone-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
