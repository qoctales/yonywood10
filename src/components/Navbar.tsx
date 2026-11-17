import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Check } from 'lucide-react';
import { ViewScreen } from '../types';
import { SHOW_SERIES_FILTER_IN_HEADER } from '../config/flags';
import { DOCUMENTARIES } from '../data/mockData';
import { SERIES_REGISTRY, resolveCanonicalSeriesId } from '../data/seriesRegistry';
import { ProfileSoloIcon } from './YonywoodBrandIcons';

interface NavbarProps {
  currentScreen: ViewScreen;
  onNavigate: (screen: ViewScreen) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  selectedSeriesFilter?: string[];
  onUpdateDocFilter?: (docIds: string[]) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  selectedSeriesFilter,
  onUpdateDocFilter,
}) => {
  const [isCriteriaOpen, setIsCriteriaOpen] = useState(false);
  const [minSelectionWarning, setMinSelectionWarning] = useState(false);

  const allSeriesIds = SERIES_REGISTRY.map((s) => s.id);
  const rawFilter =
    selectedSeriesFilter && selectedSeriesFilter.length > 0
      ? selectedSeriesFilter
      : allSeriesIds;
  const normalizedFilter = Array.from(
    new Set(
      rawFilter
        .map((id) => resolveCanonicalSeriesId(id) || id)
        .filter((id) => allSeriesIds.includes(id))
    )
  );
  const activeFilter = normalizedFilter.length > 0 ? normalizedFilter : allSeriesIds;

  const isDuocumentairesScreen =
    currentScreen.type === 'duo_feed' ||
    currentScreen.type === 'duo_detail' ||
    currentScreen.type === 'landing' ||
    currentScreen.type === 'home';

  const isForeignProfile =
    currentScreen.type === 'protagonist_profile' ||
    (currentScreen.type === 'profile' &&
      Boolean(currentScreen.protagonistId) &&
      currentScreen.protagonistId !== 'me');

  const isOwnPortraitActive =
    !isForeignProfile &&
    (currentScreen.type === 'profile' ||
      currentScreen.type === 'settings' ||
      currentScreen.type === 'portfolio' ||
      currentScreen.type === 'transactions' ||
      currentScreen.type === 'my_forest' ||
      currentScreen.type === 'messaging' ||
      currentScreen.type === 'editorial_backoffice');

  const isAllSeriesSelected = allSeriesIds.every((id) => activeFilter.includes(id));
  const isFilterActive = !isAllSeriesSelected;

  useEffect(() => {
    if (!isDuocumentairesScreen && isCriteriaOpen) {
      setIsCriteriaOpen(false);
    }
  }, [isDuocumentairesScreen, isCriteriaOpen]);

  useEffect(() => {
    if (!isCriteriaOpen) {
      setMinSelectionWarning(false);
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCriteriaOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCriteriaOpen]);

  // Ne pas afficher pendant le lecteur vidéo plein écran
  if (currentScreen.type === 'video_player') {
    return null;
  }

  const handleToggleSeries = (seriesId: string) => {
    if (!onUpdateDocFilter) return;
    const isChecked = activeFilter.includes(seriesId);
    if (isChecked) {
      if (activeFilter.length <= 1) {
        setMinSelectionWarning(true);
        return;
      }
      setMinSelectionWarning(false);
      onUpdateDocFilter(activeFilter.filter((id) => id !== seriesId));
    } else {
      setMinSelectionWarning(false);
      onUpdateDocFilter([...activeFilter, seriesId]);
    }
  };

  const handleSelectAllSeries = () => {
    if (!onUpdateDocFilter) return;
    setMinSelectionWarning(false);
    onUpdateDocFilter(allSeriesIds);
  };

  return (
    <>
      <header
        className="shrink-0 z-40 w-full select-none border-none shadow-none rounded-none bg-white"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between relative bg-white">
          {/* Logo officiel YonyWood aligné à gauche (dimensions inchangées) */}
          <div
            onClick={() => {
              setIsCriteriaOpen(false);
              onNavigate({ type: 'duo_feed' });
            }}
            className="flex items-center justify-start cursor-pointer group select-none transition-transform active:scale-[0.99] shrink-0"
            id="nav-logo"
            title="YonyWood"
          >
            <img
              src="/YonyWood_logotype.svg"
              alt="YonyWood"
              width={1452}
              height={384}
              loading="eager"
              decoding="async"
              className="yonywood-header-logo object-contain select-none group-hover:opacity-90 transition-opacity"
            />
          </div>

          {/* Actions de droite : Portrait (Critères masqué derrière SHOW_SERIES_FILTER_IN_HEADER) */}
          <div className="flex items-center justify-end gap-0.5 sm:gap-1 shrink-0">
            {SHOW_SERIES_FILTER_IN_HEADER && isDuocumentairesScreen && (
              <button
                type="button"
                id="nav-criteria-button"
                onClick={() => setIsCriteriaOpen((prev) => !prev)}
                aria-label="Critères des séries"
                aria-expanded={isCriteriaOpen}
                title="Critères des séries"
                className={`relative w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-colors cursor-pointer hover:bg-stone-100/80 active:scale-95 ${
                  isCriteriaOpen ? 'text-[#A2482B]' : 'text-[#2E1A12]'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" strokeWidth={1.75} />
                {isFilterActive && (
                  <span
                    className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#A2482B] ring-2 ring-white"
                    aria-hidden="true"
                  />
                )}
              </button>
            )}

            <button
              type="button"
              id="nav-portrait-button"
              onClick={() => {
                setIsCriteriaOpen(false);
                onNavigate({ type: 'profile' });
              }}
              aria-label="Portrait"
              aria-current={isOwnPortraitActive ? 'page' : undefined}
              title="Portrait"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-colors cursor-pointer hover:bg-stone-100/80 active:scale-95 group"
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 aspect-square shrink-0 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isOwnPortraitActive
                    ? 'bg-[#A2482B] text-white shadow-sm'
                    : 'bg-transparent text-[#2E1A12]'
                }`}
              >
                <ProfileSoloIcon
                  className={isOwnPortraitActive ? 'w-5 h-5' : 'w-6 h-6'}
                  strokeWidth={1.75}
                  isActive={isOwnPortraitActive ? true : undefined}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Panneau en feuille du bas : sélection immédiate des 8 séries (sans backdrop-blur) */}
      {SHOW_SERIES_FILTER_IN_HEADER && isCriteriaOpen && isDuocumentairesScreen && (
        <div
          id="series-criteria-backdrop"
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 select-none"
          onClick={() => setIsCriteriaOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Critères des séries"
            className="w-full max-w-lg bg-[#FAF7F2] text-[#1C1917] rounded-t-3xl border-t border-stone-200 shadow-2xl px-4 sm:px-6 pt-3 pb-6 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Poignée visuelle de feuille du bas */}
            <div className="w-10 h-1 rounded-full bg-stone-300 mx-auto" aria-hidden="true" />

            <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-200/80">
              <h2 className="font-editorial text-base sm:text-lg font-bold text-[#1C1917]">
                Séries ({activeFilter.length}/{DOCUMENTARIES.length})
              </h2>
              <button
                type="button"
                onClick={handleSelectAllSeries}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-full transition-colors cursor-pointer ${
                  isAllSeriesSelected
                    ? 'text-stone-400 cursor-default'
                    : 'text-[#A2482B] hover:bg-[#A2482B]/10'
                }`}
              >
                Tout sélectionner
              </button>
            </div>

            {minSelectionWarning && (
              <p
                role="status"
                className="text-xs font-medium text-[#A2482B] bg-[#A2482B]/10 border border-[#A2482B]/25 rounded-xl px-3 py-2"
              >
                Au moins une série doit rester sélectionnée.
              </p>
            )}

            <div className="max-h-[58dvh] overflow-y-auto space-y-2 pr-0.5">
              {SERIES_REGISTRY.map((series) => {
                const doc = DOCUMENTARIES.find((d) => d.id === series.id);
                const isChecked = activeFilter.includes(series.id);
                return (
                  <button
                    key={series.id}
                    type="button"
                    role="checkbox"
                    aria-checked={isChecked}
                    onClick={() => handleToggleSeries(series.id)}
                    className={`w-full min-h-[48px] p-2.5 rounded-2xl border transition-colors cursor-pointer flex items-center justify-between gap-3 text-left ${
                      isChecked
                        ? 'border-[#A2482B] bg-white'
                        : 'border-stone-200 bg-white/60 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={doc?.coverImage || series.posterUrl}
                        alt=""
                        className="w-9 h-9 rounded-xl object-cover shrink-0 border border-stone-200"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] sm:text-[13px] font-semibold text-[#1C1917] leading-snug">
                          {series.title}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {doc?.subtitle || `${series.partA.name} <> ${series.partB.name}`}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? 'border-[#A2482B] bg-[#A2482B] text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

