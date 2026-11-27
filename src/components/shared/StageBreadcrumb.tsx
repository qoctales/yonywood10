import React from 'react';
import { ChevronLeft } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface StageBreadcrumbProps {
  items: BreadcrumbItem[];
  rightSlot?: React.ReactNode;
  className?: string;
}

export const StageBreadcrumb: React.FC<StageBreadcrumbProps> = ({
  items,
  rightSlot,
  className = ''
}) => {
  if (items.length === 0) return null;

  const ancestors = items.slice(0, -1);
  const current = items[items.length - 1];

  return (
    <div
      className={`relative flex items-center justify-between h-8 sm:h-10 shrink-0 gap-2 mb-0.5 sm:mb-1 ${className}`}
    >
      <nav
        aria-label="Fil d'Ariane"
        className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 h-full overflow-hidden"
      >
        {ancestors.map((item, idx) => (
          <React.Fragment key={`${item.label}-${idx}`}>
            {item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 group py-1 shrink-0 min-h-[36px]"
                title={`Revenir à ${item.label}`}
              >
                {idx === 0 && (
                  <ChevronLeft className="w-4 h-4 text-[#A2482B] group-hover:text-[#8A3B22] group-hover:-translate-x-0.5 transition-transform shrink-0" />
                )}
                <span className="text-[11px] sm:text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            ) : (
              <span className="text-[11px] sm:text-sm font-medium text-stone-500 whitespace-nowrap py-1 shrink-0">
                {item.label}
              </span>
            )}
            <span className="text-stone-300 font-light text-xs shrink-0" aria-hidden="true">
              ›
            </span>
          </React.Fragment>
        ))}

        <div className="relative flex items-center h-full min-w-0">
          <span className="font-editorial text-xs sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-none whitespace-nowrap pr-2 select-none truncate">
            {current.label}
          </span>
          <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
        </div>
      </nav>

      {rightSlot && (
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">{rightSlot}</div>
      )}
    </div>
  );
};
