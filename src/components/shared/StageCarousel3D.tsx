import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  STAGE_CARD_DIMENSIONS_CLASS,
  STAGE_PERSPECTIVE,
  STAGE_CENTER_TRANSLATE_Z
} from '../../config/cardLayout';

export interface StageCarouselRenderState {
  isCenter: boolean;
  diff: number;
  dragOffset: number;
  isDragging: boolean;
  wasDragged: () => boolean;
  bringToCenter: () => void;
}

interface StageCarousel3DProps<T> {
  items: T[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  getKey: (item: T, index: number) => string;
  renderCard: (
    item: T,
    index: number,
    state: StageCarouselRenderState
  ) => React.ReactNode;
  circular?: boolean;
  dragDisabled?: boolean;
  showDesktopArrows?: boolean;
  showMobileArrows?: boolean;
  onActiveCardClick?: (item: T, index: number) => void;
  cardClassName?: (item: T, index: number, isCenter: boolean) => string;
  prevAriaLabel?: string;
  nextAriaLabel?: string;
}

export function StageCarousel3D<T>({
  items,
  currentIndex,
  onIndexChange,
  getKey,
  renderCard,
  circular = true,
  dragDisabled = false,
  showDesktopArrows = false,
  showMobileArrows = false,
  onActiveCardClick,
  cardClassName,
  prevAriaLabel = 'Précédent',
  nextAriaLabel = 'Suivant'
}: StageCarousel3DProps<T>) {
  const n = items.length;
  const safeIndex = n > 0 ? ((currentIndex % n) + n) % n : 0;

  const [dragOffset, setDragOffset] = useState<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const didDragRef = useRef<boolean>(false);

  const canWrap = circular && n >= 3;

  const handlePrev = useCallback(() => {
    if (n <= 1) return;
    if (canWrap) {
      onIndexChange((safeIndex - 1 + n) % n);
    } else if (safeIndex > 0) {
      onIndexChange(safeIndex - 1);
    }
  }, [n, canWrap, safeIndex, onIndexChange]);

  const handleNext = useCallback(() => {
    if (n <= 1) return;
    if (canWrap) {
      onIndexChange((safeIndex + 1) % n);
    } else if (safeIndex < n - 1) {
      onIndexChange(safeIndex + 1);
    }
  }, [n, canWrap, safeIndex, onIndexChange]);

  useEffect(() => {
    if (dragDisabled || n <= 1) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dragDisabled, n, handleNext, handlePrev]);

  const beginDrag = (clientX: number, clientY: number) => {
    if (dragDisabled || n <= 1) return;
    startXRef.current = clientX;
    startYRef.current = clientY;
    startTimeRef.current = Date.now();
    isDraggingRef.current = true;
    didDragRef.current = false;
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (dragDisabled || !isDraggingRef.current || startXRef.current === null) return;
    const diffX = clientX - startXRef.current;
    const diffY = startYRef.current !== null ? clientY - startYRef.current : 0;
    if (Math.abs(diffX) > 6 && Math.abs(diffX) >= Math.abs(diffY) * 0.85) {
      didDragRef.current = true;
      setDragOffset(diffX);
    }
  };

  const endDrag = (clientX?: number) => {
    if (!isDraggingRef.current) {
      startXRef.current = null;
      startYRef.current = null;
      setDragOffset(0);
      return;
    }
    const finalDiff =
      typeof clientX === 'number' && startXRef.current !== null
        ? clientX - startXRef.current
        : dragOffset;
    const elapsed = Math.max(1, Date.now() - startTimeRef.current);
    const velocity = Math.abs(finalDiff) / elapsed;

    isDraggingRef.current = false;
    startXRef.current = null;
    startYRef.current = null;
    setDragOffset(0);

    if (!dragDisabled && (Math.abs(finalDiff) > 42 || (Math.abs(finalDiff) > 20 && velocity > 0.3))) {
      didDragRef.current = true;
      if (finalDiff < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    window.setTimeout(() => {
      didDragRef.current = false;
    }, 50);
  };

  const canGoPrev = n > 1 && (canWrap || safeIndex > 0);
  const canGoNext = n > 1 && (canWrap || safeIndex < n - 1);

  const arrowVisibilityClass = showMobileArrows
    ? 'flex'
    : showDesktopArrows
      ? 'hidden md:flex'
      : 'hidden';

  return (
    <div
      className={`relative flex-1 flex flex-col items-center justify-center min-h-0 py-1 overflow-hidden ${
        dragDisabled ? '' : 'select-none touch-pan-y'
      }`}
      onTouchStart={(e) => {
        if (dragDisabled) return;
        const target = e.target as HTMLElement;
        if (target.closest('button, a, input, textarea, select, [role="button"]')) return;
        beginDrag(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchMove={(e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={(e) => endDrag(e.changedTouches[0]?.clientX)}
      onTouchCancel={() => {
        isDraggingRef.current = false;
        startXRef.current = null;
        startYRef.current = null;
        setDragOffset(0);
      }}
      onMouseDown={(e) => {
        if (dragDisabled) return;
        const target = e.target as HTMLElement;
        if (target.closest('button, a, input, textarea, select, [role="button"]')) return;
        beginDrag(e.clientX, e.clientY);
      }}
      onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
      onMouseUp={(e) => endDrag(e.clientX)}
      onMouseLeave={() => {
        if (isDraggingRef.current) endDrag();
      }}
    >
      {canGoPrev && (showDesktopArrows || showMobileArrows) && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className={`${arrowVisibilityClass} absolute left-1 sm:left-3 lg:left-6 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#1C1917] hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95`}
          aria-label={prevAriaLabel}
          title={prevAriaLabel}
        >
          <ChevronLeft className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </button>
      )}

      <div
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
        style={{
          perspective: STAGE_PERSPECTIVE,
          perspectiveOrigin: 'center center'
        }}
      >
        <div
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {items.map((item, idx) => {
            let diff = idx - safeIndex;
            if (canWrap) {
              const rawDiff = (idx - safeIndex) % n;
              diff = rawDiff > n / 2 ? rawDiff - n : rawDiff < -n / 2 ? rawDiff + n : rawDiff;
            }
            if (Math.abs(diff) > 2) return null;

            const isCenter = diff === 0;
            let transformStyle = '';
            let zIndex = 10;
            let opacity = 0;

            if (diff === 0) {
              transformStyle = `translateX(${dragOffset}px) translateZ(${STAGE_CENTER_TRANSLATE_Z}px) rotateY(${dragOffset * -0.15}deg) scale(1)`;
              zIndex = 30;
              opacity = 1;
            } else if (diff === 1) {
              transformStyle = `translateX(calc(55% + ${dragOffset}px)) translateZ(-60px) rotateY(-26deg) scale(0.86)`;
              zIndex = 20;
              opacity = 0.75;
            } else if (diff === -1) {
              transformStyle = `translateX(calc(-55% + ${dragOffset}px)) translateZ(-60px) rotateY(26deg) scale(0.86)`;
              zIndex = 20;
              opacity = 0.75;
            } else if (diff === 2) {
              transformStyle = `translateX(calc(100% + ${dragOffset}px)) translateZ(-140px) rotateY(-40deg) scale(0.72)`;
              zIndex = 10;
              opacity = 0.35;
            } else if (diff === -2) {
              transformStyle = `translateX(calc(-100% + ${dragOffset}px)) translateZ(-140px) rotateY(40deg) scale(0.72)`;
              zIndex = 10;
              opacity = 0.35;
            }

            const defaultRing = isCenter
              ? 'border-stone-200/90 ring-1 ring-white/30 shadow-2xl'
              : 'border-white/15 shadow-lg cursor-pointer hover:border-white/30';

            const customCls = cardClassName
              ? cardClassName(item, idx, isCenter)
              : `bg-[#151513] text-white ${defaultRing}`;

            return (
              <div
                key={getKey(item, idx)}
                onClick={(e) => {
                  if (didDragRef.current) {
                    didDragRef.current = false;
                    return;
                  }
                  if (!isCenter) {
                    e.stopPropagation();
                    onIndexChange(idx);
                    return;
                  }
                  if (onActiveCardClick) {
                    onActiveCardClick(item, idx);
                  }
                }}
                style={{
                  transform: transformStyle,
                  zIndex,
                  opacity,
                  pointerEvents: 'auto',
                  transition:
                    isDraggingRef.current && !dragDisabled
                      ? 'none'
                      : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease'
                }}
                className={`absolute ${STAGE_CARD_DIMENSIONS_CLASS} rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between border transition-colors ${
                  dragDisabled && isCenter ? 'select-text' : 'select-none'
                } ${customCls}`}
              >
                {renderCard(item, idx, {
                  isCenter,
                  diff,
                  dragOffset,
                  isDragging: isDraggingRef.current,
                  wasDragged: () => didDragRef.current,
                  bringToCenter: () => onIndexChange(idx)
                })}
              </div>
            );
          })}
        </div>
      </div>

      {canGoNext && (showDesktopArrows || showMobileArrows) && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className={`${arrowVisibilityClass} absolute right-1 sm:right-3 lg:right-6 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#1C1917] hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95`}
          aria-label={nextAriaLabel}
          title={nextAriaLabel}
        >
          <ChevronRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  );
}
