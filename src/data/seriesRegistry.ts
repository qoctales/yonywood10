import {
  LEGACY_SERIES_MAPPING,
  SERIES_POSTER_FILES,
  extractBaseSeriesId,
  resolveCanonicalSeriesId,
  isHiddenLegacySeriesId,
  type LegacySeriesMappingEntry
} from './legacySeriesIds';

export type { LegacySeriesMappingEntry };
export {
  LEGACY_SERIES_MAPPING,
  SERIES_POSTER_FILES,
  extractBaseSeriesId,
  resolveCanonicalSeriesId,
  isHiddenLegacySeriesId
};

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

/**
 * Registre officiel des 8 séries Duocumentaires, dans l'ordre définitif.
 */
export const SERIES_REGISTRY: SeriesRegistryEntry[] = [
  {
    id: 'modernite-tradition',
    title: 'Modernité ‹ › Tradition',
    partA: {
      id: 'part-a',
      name: 'Modernité',
      description:
        "Médecins, infirmiers, sages-femmes, pharmaciens, ingénieurs, techniciens, artisans et créateurs qui travaillent avec des techniques et des outils récents, et ceux qu'ils ont soignés ou servis. Un monde de méthodes, d'outils et d'innovation.",
      posterUrl: SERIES_POSTER_FILES['modernite-tradition'].partAPosterUrl
    },
    partB: {
      id: 'part-b',
      name: 'Tradition',
      description:
        "Tradipraticiens, herboristes, praticiens de médecine douce, forgerons, tisserands, potières, sculpteurs, couturiers et artisans qui travaillent avec des gestes et des savoirs transmis, et ceux qu'ils ont soignés ou servis. Un monde de gestes transmis, de matières et de mémoire.",
      posterUrl: SERIES_POSTER_FILES['modernite-tradition'].partBPosterUrl
    },
    synopsis:
      "Le lundi, on consulte le médecin. Le mardi, le tradipraticien. Deux savoirs, un même souci : soigner, fabriquer, bien faire. L'un est né des laboratoires et des outils d'aujourd'hui, l'autre se transmet de main en main depuis des générations. Ils se croisent, se défient, s'empruntent. Et au fond de chaque atelier, la même question : que garder, que changer ?",
    posterUrl: SERIES_POSTER_FILES['modernite-tradition'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Geste hérité',
        question:
          "Racontez un geste, une méthode ou un remède que vous tenez de quelqu'un, et ce qui se passe en vous quand vous le refaites.",
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Quand ça lâche',
        question:
          'Racontez le jour où ce en quoi vous aviez confiance (un remède, une méthode, un outil) vous a laissé tomber, et ce que vous avez fait ensuite.',
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: 'Autre façon',
        question:
          "Racontez la fois où vous avez vu quelqu'un s'y prendre autrement que vous, et réussir, et ce que cela a remué en vous.",
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: 'Pas question',
        question:
          'Racontez ce que vous refusez de changer, même quand tout le monde vous dit que ce serait mieux, et pourquoi.',
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'jesus-legba',
    title: 'Jesus ‹ › Legba',
    partA: {
      id: 'part-a',
      name: 'Jesus',
      description:
        "Chrétiens de toutes confessions (catholiques, protestants, évangéliques, christianistes célestes et autres Églises), fidèles comme responsables de communauté. Un monde de prière, de communauté et d'engagement.",
      posterUrl: SERIES_POSTER_FILES['jesus-legba'].partAPosterUrl
    },
    partB: {
      id: 'part-b',
      name: 'Legba',
      description:
        "Pratiquants du Vodun et des traditions qui lui sont liées : prêtres et prêtresses, initiés, adeptes, familles qui entretiennent un culte, et aussi des descendants de la diaspora (Brésil, Cuba, Haïti) qui retrouvent ces racines. Un monde de rites, de mémoire et de transmission.",
      posterUrl: SERIES_POSTER_FILES['jesus-legba'].partBPosterUrl
    },
    synopsis:
      "Au Bénin, le Vodun était là avant tout le reste. D'autres croyances sont venues, se sont installées, lui ont fait face. D'un côté, les chrétiens de toutes confessions ; de l'autre, les pratiquants du Vodun et des traditions qui lui sont liées. Deux façons de prier, un même sol, une même question : à qui confier ce que l'on ne maîtrise pas ?",
    posterUrl: SERIES_POSTER_FILES['jesus-legba'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Appel',
        question:
          'Racontez le moment où vous avez senti que quelque chose de plus grand que vous était là.',
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Silence',
        question:
          "Racontez un moment où vous avez demandé de l'aide à ce en quoi vous croyez, et où rien n'a semblé répondre.",
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: 'Prix à payer',
        question:
          "Racontez un jour où ce en quoi vous croyez vous a coûté quelque chose (une amitié, une place, le regard des autres), et pourquoi vous n'avez pas lâché.",
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: 'Ce qui reste',
        question:
          'Racontez ce que vous voudriez que ceux que vous aimez gardent de ce qui vous a tenu debout.',
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'phd-apprentis',
    title: 'PhD ‹ › Apprentis',
    partA: {
      id: 'part-a',
      name: 'PhD',
      description:
        "Docteurs, doctorants, chercheurs, enseignants-chercheurs, ceux qui vivent de la recherche. Un monde de questions longues, d'évaluations et de bibliothèques.",
      posterUrl: SERIES_POSTER_FILES['phd-apprentis'].partAPosterUrl
    },
    partB: {
      id: 'part-b',
      name: 'Apprentis',
      description:
        "Apprentis et stagiaires de tous les métiers (18 ans minimum) : couture, mécanique, coiffure, menuiserie, soudure, électricité, restauration et tant d'autres, jeunes formés sur le tas auprès d'un patron ou d'un maître. Un monde d'ateliers, de gestes répétés et de patience, où l'on apprend en regardant et en faisant.",
      posterUrl: SERIES_POSTER_FILES['phd-apprentis'].partBPosterUrl
    },
    synopsis:
      "Certains cherchent pendant des années une réponse que personne n'a encore trouvée. D'autres apprennent un métier en le faisant, à l'atelier, au garage, sur le chantier. Docteurs et chercheurs d'un côté, apprentis et stagiaires de l'autre : deux patiences, deux écoles. Et partout quelqu'un qui montre, corrige, encourage, puis finit par dire : maintenant, à toi.",
    posterUrl: SERIES_POSTER_FILES['phd-apprentis'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Plus que tout',
        question:
          'Racontez ce que vous avez voulu réussir plus que tout, et ce que vous avez mis de côté pour y arriver.',
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Première réussite',
        question:
          "Racontez la première fois où vous avez réussi quelque chose que vous n'arriviez pas à faire, et la personne à qui vous avez voulu le montrer.",
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: 'Encore apprendre',
        question:
          "Racontez ce que vous voudriez encore apprendre dans votre vie, et ce qui vous en a empêché jusqu'ici.",
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: 'Tenir bon',
        question:
          "Racontez la personne grâce à qui vous n'avez pas abandonné, un jour où vous n'en pouviez plus.",
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'blacks-one-wowmen',
    title: 'Blacks One ‹ › Wowmen',
    partA: {
      id: 'part-a',
      name: 'Blacks One',
      description:
        "Personnes engagées pour l'identité noire et l'unité : militants et associations panafricanistes, artistes, enseignants, jeunes diplômés, membres de la diaspora (Afrique, Amériques, Caraïbes, Europe). Un monde d'histoire, de mémoire et de fierté.",
      posterUrl: SERIES_POSTER_FILES['blacks-one-wowmen'].partAPosterUrl
    },
    partB: {
      id: 'part-b',
      name: 'Wowmen',
      description:
        "Des femmes qui racontent leur propre histoire, et des hommes qui viennent dire ce que les femmes représentent pour eux et pourquoi elles méritent d'être défendues : mères, filles, épouses, collègues, bâtisseuses. Un monde d'admiration, de reconnaissance et de combats du quotidien.",
      posterUrl: SERIES_POSTER_FILES['blacks-one-wowmen'].partBPosterUrl
    },
    synopsis:
      "Deux combats pour la dignité, une même ligne de front. Blacks One rassemble celles et ceux qui défendent les identités noires dans toute leur diversité, l'unité en toile de fond. Wowmen donne la parole aux femmes qui racontent leur histoire, et aux hommes qui disent ce qu'elles représentent pour eux. Les deux côtés se recouvrent : chacun choisit celui où il se reconnaît le plus.",
    posterUrl: SERIES_POSTER_FILES['blacks-one-wowmen'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Se redresser',
        question:
          "Racontez le jour où une personne (vous, ou quelqu'un que vous aimez) a été rabaissée à cause de ce qu'elle est, et ce qui l'a aidée à se redresser.",
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Prendre parti',
        question:
          "Racontez le jour où vous avez pris la défense de quelqu'un alors qu'il aurait été plus simple de vous taire, et ce que vous avez ressenti au moment de parler.",
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: 'Dignité',
        question:
          'Racontez la personne qui vous a appris la dignité, sans jamais prononcer ce mot.',
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: "Enfants d'aujourd'hui",
        question:
          "Racontez ce que vous voudriez dire à un enfant d'aujourd'hui, pour qu'il sache qui il est avant que le monde ne décide pour lui.",
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'bambous-irokos',
    title: 'Bambous ‹ › Irokos',
    partA: {
      id: 'part-a',
      name: 'Bambous',
      description:
        "Jeunes adultes (18 ans minimum) : étudiants, jeunes travailleurs, entrepreneurs, jeunes parents, tous ceux qui cherchent leur place et leur voie. Un monde d'élans, de doutes et d'avenir.",
      posterUrl: SERIES_POSTER_FILES['bambous-irokos'].partAPosterUrl
    },
    partB: {
      id: 'part-b',
      name: 'Irokos',
      description:
        "Les aînés : grands-parents, retraités, anciens du village ou du quartier, dignitaires, toutes celles et tous ceux qui ont vécu longtemps et que l'on vient écouter. Un monde de sagesse, de mémoire et de transmission par la parole.",
      posterUrl: SERIES_POSTER_FILES['bambous-irokos'].partBPosterUrl
    },
    synopsis:
      "Le bambou pousse vite et plie sans casser. L'iroko, géant, traverse les siècles. Entre eux, deux âges de la vie : une jeunesse pleine d'élans, de doutes et d'idées que personne n'a eues avant elle, et des aînés porteurs d'une mémoire qu'on prend rarement le temps d'écouter. Des silences, des malentendus, des repas de famille. Et parfois, la phrase qui change tout.",
    posterUrl: SERIES_POSTER_FILES['bambous-irokos'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Pris au sérieux',
        question:
          "Racontez la première fois où quelqu'un d'une autre génération a pris au sérieux ce que vous disiez, et ce que cela vous a fait.",
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Écart',
        question:
          "Racontez un moment où l'écart d'âge a failli vous séparer de quelqu'un que vous aimiez, et ce qui s'est passé ensuite.",
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: 'Sans le vouloir',
        question:
          "Racontez ce qu'une personne d'une autre génération vous a montré, sans même chercher à vous l'apprendre.",
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: 'Il est encore temps',
        question:
          "Racontez ce que vous voudriez dire, avant qu'il ne soit trop tard, à quelqu'un d'une autre génération.",
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'horizons-benin',
    title: 'Horizons ‹ › Benin',
    partA: {
      id: 'part-a',
      name: 'Horizons',
      description:
        "Des personnes d'autres nations, qui parlent de leur propre pays ou territoire. Un monde de lieux, d'accents et de souvenirs.",
      posterUrl: SERIES_POSTER_FILES['horizons-benin'].partAPosterUrl
    },
    partB: {
      id: 'part-b',
      name: 'Benin',
      description:
        "Les Béninois du pays et de la diaspora, et les personnes d'origine béninoise nées ailleurs, qui parlent du Bénin, y compris celles et ceux qui accueillent les visiteurs : guides, hôtes, passeurs de mémoire. Un monde de fierté, d'engagement et de projets pour le pays.",
      posterUrl: SERIES_POSTER_FILES['horizons-benin'].partBPosterUrl
    },
    synopsis:
      "Chacun porte en lui un endroit. Un pays, un quartier, une odeur de cuisine. Horizons réunit des personnes d'autres nations qui parlent de chez elles avec le même attachement. Benin réunit les Béninois du pays et du monde, et celles et ceux qui accueillent les visiteurs : ce qu'ils y ont vécu, ce qu'ils y aiment, ce qu'ils veulent pour lui. Le Bénin est le point de départ.",
    posterUrl: SERIES_POSTER_FILES['horizons-benin'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Chez soi',
        question:
          "Racontez l'odeur, le bruit ou le goût qui vous ramène tout de suite chez vous, et l'histoire qui va avec.",
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Bagages',
        question:
          "Racontez ce que vous emporteriez partout avec vous de l'endroit qui vous a fait, et ce que vous ne pourriez jamais emporter.",
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: "Vu d'ailleurs",
        question:
          "Racontez le jour où quelqu'un a parlé de chez vous sans le connaître, et ce que vous avez ressenti.",
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: 'Bienvenue',
        question:
          "Racontez ce que vous voudriez construire chez vous pour que ceux qui y vivent, et ceux qui y arrivent, s'y sentent bien.",
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'builders-coachs',
    title: 'Builders ‹ › Coachs',
    partA: {
      id: 'part-a',
      name: 'Builders',
      description:
        "Chefs d'entreprise et entrepreneurs, fondateurs de startups, architectes, artisans qui ont monté leur propre atelier ou entreprise, bâtisseurs de lieux ou de projets. Un monde de risques, de rencontres et de paris.",
      posterUrl: SERIES_POSTER_FILES['builders-coachs'].partAPosterUrl
    },
    partB: {
      id: 'part-b',
      name: 'Coachs',
      description:
        "Coachs de vie, de carrière et de sport, entraîneurs, mentors, formateurs, consultants, accompagnateurs d'entrepreneurs, et toutes celles et tous ceux qui aident les autres à trouver leur voie. Un monde de conseils, d'écoute et de confiance.",
      posterUrl: SERIES_POSTER_FILES['builders-coachs'].partBPosterUrl
    },
    synopsis:
      "Il y a ceux qui se lancent, et ceux qui aident à se lancer. Les Builders ont monté une entreprise, un atelier, un lieu, un projet : ils ont pris le risque. Les Coachs, mentors, entraîneurs et formateurs aident les autres à le prendre. Les uns connaissent le prix d'un pari, les autres savent reconnaître l'instant où quelqu'un est prêt. Entre eux, un conseil, un doute, une confiance.",
    posterUrl: SERIES_POSTER_FILES['builders-coachs'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Phrase décisive',
        question:
          "Racontez la phrase, reçue ou dite, qui a changé la direction d'une vie, la vôtre ou celle d'un autre.",
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Pari fou',
        question:
          'Racontez le jour où vous avez pris un risque que tout le monde vous déconseillait, et ce que vous avez ressenti la veille.',
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: 'Confiance',
        question:
          "Racontez la personne qui a cru en vous avant vous-même, ou celle en qui vous avez cru avant qu'elle n'y croie.",
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: 'Chute',
        question:
          "Racontez l'échec dont vous parlez le moins, et ce qu'il a laissé en vous.",
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'regards-paroles',
    title: 'Images ‹ › Paroles',
    partA: {
      id: 'part-a',
      name: 'Images',
      description:
        "Photographes, vidéastes, cinéastes, peintres, plasticiens, graffeurs, illustrateurs. Un monde d'images, de lumière et de regards.",
      posterUrl: SERIES_POSTER_FILES['regards-paroles'].partAPosterUrl
    },
    partB: {
      id: 'part-b',
      name: 'Paroles',
      description:
        "Tous ceux qui travaillent par le verbe : écrivains, poètes, slameurs, conteurs, orateurs, avocats, auteurs de discours. Un monde de voix, de plaidoiries et de textes.",
      posterUrl: SERIES_POSTER_FILES['regards-paroles'].partBPosterUrl
    },
    synopsis:
      "Une histoire se montre, ou se dit. Images réunit photographes, vidéastes, cinéastes, peintres, plasticiens et graffeurs. Paroles réunit écrivains, poètes, slameurs, conteurs et orateurs. Les uns donnent forme au monde avec la lumière et le cadre, les autres avec le rythme et les mots. Une même envie les tient tous : que quelqu'un voie, et n'oublie pas.",
    posterUrl: SERIES_POSTER_FILES['regards-paroles'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Déclic',
        question:
          'Racontez le moment où vous avez compris que vous aviez quelque chose à faire ressentir au monde, et que personne ne le ferait à votre place.',
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Pas compris',
        question:
          "Racontez le jour où personne n'a compris ce que vous aviez créé, écrit ou dit, et ce que vous avez fait de ce silence.",
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: 'Souffle coupé',
        question:
          'Racontez une image, un texte ou une voix qui vous a coupé le souffle, et ce qui a changé en vous ensuite.',
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: 'Histoire cachée',
        question:
          "Racontez l'histoire que vous portez en vous et que vous n'avez pas encore osé montrer ou dire au monde, et ce qui vous retient.",
        status: 'coming_soon'
      }
    ]
  }
];

export const SERIES_REGISTRY_BY_ID: Record<string, SeriesRegistryEntry> = Object.fromEntries(
  SERIES_REGISTRY.map((series) => [series.id, series])
);

/**
 * Retourne l'entrée complète du registre pour un identifiant actuel, d'épisode ou ancien mappé.
 */
export function resolveSeriesById(rawId?: string | null): SeriesRegistryEntry | undefined {
  const canonicalId = resolveCanonicalSeriesId(rawId);
  return canonicalId ? SERIES_REGISTRY_BY_ID[canonicalId] : undefined;
}
