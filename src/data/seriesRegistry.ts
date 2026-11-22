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
      "Deux façons de faire que l'on oppose souvent, alors qu'elles cohabitent chaque jour. D'un côté, Modernité : celles et ceux qui exercent leur métier avec des méthodes, des outils et des savoirs récents, de la médecine moderne aux techniques d'aujourd'hui. De l'autre, Tradition : celles et ceux qui exercent avec des savoirs transmis de génération en génération, de la médecine traditionnelle à l'artisanat. Beaucoup de gens consultent ou achètent chez les uns puis chez les autres. La série ne demande pas quelle manière est la meilleure. Elle leur pose les mêmes questions : le savoir-faire transmis, la méthode qui a échoué, la façon dont quelqu'un d'autre s'y prend, ce qu'ils refusent de changer.",
    posterUrl: SERIES_POSTER_FILES['modernite-tradition'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: "Ce qu'on m'a transmis",
        question:
          "Racontez un savoir-faire que quelqu'un vous a transmis, et dont vous ne pourriez plus vous passer.",
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: "Quand ça n'a pas marché",
        question:
          'Racontez une fois où la méthode que vous aviez apprise a échoué, et ce que vous avez fait à la place.',
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: "L'autre façon",
        question:
          "Racontez la première fois où vous avez vu quelqu'un s'y prendre autrement que vous, et réussir.",
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: "Ce qu'on garde",
        question:
          'Racontez ce que vous avez refusé de changer dans votre façon de faire, malgré la pression.',
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
      "Au Bénin, le Vodun occupe une place à part : une tradition d'origine, à laquelle d'autres croyances viennent faire face. D'un côté, Jesus, qui rassemble les chrétiens de toutes confessions. De l'autre, Legba, qui rassemble les pratiquants du Vodun et des traditions qui lui sont liées. Le Vodun est au centre, comme point de départ. La série ne demande pas qui a raison. Elle demande à chacun de raconter à quel moment il s'est senti appelé, a douté, a eu besoin de courage, et ce qu'il veut transmettre.",
    posterUrl: SERIES_POSTER_FILES['jesus-legba'].mainPosterUrl,
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
      "Deux façons d'apprendre, que l'on met rarement face à face : par les livres et la recherche, ou par la main, sous le regard d'un maître. D'un côté, des docteurs et des chercheurs qui cherchent parfois pendant des années une réponse que personne n'a encore trouvée. De l'autre, Apprentis : celles et ceux, apprentis ou stagiaires, qui apprennent un métier en le faisant, à l'atelier, au garage ou sur le chantier. Au Bénin, l'apprentissage est un chemin que beaucoup de jeunes empruntent. La série leur pose les mêmes questions : la question qui ne lâche pas, ce qu'on apprend en faisant, l'erreur qui a tout appris, la personne qui les a empêchés d'abandonner.",
    posterUrl: SERIES_POSTER_FILES['phd-apprentis'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'La question qui ne lâche pas',
        question:
          'Racontez une question, un problème ou un geste qui vous a obsédé pendant des mois ou des années.',
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Apprendre en faisant',
        question:
          "Racontez ce que vous avez appris par la pratique, et qu'aucun livre ni aucun cours ne vous avait dit.",
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: "L'erreur",
        question: "Racontez une erreur qui vous a appris plus qu'une réussite.",
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: 'Celui ou celle qui vous a retenu',
        question:
          "Racontez la personne qui vous a empêché d'abandonner quand apprendre vous semblait trop dur.",
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
      "Deux combats pour la dignité, qui se rencontrent. D'un côté, Blacks One : des gens qui viennent défendre des identités noires, dans toute leur diversité, avec en toile de fond l'idée d'unité. De l'autre, Wowmen : des femmes qui racontent leur propre histoire, et des hommes qui disent ce que les femmes représentent pour eux et pourquoi il faut les défendre. Les deux côtés se recouvrent, et c'est voulu : chacun choisit celui où il se reconnaît le plus. La série leur pose les mêmes questions : le moment où l'on a voulu les faire se sentir petits, le choix de prendre parti, la personne qui leur a appris la dignité, ce qu'ils voudraient dire à un enfant d'aujourd'hui.",
    posterUrl: SERIES_POSTER_FILES['blacks-one-wowmen'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Se redresser',
        question:
          "Racontez une fois où l'on a voulu vous faire sentir petit à cause de ce que vous êtes, et comment vous vous êtes redressé.",
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
      "Deux âges de la vie, face à face. D'un côté, Bambous : la jeunesse qui pousse vite et plie sans casser. De l'autre, Irokos : l'iroko est un arbre immense, qui vit des siècles, et la série lui emprunte son nom pour rendre hommage aux aînés. Les jeunes portent des élans, des doutes et des idées que personne n'a eues avant eux. Les aînés portent une mémoire et une sagesse qu'on prend rarement le temps d'écouter longuement. La série les rapproche et leur pose les mêmes questions : la première fois où l'on a été pris au sérieux, le malentendu entre générations, ce que l'autre vous a appris, ce que l'on voudrait lui transmettre.",
    posterUrl: SERIES_POSTER_FILES['bambous-irokos'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Être pris au sérieux',
        question:
          "Racontez la première fois où vous avez senti qu'une personne d'une autre génération vous prenait au sérieux.",
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: "L'écart",
        question:
          "Racontez un moment où l'écart entre deux générations a failli vous séparer de quelqu'un, et ce qui s'est passé ensuite.",
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: "Ce que l'autre m'a appris",
        question:
          "Racontez ce que vous avez appris de quelqu'un qui n'avait pas votre âge, et que personne de votre âge n'aurait pu vous dire.",
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: "Ce qu'on se transmet",
        question:
          "Racontez ce que vous voudriez dire, ou transmettre, à quelqu'un d'une autre génération que la vôtre.",
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
      "Chacun a un endroit auquel il se sent profondément lié. D'un côté, Horizons rassemble des personnes d'autres nations, qui parlent de leur propre pays ou territoire avec le même attachement. De l'autre, Benin rassemble les Béninois du pays et du monde, qui viennent parler du Bénin : ce qu'ils y ont vécu, ce qu'ils aiment, leur envie de le servir, et aussi celles et ceux qui accueillent ceux qui viennent le découvrir. Le Bénin est au centre, comme point de départ. Les personnes métissées choisissent leur côté, et c'est voulu.",
    posterUrl: SERIES_POSTER_FILES['horizons-benin'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Ce qui ramène chez soi',
        question:
          "Racontez l'odeur, le bruit ou le goût qui vous ramène tout de suite chez vous, et l'histoire qui va avec.",
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
          "Racontez ce que vous faites, ou voudriez faire, pour qu'il fasse bon vivre chez vous.",
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
      "Deux façons de bâtir : faire exister, et montrer le chemin. Builders réunit celles et ceux qui ont déjà bâti : une entreprise, un atelier, un lieu, un projet. Coachs réunit celles et ceux qui accompagnent les autres pour qu'ils bâtissent à leur tour : coachs, mentors, entraîneurs, formateurs. Les uns ont pris le risque, les autres aident à le prendre. La série leur pose les mêmes questions : le conseil qui a changé le cours d'une vie, le risque que tout le monde déconseillait, la personne qui a cru en eux, l'échec dont on parle peu.",
    posterUrl: SERIES_POSTER_FILES['builders-coachs'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Le conseil',
        question:
          "Racontez le conseil qui a changé la direction de votre vie, et la personne qui vous l'a donné.",
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Le risque',
        question:
          'Racontez le jour où vous avez pris un risque que tout le monde vous déconseillait.',
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: 'La confiance',
        question:
          'Racontez la personne qui a cru en vous avant que vous ne croyiez en vous-même.',
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: "L'échec",
        question:
          "Racontez un échec de votre parcours dont vous parlez rarement, et ce qu'il vous a appris.",
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
      "Deux façons de faire entendre une histoire : par les regards ou par la voix. Images réunit photographes, vidéastes, cinéastes et artistes visuels ; Paroles réunit écrivains, poètes, slameurs, conteurs et orateurs. Les uns donnent forme au monde par les images, les autres par les mots.",
    posterUrl: SERIES_POSTER_FILES['regards-paroles'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Le déclic',
        question:
          "Racontez le moment où vous avez compris que vous aviez quelque chose à faire ressentir aux autres, et que c'était à vous de le faire.",
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Pas compris',
        question:
          "Racontez une création qui n'a pas été comprise comme vous l'espériez, et ce que vous en avez fait.",
        status: 'coming_soon'
      },
      {
        id: 'ep3',
        number: '03',
        title: 'Ce qui vous a bouleversé',
        question:
          "Racontez une image, un texte ou une voix qui vous a bouleversé, et ce qu'elle a changé en vous.",
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: "L'histoire encore cachée",
        question:
          "Racontez l'histoire que vous portez en vous et que vous n'avez pas encore osé montrer au monde.",
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
