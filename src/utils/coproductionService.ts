import { DOCUMENTARIES, DUOS } from '../data/mockData';
import { SERIES_REGISTRY, resolveCanonicalSeriesId, resolveSeriesById } from '../data/seriesRegistry';
import { INITIAL_SERIES_ENVELOPES } from '../data/adminBackOfficeData';
import { getUserVideoSubmissions } from './userVideoService';

export interface SeriesCoproductionStats {
  seriesId: string;
  seriesTitle: string;
  posterUrl: string;
  viewsCount: number;
  duosCount: number;
  videosCount: number;
}

export interface UserCoproductionEntry {
  seriesId: string;
  seriesTitle: string;
  posterUrl: string;
  sharesCount: number;
  unitAmountEur: number;
  status: 'ACTIVE_DEMO';
  updatedAt: string;
}

export const DEMO_SHARE_UNIT_EUR = 25;
const USER_COPRODUCTIONS_KEY = 'yonywood_user_coproductions';
export const COPRODUCTIONS_UPDATED_EVENT = 'yonywood:coproductions-updated';

const BASE_SERIES_VIEWS: Record<string, number> = {
  'remedes-e-vivi': 14200,
  'amin-amen-legba': 18900,
  'phd-azovi': 11400,
  'blacks-one-nyonoukpo': 24600,
  'fiat-luxe-irokos': 15800,
  'horizons-finagnon': 13500,
  'builders-mi-do-kpo': 21300,
  'regards-gbe': 12900,
};

function notifyCoproductionsUpdated(): void {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent(COPRODUCTIONS_UPDATED_EVENT));
  }
}

export function getSeriesStats(rawSeriesId: string): SeriesCoproductionStats {
  const canonicalId = resolveCanonicalSeriesId(rawSeriesId) || rawSeriesId;
  const registryEntry = resolveSeriesById(canonicalId) || SERIES_REGISTRY[0];
  const doc = DOCUMENTARIES.find((d) => d.id === registryEntry.id);
  const envelope = INITIAL_SERIES_ENVELOPES.find((e) => e.seriesId === registryEntry.id);

  const matchingDuos = DUOS.filter(
    (d) => (resolveCanonicalSeriesId(d.documentaryId) || d.documentaryId) === registryEntry.id
  );
  const allUserVideos = getUserVideoSubmissions().filter(
    (v) =>
      v.universe === registryEntry.id ||
      resolveCanonicalSeriesId(v.universe) === registryEntry.id
  );

  const duosCount = Math.max(matchingDuos.length, doc?.protagonistsCount ? Math.floor(doc.protagonistsCount / 2) : 1);
  const videosCount = matchingDuos.length * 2 + allUserVideos.length;
  const baseViews = BASE_SERIES_VIEWS[registryEntry.id] ?? 10000;
  const envelopeFactor = envelope ? Math.round(envelope.totalRaised * 0.45) : 0;
  const viewsCount = baseViews + envelopeFactor + allUserVideos.length * 120;

  return {
    seriesId: registryEntry.id,
    seriesTitle: registryEntry.title,
    posterUrl: doc?.coverImage || registryEntry.posterUrl,
    viewsCount,
    duosCount,
    videosCount: Math.max(videosCount, duosCount * 2),
  };
}

export function getUserCoproductions(): UserCoproductionEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USER_COPRODUCTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry: UserCoproductionEntry) => {
        const canonicalId = resolveCanonicalSeriesId(entry.seriesId) || entry.seriesId;
        const series = resolveSeriesById(canonicalId);
        if (!series) return null;
        return {
          ...entry,
          seriesId: series.id,
          seriesTitle: series.title,
          posterUrl: series.posterUrl,
          sharesCount: Math.max(1, Number(entry.sharesCount) || 1),
          unitAmountEur: Number(entry.unitAmountEur) || DEMO_SHARE_UNIT_EUR,
          status: 'ACTIVE_DEMO' as const,
        };
      })
      .filter((item): item is UserCoproductionEntry => Boolean(item));
  } catch {
    return [];
  }
}

export function addUserCoproduction(
  rawSeriesId: string,
  additionalShares = 1
): UserCoproductionEntry[] {
  const stats = getSeriesStats(rawSeriesId);
  const existing = getUserCoproductions();
  const idx = existing.findIndex((item) => item.seriesId === stats.seriesId);
  const now = new Date().toISOString();

  let updated: UserCoproductionEntry[];
  if (idx >= 0) {
    updated = existing.map((item, i) =>
      i === idx
        ? {
            ...item,
            sharesCount: item.sharesCount + Math.max(1, additionalShares),
            updatedAt: now,
          }
        : item
    );
  } else {
    updated = [
      {
        seriesId: stats.seriesId,
        seriesTitle: stats.seriesTitle,
        posterUrl: stats.posterUrl,
        sharesCount: Math.max(1, additionalShares),
        unitAmountEur: DEMO_SHARE_UNIT_EUR,
        status: 'ACTIVE_DEMO',
        updatedAt: now,
      },
      ...existing,
    ];
  }

  try {
    localStorage.setItem(USER_COPRODUCTIONS_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage quota errors
  }
  notifyCoproductionsUpdated();
  return updated;
}

export function removeUserCoproduction(rawSeriesId: string): UserCoproductionEntry[] {
  const canonicalId = resolveCanonicalSeriesId(rawSeriesId) || rawSeriesId;
  const existing = getUserCoproductions();
  const updated = existing.filter((item) => item.seriesId !== canonicalId);
  try {
    localStorage.setItem(USER_COPRODUCTIONS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  notifyCoproductionsUpdated();
  return updated;
}

export function formatViewsCompact(count: number): string {
  if (count >= 1000) {
    const k = (count / 1000).toFixed(1).replace(/\.0$/, '');
    return `${k} k`;
  }
  return String(count);
}
