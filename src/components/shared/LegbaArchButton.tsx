import React, { useState, useRef, useEffect } from 'react';

export function playLegbaKnock(): void {
  // Son désactivé
}

export interface LegbaArchButtonProps {
  /** Déclenché lorsque l'option est choisie (après l'animation d'activation si isCenterAction = true). */
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

  const clearTimers = () => {
    if (actionTimerRef.current !== null) {
      window.clearTimeout(actionTimerRef.current);
      actionTimerRef.current = null;
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

    actionTimerRef.current = window.setTimeout(
      () => {
        actionTimerRef.current = null;
        onActivate(e);
      },
      prefersReducedMotion ? 100 : 480
    );
  };

  return (
    <button
      type="button"
      aria-label="Choisir"
      aria-pressed={isOn}
      onClick={handleClick}
      className={`legba-arch-btn ${isOn ? 'on' : ''} relative w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center shrink-0 cursor-pointer shadow-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3EBE0]/75 before:content-[''] before:absolute before:-inset-1.5 ${className}`}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="w-5 h-5 sm:w-5.5 sm:h-5.5 overflow-visible block"
      >
        {/* Onde discrète au sol au moment où le bâton touche le sol */}
        <path
          className="legba-rekad-impact"
          d="M11.2 27.3 Q15.6 29.0 20.0 27.3"
          stroke="#F3EBE0"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Bâton légèrement courbé centré, pivotant depuis la base */}
        <g className="legba-rekad">
          {/* Partie supérieure légèrement courbée */}
          <path
            d="M14.2 15.6 C14.3 11.0 15.9 7.6 19.4 5.8 C19.8 5.6 20.2 6.0 19.9 6.5 C18.0 8.9 17.1 11.8 17.0 15.6 Z"
            fill="#F3EBE0"
          />
          {/* Manche inférieur séparé par un anneau fin */}
          <path
            d="M14.2 17.0 H17.0 L16.7 25.8 C16.7 26.4 16.2 26.8 15.6 26.8 H15.5 C14.9 26.8 14.4 26.4 14.4 25.8 Z"
            fill="#F3EBE0"
          />
        </g>
      </svg>
    </button>
  );
};
