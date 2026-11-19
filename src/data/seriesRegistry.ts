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
    id: 'remedes-e-vivi',
    title: 'Remèdes ‹ › E Vivi',
    partA: {
      id: 'part-a',
      name: 'Remèdes',
      description:
        "Médecins, infirmiers, sages-femmes, pharmaciens, aides-soignants, tradipraticiens, herboristes, praticiens de médecine douce, et ceux qu'ils ont soignés. Un monde de gestes, de gardes de nuit et de confiance, où toutes les médecines se retrouvent.",
      posterUrl: SERIES_POSTER_FILES['remedes-e-vivi'].partAPosterUrl
    },
    partB: {
      id: 'part-b',
      name: 'E Vivi',
      description:
        "Agriculteurs, maraîchers, pêcheurs, cuisiniers, vendeuses de street food, marchandes de marché, brasseurs et producteurs de boissons : tous ceux qui font que d'autres mangent et boivent. Un monde de levers à l'aube, de terre, de feu, de marchés et de tables partagées.",
      posterUrl: SERIES_POSTER_FILES['remedes-e-vivi'].partBPosterUrl
    },
    synopsis:
      "Deux façons de veiller sur les autres : celles et ceux qui soignent, de toutes les médecines, et celles et ceux qui font que l'on mange et que l'on boit, du champ à l'assiette jusqu'au verre que l'on partage. D'un côté le remède, de l'autre le « E Vivi » : ce que l'on dit en fongbé quand une chose est douce et bonne. Ils se lèvent tôt, rentrent fatigués, et tiennent les autres debout sans qu'on le remarque. La série leur pose les mêmes questions : le moment où ce métier est devenu une évidence, la nuit ou le matin où il a fallu continuer, la personne dont ils se souviennent, ce qu'ils ramènent chez eux le soir.",
    posterUrl: SERIES_POSTER_FILES['remedes-e-vivi'].mainPosterUrl,
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
    id: 'amin-amen-legba',
    title: 'Amin Amen ‹ › Legba',
    partA: {
      id: 'part-a',
      name: 'Amin Amen',
      description:
        "Chrétiens de toutes confessions (catholiques, protestants, évangéliques, christianistes célestes et autres Églises) et musulmans, fidèles comme responsables de communauté. Un monde de prière, de communauté et d'engagement, où l'on dit « amen » ou « amin » à la fin de ce que l'on croit.",
      posterUrl: SERIES_POSTER_FILES['amin-amen-legba'].partAPosterUrl
    },
    partB: {
      id: 'part-b',
      name: 'Legba',
      description:
        "Pratiquants du Vodun et des traditions qui lui sont liées : prêtres et prêtresses, initiés, adeptes, familles qui entretiennent un culte, et aussi des descendants de la diaspora (Brésil, Cuba, Haïti) qui retrouvent ces racines. Un monde de rites, de mémoire et de transmission.",
      posterUrl: SERIES_POSTER_FILES['amin-amen-legba'].partBPosterUrl
    },
    synopsis:
      "Au Bénin, le Vodun occupe une place à part : une tradition d'origine, à laquelle d'autres croyances viennent faire face. D'un côté, Amin Amen : les deux mots qui ferment une prière, celui des musulmans et celui des chrétiens, pour rassembler ceux qui ont embrassé l'une de ces deux religions. De l'autre, Legba, qui rassemble les pratiquants du Vodun et des traditions qui lui sont liées. Le Vodun est au centre, comme point de départ. La série ne demande pas qui a raison. Elle demande à chacun de raconter à quel moment il s'est senti appelé, a douté, a eu besoin de courage, et ce qu'il veut transmettre.",
    posterUrl: SERIES_POSTER_FILES['amin-amen-legba'].mainPosterUrl,
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
    id: 'phd-azovi',
    title: 'PhD ‹ › Azovi',
    partA: {
      id: 'part-a',
      name: 'PhD',
      description:
        "Docteurs, doctorants, chercheurs, enseignants-chercheurs, ceux qui vivent de la recherche. Un monde de questions longues, d'évaluations et de bibliothèques.",
      posterUrl: SERIES_POSTER_FILES['phd-azovi'].partAPosterUrl
    },
    partB: {
      id: 'part-b',
      name: 'Azovi',
      description:
        "Apprentis et stagiaires de tous les métiers (18 ans minimum) : couture, mécanique, coiffure, menuiserie, soudure, électricité, restauration et tant d'autres, jeunes formés sur le tas auprès d'un patron ou d'un maître. Un monde d'ateliers, de gestes répétés et de patience, où l'on apprend en regardant et en faisant.",
      posterUrl: SERIES_POSTER_FILES['phd-azovi'].partBPosterUrl
    },
    synopsis:
      "Deux façons d'apprendre, que l'on met rarement face à face : par les livres et la recherche, ou par la main, sous le regard d'un maître. D'un côté, des docteurs et des chercheurs qui cherchent parfois pendant des années une réponse que personne n'a encore trouvée. De l'autre, Azovi, qui signifie « apprentis » : des apprentis et des stagiaires qui apprennent un métier en le faisant, à l'atelier, au garage ou sur le chantier. Au Bénin, l'apprentissage est un chemin que beaucoup de jeunes empruntent. La série leur pose les mêmes questions : le premier jour, ce qu'on apprend en faisant, l'erreur qui a tout appris, la personne qui les a formés.",
    posterUrl: SERIES_POSTER_FILES['phd-azovi'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Le premier jour',
        question:
          'Racontez votre tout premier jour là où vous avez commencé à apprendre votre métier.',
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
        question: 'Racontez une erreur qui vous a appris plus qu\'une réussite.',
        status: 'coming_soon'
      },
      {
        id: 'ep4',
        number: '04',
        title: 'Celui ou celle qui vous a formé',
        question:
          'Racontez la personne qui vous a marqué dans votre apprentissage, et ce que vous en avez retenu.',
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'blacks-one-nyonoukpo',
    title: 'Blacks One ‹ › Nyonoukpo',
    partA: {
      id: 'part-a',
      name: 'Blacks One',
      description:
        "Personnes engagées pour l'identité noire et l'unité : militants et associations panafricanistes, artistes, enseignants, jeunes diplômés, membres de la diaspora (Afrique, Amériques, Caraïbes, Europe). Un monde d'histoire, de mémoire et de fierté.",
      posterUrl: SERIES_POSTER_FILES['blacks-one-nyonoukpo'].partAPosterUrl
    },
    partB: {
      id: 'part-b',
      name: 'Nyonoukpo',
      description:
        "Des femmes et des hommes qui viennent dire ce que les femmes représentent pour eux et pourquoi elles méritent d'être défendues : mères, filles, épouses, collègues, bâtisseuses. Un monde d'admiration, de reconnaissance et de combats du quotidien.",
      posterUrl: SERIES_POSTER_FILES['blacks-one-nyonoukpo'].partBPosterUrl
    },
    synopsis:
      "Deux manières de dire « voilà ce qui compte pour moi ». D'un côté, des gens qui viennent défendre des identités noires, dans toute leur diversité, avec en toile de fond l'idée d'unité. De l'autre, Nyonoukpo, la « femme panthère » : des gens qui viennent dire leur admiration pour les femmes, leur beauté, leur puissance, ce qu'elles apportent, et pourquoi il faut les défendre.",
    posterUrl: SERIES_POSTER_FILES['blacks-one-nyonoukpo'].mainPosterUrl,
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
    id: 'fiat-luxe-irokos',
    title: 'Fiat Luxe ‹ › Irokos',
    partA: {
      id: 'part-a',
      name: 'Fiat Luxe',
      description:
        "Créateurs, artisans d'art, couturiers, bijoutiers, tisserands, maisons de luxe, hôtellerie haut de gamme : tous ceux dont le travail vise la rareté et la perfection. Un monde de matières, de gestes et de patience.",
      posterUrl: SERIES_POSTER_FILES['fiat-luxe-irokos'].partAPosterUrl
    },
    partB: {
      id: 'part-b',
      name: 'Irokos',
      description:
        "Les aînés : grands-parents, retraités, anciens du village ou du quartier, dignitaires, toutes celles et tous ceux qui ont vécu longtemps et que l'on vient écouter. Un monde de sagesse, de mémoire et de transmission par la parole.",
      posterUrl: SERIES_POSTER_FILES['fiat-luxe-irokos'].partBPosterUrl
    },
    synopsis:
      "Deux maîtrises que seul le temps permet d'acquérir : celle du geste, qui fait un objet d'une beauté rare, et celle de la vie, qui fait d'une personne un repère. Au Bénin, le luxe existe, de l'artisanat d'art à la couture, du bijou au tissage. Les aînés, eux, portent une sagesse qu'on prend rarement le temps d'écouter longuement. L'iroko est un arbre immense, qui vit des siècles : la série lui emprunte son nom pour rendre hommage aux aînés. Elle leur pose les mêmes questions : ce qu'ils ont mis des années à apprendre, ce que le temps leur a appris, la personne qui les a exigés, à qui ils transmettent.",
    posterUrl: SERIES_POSTER_FILES['fiat-luxe-irokos'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: "Ce qui ne s'explique pas",
        question:
          'Racontez ce que vous avez mis des années à apprendre, et que vous ne savez toujours pas expliquer avec des mots.',
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Ce que le temps apprend',
        question:
          "Racontez ce que les années vous ont appris, et que personne n'aurait pu vous dire au début.",
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
        title: 'La main tendue',
        question:
          'Racontez la personne à qui vous avez transmis ce que vous savez, ou celle à qui vous aimeriez le transmettre.',
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'horizons-finagnon',
    title: 'Horizons ‹ › Finagnon',
    partA: {
      id: 'part-a',
      name: 'Horizons',
      description:
        "Des personnes d'autres nations, qui parlent de leur propre pays ou territoire. Un monde de lieux, d'accents et de souvenirs.",
      posterUrl: SERIES_POSTER_FILES['horizons-finagnon'].partAPosterUrl
    },
    partB: {
      id: 'part-b',
      name: 'Finagnon',
      description:
        "Les Béninois du pays et de la diaspora, et les personnes d'origine béninoise nées ailleurs, qui parlent du Bénin, y compris celles et ceux qui accueillent les visiteurs : guides, hôtes, passeurs de mémoire. Un monde de fierté, d'engagement et de projets pour le pays.",
      posterUrl: SERIES_POSTER_FILES['horizons-finagnon'].partBPosterUrl
    },
    synopsis:
      "Chacun a un endroit auquel il se sent profondément lié. D'un côté, Horizons rassemble des personnes d'autres nations, qui parlent de leur propre pays ou territoire avec le même attachement. De l'autre, Finagnon rassemble les Béninois du pays et du monde, qui viennent parler du Bénin : ce qu'ils y ont vécu, ce qu'ils aiment, leur envie de le servir, et aussi celles et ceux qui accueillent ceux qui viennent le découvrir. Le Bénin est au centre, comme point de départ. Les personnes métissées choisissent leur côté, et c'est voulu.",
    posterUrl: SERIES_POSTER_FILES['horizons-finagnon'].mainPosterUrl,
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
          "Racontez ce que vous faites, ou voudriez faire, pour qu'il fasse bon vivre chez vous.",
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'builders-mi-do-kpo',
    title: 'Builders ‹ › Mi do kpô',
    partA: {
      id: 'part-a',
      name: 'Builders',
      description:
        "Chefs d'entreprise et entrepreneurs, fondateurs de startups, architectes, artisans qui ont monté leur propre atelier ou entreprise, bâtisseurs de lieux ou de projets. Un monde de risques, de rencontres et de paris.",
      posterUrl: SERIES_POSTER_FILES['builders-mi-do-kpo'].partAPosterUrl
    },
    partB: {
      id: 'part-b',
      name: 'Mi do kpô',
      description:
        "Enseignants, fonctionnaires, magistrats, policiers, gendarmes, pompiers, militaires, travailleurs sociaux, agents communaux, et toutes celles et tous ceux qui servent l'intérêt général. Un monde de service, de devoir et de patience.",
      posterUrl: SERIES_POSTER_FILES['builders-mi-do-kpo'].partBPosterUrl
    },
    synopsis:
      "Deux façons de bâtir : pour soi, ou pour tous. Builders réunit celles et ceux qui ont monté une entreprise, un atelier ou un projet, et qui savent faire exister des choses. Mi do kpô, « nous sommes ensemble » en fongbé, réunit celles et ceux qui font tenir la vie commune : l'école, la justice, la sécurité, les services publics. Les uns prennent un risque pour créer, les autres tiennent un devoir pour que tout le monde puisse vivre et bâtir. La série leur pose les mêmes questions : le choix de cette voie, l'épreuve où tout a failli tomber, la confiance reçue, ce que leur travail a changé pour quelqu'un.",
    posterUrl: SERIES_POSTER_FILES['builders-mi-do-kpo'].mainPosterUrl,
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Le choix',
        question:
          "Racontez le moment où vous avez choisi cette voie, avec ce qu'elle comportait de risque ou de renoncement.",
        status: 'coming_soon'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Quand tout a failli tomber',
        question:
          'Racontez une épreuve où ce que vous aviez bâti, ou ce que vous serviez, a failli ne pas tenir.',
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
    id: 'regards-gbe',
    title: 'Regards ‹ › Gbé',
    partA: {
      id: 'part-a',
      name: 'Regards',
      description:
        "Photographes, vidéastes, cinéastes, peintres, plasticiens, graffeurs, illustrateurs. Un monde d'images, de lumière et de regards.",
      posterUrl: SERIES_POSTER_FILES['regards-gbe'].partAPosterUrl
    },
    partB: {
      id: 'part-b',
      name: 'Gbé',
      description:
        'Tous ceux qui travaillent par le verbe : écrivains, poètes, slameurs, conteurs, orateurs, avocats, auteurs de discours. Un monde de voix, de plaidoiries et de textes.',
      posterUrl: SERIES_POSTER_FILES['regards-gbe'].partBPosterUrl
    },
    synopsis:
      "Deux façons de faire entendre une histoire : par les regards ou par la voix. Regards réunit photographes, vidéastes, cinéastes et artistes visuels ; Gbé réunit écrivains, poètes, slameurs, conteurs et orateurs. Les uns donnent forme au monde par les images, les autres par les mots.",
    posterUrl: SERIES_POSTER_FILES['regards-gbe'].mainPosterUrl,
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
