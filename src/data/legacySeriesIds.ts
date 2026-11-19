/**
 * Table unique de correspondance des anciens identifiants de séries vers les 8 nouveaux identifiants canoniques.
 * Utilisée uniquement pour :
 *  - migrer les valeurs persistées (localStorage, routes/liens, vidéos soumises)
 *  - résoudre les anciens chemins d'affiches conservées sur disque
 *  - maintenir la rétrocompatibilité des API et vues héritées
 */

export const CANONICAL_SERIES_IDS = [
  'remedes-e-vivi',
  'amin-amen-legba',
  'phd-azovi',
  'blacks-one-nyonoukpo',
  'fiat-luxe-irokos',
  'horizons-finagnon',
  'builders-mi-do-kpo',
  'regards-gbe'
] as const;

export type CanonicalSeriesId = (typeof CANONICAL_SERIES_IDS)[number];

export interface LegacySeriesMappingEntry {
  legacyId: string;
  status: 'mapped' | 'hidden' | 'split_hidden';
  targetSeriesId: CanonicalSeriesId | null;
  note: string;
  splitSides?: {
    sideALabel: string;
    sideATarget: { seriesId: CanonicalSeriesId; partId: 'part-a' | 'part-b' } | null;
    sideBLabel: string;
    sideBTarget: { seriesId: CanonicalSeriesId; partId: 'part-a' | 'part-b' } | null;
  };
}

export interface SeriesPosterFilesEntry {
  mainPosterUrl: string;
  partAPosterUrl: string;
  partBPosterUrl: string;
}

/**
 * Chemins des affiches existantes conservées temporairement sans renommage de fichier.
 * Les séries dont les côtés 1/2 ont changé d'ordre pointent vers l'affiche de côté correspondante.
 */
export const SERIES_POSTER_FILES: Record<CanonicalSeriesId, SeriesPosterFilesEntry> = {
  'remedes-e-vivi': {
    mainPosterUrl: encodeURI('/Posters/Remedes ‹ › E Vivi.png'),
    partAPosterUrl: encodeURI('/Posters/Sides/Remedes.png'),
    partBPosterUrl: encodeURI('/Posters/Sides/E Vivi.png')
  },
  'amin-amen-legba': {
    mainPosterUrl: encodeURI('/Posters/Amin Amen ‹ › Legba.png'),
    partAPosterUrl: encodeURI('/Posters/Sides/Amin Amen.png'),
    partBPosterUrl: encodeURI('/Posters/Sides/Legba.png')
  },
  'phd-azovi': {
    mainPosterUrl: encodeURI('/Posters/PhD <> Azovi.png'),
    partAPosterUrl: encodeURI('/Posters/Sides/PhD.png'),
    partBPosterUrl: encodeURI('/Posters/Sides/Azovi.png')
  },
  'blacks-one-nyonoukpo': {
    mainPosterUrl: encodeURI('/Posters/Blacks One ‹ › Nyonu\u0300.png'),
    partAPosterUrl: encodeURI('/Posters/Sides/Blacks One.png'),
    partBPosterUrl: encodeURI('/Posters/Sides/Nyonu\u0300.png')
  },
  'fiat-luxe-irokos': {
    mainPosterUrl: encodeURI('/Posters/Fiat Luxe <> Irokos.png'),
    partAPosterUrl: encodeURI('/Posters/Sides/Fiat Luxe.png'),
    partBPosterUrl: encodeURI('/Posters/Sides/Irokos.png')
  },
  'horizons-finagnon': {
    mainPosterUrl: encodeURI('/Posters/Horizons ‹ › Finagnon.png'),
    partAPosterUrl: encodeURI('/Posters/Sides/Horizons.png'),
    partBPosterUrl: encodeURI('/Posters/Sides/Finagnon.png')
  },
  'builders-mi-do-kpo': {
    mainPosterUrl: encodeURI('/Posters/Builders <> Mi do kpo\u0302.png'),
    partAPosterUrl: encodeURI('/Posters/Sides/Builders.png'),
    partBPosterUrl: encodeURI('/Posters/Sides/Mi do kpo.png')
  },
  'regards-gbe': {
    mainPosterUrl: encodeURI('/Posters/Regards ‹ › Gbe.png'),
    partAPosterUrl: encodeURI('/Posters/Sides/Regards.png'),
    partBPosterUrl: encodeURI('/Posters/Sides/Gbe\u0301.png')
  }
};

export const LEGACY_SERIES_MAPPING: Record<string, LegacySeriesMappingEntry> = {
  // Anciens IDs v2 -> nouveaux IDs officiels (même position)
  'care-feed': {
    legacyId: 'care-feed',
    status: 'mapped',
    targetSeriesId: 'remedes-e-vivi',
    note: 'Care <> Feed -> Remèdes ‹ › E Vivi'
  },
  'vodun-rays-autre-foi': {
    legacyId: 'vodun-rays-autre-foi',
    status: 'mapped',
    targetSeriesId: 'amin-amen-legba',
    note: 'Vodun Rays <> Autre Foi -> Amin Amen ‹ › Legba'
  },
  'baobabs-bambous': {
    legacyId: 'baobabs-bambous',
    status: 'mapped',
    targetSeriesId: 'phd-azovi',
    note: 'Baobabs <> Bambous -> PhD ‹ › Azovi'
  },
  'phd-nukplonkplon': {
    legacyId: 'phd-nukplonkplon',
    status: 'mapped',
    targetSeriesId: 'phd-azovi',
    note: 'PhD ‹ › Nukplonkplon -> PhD ‹ › Azovi'
  },
  'blacks-one-wowmen': {
    legacyId: 'blacks-one-wowmen',
    status: 'mapped',
    targetSeriesId: 'blacks-one-nyonoukpo',
    note: 'Blacks One <> Wowmen -> Blacks One ‹ › Nyonoukpo'
  },
  'fiat-luxe-phd': {
    legacyId: 'fiat-luxe-phd',
    status: 'mapped',
    targetSeriesId: 'fiat-luxe-irokos',
    note: 'Fiat Luxe <> PhD -> Fiat Luxe ‹ › Irokos'
  },
  'finagnon-horizons': {
    legacyId: 'finagnon-horizons',
    status: 'mapped',
    targetSeriesId: 'horizons-finagnon',
    note: 'Finagnon <> Horizons -> Horizons ‹ › Finagnon'
  },
  'performers-builders': {
    legacyId: 'performers-builders',
    status: 'mapped',
    targetSeriesId: 'builders-mi-do-kpo',
    note: 'Performers <> Builders -> Builders ‹ › Mi do kpô'
  },
  'builders-akwe': {
    legacyId: 'builders-akwe',
    status: 'mapped',
    targetSeriesId: 'builders-mi-do-kpo',
    note: 'Builders ‹ › Àkwè -> Builders ‹ › Mi do kpô'
  },
  'paroles-regards': {
    legacyId: 'paroles-regards',
    status: 'mapped',
    targetSeriesId: 'regards-gbe',
    note: 'Paroles <> Regards -> Regards ‹ › Gbé'
  },

  // Anciens IDs v1 -> nouveaux IDs officiels
  'blacks-one-amazones': {
    legacyId: 'blacks-one-amazones',
    status: 'mapped',
    targetSeriesId: 'blacks-one-nyonoukpo',
    note: 'Correspondance directe vers Blacks One ‹ › Nyonoukpo'
  },
  'blacks-one-beyond-eve': {
    legacyId: 'blacks-one-beyond-eve',
    status: 'mapped',
    targetSeriesId: 'blacks-one-nyonoukpo',
    note: 'Correspondance directe vers Blacks One ‹ › Nyonoukpo'
  },
  'baobab-bambou': {
    legacyId: 'baobab-bambou',
    status: 'mapped',
    targetSeriesId: 'phd-azovi',
    note: 'Ancien baobab-bambou -> PhD ‹ › Azovi'
  },
  'esu-jesus': {
    legacyId: 'esu-jesus',
    status: 'mapped',
    targetSeriesId: 'amin-amen-legba',
    note: 'Ancien identifiant de Amin Amen ‹ › Legba (ex Èṣù <> Jésus)'
  },
  'jesus-legba': {
    legacyId: 'jesus-legba',
    status: 'mapped',
    targetSeriesId: 'amin-amen-legba',
    note: 'Correspondance directe vers Amin Amen ‹ › Legba'
  },
  'pictures-words': {
    legacyId: 'pictures-words',
    status: 'mapped',
    targetSeriesId: 'regards-gbe',
    note: 'Correspondance directe vers Regards ‹ › Gbé'
  },
  'benin-monde': {
    legacyId: 'benin-monde',
    status: 'mapped',
    targetSeriesId: 'horizons-finagnon',
    note: 'Correspondance directe vers Horizons ‹ › Finagnon'
  },
  'benin-world': {
    legacyId: 'benin-world',
    status: 'mapped',
    targetSeriesId: 'horizons-finagnon',
    note: 'Correspondance directe vers Horizons ‹ › Finagnon'
  },

  // Anciennes séries v1 sans équivalent (masquées)
  'roots-routes': {
    legacyId: 'roots-routes',
    status: 'hidden',
    targetSeriesId: null,
    note: 'Aucun équivalent direct dans le registre actuel, série masquée'
  },
  'other-eyes-sixth-sense': {
    legacyId: 'other-eyes-sixth-sense',
    status: 'hidden',
    targetSeriesId: null,
    note: 'Aucun équivalent direct dans le registre actuel, série masquée'
  },
  'safer-healer': {
    legacyId: 'safer-healer',
    status: 'hidden',
    targetSeriesId: null,
    note: 'Ancienne série disparue, masquée'
  },
  'coaching-unlimited': {
    legacyId: 'coaching-unlimited',
    status: 'hidden',
    targetSeriesId: null,
    note: 'Ancienne série disparue, masquée'
  },
  'coaching-tradipraticiens': {
    legacyId: 'coaching-tradipraticiens',
    status: 'hidden',
    targetSeriesId: null,
    note: 'Ancienne série disparue, masquée'
  },

  // Séries v1 scindées : chaque ancien ID est masqué dans son ensemble ; ses côtés pointent vers les nouveaux IDs
  'coaching-phd': {
    legacyId: 'coaching-phd',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : côté Coaching masqué, côté PhD -> phd-azovi (part-a)',
    splitSides: {
      sideALabel: 'Coaching',
      sideATarget: null,
      sideBLabel: 'PhD',
      sideBTarget: { seriesId: 'phd-azovi', partId: 'part-a' }
    }
  },
  'fiat-luxe-builders': {
    legacyId: 'fiat-luxe-builders',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Fiat Luxe -> fiat-luxe-irokos (part-a), Builders -> builders-mi-do-kpo (part-a)',
    splitSides: {
      sideALabel: 'Fiat Luxe',
      sideATarget: { seriesId: 'fiat-luxe-irokos', partId: 'part-a' },
      sideBLabel: 'Builders',
      sideBTarget: { seriesId: 'builders-mi-do-kpo', partId: 'part-a' }
    }
  },
  'finagnon-qosqorico': {
    legacyId: 'finagnon-qosqorico',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Finagnon -> horizons-finagnon (part-b), Qosqorico masqué',
    splitSides: {
      sideALabel: 'Finagnon',
      sideATarget: { seriesId: 'horizons-finagnon', partId: 'part-b' },
      sideBLabel: 'Qosqorico',
      sideBTarget: null
    }
  },
  'dixeat-fiat-luxe': {
    legacyId: 'dixeat-fiat-luxe',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Dixeat masqué, Fiat Luxe -> fiat-luxe-irokos (part-a)',
    splitSides: {
      sideALabel: 'Dixeat',
      sideATarget: null,
      sideBLabel: 'Fiat Luxe',
      sideBTarget: { seriesId: 'fiat-luxe-irokos', partId: 'part-a' }
    }
  },
  'investors-builders': {
    legacyId: 'investors-builders',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Investors masqué, Builders -> builders-mi-do-kpo (part-a)',
    splitSides: {
      sideALabel: 'Investors',
      sideATarget: null,
      sideBLabel: 'Builders',
      sideBTarget: { seriesId: 'builders-mi-do-kpo', partId: 'part-a' }
    }
  },
  'builders-seekers': {
    legacyId: 'builders-seekers',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Builders -> builders-mi-do-kpo (part-a), Seekers masqué',
    splitSides: {
      sideALabel: 'Builders',
      sideATarget: { seriesId: 'builders-mi-do-kpo', partId: 'part-a' },
      sideBLabel: 'Seekers',
      sideBTarget: null
    }
  },
  'focus-phd': {
    legacyId: 'focus-phd',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Focus masqué, PhD -> phd-azovi (part-a)',
    splitSides: {
      sideALabel: 'Focus',
      sideATarget: null,
      sideBLabel: 'PhD',
      sideBTarget: { seriesId: 'phd-azovi', partId: 'part-a' }
    }
  },
  'dixeat-builders': {
    legacyId: 'dixeat-builders',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Dixeat masqué, Builders -> builders-mi-do-kpo (part-a)',
    splitSides: {
      sideALabel: 'Dixeat',
      sideATarget: null,
      sideBLabel: 'Builders',
      sideBTarget: { seriesId: 'builders-mi-do-kpo', partId: 'part-a' }
    }
  }
};

export const LEGACY_SERIES_ID_SET = new Set<string>(CANONICAL_SERIES_IDS);

/**
 * Extrait l'identifiant de base (gère les IDs d'épisodes "<seriesId>__ep1" et préfixes "series/<seriesId>").
 */
export function extractBaseSeriesId(rawId?: string | null): string | null {
  if (!rawId || typeof rawId !== 'string') return null;
  let trimmed = rawId.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('series/')) {
    trimmed = trimmed.slice('series/'.length);
  }
  const sepIndex = trimmed.indexOf('__');
  return sepIndex >= 0 ? trimmed.slice(0, sepIndex) : trimmed;
}

/**
 * Résout un identifiant de série (actuel ou ancien) vers son identifiant canonique actuel.
 * Retourne null si la série est masquée, scindée sans équivalent direct, ou inconnue.
 */
export function resolveCanonicalSeriesId(rawId?: string | null): CanonicalSeriesId | null {
  const baseId = extractBaseSeriesId(rawId);
  if (!baseId) return null;

  if (LEGACY_SERIES_ID_SET.has(baseId)) {
    return baseId as CanonicalSeriesId;
  }

  const mapping = LEGACY_SERIES_MAPPING[baseId];
  if (mapping && mapping.status === 'mapped' && mapping.targetSeriesId) {
    return mapping.targetSeriesId;
  }

  return null;
}

/**
 * Indique si un identifiant correspond à une ancienne série masquée ou scindée.
 */
export function isHiddenLegacySeriesId(rawId?: string | null): boolean {
  const baseId = extractBaseSeriesId(rawId);
  if (!baseId) return false;
  if (LEGACY_SERIES_ID_SET.has(baseId)) return false;
  const mapping = LEGACY_SERIES_MAPPING[baseId];
  return Boolean(mapping && mapping.targetSeriesId === null);
}

/**
 * Normalise une liste d'identifiants de séries (ex. yonywood_selected_series).
 * Retourne { ids, changed, usedDefault }.
 */
export function normalizeSelectedSeriesList(rawValue: unknown): {
  ids: CanonicalSeriesId[];
  changed: boolean;
  usedDefault: boolean;
} {
  const allDefaults = [...CANONICAL_SERIES_IDS];
  if (!Array.isArray(rawValue) || rawValue.length === 0) {
    return { ids: allDefaults, changed: true, usedDefault: true };
  }

  const normalized = Array.from(
    new Set(
      rawValue
        .filter((item): item is string => typeof item === 'string')
        .map((id) => resolveCanonicalSeriesId(id))
        .filter((id): id is CanonicalSeriesId => Boolean(id))
    )
  );

  if (normalized.length === 0) {
    return { ids: allDefaults, changed: true, usedDefault: true };
  }

  const changed = JSON.stringify(normalized) !== JSON.stringify(rawValue);
  return { ids: normalized, changed, usedDefault: false };
}

/**
 * Migre un éventuel identifiant stocké dans localStorage pour yonywood_last_screen.
 */
export function migratePersistedScreenSeriesId(screenObj: unknown): {
  screen: any;
  changed: boolean;
} {
  if (!screenObj || typeof screenObj !== 'object') {
    return { screen: screenObj, changed: false };
  }
  const clone: Record<string, any> = { ...(screenObj as Record<string, any>) };
  let changed = false;

  for (const field of ['documentaryId', 'seriesId', 'selectedDocId', 'returnToDocId', 'returnFinalChoiceId'] as const) {
    const val = clone[field];
    if (typeof val === 'string' && val.trim()) {
      const base = extractBaseSeriesId(val);
      if (base && (LEGACY_SERIES_MAPPING[base] || LEGACY_SERIES_ID_SET.has(base))) {
        const canonical = resolveCanonicalSeriesId(val);
        if (canonical) {
          const suffix = val.includes('__') ? val.slice(val.indexOf('__')) : '';
          const nextVal = `${canonical}${suffix}`;
          if (nextVal !== val) {
            clone[field] = nextVal;
            changed = true;
          }
        } else {
          // Ancienne série masquée -> réinitialisation propre sur le premier ID officiel
          clone[field] = CANONICAL_SERIES_IDS[0];
          changed = true;
        }
      }
    }
  }

  if (typeof clone.duoId === 'string' && clone.duoId.startsWith('duo-')) {
    const match = clone.duoId.match(/^duo-(.+?)(-\d+)$/);
    if (match) {
      const rawSeriesPart = match[1];
      const numSuffix = match[2];
      if (LEGACY_SERIES_MAPPING[rawSeriesPart] || LEGACY_SERIES_ID_SET.has(rawSeriesPart)) {
        const canonical = resolveCanonicalSeriesId(rawSeriesPart);
        const nextDuoId = canonical
          ? `duo-${canonical}${numSuffix}`
          : `duo-${CANONICAL_SERIES_IDS[0]}-01`;
        if (nextDuoId !== clone.duoId) {
          clone.duoId = nextDuoId;
          changed = true;
        }
      }
    }
  }

  return { screen: clone, changed };
}
