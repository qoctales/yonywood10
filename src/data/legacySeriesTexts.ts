/**
 * Archive des textes complets des 8 séries remplacées (v2).
 * Conservée à titre documentaire uniquement — ne pas importer dans le code actif.
 */
export interface ArchivedSeriesEntry {
  id: string;
  title: string;
  partA: {
    id: 'part-a';
    name: string;
    description: string;
    posterUrl: string;
  };
  partB: {
    id: 'part-b';
    name: string;
    description: string;
    posterUrl: string;
  };
  synopsis: string;
  posterUrl: string;
  episodes: Array<{
    id: 'ep1' | 'ep2' | 'ep3' | 'ep4';
    number: '01' | '02' | '03' | '04';
    title: string;
    question: string;
  }>;
}

export const ARCHIVED_SERIES_V2_TEXTS: ArchivedSeriesEntry[] = [
  {
    id: 'care-feed',
    title: 'Care <> Feed',
    partA: {
      id: 'part-a',
      name: 'Care',
      description:
        "Médecins, infirmiers, sages-femmes, pharmaciens, aides-soignants, tradipraticiens, herboristes, praticiens de médecine douce, et ceux qu'ils ont soignés. Un monde de gestes, de gardes de nuit et de confiance, où toutes les médecines se retrouvent.",
      posterUrl: '/Posters/Sides/Care.png'
    },
    partB: {
      id: 'part-b',
      name: 'Feed',
      description:
        "Agriculteurs, maraîchers, pêcheurs, cuisiniers, vendeuses de street food, marchandes de marché : tous ceux qui font que d'autres mangent. Un monde de levers à l'aube, de terre, de feu et de marchés.",
      posterUrl: '/Posters/Sides/Feed.png'
    },
    synopsis:
      "Deux façons de veiller sur les autres : celles et ceux qui prennent soin, de toutes les médecines, et celles et ceux qui nourrissent, du champ à l'assiette. Ils se lèvent tôt, rentrent fatigués, et tiennent les autres debout sans qu'on le remarque. La série leur pose les mêmes questions : le moment où ce métier est devenu une évidence, la nuit ou le matin où il a fallu continuer, la personne dont ils se souviennent, ce qu'ils ramènent chez eux le soir.",
    posterUrl: '/Posters/Care ‹ › Feed.png',
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: "L'évidence",
        question:
          'Racontez le moment où vous avez compris que votre métier serait de vous occuper des autres.'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Tenir bon',
        question:
          "Racontez une nuit, ou un matin, où vous avez continué alors que vous n'en pouviez plus."
      },
      {
        id: 'ep3',
        number: '03',
        title: 'Une rencontre',
        question:
          'Racontez une personne dont vous vous souvenez parmi toutes celles que votre travail a croisées.'
      },
      {
        id: 'ep4',
        number: '04',
        title: "Ce qu'on ramène le soir",
        question:
          "Racontez un soir où vous êtes rentré chez vous en pensant encore à quelqu'un du travail."
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
      posterUrl: '/Posters/Sides/Vodun Rays.png'
    },
    partB: {
      id: 'part-b',
      name: 'Autre Foi',
      description:
        "Toute personne ayant embrassé une croyance autre que le Vodun : chrétiens de toutes confessions, musulmans, bouddhistes, membres d'ordres mystiques ou ésotériques (rosicruciens, francs-maçons...), et toute autre foi qui a du sens pour eux. Un monde de quête intérieure, de prière ou de pratique, et d'engagement.",
      posterUrl: '/Posters/Sides/Autre Foi.png'
    },
    synopsis:
      "Au Bénin, le Vodun occupe une place à part : une tradition d'origine, à laquelle beaucoup d'autres croyances viennent faire face. D'un côté, Vodun Rays, qui rassemble les pratiquants du Vodun et des traditions qui lui sont liées. De l'autre, Autre Foi, qui rassemble tous ceux qui ont embrassé une autre croyance — catholiques, musulmans, bouddhistes, rosicruciens, francs-maçons, et bien d'autres spiritualités, religions ou ordres mystiques, connus ou plus discrets. Le Vodun est au centre, comme point de départ. La série ne demande pas qui a raison. Elle demande à chacun de raconter à quel moment il s'est senti appelé, a douté, a eu besoin de courage, et ce qu'il veut transmettre.",
    posterUrl: '/Posters/Vodun Rays ‹ › Autre Foi.png',
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: "L'appel",
        question:
          "Racontez le moment où vous avez senti qu'il existait quelque chose de plus grand que vous."
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Le vacillement',
        question: 'Racontez un moment où ce qui vous tenait debout a vacillé.'
      },
      {
        id: 'ep3',
        number: '03',
        title: 'Le courage de croire',
        question:
          "Racontez une fois où ce en quoi vous croyez vous a demandé plus de courage que vous n'en pensiez avoir."
      },
      {
        id: 'ep4',
        number: '04',
        title: "Ce qu'on transmet",
        question:
          "Racontez ce que vous voudriez transmettre, à quelqu'un que vous aimez, de ce qui vous a tenu debout."
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
      posterUrl: '/Posters/Sides/Baobabs.png'
    },
    partB: {
      id: 'part-b',
      name: 'Bambous',
      description:
        "Les jeunes adultes (18 ans minimum) qui construisent leur vie : étudiants, apprentis, jeunes créateurs, jeunes actifs. Un monde de projets, de doutes et d'impatience.",
      posterUrl: '/Posters/Sides/Bambous.png'
    },
    synopsis:
      "Un baobab pousse lentement et vit des siècles ; un bambou grandit à vue d'œil et plie sans casser. Deux générations, deux rythmes, rarement invitées à se parler sans hiérarchie. La série les met face à la même question : un souvenir d'enfance, une surprise venue d'un autre âge, une erreur dont on a appris, ce qu'on voudrait laisser derrière soi.",
    posterUrl: '/Posters/Baobabs ‹ › Bambous.png',
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: "L'enfance",
        question: "Racontez l'instant de votre enfance que vous voudriez revivre une dernière fois."
      },
      {
        id: 'ep2',
        number: '02',
        title: "D'un autre âge",
        question:
          "Racontez ce que quelqu'un d'une autre génération vous a fait comprendre sans le vouloir."
      },
      {
        id: 'ep3',
        number: '03',
        title: "L'erreur",
        question:
          "Racontez une erreur que vous ne voudriez pas effacer, ou que vous n'avez pas fini de regretter."
      },
      {
        id: 'ep4',
        number: '04',
        title: 'Ce qui reste',
        question:
          "Qu'aimeriez-vous qu'il reste de vous dans la vie des autres, quand vous ne serez plus là ?"
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
      posterUrl: '/Posters/Sides/Blacks One.png'
    },
    partB: {
      id: 'part-b',
      name: 'Wowmen',
      description:
        "Des femmes et des hommes qui viennent dire ce que les femmes représentent pour eux et pourquoi elles méritent d'être défendues : mères, filles, épouses, collègues, bâtisseuses. Un monde d'admiration, de reconnaissance et de combats du quotidien.",
      posterUrl: '/Posters/Sides/Wowmen.png'
    },
    synopsis:
      "Deux manières de dire « voilà ce qui compte pour moi ». D'un côté, des gens qui viennent défendre des identités noires, dans toute leur diversité, avec en toile de fond l'idée d'unité. De l'autre, des gens qui viennent dire leur admiration pour les femmes : leur beauté, leur puissance, ce qu'elles apportent, et pourquoi il faut les défendre. Le titre joue sur le double W de « Wowmen ».",
    posterUrl: '/Posters/Blacks One ‹ › Wowmen.png',
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'La fierté',
        question: 'Racontez le moment où vous avez appris à être fier de qui vous êtes.'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Prendre parti',
        question:
          "Racontez une fois où vous avez défendu quelqu'un ou quelque chose qui vous est cher, alors qu'il aurait été plus simple de vous taire."
      },
      {
        id: 'ep3',
        number: '03',
        title: 'La dignité',
        question: "Racontez la personne dont la force vous a appris ce qu'est la dignité."
      },
      {
        id: 'ep4',
        number: '04',
        title: "À un enfant d'aujourd'hui",
        question:
          "Racontez ce que vous voudriez dire à un enfant d'aujourd'hui, pour qu'il sache qui il est avant que le monde ne le lui dise."
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
      posterUrl: '/Posters/Sides/Fiat Luxe.png'
    },
    partB: {
      id: 'part-b',
      name: 'PhD',
      description:
        "Docteurs, doctorants, chercheurs, enseignants-chercheurs, ceux qui vivent de la recherche. Un monde de questions longues, d'évaluations et de bibliothèques.",
      posterUrl: '/Posters/Sides/PhD.png'
    },
    synopsis:
      "Deux excellences que l'on met rarement face à face : celle du geste, qui fait un objet d'une beauté rare, et celle de la pensée, qui cherche pendant des années une réponse que personne n'a encore trouvée. Au Bénin, le luxe existe, de l'artisanat d'art à la couture, du bijou au tissage. Les docteurs et chercheurs, eux, produisent un savoir qu'on voit peu.",
    posterUrl: '/Posters/Fiat Luxe ‹ › PhD.png',
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Donner sa vie',
        question:
          'Racontez le moment où vous avez su que vous donneriez des années de votre vie à une seule chose.'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Le renoncement',
        question:
          'Racontez ce à quoi vous avez renoncé pour aller au bout de quelque chose qui comptait pour vous.'
      },
      {
        id: 'ep3',
        number: '03',
        title: "L'exigence",
        question:
          'Racontez la personne qui vous a appris à ne pas vous contenter du « presque ».'
      },
      {
        id: 'ep4',
        number: '04',
        title: 'Le jour de vérité',
        question:
          'Racontez le jour où vous avez su que tout ce que cela vous avait coûté en valait la peine.'
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
      posterUrl: '/Posters/Sides/Finagnon.png'
    },
    partB: {
      id: 'part-b',
      name: 'Horizons',
      description:
        "Des personnes d'autres nations, qui parlent de leur propre pays ou territoire. Un monde de lieux, d'accents et de souvenirs.",
      posterUrl: '/Posters/Sides/Horizons.png'
    },
    synopsis:
      "Chacun a un endroit auquel il se sent profondément lié. D'un côté, Finagnon rassemble les Béninois du pays et du monde, qui viennent parler du Bénin : ce qu'ils y ont vécu, ce qu'ils aiment, leur envie de le servir. De l'autre, Horizons rassemble des personnes d'autres nations, qui parlent de leur propre pays ou territoire avec le même attachement. Le Bénin est au centre, comme point de départ. Les personnes métissées choisissent leur côté, et c'est voulu.",
    posterUrl: '/Posters/Finagnon ‹ › Horizons.png',
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Chez soi',
        question: 'Racontez le moment où vous avez senti que vous étiez enfin chez vous.'
      },
      {
        id: 'ep2',
        number: '02',
        title: "Ce qu'on emporte",
        question:
          "Racontez ce que vous emporteriez partout avec vous de l'endroit qui vous a fait, et ce que vous ne pourriez jamais emporter."
      },
      {
        id: 'ep3',
        number: '03',
        title: 'Défendre sa terre',
        question:
          "Racontez une fois où vous avez défendu l'endroit d'où vous venez devant quelqu'un qui ne le connaissait pas, et ce que cela a réveillé en vous."
      },
      {
        id: 'ep4',
        number: '04',
        title: 'Bâtir chez soi',
        question:
          "Racontez ce que vous faites, ou voudriez faire, pour qu'il fasse bon vivre chez vous."
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
      posterUrl: '/Posters/Sides/Performers.png'
    },
    partB: {
      id: 'part-b',
      name: 'Builders',
      description:
        "Chefs d'entreprise et entrepreneurs, fondateurs de startups, architectes, artisans qui ont monté leur propre atelier ou entreprise, bâtisseurs de lieux ou de projets. Un monde de risques, de rencontres et de paris.",
      posterUrl: '/Posters/Sides/Builders.png'
    },
    synopsis:
      "Performers rassemble celles et ceux qui font vivre une expérience au public : danseurs, musiciens, comédiens, humoristes, gamers et autres artistes de la scène ou de l'écran. Builders réunit celles et ceux qui entreprennent, conçoivent, organisent et développent des projets, des lieux ou des entreprises : chefs d'entreprise, architectes, artisans qui montent leur atelier, fondateurs de startups. La série explore leur envie de donner vie à quelque chose, les moments de doute, les personnes qui ont cru en eux et l'impact de ce qu'ils font sur les autres.",
    posterUrl: '/Posters/Performers ‹ › Builders.png',
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Donner vie',
        question:
          "Racontez le moment où vous avez décidé de donner vie à quelque chose qui n'existait pas encore."
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Au bord du renoncement',
        question:
          'Racontez un moment où vous avez été tout près de renoncer, et ce qui vous a finalement poussé à continuer.'
      },
      {
        id: 'ep3',
        number: '03',
        title: "La confiance d'un autre",
        question:
          'Racontez la personne qui a cru en vous, en votre talent ou en votre projet, à un moment où vous-même doutiez encore.'
      },
      {
        id: 'ep4',
        number: '04',
        title: "Compter pour quelqu'un",
        question:
          "Racontez le moment où vous avez compris que ce que vous faisiez avait réellement compté pour quelqu'un d'autre."
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
      posterUrl: '/Posters/Sides/Paroles.png'
    },
    partB: {
      id: 'part-b',
      name: 'Regards',
      description:
        "Photographes, vidéastes, cinéastes, peintres, plasticiens, graffeurs, illustrateurs. Un monde d'images, de lumière et de regards.",
      posterUrl: '/Posters/Sides/Regards.png'
    },
    synopsis:
      'Deux façons de faire entendre une histoire : par les paroles ou par les regards. Paroles rassemble écrivains, poètes, slameurs, conteurs et orateurs ; Regards réunit photographes, vidéastes, cinéastes et artistes visuels. Les uns donnent forme au monde par les mots, les autres par les images.',
    posterUrl: '/Posters/Paroles ‹ › Regards.png',
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Prendre la parole',
        question:
          'Racontez le moment où vous avez compris que si vous ne le disiez pas, personne ne le dirait à votre place.'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Dans le silence',
        question:
          "Racontez un moment où vous aviez besoin d'être entendu et où personne n'écoutait, et ce que vous en avez fait."
      },
      {
        id: 'ep3',
        number: '03',
        title: 'Changer de regard',
        question:
          'Racontez une image, une phrase ou un silence qui a changé votre manière de voir le monde.'
      },
      {
        id: 'ep4',
        number: '04',
        title: "L'histoire encore tue",
        question:
          "Racontez l'histoire que vous portez en vous et que vous n'avez pas encore osé raconter."
      }
    ]
  }
];

/**
 * Archive des textes avant renommage du côté 2 « Nukplonkplon » en « Azovi » (Prompt 10C).
 * Conservée à titre documentaire uniquement — ne pas importer dans le code actif.
 */
export const ARCHIVED_SERIES_V3_RENAMED_TEXTS: ArchivedSeriesEntry[] = [
  {
    id: 'phd-nukplonkplon',
    title: 'PhD ‹ › Nukplonkplon',
    partA: {
      id: 'part-a',
      name: 'PhD',
      description:
        "Docteurs, doctorants, chercheurs, enseignants-chercheurs, ceux qui vivent de la recherche. Un monde de questions longues, d'évaluations et de bibliothèques.",
      posterUrl: '/Posters/Sides/PhD.png'
    },
    partB: {
      id: 'part-b',
      name: 'Nukplonkplon',
      description:
        "Apprentis et stagiaires de tous les métiers (18 ans minimum) : couture, mécanique, coiffure, menuiserie, soudure, électricité, restauration et tant d'autres, jeunes formés sur le tas auprès d'un patron ou d'un maître. Un monde d'ateliers, de gestes répétés et de patience, où l'on apprend en regardant et en faisant.",
      posterUrl: '/Posters/Sides/Bambous.png'
    },
    synopsis:
      "Deux façons d'apprendre, que l'on met rarement face à face : par les livres et la recherche, ou par la main, sous le regard d'un maître. D'un côté, des docteurs et des chercheurs qui cherchent parfois pendant des années une réponse que personne n'a encore trouvée. De l'autre, des apprentis et des stagiaires qui apprennent un métier en le faisant, à l'atelier, au garage ou sur le chantier. Au Bénin, l'apprentissage est un chemin que beaucoup de jeunes empruntent. La série leur pose les mêmes questions : le premier jour, ce qu'on apprend en faisant, l'erreur qui a tout appris, la personne qui les a formés.",
    posterUrl: '/Posters/Baobabs ‹ › Bambous.png',
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Le premier jour',
        question:
          'Racontez votre tout premier jour là où vous avez commencé à apprendre votre métier.'
      },
      {
        id: 'ep2',
        number: '02',
        title: 'Apprendre en faisant',
        question:
          "Racontez ce que vous avez appris par la pratique, et qu'aucun livre ni aucun cours ne vous avait dit."
      },
      {
        id: 'ep3',
        number: '03',
        title: "L'erreur",
        question: "Racontez une erreur qui vous a appris plus qu'une réussite."
      },
      {
        id: 'ep4',
        number: '04',
        title: 'Celui ou celle qui vous a formé',
        question:
          'Racontez la personne qui vous a marqué dans votre apprentissage, et ce que vous en avez retenu.'
      }
    ]
  },
  {
    id: 'builders-akwe',
    title: 'Builders ‹ › Àkwè',
    partA: {
      id: 'part-a',
      name: 'Builders',
      description:
        "Chefs d'entreprise et entrepreneurs, fondateurs de startups, architectes, artisans qui ont monté leur propre atelier ou entreprise, bâtisseurs de lieux ou de projets. Un monde de risques, de rencontres et de paris.",
      posterUrl: '/Posters/Sides/Builders.png'
    },
    partB: {
      id: 'part-b',
      name: 'Àkwè',
      description:
        "Banquiers, comptables, gestionnaires financiers, investisseurs, business angels, traders, tontiniers, et toute personne qui dispose de moyens et choisit d'en faire quelque chose. Un monde de chiffres, d'arbitrages et de confiance.",
      posterUrl: '/Posters/Sides/Performers.png'
    },
    synopsis:
      "Deux mondes qui ont besoin l'un de l'autre pour que les choses existent : celles et ceux qui bâtissent, et celles et ceux qui portent l'argent. Builders réunit celles et ceux qui entreprennent, conçoivent, organisent et développent des projets, des lieux ou des entreprises. Àkwè, « l'argent » en fongbé, réunit celles et ceux qui le gèrent, le financent ou en disposent. La série explore le pari, la peur, la confiance accordée ou reçue, et l'impact de ce que l'on fait sur les autres.",
    posterUrl: '/Posters/Performers ‹ › Builders.png',
    episodes: [
      {
        id: 'ep1',
        number: '01',
        title: 'Le pari',
        question:
          'Racontez le pari le plus risqué que vous avez pris, et ce qui vous a poussé à le prendre.'
      },
      {
        id: 'ep2',
        number: '02',
        title: "L'argent en jeu",
        question:
          "Racontez un moment où l'argent, par sa présence ou son absence, a changé le cours de quelque chose que vous vouliez faire."
      },
      {
        id: 'ep3',
        number: '03',
        title: "La confiance d'un autre",
        question:
          'Racontez la personne qui a cru en vous, en votre talent ou en votre projet, à un moment où vous-même doutiez encore.'
      },
      {
        id: 'ep4',
        number: '04',
        title: "Compter pour quelqu'un",
        question:
          "Racontez le moment où vous avez compris que ce que vous faisiez avait réellement compté pour quelqu'un d'autre."
      }
    ]
  }
];

