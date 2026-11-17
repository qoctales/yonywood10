import React, { useEffect } from 'react';

interface CardWidthModalProps {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
  backdropClassName?: string;
}

export const CARD_WIDTH_MODAL_CLASS =
  'w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px]';

export const CardWidthModal: React.FC<CardWidthModalProps> = ({
  isOpen,
  onClose,
  ariaLabel,
  children,
  className = '',
  backdropClassName = 'bg-black/35 backdrop-blur-[2px]'
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-modal-backdrop ${backdropClassName}`}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(e) => e.stopPropagation()}
        className={`${CARD_WIDTH_MODAL_CLASS} max-h-[calc(100dvh-48px)] overflow-y-auto no-scrollbar rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 bg-[#FAF7F2] text-[#1C1917] animate-modal-sheet select-none shrink-0 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};
