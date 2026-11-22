/**
 * Table unique de correspondance des anciens identifiants de séries vers les 8 nouveaux identifiants canoniques.
 * Utilisée pour :
 *  - migrer les valeurs persistées (localStorage, routes/liens, vidéos soumises)
 *  - pointer vers les chemins exacts des affiches officielles sur disque
 *  - maintenir la rétrocompatibilité des API et vues héritées
 */

export const CANONICAL_SERIES_IDS = [
  'modernite-tradition',
  'jesus-legba',
  'phd-apprentis',
  'blacks-one-wowmen',
  'bambous-irokos',
  'horizons-benin',
  'builders-coachs',
  'regards-paroles'
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
 * Chemins exacts des affiches officielles dans /public/Posters/Duos/ et /public/Posters/Sides/
 * (respect strict des caractères Unicode NFD, extensions et chevrons présents sur disque).
 */
export const SERIES_POSTER_FILES: Record<CanonicalSeriesId, SeriesPosterFilesEntry> = {
  'modernite-tradition': {
    mainPosterUrl: encodeURI('/Posters/Duos/Modernite\u0301 <> Tradition.png'),
    partAPosterUrl: encodeURI('/Posters/Sides/Modernite\u0301.png'),
    partBPosterUrl: encodeURI('/Posters/Sides/Tradition.png')
  },
  'jesus-legba': {
    mainPosterUrl: encodeURI('/Posters/Duos/Jesus <> Legba.png'),
    partAPosterUrl: encodeURI('/Posters/Sides/Jesus.png'),
    partBPosterUrl: encodeURI('/Posters/Sides/Legba.png')
  },
  'phd-apprentis': {
    mainPosterUrl: encodeURI('/Posters/Duos/PhD <> Apprentis.png'),
    partAPosterUrl: encodeURI('/Posters/Sides/PhD.png'),
    partBPosterUrl: encodeURI('/Posters/Sides/Apprentis.png')
  },
  'blacks-one-wowmen': {
    mainPosterUrl: encodeURI('/Posters/Duos/Blacks One <> Wowmen.png'),
    partAPosterUrl: encodeURI('/Posters/Sides/Blacks One.png'),
    partBPosterUrl: encodeURI('/Posters/Sides/Wowmen.png')
  },
  'bambous-irokos': {
    mainPosterUrl: encodeURI('/Posters/Duos/Bambous <> Irokos.png'),
    partAPosterUrl: encodeURI('/Posters/Sides/Bambous.png'),
    partBPosterUrl: encodeURI('/Posters/Sides/Irokos.png')
  },
  'horizons-benin': {
    mainPosterUrl: encodeURI('/Posters/Duos/Horizons <> Benin.png'),
    partAPosterUrl: encodeURI('/Posters/Sides/Horizons.png'),
    partBPosterUrl: encodeURI('/Posters/Sides/Benin.png')
  },
  'builders-coachs': {
    mainPosterUrl: encodeURI('/Posters/Duos/Builders <> Coachs.jpg'),
    partAPosterUrl: encodeURI('/Posters/Sides/Builders.png'),
    partBPosterUrl: encodeURI('/Posters/Sides/Coachs.png')
  },
  'regards-paroles': {
    mainPosterUrl: encodeURI('/Posters/Duos/Images <> Paroles.png'),
    partAPosterUrl: encodeURI('/Posters/Sides/Images.png'),
    partBPosterUrl: encodeURI('/Posters/Sides/Paroles.png')
  }
};

export const LEGACY_SERIES_MAPPING: Record<string, LegacySeriesMappingEntry> = {
  // Anciens IDs v3 -> nouveaux IDs officiels (même position)
  'remedes-e-vivi': {
    legacyId: 'remedes-e-vivi',
    status: 'mapped',
    targetSeriesId: 'modernite-tradition',
    note: 'Remèdes ‹ › E Vivi -> Modernité ‹ › Tradition'
  },
  'amin-amen-legba': {
    legacyId: 'amin-amen-legba',
    status: 'mapped',
    targetSeriesId: 'jesus-legba',
    note: 'Amin Amen ‹ › Legba -> Jesus ‹ › Legba'
  },
  'phd-azovi': {
    legacyId: 'phd-azovi',
    status: 'mapped',
    targetSeriesId: 'phd-apprentis',
    note: 'PhD ‹ › Azovi -> PhD ‹ › Apprentis'
  },
  'blacks-one-nyonoukpo': {
    legacyId: 'blacks-one-nyonoukpo',
    status: 'mapped',
    targetSeriesId: 'blacks-one-wowmen',
    note: 'Blacks One ‹ › Nyonoukpo -> Blacks One ‹ › Wowmen'
  },
  'fiat-luxe-irokos': {
    legacyId: 'fiat-luxe-irokos',
    status: 'mapped',
    targetSeriesId: 'bambous-irokos',
    note: 'Fiat Luxe ‹ › Irokos -> Bambous ‹ › Irokos'
  },
  'horizons-finagnon': {
    legacyId: 'horizons-finagnon',
    status: 'mapped',
    targetSeriesId: 'horizons-benin',
    note: 'Horizons ‹ › Finagnon -> Horizons ‹ › Benin'
  },
  'builders-mi-do-kpo': {
    legacyId: 'builders-mi-do-kpo',
    status: 'mapped',
    targetSeriesId: 'builders-coachs',
    note: 'Builders ‹ › Mi do kpô -> Builders ‹ › Coachs'
  },
  'regards-gbe': {
    legacyId: 'regards-gbe',
    status: 'mapped',
    targetSeriesId: 'regards-paroles',
    note: 'Regards ‹ › Gbé -> Images ‹ › Paroles'
  },

  // Anciens IDs v2 -> nouveaux IDs officiels
  'care-feed': {
    legacyId: 'care-feed',
    status: 'mapped',
    targetSeriesId: 'modernite-tradition',
    note: 'Care <> Feed -> Modernité ‹ › Tradition'
  },
  'vodun-rays-autre-foi': {
    legacyId: 'vodun-rays-autre-foi',
    status: 'mapped',
    targetSeriesId: 'jesus-legba',
    note: 'Vodun Rays <> Autre Foi -> Jesus ‹ › Legba'
  },
  'baobabs-bambous': {
    legacyId: 'baobabs-bambous',
    status: 'mapped',
    targetSeriesId: 'bambous-irokos',
    note: 'Baobabs <> Bambous -> Bambous ‹ › Irokos'
  },
  'phd-nukplonkplon': {
    legacyId: 'phd-nukplonkplon',
    status: 'mapped',
    targetSeriesId: 'phd-apprentis',
    note: 'PhD ‹ › Nukplonkplon -> PhD ‹ › Apprentis'
  },
  'fiat-luxe-phd': {
    legacyId: 'fiat-luxe-phd',
    status: 'mapped',
    targetSeriesId: 'phd-apprentis',
    note: 'Fiat Luxe <> PhD -> PhD ‹ › Apprentis'
  },
  'finagnon-horizons': {
    legacyId: 'finagnon-horizons',
    status: 'mapped',
    targetSeriesId: 'horizons-benin',
    note: 'Finagnon <> Horizons -> Horizons ‹ › Benin'
  },
  'performers-builders': {
    legacyId: 'performers-builders',
    status: 'mapped',
    targetSeriesId: 'builders-coachs',
    note: 'Performers <> Builders -> Builders ‹ › Coachs'
  },
  'builders-akwe': {
    legacyId: 'builders-akwe',
    status: 'mapped',
    targetSeriesId: 'builders-coachs',
    note: 'Builders ‹ › Àkwè -> Builders ‹ › Coachs'
  },
  'paroles-regards': {
    legacyId: 'paroles-regards',
    status: 'mapped',
    targetSeriesId: 'regards-paroles',
    note: 'Paroles <> Regards -> Images ‹ › Paroles'
  },

  // Anciens IDs v1 -> nouveaux IDs officiels
  'blacks-one-amazones': {
    legacyId: 'blacks-one-amazones',
    status: 'mapped',
    targetSeriesId: 'blacks-one-wowmen',
    note: 'Correspondance directe vers Blacks One ‹ › Wowmen'
  },
  'blacks-one-beyond-eve': {
    legacyId: 'blacks-one-beyond-eve',
    status: 'mapped',
    targetSeriesId: 'blacks-one-wowmen',
    note: 'Correspondance directe vers Blacks One ‹ › Wowmen'
  },
  'baobab-bambou': {
    legacyId: 'baobab-bambou',
    status: 'mapped',
    targetSeriesId: 'bambous-irokos',
    note: 'Ancien baobab-bambou -> Bambous ‹ › Irokos'
  },
  'esu-jesus': {
    legacyId: 'esu-jesus',
    status: 'mapped',
    targetSeriesId: 'jesus-legba',
    note: 'Ancien identifiant de Jesus ‹ › Legba (ex Èṣù <> Jésus)'
  },
  'pictures-words': {
    legacyId: 'pictures-words',
    status: 'mapped',
    targetSeriesId: 'regards-paroles',
    note: 'Correspondance directe vers Images ‹ › Paroles'
  },
  'benin-monde': {
    legacyId: 'benin-monde',
    status: 'mapped',
    targetSeriesId: 'horizons-benin',
    note: 'Correspondance directe vers Horizons ‹ › Benin'
  },
  'benin-world': {
    legacyId: 'benin-world',
    status: 'mapped',
    targetSeriesId: 'horizons-benin',
    note: 'Correspondance directe vers Horizons ‹ › Benin'
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
    note: 'Scindée : Coachs -> builders-coachs (part-b), PhD -> phd-apprentis (part-a)',
    splitSides: {
      sideALabel: 'Coachs',
      sideATarget: { seriesId: 'builders-coachs', partId: 'part-b' },
      sideBLabel: 'PhD',
      sideBTarget: { seriesId: 'phd-apprentis', partId: 'part-a' }
    }
  },
  'fiat-luxe-builders': {
    legacyId: 'fiat-luxe-builders',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Builders -> builders-coachs (part-a)',
    splitSides: {
      sideALabel: 'Fiat Luxe',
      sideATarget: null,
      sideBLabel: 'Builders',
      sideBTarget: { seriesId: 'builders-coachs', partId: 'part-a' }
    }
  },
  'finagnon-qosqorico': {
    legacyId: 'finagnon-qosqorico',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Benin -> horizons-benin (part-b), Qosqorico masqué',
    splitSides: {
      sideALabel: 'Finagnon',
      sideATarget: { seriesId: 'horizons-benin', partId: 'part-b' },
      sideBLabel: 'Qosqorico',
      sideBTarget: null
    }
  },
  'dixeat-fiat-luxe': {
    legacyId: 'dixeat-fiat-luxe',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : ancienne série masquée',
    splitSides: {
      sideALabel: 'Dixeat',
      sideATarget: null,
      sideBLabel: 'Fiat Luxe',
      sideBTarget: null
    }
  },
  'investors-builders': {
    legacyId: 'investors-builders',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Investors masqué, Builders -> builders-coachs (part-a)',
    splitSides: {
      sideALabel: 'Investors',
      sideATarget: null,
      sideBLabel: 'Builders',
      sideBTarget: { seriesId: 'builders-coachs', partId: 'part-a' }
    }
  },
  'builders-seekers': {
    legacyId: 'builders-seekers',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Builders -> builders-coachs (part-a), Seekers masqué',
    splitSides: {
      sideALabel: 'Builders',
      sideATarget: { seriesId: 'builders-coachs', partId: 'part-a' },
      sideBLabel: 'Seekers',
      sideBTarget: null
    }
  },
  'focus-phd': {
    legacyId: 'focus-phd',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Focus masqué, PhD -> phd-apprentis (part-a)',
    splitSides: {
      sideALabel: 'Focus',
      sideATarget: null,
      sideBLabel: 'PhD',
      sideBTarget: { seriesId: 'phd-apprentis', partId: 'part-a' }
    }
  },
  'dixeat-builders': {
    legacyId: 'dixeat-builders',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Dixeat masqué, Builders -> builders-coachs (part-a)',
    splitSides: {
      sideALabel: 'Dixeat',
      sideATarget: null,
      sideBLabel: 'Builders',
      sideBTarget: { seriesId: 'builders-coachs', partId: 'part-a' }
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
