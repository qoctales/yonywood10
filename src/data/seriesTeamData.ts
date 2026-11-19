import {
  SeriesAuthor,
  SeriesScreenwriter,
  SeriesDirector,
  SeriesProducerUser,
  SeriesDistributor,
  SeriesSponsor,
  SequenceCredits
} from '../types';
import { resolveCanonicalSeriesId } from './legacySeriesIds';

export interface SeriesTeamBundle {
  author: SeriesAuthor;
  screenwriter: SeriesScreenwriter;
  director: SeriesDirector;
  producers: SeriesProducerUser[];
  distributors: SeriesDistributor[];
  sponsors: SeriesSponsor[];
}

export const ALL_SERIES_TEAMS: Record<string, SeriesTeamBundle> = {
  'remedes-e-vivi': {
    author: {
      name: 'Romeo Nonvide',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Fondateur & Concepteur documentaire de YonyWood',
      protagonistId: 'mireille-akplogan'
    },
    screenwriter: {
      name: 'Dre. Mireille Akplogan',
      avatarUrl: '/assets/duos/care-mireille.jpg',
      bio: 'Médecin urgentiste & chroniqueuse du soin au quotidien',
      protagonistId: 'mireille-akplogan'
    },
    director: {
      name: 'Koffi Mensah',
      avatarUrl: '/assets/duos/chef-koffi.jpg',
      bio: 'Artisan cuisinier & réalisateur de proximité',
      protagonistId: 'chef-koffi'
    },
    producers: [
      {
        id: 'prod-eleonore-8',
        name: 'Dre. Éléonore Kaboré',
        avatarUrl: '/assets/duos/researcher-phd.jpg',
        roleTitle: 'Productrice déléguée',
        pledgeAmount: 32000,
        joinedAt: '02 Janvier 2026',
        bio: 'Fondatrice de collectifs de valorisation des métiers du soin et du terroir.'
      }
    ],
    distributors: [
      {
        id: 'dist-nadege',
        name: 'Nadège Tèko',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        roleOrChannel: 'Réseaux Santé, Maraîchers & Marchés Vivants'
      }
    ],
    sponsors: []
  },

  'amin-amen-legba': {
    author: {
      name: 'Romeo Nonvide',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Fondateur & Concepteur documentaire de YonyWood',
      protagonistId: 'pere-matthieu'
    },
    screenwriter: {
      name: 'Dieudonné Dossou',
      avatarUrl: '/assets/duos/duo_pere_matthieu_1791655226601.jpg',
      bio: 'Chercheur en anthropologie des mémoires et traditions croisées',
      protagonistId: 'pere-matthieu'
    },
    director: {
      name: 'Alain Kpatoukpa',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      bio: 'Réalisateur & Directeur de la photographie 9:16'
    },
    producers: [
      {
        id: 'prod-jean-luc',
        name: 'Jean-Luc Agbo',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        roleTitle: 'Producteur délégué',
        pledgeAmount: 18500,
        joinedAt: '15 Janvier 2026',
        bio: 'Mécène culturel et entrepreneur engagé dans la préservation des récits sacrés.',
        videoPresentationUrl: '/sample.mp4',
        protagonistId: 'dah-zounon'
      },
      {
        id: 'prod-sonia',
        name: 'Sonia Dossou',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        roleTitle: 'Coproductrice associée',
        pledgeAmount: 9200,
        joinedAt: '03 Février 2026',
        bio: 'Productrice audiovisuelle et spécialiste des narrations immersives d\'Afrique de l\'Ouest.',
        videoPresentationUrl: '/sample.mp4'
      },
      {
        id: 'prod-malik',
        name: 'Malik Touré',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        roleTitle: 'Producteur citoyen',
        pledgeAmount: 3400,
        joinedAt: '22 Février 2026',
        bio: 'Contributeur de la diaspora finançant la coproduction citoyenne.',
        videoPresentationUrl: '/sample.mp4'
      },
      {
        id: 'prod-amina',
        name: 'Dr. Amina Diop',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        roleTitle: 'Productrice citoyenne',
        pledgeAmount: 2500,
        joinedAt: '08 Mars 2026',
        bio: 'Médecin et passionnée d\'archives orales vivantes.',
        videoPresentationUrl: '/sample.mp4'
      }
    ],
    distributors: [
      {
        id: 'dist-marcelle',
        name: 'Marcelle K.',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        roleOrChannel: 'Community Manager & Diffusion Afrique de l’Ouest'
      },
      {
        id: 'dist-ousmane',
        name: 'Ousmane B.',
        avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
        roleOrChannel: 'Ambassadeur Diaspora & Réseaux Documentaires'
      }
    ],
    sponsors: [
      {
        id: 'spons-memoires',
        companyName: 'Fondation Mémoires Vivantes',
        partnershipType: 'Mécénat de Conservation',
        logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=150&q=80',
        description: 'Soutien aux tournages patrimoniaux et à la numérisation des récits oraux.'
      },
      {
        id: 'spons-eco',
        companyName: 'Éco-Logistique Atlantique',
        partnershipType: 'Partenaire Mobilité Territoire',
        logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80',
        description: 'Logistique et déplacements techniques de l\'équipe de tournage.'
      }
    ]
  },

  'phd-azovi': {
    author: {
      name: 'Romeo Nonvide',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Fondateur & Concepteur documentaire de YonyWood',
      protagonistId: 'researcher-eleonore'
    },
    screenwriter: {
      name: 'Dre. Nadège Zinsou',
      avatarUrl: '/assets/duos/researcher-phd.jpg',
      bio: 'Docteure en sciences cognitives et chercheuse associée',
      protagonistId: 'researcher-eleonore'
    },
    director: {
      name: 'Lionel Degboe',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      bio: 'Cinéaste du geste technique et de la transmission'
    },
    producers: [
      {
        id: 'prod-mariama-6',
        name: 'Mariama Ba',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        roleTitle: 'Productrice déléguée',
        pledgeAmount: 11000,
        joinedAt: '25 Janvier 2026',
        bio: 'Porteuse de projets autour de l\'apprentissage et des savoirs universitaires.'
      }
    ],
    distributors: [
      {
        id: 'dist-nadege-3',
        name: 'Nadège Tèko',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        roleOrChannel: 'Réseaux Ateliers, Apprentissage & Universités'
      }
    ],
    sponsors: [
      {
        id: 'spons-savoirs',
        companyName: 'Ateliers & Laboratoires du Bénin',
        partnershipType: 'Partenaire Transmission',
        description: 'Valorisation des savoir-faire d’atelier et de la recherche fondamentale.'
      }
    ]
  },

  'blacks-one-nyonoukpo': {
    author: {
      name: 'Romeo Nonvide',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Fondateur & Concepteur documentaire de YonyWood',
      protagonistId: 'malik-diop'
    },
    screenwriter: {
      name: 'Prof. Théophile Dossou',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      bio: 'Généalogiste et historien des lignées afro-descendantes',
      protagonistId: 'malik-diop'
    },
    director: {
      name: 'Aïcha Benali',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      bio: 'Réalisatrice documentaire internationale',
      protagonistId: 'eleonore-vance'
    },
    producers: [
      {
        id: 'prod-amina-3',
        name: 'Dr. Amina Diop',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        roleTitle: 'Productrice déléguée',
        pledgeAmount: 22000,
        joinedAt: '10 Janvier 2026',
        bio: 'Chercheuse engagée pour la reconnaissance des identités et des femmes bâtisseuses.'
      },
      {
        id: 'prod-jean-luc-3',
        name: 'Jean-Luc Agbo',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        roleTitle: 'Producteur citoyen',
        pledgeAmount: 7000,
        joinedAt: '15 Février 2026',
        bio: 'Contributeur passionné d\'histoire et de généalogie.'
      }
    ],
    distributors: [
      {
        id: 'dist-david',
        name: 'David N\'Diaye',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        roleOrChannel: 'Diffusion Universités & Archives Mondiales'
      }
    ],
    sponsors: [
      {
        id: 'spons-racines',
        companyName: 'Institut des Racines Vivantes',
        partnershipType: 'Mécénat Historique',
        description: 'Soutien aux initiatives culturelles et citoyennes en Afrique et diaspora.'
      }
    ]
  },

  'fiat-luxe-irokos': {
    author: {
      name: 'Romeo Nonvide',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Fondateur & Concepteur documentaire de YonyWood',
      protagonistId: 'kpedetin-houndegla'
    },
    screenwriter: {
      name: 'Élodie Vignon',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: 'Critique d\'art et archiviste des savoir-faire d\'exception',
      protagonistId: 'kiki-alapini'
    },
    director: {
      name: 'Samuel Lawson',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      bio: 'Directeur photo & cadreur métiers d\'art et mémoire des aînés'
    },
    producers: [
      {
        id: 'prod-sonia-4',
        name: 'Sonia Dossou',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        roleTitle: 'Productrice déléguée',
        pledgeAmount: 16000,
        joinedAt: '12 Janvier 2026',
        bio: 'Productrice d\'émissions culturelles et de portraits d\'artisans.'
      },
      {
        id: 'prod-malik-4',
        name: 'Malik Touré',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        roleTitle: 'Producteur citoyen',
        pledgeAmount: 5000,
        joinedAt: '01 Mars 2026',
        bio: 'Collectionneur de pièces d’orfèvrerie et défenseur de la parole des anciens.'
      }
    ],
    distributors: [
      {
        id: 'dist-chloe',
        name: 'Chloé Mensah',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        roleOrChannel: 'Diffusion Médias, Maisons d\'Art & Fondations Culturelles'
      }
    ],
    sponsors: [
      {
        id: 'spons-ebene',
        companyName: 'Maison Ébène & Métiers d\'Art',
        partnershipType: 'Partenaire Savoir-Faire',
        description: 'Valorisation de la haute joaillerie, du tissage et de la mémoire des aînés.'
      }
    ]
  },

  'horizons-finagnon': {
    author: {
      name: 'Romeo Nonvide',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Fondateur & Concepteur documentaire de YonyWood',
      protagonistId: 'awa-ndiaye'
    },
    screenwriter: {
      name: 'Awa Ndiaye',
      avatarUrl: '/assets/duos/horizons-awa.jpg',
      bio: 'Conteuse et médiatrice culturelle entre nations et diasporas',
      protagonistId: 'awa-ndiaye'
    },
    director: {
      name: 'Carlos Yupanqui',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      bio: 'Cinéaste spécialiste des terroirs et des récits de territoire',
      protagonistId: 'tobi-houndegla'
    },
    producers: [
      {
        id: 'prod-malik-2',
        name: 'Malik Touré',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        roleTitle: 'Producteur délégué',
        pledgeAmount: 14000,
        joinedAt: '18 Janvier 2026',
        bio: 'Passionné des ponts entre le Bénin, sa diaspora et les autres nations.'
      },
      {
        id: 'prod-mariama',
        name: 'Mariama Ba',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        roleTitle: 'Coproductrice associée',
        pledgeAmount: 8500,
        joinedAt: '04 Février 2026',
        bio: 'Fondatrice d\'initiatives d\'accueil et de tourisme communautaire.'
      },
      {
        id: 'prod-jean-luc-2',
        name: 'Jean-Luc Agbo',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        roleTitle: 'Producteur citoyen',
        pledgeAmount: 4000,
        joinedAt: '20 Février 2026',
        bio: 'Mécène culturel soutenant les terroirs en transition.'
      }
    ],
    distributors: [
      {
        id: 'dist-ines',
        name: 'Inès Adjovi',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        roleOrChannel: 'Réseaux Diaspora & Passeurs de Mémoire'
      },
      {
        id: 'dist-pedro',
        name: 'Pedro Mamani',
        avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
        roleOrChannel: 'Ambassadeur Territoires du Monde'
      }
    ],
    sponsors: [
      {
        id: 'spons-terroirs',
        companyName: 'Terroirs & Accueil Bénin',
        partnershipType: 'Partenaire Hospitalité',
        description: 'Valorisation des guides, hôtes et passeurs de territoire.'
      }
    ]
  },

  'builders-akwe': {
    author: {
      name: 'Romeo Nonvide',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Fondateur & Concepteur documentaire de YonyWood',
      protagonistId: 'senami-houndete'
    },
    screenwriter: {
      name: 'Koffi Mensah',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      bio: 'Économiste et artisan de l\'investissement productif en Afrique',
      protagonistId: 'senami-houndete'
    },
    director: {
      name: 'Stéphane Hounkpatin',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      bio: 'Réalisateur spécialisé dans l\'industrie, l\'entrepreneuriat et la finance'
    },
    producers: [
      {
        id: 'prod-malik-5',
        name: 'Malik Touré',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        roleTitle: 'Producteur délégué',
        pledgeAmount: 25000,
        joinedAt: '05 Janvier 2026',
        bio: 'Investisseur à impact soutenant l\'industrialisation locale.'
      },
      {
        id: 'prod-jean-luc-5',
        name: 'Jean-Luc Agbo',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        roleTitle: 'Producteur citoyen',
        pledgeAmount: 8000,
        joinedAt: '12 Février 2026',
        bio: 'Bâtisseur et chef d\'entreprise dans les travaux durables.'
      }
    ],
    distributors: [
      {
        id: 'dist-brice',
        name: 'Brice Agossou',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        roleOrChannel: 'Réseaux Entrepreneurs, Tontines & Business Angels'
      }
    ],
    sponsors: [
      {
        id: 'spons-fonds',
        companyName: 'Fonds Bâtisseurs d’Avenir',
        partnershipType: 'Partenaire Financement',
        description: 'Mécénat de transmission entre entrepreneurs et financeurs.'
      }
    ]
  },

  'regards-gbe': {
    author: {
      name: 'Romeo Nonvide',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Fondateur & Concepteur documentaire de YonyWood',
      protagonistId: 'photographer-chancelle'
    },
    screenwriter: {
      name: 'Armel Hounkpatin',
      avatarUrl: '/assets/duos/paroles-armel.jpg',
      bio: 'Slameur, poète et auteur de la scène béninoise',
      protagonistId: 'poet-armel'
    },
    director: {
      name: 'Chancelle Agbo',
      avatarUrl: '/assets/duos/photographer-focus.jpg',
      bio: 'Photographe d’auteur et documentariste de terrain',
      protagonistId: 'photographer-chancelle'
    },
    producers: [
      {
        id: 'prod-eleonore-8b',
        name: 'Chancelle Agbo',
        avatarUrl: '/assets/duos/photographer-focus.jpg',
        roleTitle: 'Productrice déléguée',
        pledgeAmount: 32000,
        joinedAt: '02 Janvier 2026',
        bio: 'Fondatrice de collectifs de valorisation des arts visuels et oratoires.'
      },
      {
        id: 'prod-marc-8',
        name: 'Marc-Antoine Vaneck',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        roleTitle: 'Coproducteur associé',
        pledgeAmount: 15000,
        joinedAt: '14 Février 2026',
        bio: 'Mécène d’art contemporain et passionné d’iconographie documentaire.'
      }
    ],
    distributors: [
      {
        id: 'dist-focus',
        name: 'Éditions & Galeries Documentaires Associées',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        roleOrChannel: 'Festivals du Film, Scènes de Slam & Musées de la Photographie'
      }
    ],
    sponsors: [
      {
        id: 'spons-focus',
        companyName: 'Fondation pour le Verbe & l’Image',
        partnershipType: 'Partenaire Culture & Création',
        description: 'Résidences de création photographique, littéraire et oratoire.'
      }
    ]
  }
};

export const getSeriesCredits = (seriesId: string, duoTitle?: string): SequenceCredits => {
  const canonicalId = resolveCanonicalSeriesId(seriesId) || 'remedes-e-vivi';
  const team = ALL_SERIES_TEAMS[canonicalId] || ALL_SERIES_TEAMS['remedes-e-vivi'];

  return {
    casting: [
      {
        name: team.author?.name || 'Témoin clé',
        roleOrCharacter: duoTitle || 'Intervenant principal',
        avatarUrl: team.author?.avatarUrl,
        protagonistId: team.author?.protagonistId,
        age: 46
      },
      {
        name: team.screenwriter?.name || 'Grand témoin',
        roleOrCharacter: 'Témoin en regard miroir',
        avatarUrl: team.screenwriter?.avatarUrl,
        protagonistId: team.screenwriter?.protagonistId,
        age: 52
      }
    ],
    director: {
      name: team.director?.name || 'Alain Kpatoukpa',
      roleTitle: team.director?.bio || 'Réalisateur & Cadreur 9:16',
      avatarUrl: team.director?.avatarUrl,
      protagonistId: team.director?.protagonistId
    },
    postProduction: [
      {
        name: 'Sonia Dossou',
        role: 'Montage & Rythme narratif',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Mathieu Houndé',
        role: 'Mixage sonore & Étalonnage cinématographique',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
      }
    ]
  };
};
