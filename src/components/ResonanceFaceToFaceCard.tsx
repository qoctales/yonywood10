import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Award } from 'lucide-react';
import { celestialAudio } from '../utils/celestialAudio';
import { Protagonist } from '../types';
import { formatFirstLetterOnly } from '../utils/textFormatters';

interface ResonanceFaceToFaceCardProps {
  protagonistA: Protagonist;
  protagonistB: Protagonist;
  seriesTitle?: string;
  duoQuestion?: string;
  duoId?: string;
  isActive?: boolean;
  canEvaluate?: boolean;
  onNavigateToSlide?: (slideIndex: 0 | 1 | 2) => void;
  onNavigateToPortrait: (protagonistId: string) => void;
}

interface CriteriaValues {
  resonance: number;
  authenticity: number;
  impact: number;
}

const CRITERIA_CONFIG = [
  {
    id: 'resonance' as const,
    label: 'Résonance',
  },
  {
    id: 'authenticity' as const,
    label: 'Authenticité',
  },
  {
    id: 'impact' as const,
    label: 'Impact',
  },
];

// Nettoie la question des guillemets et garantit que le point d'interrogation ne se retrouve jamais seul
function renderCleanQuestion(rawQuestion?: string) {
  if (!rawQuestion) return 'Quelle résonance ce dialogue éveille-t-il en vous\u00A0?';

  // Retirer guillemets initiaux et finaux
  let text = rawQuestion.replace(/^[«"'\s]+|[»"'\s]+$/g, '').trim();

  // Remplacer l'espace éventuel devant le point d'interrogation par un espace insécable
  text = text.replace(/\s*\?$/, '\u00A0?');

  const words = text.split(' ');
  if (words.length > 2) {
    const lastWord = words.pop();
    const secondLastWord = words.pop();
    return (
      <>
        {words.join(' ')}{' '}
        <span className="inline-block whitespace-nowrap">
          {secondLastWord} {lastWord}
        </span>
      </>
    );
  }
  return text;
}

function getProtagonistDisplayName(protagonist: Protagonist): string {
  if (protagonist.firstName?.trim()) return protagonist.firstName.trim();
  const fullName = protagonist.name || '';
  if (!fullName) return '';
  const trimmed = fullName.trim();
  if (/^Chef\s+/i.test(trimmed)) {
    return trimmed.replace(/^Chef\s+/i, '').split(/\s+/)[0] || trimmed;
  }
  if (/^(Père|Soeur|Frère|Dr|Dre|Coach|Maître|Dah)\b/i.test(trimmed)) {
    const parts = trimmed.split(/\s+/);
    return parts.slice(0, 2).join(' ');
  }
  return trimmed.split(/\s+/)[0];
}

export const ResonanceFaceToFaceCard: React.FC<ResonanceFaceToFaceCardProps> = ({
  protagonistA,
  protagonistB,
  seriesTitle,
  duoQuestion,
  duoId = 'default-duo',
  isActive = true,
  canEvaluate = false,
  onNavigateToSlide,
  onNavigateToPortrait,
}) => {
  // 3 curseurs de critères : 50% par défaut à l'ouverture
  const [criteria, setCriteria] = useState<CriteriaValues>(() => {
    try {
      const saved = localStorage.getItem(`yonywood_eval_${duoId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          typeof parsed.resonance === 'number' &&
          typeof parsed.authenticity === 'number' &&
          typeof parsed.impact === 'number'
        ) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return { resonance: 50, authenticity: 50, impact: 50 };
  });

  // Onglet actif : 'question' par défaut
  const [activeTab, setActiveTab] = useState<'question' | 'evaluation'>('question');

  useEffect(() => {
    if (!canEvaluate && activeTab === 'evaluation') {
      setActiveTab('question');
    }
  }, [canEvaluate, activeTab]);

  // Question nettoyée et découpée en mots
  const cleanQuestion = useMemo(() => {
    return (duoQuestion || 'Quelle résonance ce dialogue éveille-t-il en vous\u00A0?').replace(/^[«"'\s]+|[»"'\s]+$/g, '').trim();
  }, [duoQuestion]);

  const words = useMemo(() => cleanQuestion.split(/\s+/), [cleanQuestion]);

  // Plages de caractères pour chaque mot pour un rendu stable sans saut d'affichage
  const wordRanges = useMemo(() => {
    let searchPos = 0;
    return words.map((word) => {
      const start = cleanQuestion.indexOf(word, searchPos);
      const effectiveStart = start !== -1 ? start : searchPos;
      const end = effectiveStart + word.length;
      searchPos = end;
      return { word, start: effectiveStart, end };
    });
  }, [cleanQuestion, words]);

  // Apparition progressive des lettres (défilement progressif du texte qui reste ensuite affiché)
  const [revealedCharCount, setRevealedCharCount] = useState<number>(0);

  useEffect(() => {
    setRevealedCharCount(0);
    if (activeTab !== 'question' || !isActive) return;

    const total = cleanQuestion.length;
    if (total === 0) return;

    // Défilement régulier et fluide des lettres (~25ms par caractère)
    const timer = setInterval(() => {
      setRevealedCharCount((prev) => {
        if (prev >= total) {
          clearInterval(timer);
          return total;
        }
        return prev + 1;
      });
    }, 25);

    return () => clearInterval(timer);
  }, [cleanQuestion, activeTab, isActive, duoId]);

  const displayNameA = getProtagonistDisplayName(protagonistA);
  const displayNameB = getProtagonistDisplayName(protagonistB);

  const handleSliderChange = (criterionId: keyof CriteriaValues, value: number) => {
    setCriteria(prev => {
      const updated = { ...prev, [criterionId]: value };
      try {
        localStorage.setItem(`yonywood_eval_${duoId}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (value === 50 || value === 25 || value === 75) {
      celestialAudio.playOrbSelect();
    }
  };

  return (
    <div className="relative w-full h-full max-h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-[#A84A2C] via-[#943F24] to-[#7B321B] text-white p-2.5 sm:p-3 md:p-3.5 flex flex-col justify-between select-none border border-[#C86747]/60 shadow-2xl">
      
      {/* Halo lumineux doux et chaud sur le fond terracotta */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none transition-all duration-300"
        style={{
          background: 'radial-gradient(circle at 50% 18%, rgba(255, 215, 175, 0.28) 0%, rgba(162, 72, 43, 0) 75%)'
        }}
      />

      {/* ========================================================================= */}
      {/* SECTION HAUTE : TITRE & VIGNETTES EN VRAIE PRÉSENCE VISUELLE              */}
      {/* ========================================================================= */}
      <div className="relative z-20 flex-1 flex flex-col justify-between min-h-0 pt-0.5 sm:pt-1 pb-1.5 sm:pb-2">
        
        {/* 1. Titre de la série centré au sommet */}
        <div className="flex items-center justify-center w-full shrink-0 min-w-0 px-1">
          <div className="bg-black/65 px-2.5 sm:px-3.5 py-1 rounded-full border border-white/20 shadow-xs max-w-full">
            <span className="font-editorial text-[8px] sm:text-[10px] font-semibold text-white tracking-wide leading-tight block text-center drop-shadow-xs">
              {formatFirstLetterOnly(seriesTitle) || 'Duocumentaires'}
            </span>
          </div>
        </div>

        {/* 2. Face-à-face centré verticalement : vignettes généreuses et affirmées */}
        <div className="flex-1 flex items-center justify-around w-full px-1 sm:px-2 my-auto min-h-0 pt-0.5 sm:pt-1">
          
          {/* Protagoniste A (Gauche) */}
          <div 
            onClick={() => onNavigateToSlide ? onNavigateToSlide(0) : onNavigateToPortrait(protagonistA.id)}
            className="group flex flex-col items-center cursor-pointer transition-transform active:scale-95"
            title={`Voir la vidéo de ${displayNameA}`}
          >
            <div className="relative w-19 sm:w-23 md:w-25 aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white/95 shadow-xl bg-black/40 group-hover:scale-105 transition-transform">
              <img 
                src={protagonistA.photoUrl} 
                alt={displayNameA}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover pointer-events-none"
                loading="lazy"
                decoding="async"
              />
            </div>
            {/* Prénom entier abaissé légèrement pour un meilleur équilibre visuel */}
            <span className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs md:text-[12.5px] font-semibold text-white/95 tracking-tight text-center whitespace-nowrap drop-shadow-xs px-0.5">
              {displayNameA}
            </span>
          </div>

          {/* SYMBOLES ‹ › ÉPURÉS */}
          <div className="flex items-center justify-center px-1 shrink-0 pb-4 sm:pb-5">
            <span className="font-editorial text-lg sm:text-xl md:text-2xl text-white/75 tracking-widest pointer-events-none select-none">
              ‹ ›
            </span>
          </div>

          {/* Protagoniste B (Droite) */}
          <div 
            onClick={() => onNavigateToSlide ? onNavigateToSlide(2) : onNavigateToPortrait(protagonistB.id)}
            className="group flex flex-col items-center cursor-pointer transition-transform active:scale-95"
            title={`Voir la vidéo de ${displayNameB}`}
          >
            <div className="relative w-19 sm:w-23 md:w-25 aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white/95 shadow-xl bg-black/40 group-hover:scale-105 transition-transform">
              <img 
                src={protagonistB.photoUrl} 
                alt={displayNameB}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover pointer-events-none"
                loading="lazy"
                decoding="async"
              />
            </div>
            {/* Prénom entier abaissé légèrement pour un meilleur équilibre visuel */}
            <span className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs md:text-[12.5px] font-semibold text-white/95 tracking-tight text-center whitespace-nowrap drop-shadow-xs px-0.5">
              {displayNameB}
            </span>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECTION BASSE : BOÎTE BLANCHE AGRANDIE TRÈS LARGEMENT                     */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full shrink-0 pt-0.5 pb-0.5 flex flex-col items-center">
        
        {/* Boîte blanche généreuse occupant largement l'espace inférieur */}
        <div className="w-full h-[215px] sm:h-[245px] md:h-[265px] bg-white text-stone-900 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 md:p-4 shadow-xl border border-white/40 flex flex-col justify-between overflow-hidden">
          
          {/* BARRE DE BASCULE DIRECTE : ICÔNE LIVRE & ICÔNE AWARD (ÉVALUATION) */}
          <div className="flex items-center justify-between pb-1.5 sm:pb-2 border-b border-stone-100 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] sm:text-xs uppercase tracking-wider font-semibold text-stone-500">
                {activeTab === 'question' ? 'Thème' : 'Évaluation'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-stone-100 p-0.5 sm:p-1 rounded-full border border-stone-200">
              {/* Icône du Livre (Thème) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('question');
                  celestialAudio.playOrbSelect();
                }}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  activeTab === 'question'
                    ? 'bg-[#A2482B] text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
                title="Afficher le thème"
                aria-label="Afficher le thème"
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Icône Award (Évaluation / Résonance) — grisée tant que les 2 vidéos n'ont pas été regardées 5 s */}
              <button
                type="button"
                disabled={!canEvaluate}
                aria-disabled={!canEvaluate}
                onClick={() => {
                  if (!canEvaluate) return;
                  setActiveTab('evaluation');
                  celestialAudio.playOrbSelect();
                }}
                className={`p-1.5 rounded-full transition-all ${
                  !canEvaluate
                    ? 'text-stone-300 opacity-45 cursor-not-allowed'
                    : activeTab === 'evaluation'
                      ? 'bg-[#A2482B] text-white shadow-xs cursor-pointer'
                      : 'text-stone-400 hover:text-stone-700 cursor-pointer'
                }`}
                title={
                  canEvaluate
                    ? "Afficher l'évaluation"
                    : 'Regardez au moins 5 secondes des deux vidéos pour évaluer'
                }
                aria-label="Afficher l'évaluation"
              >
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* CONTENU SELON L'ONGLET SÉLECTIONNÉ */}
          {activeTab === 'question' ? (
            /* =================== VUE QUESTION (AFFICHAGE TEXTE PROGRESSIF) =================== */
            <div className="flex-1 flex flex-col justify-between pt-1 sm:pt-1.5 pb-0.5 px-1 sm:px-2 animate-in fade-in duration-150 overflow-hidden min-h-0">
              
              {/* Zone du texte avec défilement/apparition lettre par lettre qui reste affiché en permanence */}
              <div 
                className="flex-1 flex items-center justify-center text-center px-1 sm:px-2 cursor-pointer select-text my-auto min-h-0"
                onClick={() => setRevealedCharCount(cleanQuestion.length)}
                title="Cliquer pour afficher tout le texte immédiatement"
              >
                <p className="font-ui text-[12px] sm:text-[13px] md:text-[13.5px] leading-snug sm:leading-relaxed text-center max-w-[96%] font-light tracking-normal text-stone-700">
                  {wordRanges.map(({ word, start }, wIdx) => (
                    <span
                      key={`q-word-${wIdx}-${word}`}
                      className="inline-block mx-[2px] text-stone-700 font-light"
                    >
                      {word.split('').map((char, cIdx) => {
                        const charGlobalIndex = start + cIdx;
                        const isCharRevealed = charGlobalIndex < revealedCharCount;

                        return (
                          <span
                            key={`c-${cIdx}`}
                            className={`transition-opacity duration-75 ${
                              isCharRevealed ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </span>
                  ))}
                </p>
              </div>

            </div>
          ) : (
            /* =================== VUE ÉVALUATION (LIGNES FINES ET POLICES PLUS LÉGÈRES) =================== */
            <div className="flex-1 flex flex-col justify-between pt-2 pb-1 sm:pt-3 sm:pb-1.5 animate-in fade-in duration-150">
              {CRITERIA_CONFIG.map((crit) => {
                const val = criteria[crit.id]; // 0 à 100, 50 = milieu
                const pctA = 100 - val;
                const pctB = val;

                return (
                  <div key={crit.id} className="space-y-1 sm:space-y-1.5">
                    {/* Ligne d'en-tête du critère : police plus fine et plus subtile que les prénoms */}
                    <div className="flex items-center justify-between leading-none">
                      <span className="font-ui text-[10px] sm:text-[10.5px] text-stone-400 font-normal tabular-nums">
                        {pctA}%
                      </span>
                      
                      <span className="font-ui text-[10.5px] sm:text-[11px] text-stone-500 tracking-wide font-normal">
                        {crit.label}
                      </span>

                      <span className="font-ui text-[10px] sm:text-[10.5px] text-stone-400 font-normal tabular-nums">
                        {pctB}%
                      </span>
                    </div>

                    {/* Ligne d'évaluation épurée et beaucoup plus fine */}
                    <div className="relative flex items-center py-1 sm:py-1.5">
                      {/* Rail gris clair fin (2.5px) */}
                      <div className="absolute inset-x-0 h-[2.5px] rounded-full overflow-hidden bg-stone-200/80 pointer-events-none">
                        {/* Remplissage terracotta fluide vers la gauche */}
                        {val < 50 && (
                          <div 
                            className="absolute top-0 bottom-0 bg-[#A2482B] transition-all duration-75"
                            style={{
                              left: `${val}%`,
                              width: `${50 - val}%`
                            }}
                          />
                        )}
                        {/* Remplissage terracotta fluide vers la droite */}
                        {val > 50 && (
                          <div 
                            className="absolute top-0 bottom-0 bg-[#A2482B] transition-all duration-75"
                            style={{
                              left: '50%',
                              width: `${val - 50}%`
                            }}
                          />
                        )}
                      </div>

                      {/* Input Range transparent interactif */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={val}
                        onChange={(e) => handleSliderChange(crit.id, parseInt(e.target.value, 10))}
                        className="relative z-20 w-full h-4 opacity-0 cursor-pointer"
                        aria-label={`Curseur de ${crit.label}`}
                      />

                      {/* Curseur unique en couleur terracotta (#A2482B) avec cerclage blanc net */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#A2482B] border-2 border-white shadow-xs pointer-events-none transition-all duration-75 z-10"
                        style={{ left: `calc(${val}% - 7px)` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
