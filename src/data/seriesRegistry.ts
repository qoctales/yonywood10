export type SeriesEpisodeStatus = 'coming_soon' | 'published';

export interface SeriesEpisode {
  id: 'ep1' | 'ep2' | 'ep3' | 'ep4';
  number: '01' | '02' | '03' | '04';
  title: string;
  question: string;
  status: SeriesEpisodeStatus;
}

export interface SeriesSide {
  id: 'part-a' | 'part-b';
  name: string;
  description: string;
  posterUrl: string;
}

export interface SeriesRegistryEntry {
  id: string;
  title: string;
  partA: SeriesSide;
  partB: SeriesSide;
  synopsis: string;
  posterUrl: string;
  episodes: [SeriesEpisode, SeriesEpisode, SeriesEpisode, SeriesEpisode];
}

export interface LegacySeriesMappingEntry {
  legacyId: string;
  status: 'mapped' | 'hidden' | 'split_hidden';
  targetSeriesId: string | null;
  note: string;
  splitSides?: {
    sideALabel: string;
    sideATarget: { seriesId: string; partId: 'part-a' | 'part-b' } | null;
    sideBLabel: string;
    sideBTarget: { seriesId: string; partId: 'part-a' | 'part-b' } | null;
  };
}

/**
 * Registre officiel des 8 séries Duocumentaires (v2), dans l'ordre définitif.
 * Note interne : l'identifiant est strictement "care-feed" (jamais "feed" seul).
 */
export const SERIES_REGISTRY: SeriesRegistryEntry[] = [
  {
    id: 'care-feed',
    title: 'Care <> Feed',
    partA: {
      id: 'part-a',
      name: 'Care',
      description:
        "Médecins, infirmiers, sages-femmes, pharmaciens, aides-soignants, tradipraticiens, herboristes, praticiens de médecine douce, et ceux qu'ils ont soignés. Un monde de gestes, de gardes de nuit et de confiance, où toutes les médecines se retrouvent.",
      posterUrl: encodeURI('/Posters/Sides/Care.png')
    },
    partB: {
      id: 'part-b',
      name: 'Feed',
      description:
        "Agriculteurs, maraîchers, pêcheurs, cuisiniers, vendeuses de street food, marchandes de marché : tous ceux qui font que d'autres mangent. Un monde de levers à l'aube, de terre, de feu et de marchés.",
      posterUrl: encodeURI('/Posters/Sides/Feed.png')
    },
    synopsis:
      "Deux façons de veiller sur les autres : celles et ceux qui prennent soin, de toutes les médecines, et celles et ceux qui nourrissent, du champ à l'assiette. Ils se lèvent tôt, rentrent fatigués, et tiennent les autres debout sans qu'on le remarque. La série leur pose les mêmes questions : le moment où ce métier est devenu une évidence, la nuit ou le matin où il a fallu continuer, la personne dont ils se souviennent, ce qu'ils ramènent chez eux le soir.",
    posterUrl: encodeURI('/Posters/Care ‹ › Feed.png'),
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: "L'évidence",
        question:
          'Racontez le moment où vous avez compris que votre métier serait de vous occuper des autres.',
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Tenir bon',
        question:
          "Racontez une nuit, ou un matin, où vous avez continué alors que vous n'en pouviez plus.",
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: 'Une rencontre',
        question:
          'Racontez une personne dont vous vous souvenez parmi toutes celles que votre travail a croisées.',
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: "Ce qu'on ramène le soir",
        question:
          "Racontez un soir où vous êtes rentré chez vous en pensant encore à quelqu'un du travail.",
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'vodun-rays-autre-foi',
    title: 'Vodun Rays <> Autre Foi',
    partA: {
      id: 'part-a',
      name: 'Vodun Rays',
      description:
        "Pratiquants du Vodun et des traditions qui lui sont liées : prêtres et prêtresses, initiés, adeptes, familles qui entretiennent un culte, et aussi des descendants de la diaspora (Brésil, Cuba, Haïti) qui retrouvent ces racines.",
      posterUrl: encodeURI('/Posters/Sides/Vodun Rays.png')
    },
    partB: {
      id: 'part-b',
      name: 'Autre Foi',
      description:
        "Toute personne ayant embrassé une croyance autre que le Vodun : chrétiens de toutes confessions, musulmans, bouddhistes, membres d'ordres mystiques ou ésotériques (rosicruciens, francs-maçons...), et toute autre foi qui a du sens pour eux. Un monde de quête intérieure, de prière ou de pratique, et d'engagement.",
      posterUrl: encodeURI('/Posters/Sides/Autre Foi.png')
    },
    synopsis:
      "Au Bénin, le Vodun occupe une place à part : une tradition d'origine, à laquelle beaucoup d'autres croyances viennent faire face. D'un côté, Vodun Rays, qui rassemble les pratiquants du Vodun et des traditions qui lui sont liées. De l'autre, Autre Foi, qui rassemble tous ceux qui ont embrassé une autre croyance — catholiques, musulmans, bouddhistes, rosicruciens, francs-maçons, et bien d'autres spiritualités, religions ou ordres mystiques, connus ou plus discrets. Le Vodun est au centre, comme point de départ. La série ne demande pas qui a raison. Elle demande à chacun de raconter à quel moment il s'est senti appelé, a douté, a eu besoin de courage, et ce qu'il veut transmettre.",
    posterUrl: encodeURI('/Posters/Vodun Rays ‹ › Autre Foi.png'),
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: "L'appel",
        question:
          "Racontez le moment où vous avez senti qu'il existait quelque chose de plus grand que vous.",
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Le vacillement',
        question: 'Racontez un moment où ce qui vous tenait debout a vacillé.',
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: 'Le courage de croire',
        question:
          "Racontez une fois où ce en quoi vous croyez vous a demandé plus de courage que vous n'en pensiez avoir.",
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: "Ce qu'on transmet",
        question:
          "Racontez ce que vous voudriez transmettre, à quelqu'un que vous aimez, de ce qui vous a tenu debout.",
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'baobabs-bambous',
    title: 'Baobabs <> Bambous',
    partA: {
      id: 'part-a',
      name: 'Baobabs',
      description:
        "Les aînés, dépositaires de mémoire : grands-parents, retraités, anciens du village ou du quartier, dignitaires. Un monde où l'on transmet par le récit.",
      posterUrl: encodeURI('/Posters/Sides/Baobabs.png')
    },
    partB: {
      id: 'part-b',
      name: 'Bambous',
      description:
        'Les jeunes adultes (18 ans minimum) qui construisent leur vie : étudiants, apprentis, jeunes créateurs, jeunes actifs. Un monde de projets, de doutes et d\'impatience.',
      posterUrl: encodeURI('/Posters/Sides/Bambous.png')
    },
    synopsis:
      "Un baobab pousse lentement et vit des siècles ; un bambou grandit à vue d'œil et plie sans casser. Deux générations, deux rythmes, rarement invitées à se parler sans hiérarchie. La série les met face à la même question : un souvenir d'enfance, une surprise venue d'un autre âge, une erreur dont on a appris, ce qu'on voudrait laisser derrière soi.",
    posterUrl: encodeURI('/Posters/Baobabs ‹ › Bambous.png'),
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: "L'enfance",
        question: "Racontez l'instant de votre enfance que vous voudriez revivre une dernière fois.",
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: "D'un autre âge",
        question:
          "Racontez ce que quelqu'un d'une autre génération vous a fait comprendre sans le vouloir.",
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: "L'erreur",
        question:
          "Racontez une erreur que vous ne voudriez pas effacer, ou que vous n'avez pas fini de regretter.",
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: 'Ce qui reste',
        question:
          "Qu'aimeriez-vous qu'il reste de vous dans la vie des autres, quand vous ne serez plus là ?",
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'blacks-one-wowmen',
    title: 'Blacks One <> Wowmen',
    partA: {
      id: 'part-a',
      name: 'Blacks One',
      description:
        "Personnes engagées pour l'identité noire et l'unité : militants et associations panafricanistes, artistes, enseignants, jeunes diplômés, membres de la diaspora (Afrique, Amériques, Caraïbes, Europe). Un monde d'histoire, de mémoire et de fierté.",
      posterUrl: encodeURI('/Posters/Sides/Blacks One.png')
    },
    partB: {
      id: 'part-b',
      name: 'Wowmen',
      description:
        "Des femmes et des hommes qui viennent dire ce que les femmes représentent pour eux et pourquoi elles méritent d'être défendues : mères, filles, épouses, collègues, bâtisseuses. Un monde d'admiration, de reconnaissance et de combats du quotidien.",
      posterUrl: encodeURI('/Posters/Sides/Wowmen.png')
    },
    synopsis:
      "Deux manières de dire « voilà ce qui compte pour moi ». D'un côté, des gens qui viennent défendre des identités noires, dans toute leur diversité, avec en toile de fond l'idée d'unité. De l'autre, des gens qui viennent dire leur admiration pour les femmes : leur beauté, leur puissance, ce qu'elles apportent, et pourquoi il faut les défendre. Le titre joue sur le double W de « Wowmen ».",
    posterUrl: encodeURI('/Posters/Blacks One ‹ › Wowmen.png'),
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'La fierté',
        question: 'Racontez le moment où vous avez appris à être fier de qui vous êtes.',
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Prendre parti',
        question:
          "Racontez une fois où vous avez défendu quelqu'un ou quelque chose qui vous est cher, alors qu'il aurait été plus simple de vous taire.",
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: 'La dignité',
        question: "Racontez la personne dont la force vous a appris ce qu'est la dignité.",
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: "À un enfant d'aujourd'hui",
        question:
          "Racontez ce que vous voudriez dire à un enfant d'aujourd'hui, pour qu'il sache qui il est avant que le monde ne le lui dise.",
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'fiat-luxe-phd',
    title: 'Fiat Luxe <> PhD',
    partA: {
      id: 'part-a',
      name: 'Fiat Luxe',
      description:
        "Créateurs, artisans d'art, couturiers, bijoutiers, tisserands, maisons de luxe, hôtellerie haut de gamme : tous ceux dont le travail vise la rareté et la perfection. Un monde de matières, de gestes et de patience.",
      posterUrl: encodeURI('/Posters/Sides/Fiat Luxe.png')
    },
    partB: {
      id: 'part-b',
      name: 'PhD',
      description:
        "Docteurs, doctorants, chercheurs, enseignants-chercheurs, ceux qui vivent de la recherche. Un monde de questions longues, d'évaluations et de bibliothèques.",
      posterUrl: encodeURI('/Posters/Sides/PhD.png')
    },
    synopsis:
      "Deux excellences que l'on met rarement face à face : celle du geste, qui fait un objet d'une beauté rare, et celle de la pensée, qui cherche pendant des années une réponse que personne n'a encore trouvée. Au Bénin, le luxe existe, de l'artisanat d'art à la couture, du bijou au tissage. Les docteurs et chercheurs, eux, produisent un savoir qu'on voit peu.",
    posterUrl: encodeURI('/Posters/Fiat Luxe ‹ › PhD.png'),
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Donner sa vie',
        question:
          'Racontez le moment où vous avez su que vous donneriez des années de votre vie à une seule chose.',
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Le renoncement',
        question:
          'Racontez ce à quoi vous avez renoncé pour aller au bout de quelque chose qui comptait pour vous.',
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: "L'exigence",
        question:
          'Racontez la personne qui vous a appris à ne pas vous contenter du « presque ».',
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: 'Le jour de vérité',
        question:
          'Racontez le jour où vous avez su que tout ce que cela vous avait coûté en valait la peine.',
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'finagnon-horizons',
    title: 'Finagnon <> Horizons',
    partA: {
      id: 'part-a',
      name: 'Finagnon',
      description:
        "Les Béninois du pays et de la diaspora, et les personnes d'origine béninoise nées ailleurs, qui parlent du Bénin. Un monde de fierté, d'engagement et de projets pour le pays.",
      posterUrl: encodeURI('/Posters/Sides/Finagnon.png')
    },
    partB: {
      id: 'part-b',
      name: 'Horizons',
      description:
        "Des personnes d'autres nations, qui parlent de leur propre pays ou territoire. Un monde de lieux, d'accents et de souvenirs.",
      posterUrl: encodeURI('/Posters/Sides/Horizons.png')
    },
    synopsis:
      "Chacun a un endroit auquel il se sent profondément lié. D'un côté, Finagnon rassemble les Béninois du pays et du monde, qui viennent parler du Bénin : ce qu'ils y ont vécu, ce qu'ils aiment, leur envie de le servir. De l'autre, Horizons rassemble des personnes d'autres nations, qui parlent de leur propre pays ou territoire avec le même attachement. Le Bénin est au centre, comme point de départ. Les personnes métissées choisissent leur côté, et c'est voulu.",
    posterUrl: encodeURI('/Posters/Finagnon ‹ › Horizons.png'),
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Chez soi',
        question: 'Racontez le moment où vous avez senti que vous étiez enfin chez vous.',
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: "Ce qu'on emporte",
        question:
          "Racontez ce que vous emporteriez partout avec vous de l'endroit qui vous a fait, et ce que vous ne pourriez jamais emporter.",
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: 'Défendre sa terre',
        question:
          "Racontez une fois où vous avez défendu l'endroit d'où vous venez devant quelqu'un qui ne le connaissait pas, et ce que cela a réveillé en vous.",
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: 'Bâtir chez soi',
        question:
          'Racontez ce que vous faites, ou voudriez faire, pour qu\'il fasse bon vivre chez vous.',
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'performers-builders',
    title: 'Performers <> Builders',
    partA: {
      id: 'part-a',
      name: 'Performers',
      description:
        "Danseurs et chorégraphes, musiciens et chanteurs, comédiens, humoristes, gamers, créateurs de contenus et autres artistes de la scène ou de l'écran. Un monde de performance, d'expression, de création et de divertissement.",
      posterUrl: encodeURI('/Posters/Sides/Performers.png')
    },
    partB: {
      id: 'part-b',
      name: 'Builders',
      description:
        "Chefs d'entreprise et entrepreneurs, fondateurs de startups, architectes, artisans qui ont monté leur propre atelier ou entreprise, bâtisseurs de lieux ou de projets. Un monde de risques, de rencontres et de paris.",
      posterUrl: encodeURI('/Posters/Sides/Builders.png')
    },
    synopsis:
      "Performers rassemble celles et ceux qui font vivre une expérience au public : danseurs, musiciens, comédiens, humoristes, gamers et autres artistes de la scène ou de l'écran. Builders réunit celles et ceux qui entreprennent, conçoivent, organisent et développent des projets, des lieux ou des entreprises : chefs d'entreprise, architectes, artisans qui montent leur atelier, fondateurs de startups. La série explore leur envie de donner vie à quelque chose, les moments de doute, les personnes qui ont cru en eux et l'impact de ce qu'ils font sur les autres.",
    posterUrl: encodeURI('/Posters/Performers ‹ › Builders.png'),
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Donner vie',
        question:
          "Racontez le moment où vous avez décidé de donner vie à quelque chose qui n'existait pas encore.",
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Au bord du renoncement',
        question:
          'Racontez un moment où vous avez été tout près de renoncer, et ce qui vous a finalement poussé à continuer.',
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: "La confiance d'un autre",
        question:
          'Racontez la personne qui a cru en vous, en votre talent ou en votre projet, à un moment où vous-même doutiez encore.',
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: "Compter pour quelqu'un",
        question:
          "Racontez le moment où vous avez compris que ce que vous faisiez avait réellement compté pour quelqu'un d'autre.",
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'paroles-regards',
    title: 'Paroles <> Regards',
    partA: {
      id: 'part-a',
      name: 'Paroles',
      description:
        'Tous ceux qui travaillent par le verbe : écrivains, poètes, slameurs, conteurs, orateurs, avocats, auteurs de discours. Un monde de voix, de plaidoiries et de textes.',
      posterUrl: encodeURI('/Posters/Sides/Paroles.png')
    },
    partB: {
      id: 'part-b',
      name: 'Regards',
      description:
        "Photographes, vidéastes, cinéastes, peintres, plasticiens, graffeurs, illustrateurs. Un monde d'images, de lumière et de regards.",
      posterUrl: encodeURI('/Posters/Sides/Regards.png')
    },
    synopsis:
      'Deux façons de faire entendre une histoire : par les paroles ou par les regards. Paroles rassemble écrivains, poètes, slameurs, conteurs et orateurs ; Regards réunit photographes, vidéastes, cinéastes et artistes visuels. Les uns donnent forme au monde par les mots, les autres par les images.',
    posterUrl: encodeURI('/Posters/Paroles ‹ › Regards.png'),
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Prendre la parole',
        question:
          'Racontez le moment où vous avez compris que si vous ne le disiez pas, personne ne le dirait à votre place.',
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Dans le silence',
        question:
          "Racontez un moment où vous aviez besoin d'être entendu et où personne n'écoutait, et ce que vous en avez fait.",
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: 'Changer de regard',
        question:
          'Racontez une image, une phrase ou un silence qui a changé votre manière de voir le monde.',
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: "L'histoire encore tue",
        question:
          "Racontez l'histoire que vous portez en vous et que vous n'avez pas encore osé raconter.",
        status: 'coming_soon'
      }
    ]
  }
];

/**
 * Table complète de correspondance anciens -> nouveaux identifiants.
 * Les anciens IDs sans équivalent ou scindés sont marqués masqués (targetSeriesId = null).
 */
export const LEGACY_SERIES_MAPPING: Record<string, LegacySeriesMappingEntry> = {
  // Équivalents directs
  'blacks-one-amazones': {
    legacyId: 'blacks-one-amazones',
    status: 'mapped',
    targetSeriesId: 'blacks-one-wowmen',
    note: 'Correspondance directe vers Blacks One <> Wowmen'
  },
  'blacks-one-beyond-eve': {
    legacyId: 'blacks-one-beyond-eve',
    status: 'mapped',
    targetSeriesId: 'blacks-one-wowmen',
    note: 'Correspondance directe vers Blacks One <> Wowmen'
  },
  'baobab-bambou': {
    legacyId: 'baobab-bambou',
    status: 'mapped',
    targetSeriesId: 'baobabs-bambous',
    note: 'Correspondance directe vers Baobabs <> Bambous'
  },
  'esu-jesus': {
    legacyId: 'esu-jesus',
    status: 'mapped',
    targetSeriesId: 'vodun-rays-autre-foi',
    note: 'Ancien identifiant de Vodun Rays <> Autre Foi (ex Èṣù <> Jésus)'
  },
  'jesus-legba': {
    legacyId: 'jesus-legba',
    status: 'mapped',
    targetSeriesId: 'vodun-rays-autre-foi',
    note: 'Correspondance directe vers Vodun Rays <> Autre Foi'
  },
  'pictures-words': {
    legacyId: 'pictures-words',
    status: 'mapped',
    targetSeriesId: 'paroles-regards',
    note: 'Correspondance directe vers Paroles <> Regards'
  },
  'benin-monde': {
    legacyId: 'benin-monde',
    status: 'mapped',
    targetSeriesId: 'finagnon-horizons',
    note: 'Correspondance directe vers Finagnon <> Horizons'
  },
  'benin-world': {
    legacyId: 'benin-world',
    status: 'mapped',
    targetSeriesId: 'finagnon-horizons',
    note: 'Correspondance directe vers Finagnon <> Horizons'
  },

  // Anciennes séries sans équivalent (masquées)
  'roots-routes': {
    legacyId: 'roots-routes',
    status: 'hidden',
    targetSeriesId: null,
    note: 'Aucun équivalent dans la v2, série masquée'
  },
  'other-eyes-sixth-sense': {
    legacyId: 'other-eyes-sixth-sense',
    status: 'hidden',
    targetSeriesId: null,
    note: 'Aucun équivalent dans la v2, série masquée'
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
    note: 'Ancienne série disparue (aucune correspondance forcée), masquée'
  },

  // Séries scindées : chaque ancien ID est masqué dans son ensemble ; ses côtés sont réaffectés
  'coaching-phd': {
    legacyId: 'coaching-phd',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : côté Coaching masqué, côté PhD -> fiat-luxe-phd (part-b)',
    splitSides: {
      sideALabel: 'Coaching',
      sideATarget: null,
      sideBLabel: 'PhD',
      sideBTarget: { seriesId: 'fiat-luxe-phd', partId: 'part-b' }
    }
  },
  'fiat-luxe-builders': {
    legacyId: 'fiat-luxe-builders',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Fiat Luxe -> fiat-luxe-phd (part-a), Builders -> performers-builders (part-b)',
    splitSides: {
      sideALabel: 'Fiat Luxe',
      sideATarget: { seriesId: 'fiat-luxe-phd', partId: 'part-a' },
      sideBLabel: 'Builders',
      sideBTarget: { seriesId: 'performers-builders', partId: 'part-b' }
    }
  },
  'finagnon-qosqorico': {
    legacyId: 'finagnon-qosqorico',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Finagnon -> finagnon-horizons (part-a), Qosqorico masqué',
    splitSides: {
      sideALabel: 'Finagnon',
      sideATarget: { seriesId: 'finagnon-horizons', partId: 'part-a' },
      sideBLabel: 'Qosqorico',
      sideBTarget: null
    }
  },
  'dixeat-fiat-luxe': {
    legacyId: 'dixeat-fiat-luxe',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Dixeat masqué, Fiat Luxe -> fiat-luxe-phd (part-a)',
    splitSides: {
      sideALabel: 'Dixeat',
      sideATarget: null,
      sideBLabel: 'Fiat Luxe',
      sideBTarget: { seriesId: 'fiat-luxe-phd', partId: 'part-a' }
    }
  },
  'investors-builders': {
    legacyId: 'investors-builders',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Investors masqué, Builders -> performers-builders (part-b)',
    splitSides: {
      sideALabel: 'Investors',
      sideATarget: null,
      sideBLabel: 'Builders',
      sideBTarget: { seriesId: 'performers-builders', partId: 'part-b' }
    }
  },
  'builders-seekers': {
    legacyId: 'builders-seekers',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Builders -> performers-builders (part-b), Seekers masqué',
    splitSides: {
      sideALabel: 'Builders',
      sideATarget: { seriesId: 'performers-builders', partId: 'part-b' },
      sideBLabel: 'Seekers',
      sideBTarget: null
    }
  },
  'focus-phd': {
    legacyId: 'focus-phd',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Focus masqué, PhD -> fiat-luxe-phd (part-b)',
    splitSides: {
      sideALabel: 'Focus',
      sideATarget: null,
      sideBLabel: 'PhD',
      sideBTarget: { seriesId: 'fiat-luxe-phd', partId: 'part-b' }
    }
  },
  'dixeat-builders': {
    legacyId: 'dixeat-builders',
    status: 'split_hidden',
    targetSeriesId: null,
    note: 'Scindée : Dixeat masqué, Builders -> performers-builders (part-b)',
    splitSides: {
      sideALabel: 'Dixeat',
      sideATarget: null,
      sideBLabel: 'Builders',
      sideBTarget: { seriesId: 'performers-builders', partId: 'part-b' }
    }
  }
};

export const SERIES_REGISTRY_BY_ID: Record<string, SeriesRegistryEntry> = Object.fromEntries(
  SERIES_REGISTRY.map((series) => [series.id, series])
);

/**
 * Normalise un identifiant brut (gère aussi les IDs d'épisodes sous la forme "<seriesId>__ep1").
 */
export function extractBaseSeriesId(rawId?: string | null): string | null {
  if (!rawId) return null;
  const trimmed = rawId.trim();
  if (!trimmed) return null;
  const sepIndex = trimmed.indexOf('__');
  return sepIndex >= 0 ? trimmed.slice(0, sepIndex) : trimmed;
}

/**
 * Résout un identifiant de série (actuel ou ancien) vers son identifiant canonique v2.
 * Retourne null si la série est masquée ou scindée sans équivalent direct.
 */
export function resolveCanonicalSeriesId(rawId?: string | null): string | null {
  const baseId = extractBaseSeriesId(rawId);
  if (!baseId) return null;

  if (SERIES_REGISTRY_BY_ID[baseId]) {
    return baseId;
  }

  const mapping = LEGACY_SERIES_MAPPING[baseId];
  if (mapping && mapping.status === 'mapped' && mapping.targetSeriesId) {
    return mapping.targetSeriesId;
  }

  return null;
}

/**
 * Retourne l'entrée complète du registre v2 pour un identifiant actuel, d'épisode ou mappé.
 */
export function resolveSeriesById(rawId?: string | null): SeriesRegistryEntry | undefined {
  const canonicalId = resolveCanonicalSeriesId(rawId);
  return canonicalId ? SERIES_REGISTRY_BY_ID[canonicalId] : undefined;
}

/**
 * Indique si un identifiant correspond à une ancienne série masquée ou scindée.
 */
export function isHiddenLegacySeriesId(rawId?: string | null): boolean {
  const baseId = extractBaseSeriesId(rawId);
  if (!baseId) return false;
  if (SERIES_REGISTRY_BY_ID[baseId]) return false;
  const mapping = LEGACY_SERIES_MAPPING[baseId];
  return Boolean(mapping && mapping.targetSeriesId === null);
}
