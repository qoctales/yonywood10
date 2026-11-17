export interface ThematicStory {
  id: string;
  themeId: string;
  themeLabel: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorTerritory: string;
  authorType?: 'person' | 'enterprise';
  storyTitle: string;
  question: string;
  videoUrl: string;
  durationSeconds: number;
  createdAt: string;
  duoId?: string;
  documentaryId?: string;
  partnerName?: string;
  partnerAvatar?: string;
  topicId?: string;
}

export interface ThematicValue {
  id: string;
  label: string;
  tagline: string;
  question: string;
  stories: ThematicStory[];
}

export const THEMATIC_VALUES: ThematicValue[] = [
  {
    id: 'courage',
    label: 'Courage',
    tagline: 'Avancer quand tout tremble',
    question: 'Quel est l’acte de courage le plus difficile que vous ayez posé ?',
    stories: [
      {
        id: 'story-cou-1',
        themeId: 'courage',
        themeLabel: 'Courage',
        authorId: 'malik-diop',
        authorName: 'Malik Diop',
        authorRole: 'Orateur & Bâtisseur',
        authorAvatar: '/assets/duos/malik-diop.jpg',
        authorTerritory: 'Dakar & Paris',
        authorType: 'person',
        storyTitle: 'Dire non pour rester fidèle',
        question: 'Dire non au contrat qui me demandait d’oublier d’où je venais.',
        videoUrl: '/sample.mp4',
        durationSeconds: 61,
        createdAt: 'Il y a 3h',
        duoId: 'duo-3',
        documentaryId: 'blacks-one-beyond-eve',
        partnerName: 'Éléonore Vance',
        partnerAvatar: '/assets/duos/eleonore-vance.jpg'
      },
      {
        id: 'story-cou-2',
        themeId: 'courage',
        themeLabel: 'Courage',
        authorId: 'c-1',
        authorName: 'Aura Tech',
        authorRole: 'Technologie & Énergie',
        authorAvatar: '/assets/images/marques_tech_1792086434196.jpg',
        authorTerritory: 'Cotonou, Bénin',
        authorType: 'enterprise',
        storyTitle: 'Oser concevoir nos propres microprocesseurs solaires',
        question: 'Refuser les dépendances matérielles et fabriquer localement.',
        videoUrl: '/sample.mp4',
        durationSeconds: 55,
        createdAt: 'Il y a 5h',
        duoId: 'c-duo-1',
        partnerName: 'Bio Solaire'
      }
    ]
  },
  {
    id: 'resilience',
    label: 'Résilience',
    tagline: 'Ce qui ne plie jamais sous la tempête',
    question: 'Quel revers a révélé votre plus grande force intérieure ?',
    stories: [
      {
        id: 'story-res-1',
        themeId: 'resilience',
        themeLabel: 'Résilience',
        authorId: 'codjo-blind',
        authorName: 'Pascal Cossy',
        authorRole: 'Prêtre Fâ & Guide',
        authorAvatar: '/assets/duos/codjo-blind.jpg',
        authorTerritory: 'Abomey, Bénin',
        authorType: 'person',
        storyTitle: 'La clarté au cœur de la nuit',
        question: 'Comment la perte de la vue est devenue mon regard le plus clair.',
        videoUrl: '/sample.mp4',
        durationSeconds: 58,
        createdAt: 'Il y a 2h',
        duoId: 'duo-5',
        documentaryId: 'baobab-bambou',
        partnerName: 'Tobi Houndégla',
        partnerAvatar: '/assets/duos/tobi-houndegla.jpg'
      },
      {
        id: 'story-res-2',
        themeId: 'resilience',
        themeLabel: 'Résilience',
        authorId: 'sika-dossou',
        authorName: 'Sika Dossou',
        authorRole: 'Maître Tisserande',
        authorAvatar: '/assets/images/sika_tisserande_1792933605542.jpg',
        authorTerritory: 'Bohicon, Bénin',
        authorType: 'person',
        storyTitle: 'Reconstruire après les cendres',
        question: 'Quand mon atelier a brûlé, mes mains savaient encore.',
        videoUrl: '/sample.mp4',
        durationSeconds: 62,
        createdAt: 'Il y a 5h',
        duoId: 'duo-4',
        documentaryId: 'roots-routes',
        partnerName: 'Fatou Diallo',
        partnerAvatar: '/assets/duos/fatou-diallo.jpg'
      }
    ]
  },
  {
    id: 'perseverance',
    label: 'Persévérance',
    tagline: 'L’arbre mûrit sans bruit',
    question: 'Qu’avez-vous attendu des années avant de voir éclore ?',
    stories: [
      {
        id: 'story-per-1',
        themeId: 'perseverance',
        themeLabel: 'Persévérance',
        authorId: 'koffi-tisserand',
        authorName: 'Koffi Mensah',
        authorRole: 'Maître Tisseur',
        authorAvatar: '/assets/images/koffi_portonovo_1792933660999.jpg',
        authorTerritory: 'Porto-Novo, Bénin',
        authorType: 'person',
        storyTitle: 'Sept ans pour un seul motif',
        question: 'Le premier motif parfait a pris 7 ans d’échecs.',
        videoUrl: '/sample.mp4',
        durationSeconds: 54,
        createdAt: 'Il y a 6h',
        duoId: 'duo-2',
        documentaryId: 'roots-routes',
        partnerName: 'Sayri Quispe',
        partnerAvatar: '/assets/duos/sayri-quispe.jpg'
      },
      {
        id: 'story-per-2',
        themeId: 'perseverance',
        themeLabel: 'Persévérance',
        authorId: 'c-3',
        authorName: 'Kpèdétin Joaillerie',
        authorRole: 'Luxe & Métiers d’Art',
        authorAvatar: '/assets/images/marques_luxe_1792086431681.jpg',
        authorTerritory: 'Ouidah, Bénin',
        authorType: 'enterprise',
        storyTitle: 'Dix années pour forger un or éthique 100% traçable',
        question: 'L’exigence patiente face à l’illusion du gain immédiat.',
        videoUrl: '/sample.mp4',
        durationSeconds: 58,
        createdAt: 'Il y a 8h',
        duoId: 'c-duo-2',
        partnerName: 'Nectar Botanique'
      }
    ]
  },
  {
    id: 'transmission',
    label: 'Transmission',
    tagline: 'Le fil invisible des générations',
    question: 'Quelle parole ancestrale portez-vous comme un talisman ?',
    stories: [
      {
        id: 'story-tra-1',
        themeId: 'transmission',
        themeLabel: 'Transmission',
        authorId: 'sayri-quispe',
        authorName: 'Sayri Quispe',
        authorRole: 'Tisseur des Andes',
        authorAvatar: '/assets/duos/sayri-quispe.jpg',
        authorTerritory: 'Cuzco, Pérou',
        authorType: 'person',
        storyTitle: 'Le geste que ma grand-mère a transmis',
        question: 'Le geste que ma grand-mère a transmis à mes doigts.',
        videoUrl: '/sample.mp4',
        durationSeconds: 64,
        createdAt: 'Il y a 8h',
        duoId: 'duo-2',
        documentaryId: 'roots-routes',
        partnerName: 'Koffi Mensah',
        partnerAvatar: '/assets/images/koffi_portonovo_1792933660999.jpg'
      },
      {
        id: 'story-tra-2',
        themeId: 'transmission',
        themeLabel: 'Transmission',
        authorId: 'c-8',
        authorName: 'Kiki Passeur de Mémoire',
        authorRole: 'Patrimoine Immatériel',
        authorAvatar: '/assets/images/kiki_passeur_1792933820505.jpg',
        authorTerritory: 'Abomey, Bénin',
        authorType: 'enterprise',
        storyTitle: 'La bibliothèque vivante de nos récits',
        question: 'Enregistrer la voix des doyens avant que le vent ne l’emporte.',
        videoUrl: '/sample.mp4',
        durationSeconds: 60,
        createdAt: 'Il y a 9h',
        duoId: 'c-duo-4',
        partnerName: 'Sènami Architecture'
      }
    ]
  },
  {
    id: 'solidarite',
    label: 'Solidarité',
    tagline: 'Je suis parce que nous sommes',
    question: 'Quel geste d’entraide a sauvé votre communauté ou votre projet ?',
    stories: [
      {
        id: 'story-sol-1',
        themeId: 'solidarite',
        themeLabel: 'Solidarité',
        authorId: 'tobi-houndegla',
        authorName: 'Tobi Houndégla',
        authorRole: 'Pêcheur Toffinou',
        authorAvatar: '/assets/duos/tobi-houndegla.jpg',
        authorTerritory: 'Ganvié, Bénin',
        authorType: 'person',
        storyTitle: 'Le pacte des filets sur l’eau',
        question: 'Quand la lagune est rude, nul ne rentre au village sans partager sa prise.',
        videoUrl: '/sample.mp4',
        durationSeconds: 52,
        createdAt: 'Il y a 1h',
        duoId: 'duo-5',
        documentaryId: 'baobab-bambou',
        partnerName: 'Pascal Cossy',
        partnerAvatar: '/assets/duos/codjo-blind.jpg'
      },
      {
        id: 'story-sol-2',
        themeId: 'solidarite',
        themeLabel: 'Solidarité',
        authorId: 'c-2',
        authorName: 'Terroirs & Agro',
        authorRole: 'Agriculture Durable',
        authorAvatar: '/assets/images/fagnon_agronome_1792933698985.jpg',
        authorTerritory: 'Djougou, Bénin',
        authorType: 'enterprise',
        storyTitle: 'Le grenier coopératif paysan',
        question: 'Fédérer trois cents familles paysannes pour garantir les semences.',
        videoUrl: '/sample.mp4',
        durationSeconds: 56,
        createdAt: 'Il y a 4h',
        duoId: 'c-duo-3',
        partnerName: 'Dossou Logistique'
      }
    ]
  },
  {
    id: 'depassement',
    label: 'Dépassement de soi',
    tagline: 'Franchir la frontière de ses peurs',
    question: 'À quel moment avez-vous découvert que vous pouviez aller plus loin ?',
    stories: [
      {
        id: 'story-dep-1',
        themeId: 'depassement',
        themeLabel: 'Dépassement de soi',
        authorId: 'eleonore-vance',
        authorName: 'Éléonore Vance',
        authorRole: 'Oratrice & Souveraineté',
        authorAvatar: '/assets/duos/eleonore-vance.jpg',
        authorTerritory: 'Lomé & Montréal',
        authorType: 'person',
        storyTitle: 'Prendre la parole face à l’assemblée',
        question: 'Le jour où j’ai vaincu le tremblement pour porter la voix des sans-voix.',
        videoUrl: '/sample.mp4',
        durationSeconds: 60,
        createdAt: 'Il y a 5h',
        duoId: 'duo-3',
        documentaryId: 'blacks-one-beyond-eve',
        partnerName: 'Malik Diop',
        partnerAvatar: '/assets/duos/malik-diop.jpg'
      }
    ]
  },
  {
    id: 'espoir',
    label: 'Espoir',
    tagline: 'L’aube commence toujours avant le soleil',
    question: 'Quelle lueur vous a guidé dans les heures les plus sombres ?',
    stories: [
      {
        id: 'story-esp-1',
        themeId: 'espoir',
        themeLabel: 'Espoir',
        authorId: 'pere-matthieu',
        authorName: 'Dieudonné Dossou',
        authorRole: 'Prêtre & Théologien',
        authorAvatar: '/assets/duos/duo_pere_matthieu_1791655226601.jpg',
        authorTerritory: 'Cotonou, Bénin',
        authorType: 'person',
        storyTitle: 'La prière qui apaise la tourmente',
        question: 'Croire en la rédemption de l’homme quand tout semble brisé.',
        videoUrl: '/sample.mp4',
        durationSeconds: 59,
        createdAt: 'Il y a 7h',
        duoId: 'duo-1',
        documentaryId: 'vodun-rays-autre-foi',
        partnerName: 'Mahougnon Zounon',
        partnerAvatar: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg'
      },
      {
        id: 'story-esp-2',
        themeId: 'espoir',
        themeLabel: 'Espoir',
        authorId: 'c-4',
        authorName: 'Bio Solaire',
        authorRole: 'Énergie & Souveraineté',
        authorAvatar: '/assets/images/bio_solaire_1792933744556.jpg',
        authorTerritory: 'Parakou, Bénin',
        authorType: 'enterprise',
        storyTitle: 'Électrifier le premier dispensaire isolé',
        question: 'Voir la lumière s’allumer dans la maternité la plus reculée.',
        videoUrl: '/sample.mp4',
        durationSeconds: 57,
        createdAt: 'Il y a 10h',
        duoId: 'c-duo-1',
        partnerName: 'Aura Tech'
      }
    ]
  },
  {
    id: 'reconciliation',
    label: 'Réconciliation',
    tagline: 'Rebâtir les ponts entre les mémoires',
    question: 'Quel dialogue a permis de guérir une ancienne blessure ?',
    stories: [
      {
        id: 'story-rec-1',
        themeId: 'reconciliation',
        themeLabel: 'Réconciliation',
        authorId: 'mahougnon-zounon',
        authorName: 'Mahougnon Zounon',
        authorRole: 'Gardien Vodun Rays',
        authorAvatar: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
        authorTerritory: 'Ouidah, Bénin',
        authorType: 'person',
        storyTitle: 'Tendre la main par-delà les dogmes',
        question: 'S’asseoir avec le père Matthieu sous le même arbre à palabres.',
        videoUrl: '/sample.mp4',
        durationSeconds: 63,
        createdAt: 'Il y a 4h',
        duoId: 'duo-1',
        documentaryId: 'vodun-rays-autre-foi',
        partnerName: 'Dieudonné Dossou',
        partnerAvatar: '/assets/duos/duo_pere_matthieu_1791655226601.jpg'
      },
      {
        id: 'story-rec-2',
        themeId: 'reconciliation',
        themeLabel: 'Réconciliation',
        authorId: 'c-7',
        authorName: 'Sènami Architecture',
        authorRole: 'Architecture & Terre',
        authorAvatar: '/assets/images/senami_architecte_1792933801804.jpg',
        authorTerritory: 'Porto-Novo, Bénin',
        authorType: 'enterprise',
        storyTitle: 'Réconcilier le béton et la terre crue',
        question: 'Faire dialoguer l’ingénierie moderne et le bâti ancestral sans complexe.',
        videoUrl: '/sample.mp4',
        durationSeconds: 53,
        createdAt: 'Il y a 6h',
        duoId: 'c-duo-4',
        partnerName: 'Kiki Passeur de Mémoire'
      }
    ]
  }
];

// Liste aplatie de toutes les stories individuelles pour la navigation séquentielle
export const ALL_INDIVIDUAL_STORIES: ThematicStory[] = THEMATIC_VALUES.flatMap(t => t.stories);

// Stories filtrées par type (particuliers vs entreprises)
export const PERSON_STORIES: ThematicStory[] = ALL_INDIVIDUAL_STORIES.filter(s => s.authorType !== 'enterprise');
export const ENTERPRISE_STORIES: ThematicStory[] = ALL_INDIVIDUAL_STORIES.filter(s => s.authorType === 'enterprise');

// Stories représentatives des 8 thématiques officielles de la section Focus (mini-publicités / teasers d'invitation de 16 secondes)
export const FOCUS_THEMATIC_STORIES: ThematicStory[] = [
  {
    id: 'story-focus-dantokpa',
    themeId: 'topic-marche-dantokpa',
    topicId: 'topic-marche-dantokpa',
    themeLabel: 'Marché Dantokpa',
    authorId: 'sika-dossou',
    authorName: 'Maman Sika',
    authorRole: 'Commerçante de tissus Wax',
    authorAvatar: encodeURI('/assets/posters/Focus/Marche Dantokpa.png'),
    authorTerritory: 'Cotonou, Bénin',
    authorType: 'enterprise',
    storyTitle: 'Marché Dantokpa',
    question: "Quelle histoire, quelle rencontre ou quelle scène du marché Dantokpa raconteriez-vous pour faire comprendre à quelqu'un d'ailleurs ce qui rend ce lieu unique ?",
    videoUrl: '/sample.mp4',
    durationSeconds: 16,
    createdAt: 'À l’affiche'
  },
  {
    id: 'story-focus-bac',
    themeId: 'topic-baccalaureat',
    topicId: 'topic-baccalaureat',
    themeLabel: 'Baccalauréat',
    authorId: 'senan-agossa',
    authorName: 'Sénan Agossa',
    authorRole: 'Bachelière & Ingénieure',
    authorAvatar: encodeURI('/assets/posters/Focus/Baccalaureat.png'),
    authorTerritory: 'Cotonou, Bénin',
    authorType: 'enterprise',
    storyTitle: 'Baccalauréat',
    question: "Le jour où vous avez appris que vous étiez bachelier(ère), qu'est-ce que cela a représenté pour vous, pour votre famille, et quelle fierté en avez-vous tirée ?",
    videoUrl: '/sample.mp4',
    durationSeconds: 16,
    createdAt: 'À l’affiche'
  },
  {
    id: 'story-focus-lycees',
    themeId: 'topic-lycees-behanzin-toffa',
    topicId: 'topic-lycees-behanzin-toffa',
    themeLabel: 'Lycées Béhanzin et Toffa',
    authorId: 'helene-saint-amand',
    authorName: 'Anciens Béhanzin & Toffa',
    authorRole: 'Mémoire Lycéenne',
    authorAvatar: encodeURI('/assets/posters/Focus/Lycees Behanzin et Toffa.png'),
    authorTerritory: 'Porto-Novo, Bénin',
    authorType: 'enterprise',
    storyTitle: 'Lycées Béhanzin et Toffa',
    question: "Un souvenir du lycée Béhanzin ou du lycée Toffa vous fait encore sourire aujourd'hui : lequel raconteriez-vous à vos enfants ou à vos petits-enfants ?",
    videoUrl: '/sample.mp4',
    durationSeconds: 16,
    createdAt: 'À l’affiche'
  },
  {
    id: 'story-focus-apprentis',
    themeId: 'topic-apprentis',
    topicId: 'topic-apprentis',
    themeLabel: 'Apprentis',
    authorId: 'koffi-tisserand',
    authorName: 'Maître Koffi',
    authorRole: 'Maître Artisan Formateur',
    authorAvatar: encodeURI('/assets/posters/Focus/Apprentis.png'),
    authorTerritory: 'Abomey & Cotonou',
    authorType: 'enterprise',
    storyTitle: 'Apprentis',
    question: "De tout votre apprentissage, quelle histoire vous rend le plus fier, celle du moment où vous avez compris que vous aviez appris quelque chose pour la vie ?",
    videoUrl: '/sample.mp4',
    durationSeconds: 16,
    createdAt: 'À l’affiche'
  },
  {
    id: 'story-focus-sodabi',
    themeId: 'topic-sodabi',
    topicId: 'topic-sodabi',
    themeLabel: 'Sodabi',
    authorId: 'dah-zounon',
    authorName: 'Dah Zounon',
    authorRole: 'Producteur & Gardien des Rites',
    authorAvatar: encodeURI('/assets/posters/Focus/Sodabi.png'),
    authorTerritory: 'Tori-Bossito, Bénin',
    authorType: 'enterprise',
    storyTitle: 'Sodabi',
    question: "Pour faire comprendre à quelqu'un d'ailleurs ce que représente le sodabi pour les Béninois, quelle histoire choisiriez-vous (une fabrication, une cérémonie, une libation, un souvenir de famille) ?",
    videoUrl: '/sample.mp4',
    durationSeconds: 16,
    createdAt: 'À l’affiche'
  },
  {
    id: 'story-focus-ganvie',
    themeId: 'topic-ganvie',
    topicId: 'topic-ganvie',
    themeLabel: 'Ganvié',
    authorId: 'tobi-houndegla',
    authorName: 'Tobi Houndégla',
    authorRole: 'Maître Piroguier',
    authorAvatar: encodeURI('/assets/posters/Focus/Ganvie.png'),
    authorTerritory: 'Lac Nokoué, Bénin',
    authorType: 'enterprise',
    storyTitle: 'Ganvié',
    question: "Vivre sur l'eau, ça ne se devine pas quand on n'y est jamais allé : quelle histoire de Ganvié raconteriez-vous pour le faire comprendre ?",
    videoUrl: '/sample.mp4',
    durationSeconds: 16,
    createdAt: 'À l’affiche'
  },
  {
    id: 'story-focus-kidjo',
    themeId: 'topic-angelique-kidjo',
    topicId: 'topic-angelique-kidjo',
    themeLabel: 'Angélique Kidjo',
    authorId: 'angelique-kidjo',
    authorName: 'Angélique Kidjo',
    authorRole: 'Ambassadrice & Artiste',
    authorAvatar: encodeURI('/assets/posters/Focus/Angelique Kidjo.png'),
    authorTerritory: 'Ouidah & Le Monde',
    authorType: 'enterprise',
    storyTitle: 'Angélique Kidjo',
    question: "Une chanson, un concert, une rencontre, un mot d'elle : quel moment lié à Angélique Kidjo a changé quelque chose en vous, et qu'est-ce qu'il vous a donné ?",
    videoUrl: '/sample.mp4',
    durationSeconds: 16,
    createdAt: 'À l’affiche'
  },
  {
    id: 'story-focus-sagbohan',
    themeId: 'topic-danialou-sagbohan',
    topicId: 'topic-danialou-sagbohan',
    themeLabel: 'Danialou Sagbohan',
    authorId: 'danialou-sagbohan',
    authorName: 'Danialou Sagbohan',
    authorRole: 'L’Homme-Orchestre',
    authorAvatar: encodeURI('/assets/posters/Focus/Danialou Sagbohan.png'),
    authorTerritory: 'Porto-Novo, Bénin',
    authorType: 'enterprise',
    storyTitle: 'Danialou Sagbohan',
    question: "Quand vous pensez à Danialou Sagbohan, quel souvenir vous revient en premier, et en quoi a-t-il marqué votre vie ou celle de votre entourage ?",
    videoUrl: '/sample.mp4',
    durationSeconds: 16,
    createdAt: 'À l’affiche'
  }
];

