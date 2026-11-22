import React from 'react';

const CELL = 80;
const GRID_N = 3;
const TILE_SIZE = CELL * GRID_N; // 240x240 seamless repeating pattern

const renderStarburstTile = (ox: number, oy: number, keyPrefix: string) => {
  const x0 = ox;
  const y0 = oy;
  const lines: React.ReactNode[] = [
    <line key={`${keyPrefix}-h`} x1={x0} y1={y0 + 40} x2={x0 + 80} y2={y0 + 40} />,
    <line key={`${keyPrefix}-v`} x1={x0 + 40} y1={y0} x2={x0 + 40} y2={y0 + 80} />,
    <line key={`${keyPrefix}-d1`} x1={x0} y1={y0} x2={x0 + 80} y2={y0 + 80} />,
    <line key={`${keyPrefix}-d2`} x1={x0 + 80} y1={y0} x2={x0} y2={y0 + 80} />
  ];

  // Top & bottom wedges: vertical hatches bounded by diagonals
  for (const offset of [8, 16, 24, 32]) {
    // Top-left & top-right vertical rays
    lines.push(
      <line key={`${keyPrefix}-tvl-${offset}`} x1={x0 + offset} y1={y0} x2={x0 + offset} y2={y0 + offset} />,
      <line key={`${keyPrefix}-tvr-${offset}`} x1={x0 + 80 - offset} y1={y0} x2={x0 + 80 - offset} y2={y0 + offset} />,
      // Bottom-left & bottom-right vertical rays
      <line key={`${keyPrefix}-bvl-${offset}`} x1={x0 + offset} y1={y0 + 80 - offset} x2={x0 + offset} y2={y0 + 80} />,
      <line key={`${keyPrefix}-bvr-${offset}`} x1={x0 + 80 - offset} y1={y0 + 80 - offset} x2={x0 + 80 - offset} y2={y0 + 80} />,
      // Left-top & left-bottom horizontal rays
      <line key={`${keyPrefix}-lht-${offset}`} x1={x0} y1={y0 + offset} x2={x0 + offset} y2={y0 + offset} />,
      <line key={`${keyPrefix}-lhb-${offset}`} x1={x0} y1={y0 + 80 - offset} x2={x0 + offset} y2={y0 + 80 - offset} />,
      // Right-top & right-bottom horizontal rays
      <line key={`${keyPrefix}-rht-${offset}`} x1={x0 + 80 - offset} y1={y0 + offset} x2={x0 + 80} y2={y0 + offset} />,
      <line key={`${keyPrefix}-rhb-${offset}`} x1={x0 + 80 - offset} y1={y0 + 80 - offset} x2={x0 + 80} y2={y0 + 80 - offset} />
    );
  }

  return lines;
};

const renderConcentricDiamondsTile = (ox: number, oy: number, keyPrefix: string) => {
  const elements: React.ReactNode[] = [
    <line key={`${keyPrefix}-h`} x1={ox} y1={oy + 40} x2={ox + 80} y2={oy + 40} />,
    <line key={`${keyPrefix}-v`} x1={ox + 40} y1={oy} x2={ox + 40} y2={oy + 80} />
  ];

  const subOffsets = [
    [0, 0],
    [40, 0],
    [0, 40],
    [40, 40]
  ];

  subOffsets.forEach(([sx, sy], idx) => {
    const cx = ox + sx + 20;
    const cy = oy + sy + 20;
    for (const r of [20, 13, 6]) {
      elements.push(
        <polygon
          key={`${keyPrefix}-d-${idx}-${r}`}
          points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
        />
      );
    }
  });

  return (
    <g key={keyPrefix} stroke="#5C7E4F">
      {elements}
    </g>
  );
};

const renderChevronHourglassTile = (ox: number, oy: number, keyPrefix: string) => {
  const elements: React.ReactNode[] = [
    <line key={`${keyPrefix}-v`} x1={ox + 40} y1={oy} x2={ox + 40} y2={oy + 80} />,
    <line key={`${keyPrefix}-h`} x1={ox} y1={oy + 40} x2={ox + 80} y2={oy + 40} />,
    <line key={`${keyPrefix}-fl`} x1={ox + 16} y1={oy} x2={ox + 16} y2={oy + 80} />,
    <line key={`${keyPrefix}-fr`} x1={ox + 64} y1={oy} x2={ox + 64} y2={oy + 80} />,
    // Center nested chevrons (top & bottom hourglass)
    <polyline key={`${keyPrefix}-ct1`} points={`${ox + 16},${oy} ${ox + 40},${oy + 40} ${ox + 64},${oy}`} />,
    <polyline key={`${keyPrefix}-ct2`} points={`${ox + 22},${oy} ${ox + 40},${oy + 30} ${ox + 58},${oy}`} />,
    <polyline key={`${keyPrefix}-ct3`} points={`${ox + 28},${oy} ${ox + 40},${oy + 20} ${ox + 52},${oy}`} />,
    <polyline key={`${keyPrefix}-ct4`} points={`${ox + 34},${oy} ${ox + 40},${oy + 10} ${ox + 46},${oy}`} />,
    <polyline key={`${keyPrefix}-cb1`} points={`${ox + 16},${oy + 80} ${ox + 40},${oy + 40} ${ox + 64},${oy + 80}`} />,
    <polyline key={`${keyPrefix}-cb2`} points={`${ox + 22},${oy + 80} ${ox + 40},${oy + 50} ${ox + 58},${oy + 80}`} />,
    <polyline key={`${keyPrefix}-cb3`} points={`${ox + 28},${oy + 80} ${ox + 40},${oy + 60} ${ox + 52},${oy + 80}`} />,
    <polyline key={`${keyPrefix}-cb4`} points={`${ox + 34},${oy + 80} ${ox + 40},${oy + 70} ${ox + 46},${oy + 80}`} />
  ];

  // Outer left & right columns horizontal hatches
  for (const yOffset of [8, 16, 24, 32, 48, 56, 64, 72]) {
    elements.push(
      <line key={`${keyPrefix}-lh-${yOffset}`} x1={ox} y1={oy + yOffset} x2={ox + 16} y2={oy + yOffset} />,
      <line key={`${keyPrefix}-rh-${yOffset}`} x1={ox + 64} y1={oy + yOffset} x2={ox + 80} y2={oy + yOffset} />
    );
  }

  // Left & right inward chevrons inside middle flanking triangles
  for (const inset of [8, 16]) {
    elements.push(
      <polyline
        key={`${keyPrefix}-cl-${inset}`}
        points={`${ox + 16},${oy + inset} ${ox + 40 - inset * 0.8},${oy + 40} ${ox + 16},${oy + 80 - inset}`}
      />,
      <polyline
        key={`${keyPrefix}-cr-${inset}`}
        points={`${ox + 64},${oy + inset} ${ox + 40 + inset * 0.8},${oy + 40} ${ox + 64},${oy + 80 - inset}`}
      />
    );
  }

  return elements;
};

// 3x3 Latin square arrangement so motifs alternate organically without vertical/horizontal banding
const TILE_LAYOUT: Array<Array<'A' | 'B' | 'C'>> = [
  ['A', 'C', 'B'],
  ['B', 'A', 'C'],
  ['C', 'B', 'A']
];

export const BeninMotifWatermark: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none opacity-[0.085]"
      style={{
        maskImage:
          'radial-gradient(ellipse 56% 62% at 50% 46%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.88) 58%, rgba(0,0,0,1) 100%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 56% 62% at 50% 46%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.88) 58%, rgba(0,0,0,1) 100%)'
      }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="yonywood-benin-motif"
            width={TILE_SIZE}
            height={TILE_SIZE}
            patternUnits="userSpaceOnUse"
          >
            <g fill="none" stroke="#A2482B" strokeWidth="1" strokeLinecap="square">
              {/* Outer grid lines */}
              {[0, 80, 160].map((pos) => (
                <React.Fragment key={`grid-${pos}`}>
                  <line x1={pos} y1={0} x2={pos} y2={TILE_SIZE} />
                  <line x1={0} y1={pos} x2={TILE_SIZE} y2={pos} />
                </React.Fragment>
              ))}

              {/* 3x3 geometric motif cells */}
              {TILE_LAYOUT.map((row, rIdx) =>
                row.map((kind, cIdx) => {
                  const ox = cIdx * CELL;
                  const oy = rIdx * CELL;
                  const keyPrefix = `r${rIdx}c${cIdx}`;
                  if (kind === 'A') return renderStarburstTile(ox, oy, keyPrefix);
                  if (kind === 'B') return renderConcentricDiamondsTile(ox, oy, keyPrefix);
                  return renderChevronHourglassTile(ox, oy, keyPrefix);
                })
              )}
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#yonywood-benin-motif)" />
      </svg>
    </div>
  );
};
