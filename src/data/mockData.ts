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
  SERIES_POSTER_FILES,
  SeriesRegistryEntry,
  resolveCanonicalSeriesId,
  resolveSeriesById,
} from './seriesRegistry';

const SERIES_EXTRAS_BY_ID: Record<
  string,
  Pick<Documentary, 'effigies' | 'territories' | 'protagonistsCount'>
> = {
  'remedes-e-vivi': {
    effigies: [
      {
        id: 'eff-care-1',
        name: 'Mireille Akplogan',
        role: 'Médecin urgentiste au CNHU-HKM (Cotonou)',
        photoUrl: '/assets/duos/care-mireille.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_PRINCIPALE',
      },
      {
        id: 'eff-feed-2',
        name: 'Koffi Mensah',
        role: 'Artisan cuisinier de rue au marché Dantokpa',
        photoUrl: '/assets/duos/chef-koffi.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_SERIE',
      },
    ],
    protagonistsCount: 8,
    territories: ['Cotonou', 'Porto-Novo', 'Parakou', 'Bohicon'],
  },
  'amin-amen-legba': {
    effigies: [
      {
        id: 'eff-2',
        name: 'Dieudonné Agonhossou',
        role: 'Prêtre et philosophe du dialogue des mémoires (Ouidah & Cotonou)',
        photoUrl: '/assets/duos/duo_pere_matthieu_1791655226601.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_PRINCIPALE',
      },
      {
        id: 'eff-1',
        name: 'Mahougnon Zounon Gbegnon',
        role: 'Gardien du sanctuaire des mémoires ancestrales (Allada & Ouidah)',
        photoUrl: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_SERIE',
      },
    ],
    protagonistsCount: 8,
    territories: ['Ouidah', 'Allada', 'Cotonou', 'Abomey'],
  },
  'phd-azovi': {
    effigies: [
      {
        id: 'eff-phd-2',
        name: 'Nadège Zinsou',
        role: 'Docteure en sciences cognitives & chercheuse (Abomey-Calavi)',
        photoUrl: '/assets/duos/researcher-phd.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_PRINCIPALE',
      },
      {
        id: 'eff-bambou-2',
        name: 'Sénan Agossa',
        role: 'Jeune innovatrice & ingénieure (Cotonou & Abomey-Calavi)',
        photoUrl: '/assets/images/senan_innovatrice_1792933679487.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_SERIE',
      },
    ],
    protagonistsCount: 6,
    territories: ['Abomey-Calavi', 'Cotonou', 'Porto-Novo', 'Ouidah'],
  },
  'blacks-one-nyonoukpo': {
    effigies: [
      {
        id: 'eff-bo-1',
        name: 'Malik Diop',
        role: 'Penseur civique, orateur & passeur de mémoires (Cotonou & Dakar)',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_PRINCIPALE',
      },
      {
        id: 'eff-be-2',
        name: 'Éléonore Vance',
        role: 'Oratrice & fondatrice de collectif féminin (Cotonou & Abidjan)',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_SERIE',
      },
    ],
    protagonistsCount: 6,
    territories: ['Cotonou', 'Porto-Novo', 'Dakar', 'Abidjan'],
  },
  'fiat-luxe-irokos': {
    effigies: [
      {
        id: 'eff-fl-1',
        name: 'Kpèdétin Houndégla',
        role: 'Joaillière & créatrice de parures royales (Cotonou & Abomey)',
        photoUrl: '/assets/images/kpedetin_joailliere_1792933718361.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_PRINCIPALE',
      },
      {
        id: 'eff-baobab-1',
        name: 'Kiki Alapini',
        role: 'Doyen des récits lacustres & passeur de mémoires (Ganvié)',
        photoUrl: '/assets/images/kiki_passeur_1792933820505.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_SERIE',
      },
    ],
    protagonistsCount: 6,
    territories: ['Abomey', 'Ganvié', 'Cotonou', 'Ouidah'],
  },
  'horizons-finagnon': {
    effigies: [
      {
        id: 'eff-hor-2',
        name: 'Awa Ndiaye',
        role: 'Conteuse & médiatrice culturelle (Saint-Louis, Sénégal)',
        photoUrl: '/assets/duos/horizons-awa.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_PRINCIPALE',
      },
      {
        id: 'eff-fin-1',
        name: 'Tobi Houndegla',
        role: 'Maître charpentier de pirogues & pêcheur (Ganvié)',
        photoUrl: '/assets/duos/tobi-houndegla.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_SERIE',
      },
    ],
    protagonistsCount: 6,
    territories: ['Saint-Louis', 'Ganvié', 'Porto-Novo', 'Grand-Popo'],
  },
  'builders-mi-do-kpo': {
    effigies: [
      {
        id: 'eff-build-2',
        name: 'Sènami Houndété',
        role: 'Architecte & bâtisseuse bioclimatique (Cotonou)',
        photoUrl: '/assets/images/senami_architecte_1792933801804.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_PRINCIPALE',
      },
      {
        id: 'eff-akwe-2',
        name: 'Fatou Diallo',
        role: 'Investisseuse à impact & mécène (Dakar & Cotonou)',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_SERIE',
      },
    ],
    protagonistsCount: 6,
    territories: ['Cotonou', 'Ouidah', 'Abomey', 'Dakar'],
  },
  'regards-gbe': {
    effigies: [
      {
        id: 'eff-chancelle-regards',
        name: 'Chancelle Agbo',
        role: 'Photographe documentaire & cinéaste (Ouidah & Cotonou)',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_PRINCIPALE',
      },
      {
        id: 'eff-armel-words',
        name: 'Armel Hounkpatin',
        role: 'Slameur & Poète du verbe vivant (Cotonou)',
        photoUrl: '/assets/duos/paroles-armel.jpg',
        videoUrl: '/sample.mp4',
        status: 'EFFIGIE_SERIE',
      },
    ],
    protagonistsCount: 6,
    territories: ['Ouidah', 'Cotonou', 'Porto-Novo', 'Parakou'],
  },
};

function buildDocumentaryFromRegistry(series: SeriesRegistryEntry): Documentary {
  const extras = SERIES_EXTRAS_BY_ID[series.id];
  return {
    id: series.id,
    slug: series.id,
    title: series.title,
    subtitle: `${series.partA.name} ‹ › ${series.partB.name}`,
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
    documentaryId: 'horizons-finagnon',
    universeTag: 'Finagnon',
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
          duoId: 'duo-horizons-finagnon-01',
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
    documentaryId: 'horizons-finagnon',
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
          duoId: 'duo-horizons-finagnon-01',
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
    documentaryId: 'horizons-finagnon',
    universeTag: 'Horizons',
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
          duoId: 'duo-horizons-finagnon-01',
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
    documentaryId: 'amin-amen-legba',
    universeTag: 'Legba',
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
          duoId: 'duo-amin-amen-legba-01',
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
    documentaryId: 'amin-amen-legba',
    universeTag: 'Amin Amen',
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
          duoId: 'duo-amin-amen-legba-01',
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
    firstName: 'Tobi',
    age: 38,
    role: 'Maître charpentier de pirogues & pêcheur',
    territory: 'Ganvié (Cité lacustre)',
    country: 'Bénin',
    flag: '🇧🇯',
    bio: 'À Ganvié, on dit que Tobi connaît l’âge de chaque pieu d’acajou enfoncé sous la lagune Nokoué. Né sur l’eau, il taille les pirogues qui permettent aux enfants d’aller à l’école et aux marchandes d’atteindre le marché flottant.',
    photoUrl: '/assets/duos/tobi-houndegla.jpg',
    videoAvatarUrl: '/sample.mp4',
    documentaryId: 'horizons-finagnon',
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
          partnerName: 'Awa Ndiaye',
          partnerRole: 'Conteuse & médiatrice culturelle (Saint-Louis)',
          partnerPhoto: '/assets/duos/horizons-awa.jpg',
          duoId: 'duo-horizons-finagnon-01',
          question: '01 — Chez Soi : Racontez le moment où vous avez senti que vous étiez enfin chez vous.'
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
        videoCoverUrl: '/assets/duos/tobi-houndegla.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Tobi Houndegla' },
          { role: 'director', label: 'Réalisateur', name: 'Ayaba Senou' }
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
    photoUrl: '/assets/duos/sayri-quispe.jpg',
    documentaryId: 'horizons-finagnon',
    universeTag: 'Horizons',
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
          partnerPhoto: '/assets/duos/tobi-houndegla.jpg',
          duoId: 'duo-horizons-finagnon-01',
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
        videoCoverUrl: '/assets/duos/sayri-quispe.jpg',
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
    firstName: 'Malik',
    age: 31,
    role: 'Orateur civique & penseur panafricain',
    territory: 'Cotonou & Dakar',
    country: 'Bénin & Sénégal',
    flag: '🇧🇯',
    bio: 'Entre Cotonou et Dakar, la parole habitée et le regard tourné vers l’avenir, Malik incarne la force de conviction du mouvement Blacks One. Un orateur engagé pour la fierté, la dignité et la souveraineté des récits africains.',
    photoUrl: '/assets/duos/malik-diop.jpg',
    videoAvatarUrl: '/sample.mp4',
    documentaryId: 'blacks-one-nyonoukpo',
    universeTag: 'Blacks One',
    quote: '« L’émancipation commence le jour où l’on refuse de regarder son histoire avec les yeux de ceux qui l’ont confisquée. »',
    tree: {
      transmissions: [
        {
          id: 't-6',
          title: 'Les pas du sabar royal et des tambours d’Abomey',
          ancestorOrMentor: 'Son oncle El Hadj Diop',
          description: 'La cadence des pieds sur la terre battue qui raconte l’histoire d’un peuple debout.'
        }
      ],
      duos: [
        {
          id: 'duo-3',
          partnerName: 'Éléonore Vance',
          partnerRole: 'Oratrice & fondatrice de collectif féminin',
          partnerPhoto: '/assets/duos/eleonore-vance.jpg',
          duoId: 'duo-blacks-one-nyonoukpo-01',
          question: '01 — La fierté : Racontez le moment où vous avez appris à être fier de qui vous êtes.'
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
        videoCoverUrl: '/assets/duos/malik-diop.jpg',
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
    firstName: 'Éléonore',
    age: 39,
    role: 'Oratrice féministe & bâtisseuse de collectifs',
    territory: 'Cotonou & Abidjan',
    country: 'Bénin & Côte d’Ivoire',
    flag: '🇧🇯',
    bio: 'Entre Cotonou et Abidjan, Éléonore porte une parole ardente pour la dignité, l’admiration et les droits des femmes. À travers le mouvement Nyonoukpo, elle célèbre la puissance quotidienne des mères, des sœurs et des bâtisseuses africaines.',
    photoUrl: '/assets/duos/eleonore-vance.jpg',
    videoAvatarUrl: '/sample.mp4',
    documentaryId: 'blacks-one-nyonoukpo',
    universeTag: 'Nyonoukpo',
    quote: '« La liberté et la dignité des femmes n’attendent pas qu’on leur fasse de la place : elles éclairent toute la société. »',
    tree: {
      transmissions: [
        {
          id: 't-7',
          title: 'Le pagne tissé de ma grand-mère Akissi',
          ancestorOrMentor: 'Akissi Vance',
          description: 'L’art de lire les motifs de royauté et de force féminine transmis en silence.'
        }
      ],
      duos: [
        {
          id: 'duo-3-bis',
          partnerName: 'Malik Diop',
          partnerRole: 'Orateur civique & penseur panafricain',
          partnerPhoto: '/assets/duos/malik-diop.jpg',
          duoId: 'duo-blacks-one-nyonoukpo-01',
          question: '01 — La fierté : Racontez le moment où vous avez appris à être fier de qui vous êtes.'
        }
      ],
      opportunities: [
        {
          id: 'o-7',
          title: 'Mentorat artistique et civique pour jeunes femmes',
          description: 'Accompagnement annuel de jeunes créatrices et porteuses de projets à Cotonou.',
          badge: 'Mentorat'
        }
      ],
      creations: [
        {
          id: 'c-7',
          title: 'Tapisserie « Les Noms Oubliés »',
          type: 'Œuvre textile',
          description: 'Fresque brodée à la main en hommage aux bâtisseuses du quotidien.'
        }
      ],
      projects: [
        {
          id: 'p-6',
          title: 'La Maison Nyonoukpo de Cotonou',
          stage: 'Atelier actif',
          description: 'Un atelier partagé réunissant des artisanes et oratrices d’Afrique de l’Ouest.'
        }
      ],
      needs: [
        {
          id: 'n-6',
          title: 'Métier à tisser horizontal grand format',
          urgency: 'En cours',
          description: 'Soutien pour équiper l’atelier collectif.'
        }
      ]
    },
    stories: [
      {
        id: 'story-eleonore-01',
        title: 'La malle aux pagnes d’honneur',
        questionNumber: '01',
        questionTitle: 'La fierté',
        duration: '11:45',
        videoDurationSeconds: 705,
        summary: 'Éléonore raconte comment elle a ouvert l’ancienne malle familiale et découvert quarante ans de dignité et de courage silencieux transmis par sa mère.',
        videoCoverUrl: '/assets/duos/eleonore-vance.jpg',
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
    name: 'Koffi Mensah',
    firstName: 'Koffi',
    age: 44,
    role: 'Artisan cuisinier au marché Dantokpa',
    territory: 'Cotonou (Dantokpa)',
    country: 'Bénin',
    flag: '🇧🇯',
    bio: 'Au cœur du grand marché de Dantokpa à Cotonou, Koffi cuisine depuis l’aube sur des foyers en terre cuite. Il sublime l’igname pilée, les sauces gboman aux écrevisses fumées et les bouillons mijotés pour nourrir des centaines de travailleurs chaque jour.',
    photoUrl: '/assets/duos/chef-koffi.jpg',
    videoAvatarUrl: '/sample.mp4',
    documentaryId: 'remedes-e-vivi',
    universeTag: 'E Vivi',
    quote: '« La cuisine n’a pas besoin d’étoiles : elle a besoin de bras qui n’ont pas peur de la fumée et d’un cœur qui veut nourrir l’âme. »',
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
          partnerName: 'Mireille Akplogan',
          partnerRole: 'Médecin urgentiste au CNHU-HKM de Cotonou',
          partnerPhoto: '/assets/duos/care-mireille.jpg',
          duoId: 'duo-remedes-e-vivi-01',
          question: '01 — L’évidence : Racontez le moment où vous avez compris que votre métier serait de vous occuper des autres.'
        }
      ],
      opportunities: [
        {
          id: 'o-8',
          title: 'Formation gratuite des jeunes du quartier aux bases culinaires',
          description: 'Chaque semestre, Koffi prend 3 apprentis pour leur transmettre un métier noble.',
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
          stage: 'En développement',
          description: 'Créer un point de distribution alimentaire solidaire avec récupération des surplus maraîchers.'
        }
      ],
      needs: [
        {
          id: 'n-7',
          title: 'Fours améliorés à faible fumée',
          urgency: 'Prioritaire',
          description: 'Préserver la santé respiratoire des cuisinières et cuisiniers du marché.'
        }
      ]
    },
    stories: [
      {
        id: 'story-koffi-01',
        title: 'Le bol d’igname au milieu de l’orage',
        questionNumber: '01',
        questionTitle: 'L’évidence',
        duration: '08:52',
        videoDurationSeconds: 532,
        summary: 'Koffi raconte ce soir de déluge à Cotonou où un portefaix exténué a retrouvé ses forces devant sa marmite fumante de sauce gboman.',
        videoCoverUrl: '/assets/duos/chef-koffi.jpg',
        credits: [
          { role: 'story_owner', label: 'Propriétaire de l’histoire', name: 'Koffi Mensah' },
          { role: 'director', label: 'Réalisateur', name: 'Ayaba Senou' }
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
    photoUrl: '/assets/duos/eleonore-vance.jpg',
    documentaryId: 'fiat-luxe-irokos',
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
          partnerName: 'Koffi Mensah',
          partnerRole: 'Cuisinier de rue',
          partnerPhoto: '/assets/duos/chef-koffi.jpg',
          duoId: 'duo-fiat-luxe-irokos-01',
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
        videoCoverUrl: '/assets/duos/eleonore-vance.jpg',
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
    documentaryId: 'builders-mi-do-kpo',
    universeTag: 'Mi do kpô',
    quote: '« Investir, ce n’est pas acheter l’avenir, c’est donner les moyens au présent de s’enraciner. »',
    tree: {
      passeurs: [
        {
          id: 'p-amadou',
          name: 'Amadou Kane',
          role: 'Banquier de développement solidaire',
          country: 'Sénégal',
          photo: '/assets/duos/eleonore-vance.jpg'
        }
      ],
      heritiers: [
        {
          id: 'h-mariama',
          name: 'Mariama Fall',
          role: 'Analyste d’impact environnemental',
          country: 'Sénégal',
          photo: '/assets/duos/fatou-diallo.jpg'
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
          duoId: 'duo-builders-mi-do-kpo-01',
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
    documentaryId: 'builders-mi-do-kpo',
    universeTag: 'Builders',
    quote: '« La terre ne ment pas. Elle ne demande qu’un toit pour la protéger et une main pour la tasser. »',
    tree: {
      passeurs: [
        {
          id: 'p-kofi',
          name: 'Maître Kofi Annan',
          role: 'Maçon traditionnel de voûtes nubiennes',
          country: 'Ghana',
          photo: '/assets/images/dossou_logistique_1792933781153.jpg'
        }
      ],
      heritiers: [
        {
          id: 'h-junior',
          name: 'Sena Houndété',
          role: 'Apprenti maçon en terre battue',
          country: 'Bénin',
          photo: '/assets/images/koffi_portonovo_1792933660999.jpg'
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
          duoId: 'duo-builders-mi-do-kpo-01',
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
    documentaryId: 'amin-amen-legba',
    universeTag: 'Legba',
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
          duoId: 'duo-amin-amen-legba-01',
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
    documentaryId: 'amin-amen-legba',
    universeTag: 'Legba',
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
          duoId: 'duo-amin-amen-legba-01',
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
          duoId: 'duo-phd-azovi-01',
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
          duoId: 'duo-phd-azovi-01',
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
    id: 'photographer-chancelle',
    slug: 'photographer-chancelle',
    name: 'Chancelle Agbo',
    firstName: 'Chancelle',
    age: 34,
    role: 'Photographe documentaire & cinéaste',
    country: 'Bénin',
    territory: 'Ouidah & Cotonou',
    flag: '🇧🇯',
    photo: '/assets/duos/photographer-focus.jpg',
    photoUrl: '/assets/duos/photographer-focus.jpg',
    videoPreviewUrl: '/sample.mp4',
    videoAvatarUrl: '/sample.mp4',
    teaserVideoUrl: '/sample.mp4',
    documentaryId: 'regards-gbe',
    quote: '« Le cadre n’enferme pas le monde : il le révèle. Quand tu presses le déclencheur au marché de Ouidah, tu reçois une confidence. »',
    bio: 'Quinze ans de chroniques visuelles sur la côte béninoise, saisissant la beauté des marchés, des gestes quotidiens et de la lumière du golfe.',
    universeTag: 'Regards',
    centralQuestion: 'Racontez le moment où vous avez compris que si vous ne le disiez pas, personne ne le dirait à votre place.',
    storiesCount: 6,
    transmissionsCount: 4,
    projectsCount: 2,
    stories: [
      {
        id: 'story-photographer-chancelle-01',
        title: 'L’aube dorée sur les étals de Ouidah',
        questionNumber: '01',
        questionTitle: 'Prendre la parole',
        duration: '09:10',
        videoDurationSeconds: 550,
        summary: 'Chancelle raconte l’attente patiente à la porte du marché de Ouidah pour capter sans un mot le regard souverain d’une tisseuse à l’ouverture du jour.',
        videoCoverUrl: '/assets/duos/photographer-focus.jpg',
        credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Chancelle Agbo' }]
      }
    ]
  },
  {
    id: 'researcher-eleonore',
    slug: 'researcher-nadege',
    name: 'Nadège Zinsou',
    firstName: 'Nadège',
    age: 40,
    role: 'Docteure (PhD) en sciences cognitives & chercheuse',
    country: 'Bénin',
    territory: 'Abomey-Calavi & Cotonou',
    flag: '🇧🇯',
    photo: '/assets/duos/researcher-phd.jpg',
    photoUrl: '/assets/duos/researcher-phd.jpg',
    videoPreviewUrl: '/sample.mp4',
    videoAvatarUrl: '/sample.mp4',
    teaserVideoUrl: '/sample.mp4',
    documentaryId: 'phd-azovi',
    quote: '« Une thèse n’est pas un diplôme qu’on accroche : c’est une promesse faite à nos savoirs de ne jamais se contenter de l’à-peu-près. »',
    bio: 'Formée à l’Université d’Abomey-Calavi, Nadège consacre ses travaux de recherche aux modèles cognitifs de la transmission orale et de la mémoire collective au Bénin.',
    universeTag: 'PhD',
    centralQuestion: 'Racontez votre tout premier jour là où vous avez commencé à apprendre votre métier.',
    storiesCount: 5,
    transmissionsCount: 3,
    projectsCount: 4,
    stories: [
      {
        id: 'story-researcher-nadege-01',
        title: 'La nuit de soutenance à Abomey-Calavi',
        questionNumber: '01',
        questionTitle: 'Le premier jour',
        duration: '08:15',
        videoDurationSeconds: 495,
        summary: 'Nadège partage son tout premier jour au laboratoire d’Abomey-Calavi face à son tableau noir, décidée à démontrer que les contes oraux béninois obéissent à une architecture cognitive d’une précision mathématique.',
        videoCoverUrl: '/assets/duos/researcher-phd.jpg',
        credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Dre. Nadège Zinsou' }]
      }
    ]
  },
  {
    id: 'mireille-akplogan',
    slug: 'mireille-akplogan',
    name: 'Mireille Akplogan',
    firstName: 'Mireille',
    age: 35,
    role: 'Médecin urgentiste (Dre.) au CNHU-HKM',
    country: 'Bénin',
    territory: 'Cotonou',
    flag: '🇧🇯',
    photo: '/assets/duos/care-mireille.jpg',
    photoUrl: '/assets/duos/care-mireille.jpg',
    videoPreviewUrl: '/sample.mp4',
    videoAvatarUrl: '/sample.mp4',
    teaserVideoUrl: '/sample.mp4',
    documentaryId: 'remedes-e-vivi',
    quote: '« Soigner à Cotonou, c’est tenir la main de quelqu’un à trois heures du matin jusqu’à ce que la fièvre recule devant la patience. »',
    bio: 'Médecin aux urgences du CNHU-HKM de Cotonou, Mireille veille chaque nuit sur les patients et tisse un pont bienveillant entre médecine hospitalière et écoute humaine.',
    universeTag: 'Remèdes',
    centralQuestion: 'Racontez le moment où vous avez compris que votre métier serait de vous occuper des autres.',
    storiesCount: 4,
    transmissionsCount: 3,
    projectsCount: 2,
    stories: [
      {
        id: 'story-mireille-01',
        title: 'La garde d’harmattan aux urgences de Cotonou',
        questionNumber: '01',
        questionTitle: "L'évidence",
        duration: '09:05',
        videoDurationSeconds: 545,
        summary: 'Mireille raconte la première nuit où, encore jeune interne au CNHU, le sourire apaisé d’une mère après un accouchement difficile a scellé sa vocation.',
        videoCoverUrl: '/assets/duos/care-mireille.jpg',
        credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Dre. Mireille Akplogan' }]
      }
    ]
  },
  {
    id: 'kiki-alapini',
    slug: 'kiki-alapini',
    name: 'Kiki Alapini',
    firstName: 'Kiki',
    age: 72,
    role: 'Doyen des récits lacustres & gardien de mémoire',
    country: 'Bénin',
    territory: 'Ganvié',
    flag: '🇧🇯',
    photo: '/assets/images/kiki_passeur_1792933820505.jpg',
    photoUrl: '/assets/images/kiki_passeur_1792933820505.jpg',
    videoPreviewUrl: '/sample.mp4',
    videoAvatarUrl: '/sample.mp4',
    teaserVideoUrl: '/sample.mp4',
    documentaryId: 'fiat-luxe-irokos',
    quote: '« L’iroko n’est pas pressé : il offre son ombre à ceux qui viendront écouter bien après lui. »',
    bio: 'Figure respectée de la lagune Nokoué, Doyen Kiki Alapini rassemble les jeunes autour des pirogues pour transmettre la sagesse orale, la patience et la mémoire des aînés.',
    universeTag: 'Irokos',
    centralQuestion: 'Racontez ce que vous avez mis des années à apprendre, et que vous ne savez toujours pas expliquer avec des mots.',
    storiesCount: 6,
    transmissionsCount: 7,
    projectsCount: 2,
    stories: [
      {
        id: 'story-kiki-01',
        title: 'Les contes du soir sous le grand iroko',
        questionNumber: '01',
        questionTitle: "Ce qui ne s'explique pas",
        duration: '10:20',
        videoDurationSeconds: 620,
        summary: 'À 72 ans, Kiki évoque cette écoute silencieuse de la lagune apprise auprès de son grand-père : une justesse de jugement qui s’acquiert avec les années sans jamais pouvoir se mettre en manuel.',
        videoCoverUrl: '/assets/images/kiki_passeur_1792933820505.jpg',
        credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Kiki Alapini' }]
      }
    ]
  },
  {
    id: 'senan-agossa',
    slug: 'senan-agossa',
    name: 'Sénan Agossa',
    firstName: 'Sénan',
    age: 24,
    role: 'Apprentie électrotechnicienne & jeune technicienne solaire',
    country: 'Bénin',
    territory: 'Cotonou & Abomey-Calavi',
    flag: '🇧🇯',
    photo: '/assets/images/senan_innovatrice_1792933679487.jpg',
    photoUrl: '/assets/images/senan_innovatrice_1792933679487.jpg',
    videoPreviewUrl: '/sample.mp4',
    videoAvatarUrl: '/sample.mp4',
    teaserVideoUrl: '/sample.mp4',
    documentaryId: 'phd-azovi',
    quote: '« On peut lire dix manuels sur le courant, mais c’est le jour où l’on tient le fer à souder dans l’atelier de Cotonou que les mains comprennent. »',
    bio: 'Formée à l’atelier dès 18 ans aux côtés d’un maître électricien de Fidjrossè, Sénan assemble aujourd’hui des systèmes solaires autonomes en apprenant chaque geste sur le terrain.',
    universeTag: 'Azovi',
    centralQuestion: 'Racontez votre tout premier jour là où vous avez commencé à apprendre votre métier.',
    storiesCount: 4,
    transmissionsCount: 3,
    projectsCount: 3,
    stories: [
      {
        id: 'story-senan-01',
        title: 'Le premier jour à l’atelier de Fidjrossè',
        questionNumber: '01',
        questionTitle: 'Le premier jour',
        duration: '07:15',
        videoDurationSeconds: 435,
        summary: 'Sénan évoque son tout premier matin à l’atelier de Fidjrossè où son patron lui a confié son premier multimètre et une radio en panne à réparer devant tout le monde.',
        videoCoverUrl: '/assets/images/senan_innovatrice_1792933679487.jpg',
        credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Sénan Agossa' }]
      }
    ]
  },
  {
    id: 'kpedetin-houndegla',
    slug: 'kpedetin-houndegla',
    name: 'Kpèdétin Houndégla',
    firstName: 'Kpèdétin',
    age: 36,
    role: 'Joaillière & créatrice de parures royales',
    country: 'Bénin',
    territory: 'Cotonou & Abomey',
    flag: '🇧🇯',
    photo: '/assets/images/kpedetin_joailliere_1792933718361.jpg',
    photoUrl: '/assets/images/kpedetin_joailliere_1792933718361.jpg',
    videoPreviewUrl: '/sample.mp4',
    videoAvatarUrl: '/sample.mp4',
    teaserVideoUrl: '/sample.mp4',
    documentaryId: 'fiat-luxe-irokos',
    quote: '« Le vrai luxe béninois ne se mesure pas au poids de l’or, mais au temps infini offert à chaque courbe ciselée à la main. »',
    bio: 'Formée auprès des maîtres bronziers d’Abomey, Kpèdétin crée des parures d’or, de bronze et de pierres précieuses célébrant l’art royal du Danxomè.',
    universeTag: 'Fiat Luxe',
    centralQuestion: 'Racontez ce que vous avez mis des années à apprendre, et que vous ne savez toujours pas expliquer avec des mots.',
    storiesCount: 5,
    transmissionsCount: 4,
    projectsCount: 2,
    stories: [
      {
        id: 'story-kpedetin-01',
        title: 'La fonte du premier bracelet d’Abomey',
        questionNumber: '01',
        questionTitle: "Ce qui ne s'explique pas",
        duration: '08:50',
        videoDurationSeconds: 530,
        summary: 'Kpèdétin raconte comment ses doigts reconnaissent aujourd’hui la température exacte du bronze en fusion, un savoir du corps impossible à transmettre autrement qu’en restant des années devant la flamme.',
        videoCoverUrl: '/assets/images/kpedetin_joailliere_1792933718361.jpg',
        credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Kpèdétin Houndégla' }]
      }
    ]
  },
  {
    id: 'awa-ndiaye',
    slug: 'awa-ndiaye',
    name: 'Awa Ndiaye',
    firstName: 'Awa',
    age: 33,
    role: 'Conteuse & médiatrice culturelle',
    country: 'Sénégal',
    territory: 'Saint-Louis',
    flag: '🇸🇳',
    photo: '/assets/duos/horizons-awa.jpg',
    photoUrl: '/assets/duos/horizons-awa.jpg',
    videoPreviewUrl: '/sample.mp4',
    videoAvatarUrl: '/sample.mp4',
    teaserVideoUrl: '/sample.mp4',
    documentaryId: 'horizons-finagnon',
    quote: '« Saint-Louis est une île entre le fleuve et l’océan : quand je reviens sur le pont Faidherbe au coucher du soleil, je sais exactement d’où je parle. »',
    bio: 'Passeuse d’histoires à Saint-Louis du Sénégal, Awa dialogue avec la mer et les façades ocres de son île natale pour relier les cultures côtières d’Afrique de l’Ouest.',
    universeTag: 'Horizons',
    centralQuestion: 'Racontez le moment où vous avez senti que vous étiez enfin chez vous.',
    storiesCount: 4,
    transmissionsCount: 3,
    projectsCount: 2,
    stories: [
      {
        id: 'story-awa-01',
        title: 'Les balcons ocres au bord du fleuve Sénégal',
        questionNumber: '01',
        questionTitle: 'Chez soi',
        duration: '08:25',
        videoDurationSeconds: 505,
        summary: 'Awa évoque l’instant où le vent marin de la Langue de Barbarie lui a rappelé pourquoi elle avait choisi de revenir vivre et créer sur son île.',
        videoCoverUrl: '/assets/duos/horizons-awa.jpg',
        credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Awa Ndiaye' }]
      }
    ]
  },
  {
    id: 'yede-dossa',
    slug: 'yede-dossa',
    name: 'Yédê Dossa',
    firstName: 'Yédê',
    age: 29,
    role: 'Danseur chorégraphe & percussionniste',
    country: 'Bénin',
    territory: 'Cotonou',
    flag: '🇧🇯',
    photo: '/assets/duos/performers-yede.jpg',
    photoUrl: '/assets/duos/performers-yede.jpg',
    videoPreviewUrl: '/sample.mp4',
    videoAvatarUrl: '/sample.mp4',
    teaserVideoUrl: '/sample.mp4',
    quote: '« Quand le tambour résonne dans la cour de Cotonou, ce n’est plus mon corps qui danse, c’est la joie de tout le quartier qui respire. »',
    bio: 'Chorégraphe et maître des percussions contemporaines à Cotonou, Yédê fusionne les pas traditionnels du sud-Bénin avec la création scénique contemporaine.',
    universeTag: 'Arts vivants (hors lancement)',
    centralQuestion: "Racontez le moment où vous avez décidé de donner vie à quelque chose qui n'existait pas encore.",
    storiesCount: 5,
    transmissionsCount: 4,
    projectsCount: 3,
    stories: [
      {
        id: 'story-yede-01',
        title: 'La première pulsation dans la cour d’Akpakpa',
        questionNumber: '01',
        questionTitle: 'Donner vie',
        duration: '07:55',
        videoDurationSeconds: 475,
        summary: 'Yédê raconte la soirée d’inauguration de sa compagnie à Akpakpa où cinquante habitants sont montés improviser avec ses danseurs.',
        videoCoverUrl: '/assets/duos/performers-yede.jpg',
        credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Yédê Dossa' }]
      }
    ]
  },
  {
    id: 'senami-houndete',
    slug: 'senami-houndete',
    name: 'Sènami Houndété',
    firstName: 'Sènami',
    age: 34,
    role: 'Architecte & bâtisseuse bioclimatique',
    country: 'Bénin',
    territory: 'Cotonou & Ouidah',
    flag: '🇧🇯',
    photo: '/assets/images/senami_architecte_1792933801804.jpg',
    photoUrl: '/assets/images/senami_architecte_1792933801804.jpg',
    videoPreviewUrl: '/sample.mp4',
    videoAvatarUrl: '/sample.mp4',
    teaserVideoUrl: '/sample.mp4',
    documentaryId: 'builders-mi-do-kpo',
    quote: '« Bâtir en terre comprimée et en bois local sous le soleil de Cotonou, c’est prouver que notre architecture ancestrale est déjà futuriste. »',
    bio: 'Fondatrice d’un cabinet d’architecture bioclimatique à Cotonou, Sènami conçoit des écoles, des ateliers et des lieux culturels frais, durables et ancrés dans la terre béninoise.',
    universeTag: 'Builders',
    centralQuestion: "Racontez le moment où vous avez choisi cette voie, avec ce qu'elle comportait de risque ou de renoncement.",
    storiesCount: 4,
    transmissionsCount: 3,
    projectsCount: 5,
    stories: [
      {
        id: 'story-senami-01',
        title: 'Les plans tracés sous les palmiers de Cotonou',
        questionNumber: '01',
        questionTitle: 'Le pari',
        duration: '08:40',
        videoDurationSeconds: 520,
        summary: 'Sènami se rappelle le pari risqué de construire tout un pavillon scolaire en briques de latérite alors que tout le monde lui conseillait le béton.',
        videoCoverUrl: '/assets/images/senami_architecte_1792933801804.jpg',
        credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Sènami Houndété' }]
      }
    ]
  },
  {
    id: 'poet-armel',
    slug: 'poet-armel',
    name: 'Armel Hounkpatin',
    firstName: 'Armel',
    age: 31,
    role: 'Slameur & poète du verbe vivant',
    country: 'Bénin',
    territory: 'Cotonou',
    flag: '🇧🇯',
    photo: '/assets/duos/paroles-armel.jpg',
    photoUrl: '/assets/duos/paroles-armel.jpg',
    videoPreviewUrl: '/sample.mp4',
    videoAvatarUrl: '/sample.mp4',
    teaserVideoUrl: '/sample.mp4',
    documentaryId: 'regards-gbe',
    quote: '« Le mot a le poids du feu et la douceur de la pluie. Quand je scande mes vers à Cotonou, je réveille nos mémoires. »',
    bio: 'Voix vibrante de la scène littéraire et slam de Cotonou, Armel mêle français, fòn et poésie contemporaine pour faire entendre les histoires tues.',
    universeTag: 'Gbé',
    centralQuestion: 'Racontez le moment où vous avez compris que si vous ne le disiez pas, personne ne le dirait à votre place.',
    storiesCount: 5,
    transmissionsCount: 3,
    projectsCount: 3,
    stories: [
      {
        id: 'story-poet-armel-01',
        title: 'Le slam de l’Espace Culturel à Cotonou',
        questionNumber: '01',
        questionTitle: 'Prendre la parole',
        duration: '07:20',
        videoDurationSeconds: 440,
        summary: 'Armel raconte le soir où il a posé son carnet sur scène pour dire à voix haute ce que tout le quartier gardait enfoui.',
        videoCoverUrl: '/assets/duos/paroles-armel.jpg',
        credits: [{ role: 'story_owner', label: 'Propriétaire', name: 'Armel Hounkpatin' }]
      }
    ]
  }
];

const findProtagonist = (id: string, fallbackIndex = 0): Protagonist =>
  PROTAGONISTS.find((p) => p.id === id) || PROTAGONISTS[fallbackIndex] || PROTAGONISTS[0];

const RAW_DUOS: Duo[] = [
  {
    id: 'duo-remedes-e-vivi-01',
    slug: 'duo-remedes-e-vivi-01',
    documentaryId: 'remedes-e-vivi',
    documentaryTitle: 'Remèdes ‹ › E Vivi',
    episodeNumber: 'ÉPISODE 01',
    protagonistA: findProtagonist('mireille-akplogan'),
    protagonistB: findProtagonist('chef-koffi'),
    questionNumber: '01',
    questionTitle: "L'évidence",
    centralQuestion: 'Racontez le moment où vous avez compris que votre métier serait de vous occuper des autres.',
    quoteA: '« À trois heures du matin aux urgences de Cotonou, quand la main d’un patient serre la vôtre, vous savez que vous êtes exactement à votre place. »',
    quoteB: '« Dès l’aube à Dantokpa, quand la fumée de la marmite réchauffe les visages fatigués, nourrir devient une façon silencieuse de soigner. »',
    coverImage: SERIES_POSTER_FILES['remedes-e-vivi'].mainPosterUrl,
    storyA: findProtagonist('mireille-akplogan').stories[0],
    storyB: findProtagonist('chef-koffi').stories[0],
    editorialReflection: 'Entre la blouse blanche du CNHU et les braises vivantes de Dantokpa, soigner et nourrir obéissent au même serment béninois : tenir les autres debout.'
  },
  {
    id: 'duo-amin-amen-legba-01',
    slug: 'duo-amin-amen-legba-01',
    documentaryId: 'amin-amen-legba',
    documentaryTitle: 'Amin Amen ‹ › Legba',
    episodeNumber: 'ÉPISODE 01',
    protagonistA: findProtagonist('pere-matthieu'),
    protagonistB: findProtagonist('dah-zounon'),
    questionNumber: '01',
    questionTitle: "L'appel",
    centralQuestion: "Racontez le moment où vous avez senti qu'il existait quelque chose de plus grand que vous.",
    quoteA: '« Je suis entré dans la nef déserte de Ouidah pour fuir la brûlure du soleil. Ce n’est pas un miracle qui m’a retenu : c’était la certitude d’être attendu. »',
    quoteB: '« Ce n’était pas un coup de tonnerre. C’était la chaleur d’une poignée de terre d’Allada, un jour où je croyais que le monde était mort. »',
    coverImage: SERIES_POSTER_FILES['amin-amen-legba'].mainPosterUrl,
    storyA: findProtagonist('pere-matthieu').stories[0],
    storyB: findProtagonist('dah-zounon').stories[0],
    editorialReflection: 'Deux traditions spirituelles du Bénin se découvrent ici une racine commune : l’humilité devant l’invisible et la nécessité de ne pas traverser l’obscurité seul.'
  },
  {
    id: 'duo-phd-azovi-01',
    slug: 'duo-phd-azovi-01',
    documentaryId: 'phd-azovi',
    documentaryTitle: 'PhD ‹ › Azovi',
    episodeNumber: 'ÉPISODE 01',
    protagonistA: findProtagonist('researcher-eleonore'),
    protagonistB: findProtagonist('senan-agossa'),
    questionNumber: '01',
    questionTitle: 'Le premier jour',
    centralQuestion: 'Racontez votre tout premier jour là où vous avez commencé à apprendre votre métier.',
    quoteA: '« Le premier jour devant mon tableau noir à Abomey-Calavi, j’ai juré de prouver la rigueur mathématique cachée dans nos savoirs oraux. »',
    quoteB: '« Le premier matin à l’atelier de Fidjrossè, quand mon patron m’a posé une radio ouverte entre les mains, j’ai compris qu’apprendre commence par oser toucher. »',
    coverImage: SERIES_POSTER_FILES['phd-azovi'].mainPosterUrl,
    storyA: findProtagonist('researcher-eleonore').stories[0],
    storyB: findProtagonist('senan-agossa').stories[0],
    editorialReflection: 'De la bibliothèque d’Abomey-Calavi à l’établi de Fidjrossè, la recherche et l’apprentissage révèlent la même ferveur du commencement.'
  },
  {
    id: 'duo-blacks-one-nyonoukpo-01',
    slug: 'duo-blacks-one-nyonoukpo-01',
    documentaryId: 'blacks-one-nyonoukpo',
    documentaryTitle: 'Blacks One ‹ › Nyonoukpo',
    episodeNumber: 'ÉPISODE 01',
    protagonistA: findProtagonist('malik-diop'),
    protagonistB: findProtagonist('eleonore-vance'),
    questionNumber: '01',
    questionTitle: 'La fierté',
    centralQuestion: 'Racontez le moment où vous avez appris à être fier de qui vous êtes.',
    quoteA: '« L’émancipation commence le jour où l’on refuse de regarder son histoire avec les yeux de ceux qui l’ont confisquée. »',
    quoteB: '« En ouvrant la malle des pagnes de ma mère, j’ai compris que la force et la dignité des femmes portent nos sociétés entières. »',
    coverImage: SERIES_POSTER_FILES['blacks-one-nyonoukpo'].mainPosterUrl,
    storyA: findProtagonist('malik-diop').stories[0],
    storyB: findProtagonist('eleonore-vance').stories[0],
    editorialReflection: 'Entre la fierté panafricaine et l’hommage vibrant aux femmes bâtisseuses, ce face-à-face célèbre une dignité libre et solaire.'
  },
  {
    id: 'duo-fiat-luxe-irokos-01',
    slug: 'duo-fiat-luxe-irokos-01',
    documentaryId: 'fiat-luxe-irokos',
    documentaryTitle: 'Fiat Luxe ‹ › Irokos',
    episodeNumber: 'ÉPISODE 01',
    protagonistA: findProtagonist('kpedetin-houndegla'),
    protagonistB: findProtagonist('kiki-alapini'),
    questionNumber: '01',
    questionTitle: "Ce qui ne s'explique pas",
    centralQuestion: 'Racontez ce que vous avez mis des années à apprendre, et que vous ne savez toujours pas expliquer avec des mots.',
    quoteA: '« Reconnaître à l’œil nu l’instant précis où le bronze en fusion d’Abomey devient docile demande dix ans de flamme et zéro manuel. »',
    quoteB: '« Sur la lagune de Ganvié, savoir quand se taire et quand parler à celui qui doute vient avec les années, jamais d’un livre. »',
    coverImage: SERIES_POSTER_FILES['fiat-luxe-irokos'].mainPosterUrl,
    storyA: findProtagonist('kpedetin-houndegla').stories[0],
    storyB: findProtagonist('kiki-alapini').stories[0],
    editorialReflection: 'L’excellence du geste joaillier béninois rencontre la sagesse patiente des aînés de Ganvié : deux maîtrises sculptées uniquement par le temps.'
  },
  {
    id: 'duo-horizons-finagnon-01',
    slug: 'duo-horizons-finagnon-01',
    documentaryId: 'horizons-finagnon',
    documentaryTitle: 'Horizons ‹ › Finagnon',
    episodeNumber: 'ÉPISODE 01',
    protagonistA: findProtagonist('awa-ndiaye'),
    protagonistB: findProtagonist('tobi-houndegla'),
    questionNumber: '01',
    questionTitle: 'Chez soi',
    centralQuestion: 'Racontez le moment où vous avez senti que vous étiez enfin chez vous.',
    quoteA: '« En retrouvant les façades ocres de Saint-Louis face au fleuve, j’ai senti que ma voix n’avait jamais quitté cette île. »',
    quoteB: '« Le jour où ma pirogue a glissé dans la brume de Ganvié sans que j’aie besoin de regarder le rivage : cette lagune est dans mon sang. »',
    coverImage: SERIES_POSTER_FILES['horizons-finagnon'].mainPosterUrl,
    storyA: findProtagonist('awa-ndiaye').stories[0],
    storyB: findProtagonist('tobi-houndegla').stories[0],
    editorialReflection: 'Des berges de Saint-Louis à la cité lacustre de Ganvié, le chez-soi se reconnaît à l’accord immédiat entre l’être et son élément.'
  },
  {
    id: 'duo-builders-mi-do-kpo-01',
    slug: 'duo-builders-mi-do-kpo-01',
    documentaryId: 'builders-mi-do-kpo',
    documentaryTitle: 'Builders ‹ › Mi do kpô',
    episodeNumber: 'ÉPISODE 01',
    protagonistA: findProtagonist('senami-houndete'),
    protagonistB: findProtagonist('fatou-diallo'),
    questionNumber: '01',
    questionTitle: 'Le choix',
    centralQuestion: "Racontez le moment où vous avez choisi cette voie, avec ce qu'elle comportait de risque ou de renoncement.",
    quoteA: '« Tout le monde me disait que bâtir une école en terre comprimée à Cotonou était fou : c’est ce choix qui a prouvé que nos matériaux peuvent tout porter. »',
    quoteB: '« Investir mes premières économies dans un atelier dont les banques ne voulaient pas m’a appris que la confiance est le vrai capital. »',
    coverImage: SERIES_POSTER_FILES['builders-mi-do-kpo'].mainPosterUrl,
    storyA: findProtagonist('senami-houndete').stories[0],
    storyB: findProtagonist('fatou-diallo').stories[0],
    editorialReflection: 'Entre celles et ceux qui entreprennent et celles et ceux qui tiennent le bien commun, bâtir commence toujours par un choix assumé.'
  },
  {
    id: 'duo-regards-gbe-01',
    slug: 'duo-regards-gbe-01',
    documentaryId: 'regards-gbe',
    documentaryTitle: 'Regards ‹ › Gbé',
    episodeNumber: 'ÉPISODE 01',
    protagonistA: findProtagonist('photographer-chancelle'),
    protagonistB: findProtagonist('poet-armel'),
    questionNumber: '01',
    questionTitle: 'Prendre la parole',
    centralQuestion: 'Racontez le moment où vous avez compris que si vous ne le disiez pas, personne ne le dirait à votre place.',
    quoteA: '« À Ouidah, lorsque je cadre un visage avant l’aube, l’image dit exactement ce que les discours officiels ont oublié. »',
    quoteB: '« Le mot claque comme un tambour dans la nuit : si nous n’écrivons pas nos propres récits de Cotonou, d’autres les effaceront. »',
    coverImage: SERIES_POSTER_FILES['regards-gbe'].mainPosterUrl,
    storyA: findProtagonist('photographer-chancelle').stories[0],
    storyB: findProtagonist('poet-armel').stories[0],
    editorialReflection: 'Quand l’objectif patient de la photographe de Ouidah répond au verbe du slameur béninois, la vérité du réel trouve enfin sa double voix.'
  }
];

// Conservation sans réécriture des éventuels duos hérités sans correspondance directe v2
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
    photo: '/assets/duos/kwame-mensah.jpg',
    photoUrl: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
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
    photo: '/assets/duos/malik-diop.jpg',
    photoUrl: '/assets/duos/mawuna-medium.jpg',
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
    photo: '/assets/duos/pere-matthieu.jpg',
    photoUrl: '/assets/duos/photographer-focus.jpg',
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
    photo: '/assets/duos/researcher-phd.jpg',
    photoUrl: '/assets/duos/sayri-quispe.jpg',
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
    documentaryId: 'horizons-finagnon',
    documentaryTitle: 'Horizons ‹ › Finagnon',
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
    documentaryId: 'horizons-finagnon',
    documentaryTitle: 'Horizons ‹ › Finagnon',
    universeGroup: 'Horizons',
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
    documentaryId: 'amin-amen-legba',
    documentaryTitle: 'Amin Amen ‹ › Legba',
    universeGroup: 'Legba',
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
    documentaryId: 'blacks-one-nyonoukpo',
    documentaryTitle: 'Blacks One ‹ › Nyonoukpo',
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
    documentaryId: 'fiat-luxe-irokos',
    documentaryTitle: 'Fiat Luxe ‹ › Irokos',
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
    documentaryId: 'amin-amen-legba',
    documentaryTitle: 'Amin Amen ‹ › Legba',
    universeGroup: 'Amin Amen',
    status: 'APPROUVEES',
    submittedDate: '28 Août 2026',
    assignedReviewer: 'Direction Éditoriale',
    technicalStatus: 'VALIDE',
    videoDuration: '11:20'
  }
];

const RAW_SERIES_AFFILIATION_TREES: SeriesAffiliationTree[] = [
  {
    seriesId: 'amin-amen-legba',
    seriesTitle: 'Amin Amen ‹ › Legba',
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
        universeTag: 'Legba',
        photoUrl: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Pionnier fondateur de la série. A accepté d\'ouvrir le secret des seuils sacrés pour que la jeunesse comprenne la vraie nature protectrice de Legba.',
        duoPartnerName: 'Dieudonné',
        duoPartnerPhoto: '/assets/duos/duo_pere_matthieu_1791655226601.jpg',
        duoId: 'duo-amin-amen-legba-01',
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
            universeTag: 'Amin Amen',
            photoUrl: '/assets/images/senan_innovatrice_1792933679487.jpg',
            badge: 'Invité(e)',
            invitedById: 'dah-zounon',
            invitedByName: 'Mahougnon',
            invitationStory: 'Invitée par Mahougnon après qu\'ils ont soigné ensemble des enfants fébriles au dispensaire de Toffo, échangeant tisanes de racines et prières d\'oraison.',
            duoPartnerName: 'Hounon Gbaguidi',
            duoId: 'duo-amin-amen-legba-01',
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
                universeTag: 'Amin Amen',
                photoUrl: '/assets/images/sika_tisserande_1792933605542.jpg',
                badge: 'Invité(e)',
                invitedById: 'soeur-blandine',
                invitedByName: 'Sœur Blandine',
                invitationStory: 'Fait entrer dans la série par Sœur Blandine pour son témoignage sur le silence nocturne des ruches et la contemplation des psaumes.',
                duoPartnerName: 'Marie-Noëlle',
                duoId: 'duo-amin-amen-legba-01',
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
            universeTag: 'Legba',
            photoUrl: '/assets/duos/tobi-ganvie.jpg',
            badge: 'Invité(e)',
            invitedById: 'dah-zounon',
            invitedByName: 'Mahougnon',
            invitationStory: 'Invité par Mahougnon pour son talent rare à forger les fers d\'Asen et à raconter le mystère du feu qui purifie la colère.',
            duoPartnerName: 'Pasteur Emmanuel',
            duoId: 'duo-amin-amen-legba-01',
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
        universeTag: 'Amin Amen',
        photoUrl: '/assets/duos/duo_pere_matthieu_1791655226601.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Pionnier fondateur représentant le pôle Amin Amen. A voulu témoigner d\'une foi dépouillée de tout mépris envers les traditions des ancêtres.',
        duoPartnerName: 'Mahougnon',
        duoPartnerPhoto: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
        duoId: 'duo-amin-amen-legba-01',
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
            universeTag: 'Amin Amen',
            photoUrl: '/assets/duos/tobi-houndegla.jpg',
            badge: 'Invité(e)',
            invitedById: 'pere-matthieu',
            invitedByName: 'Dieudonné',
            invitationStory: 'Fait entrer par Dieudonné après des nuits entières passées à apaiser les tensions entre jeunes convertis et anciens du village.',
            duoPartnerName: 'Hounon Gbaguidi',
            duoId: 'duo-amin-amen-legba-01',
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
                universeTag: 'Amin Amen',
                photoUrl: '/assets/images/amara_andine_1792933642777.jpg',
                badge: 'Invité(e)',
                invitedById: 'pasteur-emmanuel',
                invitedByName: 'Pasteur Emmanuel',
                invitationStory: 'Invitée par le pasteur pour faire entendre la voix des femmes qui portent la foi quotidienne au marché et sous la pluie.',
                duoPartnerName: 'Frère Jean-Baptiste',
                duoId: 'duo-amin-amen-legba-01',
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
            universeTag: 'Amin Amen',
            photoUrl: '/assets/images/amara_andine_1792933642777.jpg',
            badge: 'Invité(e)',
            invitedById: 'pere-matthieu',
            invitedByName: 'Dieudonné',
            invitationStory: 'Invité par Dieudonné pour son engagement auprès des plus vulnérables à Dantokpa sans jamais juger personne.',
            duoPartnerName: 'Mahougnon',
            duoId: 'duo-amin-amen-legba-01',
            episodeQuestion: '02 — L’amour éprouvé par la nuit.',
            protagonistIdRef: 'pere-matthieu'
          }
        ]
      }
    ]
  },
  {
    seriesId: 'horizons-finagnon',
    seriesTitle: 'Horizons ‹ › Finagnon',
    subtitle: 'Horizons ‹ › Finagnon. Deux territoires. Une même réflexion sur ce qui nous relie à un lieu.',
    description: 'Comment l\'alliance entre des passeurs béninois et des voix d\'autres nations tisse une communauté vivante de piroguiers, conteuses et gardiens des mémoires.',
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
        photoUrl: '/assets/duos/paroles-armel.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Première effigie et initiateur du volet Finagnon. A posé la question originelle : « Que transmet une main qui tisse depuis l\'enfance ? »',
        duoPartnerName: 'Amara',
        duoPartnerPhoto: '/assets/images/amara_andine_1792933642777.jpg',
        duoId: 'duo-horizons-finagnon-01',
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
            photoUrl: '/assets/duos/athlete-hurdle.jpg',
            badge: 'Invité(e)',
            invitedById: 'koffi-tisserand',
            invitedByName: 'Koffi',
            invitationStory: 'Fait entrer par Koffi : Tobi sculptait les bois de teck sur les pilotis de Ganvié exactement avec la même patience que Koffi tendait ses fils.',
            duoPartnerName: 'Sayri',
            duoId: 'duo-horizons-finagnon-01',
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
                photoUrl: '/assets/duos/chef-koffi.jpg',
                badge: 'Invité(e)',
                invitedById: 'tobi-ganvie',
                invitedByName: 'Tobi',
                invitationStory: 'Invitée par Tobi pour capturer le chant des rames frappant l\'eau avant l\'aube et les berceuses toffinou oubliées.',
                duoPartnerName: 'Nayra',
                duoId: 'duo-horizons-finagnon-01',
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
                    photoUrl: '/assets/duos/coach-office.jpg',
                    badge: 'Invité(e)',
                    invitedById: 'amina-diallo',
                    invitedByName: 'Amina',
                    invitationStory: 'Initié par Amina après qu’il a créé la première harpe d’eau en roseaux de la lagune de Nokoué.',
                    duoPartnerName: 'Nayra',
                    duoId: 'duo-horizons-finagnon-01',
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
            photoUrl: '/assets/duos/codjo-blind.jpg',
            badge: 'Invité(e)',
            invitedById: 'koffi-tisserand',
            invitedByName: 'Koffi',
            invitationStory: 'Invitée par Koffi pour sa mémoire des plantes tinctoriales sauvages du cordon littoral.',
            duoPartnerName: 'Don Huamán',
            duoId: 'duo-horizons-finagnon-01',
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
        universeTag: 'Horizons',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Première effigie du volet Horizons. A fait résonner la laine d\'alpaga avec le coton de Koffi par-delà l\'océan Pacifique et l\'Atlantique.',
        duoPartnerName: 'Koffi',
        duoPartnerPhoto: '/assets/images/koffi_tisserand_1792933625628.jpg',
        duoId: 'duo-horizons-finagnon-01',
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
            universeTag: 'Horizons',
            photoUrl: '/assets/duos/eleonore-vance.jpg',
            badge: 'Invité(e)',
            invitedById: 'amara-tisserande',
            invitedByName: 'Amara',
            invitationStory: 'Invité par Amara : ses champs en terrasses sont les parchemins vivants dont les motifs de ses tissages sont issus.',
            duoPartnerName: 'Tobi',
            duoId: 'duo-horizons-finagnon-01',
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
                universeTag: 'Horizons',
                photoUrl: '/assets/duos/fatou-diallo.jpg',
                badge: 'Invité(e)',
                invitedById: 'sayri-pisac',
                invitedByName: 'Sayri',
                invitationStory: 'Inspirée par Sayri pour documenter le regard des jeunes filles quechuas face au tourisme de masse et préserver la dignité du geste.',
                duoPartnerName: 'Amina',
                duoId: 'duo-horizons-finagnon-01',
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
            universeTag: 'Horizons',
            photoUrl: '/assets/duos/eleonore-vance.jpg',
            badge: 'Invité(e)',
            invitedById: 'amara-tisserande',
            invitedByName: 'Amara',
            invitationStory: 'Fait entrer par Amara car il est le seul à connaître le secret de la teinture rouge cochenille fixée à l\'eau de source volcanique.',
            duoPartnerName: 'Ayaba',
            duoId: 'duo-horizons-finagnon-01',
            episodeQuestion: '03 — Les secrets confiés par le vent des hauteurs.',
            protagonistIdRef: 'amara-tisserande'
          }
        ]
      }
    ]
  },
  {
    seriesId: 'blacks-one-nyonoukpo',
    seriesTitle: 'Blacks One ‹ › Nyonoukpo',
    subtitle: 'Deux manières de dire ce qui compte. Identités noires et reconnaissance des femmes.',
    description: 'De la poussière des ronds-points de Dakar aux galeries militantes de Marseille et Abidjan : comment les deux côtés se sont cooptés pour réécrire les identités.',
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
        photoUrl: '/assets/duos/malik-diop.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Pionnier fondateur de Blacks One, orateur au poing levé et verbe habité, luttant pour l’émancipation civique et la souveraineté des mémoires.',
        duoPartnerName: 'Éléonore Vance',
        duoPartnerPhoto: '/assets/duos/eleonore-vance.jpg',
        duoId: 'duo-blacks-one-nyonoukpo-01',
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
            photoUrl: '/assets/images/koffi_tisserand_1792933625628.jpg',
            badge: 'Invité(e)',
            invitedById: 'malik-barou',
            invitedByName: 'Malik Diop',
            invitationStory: 'Invité par Malik après un duel de verbe sous un réverbère de la Médina : Malik a vu dans sa plume le miroir exact de ses pas de danse.',
            duoPartnerName: 'Fatou Bamba',
            duoId: 'duo-blacks-one-nyonoukpo-01',
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
                photoUrl: '/assets/duos/kwame-mensah.jpg',
                badge: 'Invité(e)',
                invitedById: 'cheikh-slam',
                invitedByName: 'Cheikh Fall',
                invitationStory: 'Fait entrer par Cheikh pour enregistrer sur cassettes audio les percussions spontanées des vendeuses de poisson.',
                duoPartnerName: 'Solène',
                duoId: 'duo-blacks-one-nyonoukpo-01',
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
            photoUrl: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
            badge: 'Invité(e)',
            invitedById: 'malik-barou',
            invitedByName: 'Malik Diop',
            invitationStory: 'Invité par Malik pour avoir transformé un garage abandonné en conservatoire populaire pour 80 adolescents.',
            duoPartnerName: 'Aïcha',
            duoId: 'duo-blacks-one-nyonoukpo-01',
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
        universeTag: 'Nyonoukpo',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Première effigie de Nyonoukpo, oratrice portant à la tribune le combat vibrant pour la souveraineté, la dignité et les droits des femmes.',
        duoPartnerName: 'Malik Diop',
        duoPartnerPhoto: '/assets/duos/malik-diop.jpg',
        duoId: 'duo-blacks-one-nyonoukpo-01',
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
            universeTag: 'Nyonoukpo',
            photoUrl: '/assets/duos/fatou-diallo.jpg',
            badge: 'Invité(e)',
            invitedById: 'eleonore-saint-cloud',
            invitedByName: 'Éléonore Vance',
            invitationStory: 'Invitée par Éléonore pour ses recherches pionnières sur la signification secrète des motifs kita féminins chez les Akan.',
            duoPartnerName: 'Cheikh Fall',
            duoId: 'duo-blacks-one-nyonoukpo-01',
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
                universeTag: 'Nyonoukpo',
                photoUrl: '/assets/duos/mawuna-medium.jpg',
                badge: 'Invité(e)',
                invitedById: 'fatou-bamba',
                invitedByName: 'Fatou Bamba',
                invitationStory: 'Fait entrer par Fatou pour immortaliser les mains des mères au travail à Noailles et Abobo sans aucun filtre exotisant.',
                duoPartnerName: 'Ousmane',
                duoId: 'duo-blacks-one-nyonoukpo-01',
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
            universeTag: 'Nyonoukpo',
            photoUrl: '/assets/duos/pere-matthieu.jpg',
            badge: 'Invité(e)',
            invitedById: 'eleonore-saint-cloud',
            invitedByName: 'Éléonore Vance',
            invitationStory: 'Invitée par Éléonore pour son courage d’avoir conquis un métier réservé aux hommes depuis 400 ans dans la lagune Ébrié.',
            duoPartnerName: 'Ibrahima',
            duoId: 'duo-blacks-one-nyonoukpo-01',
            episodeQuestion: '04 — La mue : devenir qui l’on était destinée à être.',
            protagonistIdRef: 'eleonore-saint-cloud'
          }
        ]
      }
    ]
  },
  {
    seriesId: 'remedes-e-vivi',
    seriesTitle: 'Remèdes ‹ › E Vivi',
    subtitle: 'Ceux qui soignent ‹ › ceux qui nourrissent.',
    description: 'Le pont entre les soignants de toutes les médecines et les artisans du champ, du feu et des marchés : comment chacun veille sur les autres dès l’aube.',
    centralQuestion: 'Veiller sur les autres',
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
        universeTag: 'E Vivi',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Première effigie d’E Vivi. Ils préparent 400 repas chaque jour dès l\'aurore à Dantokpa avec une dignité royale et le respect absolu de chaque convive.',
        duoPartnerName: 'Dre. Mireille Akplogan',
        duoPartnerPhoto: '/assets/duos/care-mireille.jpg',
        duoId: 'duo-remedes-e-vivi-01',
        episodeQuestion: '01 — L’évidence : Le moment où votre métier est devenu une évidence.',
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
            universeTag: 'E Vivi',
            photoUrl: '/assets/duos/researcher-phd.jpg',
            badge: 'Invité(e)',
            invitedById: 'chef-koffi',
            invitedByName: 'Koffi',
            invitationStory: 'Fait entrer par Koffi car son huile de palme rouge pressée à froid au pilon de bois donne à la sauce la saveur intemporelle des grand-mères.',
            duoPartnerName: 'Marc-Antoine',
            duoId: 'duo-remedes-e-vivi-01',
            episodeQuestion: '03 — Une rencontre marquante.',
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
                universeTag: 'E Vivi',
                photoUrl: '/assets/duos/sayri-quispe.jpg',
                badge: 'Invité(e)',
                invitedById: 'roland-huile',
                invitedByName: 'Roland',
                invitationStory: 'Invitée par Roland pour faire découvrir les épices sacrées de savane qui soignent autant qu’elles régalent.',
                duoPartnerName: 'Yasmine',
                duoId: 'duo-remedes-e-vivi-01',
                episodeQuestion: '04 — Ce qu’on ramène chez soi le soir.',
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
        role: 'Praticienne d’herboristerie & soins naturels',
        territory: 'Paris / Marrakech',
        country: 'France & Maroc',
        flag: '🇫🇷',
        universeTag: 'Remèdes',
        photoUrl: '/assets/images/senan_innovatrice_1792933679487.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Première effigie de Remèdes, explorant les infusions médicinales et l’art d’accueillir et d’apaiser.',
        duoPartnerName: 'Koffi',
        duoPartnerPhoto: '/assets/duos/chef-koffi.jpg',
        duoId: 'duo-remedes-e-vivi-01',
        episodeQuestion: '01 — Le geste de soin qui rend un instant inoubliable.',
        protagonistIdRef: 'helene-saint-amand',
        invitedPeople: [
          {
            id: 'marc-antoine-sommelier',
            name: 'Marc-Antoine',
            age: 41,
            role: 'Alchimiste des infusions & herboriste',
            territory: 'Paris',
            country: 'France',
            flag: '🇫🇷',
            universeTag: 'Remèdes',
            photoUrl: '/assets/images/sika_tisserande_1792933605542.jpg',
            badge: 'Invité(e)',
            invitedById: 'helene-saint-amand',
            invitedByName: 'Hélène Saint-Amand',
            invitationStory: 'Invité par Hélène pour ses préparations d\'eaux d\'herbes médicinales et de fermentations naturelles.',
            duoPartnerName: 'Roland',
            duoId: 'duo-remedes-e-vivi-01',
            episodeQuestion: '02 — Tenir bon quand tout pèse.',
            protagonistIdRef: 'helene-saint-amand',
            invitedPeople: [
              {
                id: 'yasmine-parfumeuse',
                name: 'Yasmine Benjelloun',
                age: 33,
                role: 'Apothicaire botanique & aromathérapeute',
                territory: 'Marrakech',
                country: 'Maroc',
                flag: '🇲🇦',
                universeTag: 'Remèdes',
                photoUrl: '/assets/duos/tobi-ganvie.jpg',
                badge: 'Invité(e)',
                invitedById: 'marc-antoine-sommelier',
                invitedByName: 'Marc-Antoine',
                invitationStory: 'Fait entrer par Marc-Antoine pour créer des baumes de fleur d’oranger et de résine de cèdre.',
                duoPartnerName: 'Félicité',
                duoId: 'duo-remedes-e-vivi-01',
                episodeQuestion: '04 — Ce qu’on ramène le soir.',
                protagonistIdRef: 'helene-saint-amand'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    seriesId: 'builders-mi-do-kpo',
    seriesTitle: 'Builders ‹ › Mi do kpô',
    subtitle: 'Bâtir pour soi ‹ › bâtir pour tous.',
    description: 'Deux façons de bâtir : celles et ceux qui entreprennent dans le réel et celles et ceux qui tiennent l’intérêt général et la vie commune.',
    centralQuestion: 'Le choix & la confiance',
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
        universeTag: 'Mi do kpô',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Pionnière du soutien aux ateliers et services locaux, engagée à prouver que les moyens investis avec discernement nourrissent le bien commun.',
        duoPartnerName: 'Sènami Houndété',
        duoPartnerPhoto: '/assets/images/senami_architecte_1792933801804.jpg',
        duoId: 'duo-builders-mi-do-kpo-01',
        episodeQuestion: '01 — Le choix de cette voie.',
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
            universeTag: 'Mi do kpô',
            photoUrl: '/assets/duos/tobi-houndegla.jpg',
            badge: 'Invité(e)',
            invitedById: 'fatou-diallo',
            invitedByName: 'Fatou Diallo',
            invitationStory: 'Mentor de Fatou, pionnier des caisses de crédit mutuel rurale en Casamance.',
            duoPartnerName: 'Maître Kofi Annan',
            duoId: 'duo-builders-mi-do-kpo-01',
            episodeQuestion: '02 — Quand tout a failli tomber.',
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
        duoId: 'duo-builders-mi-do-kpo-01',
        episodeQuestion: '01 — Le choix de cette voie.',
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
            photoUrl: '/assets/images/amara_andine_1792933642777.jpg',
            badge: 'Invité(e)',
            invitedById: 'kwame-mensah',
            invitedByName: 'Kwame Mensah',
            invitationStory: 'Apprentie formée sur les chantiers de voûtes nubiennes, devenue conceptrice de campus zéro-carbone.',
            duoPartnerName: 'Mariama Fall',
            duoId: 'duo-builders-mi-do-kpo-01',
            episodeQuestion: '03 — La confiance d’un autre.',
            protagonistIdRef: 'kwame-mensah',
            invitedPeople: []
          }
        ]
      }
    ]
  },
  {
    seriesId: 'phd-azovi',
    seriesTitle: 'PhD ‹ › Azovi',
    subtitle: 'Apprendre par la recherche ‹ › apprendre par la main.',
    description: 'Quand la patience de la recherche doctorale rencontre l’apprentissage sur le tas en atelier : une lignée de chercheurs et d’apprentis.',
    centralQuestion: 'Apprendre',
    totalAffiliatedCount: 12,
    generationsCount: 3,
    pioneers: [
      {
        id: 'codjo-blind',
        name: 'Pascal Cossi',
        age: 36,
        role: 'Président de « Voir Autrement » & Maître formateur',
        territory: 'Ganvié & Cotonou',
        country: 'Bénin',
        flag: '🇧🇯',
        universeTag: 'Azovi',
        photoUrl: '/assets/duos/codjo-blind.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Président de l’association Voir Autrement, initiateur d’une lignée solidaire d’apprentis artisans.',
        duoPartnerName: 'Dre. Nadège Zinsou',
        duoPartnerPhoto: '/assets/duos/researcher-phd.jpg',
        duoId: 'duo-phd-azovi-01',
        episodeQuestion: '01 — Le premier jour d’apprentissage.',
        protagonistIdRef: 'codjo-blind',
        invitedPeople: [
          {
            id: 'cecile-artisan',
            name: 'Cécile',
            age: 29,
            role: 'Apprentie maroquinière (sacs en perles)',
            territory: 'Cotonou',
            country: 'Bénin',
            flag: '🇧🇯',
            universeTag: 'Azovi',
            photoUrl: '/assets/images/amara_andine_1792933642777.jpg',
            badge: 'Filleule de Pascal',
            invitedById: 'codjo-blind',
            invitedByName: 'Pascal Cossi',
            invitationStory: 'Parrainée par Pascal au sein de l’association Voir Autrement pour développer son atelier de sacs perlés.',
            duoPartnerName: 'Dre. Nadège Zinsou',
            duoId: 'duo-phd-azovi-01',
            episodeQuestion: '02 — Apprendre en faisant.',
            protagonistIdRef: 'codjo-blind',
            invitedPeople: [
              {
                id: 'norbert-menuisier',
                name: 'Norbert',
                age: 41,
                role: 'Maître artisan menuisier (tabourets en bois)',
                territory: 'Allada & Cotonou',
                country: 'Bénin',
                flag: '🇧🇯',
                universeTag: 'Azovi',
                photoUrl: '/assets/duos/kwame-mensah.jpg',
                badge: 'Filleul de Cécile',
                invitedById: 'cecile-artisan',
                invitedByName: 'Cécile',
                invitationStory: 'Accueilli dans la lignée par Cécile pour transmettre la taille de sièges et tabourets en bois brut.',
                duoPartnerName: 'Vieux Ahouan',
                duoId: 'duo-phd-azovi-01',
                episodeQuestion: '03 — L’erreur formatrice.',
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
        role: 'Chercheuse sur les mémoires orales & médium',
        territory: 'Ouidah & Abomey',
        country: 'Bénin',
        flag: '🇧🇯',
        universeTag: 'PhD',
        photoUrl: '/assets/duos/mawuna-medium.jpg',
        isPioneer: true,
        badge: 'Première effigie',
        invitationStory: 'Explore la transmission des mémoires de la terre sacrée de Ouidah.',
        duoPartnerName: 'Pascal Cossi',
        duoPartnerPhoto: '/assets/duos/codjo-blind.jpg',
        duoId: 'duo-phd-azovi-01',
        episodeQuestion: '01 — Le premier jour.',
        protagonistIdRef: 'mawuna-medium',
        invitedPeople: [
          {
            id: 'na-agbessi',
            name: 'Na Agbessi',
            age: 72,
            role: 'Matriarche & passeuse de savoirs à Ouidah',
            territory: 'Ouidah',
            country: 'Bénin',
            flag: '🇧🇯',
            universeTag: 'PhD',
            photoUrl: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
            badge: 'Invité(e)',
            invitedById: 'mawuna-medium',
            invitedByName: 'Mawuna Houénou',
            invitationStory: 'A guidé Mawuna dans la compréhension de la mémoire orale.',
            duoPartnerName: 'Vieux Ahouan',
            duoId: 'duo-phd-azovi-01',
            episodeQuestion: '04 — Celui ou celle qui vous a formé.',
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

