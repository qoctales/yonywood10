import { 
  Documentary, 
  Protagonist, 
  Duo, 
  Videographer, 
  CommunityReviewItem, 
  BackOfficeApplication,
  ReviewCandidate,
  SeriesAffiliationTree,
  AffiliationPerson
} from '../types';
import { ALL_SERIES_TEAMS, getSeriesCredits } from './seriesTeamData';
import {
  SERIES_REGISTRY,
  SeriesRegistryEntry,
  resolveCanonicalSeriesId,
  resolveSeriesById,
} from './seriesRegistry';

const SERIES_EXTRAS_BY_ID: Record<
  string,
  Pick<Documentary, 'effigies' | 'territories' | 'protagonistsCount'>
> = {
  'vodun-rays-autre-foi': {
    effigies: [
      {
        id: 'eff-1',
        name: 'Mahougnon Zounon',
        role: 'Gardien du sanctuaire des mémoires ancestrales (Ouidah)',
        photoUrl: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_PRINCIPALE',
      },
      {
        id: 'eff-2',
        name: 'Dieudonné Dossou',
        role: 'Prêtre et théologien du dialogue des mémoires',
        photoUrl: '/assets/duos/duo_pere_matthieu_1791655226601.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_SERIE',
      },
    ],
    protagonistsCount: 8,
    territories: ['Ouidah', 'Cotonou', 'Allada', 'Abomey'],
  },
  'blacks-one-wowmen': {
    effigies: [
      {
        id: 'eff-bo-1',
        name: 'Malik Diop',
        role: 'Penseur civique, orateur & passeur de mémoires',
        photoUrl: '/assets/protagonists/malik-diop.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_PRINCIPALE',
      },
      {
        id: 'eff-be-2',
        name: 'Éléonore Vance',
        role: 'Artiste peintre visionnaire & icône féministe',
        photoUrl: '/assets/protagonists/eleonore-vance.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_SERIE',
      },
    ],
    protagonistsCount: 6,
    territories: ['Dakar', 'Abidjan', 'Paris', 'Marseille'],
  },
  'performers-builders': {
    effigies: [
      {
        id: 'eff-inv-1',
        name: 'Fatou Diallo',
        role: 'Investisseuse à impact & Mécène (Paris & Dakar)',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_PRINCIPALE',
      },
      {
        id: 'eff-inv-2',
        name: 'Kwame Mensah',
        role: 'Ingénieur & Bâtisseur d’ouvrages (Cotonou & Kigali)',
        photoUrl: '/assets/duos/kwame-mensah.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_SERIE',
      },
    ],
    protagonistsCount: 6,
    territories: ['Dakar', 'Cotonou', 'Abidjan', 'Paris', 'Kigali'],
  },
  'paroles-regards': {
    effigies: [
      {
        id: 'eff-clara-focus',
        name: 'Clara Valmont',
        role: 'Photographe documentaire & Auteure visuelle',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_PRINCIPALE',
      },
      {
        id: 'eff-armel-words',
        name: 'Armel Hounkpatin',
        role: 'Slameur & Poète du verbe vivant',
        photoUrl: '/assets/images/fagnon_agronome_1792933698985.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_SERIE',
      },
    ],
    protagonistsCount: 6,
    territories: ['Paris', 'Cotonou', 'Dakar', 'Montréal'],
  },
};

function buildDocumentaryFromRegistry(series: SeriesRegistryEntry): Documentary {
  const extras = SERIES_EXTRAS_BY_ID[series.id];
  return {
    id: series.id,
    slug: series.id,
    title: series.title,
    subtitle: `${series.partA.name} <> ${series.partB.name}`,
    centralQuestion: series.episodes[0].question,
    shortSynopsis: series.synopsis,
    description: series.synopsis,
    coverImage: series.posterUrl,
    posterUrl: series.posterUrl,
    teaserVideoUrl: '/sample.mp4',
    teaserDuration: '1:15',
    universes: [
      {
        name: series.partA.name,
        tagline: series.partA.description,
        description: series.partA.description,
        territory: extras?.territories?.[0] || 'Bénin & Diaspora',
      },
      {
        name: series.partB.name,
        tagline: series.partB.description,
        description: series.partB.description,
        territory: extras?.territories?.[1] || 'Monde & Diaspora',
      },
    ],
    effigies: extras?.effigies,
    questions: series.episodes.map((ep) => ({
      number: ep.number,
      title: `Épisode ${parseInt(ep.number, 10) || ep.number} — ${ep.title}`,
      prompt: ep.question,
      posterUrl: series.posterUrl,
      audioDuration: '0:42',
      videoAvatarUrl: '/sample.mp4',
      audioVoiceName: `${series.partA.name} & ${series.partB.name}`,
      translations: [{ lang: 'fr', label: 'Français', prompt: ep.question }],
    })),
    episodeCount: series.episodes.length,
    protagonistsCount: extras?.protagonistsCount ?? 4,
    territories: extras?.territories ?? ['Bénin', 'Diaspora'],
  };
}

const INITIAL_DOCUMENTARIES: Documentary[] = SERIES_REGISTRY.map(buildDocumentaryFromRegistry);

export const getCustomDocumentaries = (): Documentary[] => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('yonywood_custom_series');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let migrated = false;
          const byId = new Map<string, Documentary>();

          for (const rawDoc of parsed as Documentary[]) {
            const canonicalId = resolveCanonicalSeriesId(rawDoc?.id);
            if (!canonicalId) {
              // Ignorer les anciennes séries masquées ou scindées sans équivalent direct
              migrated = true;
              continue;
            }
            if (canonicalId !== rawDoc.id) {
              migrated = true;
            }
            const baseDoc = INITIAL_DOCUMENTARIES.find((b) => b.id === canonicalId);
            if (!baseDoc) continue;

            if (byId.has(canonicalId)) {
              migrated = true;
              continue;
            }

            if (
              rawDoc.title !== baseDoc.title ||
              rawDoc.subtitle !== baseDoc.subtitle ||
              rawDoc.centralQuestion !== baseDoc.centralQuestion ||
              rawDoc.shortSynopsis !== baseDoc.shortSynopsis ||
              rawDoc.description !== baseDoc.description ||
              rawDoc.posterUrl !== baseDoc.posterUrl ||
              rawDoc.coverImage !== baseDoc.coverImage ||
              rawDoc.episodeCount !== baseDoc.episodeCount ||
              JSON.stringify(rawDoc.questions) !== JSON.stringify(baseDoc.questions)
            ) {
              migrated = true;
            }

            byId.set(canonicalId, {
              ...rawDoc,
              id: baseDoc.id,
              slug: baseDoc.slug,
              title: baseDoc.title,
              subtitle: baseDoc.subtitle,
              centralQuestion: baseDoc.centralQuestion,
              universes: baseDoc.universes,
              questions: baseDoc.questions,
              shortSynopsis: baseDoc.shortSynopsis,
              description: baseDoc.description,
              posterUrl: baseDoc.posterUrl,
              coverImage: baseDoc.coverImage,
              episodeCount: baseDoc.episodeCount,
              effigies: baseDoc.effigies || rawDoc.effigies,
            });
          }

          // Garantir la présence exacte et l'ordre officiel des 8 séries du registre
          const ordered: Documentary[] = [];
          for (let i = 0; i < INITIAL_DOCUMENTARIES.length; i++) {
            const initDoc = INITIAL_DOCUMENTARIES[i];
            const found = byId.get(initDoc.id);
            if (!found) {
              migrated = true;
              ordered.push(initDoc);
            } else {
              if ((parsed[i] as Documentary | undefined)?.id !== initDoc.id) {
                migrated = true;
              }
              ordered.push(found);
            }
          }

          if (migrated) {
            localStorage.setItem('yonywood_custom_series', JSON.stringify(ordered));
          }

          return ordered.map((doc: Documentary) => {
            const team = ALL_SERIES_TEAMS[doc.id];
            if (team) {
              return {
                ...doc,
                author: doc.author || team.author,
                screenwriter: doc.screenwriter || team.screenwriter,
                director: doc.director || team.director,
                producers: doc.producers && doc.producers.length > 0 ? doc.producers : team.producers,
                distributors: doc.distributors && doc.distributors.length > 0 ? doc.distributors : team.distributors,
                sponsors: doc.sponsors && doc.sponsors.length > 0 ? doc.sponsors : team.sponsors,
              };
            }
            return doc;
          });
        }
      }
    } catch {
      // ignore
    }
  }
  return INITIAL_DOCUMENTARIES.map((doc) => {
    const team = ALL_SERIES_TEAMS[doc.id];
    return team ? { ...doc, ...team } : doc;
  });
};

export const DOCUMENTARIES: Documentary[] = getCustomDocumentaries();

export const saveCustomDocumentaries = (newDocs: Documentary[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('yonywood_custom_series', JSON.stringify(newDocs));
      DOCUMENTARIES.splice(0, DOCUMENTARIES.length, ...newDocs);
      window.dispatchEvent(new CustomEvent('yonywood_series_updated', { detail: newDocs }));
    } catch (e) {
      console.error(e);
    }
  }
};

export const PROTAGONISTS: Protagonist[] = [
  {
    id: 'usr-admin-romeo',
    slug: 'romeo-nonvide',
    name: 'Roméo Nonvide',
    firstName: 'Roméo',
    age: 29,
    role: 'Retour au pays & Créateur de récits',
    territory: 'Cotonou & Diaspora',
    country: 'Bénin',
    flag: '🇧🇯',
    bio: 'Jeune Béninois à lunettes de retour d’Europe, Roméo s’installe à Cotonou pour fonder son studio de création de récits, valoriser les savoirs ancestraux et connecter la diaspora à la jeunesse locale.',
    photoUrl: '/assets/images/romeo_storyteller_1792933587573.jpg',
    universeTag: 'Bénin & Diaspora',
    quote: '« Revenir n’est pas recommencer à zéro, c’est apporter ce que le monde nous a appris pour faire grandir la terre de nos ancêtres. »',
    storiesCount: 4,
    transmissionsCount: 4,
    projectsCount: 2,
    tree: {
      passeurs: [
        {
          id: 'anc-kiki-alapini',
          name: 'Kiki Alapini',
          role: 'Doyen des récits lacustres & Gardien de mémoire',
          country: 'Bénin',
          photo: '/assets/images/kiki_passeur_1792933820505.jpg'
        },
        {
          id: 'anc-cheikh-amadou',
          name: 'Cheikh Amadou Kane',
          role: 'Passeur de mémoire fluviale',
          country: 'Sénégal',
          photo: '/assets/duos/malik-diop.jpg'
        }
      ],
      heritiers: [
        {
          id: 'coopt-fagnon-bio',
          name: 'Fagnon Bio',
          role: 'Innovateur agroécologique & bâtisseur de terre',
          country: 'Bénin',
          photo: '/assets/images/fagnon_agronome_1792933698985.jpg'
        },
        {
          id: 'coopt-senan-agossa',
          name: 'Sénan Agossa',
          role: 'Pionnière de l’ingénierie et de l’image',
          country: 'Bénin',
          photo: '/assets/images/senan_innovatrice_1792933679487.jpg'
        }
      ],
      transmissions: [
        {
          id: 't-romeo-1',
          title: 'Le retour des mémoires vivantes',
          ancestorOrMentor: 'Les anciens de la communauté de Ganvié',
          description: 'Documenter avec discrétion et respect la transmission des contes et de la pirogue sacrée.'
        }
      ],
      duos: [],
      opportunities: [],
      creations: [],
      projects: [],
      needs: []
    },
    stories: [
      {
        id: 'story-romeo-01',
        title: 'Le grand retour à Cotonou',
        questionNumber: '01',
        questionTitle: 'Le Retour',
        duration: '06:40',
        videoDurationSeconds: 400,
        summary: 'Roméo foule à nouveau le sol béninois, valises en main sous le soleil de Cadjehoun, prêt à s’installer.',
        videoCoverUrl: '/assets/images/romeo_storyteller_1792933587573.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire du récit', name: 'Roméo Nonvide' }
        ]
      }
    ]
  },
  {
    id: 'sika-dossou',
    slug: 'sika-dossou',
    name: 'Sika Dossou',
    age: 34,
    role: 'Tisserande de tentures royales d’Abomey',
    territory: 'Abomey',
    country: 'Bénin',
    flag: '🇧🇯',
    bio: 'Héritière de cinq générations de femmes tisserandes de la cour royale d’Abomey, Sika crée des tentures aux motifs symboliques de courage et de dignité béninoise.',
    photoUrl: '/assets/images/sika_tisserande_1792933605542.jpg',
    documentaryId: 'finagnon-qosqorico',
    universeTag: 'Benin',
    quote: '« Chaque fil tendu sur le métier est une prière pour que la mémoire de nos reines ne s’efface jamais. »',
    tree: {
      passeurs: [
        {
          id: 'p-mama-ayaba',
          name: 'Maman Ayaba Houénou',
          role: 'Doyenne herboriste et teinturière',
          country: 'Bénin',
          photo: '/assets/images/ayaba_nectar_1792933764727.jpg'
        }
      ],
      heritiers: [
        {
          id: 'h-senami-houndete',
          name: 'Sènami Houndété',
          role: 'Architecte et dessinatrice textile',
          country: 'Bénin',
          photo: '/assets/images/senami_architecte_1792933801804.jpg'
        }
      ],
      transmissions: [
        {
          id: 't-sika-1',
          title: 'Le secret des teintures d’écorce royale',
          ancestorOrMentor: 'Sa grand-mère reine-mère Kpodjito',
          description: 'Macération des écorces d’iroko et d’indigo sauvage pour obtenir des teintes qui traversent les siècles.'
        }
      ],
      duos: [
        {
          id: 'duo-sika-amara-ref',
          partnerName: 'Amara',
          partnerRole: 'Tisserande andine',
          partnerPhoto: '/assets/images/amara_andine_1792933642777.jpg',
          duoId: 'duo-finagnon-qosqorico-01',
          question: '« Racontez un moment où vous avez compris ce qui rend votre pays unique. »'
        }
      ],
      creations: [
        {
          id: 'c-sika-1',
          title: 'Tenture du Léopard Royal d’Abomey',
          type: 'Appliqué royal sur coton tissé main',
          description: 'Pièce cérémonielle brodée main célébrant l’intrépidité des guerrières Agojié.'
        }
      ],
      projects: [
        {
          id: 'p-sika-1',
          title: 'L’Atelier des Tisserandes d’Abomey',
          stage: 'Transmission vivante',
          description: 'Hangar communautaire pour former 20 jeunes béninoises aux arts du fil royal.'
        }
      ],
      opportunities: [
        {
          id: 'o-sika-1',
          title: 'Résidence de transmission du tissage royal',
          description: 'Immersion de 2 semaines aux métiers d’Abomey pour créatrices textiles.',
          badge: 'Résidence ouverte'
        }
      ],
      needs: [
        {
          id: 'n-sika-1',
          title: 'Fourniture de fil de coton biologique du Bénin',
          urgency: 'Prioritaire',
          description: 'Approvisionnement direct auprès des productrices du Nord-Bénin.'
        }
      ]
    },
    stories: [
      {
        id: 'story-sika-01',
        title: 'Le chant de la trame au lever du soleil',
        questionNumber: '01',
        questionTitle: 'Le Pays Unique',
        duration: '08:15',
        videoDurationSeconds: 495,
        summary: 'Sika raconte le matin où elle a compris que tisser à Abomey n’était pas un métier ordinaire, mais la garde d’une souveraineté spirituelle que nul conquérant n’a pu éteindre.',
        videoCoverUrl: '/assets/images/sika_tisserande_1792933605542.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Sika Dossou' },
          { role: 'director', label: 'Réalisateur', name: 'Ayaba Senou' }
        ]
      }
    ]
  },
  {
    id: 'koffi-tisserand',
    slug: 'koffi-tisserand',
    name: 'Koffi Mensah',
    age: 54,
    role: 'Tisserand traditionnel',
    territory: 'Porto-Novo',
    country: 'Bénin',
    flag: '🇧🇯',
    bio: 'Tisserand à Porto-Novo, Koffi perpétue un savoir transmis de père en fils. Ses étoffes racontent les marchés et les rites de la côte.',
    photoUrl: '/assets/images/koffi_portonovo_1792933660999.jpg',
    documentaryId: 'finagnon-qosqorico',
    universeTag: 'Finagnon',
    quote: '« Le tissage est une langue qu’on apprend sans parler. »',
    tree: {
      passeurs: [
        {
          id: 'p-dossou-zounon',
          name: 'Dossou Zounon',
          role: 'Maître charpentier de métiers',
          country: 'Bénin',
          photo: '/assets/images/dossou_logistique_1792933781153.jpg'
        },
        {
          id: 'p-ayaba-houenou',
          name: 'Ayaba Houénou',
          role: 'Herboriste des pigments',
          country: 'Bénin',
          photo: '/assets/images/ayaba_nectar_1792933764727.jpg'
        }
      ],
      heritiers: [
        {
          id: 'h-senan-agossa',
          name: 'Sénan Agossa',
          role: 'Apprentie dessinatrice textile',
          country: 'Bénin',
          photo: '/assets/images/senan_innovatrice_1792933679487.jpg'
        },
        {
          id: 'h-kpedetin',
          name: 'Kpèdétin Houndégla',
          role: 'Créatrice de parures',
          country: 'Bénin',
          photo: '/assets/images/kpedetin_joailliere_1792933718361.jpg'
        }
      ],
      transmissions: [
        {
          id: 't-koffi-1',
          title: 'Le rythme du peigne d’acajou',
          ancestorOrMentor: 'Son père Mensah Houndété (1932–2012)',
          description: 'L’art de tendre la chaîne sans briser les fibres de coton sous la chaleur de midi.',
          connectedProtagonistId: 'amara-tisserande'
        },
        {
          id: 't-koffi-2',
          title: 'Les symboles de dignité royale d’Abomey',
          ancestorOrMentor: 'Feu Da Zannou, chef tisseur de cour',
          description: 'Savoir insérer le caméléon et le lion sans briser l’harmonie des teintes d’indigo.'
        }
      ],
      duos: [
        {
          id: 'duo-koffi-amara-ref',
          partnerName: 'Amara',
          partnerRole: 'Tisserande andine',
          partnerPhoto: '/assets/images/amara_andine_1792933642777.jpg',
          duoId: 'duo-finagnon-qosqorico-01',
          question: '« Que transmet une main qui tisse depuis toujours ? »'
        }
      ],
      creations: [
        {
          id: 'c-koffi-1',
          title: 'Étoffes rituelles de Porto-Novo',
          type: 'Tissage d’exception',
          description: 'Tissées sur métier horizontal en fil de coton biologique teint à l’indigo naturel végétal.',
          priceOrDetail: 'Fabrication artisanale sur commande'
        },
        {
          id: 'c-koffi-2',
          title: 'Écharpes cérémonielles d’Allada',
          type: 'Parure textile',
          description: 'Bandes de 15 cm aux motifs traditionnels de passage et de bénédiction.'
        }
      ],
      projects: [
        {
          id: 'p-koffi-1',
          title: 'L’Atelier Vivant des Jeunes Tisserands',
          stage: 'Chantier participatif à Porto-Novo',
          description: 'Création d’un hangar d’apprentissage gratuit pour former 12 jeunes filles et garçons déscolarisés aux métiers du fil.'
        }
      ],
      opportunities: [
        {
          id: 'o-koffi-1',
          title: 'Résidence d’initiation au tissage traditionnel',
          description: 'Accueil de 2 créateurs textiles par an pour une immersion de 3 semaines au rythme des métiers en bois.',
          badge: 'Résidence ouverte'
        }
      ],
      needs: [
        {
          id: 'n-koffi-1',
          title: 'Sourcing de fil de coton biologique ouest-africain',
          urgency: 'Prioritaire',
          description: 'Recherche de coopératives agricoles féminines produisant du fil écru non traité.'
        }
      ]
    },
    stories: [
      {
        id: 'story-koffi-tiss-01',
        title: 'Le bruit de la navette avant le jour',
        questionNumber: '01',
        questionTitle: 'Le Geste Ancestral',
        duration: '08:40',
        videoDurationSeconds: 520,
        summary: 'Koffi raconte ce matin brumeux où son père l’a réveillé à 4 heures pour écouter la cadence de la navette sans allumer de lampe : comprendre que le tissu n’est pas fait par les yeux, mais par la pulsation du corps.',
        videoCoverUrl: '/assets/images/koffi_portonovo_1792933660999.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Koffi Mensah' },
          { role: 'director', label: 'Réalisateur', name: 'Ayaba Senou' }
        ]
      }
    ]
  },
  {
    id: 'amara-tisserande',
    slug: 'amara-tisserande',
    name: 'Amara',
    age: 42,
    role: 'Tisserande andine',
    territory: 'Cusco (Vallée Sacrée)',
    country: 'Pérou',
    flag: '🇵🇪',
    bio: 'Tisserande des hauteurs de Cusco, Amara travaille la laine et les teintes végétales. Ses tissus portent les symboles de sa communauté.',
    photoUrl: '/assets/images/amara_andine_1792933642777.jpg',
    documentaryId: 'finagnon-qosqorico',
    universeTag: 'Qosqorico',
    quote: '« Chaque fil garde la mémoire de la montagne. »',
    tree: {
      passeurs: [
        {
          id: 'p-asunta',
          name: 'Mama Asunta',
          role: 'Grand-mère tisseuse',
          country: 'Pérou',
          photo: '/assets/images/kpedetin_joailliere_1792933718361.jpg'
        },
        {
          id: 'p-huaman',
          name: 'Don Huamán',
          role: 'Teinturier d’altitude',
          country: 'Pérou',
          photo: '/assets/images/kiki_passeur_1792933820505.jpg'
        }
      ],
      heritiers: [
        {
          id: 'h-inti',
          name: 'Nayra',
          role: 'Apprentie fileuse',
          country: 'Pérou',
          photo: '/assets/images/senami_architecte_1792933801804.jpg'
        }
      ],
      transmissions: [
        {
          id: 't-amara-1',
          title: 'La teinture à la cochenille sauvage',
          ancestorOrMentor: 'Sa mère Rosa Huamán',
          description: 'Obtenir treize nuances de pourpre en ajustant le jus de citron vert et la cendre de quinoa.',
          connectedProtagonistId: 'koffi-tisserand'
        }
      ],
      duos: [
        {
          id: 'duo-amara-koffi-ref',
          partnerName: 'Koffi Mensah',
          partnerRole: 'Tisserand de Porto-Novo',
          partnerPhoto: '/assets/images/koffi_portonovo_1792933660999.jpg',
          duoId: 'duo-finagnon-qosqorico-01',
          question: '« Que transmet une main qui tisse depuis toujours ? »'
        }
      ],
      creations: [
        {
          id: 'c-amara-1',
          title: 'Lliclla andine cérémonielle',
          type: 'Châle de laine d’alpaga',
          description: 'Tissé sur métier à ceinture (telar de cintura), motifs racontant les cycles des constellations.',
          priceOrDetail: 'Laine filée main et teinte aux plantes'
        }
      ],
      projects: [
        {
          id: 'p-amara-1',
          title: 'La Maison des Tisseuses de Chinchero',
          stage: 'Construction en adobe',
          description: 'Créer un espace autonome où 25 femmes peuvent teindre et filer sans dépendre des intermédiaires touristiques.'
        }
      ],
      opportunities: [
        {
          id: 'o-amara-1',
          title: 'Cercle de transmission du filage au fuseau',
          description: 'Ateliers mensuels ouverts aux enfants de la vallée pour préserver le quechua textile.',
          badge: 'Transmission communautaire'
        }
      ],
      needs: [
        {
          id: 'n-amara-1',
          title: 'Cuves en cuivre pour bains de teinture douce',
          urgency: 'En cours',
          description: 'Équipement pour stabiliser les pigments naturels sans mordant toxique.'
        }
      ]
    },
    stories: [
      {
        id: 'story-amara-01',
        title: 'Le premier motif gravé dans la laine',
        questionNumber: '01',
        questionTitle: 'Le Geste Ancestral',
        duration: '09:15',
        videoDurationSeconds: 555,
        summary: 'Amara raconte comment sa grand-mère lui a attaché les mains au métier à l’âge de huit ans non pour la contraindre, mais pour qu’elle sente la tension invisible entre le cœur de la femme et les crêtes de la montagne.',
        videoCoverUrl: '/assets/images/amara_andine_1792933642777.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Amara' },
          { role: 'director', label: 'Réalisateur', name: 'Mateo Quispe Flores' }
        ]
      }
    ]
  },
  {
    id: 'dah-zounon',
    slug: 'dah-zounon',
    name: 'Mahougnon Zounon Gbegnon',
    age: 62,
    role: 'Dignitaire de la Tradition & Gardien des Seuils',
    territory: 'Allada / Ouidah',
    country: 'Bénin',
    flag: '🇧🇯',
    bio: 'Héritier d\'une lignée de prêtres vodoun d’Allada, Mahougnon veille sur l’autel de Legba depuis quarante ans. Pour lui, la foi n’est pas une spéculation : c’est un pacte quotidien d’équilibre avec la nature, les carrefours de la vie et le respect de la parole donnée.',
    photoUrl: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
    documentaryId: 'vodun-rays-autre-foi',
    universeTag: 'Vodun Rays',
    quote: '« Legba ne ferme jamais une porte sans avoir déjà placé la clé entre les mains de celui qui écoute. »',
    tree: {
      transmissions: [
        {
          id: 't-1',
          title: 'L’onction des carrefours',
          ancestorOrMentor: 'Son grand-père Hounnon Kpossou (1918–1996)',
          description: 'L’apprentissage du silence auprès des pierres levées et l’art de reconnaître le battement d’ailes d’un présage sans panique.',
          connectedProtagonistId: 'pere-matthieu'
        },
        {
          id: 't-2',
          title: 'La langue des plantes de berge',
          ancestorOrMentor: 'Maman Agbassi, herboriste à Tori',
          description: 'La connaissance des feuilles calmantes et des racines protectrices cueillies avant l’aurore.'
        }
      ],
      duos: [
        {
          id: 'duo-1',
          partnerName: 'Dieudonné Agonhossou',
          partnerRole: 'Prêtre catholique & enseignant',
          partnerPhoto: '/assets/duos/duo_pere_matthieu_1791655226601.jpg',
          duoId: 'duo-jesus-legba-01',
          question: '01 — La Rencontre : Le jour où la foi a cessé d\'être un mot'
        }
      ],
      opportunities: [
        {
          id: 'o-1',
          title: 'Immersion culturelle aux sources d’Allada',
          description: 'Accueil de chercheurs, étudiants et cinéastes pour décrypter la philosophie des autels carrefours.',
          badge: 'Ouvert aux résidences'
        },
        {
          id: 'o-2',
          title: 'Cercle de dialogue inter-spirituel',
          description: 'Séances mensuelles de médiation paisible entre dignitaires et pasteurs des villages lacustres.',
          badge: 'Médiation'
        }
      ],
      creations: [
        {
          id: 'c-1',
          title: 'Huile protectrice de néré et karité sanctifiée',
          type: 'Baume artisanal',
          description: 'Formule ancestrale préparée lors du solstice d’harmattan pour apaiser la fatigue des voyageurs.',
          priceOrDetail: 'Fabrication rituelle limitée'
        },
        {
          id: 'c-2',
          title: 'Colliers de perles de corail et terre d’Allada',
          type: 'Objets de mémoire',
          description: 'Parures confectionnées avec les forgerons de la cour royale.'
        }
      ],
      projects: [
        {
          id: 'p-1',
          title: 'Le Sanctuaire-Conservatoire des plantes sacrées',
          stage: 'Jeune pousse (terrassement en cours)',
          description: 'Création d’un arboretum protégé de 4 hectares pour préserver les essences médicinales du plateau d’Allada.'
        }
      ],
      needs: [
        {
          id: 'n-1',
          title: 'Archivage sonore et traduction en langues locales',
          urgency: 'Prioritaire',
          description: 'Besoin d’un jeune ingénieur du son pour numériser 60 heures de chants oraux avant la saison des pluies.'
        }
      ]
    },
    stories: [
      {
        id: 'story-dah-01',
        title: 'Le feu sous l’iroko noir',
        questionNumber: '01',
        questionTitle: 'La Rencontre',
        duration: '11:42',
        videoDurationSeconds: 702,
        summary: 'À l’âge de dix-neuf ans, Mahougnon fuyait le village après un naufrage familial. Assis au carrefour d’Allada, une simple poignée de terre chaude déposée par un vieillard a suspendu son désespoir.',
        videoCoverUrl: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Mahougnon Zounon Gbegnon' },
          { role: 'director', label: 'Réalisateur', name: 'Ayaba Senou' },
          { role: 'mentor', label: 'Mentor spirituel', name: 'Feu Hounnon Kpossou' },
          { role: 'sound', label: 'Prise de son', name: 'Eric Houndo' }
        ]
      }
    ]
  },
  {
    id: 'pere-matthieu',
    slug: 'pere-matthieu',
    name: 'Dieudonné Agonhossou',
    age: 46,
    role: 'Prêtre diocésain, philosophe & éducateur',
    territory: 'Cotonou / Ouidah',
    country: 'Bénin',
    flag: '🇧🇯',
    bio: 'Né au bord de la lagune de Cotonou, ordonné à Ouidah, Dieudonné conjugue l’étude de saint Augustin avec une écoute attentive des traditions de son terroir. Il enseigne la philosophie aux jeunes lycéens et partage son temps entre l’oratoire et la rue.',
    photoUrl: '/assets/duos/duo_pere_matthieu_1791655226601.jpg',
    documentaryId: 'vodun-rays-autre-foi',
    universeTag: 'Autre Foi',
    quote: '« La foi n’est pas une citadelle contre l’autre, c’est une table basse dressée en plein vent où l’on attend celui qui a soif. »',
    tree: {
      transmissions: [
        {
          id: 't-3',
          title: 'Le bréviaire au bord de l’eau',
          ancestorOrMentor: 'Monseigneur Isidore de Souza',
          description: 'Le courage civique au service de la paix nationale lors de la Conférence des Forces Vives de 1990.',
          connectedProtagonistId: 'dah-zounon'
        }
      ],
      duos: [
        {
          id: 'duo-1-bis',
          partnerName: 'Mahougnon Zounon Gbegnon',
          partnerRole: 'Dignitaire Vodoun',
          partnerPhoto: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
          duoId: 'duo-jesus-legba-01',
          question: '01 — La Rencontre : L’éveil devant l’invisible'
        }
      ],
      opportunities: [
        {
          id: 'o-3',
          title: 'Ateliers de lecture philosophique pour lycéens',
          description: 'Ouverture hebdomadaire de sa bibliothèque personnelle à 30 élèves sans moyens.',
          badge: 'Éducation ouverte'
        }
      ],
      creations: [
        {
          id: 'c-3',
          title: 'Cahiers de méditation sur les proverbes du golfe',
          type: 'Essai éditorial',
          description: 'Recueil de 120 pages rapprochant les Béatitudes des maximes fòn d’autrefois.'
        }
      ],
      projects: [
        {
          id: 'p-2',
          title: 'La Maison du Repos et de l’Écoute',
          stage: 'Plans architecturaux finalisés',
          description: 'Un lieu neutre pour accueillir sans distinction de culte les personnes éprouvées par un deuil brutal.'
        }
      ],
      needs: [
        {
          id: 'n-2',
          title: 'Équipement en panneaux solaires',
          urgency: 'En recherche de donateurs',
          description: 'Alimenter la salle d’études pour permettre aux jeunes d’étudier le soir sans coupures.'
        }
      ]
    },
    stories: [
      {
        id: 'story-matthieu-01',
        title: 'Le silence dans la nef de Ouidah',
        questionNumber: '01',
        questionTitle: 'La Rencontre',
        duration: '13:05',
        videoDurationSeconds: 785,
        summary: 'Pendant ses années de doute à l’université, Dieudonné est entré par hasard dans la basilique déserte de Ouidah en plein midi. Ce n’est pas un miracle qui l’a retenu, mais une soudaine certitude d’être attendu.',
        videoCoverUrl: '/assets/duos/duo_pere_matthieu_1791655226601.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Dieudonné Agonhossou' },
          { role: 'director', label: 'Réalisateur', name: 'Ayaba Senou' },
          { role: 'camera', label: 'Cadre', name: 'Célestin Kiki' }
        ]
      }
    ]
  },
  {
    id: 'tobi-houndegla',
    slug: 'tobi-houndegla',
    name: 'Tobi Houndegla',
    age: 38,
    role: 'Maître charpentier de pirogues & pêcheur',
    territory: 'Ganvié (Cité lacustre)',
    country: 'Bénin',
    flag: '🇧🇯',
    bio: 'À Ganvié, on dit que Tobi connaît l’âge de chaque pieu d’acajou enfoncé sous la lagune Nokoué. Né sur l’eau, il taille les pirogues qui permettent aux enfants d’aller à l’école et aux marchandes d’atteindre le marché flottant.',
    photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
    documentaryId: 'finagnon-qosqorico',
    universeTag: 'Finagnon',
    quote: '« L’eau ne t’appartient pas : c’est toi qui deviens une goutte de son histoire. Si tu oublies le fond, la vague t’avale. »',
    tree: {
      transmissions: [
        {
          id: 't-4',
          title: 'Le choix des troncs d’iroko flottés',
          ancestorOrMentor: 'Son père Basile Houndegla',
          description: 'Savoir lire les veines du bois pour que la proue fende le courant sans vaciller pendant vingt ans.'
        }
      ],
      duos: [
        {
          id: 'duo-2',
          partnerName: 'Sayri Quispe',
          partnerRole: 'Cultivateur de maïs & tisseur andin',
          partnerPhoto: '/assets/protagonists/sayri-quispe.jpg',
          duoId: 'duo-finagnon-qosqorico-01',
          question: '01 — Chez Soi : Là où le corps reconnaît la terre ou l’onde'
        }
      ],
      opportunities: [
        {
          id: 'o-4',
          title: 'Apprentissage de la charpente navale traditionnelle',
          description: 'Accueil de deux jeunes par an pour transmettre la forge des clous forgés à la main.',
          badge: 'Atelier vivant'
        }
      ],
      creations: [
        {
          id: 'c-4',
          title: 'Pirogues sculptées en modèle réduit pour la mémoire',
          type: 'Artisanat d’art',
          description: 'Modèles fidèles à échelle 1/10e représentant les embarcations historiques du XVIIIe siècle.'
        }
      ],
      projects: [
        {
          id: 'p-3',
          title: 'Restauration des passerelles communes de Ganvié',
          stage: 'Mobilisation communautaire',
          description: 'Chantier participatif pour remplacer les pieux fragilisés avant la crue.'
        }
      ],
      needs: [
        {
          id: 'n-3',
          title: 'Scies à ruban manuelles de précision',
          urgency: 'Modérée',
          description: 'Pour soulager l’effort physique des apprentis lors de l’ébauche des coques.'
        }
      ]
    },
    stories: [
      {
        id: 'story-tobi-01',
        title: 'Le premier coup de pagaie seul',
        questionNumber: '01',
        questionTitle: 'Chez Soi',
        duration: '09:28',
        videoDurationSeconds: 568,
        summary: 'Le jour de ses sept ans, son père l’a laissé seul au milieu de la lagune brumeuse avec une perche de bambou. Ce jour-là, l’effroi s’est métamorphosé en un sentiment d’appartenance absolu.',
        videoCoverUrl: '/assets/protagonists/tobi-houndegla.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Tobi Houndegla' },
          { role: 'director', label: 'Réalisateur', name: 'Mateo Quispe' }
        ]
      }
    ]
  },
  {
    id: 'sayri-quispe',
    slug: 'sayri-quispe',
    name: 'Sayri Quispe Huamán',
    age: 34,
    role: 'Cultivateur de semences anciennes & tisseur Quechua',
    territory: 'Vallée Sacrée / Pisac',
    country: 'Pérou',
    flag: '🇵🇪',
    bio: 'Vivant à 3 600 mètres d’altitude sur les contreforts de la Vallée Sacrée des Incas, Sayri cultive plus de quarante variétés de maïs natif et tisse la laine d’alpaga selon les motifs cosmiques transmis par sa mère.',
    photoUrl: '/assets/protagonists/sayri-quispe.jpg',
    documentaryId: 'finagnon-qosqorico',
    universeTag: 'Qosqorico',
    quote: '« La montagne ne parle pas avec des mots, elle parle avec le vent et la couleur des feuilles de maïs. Si tu es chez toi, tes pieds la comprennent avant ta tête. »',
    tree: {
      transmissions: [
        {
          id: 't-5',
          title: 'Le secret des teintures végétales de la vallée',
          ancestorOrMentor: 'Sa grand-mère Mama Asunta',
          description: 'L’usage de la cochenille et des lichens d’altitude pour fixer des pourpres et des ocres indélébiles.'
        }
      ],
      duos: [
        {
          id: 'duo-2-bis',
          partnerName: 'Tobi Houndegla',
          partnerRole: 'Charpentier de pirogues de Ganvié',
          partnerPhoto: '/assets/protagonists/tobi-houndegla.jpg',
          duoId: 'duo-finagnon-qosqorico-01',
          question: '01 — Chez Soi : Deux mondes reliés par la fidélité à un élément'
        }
      ],
      opportunities: [
        {
          id: 'o-5',
          title: 'Partage de semences paysannes libres',
          description: 'Échange annuel de graines avec les communautés des vallées voisines pour préserver la biodiversité.',
          badge: 'Biodiversité'
        }
      ],
      creations: [
        {
          id: 'c-5',
          title: 'Ponchos d’alpaga teints aux herbes sauvages',
          type: 'Tissage d’exception',
          description: 'Pièces uniques tissées sur métier à ceinture demandant jusqu’à trois mois de travail minutieux.'
        }
      ],
      projects: [
        {
          id: 'p-4',
          title: 'La Banque Communautaire de Semences de Pisac',
          stage: 'Murs d’adobe érigés',
          description: 'Un silo thermique traditionnel pour conserver les semences sans réfrigération électrique.'
        }
      ],
      needs: [
        {
          id: 'n-4',
          title: 'Collecte de mémoire orale en quechua',
          urgency: 'Urgente',
          description: 'Enregistrer les chants de récolte des anciens avant leur disparition.'
        }
      ]
    },
    stories: [
      {
        id: 'story-sayri-01',
        title: 'Le sel de Maras au lever du soleil',
        questionNumber: '01',
        questionTitle: 'Chez Soi',
        duration: '10:14',
        videoDurationSeconds: 614,
        summary: 'Sayri se rappelle la première aurore passée seul sur la terrasse familiale, les doigts engourdis par la gelée matinale, lorsqu’une flûte résonnant au loin a donné une voix à la vallée entière.',
        videoCoverUrl: '/assets/protagonists/sayri-quispe.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Sayri Quispe Huamán' },
          { role: 'director', label: 'Réalisateur', name: 'Mateo Quispe' }
        ]
      }
    ]
  },
  {
    id: 'malik-diop',
    slug: 'malik-diop',
    name: 'Malik Diop',
    age: 31,
    role: 'Orateur civique & leader pour les droits civiques',
    territory: 'Dakar / Paris',
    country: 'Sénégal & France',
    flag: '🇸🇳',
    bio: 'Vêtu d’une élégance impeccable, le poing levé et la parole habitée, Malik incarne la force de conviction du mouvement Blacks One. Un orateur passionné luttant pour l’émancipation, la justice et la souveraineté des récits afro-descendants.',
    photoUrl: '/assets/protagonists/malik-diop.jpg',
    documentaryId: 'blacks-one-beyond-eve',
    universeTag: 'Blacks One',
    quote: '« L’émancipation commence le jour où l’on lève le poing et où l’on refuse de regarder son histoire avec les yeux de ceux qui l’ont confisquée. »',
    tree: {
      transmissions: [
        {
          id: 't-6',
          title: 'Les pas du sabar royal des Lébous',
          ancestorOrMentor: 'Son oncle El Hadj Diop',
          description: 'La cadence des pieds nus sur la terre battue qui raconte l’histoire d’un peuple de pêcheurs insoumis.'
        }
      ],
      duos: [
        {
          id: 'duo-3',
          partnerName: 'Éléonore Vance',
          partnerRole: 'Artiste textile & fondatrice de collectif',
          partnerPhoto: '/assets/protagonists/eleonore-vance.jpg',
          duoId: 'duo-blacks-one-beyond-eve-01',
          question: '03 — Ce que l’on Porte : Ce que l’on a reçu et qu’on ne peut poser'
        }
      ],
      opportunities: [
        {
          id: 'o-6',
          title: 'Résidence tremplin pour danseurs émergents',
          description: 'Bourses de création pour 4 jeunes talents par an à Dakar.',
          badge: 'Tremplin chorégraphique'
        }
      ],
      creations: [
        {
          id: 'c-6',
          title: 'Spectacle vivant « Mémoire de Sable »',
          type: 'Création scénique',
          description: 'Pièce pour 7 danseurs explorant les migrations intérieures et la fierté retrouvée.'
        }
      ],
      projects: [
        {
          id: 'p-5',
          title: 'L’École Buissonnière des Rythmes',
          stage: 'Ateliers itinérants dans les quartiers',
          description: 'Former des médiateurs culturels pour réinvestir les places publiques par la danse.'
        }
      ],
      needs: [
        {
          id: 'n-5',
          title: 'Espaces de répétition sécurisés à Dakar',
          urgency: 'Recherche de partenariats municipaux',
          description: 'Trouver un hangar ou une friche pour les répétitions de la troupe.'
        }
      ]
    },
    stories: [
      {
        id: 'story-malik-01',
        title: 'Le premier cercle sous le réverbère',
        questionNumber: '03',
        questionTitle: 'Ce que l’on Porte',
        duration: '12:10',
        videoDurationSeconds: 730,
        summary: 'Malik raconte l’instant où, rejeté d’une grande audition à Paris pour « manque d’académisme », il a compris que son bagage le plus précieux n’était pas leur validation, mais la pulsation lébou transmise par sa mère.',
        videoCoverUrl: '/assets/protagonists/malik-diop.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Malik Diop' },
          { role: 'director', label: 'Réalisateur', name: 'Kadiatou Bocoum' }
        ]
      }
    ]
  },
  {
    id: 'eleonore-vance',
    slug: 'eleonore-vance',
    name: 'Éléonore Vance',
    age: 39,
    role: 'Oratrice féministe & leader d’émancipation',
    territory: 'Marseille / Abidjan',
    country: 'Côte d’Ivoire & France',
    flag: '🇨🇮',
    bio: 'Parée d’une élégance souveraine, Éléonore porte une parole ardente à la tribune pour la dignité, la puissance et les droits des femmes. À travers le mouvement Beyond Eve, elle livre des discours vibrants qui forgent des boucliers de liberté et de sororité.',
    photoUrl: '/assets/protagonists/eleonore-vance.jpg',
    documentaryId: 'blacks-one-beyond-eve',
    universeTag: 'Beyond Eve',
    quote: '« La liberté des femmes n’attend pas qu’on lui fasse de la place : elle se prend à pleine voix, à la tribune du monde. »',
    tree: {
      transmissions: [
        {
          id: 't-7',
          title: 'Le pagne kita de ma grand-mère Akissi',
          ancestorOrMentor: 'Akissi Vance',
          description: 'L’art de lire les motifs de royauté qui n’étaient jamais prononcés à voix haute.'
        }
      ],
      duos: [
        {
          id: 'duo-3-bis',
          partnerName: 'Malik Diop',
          partnerRole: 'Chorégraphe',
          partnerPhoto: '/assets/protagonists/malik-diop.jpg',
          duoId: 'duo-blacks-one-beyond-eve-01',
          question: '03 — Ce que l’on Porte : Récits cousus dans la chair'
        }
      ],
      opportunities: [
        {
          id: 'o-7',
          title: 'Mentorat artistique pour femmes plasticiennes',
          description: 'Accompagnement annuel de 3 jeunes diplômées dans la structuration de leur démarche.',
          badge: 'Mentorat'
        }
      ],
      creations: [
        {
          id: 'c-7',
          title: 'Tapisserie « Les Noms Oubliés »',
          type: 'Œuvre textile',
          description: 'Fresque de 4 mètres de haut brodée à la main avec les noms des aïeules disparues.'
        }
      ],
      projects: [
        {
          id: 'p-6',
          title: 'La Maison Beyond Eve Marseille',
          stage: 'Recherche de lieu pérenne',
          description: 'Un atelier partagé réunissant des artisanes de la Méditerranée et d’Afrique de l’Ouest.'
        }
      ],
      needs: [
        {
          id: 'n-6',
          title: 'Métier à tisser horizontal grand format',
          urgency: 'En cours',
          description: 'Recherche d’un artisan menuisier pour concevoir un métier adapté aux pièces de 5 mètres.'
        }
      ]
    },
    stories: [
      {
        id: 'story-eleonore-01',
        title: 'Le coffre de fer d’Abidjan',
        questionNumber: '03',
        questionTitle: 'Ce que l’on Porte',
        duration: '11:45',
        videoDurationSeconds: 705,
        summary: 'À la mort de sa mère, Éléonore a ouvert la vieille malle en fer blanc conservée sous le lit. Y reposaient trois pagnes usés jusqu’à la corde, témoins muets de quarante ans de dignité discrète.',
        videoCoverUrl: '/assets/protagonists/eleonore-vance.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Éléonore Vance' },
          { role: 'director', label: 'Réalisatrice', name: 'Kadiatou Bocoum' }
        ]
      }
    ]
  },
  {
    id: 'chef-koffi',
    slug: 'chef-koffi',
    name: 'Chef Koffi Mensah',
    age: 44,
    role: 'Artisan cuisinier de rue & chercheur de goûts',
    territory: 'Cotonou (Dantokpa)',
    country: 'Bénin',
    flag: '🇧🇯',
    bio: 'Au cœur du grand marché de Dantokpa, Koffi cuisine depuis l’aube sur des réchauds à braises. Il sublime l’igname pilée, les sauces gombo aux écrevisses fumées et les bouillons mijotés 14 heures pour nourrir plus de trois cents personnes par jour.',
    photoUrl: '/assets/protagonists/chef-koffi.jpg',
    documentaryId: 'dixeat-fiat-luxe',
    universeTag: 'Sweet Street',
    quote: '« La cuisine n’a pas besoin d’étoiles : elle a besoin de bras qui n’ont pas peur de la fumée et d’un cœur qui veut rassasier l’âme. »',
    tree: {
      transmissions: [
        {
          id: 't-8',
          title: 'Le secret du piment noir confit',
          ancestorOrMentor: 'Sa tante Da Tété',
          description: 'La cuisson lente au feu de coque de coco qui donne cette rondeur fumée incomparable.'
        }
      ],
      duos: [
        {
          id: 'duo-4',
          partnerName: 'Hélène de Saint-Amand',
          partnerRole: 'Maître d’hôtel & scénographe sensorielle',
          partnerPhoto: '/assets/protagonists/helene-saint-amand.jpg',
          duoId: 'duo-dixeat-fiat-luxe-01',
          question: '01 — Le Goût : Quand l’émotion traverse la première bouchée'
        }
      ],
      opportunities: [
        {
          id: 'o-8',
          title: 'Formation gratuite des jeunes du quartier aux bases culinaires',
          description: 'Chaque semestre, Koffi prend 3 apprentis sans qualification pour leur transmettre un métier noble.',
          badge: 'Apprentissage solidaire'
        }
      ],
      creations: [
        {
          id: 'c-8',
          title: 'Pâte d’épices de brousse en pots de terre cuite',
          type: 'Condiment signature',
          description: 'Mélange fermenté de graines de néré, piment doux et sel de lagune séché au soleil.'
        }
      ],
      projects: [
        {
          id: 'p-7',
          title: 'La Cantine Populaire Zéro Déchet de Dantokpa',
          stage: 'Recherche de matériel inox',
          description: 'Créer un point de distribution alimentaire pour les portefaix du marché avec récupération des surplus maraîchers.'
        }
      ],
      needs: [
        {
          id: 'n-7',
          title: 'Fours à basse consommation de bois',
          urgency: 'Prioritaire',
          description: 'Remplacer les foyers ouverts pour préserver la santé pulmonaire des cuisinières.'
        }
      ]
    },
    stories: [
      {
        id: 'story-koffi-01',
        title: 'Le bol d’igname au milieu de l’orage',
        questionNumber: '01',
        questionTitle: 'Le Goût',
        duration: '08:52',
        videoDurationSeconds: 532,
        summary: 'Koffi raconte ce soir de déluge où un voyageur sans le sou, trempé jusqu’aux os, s’est effondré en larmes devant sa marmite fumante après avoir goûté sa sauce gboma.',
        videoCoverUrl: '/assets/protagonists/chef-koffi.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Chef Koffi Mensah' },
          { role: 'director', label: 'Réalisateur', name: 'Adrien Vasseur' }
        ]
      }
    ]
  },
  {
    id: 'helene-saint-amand',
    slug: 'helene-saint-amand',
    name: 'Hélène de Saint-Amand',
    age: 52,
    role: 'Maître d’hôtel, scénographe de table & créatrice d’expériences',
    territory: 'Paris / Marrakech',
    country: 'France',
    flag: '🇫🇷',
    bio: 'Passée par les palaces parisiens et les riads d’exception de Marrakech, Hélène conçoit l’hospitalité comme une dramaturgie invisible. Pour elle, la lumière d’une bougie, l’inclinaison d’un verre ou le silence d’un accueil constituent le véritable luxe.',
    photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
    documentaryId: 'dixeat-fiat-luxe',
    universeTag: 'Fiat Luxe',
    quote: '« Le luxe n’est pas ce qui brille : c’est l’attention totale portée à l’instant où quelqu’un pose enfin son fardeau pour se laisser nourrir. »',
    tree: {
      transmissions: [
        {
          id: 't-9',
          title: 'L’art du pas feutré et du regard périphérique',
          ancestorOrMentor: 'Monsieur François, Premier Maître d’Hôtel au Ritz (1975)',
          description: 'Devancer le désir d’un convive sans jamais imposer sa présence physique.'
        }
      ],
      duos: [
        {
          id: 'duo-4-bis',
          partnerName: 'Chef Koffi Mensah',
          partnerRole: 'Cuisinier de rue',
          partnerPhoto: '/assets/protagonists/chef-koffi.jpg',
          duoId: 'duo-dixeat-fiat-luxe-01',
          question: '01 — Le Goût : Deux artisans de l’instant précieux'
        }
      ],
      opportunities: [
        {
          id: 'o-9',
          title: 'Masterclass sur la mémoire olfactive et la réception',
          description: 'Sessions trimestrielles pour jeunes professionnels de l’hôtellerie d’art.',
          badge: 'Masterclass'
        }
      ],
      creations: [
        {
          id: 'c-9',
          title: 'Verrerie soufflée à la bouche « Larmes d’Atlas »',
          type: 'Art de la table',
          description: 'Série limitée conçue avec les maîtres verriers de Marrakech.'
        }
      ],
      projects: [
        {
          id: 'p-8',
          title: 'Le Dîner Silencieux au Jardin Majorelle',
          stage: 'Production en cours',
          description: 'Une expérience gastronomique nocturne où les convives dégustent sans un mot au son de la brise.'
        }
      ],
      needs: [
        {
          id: 'n-8',
          title: 'Sourcing de lin brut biologique non blanchi',
          urgency: 'En cours',
          description: 'Trouver une filature artisanale respectant le cycle végétal sans apprêt chimique.'
        }
      ]
    },
    stories: [
      {
        id: 'story-helene-01',
        title: 'Le verre d’eau offert sans un mot',
        questionNumber: '01',
        questionTitle: 'Le Goût',
        duration: '10:48',
        videoDurationSeconds: 648,
        summary: 'Hélène se souvient d’un grand dîner d’État où le geste le plus marquant ne fut pas le caviar servi, mais une simple coupe d’eau de source tiède infusée à la feuille d’oranger, apportée à une femme terrifiée par la foule.',
        videoCoverUrl: '/assets/protagonists/helene-saint-amand.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Hélène de Saint-Amand' },
          { role: 'director', label: 'Réalisateur', name: 'Adrien Vasseur' }
        ]
      }
    ]
  },
  {
    id: 'fatou-diallo',
    slug: 'fatou-diallo',
    name: 'Fatou Diallo',
    age: 42,
    role: 'Investisseuse à impact & mécène',
    territory: 'Dakar & Paris',
    country: 'Sénégal',
    flag: '🇸🇳',
    bio: 'Pionnière de l’investissement à impact, Fatou finance des ateliers artisanaux, des coopératives agricoles et des infrastructures régénératrices à travers l’Afrique de l’Ouest.',
    photoUrl: '/assets/duos/fatou-diallo.jpg',
    documentaryId: 'investors-builders',
    universeTag: 'Investors',
    quote: '« Investir, ce n’est pas acheter l’avenir, c’est donner les moyens au présent de s’enraciner. »',
    tree: {
      passeurs: [
        {
          id: 'p-amadou',
          name: 'Amadou Kane',
          role: 'Banquier de développement solidaire',
          country: 'Sénégal',
          photo: '/assets/protagonists/eleonore-vance.jpg'
        }
      ],
      heritiers: [
        {
          id: 'h-mariama',
          name: 'Mariama Fall',
          role: 'Analyste d’impact environnemental',
          country: 'Sénégal',
          photo: '/assets/protagonists/fatou-diallo.jpg'
        }
      ],
      transmissions: [
        {
          id: 't-fatou-1',
          title: 'Le discernement du capital patient',
          ancestorOrMentor: 'Amadou Kane, mentor en microfinance rurale',
          description: 'Savoir attendre sept récoltes avant de juger de la fécondité d’une semence économique.'
        }
      ],
      duos: [
        {
          id: 'duo-fatou-kwame-ref',
          partnerName: 'Kwame',
          partnerRole: 'Éco-constructeur & bâtisseur de terre',
          partnerPhoto: '/assets/duos/kwame-mensah.jpg',
          duoId: 'duo-investors-builders-01',
          question: '« Que vaut le capital sans la sueur de celui qui bâtit ? »'
        }
      ],
      creations: [
        {
          id: 'c-fatou-1',
          title: 'Fonds d’Amorçage Terres Fertiles',
          type: 'Dotation solidaire',
          description: 'Financement patient pour les chantiers de construction en terre crue et matériaux biosourcés.'
        }
      ],
      projects: [
        {
          id: 'p-fatou-1',
          title: 'Manufacture Sahélienne de Briques de Terre Compressée',
          stage: 'En chantier (68%)',
          description: 'Production locale de matériaux décarbonés pour l’habitat populaire.'
        }
      ],
      opportunities: [
        {
          id: 'o-fatou-1',
          title: 'Appel à projets Bâtisseurs Régénératifs',
          description: 'Dotation d’amorçage jusqu’à 50 000 € pour les coopératives d’éco-matériaux.',
          badge: 'Candidatures ouvertes'
        }
      ],
      needs: [
        {
          id: 'n-fatou-1',
          title: 'Experts en certification thermique des terres locales',
          urgency: 'Prioritaire',
          description: 'Recherche de laboratoires partenaires pour homologuer les blocs de latérite et pisé.'
        }
      ]
    },
    stories: [
      {
        id: 'story-fatou-01',
        title: 'Le premier chèque signé sur une table de chantier',
        questionNumber: '01',
        questionTitle: 'Le Pari Fondateur',
        duration: '08:15',
        videoDurationSeconds: 495,
        summary: 'Fatou raconte le jour où elle a décidé de risquer ses premières économies pour soutenir un atelier de menuiserie villageois dont les banques ne voulaient pas.',
        videoCoverUrl: '/assets/duos/fatou-diallo.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Fatou Diallo' }
        ]
      }
    ]
  },
  {
    id: 'kwame-mensah',
    slug: 'kwame-mensah',
    name: 'Kwame Mensah',
    age: 38,
    role: 'Éco-constructeur & bâtisseur de terre',
    territory: 'Cotonou & Kigali',
    country: 'Bénin',
    flag: '🇧🇯',
    bio: 'Ingénieur et artisan de la terre crue, Kwame réinvente les techniques ancestrales de construction pour bâtir des cités fraîches, durables et accessibles à tous.',
    photoUrl: '/assets/duos/kwame-mensah.jpg',
    documentaryId: 'investors-builders',
    universeTag: 'Builders',
    quote: '« La terre ne ment pas. Elle ne demande qu’un toit pour la protéger et une main pour la tasser. »',
    tree: {
      passeurs: [
        {
          id: 'p-kofi',
          name: 'Maître Kofi Annan',
          role: 'Maçon traditionnel de voûtes nubiennes',
          country: 'Ghana',
          photo: '/assets/protagonists/helene-saint-amand.jpg'
        }
      ],
      heritiers: [
        {
          id: 'h-junior',
          name: 'Sena Houndété',
          role: 'Apprenti maçon en terre battue',
          country: 'Bénin',
          photo: '/assets/protagonists/koffi-tisserand.jpg'
        }
      ],
      transmissions: [
        {
          id: 't-kwame-1',
          title: 'L’art du pisé sans adjuvant chimique',
          ancestorOrMentor: 'Maître Kofi, artisan de la terre',
          description: 'Savoir doser l’argile et le sable par le toucher et le séchage au soleil levant.'
        }
      ],
      duos: [
        {
          id: 'duo-kwame-fatou-ref',
          partnerName: 'Fatou',
          partnerRole: 'Investisseuse à impact & mécène',
          partnerPhoto: '/assets/duos/fatou-diallo.jpg',
          duoId: 'duo-investors-builders-01',
          question: '« Que vaut le capital sans la sueur de celui qui bâtit ? »'
        }
      ],
      creations: [
        {
          id: 'c-kwame-1',
          title: 'Briques de terre compressée stabilisée (BTC)',
          type: 'Matériau éco-conçu',
          description: 'Blocs porteurs régulateurs thermiques pour constructions bioclimatiques.'
        }
      ],
      projects: [
        {
          id: 'p-kwame-1',
          title: 'Écocentre d’Apprentissage de Ouidah',
          stage: 'En cours (82%)',
          description: 'Complexe de formation aux métiers de la terre crue et du bambou.'
        }
      ],
      opportunities: [
        {
          id: 'o-kwame-1',
          title: 'Chantier-école Voûtes & Pisé d’Afrique de l’Ouest',
          description: 'Session de formation pratique de 4 semaines ouverte à 15 apprentis maçons et architectes.',
          badge: 'Inscriptions ouvertes'
        }
      ],
      needs: [
        {
          id: 'n-kwame-1',
          title: 'Presse hydraulique manuelle pour briques de terre compressée',
          urgency: 'Immédiat',
          description: 'Acquisition d’une seconde presse pour doubler la cadence du chantier de Ouidah.'
        }
      ]
    },
    stories: [
      {
        id: 'story-kwame-01',
        title: 'Quand le mur a tenu la première mousson',
        questionNumber: '01',
        questionTitle: 'Le Pari Fondateur',
        duration: '09:20',
        videoDurationSeconds: 560,
        summary: 'Kwame relate l’angoisse de sa première voûte nubienne inaugurée la veille d’une tornade tropicale, et la fierté de voir la bâtisse intacte au matin.',
        videoCoverUrl: '/assets/duos/kwame-mensah.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Kwame Mensah' }
        ]
      }
    ]
  },
  {
    id: 'codjo-blind',
    slug: 'codjo-blind',
    name: 'Pascal Cossy',
    firstName: 'Pascal',
    age: 36,
    role: 'Président de « Voir Autrement » & Prêtre du Fâ',
    territory: 'Ganvié & Cotonou',
    country: 'Bénin',
    flag: '🇧🇯',
    bio: 'Non-voyant depuis l’enfance, Pascal Cossy préside l’association « Voir Autrement », dédiée à l’émancipation, la formation et l’inclusion des personnes en situation de handicap à travers des ateliers d’artisanat. Prêtre du Fâ et maître d’écoute vibratoire, il éclaire les chemins de vie et révèle une perception du monde invisible aux yeux physiques.',
    photoUrl: '/assets/duos/codjo-blind.jpg',
    documentaryId: 'other-eyes-sixth-sense',
    universeTag: 'Other Sights',
    quote: '« Vos yeux s’arrêtent aux formes. Mes oreilles, mon cœur et la sagesse du Fâ pénètrent l’épaisseur vivante de l’air et la cadence secrète du destin. »',
    tree: {
      passeurs: [
        {
          id: 'p-ahouan',
          name: 'Vieux Ahouan',
          role: 'Pêcheur nocturne & passeur d’échos',
          country: 'Bénin',
          photo: '/assets/duos/tobi-ganvie.jpg'
        }
      ],
      heritiers: [
        {
          id: 'h-cecile',
          name: 'Cécile Kpadonou',
          role: 'Artisane maroquinière & créatrice de sacs en perles',
          country: 'Bénin',
          photo: '/assets/images/kpedetin_joailliere_1792933718361.jpg'
        },
        {
          id: 'h-norbert',
          name: 'Norbert Houessou',
          role: 'Maître menuisier & sculpteur de tabourets traditionnels',
          country: 'Bénin',
          photo: '/assets/images/dossou_logistique_1792933781153.jpg'
        }
      ],
      transmissions: [
        {
          id: 't-codjo-1',
          title: 'L’écholocalisation aquatique & Sagesse du Fâ',
          ancestorOrMentor: 'Vieux Ahouan & Maîtres Babalawo',
          description: 'Savoir lire la profondeur de l’eau au seul claquement de la rame et déchiffrer les signes bienveillants du destin.'
        }
      ],
      duos: [
        {
          id: 'duo-codjo-mawuna-ref',
          partnerName: 'Mawuna',
          partnerRole: 'Voyante & guérisseuse d’âmes',
          partnerPhoto: '/assets/duos/mawuna-medium.jpg',
          duoId: 'duo-other-eyes-sixth-sense-01',
          question: '« Que voit-on quand le monde ferme les yeux ? »'
        }
      ],
      creations: [
        {
          id: 'c-codjo-1',
          title: 'Consultations traditionnelles de Fâ',
          type: 'Sagesse & Guidance',
          description: 'Séances de consultation du Fâ pour éclairer les décisions de vie, l’harmonie familiale et les transitions.'
        },
        {
          id: 'c-codjo-2',
          title: 'Archives sonores de la lagune Nokoué',
          type: 'Création acoustique',
          description: 'Enregistrements immersifs des vents, des rames et des chants nocturnes de Ganvié.'
        }
      ],
      projects: [
        {
          id: 'p-codjo-1',
          title: 'Espace d’Accueil & Ateliers « Voir Autrement »',
          stage: 'Financement participatif en cours (65%)',
          description: 'Construction d’un centre d’accueil, d’apprentissage et de vente d’artisanat adapté aux personnes en situation de handicap.'
        }
      ],
      opportunities: [
        {
          id: 'o-codjo-1',
          title: 'Exposition & Vente d’Artisanat Solidaire',
          description: 'Partenariat avec des espaces culturels pour exposer les sacs de Cécile et les tabourets de Norbert.',
          badge: 'Ouvert'
        }
      ],
      needs: [
        {
          id: 'n-codjo-1',
          title: 'Matériaux de tissage & outillage bois adapté',
          urgency: 'Prioritaire',
          description: 'Soutien en perles, fils renforcés et outils de menuiserie sécurisés pour les artisans de Voir Autrement.'
        }
      ]
    },
    stories: [
      {
        id: 'story-codjo-01',
        title: 'Traverser la lagune dans la nuit noire sans lanterne',
        questionNumber: '01',
        questionTitle: 'La Vision Intérieure',
        duration: '07:45',
        videoDurationSeconds: 465,
        summary: 'Pascal raconte cette nuit de tornade où toutes les lampes s’étaient éteintes, et comment il a ramené les pêcheurs à bon port grâce à l’écho du clocher de Ganvié.',
        videoCoverUrl: '/assets/duos/codjo-blind.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Pascal Cossi' }
        ]
      }
    ]
  },
  {
    id: 'mawuna-medium',
    slug: 'mawuna-medium',
    name: 'Mawuna Houénou',
    age: 44,
    role: 'Voyante, médium & guérisseuse d’âmes',
    territory: 'Ouidah & Abomey',
    country: 'Bénin',
    flag: '🇧🇯',
    bio: 'Sensible aux vibrations et aux mémoires invisibles depuis son initiation au bord de la lagune sacrée de Ouidah, Mawuna capte les auras et les résonances intimes. Elle aide à réconcilier les mémoires blessées et à discerner les carrefours du destin.',
    photoUrl: '/assets/duos/mawuna-medium.jpg',
    documentaryId: 'other-eyes-sixth-sense',
    universeTag: 'Third Eye',
    quote: '« L’invisible n’est pas une absence, c’est une présence trop subtile pour le regard distrait. Le cœur doit apprendre à écouter ce que les yeux ne peuvent enfermer. »',
    tree: {
      passeurs: [
        {
          id: 'p-daagbo',
          name: 'Prêtresse Na Agbessi',
          role: 'Matriarche guérisseuse de Ouidah',
          country: 'Bénin',
          photo: '/assets/images/ayaba_nectar_1792933764727.jpg'
        }
      ],
      heritiers: [
        {
          id: 'h-kessi',
          name: 'Kessi Houndété',
          role: 'Apprentie herboriste et voyante',
          country: 'Bénin',
          photo: '/assets/images/senan_innovatrice_1792933679487.jpg'
        }
      ],
      transmissions: [
        {
          id: 't-mawuna-1',
          title: 'L’écoute des souffles et des présences',
          ancestorOrMentor: 'Na Agbessi, doyenne de Ouidah',
          description: 'Distinguer les pensées fugaces des murmures ancestraux à travers le silence de l’aube.'
        }
      ],
      duos: [
        {
          id: 'duo-mawuna-codjo-ref',
          partnerName: 'Pascal',
          partnerRole: 'Navigateur sonore & sculpteur de sons',
          partnerPhoto: '/assets/duos/codjo-blind.jpg',
          duoId: 'duo-other-eyes-sixth-sense-01',
          question: '« Que voit-on quand le monde ferme les yeux ? »'
        }
      ],
      creations: [
        {
          id: 'c-mawuna-1',
          title: 'Sanctuaire de recueillement et de paix',
          type: 'Espace d’apaisement',
          description: 'Lieu de méditation à Ouidah dédié à l’écoute des âmes et à la réconciliation intime.'
        }
      ],
      projects: [
        {
          id: 'p-mawuna-1',
          title: 'Cercle de parole des sens invisibles',
          stage: 'Actif (80%)',
          description: 'Rencontres mensuelles pour explorer l’intuition et le discernement du cœur.'
        }
      ],
      opportunities: [
        {
          id: 'o-mawuna-1',
          title: 'Ateliers de transmission de la sagesse intuitive',
          description: 'Formation ouverte aux personnes en quête d’équilibre intérieur.',
          badge: 'Ouvert'
        }
      ],
      needs: [
        {
          id: 'n-mawuna-1',
          title: 'Jardin conservatoire des plantes sacrées médicinales',
          urgency: 'Prioritaire',
          description: 'Protection de la flore médicinale traditionnelle menacée d’Ouidah.'
        }
      ]
    },
    stories: [
      {
        id: 'story-mawuna-01',
        title: 'Le voile levé sur la mémoire des carrefours',
        questionNumber: '01',
        questionTitle: 'La Vision Intérieure',
        duration: '08:20',
        videoDurationSeconds: 500,
        summary: 'Mawuna partage le moment où elle a cessé de craindre les songes et les voix de l’invisible pour en faire un pont de paix entre les êtres.',
        videoCoverUrl: '/assets/duos/mawuna-medium.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Mawuna Houénou' }
        ]
      }
    ]
  },
  {
    id: 'coach-marc',
    slug: 'coach-marc',
    name: 'Marc Valmont',
    firstName: 'Marc',
    age: 48,
    role: 'Mentor de haute performance & Stratège mental',
    country: 'France',
    territory: 'Paris & Diaspora',
    flag: '🇫🇷',
    photo: '/assets/duos/coach-office.jpg',
    photoUrl: '/assets/duos/coach-office.jpg',
    videoPreviewUrl: '/sample.mp4',
    teaserVideoUrl: '/sample.mp4',
    quote: '« Chaque barrière mentale que l’on fait tomber dans le calme d’un bureau déverrouille dix victoires sur le terrain. »',
    bio: 'Ancien conseiller de dirigeants et d’athlètes de classe mondiale, Marc a consacré vingt ans à explorer la mécanique invisible de la confiance et du rebond psychologique.',
    universeTag: 'Coaching',
    centralQuestion: 'Comment forger une volonté inébranlable sans détruire la vulnérabilité qui fait notre humanité ?',
    storiesCount: 4,
    transmissionsCount: 3,
    projectsCount: 2,
    socialLinks: { linkedin: 'https://linkedin.com' },
    details: {
      bioExtended: 'Dans son cabinet baigné de lumière douce, Marc reçoit ceux qui s’apprêtent à franchir des seuils décisifs. Son approche combine écoute maïeutique et rigueur stratégique.',
      universeDescription: 'L’antre de la préparation mentale et de l’alignement des ambitions.',
      transmissions: [
        {
          id: 't-marc-1',
          title: 'L’art de la recalibration émotionnelle',
          ancestorOrMentor: 'Professeur Albert Kahn',
          description: 'Transformer la peur de l’échec en carburant de précision.'
        }
      ],
      duos: [
        {
          id: 'duo-marc-lagat-ref',
          partnerName: 'Aïcha Lagat',
          partnerRole: 'Athlète de saut de haies',
          partnerPhoto: '/assets/duos/athlete-hurdle.jpg',
          duoId: 'duo-coaching-unlimited-01',
          question: '« Quelle certitude silencieuse répétez-vous au moment de flancher ? »'
        }
      ],
      creations: [
        {
          id: 'c-marc-1',
          title: 'Méthode du Pivot Intérieur',
          type: 'Protocole de coaching',
          description: 'Guide pratique pour déjouer le syndrome de l’imposteur en compétition.'
        }
      ],
      projects: [],
      opportunities: [],
      needs: []
    },
    stories: [
      {
        id: 'story-coach-marc-01',
        title: 'Le silence avant la décision',
        questionNumber: '01',
        questionTitle: 'L’Obstacle',
        duration: '07:45',
        videoDurationSeconds: 465,
        summary: 'Marc partage la séance où un champion brisé a retrouvé le désir de s’entraîner après trois ans de doute.',
        videoCoverUrl: '/assets/duos/coach-office.jpg',
        credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Marc Valmont' }]
      }
    ]
  },
  {
    id: 'athlete-lagat',
    slug: 'athlete-lagat',
    name: 'Aïcha Lagat',
    firstName: 'Aïcha',
    age: 26,
    role: 'Athlète internationale de saut de haies & Recordwoman',
    country: 'Kenya',
    territory: 'Nairobi & Lausanne',
    flag: '🇰🇪',
    photo: '/assets/duos/athlete-hurdle.jpg',
    photoUrl: '/assets/duos/athlete-hurdle.jpg',
    videoPreviewUrl: '/sample.mp4',
    teaserVideoUrl: '/sample.mp4',
    quote: '« La haie n’est pas un mur : c’est une invitation à voler une fraction de seconde de plus. »',
    bio: 'Championne d’Afrique du 400m haies, Aïcha incarne la persévérance absolue et l’élégance du geste sous la pression des grands stades.',
    universeTag: 'Sans Limites',
    centralQuestion: 'Jusqu’où le corps peut-il obéir à la soif infinie de transcendance ?',
    storiesCount: 5,
    transmissionsCount: 2,
    projectsCount: 3,
    details: {
      bioExtended: 'Née sur les hauts plateaux de la vallée du Rift, Aïcha s’entraîne à l’aube quand le givre recouvre encore le tartan.',
      universeDescription: 'Le monde de l’effort sans concession et de la quête de perfection athlétique.',
      transmissions: [],
      duos: [
        {
          id: 'duo-lagat-marc-ref',
          partnerName: 'Marc Valmont',
          partnerRole: 'Mentor de performance',
          partnerPhoto: '/assets/duos/coach-office.jpg',
          duoId: 'duo-coaching-unlimited-01',
          question: '« Quelle certitude silencieuse répétez-vous au moment de flancher ? »'
        }
      ],
      creations: [],
      projects: [],
      opportunities: [],
      needs: []
    },
    stories: [
      {
        id: 'story-athlete-lagat-01',
        title: 'Le franchissement du dixième obstacle',
        questionNumber: '01',
        questionTitle: 'L’Obstacle',
        duration: '06:30',
        videoDurationSeconds: 390,
        summary: 'Aïcha raconte la finale des championnats du monde où un faux pas à la 8e haie l’a obligée à réinventer sa foulée en plein vol.',
        videoCoverUrl: '/assets/duos/athlete-hurdle.jpg',
        credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Aïcha Lagat' }]
      }
    ]
  },
  {
    id: 'photographer-clara',
    slug: 'photographer-clara',
    name: 'Clara Valmont',
    firstName: 'Clara',
    age: 38,
    role: 'Photographe documentaire & Reporter visuelle',
    country: 'France & Sénégal',
    territory: 'Paris & Dakar',
    flag: '🇫🇷',
    photo: '/assets/duos/photographer-focus.jpg',
    photoUrl: '/assets/duos/photographer-focus.jpg',
    videoPreviewUrl: '/sample.mp4',
    teaserVideoUrl: '/sample.mp4',
    quote: '« Le cadre n’enferme pas le monde : il l’oblige à se révéler. Quand tu presses le déclencheur, tu ne voles pas une image, tu reçois une confidence. »',
    bio: 'Quinze ans de reportages au long cours à travers le Sahel et les mégapoles contemporaines, explorant les résonances intimes entre mémoire et territoire.',
    universeTag: 'Focus',
    centralQuestion: 'Comment capturer l’âme d’un instant sans trahir la pudeur de celui qui vous regarde ?',
    storiesCount: 6,
    transmissionsCount: 4,
    projectsCount: 2,
    details: {
      bioExtended: 'Clara parcourt les territoires en immersion lente avec ses boîtiers manuels et son laboratoire de tirage nomade, donnant la parole aux anonymes.',
      universeDescription: 'L’art de l’observation patiente, du cadre juste et de la lumière naturelle.',
      transmissions: [],
      duos: [
        {
          id: 'duo-clara-eleonore-ref',
          partnerName: 'Dre. Éléonore Kaboré',
          partnerRole: 'Chercheuse en sciences cognitives',
          partnerPhoto: '/assets/duos/researcher-phd.jpg',
          duoId: 'duo-focus-phd-01',
          question: '« Quel a été ce moment précis où votre travail a fait surgir une vérité qui a transformé votre regard ? »'
        }
      ],
      creations: [],
      projects: [],
      opportunities: [],
      needs: []
    },
    stories: [
      {
        id: 'story-photographer-clara-01',
        title: 'L’ombre portée du pêcheur de Saint-Louis',
        questionNumber: '01',
        questionTitle: 'L’Instant de Révélation',
        duration: '09:10',
        videoDurationSeconds: 550,
        summary: 'Clara raconte l’attente de trois jours sur le fleuve Sénégal pour saisir le geste ancestral d’un lanceur d’épervier à l’aube.',
        videoCoverUrl: '/assets/duos/photographer-focus.jpg',
        credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Clara Valmont' }]
      }
    ]
  },
  {
    id: 'researcher-eleonore',
    slug: 'researcher-eleonore',
    name: 'Dre. Éléonore Kaboré',
    firstName: 'Éléonore',
    age: 42,
    role: 'Docteure en sciences cognitives & Chercheuse',
    country: 'Burkina Faso & France',
    territory: 'Ouagadougou & Lyon',
    flag: '🇧🇫',
    photo: '/assets/duos/researcher-phd.jpg',
    photoUrl: '/assets/duos/researcher-phd.jpg',
    videoPreviewUrl: '/sample.mp4',
    teaserVideoUrl: '/sample.mp4',
    quote: '« Une thèse n’est pas un diplôme qu’on accroche : c’est une promesse faite au réel de ne jamais se contenter des apparences ni des réponses faciles. »',
    bio: 'Formée entre Ouagadougou et Lyon, elle allie enquêtes de terrain et modélisation complexe pour comprendre la transmission des savoirs et la résilience collective.',
    universeTag: 'PhD',
    centralQuestion: 'Combien de nuits d’incertitude faut-il traverser avant qu’une intuition ne devienne une certitude démontrable ?',
    storiesCount: 5,
    transmissionsCount: 3,
    projectsCount: 4,
    details: {
      bioExtended: 'Dans le silence de son bureau universitaire entourée de livres rares et de données statistiques, elle traque les vérités mathématiques et humaines.',
      universeDescription: 'La recherche fondamentale, l’élaboration des théories et la rigueur méthodique.',
      transmissions: [],
      duos: [
        {
          id: 'duo-eleonore-clara-ref',
          partnerName: 'Clara Valmont',
          partnerRole: 'Photographe documentaire',
          partnerPhoto: '/assets/duos/photographer-focus.jpg',
          duoId: 'duo-focus-phd-01',
          question: '« Quel a été ce moment précis où votre travail a fait surgir une vérité qui a transformé votre regard ? »'
        }
      ],
      creations: [],
      projects: [],
      opportunities: [],
      needs: []
    },
    stories: [
      {
        id: 'story-researcher-eleonore-01',
        title: 'L’équation qui répare les silences',
        questionNumber: '01',
        questionTitle: 'L’Instant de Révélation',
        duration: '08:15',
        videoDurationSeconds: 495,
        summary: 'Éléonore partage la nuit où, après des années de calculs, sa thèse a prouvé une corrélation inattendue entre les contes oraux et l’apprentissage cognitif.',
        videoCoverUrl: '/assets/duos/researcher-phd.jpg',
        credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Dre. Éléonore Kaboré' }]
      }
    ]
  }
];

const RAW_DUOS: Duo[] = [
  {
    id: 'duo-jesus-legba-01',
    slug: 'duo-jesus-legba-01',
    documentaryId: 'vodun-rays-autre-foi',
    documentaryTitle: 'Vodun Rays <> Autre Foi',
    episodeNumber: 'ÉPISODE 01',
    protagonistA: PROTAGONISTS.find(p => p.id === 'dah-zounon') || PROTAGONISTS[2],
    protagonistB: PROTAGONISTS.find(p => p.id === 'pere-matthieu') || PROTAGONISTS[3],
    questionNumber: '01',
    questionTitle: 'La Présence',
    centralQuestion: 'Qu’est-ce qui, un jour, vous a fait sentir que quelque chose de plus grand que vous était présent ?',
    quoteA: '« Ce n’était pas un coup de tonnerre. C’était la chaleur d’une poignée de terre d’Allada, un jour où je croyais que le monde était mort. »',
    quoteB: '« Je suis entré dans la nef déserte pour fuir la brûlure du soleil. Ce n’est pas un miracle qui m’a retenu : c’était la certitude d’être attendu. »',
    coverImage: encodeURI('/Posters/Vodun Rays ‹ › Autre Foi.png'),
    storyA: (PROTAGONISTS.find(p => p.id === 'dah-zounon') || PROTAGONISTS[2]).stories[0],
    storyB: (PROTAGONISTS.find(p => p.id === 'pere-matthieu') || PROTAGONISTS[3]).stories[0],
    editorialReflection: 'Deux traditions que l’histoire a parfois opposées se découvrent ici une racine commune : l’humilité de l’homme devant ce qui le dépasse et l’impérieuse nécessité de ne pas traverser l’obscurité seul.'
  },
  {
    id: 'duo-finagnon-qosqorico-01',
    slug: 'duo-finagnon-qosqorico-01',
    documentaryId: 'finagnon-qosqorico',
    documentaryTitle: 'Bénin ‹ › Le Monde',
    episodeNumber: 'ÉPISODE 01',
    protagonistA: PROTAGONISTS.find(p => p.id === 'tobi-houndegla') || PROTAGONISTS[0],
    protagonistB: PROTAGONISTS.find(p => p.id === 'sayri-quispe') || PROTAGONISTS[1],
    questionNumber: '01',
    questionTitle: 'Le Pays Unique',
    centralQuestion: 'Racontez un moment où vous avez compris ce qui rend votre pays unique.',
    quoteA: '« Le jour où la pirogue a glissé dans la brume sans que j’aie besoin de regarder le rivage. Ganvié n’est pas sur la terre, mais elle est dans mon sang. »',
    quoteB: '« Quand les pieds nus touchent la roche glacée de Pisac à l’aube et que la montagne souffle son premier vent. Là, tu sais que tu n’es pas un étranger. »',
    coverImage: '/assets/posters/benin-monde.jpg',
    storyA: (PROTAGONISTS.find(p => p.id === 'tobi-houndegla') || PROTAGONISTS[0]).stories[0],
    storyB: (PROTAGONISTS.find(p => p.id === 'sayri-quispe') || PROTAGONISTS[1]).stories[0],
    editorialReflection: 'Des pilotis de Ganvié aux terrasses de Pisac, le chez-soi n’est pas une propriété cadastrale : c’est une fidélité organique au rythme d’un élément — l’eau vive ou la pierre d’altitude.'
  },
  {
    id: 'duo-blacks-one-beyond-eve-01',
    slug: 'duo-blacks-one-beyond-eve-01',
    documentaryId: 'blacks-one-beyond-eve',
    documentaryTitle: 'Blacks One ‹ › Amazones',
    episodeNumber: 'ÉPISODE 01',
    protagonistA: PROTAGONISTS.find(p => p.id === 'malik-diop') || PROTAGONISTS[4],
    protagonistB: PROTAGONISTS.find(p => p.id === 'eleonore-vance') || PROTAGONISTS[5],
    questionNumber: '01',
    questionTitle: 'L’Identité Portée',
    centralQuestion: 'Comment affirmez-vous votre dignité et votre souveraineté intime face aux tempêtes de l’Histoire ?',
    quoteA: '« L’émancipation commence le jour où l’on refuse de regarder son histoire avec les yeux de ceux qui l’ont confisquée. La dignité ne se négocie pas. »',
    quoteB: '« Nous portons en nous la bravoure des Amazones. Notre souveraineté n’est pas une faveur : c’est l’affirmation inébranlable de notre dignité et de notre liberté. »',
    coverImage: '/assets/posters/blacks-one-amazones.png',
    storyA: (PROTAGONISTS.find(p => p.id === 'malik-diop') || PROTAGONISTS[4]).stories[0],
    storyB: (PROTAGONISTS.find(p => p.id === 'eleonore-vance') || PROTAGONISTS[5]).stories[0],
    editorialReflection: 'Entre la mémoire souveraine masculine et le souffle émancipateur des Amazones, ce face-à-face proclame la dignité inaltérable de nos histoires.'
  },
  {
    id: 'duo-dixeat-fiat-luxe-01',
    slug: 'duo-dixeat-fiat-luxe-01',
    documentaryId: 'dixeat-fiat-luxe',
    documentaryTitle: 'Fiat Luxe ‹ › Builders',
    episodeNumber: 'ÉPISODE 01',
    protagonistA: PROTAGONISTS.find(p => p.id === 'helene-saint-amand') || PROTAGONISTS[1],
    protagonistB: PROTAGONISTS.find(p => p.id === 'chef-koffi') || PROTAGONISTS[0],
    questionNumber: '01',
    questionTitle: 'L’Orfèvrerie et la Structure',
    centralQuestion: 'L’orfèvrerie du millimètre ou la force des fondations : que construisez-vous qui résiste au temps ?',
    quoteA: '« Dans un joyau ou une monture d’or ciselée, chaque micron de précision raconte la patience de l’esprit humain face à l’éternité. »',
    quoteB: '« Quand la voûte en béton et terre s’élève face aux vents de l’océan, tu sais que ton geste offre un abri aux générations futures. »',
    coverImage: '/assets/posters/fiat-luxe-builders.png',
    storyA: (PROTAGONISTS.find(p => p.id === 'helene-saint-amand') || PROTAGONISTS[1]).stories[0],
    storyB: (PROTAGONISTS.find(p => p.id === 'chef-koffi') || PROTAGONISTS[0]).stories[0],
    editorialReflection: 'Du secret de l’atelier joaillier au vacarme des chantiers d’envergure, l’exigence esthétique et la solidité des structures se rejoignent dans un même hommage à l’œuvre durable.'
  },
  {
    id: 'duo-investors-builders-01',
    slug: 'duo-investors-builders-01',
    documentaryId: 'roots-routes',
    documentaryTitle: 'Roots ‹ › Routes',
    episodeNumber: 'ÉPISODE 01',
    protagonistA: PROTAGONISTS.find(p => p.id === 'fatou-diallo') || PROTAGONISTS[0],
    protagonistB: PROTAGONISTS.find(p => p.id === 'kwame-mensah') || PROTAGONISTS[1],
    questionNumber: '01',
    questionTitle: 'L’Ancrage et l’Envol',
    centralQuestion: 'L’ancrage dans ses racines ou l’envol sur les routes : où se forge votre véritable identité ?',
    quoteA: '« Je n’ai jamais quitté la terre rouge d’Allada et d’Abomey. Ici, mes pas foulent la mémoire exacte de ceux qui m’ont précédée. »',
    quoteB: '« J’ai traversé les capitales et les aéroports. Mais chaque route que j’ai prise ne faisait que me ramener vers ce rivage essentiel. »',
    coverImage: '/assets/posters/roots-routes.jpg',
    storyA: (PROTAGONISTS.find(p => p.id === 'fatou-diallo') || PROTAGONISTS[0]).stories[0],
    storyB: (PROTAGONISTS.find(p => p.id === 'kwame-mensah') || PROTAGONISTS[1]).stories[0],
    editorialReflection: 'Entre l’ancrage fidèle au terroir natal et l’exploration des routes de la diaspora, deux destins se rencontrent dans un amour partagé de l’origine.'
  },
  {
    id: 'duo-other-eyes-sixth-sense-01',
    slug: 'duo-other-eyes-sixth-sense-01',
    documentaryId: 'other-eyes-sixth-sense',
    documentaryTitle: 'Baobab ‹ › Bambou',
    episodeNumber: 'ÉPISODE 01',
    protagonistA: PROTAGONISTS.find(p => p.id === 'codjo-blind') || PROTAGONISTS[0],
    protagonistB: PROTAGONISTS.find(p => p.id === 'mawuna-medium') || PROTAGONISTS[1],
    questionNumber: '01',
    questionTitle: 'La Sagesse du Temps',
    centralQuestion: 'La solidité des racines centenaires ou la souplesse du vent nouveau : quelle sagesse guide vos pas ?',
    quoteA: '« Le Baobab qui défie les siècles ne tremble pas à chaque coup de vent. Il écoute, et ses racines profondes protègent toute la terre. »',
    quoteB: '« Le vent peut souffler de toute sa force : le Bambou plie avec grâce, mais ne rompt jamais. La jeunesse s’adapte pour réinventer l’avenir. »',
    coverImage: '/assets/posters/baobab-bambou.jpg',
    storyA: (PROTAGONISTS.find(p => p.id === 'codjo-blind') || PROTAGONISTS[0]).stories[0],
    storyB: (PROTAGONISTS.find(p => p.id === 'mawuna-medium') || PROTAGONISTS[1]).stories[0],
    editorialReflection: 'Quand la mémoire enracinée du Baobab s’allie à l’agilité vive du Bambou, la sagesse des aînés fertilise l’audace des jeunes pousses pour bâtir demain.'
  },
  {
    id: 'duo-coaching-unlimited-01',
    slug: 'duo-coaching-unlimited-01',
    documentaryId: 'builders-seekers',
    documentaryTitle: 'Coaching ‹ › PhD',
    episodeNumber: 'ÉPISODE 01',
    protagonistA: {
      id: 'coach-marc',
      name: 'Marc Valmont',
      firstName: 'Marc',
      age: 48,
      role: 'Mentor de performance & Stratège mental',
      country: 'France',
      territory: 'Paris',
      flag: '🇫🇷',
      photo: '/assets/duos/coach-office.jpg',
      photoUrl: '/assets/duos/coach-office.jpg',
      videoPreviewUrl: '/sample.mp4',
      quote: '« Chaque barrière mentale que l’on fait tomber dans le calme d’un bureau déverrouille dix victoires sur le terrain. »',
      bio: 'Stratège de la haute performance humaine dans son bureau feutré.',
      universeTag: 'Coaching',
      centralQuestion: 'L’instinct pratique du terrain ou la rigueur de la thèse : comment transformez-vous le monde ?',
      storiesCount: 4,
      transmissionsCount: 3,
      projectsCount: 2,
      stories: [
        {
          id: 'story-coach-marc-01',
          title: 'Le silence avant la décision',
          questionNumber: '01',
          questionTitle: 'Terrain ou Thèse',
          duration: '07:45',
          videoDurationSeconds: 465,
          summary: 'Marc partage la séance où un champion brisé a retrouvé le désir de s’entraîner.',
          videoCoverUrl: '/assets/duos/coach-office.jpg',
          credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Marc Valmont' }]
        }
      ]
    } as any,
    protagonistB: {
      id: 'researcher-eleonore',
      name: 'Dre. Éléonore Kaboré',
      firstName: 'Éléonore',
      age: 42,
      role: 'Docteure en sciences cognitives & Chercheuse',
      country: 'Burkina Faso & France',
      territory: 'Ouagadougou & Lyon',
      flag: '🇧🇫',
      photo: '/assets/duos/researcher-phd.jpg',
      photoUrl: '/assets/duos/researcher-phd.jpg',
      videoPreviewUrl: '/sample.mp4',
      quote: '« Une thèse n’est pas un diplôme qu’on accroche : c’est une promesse faite au réel de ne jamais se contenter des apparences. »',
      bio: 'Chercheuse passionnée reliant données de terrain et mémoire vivante.',
      universeTag: 'PhD',
      centralQuestion: 'Combien de nuits d’incertitude faut-il traverser avant qu’une intuition ne devienne une certitude démontrable ?',
      storiesCount: 5,
      transmissionsCount: 3,
      projectsCount: 4,
      stories: [
        {
          id: 'story-researcher-eleonore-01',
          title: 'L’équation qui répare les silences',
          questionNumber: '01',
          questionTitle: 'Terrain ou Thèse',
          duration: '08:15',
          videoDurationSeconds: 495,
          summary: 'Éléonore partage la joie de voir sa thèse valider le savoir oral.',
          videoCoverUrl: '/assets/duos/researcher-phd.jpg',
          credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Dre. Éléonore Kaboré' }]
        }
      ]
    } as any,
    questionNumber: '01',
    questionTitle: 'Terrain ou Thèse',
    centralQuestion: 'L’instinct pratique du terrain ou la rigueur de la thèse : comment transformez-vous le monde ?',
    quoteA: '« Dans le calme d’un bureau comme dans le tumulte du terrain, mon rôle est de faire sauter les verrous mentaux pour libérer la puissance d’action. »',
    quoteB: '« Une thèse n’est pas un diplôme qu’on contemple : c’est une promesse faite au réel de chercher la vérité au-delà des apparences. »',
    coverImage: '/assets/posters/coaching-phd.png',
    storyA: {
      id: 'story-coach-marc-01',
      title: 'Le silence avant la décision',
      questionNumber: '01',
      questionTitle: 'Terrain ou Thèse',
      duration: '07:45',
      videoDurationSeconds: 465,
      summary: 'Marc partage la séance où un champion brisé a retrouvé le désir de s’entraîner.',
      videoCoverUrl: '/assets/duos/coach-office.jpg',
      credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Marc Valmont' }]
    },
    storyB: {
      id: 'story-researcher-eleonore-01',
      title: 'L’équation qui répare les silences',
      questionNumber: '01',
      questionTitle: 'Terrain ou Thèse',
      duration: '08:15',
      videoDurationSeconds: 495,
      summary: 'Éléonore partage la joie de voir sa thèse valider le savoir oral.',
      videoCoverUrl: '/assets/duos/researcher-phd.jpg',
      credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Dre. Éléonore Kaboré' }]
    },
    editorialReflection: 'Entre le déclic pragmatique du coach et la démonstration patiente de la chercheuse, l’action et la pensée s’unissent pour libérer le plein potentiel humain.'
  },
  {
    id: 'duo-focus-phd-01',
    slug: 'duo-focus-phd-01',
    documentaryId: 'focus-phd',
    documentaryTitle: 'Pictures ‹ › Words',
    episodeNumber: 'ÉPISODE 01',
    protagonistA: {
      id: 'photographer-clara',
      name: 'Clara Valmont',
      firstName: 'Clara',
      age: 38,
      role: 'Photographe documentaire',
      country: 'France & Sénégal',
      territory: 'Paris & Dakar',
      flag: '🇫🇷',
      photo: '/assets/duos/photographer-focus.jpg',
      photoUrl: '/assets/duos/photographer-focus.jpg',
      videoPreviewUrl: '/sample.mp4',
      quote: '« Le cadre n’enferme pas le monde : il l’oblige à se révéler. Quand tu presses le déclencheur, tu ne voles pas une image, tu reçois une confidence. »',
      bio: 'Quinze ans de reportages visuels, observant la poésie des gestes humbles.',
      universeTag: 'Pictures',
      centralQuestion: 'L’image qui fige l’instant ou le mot qui réveille la conscience : comment racontez-vous la vérité ?',
      storiesCount: 6,
      transmissionsCount: 4,
      projectsCount: 2,
      stories: [
        {
          id: 'story-photographer-clara-01',
          title: 'L’ombre portée du pêcheur de Saint-Louis',
          questionNumber: '01',
          questionTitle: 'Raconter la Vérité',
          duration: '09:10',
          videoDurationSeconds: 550,
          summary: 'Clara raconte l’attente de l’instant décisif sur le fleuve à l’aube.',
          videoCoverUrl: '/assets/duos/photographer-focus.jpg',
          credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Clara Valmont' }]
        }
      ]
    } as any,
    protagonistB: {
      id: 'poet-armel',
      name: 'Armel Hounkpatin',
      firstName: 'Armel',
      age: 31,
      role: 'Slameur & Poète du verbe vivant',
      country: 'Bénin',
      territory: 'Cotonou',
      flag: '🇧🇯',
      photo: '/assets/images/fagnon_agronome_1792933698985.jpg',
      photoUrl: '/assets/images/fagnon_agronome_1792933698985.jpg',
      videoPreviewUrl: '/sample.mp4',
      quote: '« Le mot a le poids du feu et la douceur de la pluie. Quand je scande mes vers, je réveille la mémoire des ancêtres. »',
      bio: 'Voix vibrante de la scène slam de Cotonou, mêlant langues locales et souffle contemporain.',
      universeTag: 'Words',
      centralQuestion: 'Le verbe peut-il guérir ce que le silence a blessé ?',
      storiesCount: 5,
      transmissionsCount: 3,
      projectsCount: 3,
      stories: [
        {
          id: 'story-poet-armel-01',
          title: 'Le slam du carrefour Dantokpa',
          questionNumber: '01',
          questionTitle: 'Raconter la Vérité',
          duration: '07:20',
          videoDurationSeconds: 440,
          summary: 'Armel raconte comment un poème improvisé au cœur du marché a suspendu la clameur des marchandes.',
          videoCoverUrl: '/assets/images/fagnon_agronome_1792933698985.jpg',
          credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Armel Hounkpatin' }]
        }
      ]
    } as any,
    questionNumber: '01',
    questionTitle: 'Raconter la Vérité',
    centralQuestion: 'L’image qui fige l’instant ou le mot qui réveille la conscience : comment racontez-vous la vérité ?',
    quoteA: '« À travers le cadre, le monde s’arrête de courir. Quand tu presses le déclencheur, tu ne voles pas une image, tu reçois une confidence sacrée. »',
    quoteB: '« Le verbe claque comme un tambour dans la nuit. Quand le slam s’élève, les mots percent les cœurs là où aucune ombre ne peut se cacher. »',
    coverImage: '/assets/posters/pictures-words.jpg',
    storyA: {
      id: 'story-photographer-clara-01',
      title: 'L’ombre portée du pêcheur de Saint-Louis',
      questionNumber: '01',
      questionTitle: 'Raconter la Vérité',
      duration: '09:10',
      videoDurationSeconds: 550,
      summary: 'Clara raconte l’attente de l’instant décisif sur le fleuve à l’aube.',
      videoCoverUrl: '/assets/duos/photographer-focus.jpg',
      credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Clara Valmont' }]
    },
    storyB: {
      id: 'story-poet-armel-01',
      title: 'Le slam du carrefour Dantokpa',
      questionNumber: '01',
      questionTitle: 'Raconter la Vérité',
      duration: '07:20',
      videoDurationSeconds: 440,
      summary: 'Armel raconte comment un poème improvisé au cœur du marché a suspendu la clameur des marchandes.',
      videoCoverUrl: '/assets/images/fagnon_agronome_1792933698985.jpg',
      credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Armel Hounkpatin' }]
    },
    editorialReflection: 'Quand l’œil silencieux de l’objectif répond au rythme percutant de la parole scandée, la vérité humaine s’illumine dans toute son intensité.'
  }
];

// Conservation sans réécriture des 6 duos issus d'anciennes séries sans correspondance directe v2
export const UNMAPPED_LEGACY_DUOS: Duo[] = RAW_DUOS.filter(
  (duo) => !resolveSeriesById(duo.documentaryId)
);

// Duos actifs alignés sur le registre v2 des 8 séries
export const DUOS: Duo[] = RAW_DUOS.filter((duo) => Boolean(resolveSeriesById(duo.documentaryId))).map((duo) => {
  const mappedSeries = resolveSeriesById(duo.documentaryId)!;
  return {
    ...duo,
    documentaryId: mappedSeries.id,
    documentaryTitle: mappedSeries.title,
    centralQuestion: mappedSeries.episodes[0].question,
    coverImage: mappedSeries.posterUrl,
    credits: duo.credits || getSeriesCredits(mappedSeries.id, duo.questionTitle),
  };
});

export const VIDEOGRAPHERS: Videographer[] = [
  {
    id: 'vid-1',
    name: 'Ayaba Senou',
    firstName: 'Ayaba',
    age: 28,
    photo: '/assets/protagonists/kwame-mensah.jpg',
    photoUrl: '/assets/protagonists/mahougnon-zounon.jpg',
    territory: 'Bénin (Cotonou, Ouidah, Allada)',
    country: 'Bénin',
    bio: 'Documentariste diplômée de l’ISMA. Spécialiste de la lumière naturelle et des récits de mémoire vivante.',
    gear: 'Sony FX3, optiques fixes cinéma 35mm & 50mm, micros cravates HF Sennheiser',
    equipment: 'Sony FX3, optiques fixes cinéma 35mm & 50mm, micros HF Sennheiser',
    specialties: ['Spiritualités traditionnelles', 'Artisanat d’art', 'Entretiens intimes'],
    languages: ['Français', 'Fòn', 'Yorùbá'],
    rate: 'À partir de 180 €',
    estimatedRateEuros: 180,
    videoUrl: '/sample.mp4',
    protagonistId: 'dah-zounon',
    availability: 'Disponible sous 48h',
    rating: 4.9,
    storiesShot: 14,
    verified: true,
    completedShoots: 14
  },
  {
    id: 'vid-2',
    name: 'Mateo Quispe Flores',
    firstName: 'Mateo',
    age: 32,
    photo: '/assets/protagonists/malik-diop.jpg',
    photoUrl: '/assets/protagonists/mawuna-medium.jpg',
    territory: 'Pérou (Cusco, Vallée Sacrée, Pisac)',
    country: 'Pérou',
    bio: 'Natif de la région de Pisac, réalisateur indépendant formé à Lima. Passionné par les cosmologies andines et l’agriculture paysanne d’altitude.',
    gear: 'Blackmagic Pocket 6K Pro, stabilisateur Ronin, micros directionnels Rode NTG',
    equipment: 'Blackmagic Pocket 6K Pro, Ronin RS3, micros Rode NTG',
    specialties: ['Territoires ruraux', 'Cultures indigènes', 'Plans contemplatifs'],
    languages: ['Espagnol', 'Quechua', 'Anglais'],
    rateInfo: 'Accompagnement solidaire certifié YonyWood',
    rate: 'À partir de 210 €',
    estimatedRateEuros: 210,
    videoUrl: '/sample.mp4',
    protagonistId: 'sayri-quispe',
    availability: 'Disponible cette semaine',
    rating: 4.8,
    storiesShot: 9,
    verified: true,
    completedShoots: 9
  },
  {
    id: 'vid-3',
    name: 'Kadiatou Bocoum',
    firstName: 'Kadiatou',
    age: 29,
    photo: '/assets/protagonists/pere-matthieu.jpg',
    photoUrl: '/assets/protagonists/photographer-focus.jpg',
    territory: 'Sénégal (Dakar, Saint-Louis, Rufisque)',
    country: 'Sénégal',
    bio: 'Cheffe opératrice et monteuse. Son regard sensible saisit la spontanéité des collectifs urbains, de la danse et des paroles féminines insoumises.',
    gear: 'Canon C70, objectifs RF L-Series, enregistreur audio 32-bit float Zoom F3',
    equipment: 'Canon C70, objectifs RF L-Series, Zoom F3 32-bit float',
    specialties: ['Arts vivants', 'Portraits de collectifs', 'Dynamiques urbaines'],
    languages: ['Français', 'Wolof', 'Anglais'],
    rateInfo: 'Agrément charte qualité YonyWood',
    rate: 'À partir de 250 €',
    estimatedRateEuros: 250,
    videoUrl: '/sample.mp4',
    protagonistId: 'fatou-diallo',
    availability: 'Disponible sur rendez-vous',
    rating: 5.0,
    storiesShot: 18,
    verified: true,
    completedShoots: 18
  },
  {
    id: 'vid-4',
    name: 'Adrien Vasseur',
    firstName: 'Adrien',
    age: 35,
    photo: '/assets/protagonists/researcher-phd.jpg',
    photoUrl: '/assets/protagonists/sayri-quispe.jpg',
    territory: 'France (Paris, Île-de-France, Lyon)',
    country: 'France',
    bio: 'Cadreur spécialisé dans la gastronomie sensorielle, les ateliers d’art et l’architecture d’intérieur. Travail subtil sur le clair-obscur et la texture des matières.',
    gear: 'Sony A7S III, série optique anamorphique, éclairage doux Aputure Amaran',
    equipment: 'Sony A7S III, série optique anamorphique, son HF Shure',
    specialties: ['Gastronomie', 'Gestes d’exception', 'Atmosphères feutrées'],
    languages: ['Français', 'Anglais', 'Arabe dialectal'],
    rateInfo: 'Mission conventionnée YonyWood',
    rate: 'À partir de 320 €',
    estimatedRateEuros: 320,
    videoUrl: '/sample.mp4',
    protagonistId: 'coach-marc',
    availability: 'Disponible sous 72h',
    rating: 4.9,
    storiesShot: 11,
    verified: true,
    completedShoots: 11
  }
];

export const PENDING_REVIEWS: ReviewCandidate[] = [
  {
    id: 'rev-01',
    candidateName: 'Akouavi Gbedan',
    territory: 'Grand-Popo, Bénin',
    documentaryTitle: 'FINAGNON × QOSQORICO',
    questionNumber: '02',
    questionTitle: 'Partir',
    storyTitle: 'La vague qui a emporté ma maison de sable',
    summary: 'Quand l’érosion côtière a englouti la cour familiale à Grand-Popo, partir n’était pas un départ volontaire mais un deuil physique de la terre natale.',
    duration: '07:45',
    stage: 'Étape 3/7 : Avis de la forêt',
    currentReviewsCount: 3,
    requiredReviewsCount: 5,
    videoCoverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'rev-02',
    candidateName: 'Inti Champi',
    territory: 'Ollantaytambo, Pérou',
    documentaryTitle: 'FINAGNON × QOSQORICO',
    questionNumber: '04',
    questionTitle: 'Ce qui Reste',
    storyTitle: 'Le secret des canaux de pierre d’Ollantaytambo',
    summary: 'La façon dont les terrasses incas canalisent l’eau de fonte sans qu’une seule goutte ne se perde. Sagesse transmise par son arrière-grand-père avant de s’éteindre.',
    duration: '09:12',
    stage: 'Étape 3/7 : Avis de la forêt',
    currentReviewsCount: 4,
    requiredReviewsCount: 5,
    videoCoverUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'rev-03',
    candidateName: 'Sœur Blandine Dossou',
    territory: 'Abomey, Bénin',
    documentaryTitle: 'RÉVÉLATION × TRADITION',
    questionNumber: '04',
    questionTitle: 'La Personne qui vous a Changé',
    storyTitle: 'La rencontre avec la prêtresse de Sakpata',
    summary: 'Alors qu’elle préparait ses vœux perpétuels, sa rencontre avec une vieille prêtresse soignant les malades avec une douceur infinie a renouvelé sa foi chrétienne.',
    duration: '11:20',
    stage: 'Étape 3/7 : Avis de la forêt',
    currentReviewsCount: 2,
    requiredReviewsCount: 5,
    videoCoverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
  }
];

export const COMMUNITY_REVIEWS: CommunityReviewItem[] = [
  {
    id: 'rev-1',
    candidateName: 'Akouavi Gbedan',
    candidatePhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
    territory: 'Bénin (Grand-Popo)',
    documentaryTitle: 'FINAGNON × QOSQORICO',
    questionNumber: '02',
    questionTitle: 'Partir',
    pitch: '« Quand l’érosion côtière a emporté la maison de sable de mon enfance à Grand-Popo, partir n’était pas un voyage : c’était laisser la moitié de mon ombre sur la plage. »',
    videoDuration: '07:45',
    videoThumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    supports: 24,
    revisionRequests: 1
  },
  {
    id: 'rev-2',
    candidateName: 'Inti Champi',
    candidatePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    territory: 'Pérou (Ollantaytambo)',
    documentaryTitle: 'FINAGNON × QOSQORICO',
    questionNumber: '04',
    questionTitle: 'Ce qui Reste',
    pitch: '« La façon dont les pierres de nos terrasses canalisent l’eau de fonte sans qu’une goutte ne se perde. C’est la sagesse que mon arrière-grand-père m’a laissée avant de s’éteindre. »',
    videoDuration: '09:12',
    videoThumbnail: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    supports: 31,
    revisionRequests: 0
  },
  {
    id: 'rev-3',
    candidateName: 'Sœur Blandine Dossou',
    candidatePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    territory: 'Bénin (Abomey)',
    documentaryTitle: 'RÉVÉLATION × TRADITION',
    questionNumber: '04',
    questionTitle: 'La Personne qui vous a Changé',
    pitch: '« Je préparais mes vœux perpétuels quand j’ai rencontré une prêtresse de Sakpata qui soignait les lépreux avec une tendresse infinie. Sa foi a bouleversé la mienne. »',
    videoDuration: '11:20',
    videoThumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    supports: 42,
    revisionRequests: 2
  }
];

export const BACKOFFICE_APPLICATIONS: BackOfficeApplication[] = [
  {
    id: 'app-001',
    candidateName: 'Akouavi Gbedan',
    candidatePhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    territory: 'Bénin (Grand-Popo)',
    documentaryId: 'finagnon-qosqorico',
    documentaryTitle: 'FINAGNON × QOSQORICO',
    universeGroup: 'Finagnon',
    status: 'AVIS_FORET',
    submittedDate: '12 Septembre 2026',
    assignedReviewer: 'Comité Littoral',
    technicalStatus: 'VALIDE',
    videoDuration: '07:45'
  },
  {
    id: 'app-002',
    candidateName: 'Inti Champi',
    candidatePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    territory: 'Pérou (Ollantaytambo)',
    documentaryId: 'finagnon-qosqorico',
    documentaryTitle: 'FINAGNON × QOSQORICO',
    universeGroup: 'Qosqorico',
    status: 'COMITE',
    submittedDate: '09 Septembre 2026',
    assignedReviewer: 'Comité Andes',
    technicalStatus: 'VALIDE',
    videoDuration: '09:12'
  },
  {
    id: 'app-003',
    candidateName: 'Djimon Agassa',
    candidatePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    territory: 'Bénin (Porto-Novo)',
    documentaryId: 'vodun-rays-autre-foi',
    documentaryTitle: 'Vodun Rays <> Autre Foi',
    universeGroup: 'Vodun Rays',
    status: 'CONTROLE_TECHNIQUE',
    submittedDate: '13 Septembre 2026',
    assignedReviewer: 'Équipe Son/Image',
    technicalStatus: 'EN_ATTENTE',
    videoDuration: '14:20'
  },
  {
    id: 'app-004',
    candidateName: 'Nesta Touré',
    candidatePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    territory: 'Sénégal (Dakar)',
    documentaryId: 'blacks-one-beyond-eve',
    documentaryTitle: 'BLACKS ONE × BEYOND EVE',
    universeGroup: 'Blacks One',
    status: 'NOUVELLES',
    submittedDate: 'Hier',
    assignedReviewer: 'Non assigné',
    technicalStatus: 'EN_ATTENTE',
    videoDuration: '10:05'
  },
  {
    id: 'app-005',
    candidateName: 'Clara Delorme',
    candidatePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    territory: 'France (Paris)',
    documentaryId: 'dixeat-fiat-luxe',
    documentaryTitle: 'E VIVI × FIÂT LUXE',
    universeGroup: 'Fiat Luxe',
    status: 'REVISIONS',
    submittedDate: '04 Septembre 2026',
    assignedReviewer: 'Équipe Son/Image',
    technicalStatus: 'REVISION_REQUISE',
    videoDuration: '06:30'
  },
  {
    id: 'app-006',
    candidateName: 'Sœur Blandine Dossou',
    candidatePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    territory: 'Bénin (Abomey)',
    documentaryId: 'vodun-rays-autre-foi',
    documentaryTitle: 'Vodun Rays <> Autre Foi',
    universeGroup: 'Autre Foi',
    status: 'APPROUVEES',
    submittedDate: '28 Août 2026',
    assignedReviewer: 'Direction Éditoriale',
    technicalStatus: 'VALIDE',
    videoDuration: '11:20'
  }
];

const RAW_SERIES_AFFILIATION_TREES: SeriesAffiliationTree[] = [
  {
    seriesId: 'vodun-rays-autre-foi',
    seriesTitle: 'Vodun Rays <> Autre Foi',
    subtitle: 'Deux traditions. Une même question de foi.',
    description: 'Comment la rencontre de deux géants de la spiritualité béninoise a ouvert une chaîne vivante d\'initiations, tissant des liens inattendus entre couvents vodoun et monastères chrétiens.',
    centralQuestion: 'La foi',
    totalAffiliatedCount: 12,
    generationsCount: 3,
    pioneers: [
      {
        id: 'dah-zounon',
        name: 'Mahougnon',
        age: 68,
        role: 'Dignitaire & gardien de la Tradition',
        territory: 'Allada',
        country: 'Bénin',
        flag: '🇧🇯',
        universeTag: 'Vodun Rays',
        photoUrl: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Pionnier fondateur de la série. A accepté d\'ouvrir le secret des seuils sacrés pour que la jeunesse comprenne la vraie nature protectrice de Legba.',
        duoPartnerName: 'Dieudonné',
        duoPartnerPhoto: '/assets/duos/duo_pere_matthieu_1791655226601.jpg',
        duoId: 'duo-jesus-legba-01',
        episodeQuestion: '01 — Racontez-nous un moment où vous avez réellement rencontré votre foi.',
        protagonistIdRef: 'dah-zounon',
        invitedPeople: [
          {
            id: 'soeur-blandine',
            name: 'Sœur Blandine',
            age: 46,
            role: 'Religieuse bénédictine & herboriste',
            territory: 'Abomey',
            country: 'Bénin',
            flag: '🇧🇯',
            universeTag: 'Autre Foi',
            photoUrl: '/assets/protagonists/senan-agossa.jpg',
            badge: 'Invité(e)',
            invitedById: 'dah-zounon',
            invitedByName: 'Mahougnon',
            invitationStory: 'Invitée par Mahougnon après qu\'ils ont soigné ensemble des enfants fébriles au dispensaire de Toffo, échangeant tisanes de racines et prières d\'oraison.',
            duoPartnerName: 'Hounon Gbaguidi',
            duoId: 'duo-jesus-legba-01',
            episodeQuestion: '02 — L’épreuve qui révèle le vrai dénuement de l’âme.',
            protagonistIdRef: 'dah-zounon',
            invitedPeople: [
              {
                id: 'frere-jean-baptiste',
                name: 'Frère Jean-Baptiste',
                age: 31,
                role: 'Moine copiste et apiculteur',
                territory: 'Toffo',
                country: 'Bénin',
                flag: '🇧🇯',
                universeTag: 'Autre Foi',
                photoUrl: '/assets/protagonists/sika-dossou.jpg',
                badge: 'Invité(e)',
                invitedById: 'soeur-blandine',
                invitedByName: 'Sœur Blandine',
                invitationStory: 'Fait entrer dans la série par Sœur Blandine pour son témoignage sur le silence nocturne des ruches et la contemplation des psaumes.',
                duoPartnerName: 'Marie-Noëlle',
                duoId: 'duo-jesus-legba-01',
                episodeQuestion: '03 — Ce que l’on transmet sans un mot.',
                protagonistIdRef: 'dah-zounon'
              }
            ]
          },
          {
            id: 'hounon-gbaguidi',
            name: 'Hounon Gbaguidi',
            age: 52,
            role: 'Forgeron rituel et sculpteur de fer traditionnel',
            territory: 'Ouidah',
            country: 'Bénin',
            flag: '🇧🇯',
            universeTag: 'Vodun Rays',
            photoUrl: '/assets/protagonists/tobi-ganvie.jpg',
            badge: 'Invité(e)',
            invitedById: 'dah-zounon',
            invitedByName: 'Mahougnon',
            invitationStory: 'Invité par Mahougnon pour son talent rare à forger les fers d\'Asen et à raconter le mystère du feu qui purifie la colère.',
            duoPartnerName: 'Pasteur Emmanuel',
            duoId: 'duo-jesus-legba-01',
            episodeQuestion: '04 — La personne qui a retourné votre regard sur l’invisible.',
            protagonistIdRef: 'dah-zounon'
          }
        ]
      },
      {
        id: 'pere-matthieu',
        name: 'Dieudonné',
        age: 59,
        role: 'Prêtre diocésain & vicaire de paroisse',
        territory: 'Cotonou',
        country: 'Bénin',
        flag: '🇧🇯',
        universeTag: 'Autre Foi',
        photoUrl: '/assets/duos/duo_pere_matthieu_1791655226601.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Pionnier fondateur représentant le pôle chrétien. A voulu témoigner d\'une foi dépouillée de tout mépris envers les traditions des ancêtres.',
        duoPartnerName: 'Mahougnon',
        duoPartnerPhoto: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
        duoId: 'duo-jesus-legba-01',
        episodeQuestion: '01 — La rencontre intime avec la grâce.',
        protagonistIdRef: 'pere-matthieu',
        invitedPeople: [
          {
            id: 'pasteur-emmanuel',
            name: 'Pasteur Emmanuel',
            age: 44,
            role: 'Prédicateur évangélique & médiateur social',
            territory: 'Porto-Novo',
            country: 'Bénin',
            flag: '🇧🇯',
            universeTag: 'Autre Foi',
            photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
            badge: 'Invité(e)',
            invitedById: 'pere-matthieu',
            invitedByName: 'Dieudonné',
            invitationStory: 'Fait entrer par Dieudonné après des nuits entières passées à apaiser les tensions entre jeunes convertis et anciens du village.',
            duoPartnerName: 'Hounon Gbaguidi',
            duoId: 'duo-jesus-legba-01',
            episodeQuestion: '04 — Le pardon aux portes de l’impossible.',
            protagonistIdRef: 'pere-matthieu',
            invitedPeople: [
              {
                id: 'marie-noelle',
                name: 'Marie-Noëlle',
                age: 28,
                role: 'Chanteuse chorale et maraîchère bio',
                territory: 'Ouidah',
                country: 'Bénin',
                flag: '🇧🇯',
                universeTag: 'Autre Foi',
                photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
                badge: 'Invité(e)',
                invitedById: 'pasteur-emmanuel',
                invitedByName: 'Pasteur Emmanuel',
                invitationStory: 'Invitée par le pasteur pour faire entendre la voix des femmes qui portent la foi quotidienne au marché et sous la pluie.',
                duoPartnerName: 'Frère Jean-Baptiste',
                duoId: 'duo-jesus-legba-01',
                episodeQuestion: '05 — Ce qu’on laisse aux générations futures.',
                protagonistIdRef: 'pere-matthieu'
              }
            ]
          },
          {
            id: 'theodore-cotonou',
            name: 'Théodore',
            age: 38,
            role: 'Éducateur auprès des enfants de rue',
            territory: 'Cotonou',
            country: 'Bénin',
            flag: '🇧🇯',
            universeTag: 'Autre Foi',
            photoUrl: '/assets/protagonists/amara-tisserande.jpg',
            badge: 'Invité(e)',
            invitedById: 'pere-matthieu',
            invitedByName: 'Dieudonné',
            invitationStory: 'Invité par Dieudonné pour son engagement auprès des plus vulnérables à Dantokpa sans jamais juger personne.',
            duoPartnerName: 'Mahougnon',
            duoId: 'duo-jesus-legba-01',
            episodeQuestion: '02 — L’amour éprouvé par la nuit.',
            protagonistIdRef: 'pere-matthieu'
          }
        ]
      }
    ]
  },
  {
    seriesId: 'finagnon-qosqorico',
    seriesTitle: 'Benin < > ...',
    subtitle: 'Bénin < > Pérou. Deux territoires. Une même réflexion sur ce qui nous relie à un lieu.',
    description: 'Comment l\'alliance secrète entre un maître tisserand de Porto-Novo et une gardienne des cimes andines a inspiré toute une communauté de piroguiers, luthiers et paysans d\'altitude.',
    centralQuestion: 'Le territoire',
    totalAffiliatedCount: 14,
    generationsCount: 3,
    pioneers: [
      {
        id: 'koffi-tisserand',
        name: 'Koffi',
        age: 54,
        role: 'Tisserand traditionnel',
        territory: 'Porto-Novo',
        country: 'Bénin',
        flag: '🇧🇯',
        universeTag: 'Finagnon',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Première effigie et initiateur du volet Finagnon. A posé la question originelle : « Que transmet une main qui tisse depuis l\'enfance ? »',
        duoPartnerName: 'Amara',
        duoPartnerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        duoId: 'duo-finagnon-qosqorico-01',
        episodeQuestion: '02 — Le geste ancestral qui relie les générations.',
        protagonistIdRef: 'koffi-tisserand',
        invitedPeople: [
          {
            id: 'tobi-ganvie',
            name: 'Tobi',
            age: 48,
            role: 'Pêcheur toffinou & charpentier de pirogues',
            territory: 'Ganvié',
            country: 'Bénin',
            flag: '🇧🇯',
            universeTag: 'Finagnon',
            photoUrl: '/assets/protagonists/athlete-hurdle.jpg',
            badge: 'Invité(e)',
            invitedById: 'koffi-tisserand',
            invitedByName: 'Koffi',
            invitationStory: 'Fait entrer par Koffi : Tobi sculptait les bois de teck sur les pilotis de Ganvié exactement avec la même patience que Koffi tendait ses fils.',
            duoPartnerName: 'Sayri',
            duoId: 'duo-finagnon-qosqorico-01',
            episodeQuestion: '01 — Chez soi : Quand sait-on qu’on appartient à un lieu ?',
            protagonistIdRef: 'koffi-tisserand',
            invitedPeople: [
              {
                id: 'amina-diallo',
                name: 'Amina',
                age: 34,
                role: 'Artiste sonore & gardienne de l’acoustique lacustre',
                territory: 'Ganvié',
                country: 'Bénin',
                flag: '🇧🇯',
                universeTag: 'Finagnon',
                photoUrl: '/assets/protagonists/chef-koffi.jpg',
                badge: 'Invité(e)',
                invitedById: 'tobi-ganvie',
                invitedByName: 'Tobi',
                invitationStory: 'Invitée par Tobi pour capturer le chant des rames frappant l\'eau avant l\'aube et les berceuses toffinou oubliées.',
                duoPartnerName: 'Nayra',
                duoId: 'duo-finagnon-qosqorico-01',
                episodeQuestion: '04 — Ce qui reste quand tout le reste change.',
                protagonistIdRef: 'koffi-tisserand',
                invitedPeople: [
                  {
                    id: 'babacar-luthier',
                    name: 'Babacar',
                    age: 26,
                    role: 'Jeune luthier & fabricant d’instruments en bambou',
                    territory: 'Ganvié',
                    country: 'Bénin',
                    flag: '🇧🇯',
                    universeTag: 'Finagnon',
                    photoUrl: '/assets/protagonists/coach-office.jpg',
                    badge: 'Invité(e)',
                    invitedById: 'amina-diallo',
                    invitedByName: 'Amina',
                    invitationStory: 'Initié par Amina après qu’il a créé la première harpe d’eau en roseaux de la lagune de Nokoué.',
                    duoPartnerName: 'Nayra',
                    duoId: 'duo-finagnon-qosqorico-01',
                    episodeQuestion: '05 — Le chant de demain.',
                    protagonistIdRef: 'koffi-tisserand'
                  }
                ]
              }
            ]
          },
          {
            id: 'ayaba-grandpopo',
            name: 'Ayaba',
            age: 39,
            role: 'Tisseuse de nattes de jonc et sel traditionnel',
            territory: 'Grand-Popo',
            country: 'Bénin',
            flag: '🇧🇯',
            universeTag: 'Finagnon',
            photoUrl: '/assets/protagonists/codjo-blind.jpg',
            badge: 'Invité(e)',
            invitedById: 'koffi-tisserand',
            invitedByName: 'Koffi',
            invitationStory: 'Invitée par Koffi pour sa mémoire des plantes tinctoriales sauvages du cordon littoral.',
            duoPartnerName: 'Don Huamán',
            duoId: 'duo-finagnon-qosqorico-01',
            episodeQuestion: '03 — Les couleurs qui naissent de la terre.',
            protagonistIdRef: 'koffi-tisserand'
          }
        ]
      },
      {
        id: 'amara-tisserande',
        name: 'Amara',
        age: 42,
        role: 'Tisserande andine',
        territory: 'Cusco',
        country: 'Pérou',
        flag: '🇵🇪',
        universeTag: 'Qosqorico',
        photoUrl: '/assets/protagonists/dah-zounon.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Première effigie du volet Qosqorico. A fait résonner la laine d\'alpaga avec le coton de Koffi par-delà l\'océan Pacifique et l\'Atlantique.',
        duoPartnerName: 'Koffi',
        duoPartnerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        duoId: 'duo-finagnon-qosqorico-01',
        episodeQuestion: '02 — La mémoire que chaque fil garde de la montagne.',
        protagonistIdRef: 'amara-tisserande',
        invitedPeople: [
          {
            id: 'sayri-pisac',
            name: 'Sayri',
            age: 51,
            role: 'Gardien des semences de maïs sacré & conteur quechua',
            territory: 'Pisac',
            country: 'Pérou',
            flag: '🇵🇪',
            universeTag: 'Qosqorico',
            photoUrl: '/assets/protagonists/eleonore-vance.jpg',
            badge: 'Invité(e)',
            invitedById: 'amara-tisserande',
            invitedByName: 'Amara',
            invitationStory: 'Invité par Amara : ses champs en terrasses sont les parchemins vivants dont les motifs de ses tissages sont issus.',
            duoPartnerName: 'Tobi',
            duoId: 'duo-finagnon-qosqorico-01',
            episodeQuestion: '01 — Le premier souffle reçu de la terre.',
            protagonistIdRef: 'amara-tisserande',
            invitedPeople: [
              {
                id: 'nayra-fileuse',
                name: 'Nayra',
                age: 29,
                role: 'Fileuse de vigogne et guide des sentiers incas',
                territory: 'Ollantaytambo',
                country: 'Pérou',
                flag: '🇵🇪',
                universeTag: 'Qosqorico',
                photoUrl: '/assets/protagonists/fatou-diallo.jpg',
                badge: 'Invité(e)',
                invitedById: 'sayri-pisac',
                invitedByName: 'Sayri',
                invitationStory: 'Inspirée par Sayri pour documenter le regard des jeunes filles quechuas face au tourisme de masse et préserver la dignité du geste.',
                duoPartnerName: 'Amina',
                duoId: 'duo-finagnon-qosqorico-01',
                episodeQuestion: '04 — Le courage de ne pas vendre son âme.',
                protagonistIdRef: 'amara-tisserande'
              }
            ]
          },
          {
            id: 'don-huaman',
            name: 'Don Huamán',
            age: 63,
            role: 'Maître teinturier d’altitude aux lichens sauvages',
            territory: 'Vallée Sacrée',
            country: 'Pérou',
            flag: '🇵🇪',
            universeTag: 'Qosqorico',
            photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
            badge: 'Invité(e)',
            invitedById: 'amara-tisserande',
            invitedByName: 'Amara',
            invitationStory: 'Fait entrer par Amara car il est le seul à connaître le secret de la teinture rouge cochenille fixée à l\'eau de source volcanique.',
            duoPartnerName: 'Ayaba',
            duoId: 'duo-finagnon-qosqorico-01',
            episodeQuestion: '03 — Les secrets confiés par le vent des hauteurs.',
            protagonistIdRef: 'amara-tisserande'
          }
        ]
      }
    ]
  },
  {
    seriesId: 'blacks-one-beyond-eve',
    seriesTitle: 'Blacks One < > Beyond Eve',
    subtitle: 'Deux expériences collectives. Une exploration de l\'identité et de ce que nous devenons.',
    description: 'De la poussière des ronds-points de Dakar aux galeries militantes de Marseille et Abidjan : comment une sororité et une fraternité se sont cooptées pour réécrire les identités.',
    centralQuestion: 'L\'identité',
    totalAffiliatedCount: 11,
    generationsCount: 3,
    pioneers: [
      {
        id: 'malik-barou',
        name: 'Malik Diop',
        age: 32,
        role: 'Orateur civique & leader pour les droits civiques',
        territory: 'Dakar',
        country: 'Sénégal',
        flag: '🇸🇳',
        universeTag: 'Blacks One',
        photoUrl: '/assets/protagonists/malik-diop.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Pionnier fondateur de Blacks One, orateur au poing levé et verbe habité, luttant pour l’émancipation civique et la souveraineté des mémoires.',
        duoPartnerName: 'Éléonore Vance',
        duoPartnerPhoto: '/assets/protagonists/eleonore-vance.jpg',
        duoId: 'duo-blacks-one-beyond-eve-01',
        episodeQuestion: '03 — Ce que l’on porte : Ce que l’on a reçu et qu’on refuse de poser.',
        protagonistIdRef: 'malik-barou',
        invitedPeople: [
          {
            id: 'cheikh-slam',
            name: 'Cheikh Fall',
            age: 27,
            role: 'Slameur & chroniqueur des coursives',
            territory: 'Médina (Dakar)',
            country: 'Sénégal',
            flag: '🇸🇳',
            universeTag: 'Blacks One',
            photoUrl: '/assets/protagonists/koffi-tisserand.jpg',
            badge: 'Invité(e)',
            invitedById: 'malik-barou',
            invitedByName: 'Malik Diop',
            invitationStory: 'Invité par Malik après un duel de verbe sous un réverbère de la Médina : Malik a vu dans sa plume le miroir exact de ses pas de danse.',
            duoPartnerName: 'Fatou Bamba',
            duoId: 'duo-blacks-one-beyond-eve-01',
            episodeQuestion: '01 — Qui suis-je quand la musique s’arrête ?',
            protagonistIdRef: 'malik-barou',
            invitedPeople: [
              {
                id: 'ousmane-beat',
                name: 'Ousmane',
                age: 22,
                role: 'Beatmaker et archiveur de rythmes populaires',
                territory: 'Pikine',
                country: 'Sénégal',
                flag: '🇸🇳',
                universeTag: 'Blacks One',
                photoUrl: '/assets/protagonists/kwame-mensah.jpg',
                badge: 'Invité(e)',
                invitedById: 'cheikh-slam',
                invitedByName: 'Cheikh Fall',
                invitationStory: 'Fait entrer par Cheikh pour enregistrer sur cassettes audio les percussions spontanées des vendeuses de poisson.',
                duoPartnerName: 'Solène',
                duoId: 'duo-blacks-one-beyond-eve-01',
                episodeQuestion: '02 — Le regard des autres sur notre colère.',
                protagonistIdRef: 'malik-barou'
              }
            ]
          },
          {
            id: 'ibrahima-guediawaye',
            name: 'Ibrahima',
            age: 35,
            role: 'Bâtisseur d’espaces d’art autogérés',
            territory: 'Guédiawaye',
            country: 'Sénégal',
            flag: '🇸🇳',
            universeTag: 'Blacks One',
            photoUrl: '/assets/protagonists/mahougnon-zounon.jpg',
            badge: 'Invité(e)',
            invitedById: 'malik-barou',
            invitedByName: 'Malik Diop',
            invitationStory: 'Invité par Malik pour avoir transformé un garage abandonné en conservatoire populaire pour 80 adolescents.',
            duoPartnerName: 'Aïcha',
            duoId: 'duo-blacks-one-beyond-eve-01',
            episodeQuestion: '04 — Devenir quelqu’un d’autre sans trahir d’où l’on vient.',
            protagonistIdRef: 'malik-barou'
          }
        ]
      },
      {
        id: 'eleonore-saint-cloud',
        name: 'Éléonore Vance',
        age: 39,
        role: 'Oratrice féministe & leader d’émancipation',
        territory: 'Marseille / Abidjan',
        country: 'Côte d’Ivoire & France',
        flag: '🇨🇮',
        universeTag: 'Beyond Eve',
        photoUrl: '/assets/protagonists/eleonore-vance.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Première effigie de Beyond Eve, oratrice portant à la tribune le combat vibrant pour la souveraineté, la dignité et les droits des femmes.',
        duoPartnerName: 'Malik Diop',
        duoPartnerPhoto: '/assets/protagonists/malik-diop.jpg',
        duoId: 'duo-blacks-one-beyond-eve-01',
        episodeQuestion: '03 — Racontez-nous ce que vous portez encore de votre histoire.',
        protagonistIdRef: 'eleonore-saint-cloud',
        invitedPeople: [
          {
            id: 'fatou-bamba',
            name: 'Fatou Bamba',
            age: 34,
            role: 'Designer textile & théoricienne du matrimoine',
            territory: 'Abidjan',
            country: 'Côte d’Ivoire',
            flag: '🇨🇮',
            universeTag: 'Beyond Eve',
            photoUrl: '/assets/protagonists/malik-diop.jpg',
            badge: 'Invité(e)',
            invitedById: 'eleonore-saint-cloud',
            invitedByName: 'Éléonore Vance',
            invitationStory: 'Invitée par Éléonore pour ses recherches pionnières sur la signification secrète des motifs kita féminins chez les Akan.',
            duoPartnerName: 'Cheikh Fall',
            duoId: 'duo-blacks-one-beyond-eve-01',
            episodeQuestion: '01 — Qui nous nomme avant que nous ayons parlé ?',
            protagonistIdRef: 'eleonore-saint-cloud',
            invitedPeople: [
              {
                id: 'solene-marseille',
                name: 'Solène',
                age: 26,
                role: 'Photographe argentique & archiviste militante',
                territory: 'Marseille',
                country: 'France',
                flag: '🇫🇷',
                universeTag: 'Beyond Eve',
                photoUrl: '/assets/protagonists/mawuna-medium.jpg',
                badge: 'Invité(e)',
                invitedById: 'fatou-bamba',
                invitedByName: 'Fatou Bamba',
                invitationStory: 'Fait entrer par Fatou pour immortaliser les mains des mères au travail à Noailles et Abobo sans aucun filtre exotisant.',
                duoPartnerName: 'Ousmane',
                duoId: 'duo-blacks-one-beyond-eve-01',
                episodeQuestion: '05 — À celle qui viendra après nous.',
                protagonistIdRef: 'eleonore-saint-cloud'
              }
            ]
          },
          {
            id: 'aicha-conteur',
            name: 'Aïcha',
            age: 41,
            role: 'Sculptrice sur bronze à la cire perdue & conteuse',
            territory: 'Grand-Bassam',
            country: 'Côte d’Ivoire',
            flag: '🇨🇮',
            universeTag: 'Beyond Eve',
            photoUrl: '/assets/protagonists/pere-matthieu.jpg',
            badge: 'Invité(e)',
            invitedById: 'eleonore-saint-cloud',
            invitedByName: 'Éléonore Vance',
            invitationStory: 'Invitée par Éléonore pour son courage d’avoir conquis un métier réservé aux hommes depuis 400 ans dans la lagune Ébrié.',
            duoPartnerName: 'Ibrahima',
            duoId: 'duo-blacks-one-beyond-eve-01',
            episodeQuestion: '04 — La mue : devenir qui l’on était destinée à être.',
            protagonistIdRef: 'eleonore-saint-cloud'
          }
        ]
      }
    ]
  },
  {
    seriesId: 'dixeat-fiat-luxe',
    seriesTitle: 'Fiat Luxe < > Sweet Street',
    subtitle: 'Ceux qui nourrissent les autres < > ceux qui créent des expériences d\'exception.',
    description: 'Le pont inattendu entre les géantes du feu de bois à Cotonou et les orfèvres des réceptions étoilées à Paris et Marrakech : comment chacun s\'est passé le flambeau de la délicatesse.',
    centralQuestion: 'L\'expérience',
    totalAffiliatedCount: 10,
    generationsCount: 3,
    pioneers: [
      {
        id: 'chef-koffi',
        name: 'Maman Henriette & Chef Koffi',
        age: 52,
        role: 'Maîtres cuisiniers du patrimoine vivant',
        territory: 'Cotonou',
        country: 'Bénin',
        flag: '🇧🇯',
        universeTag: 'Sweet Street',
        photoUrl: '/assets/protagonists/photographer-focus.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Première effigie de Sweet Street. Ils préparent 400 repas chaque jour dès l\'aurore à Dantokpa avec une dignité royale et le respect absolu de chaque convive.',
        duoPartnerName: 'Hélène Saint-Amand',
        duoPartnerPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        duoId: 'duo-dixeat-fiat-luxe-01',
        episodeQuestion: '01 — Le goût : Créer quelque chose qui touche l’autre au cœur.',
        protagonistIdRef: 'chef-koffi',
        invitedPeople: [
          {
            id: 'roland-huile',
            name: 'Roland',
            age: 38,
            role: 'Presseur d’huile rouge ancestrale & fermier bio',
            territory: 'Bohicon',
            country: 'Bénin',
            flag: '🇧🇯',
            universeTag: 'Sweet Street',
            photoUrl: '/assets/protagonists/researcher-phd.jpg',
            badge: 'Invité(e)',
            invitedById: 'chef-koffi',
            invitedByName: 'Chef Koffi',
            invitationStory: 'Fait entrer par Chef Koffi car son huile de palme rouge pressée à froid au pilon de bois donne à la sauce la saveur intemporelle des grand-mères.',
            duoPartnerName: 'Marc-Antoine',
            duoId: 'duo-dixeat-fiat-luxe-01',
            episodeQuestion: '03 — Le détail infime qui change tout.',
            protagonistIdRef: 'chef-koffi',
            invitedPeople: [
              {
                id: 'felicite-epices',
                name: 'Félicité',
                age: 29,
                role: 'Cueilleuse de poivres sauvages et graines de paradis',
                territory: 'Dassa-Zoumè',
                country: 'Bénin',
                flag: '🇧🇯',
                universeTag: 'Sweet Street',
                photoUrl: '/assets/protagonists/sayri-quispe.jpg',
                badge: 'Invité(e)',
                invitedById: 'roland-huile',
                invitedByName: 'Roland',
                invitationStory: 'Invitée par Roland pour faire découvrir les épices sacrées de savane qui soignent autant qu’elles régalent.',
                duoPartnerName: 'Yasmine',
                duoId: 'duo-dixeat-fiat-luxe-01',
                episodeQuestion: '05 — Ce que l’on offre sans compter.',
                protagonistIdRef: 'chef-koffi'
              }
            ]
          }
        ]
      },
      {
        id: 'helene-saint-amand',
        name: 'Hélène Saint-Amand',
        age: 49,
        role: 'Scénographe de tables d’exception & curatrice sensorielle',
        territory: 'Paris / Marrakech',
        country: 'France & Maroc',
        flag: '🇫🇷',
        universeTag: 'Fiat Luxe',
        photoUrl: '/assets/protagonists/senan-agossa.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Première effigie de Fiat Luxe. Crée des dîners pour 12 convives où chaque assiette, odeur et bougie est pensée comme une partition théâtrale pour susciter l’émotion pure.',
        duoPartnerName: 'Chef Koffi',
        duoPartnerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        duoId: 'duo-dixeat-fiat-luxe-01',
        episodeQuestion: '01 — L’attention particulière qui rend un instant inoubliable.',
        protagonistIdRef: 'helene-saint-amand',
        invitedPeople: [
          {
            id: 'marc-antoine-sommelier',
            name: 'Marc-Antoine',
            age: 41,
            role: 'Alchimiste des infusions & sommelier botanique',
            territory: 'Paris',
            country: 'France',
            flag: '🇫🇷',
            universeTag: 'Fiat Luxe',
            photoUrl: '/assets/protagonists/sika-dossou.jpg',
            badge: 'Invité(e)',
            invitedById: 'helene-saint-amand',
            invitedByName: 'Hélène Saint-Amand',
            invitationStory: 'Invité par Hélène pour ses accords subtils d\'eaux d\'herbes rares et de fermentations naturelles qui décuplent les arômes.',
            duoPartnerName: 'Roland',
            duoId: 'duo-dixeat-fiat-luxe-01',
            episodeQuestion: '02 — L’art d’écouter ce que l’autre attend en silence.',
            protagonistIdRef: 'helene-saint-amand',
            invitedPeople: [
              {
                id: 'yasmine-parfumeuse',
                name: 'Yasmine Benjelloun',
                age: 33,
                role: 'Nez parfumeur & créatrice de scénographies olfactives',
                territory: 'Marrakech',
                country: 'Maroc',
                flag: '🇲🇦',
                universeTag: 'Fiat Luxe',
                photoUrl: '/assets/protagonists/tobi-ganvie.jpg',
                badge: 'Invité(e)',
                invitedById: 'marc-antoine-sommelier',
                invitedByName: 'Marc-Antoine',
                invitationStory: 'Fait entrer par Marc-Antoine pour créer la signature olfactive de fleur d’oranger et de résine de cèdre diffusée avant les repas.',
                duoPartnerName: 'Félicité',
                duoId: 'duo-dixeat-fiat-luxe-01',
                episodeQuestion: '04 — La surprise qui bouleverse les certitudes.',
                protagonistIdRef: 'helene-saint-amand'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    seriesId: 'investors-builders',
    seriesTitle: 'Diasporas < > Makers',
    subtitle: 'Ceux qui financent le futur < > ceux qui bâtissent le réel.',
    description: 'Une alliance puissante entre la vision patiente du capital et la rigueur concrète du terrain, unissant investisseurs d’impact et bâtisseurs écologiques.',
    centralQuestion: 'L\'alliance',
    totalAffiliatedCount: 14,
    generationsCount: 3,
    pioneers: [
      {
        id: 'fatou-diallo',
        name: 'Fatou Diallo',
        age: 42,
        role: 'Investisseuse à impact & mécène',
        territory: 'Dakar & Paris',
        country: 'Sénégal',
        flag: '🇸🇳',
        universeTag: 'Investors',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Pionnière de l’investissement à impact, engagée à prouver que le capital peut nourrir la souveraineté plutôt que la dépendance.',
        duoPartnerName: 'Kwame Mensah',
        duoPartnerPhoto: '/assets/duos/kwame-mensah.jpg',
        duoId: 'duo-investors-builders-01',
        episodeQuestion: '01 — Le premier pari où vous avez engagé vos ressources ou vos mains sans certitude.',
        protagonistIdRef: 'fatou-diallo',
        invitedPeople: [
          {
            id: 'amadou-kane',
            name: 'Amadou Kane',
            age: 58,
            role: 'Banquier de développement solidaire',
            territory: 'Saint-Louis',
            country: 'Sénégal',
            flag: '🇸🇳',
            universeTag: 'Investors',
            photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
            badge: 'Invité(e)',
            invitedById: 'fatou-diallo',
            invitedByName: 'Fatou Diallo',
            invitationStory: 'Mentor de Fatou, pionnier des caisses de crédit mutuel rurale en Casamance.',
            duoPartnerName: 'Maître Kofi Annan',
            duoId: 'duo-investors-builders-01',
            episodeQuestion: '02 — La tempête financière qui a éprouvé la fidélité de l’alliance.',
            protagonistIdRef: 'fatou-diallo',
            invitedPeople: []
          }
        ]
      },
      {
        id: 'kwame-mensah',
        name: 'Kwame Mensah',
        age: 38,
        role: 'Éco-constructeur & bâtisseur de terre',
        territory: 'Cotonou & Kigali',
        country: 'Bénin',
        flag: '🇧🇯',
        universeTag: 'Builders',
        photoUrl: '/assets/duos/kwame-mensah.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Bâtisseur de terre crue et concepteur d’éco-matériaux, il matérialise les visions d’infrastructures durables.',
        duoPartnerName: 'Fatou Diallo',
        duoPartnerPhoto: '/assets/duos/fatou-diallo.jpg',
        duoId: 'duo-investors-builders-01',
        episodeQuestion: '01 — Le premier pari où vous avez engagé vos ressources ou vos mains sans certitude.',
        protagonistIdRef: 'kwame-mensah',
        invitedPeople: [
          {
            id: 'sena-houndete',
            name: 'Sena Houndété',
            age: 26,
            role: 'Ingénieure en architecture bioclimatique',
            territory: 'Cotonou',
            country: 'Bénin',
            flag: '🇧🇯',
            universeTag: 'Builders',
            photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
            badge: 'Invité(e)',
            invitedById: 'kwame-mensah',
            invitedByName: 'Kwame Mensah',
            invitationStory: 'Apprentie formée sur les chantiers de voûtes nubiennes, devenue conceptrice de campus zéro-carbone.',
            duoPartnerName: 'Mariama Fall',
            duoId: 'duo-investors-builders-01',
            episodeQuestion: '03 — La rencontre décisive entre finance et matière.',
            protagonistIdRef: 'kwame-mensah',
            invitedPeople: []
          }
        ]
      }
    ]
  },
  {
    seriesId: 'other-eyes-sixth-sense',
    seriesTitle: 'Other Sights < > Third Eye',
    subtitle: 'Voir autrement. Ressentir l’invisible.',
    description: 'Quand l’écoute vibratoire et la clairvoyance transcendent les limites du visible : une lignée de passeurs qui décodent les mémoires et le souffle du monde.',
    centralQuestion: 'La Perception',
    totalAffiliatedCount: 12,
    generationsCount: 3,
    pioneers: [
      {
        id: 'codjo-blind',
        name: 'Pascal Cossi',
        age: 36,
        role: 'Président de « Voir Autrement » & Prêtre du Fâ',
        territory: 'Ganvié & Cotonou',
        country: 'Bénin',
        flag: '🇧🇯',
        universeTag: 'Other Sights',
        photoUrl: '/assets/duos/codjo-blind.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Président de l’association Voir Autrement et prêtre du Fâ, initiateur d’une lignée solidaire d’artisans.',
        duoPartnerName: 'Mawuna Houénou',
        duoPartnerPhoto: '/assets/duos/mawuna-medium.jpg',
        duoId: 'duo-other-eyes-sixth-sense-01',
        episodeQuestion: '01 — Que voit-on quand le monde ferme les yeux ?',
        protagonistIdRef: 'codjo-blind',
        invitedPeople: [
          {
            id: 'cecile-artisan',
            name: 'Cécile',
            age: 29,
            role: 'Artisane maroquinière (sacs en perles)',
            territory: 'Cotonou',
            country: 'Bénin',
            flag: '🇧🇯',
            universeTag: 'Other Sights',
            photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
            badge: 'Filleule de Pascal',
            invitedById: 'codjo-blind',
            invitedByName: 'Pascal Cossi',
            invitationStory: 'Parrainée par Pascal au sein de l’association Voir Autrement pour développer son atelier de sacs perlés.',
            duoPartnerName: 'Mawuna Houénou',
            duoId: 'duo-other-eyes-sixth-sense-01',
            episodeQuestion: '02 — La texture des songes et le tissage sans lumière.',
            protagonistIdRef: 'codjo-blind',
            invitedPeople: [
              {
                id: 'norbert-menuisier',
                name: 'Norbert',
                age: 41,
                role: 'Maître artisan (tabourets traditionnels en bois)',
                territory: 'Allada & Cotonou',
                country: 'Bénin',
                flag: '🇧🇯',
                universeTag: 'Other Sights',
                photoUrl: '/assets/duos/kwame-mensah.jpg',
                badge: 'Filleul de Cécile',
                invitedById: 'cecile-artisan',
                invitedByName: 'Cécile',
                invitationStory: 'Accueilli dans la lignée par Cécile pour transmettre la taille de sièges et tabourets en bois brut.',
                duoPartnerName: 'Vieux Ahouan',
                duoId: 'duo-other-eyes-sixth-sense-01',
                episodeQuestion: '03 — L’assise des aïeux et la mémoire du bois.',
                protagonistIdRef: 'codjo-blind',
                invitedPeople: []
              }
            ]
          }
        ]
      },
      {
        id: 'mawuna-medium',
        name: 'Mawuna Houénou',
        age: 44,
        role: 'Voyante, médium & guérisseuse d’âmes',
        territory: 'Ouidah & Abomey',
        country: 'Bénin',
        flag: '🇧🇯',
        universeTag: 'Third Eye',
        photoUrl: '/assets/duos/mawuna-medium.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Sensible aux vibrations et aux mémoires de la terre sacrée de Ouidah, reliant le monde visible aux présences invisibles.',
        duoPartnerName: 'Pascal Cossi',
        duoPartnerPhoto: '/assets/duos/codjo-blind.jpg',
        duoId: 'duo-other-eyes-sixth-sense-01',
        episodeQuestion: '01 — Que voit-on quand le monde ferme les yeux ?',
        protagonistIdRef: 'mawuna-medium',
        invitedPeople: [
          {
            id: 'na-agbessi',
            name: 'Na Agbessi',
            age: 72,
            role: 'Matriarche guérisseuse de Ouidah',
            territory: 'Ouidah',
            country: 'Bénin',
            flag: '🇧🇯',
            universeTag: 'Third Eye',
            photoUrl: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
            badge: 'Invité(e)',
            invitedById: 'mawuna-medium',
            invitedByName: 'Mawuna Houénou',
            invitationStory: 'A guidé Mawuna dans l’apaisement de ses dons et le discernement du cœur.',
            duoPartnerName: 'Vieux Ahouan',
            duoId: 'duo-other-eyes-sixth-sense-01',
            episodeQuestion: '03 — Le silence qui guérit.',
            protagonistIdRef: 'mawuna-medium',
            invitedPeople: []
          }
        ]
      }
    ]
  }
];

// Conservation sans réécriture des arbres issus d'anciennes séries sans correspondance directe v2
export const UNMAPPED_SERIES_AFFILIATION_TREES: SeriesAffiliationTree[] =
  RAW_SERIES_AFFILIATION_TREES.filter((tree) => !resolveSeriesById(tree.seriesId));

export const SERIES_AFFILIATION_TREES: SeriesAffiliationTree[] =
  RAW_SERIES_AFFILIATION_TREES.filter((tree) => Boolean(resolveSeriesById(tree.seriesId))).map((tree) => {
    const mappedSeries = resolveSeriesById(tree.seriesId)!;
    return {
      ...tree,
      seriesId: mappedSeries.id,
      seriesTitle: mappedSeries.title,
      centralQuestion: mappedSeries.episodes[0].question,
    };
  });

