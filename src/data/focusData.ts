export type FocusType = 'organisation' | 'theme' | 'personnalite';

export interface FocusVideoItem {
  id: string;
  focusId: string;
  authorName: string;
  authorAvatar: string;
  protagonistId?: string;
  role?: string;
  durationFormatted: string;
  posterUrl: string;
  videoUrl: string;
}

export interface FocusItem {
  id: string;
  type: FocusType;
  titre: string;
  synopsis: string;
  question: string;
  roles?: string[];
  commandite: boolean;
  posterUrl: string;
  videos: FocusVideoItem[];
}

export const FOCUS_DATA: FocusItem[] = [
  {
    id: 'chercher-sa-place',
    type: 'theme',
    titre: 'Chercher sa place',
    synopsis:
      "On cherche tous où poser ses pas : un métier qui nous ressemble, une ville où l'on respire, un geste dont on est fier. Des personnes d'horizons différents racontent ce qu'elles savent faire et ce qu'elles essaient de bâtir.",
    question: 'Racontez ce que vous savez faire, et ce que vous cherchez à bâtir.',
    commandite: false,
    posterUrl: '/assets/images/studio_soi_parcours_1792608978314.jpg',
    videos: [
      {
        id: 'focus-place-1',
        focusId: 'chercher-sa-place',
        authorName: 'Koffi Mensah',
        authorAvatar: '/assets/duos/chef-koffi.jpg',
        protagonistId: 'koffi-mensah',
        durationFormatted: '2:14',
        posterUrl: '/assets/duos/chef-koffi.jpg',
        videoUrl: '/sample.mp4',
      },
      {
        id: 'focus-place-2',
        focusId: 'chercher-sa-place',
        authorName: 'Sénan Agossa',
        authorAvatar: '/assets/images/senan_innovatrice_1792933679487.jpg',
        protagonistId: 'senan-agossa',
        durationFormatted: '1:58',
        posterUrl: '/assets/images/senan_innovatrice_1792933679487.jpg',
        videoUrl: '/sample.mp4',
      },
      {
        id: 'focus-place-3',
        focusId: 'chercher-sa-place',
        authorName: 'Tobi Houndégla',
        authorAvatar: '/assets/duos/tobi-houndegla.jpg',
        protagonistId: 'tobi-houndegla',
        durationFormatted: '2:32',
        posterUrl: '/assets/duos/tobi-houndegla.jpg',
        videoUrl: '/sample.mp4',
      },
    ],
  },
  {
    id: 'l-amour',
    type: 'theme',
    titre: "L'amour",
    synopsis:
      "L'amour déplace des habitudes, des certitudes et parfois des vies entières. Qu'il soit familial, amical ou amoureux, chacun garde en mémoire un instant précis où tout s'est éclairé autrement.",
    question: "Racontez un moment où l'amour a changé quelque chose dans votre vie.",
    commandite: false,
    posterUrl: '/assets/images/sagesses_pardon_1792083785141.jpg',
    videos: [
      {
        id: 'focus-amour-1',
        focusId: 'l-amour',
        authorName: 'Mireille Akplogan',
        authorAvatar: '/assets/duos/care-mireille.jpg',
        protagonistId: 'mireille-akplogan',
        durationFormatted: '2:26',
        posterUrl: '/assets/duos/care-mireille.jpg',
        videoUrl: '/sample.mp4',
      },
      {
        id: 'focus-amour-2',
        focusId: 'l-amour',
        authorName: 'Awa Ndiaye',
        authorAvatar: '/assets/duos/horizons-awa.jpg',
        protagonistId: 'awa-ndiaye',
        durationFormatted: '2:05',
        posterUrl: '/assets/duos/horizons-awa.jpg',
        videoUrl: '/sample.mp4',
      },
      {
        id: 'focus-amour-3',
        focusId: 'l-amour',
        authorName: 'Armel Hounkpatin',
        authorAvatar: '/assets/duos/paroles-armel.jpg',
        protagonistId: 'armel-hounkpatin',
        durationFormatted: '2:41',
        posterUrl: '/assets/duos/paroles-armel.jpg',
        videoUrl: '/sample.mp4',
      },
    ],
  },
  {
    id: 'atelier-demo',
    type: 'organisation',
    titre: 'Atelier Démo',
    synopsis:
      "Un atelier fictif de création et de savoir-faire partagé. Ceux qui y travaillent, ceux qui y passent et ceux qui l'accompagnent racontent ce qui rend ce lieu vivant au quotidien.",
    question: "Racontez un moment qui montre ce qu'est l'Atelier Démo pour vous.",
    roles: ['employé', 'client', 'partenaire'],
    commandite: false,
    posterUrl: '/assets/images/expertises_artisanat_1792085293909.jpg',
    videos: [
      {
        id: 'focus-atelier-1',
        focusId: 'atelier-demo',
        authorName: 'Sika Dossou',
        authorAvatar: '/assets/images/sika_tisserande_1792933605542.jpg',
        protagonistId: 'sika-dossou',
        role: 'employé',
        durationFormatted: '2:18',
        posterUrl: '/assets/images/sika_tisserande_1792933605542.jpg',
        videoUrl: '/sample.mp4',
      },
      {
        id: 'focus-atelier-2',
        focusId: 'atelier-demo',
        authorName: 'Kpèdétin Houndégla',
        authorAvatar: '/assets/images/kpedetin_joailliere_1792933718361.jpg',
        protagonistId: 'kpedetin-houndegla',
        role: 'client',
        durationFormatted: '1:54',
        posterUrl: '/assets/images/kpedetin_joailliere_1792933718361.jpg',
        videoUrl: '/sample.mp4',
      },
      {
        id: 'focus-atelier-3',
        focusId: 'atelier-demo',
        authorName: 'Fatou Diallo',
        authorAvatar: '/assets/duos/fatou-diallo.jpg',
        protagonistId: 'fatou-diallo',
        role: 'partenaire',
        durationFormatted: '2:10',
        posterUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: '/sample.mp4',
      },
    ],
  },
  {
    id: 'une-voix-un-parcours',
    type: 'personnalite',
    titre: 'Une voix, un parcours',
    synopsis:
      "Certaines rencontres ou certaines voix laissent une trace durable sur tout un entourage. Des témoins racontent comment une personne fictive, par son exemple ou sa parole, a ouvert un chemin dans leur vie.",
    question: 'Racontez ce que cette personne a changé pour vous.',
    roles: ['admirateur', 'collègue', 'ancien élève'],
    commandite: false,
    posterUrl: '/assets/images/orga_transm_afro_1792611469008.jpg',
    videos: [
      {
        id: 'focus-voix-1',
        focusId: 'une-voix-un-parcours',
        authorName: 'Chancelle Agbo',
        authorAvatar: '/assets/duos/photographer-focus.jpg',
        protagonistId: 'chancelle-agbo',
        role: 'admirateur',
        durationFormatted: '2:35',
        posterUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: '/sample.mp4',
      },
      {
        id: 'focus-voix-2',
        focusId: 'une-voix-un-parcours',
        authorName: 'Malik Diop',
        authorAvatar: '/assets/duos/malik-diop.jpg',
        protagonistId: 'malik-diop',
        role: 'collègue',
        durationFormatted: '2:12',
        posterUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: '/sample.mp4',
      },
      {
        id: 'focus-voix-3',
        focusId: 'une-voix-un-parcours',
        authorName: 'Nadège Zinsou',
        authorAvatar: '/assets/duos/researcher-phd.jpg',
        protagonistId: 'nadege-zinsou',
        role: 'ancien élève',
        durationFormatted: '2:48',
        posterUrl: '/assets/duos/researcher-phd.jpg',
        videoUrl: '/sample.mp4',
      },
    ],
  },
];
