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
      "Le vrai luxe ne se mesure pas au prix. Il se mesure au temps, à la main, à l'exigence. De l'artisanat d'art à la couture, du bijou au tissage, de l'hôtellerie à la maison de création : ceux qui font, portent ou admirent la rareté et la perfection ont chacun un geste, un objet, une rencontre à raconter. Un point de couture, un éclat d'or : tout peut en dire long.",
    consigne: 'Racontez ce que vous avez vécu ou vu, sans promouvoir un produit.',
    question:
      'Racontez la plus belle chose que vous connaissiez qui ait demandé des années, que vous l\'ayez faite, reçue ou admirée, et ce que ce temps lui a donné.',
    questions: [
      {
        id: 'q1',
        number: '01',
        title: 'Prix du temps',
        question:
          "Racontez la plus belle chose que vous connaissiez qui ait demandé des années, que vous l'ayez faite, reçue ou admirée, et ce que ce temps lui a donné.",
      },
      {
        id: 'q2',
        number: '02',
        title: 'Je le garde',
        question:
          "Racontez l'objet que vous gardez depuis des années et que vous ne donneriez à personne, et l'histoire qu'il porte.",
      },
      {
        id: 'q3',
        number: '03',
        title: 'Exigence',
        question:
          'Racontez la personne qui vous a appris à ne pas vous contenter du « presque », et ce que vous lui devez encore.',
      },
      {
        id: 'q4',
        number: '04',
        title: 'Beauté rare',
        question:
          'Racontez le jour où vous avez vu quelque chose de si beau ou de si bien fait que les mots vous ont manqué.',
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
        questionTitle: 'Prix du temps',
        question:
          "Racontez la plus belle chose que vous connaissiez qui ait demandé des années, que vous l'ayez faite, reçue ou admirée, et ce que ce temps lui a donné.",
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
        questionTitle: 'Je le garde',
        question:
          "Racontez l'objet que vous gardez depuis des années et que vous ne donneriez à personne, et l'histoire qu'il porte.",
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
      "Un ancien sage l'aurait dit : ce que l'on dit compte plus que ce que l'on mange. Autour des tables, dans les cuisines, les restaurants, les marchés, ce sont les paroles qui restent. Cuisiniers, serveurs, propriétaires, clients, fournisseurs, agriculteurs, pêcheurs : chacun a l'histoire d'un plat, d'un lieu, d'un repas partagé. Une phrase entendue à table peut durer toute une vie.",
    consigne: "L'histoire d'abord : ne faites pas la publicité d'un établissement.",
    question:
      "Racontez le plat que quelqu'un préparait pour vous, et que vous ne retrouvez plus tout à fait.",
    questions: [
      {
        id: 'q1',
        number: '01',
        title: "Plat d'avant",
        question:
          "Racontez le plat que quelqu'un préparait pour vous, et que vous ne retrouvez plus tout à fait.",
      },
      {
        id: 'q2',
        number: '02',
        title: 'Parole à table',
        question:
          "Racontez une parole entendue à table que vous n'avez jamais oubliée.",
      },
      {
        id: 'q3',
        number: '03',
        title: 'Invisibles',
        question:
          "Racontez une personne qui a cultivé, pêché, cuisiné ou servi, et dont personne autour de la table ne connaît l'histoire.",
      },
      {
        id: 'q4',
        number: '04',
        title: 'Table partagée',
        question:
          'Racontez un repas partagé qui a changé quelque chose entre vous et une autre personne : une réconciliation, un adieu, un début.',
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
        questionTitle: "Plat d'avant",
        question:
          "Racontez le plat que quelqu'un préparait pour vous, et que vous ne retrouvez plus tout à fait.",
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
        questionTitle: 'Invisibles',
        question:
          "Racontez une personne qui a cultivé, pêché, cuisiné ou servi, et dont personne autour de la table ne connaît l'histoire.",
        durationFormatted: '2:32',
        posterUrl: '/assets/duos/tobi-houndegla.jpg',
        videoUrl: '/sample.mp4',
      },
    ],
  },
  {
    id: 'pour-rire',
    type: 'theme',
    titre: 'Fou rire',
    synopsis:
      "Le pire moment. Le plus grand sérieux. Et soudain, impossible de s'arrêter. Un fou rire, une gaffe, un malentendu, une rencontre absurde : tout le monde a vécu une scène dont on rit encore des années plus tard. Ces anecdotes vraiment vécues font rire à chaque fois, ceux qui les ont vécues comme ceux qui les écoutent. On y rit d'abord de soi, et on y rit ensemble.",
    consigne:
      "Anecdotes réellement vécues. Pas de moquerie visant une ethnie, une religion, un handicap ou une personne que l'on pourrait reconnaître : on rit d'abord de soi.",
    question: "Racontez un fou rire que vous n'avez pas pu arrêter, au pire moment possible.",
    questions: [
      {
        id: 'q1',
        number: '01',
        title: 'Pire moment',
        question: "Racontez un fou rire que vous n'avez pas pu arrêter, au pire moment possible.",
      },
      {
        id: 'q2',
        number: '02',
        title: 'Gaffe',
        question:
          "Racontez une maladresse qui vous a fait mourir de honte, et dont vous riez aujourd'hui.",
      },
      {
        id: 'q3',
        number: '03',
        title: 'Notre blague',
        question:
          "Racontez la blague, le mot ou le souvenir qui vous fait rire depuis des années avec quelqu'un, et que personne d'autre ne comprend.",
      },
      {
        id: 'q4',
        number: '04',
        title: 'Rire malgré tout',
        question:
          "Racontez le jour où quelqu'un vous a fait rire alors que vous n'en aviez aucune envie.",
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
        questionTitle: 'Pire moment',
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
        questionTitle: 'Notre blague',
        question:
          "Racontez la blague, le mot ou le souvenir qui vous fait rire depuis des années avec quelqu'un, et que personne d'autre ne comprend.",
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
      "Un CV dit ce que l'on a fait. Une histoire dit qui l'on est. À vingt ans comme à cinquante, en quête d'un emploi, d'un stage, d'une reconversion ou d'un premier client, chacun peut dire ce qu'il sait faire autrement que par une liste. Un parcours ne tient jamais sur une page. Et ceux qui recrutent y entendent enfin une personne, une voix, une manière d'être.",
    consigne:
      "Racontez ce que vous savez faire. Chaque personne décide seule si elle peut être contactée ; rien n'est exposé par défaut.",
    question:
      'Racontez ce que vous avez fait de mieux, payé ou non, sans que personne ne le remarque.',
    questions: [
      {
        id: 'q1',
        number: '01',
        title: 'Fier en silence',
        question:
          'Racontez ce que vous avez fait de mieux, payé ou non, sans que personne ne le remarque.',
      },
      {
        id: 'q2',
        number: '02',
        title: 'Porte fermée',
        question:
          'Racontez la fois où l\'on vous a dit non (un refus, un échec, une porte fermée), et ce que vous en avez fait.',
      },
      {
        id: 'q3',
        number: '03',
        title: 'Travail rêvé',
        question:
          "Racontez le travail dont vous rêvez, et ce que vous voudriez qu'il change, pour vous ou pour les autres.",
      },
      {
        id: 'q4',
        number: '04',
        title: 'Service rendu',
        question:
          "Racontez la fois où ce que vous savez faire, même simple, a vraiment aidé quelqu'un, et ce que vous avez vu sur son visage.",
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
          'Racontez ce que vous avez fait de mieux, payé ou non, sans que personne ne le remarque.',
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
        questionTitle: 'Travail rêvé',
        question:
          "Racontez le travail dont vous rêvez, et ce que vous voudriez qu'il change, pour vous ou pour les autres.",
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
      "Un avocat plaide pour les autres. Aujourd'hui, il plaide pour lui-même. Avocats, juristes, et toutes celles et tous ceux qui ont une cause à défendre racontent leur propre histoire comme une plaidoirie : des arguments, des preuves, une conclusion. Devant eux, des juges qui écoutent. Chacun parle avec ses mots, comme s'il en allait de son honneur.",
    consigne:
      "Ne parlez d'aucun dossier de client ni d'aucun détail qui le ferait reconnaître. Ne vous accusez d'aucune infraction pénale et ne mettez en cause aucune personne identifiable.",
    question:
      'Racontez une injustice dont vous avez été victime ou témoin, comme si vous la plaidiez devant un juge.',
    questions: [
      {
        id: 'q1',
        number: '01',
        title: 'Injustice',
        question:
          'Racontez une injustice dont vous avez été victime ou témoin, comme si vous la plaidiez devant un juge.',
      },
      {
        id: 'q2',
        number: '02',
        title: 'Plaider coupable',
        question:
          "Racontez une faute ordinaire que vous avez commise, et plaidez-la : ce qui l'explique, sans l'excuser.",
      },
      {
        id: 'q3',
        number: '03',
        title: 'Cause perdue',
        question:
          "Racontez la cause que vous avez défendue, ou voulu défendre, alors que tout semblait perdu d'avance, et ce qui vous a fait tenir.",
      },
      {
        id: 'q4',
        number: '04',
        title: 'Dernier mot',
        question:
          'Racontez ce que vous voudriez que l\'on retienne de votre vie, comme si vous veniez de terminer votre plaidoirie.',
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
        questionTitle: 'Injustice',
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
          "Racontez une faute ordinaire que vous avez commise, et plaidez-la : ce qui l'explique, sans l'excuser.",
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
      "Au Bénin, les jumeaux, les Hoxò, ont une place à part. On les dit porteurs de bon augure, on les honore, on leur consacre des cérémonies. Jumeaux et jumelles, parents, proches, dignitaires, artistes, témoins : chacun garde un souvenir, une attente, une histoire de ces enfants venus par deux, et de la place que tout un entourage leur fait. Une tradition vivante, faite de noms et de souvenirs.",
    consigne:
      'Récits de vie uniquement : ne filmez pas de rituel. Parlez des autres avec respect.',
    question: 'Racontez votre premier souvenir lié à des jumeaux, que vous en soyez un ou non.',
    questions: [
      {
        id: 'q1',
        number: '01',
        title: 'Premier souvenir',
        question: 'Racontez votre premier souvenir lié à des jumeaux, que vous en soyez un ou non.',
      },
      {
        id: 'q2',
        number: '02',
        title: 'Arrivée',
        question:
          "Racontez comment l'arrivée de jumeaux a été accueillie autour de vous, et ce qui vous en est resté.",
      },
      {
        id: 'q3',
        number: '03',
        title: 'Lien',
        question:
          "Racontez un moment où le lien entre deux jumeaux vous a montré ce que veut dire être proche de quelqu'un.",
      },
      {
        id: 'q4',
        number: '04',
        title: 'Transmission',
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
        questionTitle: 'Premier souvenir',
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
        questionTitle: 'Transmission',
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
      "Les racines ne sont pas toujours là où l'on est né. Certains sont nés en Afrique et pensent au retour. D'autres ont grandi aux Caraïbes, aux États-Unis, au Brésil ou en Europe, liés à une terre qu'ils n'ont parfois jamais vue. Ceux qui sont partis, ceux qui sont restés, ceux qui reviennent, ceux qui attendent : chacun définit ses racines et les fait vivre là où il est. Chacun porte une origine.",
    consigne:
      'Chacun définit ses propres racines : ne jugez pas celles des autres. Racontez votre expérience, sans généraliser sur un pays ou un peuple.',
    question:
      "Racontez le moment où vous avez compris d'où vous veniez vraiment, et ce que cela a changé en vous.",
    questions: [
      {
        id: 'q1',
        number: '01',
        title: "J'ai compris",
        question:
          "Racontez le moment où vous avez compris d'où vous veniez vraiment, et ce que cela a changé en vous.",
      },
      {
        id: 'q2',
        number: '02',
        title: 'Héritage',
        question:
          'Racontez ce qui vous a été transmis de vos origines (un plat, une langue, un nom, une habitude, un silence), et ce que cela représente pour vous.',
      },
      {
        id: 'q3',
        number: '03',
        title: "D'où venez-vous ?",
        question:
          "Racontez le jour où l'on vous a demandé « d'où venez-vous ? » et où vous n'avez pas su quoi répondre.",
      },
      {
        id: 'q4',
        number: '04',
        title: 'Renouer',
        question:
          'Racontez ce que vous faites, ou voudriez faire, pour garder vivantes vos racines, en y retournant ou là où vous êtes.',
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
        questionTitle: "J'ai compris",
        question:
          "Racontez le moment où vous avez compris d'où vous veniez vraiment, et ce que cela a changé en vous.",
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
        questionTitle: 'Renouer',
        question:
          'Racontez ce que vous faites, ou voudriez faire, pour garder vivantes vos racines, en y retournant ou là où vous êtes.',
        durationFormatted: '2:05',
        posterUrl: '/assets/duos/tobi-ganvie.jpg',
        videoUrl: '/sample.mp4',
      },
    ],
  },
  {
    id: 'artistes',
    type: 'theme',
    titre: 'Hall des arts',
    synopsis:
      "Un hall, c'est l'endroit où l'on entre, où l'on s'arrête, où l'on regarde. Musiciens, comédiens, danseurs, peintres, sculpteurs, écrivains, cinéastes y croisent celles et ceux qui admirent un artiste ou une œuvre et veulent la faire connaître. Chacun apporte une œuvre ou un artiste qui compte pour lui. Tout commence par ce qui nous a touchés. Nul besoin d'être artiste pour entrer.",
    consigne:
      "N'utilisez aucun extrait de musique, de film ou d'œuvre protégée sans autorisation.",
    question:
      "Racontez l'œuvre (chanson, film, tableau, spectacle, livre) qui a changé quelque chose en vous, et où vous étiez ce jour-là.",
    questions: [
      {
        id: 'q1',
        number: '01',
        title: 'Œuvre marquante',
        question:
          "Racontez l'œuvre (chanson, film, tableau, spectacle, livre) qui a changé quelque chose en vous, et où vous étiez ce jour-là.",
      },
      {
        id: 'q2',
        number: '02',
        title: 'Création',
        question:
          'Racontez ce que vous avez créé, même petit, et ce qui vous a poussé à le faire alors que personne ne vous le demandait.',
      },
      {
        id: 'q3',
        number: '03',
        title: 'Premier regard',
        question:
          "Racontez la première fois où vous avez montré ce que vous aviez fait à quelqu'un, et ce que cette personne a dit ou n'a pas dit.",
      },
      {
        id: 'q4',
        number: '04',
        title: "Que personne n'oublie",
        question:
          "Racontez un artiste ou une œuvre que vous voudriez que le monde n'oublie jamais, et pourquoi.",
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
        questionTitle: 'Œuvre marquante',
        question:
          "Racontez l'œuvre (chanson, film, tableau, spectacle, livre) qui a changé quelque chose en vous, et où vous étiez ce jour-là.",
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
        questionTitle: "Que personne n'oublie",
        question:
          "Racontez un artiste ou une œuvre que vous voudriez que le monde n'oublie jamais, et pourquoi.",
        durationFormatted: '2:16',
        posterUrl: '/assets/duos/care-mireille.jpg',
        videoUrl: '/sample.mp4',
      },
    ],
  },
];
