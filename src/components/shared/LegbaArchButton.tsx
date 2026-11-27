import React, { useState, useRef, useEffect } from 'react';

export function playLegbaKnock(): void {
  // Son désactivé
}

export interface LegbaArchButtonProps {
  /** Déclenché juste après le claquement du clap (400 ms). */
  onActivate: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Si la carte n'est pas centrée, exécute l'action immédiatement sans passer par l'état actif. */
  onCenterCard?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isCenterAction?: boolean;
  /** État contrôlé optionnel : si false après avoir été true, réinitialise. */
  active?: boolean;
  /** Clé de réinitialisation lors d'un changement d'étape. */
  resetKey?: string;
  className?: string;
}

export const LegbaArchButton: React.FC<LegbaArchButtonProps> = ({
  onActivate,
  onCenterCard,
  isCenterAction = true,
  active,
  resetKey,
  className = ''
}) => {
  const [internalOn, setInternalOn] = useState(false);
  const actionTimerRef = useRef<number | null>(null);
  const hapticTimerRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (actionTimerRef.current !== null) {
      window.clearTimeout(actionTimerRef.current);
      actionTimerRef.current = null;
    }
    if (hapticTimerRef.current !== null) {
      window.clearTimeout(hapticTimerRef.current);
      hapticTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (active === false) {
      clearTimers();
      setInternalOn(false);
    }
  }, [active]);

  useEffect(() => {
    clearTimers();
    setInternalOn(false);
  }, [resetKey]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const isOn = active !== undefined ? active || internalOn : internalOn;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isCenterAction && onCenterCard) {
      onCenterCard(e);
      return;
    }

    if (active === true) {
      clearTimers();
      setInternalOn(false);
      onActivate(e);
      return;
    }

    if (internalOn) return;

    clearTimers();
    setInternalOn(true);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      hapticTimerRef.current = window.setTimeout(() => {
        hapticTimerRef.current = null;
        try {
          navigator.vibrate(12);
        } catch {
          // ignore unsupported vibration errors
        }
      }, 205);
    }

    actionTimerRef.current = window.setTimeout(
      () => {
        actionTimerRef.current = null;
        onActivate(e);
      },
      prefersReducedMotion ? 70 : 400
    );
  };

  return (
    <button
      type="button"
      aria-label="Valider"
      aria-pressed={isOn}
      onClick={handleClick}
      className={`legba-arch-btn ${isOn ? 'on' : ''} relative w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center shrink-0 cursor-pointer shadow-md hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0E8DC]/75 before:content-[''] before:absolute before:-inset-1.5 ${className}`}
    >
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {isOn ? 'Choix validé' : ''}
      </span>
      <svg
        className="clap w-4 h-4 sm:w-[17px] sm:h-[17px] overflow-visible block"
        viewBox="0 0 24 24"
        fill="none"
        overflow="visible"
        aria-hidden="true"
        focusable="false"
      >
        <g transform="translate(12 13.5)">
          <circle className="clap__ring" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </g>
        <g className="clap__shake">
          {/* Boîtier inférieur de la claquette */}
          <path
            d="M 3 11 H 21 V 19 A 2 2 0 0 1 19 21 H 5 A 2 2 0 0 1 3 19 Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bras supérieur articulé à la charnière (3, 11) */}
          <g transform="translate(3 11)">
            <g className="clap__arm">
              <path
                d="M 0 0 V -2.4 A 1.7 1.7 0 0 1 1.7 -4.1 H 16.4 A 1.6 1.6 0 0 1 18 -2.5 V 0 Z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className="clap__stripes"
                d="M 4.4 -4.0 L 7.2 -0.1 M 10.6 -4.0 L 13.4 -0.1"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </g>
          </g>
        </g>
      </svg>
    </button>
  );
};



