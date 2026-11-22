export type FocusType = 'organisation' | 'theme' | 'personnalite';

export interface FocusQuestionItem {
  id: 'q1' | 'q2' | 'q3' | 'q4';
  number: '01' | '02' | '03' | '04';
  title: string;
  question: string;
}

export interface FocusVideoItem {
  id: string;
  focusId: string;
  authorName: string;
  authorAvatar: string;
  protagonistId?: string;
  role?: string;
  questionNumber?: '01' | '02' | '03' | '04';
  questionTitle?: string;
  question?: string;
  durationFormatted: string;
  posterUrl: string;
  videoUrl: string;
}

export interface FocusItem {
  id: string;
  type: FocusType;
  titre: string;
  sousTitre?: string;
  synopsis: string;
  consigne: string;
  question: string;
  questions: FocusQuestionItem[];
  roles?: string[];
  commandite: boolean;
  accesOuvert: boolean;
  sponsorNote?: string;
  posterUrl: string;
  videos: FocusVideoItem[];
}

export const FOCUS_DATA: FocusItem[] = [
  {
    id: 'fiat-luxe',
    type: 'theme',
    titre: 'Fiat Luxe',
    synopsis:
      "Le luxe, ce n'est pas seulement ce qui coûte cher : c'est ce qui demande du temps, de la main et de l'exigence. De l'artisanat d'art à la couture, du bijou au tissage, de l'hôtellerie à la maison de création, Fiat Luxe recueille les histoires de celles et ceux qui font, portent ou admirent la rareté et la perfection. Chacun peut y raconter : un geste, un objet, une rencontre.",
    consigne: 'Racontez ce que vous avez vécu ou vu, sans promouvoir un produit.',
    question:
      'Racontez la plus belle chose que vous connaissiez qui ait demandé des années à faire ou à obtenir, et ce que ce temps lui a donné.',
    questions: [
      {
        id: 'q1',
        number: '01',
        title: 'Le prix du temps',
        question:
          'Racontez la plus belle chose que vous connaissiez qui ait demandé des années à faire ou à obtenir, et ce que ce temps lui a donné.',
      },
      {
        id: 'q2',
        number: '02',
        title: 'Le beau plutôt que le facile',
        question:
          'Racontez une fois où vous avez choisi le beau et le durable plutôt que le rapide et le bon marché.',
      },
      {
        id: 'q3',
        number: '03',
        title: "L'exigence",
        question:
          'Racontez la personne qui vous a appris à ne pas vous contenter du « presque ».',
      },
      {
        id: 'q4',
        number: '04',
        title: 'La beauté rare',
        question:
          'Racontez un jour où vous avez vu quelque chose de si bien fait que vous en êtes resté sans voix.',
      },
    ],
    commandite: false,
    accesOuvert: true,
    posterUrl: encodeURI('/Posters/Focus/Fiat Luxe.png?v=2'),
    videos: [
      {
        id: 'focus-fiat-luxe-1',
        focusId: 'fiat-luxe',
        authorName: 'Éléonore Vance',
        authorAvatar: '/assets/duos/eleonore-vance.jpg',
        protagonistId: 'eleonore-vance',
        questionNumber: '01',
        questionTitle: 'Le prix du temps',
        question:
          'Racontez la plus belle chose que vous connaissiez qui ait demandé des années à faire ou à obtenir, et ce que ce temps lui a donné.',
        durationFormatted: '2:18',
        posterUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: '/sample.mp4',
      },
      {
        id: 'focus-fiat-luxe-2',
        focusId: 'fiat-luxe',
        authorName: 'Sayri Quispe',
        authorAvatar: '/assets/duos/sayri-quispe.jpg',
        protagonistId: 'sayri-quispe',
        questionNumber: '02',
        questionTitle: 'Le beau plutôt que le facile',
        question:
          'Racontez une fois où vous avez choisi le beau et le durable plutôt que le rapide et le bon marché.',
        durationFormatted: '2:04',
        posterUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: '/sample.mp4',
      },
    ],
  },
  {
    id: 'e-vivi',
    type: 'theme',
    titre: 'Dixeat',
    synopsis:
      "Un ancien sage aurait dit que ce que l'on dit est plus important que ce que l'on mange. Dixeat prend la phrase au mot : autour des tables, des cuisines, des restaurants et des marchés, ce sont les paroles qui restent. Cuisiniers, serveurs, propriétaires, clients, fournisseurs, agriculteurs, pêcheurs : chacun raconte l'histoire d'un plat, d'un lieu ou d'un repas partagé.",
    consigne: "L'histoire d'abord : ne faites pas la publicité d'un établissement.",
    question:
      "Racontez l'histoire d'un plat, d'un repas ou d'un lieu où l'on mange, qui compte pour vous.",
    questions: [
      {
        id: 'q1',
        number: '01',
        title: 'Au menu',
        question:
          "Racontez l'histoire d'un plat, d'un repas ou d'un lieu où l'on mange, qui compte pour vous.",
      },
      {
        id: 'q2',
        number: '02',
        title: 'Une parole à table',
        question:
          'Racontez une parole entendue à table qui vous a marqué plus que le repas lui-même.',
      },
      {
        id: 'q3',
        number: '03',
        title: "Ce qu'on ne voit pas",
        question:
          "Racontez ce qui s'est passé avant qu'un repas arrive à table, et que personne autour de la table n'a vu.",
      },
      {
        id: 'q4',
        number: '04',
        title: 'La table des autres',
        question:
          'Racontez un repas partagé qui a changé quelque chose entre vous et les personnes présentes.',
      },
    ],
    commandite: false,
    accesOuvert: true,
    posterUrl: encodeURI('/Posters/Focus/E Vivi.png?v=2'),
    videos: [
      {
        id: 'focus-e-vivi-1',
        focusId: 'e-vivi',
        authorName: 'Koffi Mensah',
        authorAvatar: '/assets/duos/chef-koffi.jpg',
        protagonistId: 'koffi-mensah',
        questionNumber: '01',
        questionTitle: 'Au menu',
        question:
          "Racontez l'histoire d'un plat, d'un repas ou d'un lieu où l'on mange, qui compte pour vous.",
        durationFormatted: '2:14',
        posterUrl: '/assets/duos/chef-koffi.jpg',
        videoUrl: '/sample.mp4',
      },
      {
        id: 'focus-e-vivi-2',
        focusId: 'e-vivi',
        authorName: 'Tobi Houndégla',
        authorAvatar: '/assets/duos/tobi-houndegla.jpg',
        protagonistId: 'tobi-houndegla',
        questionNumber: '03',
        questionTitle: "Ce qu'on ne voit pas",
        question:
          "Racontez ce qui s'est passé avant qu'un repas arrive à table, et que personne autour de la table n'a vu.",
        durationFormatted: '2:32',
        posterUrl: '/assets/duos/tobi-houndegla.jpg',
        videoUrl: '/sample.mp4',
      },
    ],
  },
  {
    id: 'pour-rire',
    type: 'theme',
    titre: 'Pour rire',
    synopsis:
      "Tout le monde a vécu un moment où le rire a pris le dessus : un fou rire au pire moment, une gaffe, un malentendu, une rencontre absurde. Pour rire accueille ces anecdotes vraiment vécues, racontées pour faire rire, et pour rire ensemble.",
    consigne:
      "Anecdotes réellement vécues. Pas de moquerie visant une ethnie, une religion, un handicap ou une personne que l'on pourrait reconnaître : on rit d'abord de soi.",
    question: "Racontez un fou rire que vous n'avez pas pu arrêter, au pire moment possible.",
    questions: [
      {
        id: 'q1',
        number: '01',
        title: 'Le fou rire',
        question: "Racontez un fou rire que vous n'avez pas pu arrêter, au pire moment possible.",
      },
      {
        id: 'q2',
        number: '02',
        title: 'La gaffe',
        question:
          "Racontez une maladresse qui vous a fait mourir de honte, et dont vous riez aujourd'hui.",
      },
      {
        id: 'q3',
        number: '03',
        title: 'Le malentendu',
        question:
          'Racontez un malentendu qui a mal tourné, et qui est devenu une histoire drôle.',
      },
      {
        id: 'q4',
        number: '04',
        title: 'La personne drôle',
        question:
          "Racontez la personne la plus drôle que vous connaissiez, et une chose qu'elle a faite ou dite qui vous fait encore rire.",
      },
    ],
    commandite: false,
    accesOuvert: true,
    posterUrl: encodeURI('/Posters/Focus/Pour Rire.png?v=2'),
    videos: [
      {
        id: 'focus-pour-rire-1',
        focusId: 'pour-rire',
        authorName: 'Armel Hounkpatin',
        authorAvatar: '/assets/duos/paroles-armel.jpg',
        protagonistId: 'armel-hounkpatin',
        questionNumber: '01',
        questionTitle: 'Le fou rire',
        question: "Racontez un fou rire que vous n'avez pas pu arrêter, au pire moment possible.",
        durationFormatted: '1:58',
        posterUrl: '/assets/duos/paroles-armel.jpg',
        videoUrl: '/sample.mp4',
      },
      {
        id: 'focus-pour-rire-2',
        focusId: 'pour-rire',
        authorName: 'Yédé Dossou',
        authorAvatar: '/assets/duos/performers-yede.jpg',
        protagonistId: 'yede-dossou',
        questionNumber: '03',
        questionTitle: 'Le malentendu',
        question:
          'Racontez un malentendu qui a mal tourné, et qui est devenu une histoire drôle.',
        durationFormatted: '2:11',
        posterUrl: '/assets/duos/performers-yede.jpg',
        videoUrl: '/sample.mp4',
      },
    ],
  },
  {
    id: 'cv',
    type: 'theme',
    titre: 'Mon Histoire fera le Job',
    synopsis:
      "Un CV dit ce que l'on a fait. Une histoire dit qui l'on est. Ce Focus est pour celles et ceux qui cherchent leur place professionnelle, à vingt ans comme à cinquante : un emploi, un stage, une reconversion, un premier client. Ils racontent ce qu'ils savent faire par une histoire plutôt que par une liste. Ceux qui recrutent y entendent autre chose qu'un CV.",
    consigne:
      "Racontez ce que vous savez faire. Chaque personne décide seule si elle peut être contactée ; rien n'est exposé par défaut.",
    question:
      "Racontez le moment où vous avez fait un travail dont vous êtes fier, et que personne n'a remarqué.",
    questions: [
      {
        id: 'q1',
        number: '01',
        title: 'Fier en silence',
        question:
          "Racontez le moment où vous avez fait un travail dont vous êtes fier, et que personne n'a remarqué.",
      },
      {
        id: 'q2',
        number: '02',
        title: 'Un obstacle surmonté',
        question:
          'Racontez un obstacle que vous avez surmonté dans votre travail ou vos études, et comment.',
      },
      {
        id: 'q3',
        number: '03',
        title: 'Ce que je cherche à bâtir',
        question:
          "Racontez le travail que vous voudriez faire, et ce que vous voudriez qu'il change.",
      },
      {
        id: 'q4',
        number: '04',
        title: 'Un service rendu',
        question:
          "Racontez une fois où votre savoir-faire a vraiment rendu service à quelqu'un.",
      },
    ],
    commandite: false,
    accesOuvert: true,
    posterUrl: encodeURI('/Posters/Focus/Mon histoire fera le job.png?v=2'),
    videos: [
      {
        id: 'focus-cv-1',
        focusId: 'cv',
        authorName: 'Nadège Zinsou',
        authorAvatar: '/assets/duos/researcher-phd.jpg',
        protagonistId: 'nadege-zinsou',
        questionNumber: '01',
        questionTitle: 'Fier en silence',
        question:
          "Racontez le moment où vous avez fait un travail dont vous êtes fier, et que personne n'a remarqué.",
        durationFormatted: '2:26',
        posterUrl: '/assets/duos/researcher-phd.jpg',
        videoUrl: '/sample.mp4',
      },
      {
        id: 'focus-cv-2',
        focusId: 'cv',
        authorName: 'Malik Diop',
        authorAvatar: '/assets/duos/malik-diop.jpg',
        protagonistId: 'malik-diop',
        questionNumber: '03',
        questionTitle: 'Ce que je cherche à bâtir',
        question:
          "Racontez le travail que vous voudriez faire, et ce que vous voudriez qu'il change.",
        durationFormatted: '2:12',
        posterUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: '/sample.mp4',
      },
    ],
  },
  {
    id: 'votre-honneur',
    type: 'theme',
    titre: 'Votre Honneur',
    synopsis:
      "Un avocat plaide pour les autres. Ici, il plaide pour lui-même. Votre Honneur invite avocats, juristes et toutes celles et tous ceux qui ont une cause à défendre à raconter leur propre histoire sous la forme d'une plaidoirie : un récit adressé à des juges, avec des arguments, des preuves et une conclusion.",
    consigne:
      "Ne parlez d'aucun dossier de client ni d'aucun détail qui le ferait reconnaître.",
    question:
      'Racontez une injustice dont vous avez été victime ou témoin, comme si vous la plaidiez devant un juge.',
    questions: [
      {
        id: 'q1',
        number: '01',
        title: "L'injustice",
        question:
          'Racontez une injustice dont vous avez été victime ou témoin, comme si vous la plaidiez devant un juge.',
      },
      {
        id: 'q2',
        number: '02',
        title: 'Plaider coupable',
        question:
          "Racontez une faute que vous avez commise, et plaidez-la : ce qui l'explique, sans l'excuser.",
      },
      {
        id: 'q3',
        number: '03',
        title: 'Une cause difficile',
        question:
          'Racontez une cause que vous avez défendue, ou voulu défendre, alors que tout semblait contre vous.',
      },
      {
        id: 'q4',
        number: '04',
        title: 'Ma conclusion',
        question:
          "Racontez ce que vous voudriez que l'on retienne de votre histoire, comme si vous veniez de terminer votre plaidoirie.",
      },
    ],
    commandite: false,
    accesOuvert: true,
    posterUrl: encodeURI('/Posters/Focus/Votre Honneur.png?v=2'),
    videos: [
      {
        id: 'focus-votre-honneur-1',
        focusId: 'votre-honneur',
        authorName: 'Awa Ndiaye',
        authorAvatar: '/assets/duos/horizons-awa.jpg',
        protagonistId: 'awa-ndiaye',
        questionNumber: '01',
        questionTitle: "L'injustice",
        question:
          'Racontez une injustice dont vous avez été victime ou témoin, comme si vous la plaidiez devant un juge.',
        durationFormatted: '2:41',
        posterUrl: '/assets/duos/horizons-awa.jpg',
        videoUrl: '/sample.mp4',
      },
      {
        id: 'focus-votre-honneur-2',
        focusId: 'votre-honneur',
        authorName: 'Kwame Mensah',
        authorAvatar: '/assets/duos/kwame-mensah.jpg',
        protagonistId: 'kwame-mensah',
        questionNumber: '02',
        questionTitle: 'Plaider coupable',
        question:
          "Racontez une faute que vous avez commise, et plaidez-la : ce qui l'explique, sans l'excuser.",
        durationFormatted: '2:20',
        posterUrl: '/assets/duos/kwame-mensah.jpg',
        videoUrl: '/sample.mp4',
      },
    ],
  },
  {
    id: 'hoxo',
    type: 'theme',
    titre: 'Hoxò',
    synopsis:
      "Au Bénin, les jumeaux, les Hoxò, ont une place à part : on les dit porteurs de bon augure, on les honore, on leur consacre des cérémonies. Ce Focus recueille les histoires de celles et ceux qui en ont une à raconter : jumeaux et jumelles, parents, proches, dignitaires, artistes, témoins.",
    consigne:
      'Récits de vie uniquement : ne filmez pas de rituel. Parlez des autres avec respect.',
    question: 'Racontez votre premier souvenir lié à des jumeaux, que vous en soyez un ou non.',
    questions: [
      {
        id: 'q1',
        number: '01',
        title: 'Le premier souvenir',
        question: 'Racontez votre premier souvenir lié à des jumeaux, que vous en soyez un ou non.',
      },
      {
        id: 'q2',
        number: '02',
        title: "L'arrivée",
        question:
          "Racontez comment l'arrivée de jumeaux a été accueillie autour de vous, et ce qui vous en est resté.",
      },
      {
        id: 'q3',
        number: '03',
        title: 'Le lien',
        question:
          "Racontez un moment où le lien entre deux jumeaux vous a montré ce que veut dire être proche de quelqu'un.",
      },
      {
        id: 'q4',
        number: '04',
        title: "Ce qu'on transmet",
        question:
          "Racontez ce que l'on vous a transmis sur la place des jumeaux, et ce que vous voudriez transmettre à votre tour.",
      },
    ],
    commandite: false,
    accesOuvert: true,
    posterUrl: encodeURI('/Posters/Focus/Hoxo\u0300.png?v=2'),
    videos: [
      {
        id: 'focus-hoxo-1',
        focusId: 'hoxo',
        authorName: 'Mawuna Houénou',
        authorAvatar: '/assets/duos/mawuna-medium.jpg',
        protagonistId: 'mawuna-houenou',
        questionNumber: '01',
        questionTitle: 'Le premier souvenir',
        question: 'Racontez votre premier souvenir lié à des jumeaux, que vous en soyez un ou non.',
        durationFormatted: '2:35',
        posterUrl: '/assets/duos/mawuna-medium.jpg',
        videoUrl: '/sample.mp4',
      },
      {
        id: 'focus-hoxo-2',
        focusId: 'hoxo',
        authorName: 'Mahougnon Zounon',
        authorAvatar: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
        protagonistId: 'mahougnon-zounon',
        questionNumber: '04',
        questionTitle: "Ce qu'on transmet",
        question:
          "Racontez ce que l'on vous a transmis sur la place des jumeaux, et ce que vous voudriez transmettre à votre tour.",
        durationFormatted: '2:19',
        posterUrl: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
        videoUrl: '/sample.mp4',
      },
    ],
  },
  {
    id: 'diasporas',
    type: 'theme',
    titre: 'Black To Roots',
    synopsis:
      "On part pour étudier, travailler, fuir, aimer, ou simplement voir plus loin. Black To Roots recueille les histoires de celles et ceux qui vivent loin de l'endroit où ils sont nés, de ceux qui sont partis et de ceux qui sont restés, de ceux qui reviennent et de ceux qui attendent. Béninois de l'étranger ou personnes d'autres pays : chacun raconte ce que signifie d'être d'ici et de là-bas.",
    consigne:
      'Respectez les personnes dont vous parlez. Racontez votre expérience, sans généraliser sur un pays ou un peuple.',
    question: 'Racontez un départ qui a changé votre vie.',
    questions: [
      {
        id: 'q1',
        number: '01',
        title: 'Un départ',
        question: 'Racontez un départ qui a changé votre vie.',
      },
      {
        id: 'q2',
        number: '02',
        title: 'Étranger',
        question:
          'Racontez la première fois où vous vous êtes senti étranger, et ce que vous avez fait de ce sentiment.',
      },
      {
        id: 'q3',
        number: '03',
        title: "Ce qu'on garde",
        question:
          'Racontez ce que vous avez gardé de chez vous (un plat, une langue, une habitude), et pourquoi.',
      },
      {
        id: 'q4',
        number: '04',
        title: 'Le retour',
        question: 'Racontez un retour, ou un retour que vous attendez encore.',
      },
    ],
    commandite: false,
    accesOuvert: true,
    posterUrl: encodeURI('/Posters/Focus/Diasporas.png?v=2'),
    videos: [
      {
        id: 'focus-diasporas-1',
        focusId: 'diasporas',
        authorName: 'Fatou Diallo',
        authorAvatar: '/assets/duos/fatou-diallo.jpg',
        protagonistId: 'fatou-diallo',
        questionNumber: '01',
        questionTitle: 'Un départ',
        question: 'Racontez un départ qui a changé votre vie.',
        durationFormatted: '2:28',
        posterUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: '/sample.mp4',
      },
      {
        id: 'focus-diasporas-2',
        focusId: 'diasporas',
        authorName: 'Tobi Ganvié',
        authorAvatar: '/assets/duos/tobi-ganvie.jpg',
        protagonistId: 'tobi-ganvie',
        questionNumber: '04',
        questionTitle: 'Le retour',
        question: 'Racontez un retour, ou un retour que vous attendez encore.',
        durationFormatted: '2:05',
        posterUrl: '/assets/duos/tobi-ganvie.jpg',
        videoUrl: '/sample.mp4',
      },
    ],
  },
  {
    id: 'artistes',
    type: 'theme',
    titre: 'Artistes',
    synopsis:
      "Artistes accueille celles et ceux qui créent (musiciens, comédiens, danseurs, peintres, sculpteurs, écrivains, cinéastes) et celles et ceux qui admirent un artiste ou une œuvre et veulent la faire connaître. Chacun raconte une œuvre ou un artiste qui compte pour lui. Il n'est pas nécessaire d'être artiste pour y entrer.",
    consigne:
      "N'utilisez aucun extrait de musique, de film ou d'œuvre protégée sans autorisation.",
    question:
      'Racontez une œuvre (chanson, film, tableau, spectacle, livre) qui vous a marqué, et ce qu’elle a changé en vous.',
    questions: [
      {
        id: 'q1',
        number: '01',
        title: "L'œuvre qui m'a marqué",
        question:
          'Racontez une œuvre (chanson, film, tableau, spectacle, livre) qui vous a marqué, et ce qu’elle a changé en vous.',
      },
      {
        id: 'q2',
        number: '02',
        title: "Ce que j'ai créé",
        question:
          'Racontez quelque chose que vous avez créé, même petit, dont vous êtes fier, et ce qui vous a poussé à le faire.',
      },
      {
        id: 'q3',
        number: '03',
        title: 'Le premier regard',
        question:
          "Racontez la première fois où vous avez montré ce que vous aviez fait à quelqu'un, et ce qu'il a dit ou n'a pas dit.",
      },
      {
        id: 'q4',
        number: '04',
        title: 'Faire connaître',
        question:
          'Racontez un artiste ou une œuvre que vous voudriez que tout le monde découvre, et pourquoi.',
      },
    ],
    commandite: false,
    accesOuvert: true,
    posterUrl: encodeURI('/Posters/Focus/Artistes.png?v=2'),
    videos: [
      {
        id: 'focus-artistes-1',
        focusId: 'artistes',
        authorName: 'Chancelle Agbo',
        authorAvatar: '/assets/duos/photographer-focus.jpg',
        protagonistId: 'chancelle-agbo',
        questionNumber: '01',
        questionTitle: "L'œuvre qui m'a marqué",
        question:
          'Racontez une œuvre (chanson, film, tableau, spectacle, livre) qui vous a marqué, et ce qu’elle a changé en vous.',
        durationFormatted: '2:48',
        posterUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: '/sample.mp4',
      },
      {
        id: 'focus-artistes-2',
        focusId: 'artistes',
        authorName: 'Mireille Akplogan',
        authorAvatar: '/assets/duos/care-mireille.jpg',
        protagonistId: 'mireille-akplogan',
        questionNumber: '04',
        questionTitle: 'Faire connaître',
        question:
          'Racontez un artiste ou une œuvre que vous voudriez que tout le monde découvre, et pourquoi.',
        durationFormatted: '2:16',
        posterUrl: '/assets/duos/care-mireille.jpg',
        videoUrl: '/sample.mp4',
      },
    ],
  },
];
