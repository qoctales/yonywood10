import { UserVideoSubmission, ProfileVideoTab } from '../types';
export type { UserVideoSubmission, ProfileVideoTab };

const USER_VIDEOS_KEY = 'yonywood_user_video_submissions';
export const USER_VIDEOS_UPDATED_EVENT = 'yonywood:user-videos-updated';

/**
 * Limite maximale indépendante par onglet du Profil :
 * - 8 vidéos maximum dans « Parcours de vie »
 * - 8 vidéos maximum dans « Initiative personnelle »
 * Soit 16 vidéos maximum au total, non transférables d'un onglet à l'autre.
 */
export const MAX_VIDEOS_PER_PROFILE_TAB = 8;
export const MAX_VIDEO_TITLE_LENGTH = 28;

export const PROFILE_TAB_LABELS: Record<ProfileVideoTab, string> = {
  parcours: 'Parcours de vie',
  projets: 'Initiative personnelle'
};

export interface ProfileTabQuotaStatus {
  tab: ProfileVideoTab;
  label: string;
  count: number;
  max: number;
  isLimitReached: boolean;
  canAdd: boolean;
  limitMessage: string | null;
}

export class ProfileTabVideoLimitError extends Error {
  readonly code = 'PROFILE_TAB_LIMIT_REACHED';
  readonly tab: ProfileVideoTab;
  readonly currentCount: number;
  readonly max: number;

  constructor(tab: ProfileVideoTab, currentCount: number, max: number, message?: string) {
    super(message || getProfileTabLimitMessage(tab));
    this.name = 'ProfileTabVideoLimitError';
    this.tab = tab;
    this.currentCount = currentCount;
    this.max = max;
  }
}

export type SaveUserVideoResult =
  | { ok: true; submission: UserVideoSubmission }
  | { ok: false; error: string; code: 'PROFILE_TAB_LIMIT_REACHED'; tab: ProfileVideoTab; currentCount: number; max: number };

export const INITIAL_DEMO_SUBMISSIONS: UserVideoSubmission[] = [
  {
    id: 'vid-demo-1',
    userId: 'usr-admin-romeo',
    userType: 'INDIVIDUAL',
    authorName: 'Romeo Nonvide',
    authorAvatarUrl: '/assets/duos/paroles-armel.jpg',
    title: 'Origines & Ancrage à Cotonou',
    synopsis: 'Roméo raconte ses huit années passées à l’étranger, le sentiment de l’éloignement et l’évidence intérieure de revenir à Cotonou pour fonder YonyWood.',
    universe: 'casting',
    videoUrl: '/sample.mp4',
    thumbnailUrl: '/assets/duos/paroles-armel.jpg',
    status: 'APPROVED',
    createdAt: '2026-03-01',
    reviewedAt: '2026-03-02'
  },
  {
    id: 'vid-demo-2',
    userId: 'usr-admin-romeo',
    userType: 'INDIVIDUAL',
    authorName: 'Romeo Nonvide',
    authorAvatarUrl: '/assets/duos/paroles-armel.jpg',
    title: 'Dialogue avec les Sages de Ganvié',
    synopsis: 'Rencontre sur l’eau avec les anciens pour recueillir les paroles du lac Nokoué.',
    universe: 'duo',
    videoUrl: '/sample.mp4',
    thumbnailUrl: '/assets/duos/dah-zounon.jpg',
    status: 'PENDING',
    createdAt: '2026-03-27'
  },
  {
    id: 'vid-demo-3',
    userId: 'usr-org-biosolaire',
    userType: 'ORGANIZATION',
    authorName: 'Bio Solaire Bénin',
    authorAvatarUrl: '/assets/duos/kwame-mensah.jpg',
    title: 'L’Énergie propre au cœur des terroirs',
    synopsis: 'Présentation de notre engagement pour l’irrigation solaire paysanne et l’autonomie énergétique au Bénin.',
    universe: 'lumiere',
    videoUrl: '/sample.mp4',
    thumbnailUrl: '/assets/duos/kwame-mensah.jpg',
    status: 'APPROVED',
    createdAt: '2026-02-15',
    reviewedAt: '2026-02-16'
  }
];

function notifyUserVideosUpdated(): void {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent(USER_VIDEOS_UPDATED_EVENT));
  }
}

export function resolveSubmissionProfileTab(
  submission: Pick<UserVideoSubmission, 'profileTab' | 'universe'>
): ProfileVideoTab | null {
  if (submission.profileTab === 'parcours' || submission.profileTab === 'projets') {
    return submission.profileTab;
  }
  const u = (submission.universe || '').toLowerCase().trim();
  if (u === 'parcours' || u === 'soi-parcours' || u === 'recit') {
    return 'parcours';
  }
  if (u === 'projets' || u === 'initiatives' || u === 'soi-projets') {
    return 'projets';
  }
  return null;
}

export function getProfileTabLimitMessage(tab: ProfileVideoTab): string {
  const label = PROFILE_TAB_LABELS[tab];
  return `Vous avez atteint le maximum de ${MAX_VIDEOS_PER_PROFILE_TAB} vidéos pour l’onglet « ${label} ».`;
}

export function getUserVideoSubmissions(userId?: string): UserVideoSubmission[] {
  try {
    const raw = localStorage.getItem(USER_VIDEOS_KEY);
    const list: UserVideoSubmission[] = raw ? JSON.parse(raw) : INITIAL_DEMO_SUBMISSIONS;
    if (userId) {
      return list.filter(v => v.userId === userId);
    }
    return list;
  } catch {
    return userId
      ? INITIAL_DEMO_SUBMISSIONS.filter(v => v.userId === userId)
      : INITIAL_DEMO_SUBMISSIONS;
  }
}

export function getUserProfileTabSubmissions(userId: string, tab: ProfileVideoTab): UserVideoSubmission[] {
  return getUserVideoSubmissions(userId).filter(v => resolveSubmissionProfileTab(v) === tab);
}

export function getProfileTabQuotaStatus(
  userId: string,
  tab: ProfileVideoTab,
  baseExistingCount = 0
): ProfileTabQuotaStatus {
  const storedInTab = getUserProfileTabSubmissions(userId, tab);
  const count = Math.max(0, baseExistingCount) + storedInTab.length;
  const isLimitReached = count >= MAX_VIDEOS_PER_PROFILE_TAB;
  return {
    tab,
    label: PROFILE_TAB_LABELS[tab],
    count,
    max: MAX_VIDEOS_PER_PROFILE_TAB,
    isLimitReached,
    canAdd: !isLimitReached,
    limitMessage: isLimitReached ? getProfileTabLimitMessage(tab) : null
  };
}

export function trySaveUserVideoSubmission(
  submission: Omit<UserVideoSubmission, 'id' | 'createdAt' | 'status'>,
  options?: { baseExistingCount?: number }
): SaveUserVideoResult {
  const resolvedTab = resolveSubmissionProfileTab(submission);

  if (resolvedTab) {
    const quota = getProfileTabQuotaStatus(
      submission.userId,
      resolvedTab,
      options?.baseExistingCount ?? 0
    );
    if (quota.isLimitReached) {
      return {
        ok: false,
        code: 'PROFILE_TAB_LIMIT_REACHED',
        tab: resolvedTab,
        currentCount: quota.count,
        max: quota.max,
        error: quota.limitMessage || getProfileTabLimitMessage(resolvedTab)
      };
    }
  }

  const current = getUserVideoSubmissions();
  const newItem: UserVideoSubmission = {
    ...submission,
    ...(resolvedTab ? { profileTab: resolvedTab } : {}),
    id: `vid-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    status: 'PENDING',
    createdAt: new Date().toISOString().split('T')[0]
  };
  const updated = [newItem, ...current];
  try {
    localStorage.setItem(USER_VIDEOS_KEY, JSON.stringify(updated));
    notifyUserVideosUpdated();
  } catch {
    // ignore storage quota errors gracefully
  }
  return { ok: true, submission: newItem };
}

export function saveUserVideoSubmission(
  submission: Omit<UserVideoSubmission, 'id' | 'createdAt' | 'status'>,
  options?: { baseExistingCount?: number }
): UserVideoSubmission {
  const result = trySaveUserVideoSubmission(submission, options);
  if ('error' in result) {
    throw new ProfileTabVideoLimitError(result.tab, result.currentCount, result.max, result.error);
  }
  return result.submission;
}

export function deleteUserVideoSubmission(id: string): void {
  const current = getUserVideoSubmissions();
  const updated = current.filter(v => v.id !== id);
  try {
    localStorage.setItem(USER_VIDEOS_KEY, JSON.stringify(updated));
    notifyUserVideosUpdated();
  } catch {
    // ignore
  }
}

export function updateVideoSubmissionStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING', reason?: string): void {
  const current = getUserVideoSubmissions();
  const updated = current.map(v => {
    if (v.id === id) {
      return {
        ...v,
        status,
        rejectionReason: reason,
        reviewedAt: new Date().toISOString().split('T')[0]
      };
    }
    return v;
  });
  try {
    localStorage.setItem(USER_VIDEOS_KEY, JSON.stringify(updated));
    notifyUserVideosUpdated();
  } catch {
    // ignore
  }
}

export function updateUserVideoTitle(id: string, newTitle: string): UserVideoSubmission | null {
  const cleanTitle = newTitle.trim().slice(0, MAX_VIDEO_TITLE_LENGTH);
  if (!cleanTitle) return null;

  const current = getUserVideoSubmissions();
  let updatedItem: UserVideoSubmission | null = null;
  const updated = current.map(v => {
    if (v.id === id) {
      updatedItem = { ...v, title: cleanTitle };
      return updatedItem;
    }
    return v;
  });
  if (!updatedItem) return null;
  try {
    localStorage.setItem(USER_VIDEOS_KEY, JSON.stringify(updated));
    notifyUserVideosUpdated();
  } catch {
    // ignore
  }
  return updatedItem;
}

export function updateUserVideoThumbnail(id: string, thumbnailUrl: string): UserVideoSubmission | null {
  const cleanThumb = thumbnailUrl.trim();
  if (!cleanThumb) return null;

  const current = getUserVideoSubmissions();
  let updatedItem: UserVideoSubmission | null = null;
  const updated = current.map(v => {
    if (v.id === id) {
      updatedItem = { ...v, thumbnailUrl: cleanThumb };
      return updatedItem;
    }
    return v;
  });
  if (!updatedItem) return null;
  try {
    localStorage.setItem(USER_VIDEOS_KEY, JSON.stringify(updated));
    notifyUserVideosUpdated();
  } catch {
    // ignore
  }
  return updatedItem;
}
