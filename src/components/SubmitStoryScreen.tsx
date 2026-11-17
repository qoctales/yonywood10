import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pause,
  Volume2,
  VolumeX,
  DoorOpen,
  Scroll,
  X,
  UploadCloud,
  CheckCircle2,
  ArrowLeft,
  Check,
  AtSign,
  Loader2
} from 'lucide-react';
import { ViewScreen } from '../types';
import { STUDIO_PILLARS, StudioPillar, StudioPillarItem } from '../data/studioPillarsData';
import { DOCUMENTARIES } from '../data/mockData';
import { resolveCanonicalSeriesId, resolveSeriesById, SeriesSide } from '../data/seriesRegistry';
import { TvPlayerIcon } from './YonywoodBrandIcons';
import { celestialAudio } from '../utils/celestialAudio';
import { episodeVoiceReader } from '../utils/episodeVoiceReader';
import { useAuth } from '../services/authContext';
import { trySaveUserVideoSubmission, resolveSubmissionProfileTab } from '../utils/userVideoService';
import { formatFirstLetterOnly } from '../utils/textFormatters';
import { SHOW_FOCUS, SHOW_CAROUSEL_ARROWS } from '../config/flags';
import { STAGE_CARD_DIMENSIONS_CLASS, STAGE_PERSPECTIVE, STAGE_CENTER_TRANSLATE_Z } from '../config/cardLayout';

const SHOW_TOP_STORIES_BANNER = false;
const SHOW_HIDDEN_STUDIO_PILLARS = false;
const VISIBLE_STUDIO_PILLAR_IDS: StudioPillar['id'][] = SHOW_FOCUS ? ['focus', 'duos'] : ['duos'];

const VISIBLE_STUDIO_PILLARS: StudioPillar[] = SHOW_HIDDEN_STUDIO_PILLARS
  ? STUDIO_PILLARS
  : VISIBLE_STUDIO_PILLAR_IDS
      .map((id) => STUDIO_PILLARS.find((p) => p.id === id))
      .filter((p): p is StudioPillar => Boolean(p));

const DEFAULT_DIALOGUE_PILLAR: StudioPillar | null =
  VISIBLE_STUDIO_PILLARS.find((p) => p.id === 'duos') ||
  STUDIO_PILLARS.find((p) => p.id === 'duos') ||
  null;

export interface TaggedCollaborator {
  id: string;
  name: string;
  handle: string;
  role: string;
  avatarUrl?: string;
}

export interface PlatformMember {
  id: string;
  name: string;
  handle: string;
  role: string;
  avatarUrl?: string;
  category: 'realisation' | 'protagoniste' | 'post_production' | 'tous';
}

export const PLATFORM_MEMBERS: PlatformMember[] = [
  // Équipe et créateurs
  { id: 'usr-romeo', name: 'Romeo Nonvide', handle: '@romeo', role: 'Fondateur & Réalisateur', avatarUrl: '/assets/images/romeo_storyteller_1792933587573.jpg', category: 'realisation' },
  { id: 'v-armel', name: 'Armel Hounkpatin', handle: '@armel_h', role: 'Cadreur & Réalisateur documentaire', avatarUrl: '/assets/images/fagnon_agronome_1792933698985.jpg', category: 'realisation' },
  { id: 'v-amara', name: 'Amara Traoré', handle: '@amara_t', role: 'Cadreuse & Documentariste', avatarUrl: '/assets/images/amara_andine_1792933642777.jpg', category: 'realisation' },
  { id: 'v-kwame', name: 'Kwame Mensah', handle: '@kwame_m', role: 'Réalisateur & Chef opérateur', avatarUrl: '/assets/duos/kwame-mensah.jpg', category: 'realisation' },
  { id: 'v-koffi', name: 'Koffi Badou', handle: '@koffi_b', role: 'Chef opérateur & Cadreur', avatarUrl: '/assets/duos/chef-koffi.jpg', category: 'realisation' },
  { id: 'v-sarah', name: 'Sarah Lawson', handle: '@sarah_l', role: 'Cadreuse & Documentariste nomade', avatarUrl: '/assets/images/senami_architecte_1792933801804.jpg', category: 'realisation' },
  { id: 'v-helene', name: 'Hélène Saint-Amand', handle: '@helene_sa', role: 'Réalisatrice de création', avatarUrl: '/assets/protagonists/helene-saint-amand.jpg', category: 'realisation' },

  // Protagonistes inscrits
  { id: 'p-mahougnon', name: 'Mahougnon Zounon', handle: '@mahougnon_z', role: 'Gardien Vodun Rays', avatarUrl: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg', category: 'protagoniste' },
  { id: 'p-dieudonne', name: 'Dieudonné Dossou', handle: '@dieudonne_d', role: 'Prêtre & Théologien Autre Foi', avatarUrl: '/assets/duos/duo_pere_matthieu_1791655226601.jpg', category: 'protagoniste' },
  { id: 'p-tobi', name: 'Tobi Houndégla', handle: '@tobi_h', role: 'Pêcheur Toffinou (Ganvié)', avatarUrl: '/assets/duos/tobi-houndegla.jpg', category: 'protagoniste' },
  { id: 'p-sika', name: 'Sika Dossou', handle: '@sika_d', role: 'Maître tisserande d’Abomey', avatarUrl: '/assets/images/sika_tisserande_1792933605542.jpg', category: 'protagoniste' },
  { id: 'p-senan', name: 'Sénan Agossa', handle: '@senan_a', role: 'Entrepreneure & Innovatrice Aura Tech', avatarUrl: '/assets/images/senan_innovatrice_1792933679487.jpg', category: 'protagoniste' },
  { id: 'p-codjo', name: 'Pascal Cossy', handle: '@pascal_c', role: 'Président de « Voir Autrement » & Prêtre Fâ', avatarUrl: '/assets/duos/codjo-blind.jpg', category: 'protagoniste' },
  { id: 'p-malik', name: 'Malik Diop', handle: '@malik_d', role: 'Orateur & Leader d’émancipation', avatarUrl: '/assets/duos/malik-diop.jpg', category: 'protagoniste' },
  { id: 'p-eleonore', name: 'Éléonore Vance', handle: '@eleonore_v', role: 'Oratrice & Souveraineté des femmes', avatarUrl: '/assets/duos/eleonore-vance.jpg', category: 'protagoniste' },
  { id: 'p-mawuna', name: 'Mawuna Houénou', handle: '@mawuna_h', role: 'Passeuse de mémoire & Clairvoyante', avatarUrl: '/assets/duos/mawuna-medium.jpg', category: 'protagoniste' },
  { id: 'p-sayri', name: 'Sayri Quispe', handle: '@sayri_q', role: 'Tisseur des Andes (Pérou)', avatarUrl: '/assets/duos/sayri-quispe.jpg', category: 'protagoniste' },
  { id: 'p-koffi-m', name: 'Koffi Mensah', handle: '@koffi_m', role: 'Maître tisseur traditionnel de Porto-Novo', avatarUrl: '/assets/images/koffi_portonovo_1792933660999.jpg', category: 'protagoniste' },
  { id: 'p-kpedetin', name: 'Kpèdétin Houndégla', handle: '@kpedetin_h', role: 'Maître joaillière d’art', avatarUrl: '/assets/images/kpedetin_joailliere_1792933718361.jpg', category: 'protagoniste' },

  // Post-production
  { id: 'post-malik-sy', name: 'Malik Sy', handle: '@malik_s', role: 'Monteur & Étalonneur', avatarUrl: '/assets/duos/photographer-focus.jpg', category: 'post_production' },
  { id: 'post-christian', name: 'Christian Dossou', handle: '@christian_d', role: 'Ingénieur du son & Mixeur', avatarUrl: '/assets/duos/athlete-hurdle.jpg', category: 'post_production' },
  { id: 'post-fatou', name: 'Fatou Diallo', handle: '@fatou_d', role: 'Monteuse & Story Editor', avatarUrl: '/assets/duos/fatou-diallo.jpg', category: 'post_production' },
  { id: 'post-dossou', name: 'Dossou Zounon', handle: '@dossou_z', role: 'Sound designer & Compositeur', avatarUrl: '/assets/images/dossou_logistique_1792933781153.jpg', category: 'post_production' },
  { id: 'post-senou', name: 'Ayaba Houénou', handle: '@ayaba_h', role: 'Monteuse chef & Mixeuse', avatarUrl: '/assets/images/ayaba_nectar_1792933764727.jpg', category: 'post_production' }
];

export const getSeriesParts = (choice: StudioPillarItem | null): { 
  partA: { id: 'part-a'; name: string; description?: string; posterUrl?: string; number: string }; 
  partB: { id: 'part-b'; name: string; description?: string; posterUrl?: string; number: string };
} => {
  if (!choice) {
    return {
      partA: { id: 'part-a', name: 'Partie 1', description: 'Premier volet de la série', number: 'Partie 1' },
      partB: { id: 'part-b', name: 'Partie 2', description: 'Deuxième volet de la série', number: 'Partie 2' }
    };
  }

  // 1. Chercher d'abord dans le registre officiel des 8 séries (gère aussi <seriesId>__epN et anciens IDs)
  const lookupId = choice.seriesId || choice.id;
  const registrySeries = resolveSeriesById(lookupId);
  if (registrySeries) {
    return {
      partA: {
        id: 'part-a',
        name: registrySeries.partA.name,
        description: registrySeries.partA.description,
        posterUrl: registrySeries.partA.posterUrl,
        number: 'Partie 1'
      },
      partB: {
        id: 'part-b',
        name: registrySeries.partB.name,
        description: registrySeries.partB.description,
        posterUrl: registrySeries.partB.posterUrl,
        number: 'Partie 2'
      }
    };
  }

  // 1b. Utiliser les informations portées directement par l'élément si disponibles
  if (choice.partAName && choice.partBName) {
    return {
      partA: {
        id: 'part-a',
        name: choice.partAName,
        description: choice.partADescription || 'Premier volet de la série',
        posterUrl: choice.partAPosterUrl,
        number: 'Partie 1'
      },
      partB: {
        id: 'part-b',
        name: choice.partBName,
        description: choice.partBDescription || 'Deuxième volet de la série',
        posterUrl: choice.partBPosterUrl,
        number: 'Partie 2'
      }
    };
  }

  // 2. Chercher dans les documentaires officiels
  const canonicalLookupId = resolveCanonicalSeriesId(lookupId) || lookupId;
  const doc = DOCUMENTARIES.find((d) => d.id === canonicalLookupId || d.slug === canonicalLookupId);
  if (doc && doc.universes && doc.universes.length >= 2) {
    return {
      partA: {
        id: 'part-a',
        name: doc.universes[0].name,
        description: doc.universes[0].tagline || doc.universes[0].description,
        number: 'Partie 1'
      },
      partB: {
        id: 'part-b',
        name: doc.universes[1].name,
        description: doc.universes[1].tagline || doc.universes[1].description,
        number: 'Partie 2'
      }
    };
  }

  // 2. Découpage du titre s'il contient un séparateur de diptyque (‹ › ou < >)
  const title = choice.title;
  if (title.includes('‹ ›') || title.includes('< >')) {
    const rawParts = title.split(/‹ ›|< >/).map((s) => s.trim()).filter(Boolean);
    if (rawParts.length >= 2) {
      return {
        partA: {
          id: 'part-a',
          name: rawParts[0],
          description: 'Premier univers du diptyque',
          number: 'Partie 1'
        },
        partB: {
          id: 'part-b',
          name: rawParts[1],
          description: 'Deuxième univers en miroir',
          number: 'Partie 2'
        }
      };
    }
  }

  return {
    partA: {
      id: 'part-a',
      name: `${title} (Volet 1)`,
      description: 'Volet initial de la thématique',
      number: 'Partie 1'
    },
    partB: {
      id: 'part-b',
      name: `${title} (Volet 2)`,
      description: 'Volet miroir et dialogue',
      number: 'Partie 2'
    }
  };
};

export const getCardDurationLabel = (item: StudioPillar | StudioPillarItem | null, pillar?: StudioPillar | null): string => {
  if (!item) return '2 minutes 56 maximum';
  const id = item.id.toLowerCase();
  const pillarId = pillar?.id?.toLowerCase();

  if (id === 'focus' || pillarId === 'focus' || id.startsWith('topic-')) {
    return '2 minutes 56 maximum';
  }
  if (id === 'teaser' || id === 'teaser-libre' || pillarId === 'teaser') {
    return '16 secondes maximum';
  }
  if (id === 'duos' || pillarId === 'duos') {
    return '2 minutes 56 maximum';
  }
  if (id === 'soi' || pillarId === 'soi' || id.startsWith('soi-')) {
    return '2 minutes 56 maximum';
  }
  if (
    id === 'itinerant' || 
    pillarId === 'itinerant' || 
    id.startsWith('cat-') || 
    id.startsWith('sagesses-') || 
    id.startsWith('territoires-') || 
    id.startsWith('expertises-') || 
    id.startsWith('personnalites-') || 
    id.startsWith('epreuves-') || 
    id.startsWith('ps-') || 
    id.startsWith('projets-') || 
    id.startsWith('liens-')
  ) {
    return '32 secondes maximum';
  }
  if (id === 'organisations' || pillarId === 'organisations' || id.startsWith('lum-')) {
    return '8 secondes maximum';
  }

  const badge = ((item as any).durationBadge || '').toLowerCase();
  if (badge.includes('16')) return '16 secondes maximum';
  if (badge.includes('32')) return '32 secondes maximum';
  if (badge.includes('8')) return '8 secondes maximum';
  if (badge.includes('2 min') || badge.includes('2:56') || badge.includes('2 minutes')) return '2 minutes 56 maximum';

  return '2 minutes 56 maximum';
};

interface CollaboratorMentionInputProps {
  label: string;
  sublabel: string;
  category: 'realisation' | 'protagoniste' | 'post_production';
  tagged: TaggedCollaborator[];
  onAdd: (collaborator: TaggedCollaborator) => void;
  onRemove: (id: string) => void;
  placeholder: string;
}

const CollaboratorMentionInput: React.FC<CollaboratorMentionInputProps> = ({
  label,
  sublabel,
  category,
  tagged,
  onAdd,
  onRemove,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const query = inputValue.replace(/^@/, '').toLowerCase().trim();

  const suggestions = PLATFORM_MEMBERS.filter((member) => {
    if (tagged.some((t) => t.id === member.id)) return false;
    if (!query) {
      return member.category === category || member.category === 'tous';
    }
    return (
      member.name.toLowerCase().includes(query) ||
      member.handle.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
    );
  }).slice(0, 5);

  const handleSelect = (member: PlatformMember) => {
    onAdd({
      id: member.id,
      name: member.name,
      handle: member.handle,
      role: member.role,
      avatarUrl: member.avatarUrl,
    });
    setInputValue('');
    setWarningMessage(null);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      } else if (inputValue.trim()) {
        setWarningMessage('Seules les personnes inscrites sur la plateforme peuvent être identifiées avec le @.');
        setTimeout(() => setWarningMessage(null), 3500);
      }
    }
  };

  return (
    <div ref={containerRef} className="space-y-1.5 relative">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-stone-800">
          {label}
        </label>
        <span className="text-[11px] text-stone-400 font-normal">
          {sublabel}
        </span>
      </div>

      {tagged.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1">
          {tagged.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-800 shadow-xs"
            >
              {item.avatarUrl ? (
                <img
                  src={item.avatarUrl}
                  alt={item.name}
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="w-4 h-4 rounded-full bg-[#A2482B]/15 text-[#A2482B] flex items-center justify-center text-[9px] font-bold shrink-0">
                  {item.name.charAt(0)}
                </span>
              )}
              <span className="font-semibold text-[#A2482B]">{item.handle}</span>
              <span className="text-stone-600 text-[11px] truncate max-w-[110px]">
                {item.name}
              </span>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="w-3.5 h-3.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 flex items-center justify-center transition-colors cursor-pointer ml-0.5"
                title="Retirer"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
          <AtSign className="w-4 h-4 text-stone-400" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (warningMessage) setWarningMessage(null);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1.5 focus:ring-[#A2482B] focus:border-[#A2482B] transition-all shadow-xs"
        />
      </div>

      {warningMessage && (
        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-lg">
          ⚠️ {warningMessage}
        </p>
      )}

      {isFocused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-xl shadow-xl border border-stone-200 py-1 max-h-52 overflow-y-auto">
          <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-100">
            Membres inscrits sur la plateforme
          </div>
          {suggestions.map((member) => (
            <button
              key={member.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(member);
              }}
              className="w-full px-2.5 py-1.5 text-left flex items-center gap-2.5 hover:bg-stone-50 cursor-pointer transition-colors"
            >
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="w-6 h-6 rounded-full bg-[#A2482B]/15 text-[#A2482B] flex items-center justify-center text-xs font-bold shrink-0">
                  {member.name.charAt(0)}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-stone-900 truncate">
                    {member.name}
                  </span>
                  <span className="text-[11px] font-medium text-[#A2482B]">
                    {member.handle}
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 truncate">
                  {member.role}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface SubmitStoryScreenProps {
  preselectedDocumentaryId?: string;
  initialPillarId?: string;
  initialCastingCategoryId?: string;
  initialFinalChoiceId?: string;
  initialPartId?: 'part-a' | 'part-b';
  onNavigate: (screen: ViewScreen) => void;
}

export const SubmitStoryScreen: React.FC<SubmitStoryScreenProps> = ({
  preselectedDocumentaryId,
  initialPillarId,
  initialCastingCategoryId,
  initialFinalChoiceId,
  initialPartId,
  onNavigate
}) => {
  const { currentUser } = useAuth();

  // 1. Niveau 0 : 5 Portes (Dialogue, Portrait, Rush, Insert, Teaser) — court-circuité vers Dialogue si !SHOW_FOCUS
  const [selectedPillarIndex, setSelectedPillarIndex] = useState(0);
  const [activePillar, setActivePillar] = useState<StudioPillar | null>(() =>
    SHOW_FOCUS ? null : DEFAULT_DIALOGUE_PILLAR
  );

  // 2. Niveau 1 : Catégories au sein de la porte
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  // 2b. Niveau intermédiaire (séries Duocumentaires) : choix du côté (A ou B) avant les questions
  const [activeCastingCategory, setActiveCastingCategory] = useState<StudioPillarItem | null>(null);
  const [selectedSeriesSide, setSelectedSeriesSide] = useState<'part-a' | 'part-b' | null>(null);
  const [selectedSideIndex, setSelectedSideIndex] = useState(0);

  // 3. Niveau 2 : les 4 questions de la série (ou sous-catégories Casting)
  const [selectedSubThemeIndex, setSelectedSubThemeIndex] = useState(0);

  // 4. Choix final sélectionné -> déclenche l'affichage du Duo de vidéos
  const [selectedFinalChoice, setSelectedFinalChoice] = useState<StudioPillarItem | null>(null);

  // 5. Média vidéo ou audio en arrière-plan
  const [playingCardId, setPlayingCardId] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState(true);

  // 6. Modale Synopsis (Papyrus) - largeur ajustée à la carte vidéo
  const [synopsisModalItem, setSynopsisModalItem] = useState<StudioPillar | StudioPillarItem | null>(null);

  // 7. Écran direct sur la plateforme : Télécharger sa vidéo (NON MODAL)
  const [isUploadScreenActive, setIsUploadScreenActive] = useState(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedPartId, setSelectedPartId] = useState<'part-a' | 'part-b'>('part-a');
  const [creditsRealisation, setCreditsRealisation] = useState<TaggedCollaborator[]>([]);
  const [creditsProtagonistes, setCreditsProtagonistes] = useState<TaggedCollaborator[]>([]);
  const [creditsPostProd, setCreditsPostProd] = useState<TaggedCollaborator[]>([]);
  const [duoPreviewVideo, setDuoPreviewVideo] = useState<'upload' | 'expert' | null>(null);

  // 8. Toast d'information
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 9. Gestures tactiles rapides et fluides (Carrousel Niveau 1/2)
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const didDragRef = useRef<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);

  // 9b. Gestures horizontaux simples à 2 positions pour Niveau 0 (Focus <-> Dialogue)
  const level0TouchStartXRef = useRef<number>(0);
  const level0TouchStartYRef = useRef<number>(0);
  const level0TouchStartTimeRef = useRef<number>(0);
  const level0IsDraggingRef = useRef<boolean>(false);
  const level0DidDragRef = useRef<boolean>(false);
  const [isLevel0Dragging, setIsLevel0Dragging] = useState<boolean>(false);
  const [level0DragOffset, setLevel0DragOffset] = useState<number>(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const closeSynopsisModal = useCallback(() => {
    setSynopsisModalItem(null);
  }, []);

  useEffect(() => {
    return () => {
      episodeVoiceReader.stop();
    };
  }, []);

  useEffect(() => {
    if (!playingCardId) return;
    if (!activePillar || activePillar.id !== 'duos' || selectedFinalChoice || isUploadScreenActive) {
      episodeVoiceReader.stop();
      setIsAudioLoading(false);
    }
  }, [playingCardId, activePillar, selectedFinalChoice, isUploadScreenActive]);

  // Pré-sélection éventuelle venant d'une série documentaire externe
  useEffect(() => {
    if (preselectedDocumentaryId) {
      const duoPillar = VISIBLE_STUDIO_PILLARS.find(p => p.id === 'duos');
      if (duoPillar) {
        setActivePillar(duoPillar);
        setActiveCastingCategory(null);
        setSelectedSeriesSide(null);
        setSelectedSideIndex(0);
        setSelectedFinalChoice(null);
        const canonicalId = resolveCanonicalSeriesId(preselectedDocumentaryId) || preselectedDocumentaryId;
        const matchIdx = duoPillar.items.findIndex(
          it => it.id === canonicalId || it.seriesId === canonicalId
        );
        if (matchIdx >= 0) setSelectedCategoryIndex(matchIdx);
      }
    }
  }, [preselectedDocumentaryId]);

  // Restauration de l'état précédent après un retour depuis la sélection des vidéastes
  useEffect(() => {
    if (initialFinalChoiceId) {
      let foundPillar = VISIBLE_STUDIO_PILLARS.find(p => p.id === initialPillarId);
      let foundCastingCat: StudioPillarItem | undefined;
      let foundItem: StudioPillarItem | undefined;

      for (const pillar of VISIBLE_STUDIO_PILLARS) {
        for (const item of pillar.items) {
          if (item.id === initialFinalChoiceId) {
            foundItem = item;
            if (!foundPillar) foundPillar = pillar;
            break;
          }
          if (item.subCategories) {
            for (const sub of item.subCategories) {
              if (sub.id === initialFinalChoiceId) {
                foundItem = sub;
                foundCastingCat = item;
                if (!foundPillar) foundPillar = pillar;
                break;
              }
            }
          }
        }
        if (foundItem) break;
      }

      if (foundPillar) setActivePillar(foundPillar);
      if (foundCastingCat) setActiveCastingCategory(foundCastingCat);
      if (foundItem) setSelectedFinalChoice(foundItem);
      if (initialPartId) {
        setSelectedSeriesSide(initialPartId);
        setSelectedPartId(initialPartId);
      } else if (foundPillar?.id === 'duos' && foundCastingCat) {
        setSelectedSeriesSide('part-a');
      }
    }
  }, [initialFinalChoiceId, initialPillarId, initialCastingCategoryId, initialPartId]);

  // Détermination du niveau hiérarchique actif
  const activeRegistrySeries =
    activePillar?.id === 'duos' && activeCastingCategory
      ? resolveSeriesById(activeCastingCategory.seriesId || activeCastingCategory.id)
      : undefined;
  const isLevel0 = !activePillar && !selectedFinalChoice;
  const isLevel1 = activePillar !== null && !activeCastingCategory && !selectedFinalChoice;
  const isSideSelectionLevel = Boolean(
    activeRegistrySeries &&
    activeCastingCategory &&
    !selectedSeriesSide &&
    !selectedFinalChoice
  );
  const isLevel2 =
    (activePillar?.id === 'duos' || activePillar?.id === 'itinerant') &&
    activeCastingCategory !== null &&
    !isSideSelectionLevel &&
    !selectedFinalChoice;
  const isTwoChoiceLevel0 = isLevel0 && VISIBLE_STUDIO_PILLARS.length === 2;

  const chosenSeriesSide: SeriesSide | null =
    activeRegistrySeries && selectedSeriesSide
      ? selectedSeriesSide === 'part-a'
        ? activeRegistrySeries.partA
        : activeRegistrySeries.partB
      : null;

  const sideSelectionItems: StudioPillarItem[] = useMemo(() => {
    if (!activeRegistrySeries || !activeCastingCategory) return [];
    return [activeRegistrySeries.partA, activeRegistrySeries.partB].map((side) => ({
      id: side.id,
      seriesId: activeRegistrySeries.id,
      title: side.name,
      subtitle: side.description,
      posterUrl: side.posterUrl,
      videoUrl: activeCastingCategory.videoUrl,
    }));
  }, [activeRegistrySeries, activeCastingCategory]);

  // Liste et index actifs selon le niveau
  const currentList: (StudioPillar | StudioPillarItem)[] = isSideSelectionLevel
    ? sideSelectionItems
    : isLevel2
      ? (activeCastingCategory?.subCategories || [])
      : isLevel1
        ? activePillar.items
        : VISIBLE_STUDIO_PILLARS;

  const currentIndex = isSideSelectionLevel
    ? selectedSideIndex
    : isLevel2
      ? selectedSubThemeIndex
      : isLevel1
        ? selectedCategoryIndex
        : selectedPillarIndex;

  const setCurrentIndex = isSideSelectionLevel
    ? setSelectedSideIndex
    : isLevel2
      ? setSelectedSubThemeIndex
      : isLevel1
        ? setSelectedCategoryIndex
        : setSelectedPillarIndex;

  // Préchargement léger (250 ms) sur la carte audio active centrée (série, côté ou épisode)
  useEffect(() => {
    if (selectedFinalChoice || isUploadScreenActive || activePillar?.id !== 'duos') return;
    const activeItem = currentList[currentIndex] as StudioPillarItem | undefined;
    if (!activeItem) return;

    const timer = window.setTimeout(() => {
      if ((isLevel1 || isSideSelectionLevel) && activeItem.subtitle) {
        episodeVoiceReader.preload(
          {
            mode: 'synopsis',
            synopsis: activeItem.subtitle,
          },
          { cacheOnly: true }
        );
      } else if (isLevel2 && activeItem.question) {
        episodeVoiceReader.preload(
          {
            mode: 'episode',
            episodeLabel: activeItem.badge,
            episodeTitle: activeItem.episodeTitle,
            question: activeItem.question,
          },
          { cacheOnly: true }
        );
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [
    activePillar?.id,
    selectedFinalChoice,
    isUploadScreenActive,
    isLevel1,
    isSideSelectionLevel,
    isLevel2,
    currentList,
    currentIndex,
  ]);

  // Actions de navigation hiérarchique
  const handleSelectPillar = (pillar: StudioPillar) => {
    episodeVoiceReader.stop();
    setIsAudioLoading(false);
    setActivePillar(pillar);
    setSelectedCategoryIndex(0);
    setActiveCastingCategory(null);
    setSelectedSeriesSide(null);
    setSelectedSideIndex(0);
    setSelectedSubThemeIndex(0);
    setSelectedFinalChoice(null);
    setPlayingCardId(null);
    celestialAudio?.playOrbSelect?.();
  };

  const handleSelectCastingCategory = (categoryItem: StudioPillarItem) => {
    episodeVoiceReader.stop();
    setIsAudioLoading(false);
    if (categoryItem.subCategories && categoryItem.subCategories.length > 0) {
      setActiveCastingCategory(categoryItem);
      setSelectedSeriesSide(null);
      setSelectedSideIndex(0);
      setSelectedSubThemeIndex(0);
      setSelectedFinalChoice(null);
      setPlayingCardId(null);
      celestialAudio?.playOrbSelect?.();
    } else {
      handleSelectFinalChoice(categoryItem);
    }
  };

  const handleSelectSeriesSide = (sideId: 'part-a' | 'part-b') => {
    episodeVoiceReader.stop();
    setIsAudioLoading(false);
    setPlayingCardId(null);
    setSelectedSeriesSide(sideId);
    setSelectedPartId(sideId);
    setSelectedSubThemeIndex(0);
    celestialAudio?.playOrbSelect?.();
  };

  const handleSelectFinalChoice = (item: StudioPillarItem) => {
    episodeVoiceReader.stop();
    setIsAudioLoading(false);
    setSelectedFinalChoice(item);
    setPlayingCardId(null);
    setDuoPreviewVideo(null);
    celestialAudio?.playOrbSelect?.();
  };

  // Navigation directe entre les 5 propositions via les vignettes en haut
  const handleSelectPillarThumbnail = (pillar: StudioPillar, idx: number) => {
    setPlayingCardId(null);
    setDuoPreviewVideo(null);
    if (isLevel0 && !isUploadScreenActive) {
      setSelectedPillarIndex(idx);
    } else {
      setIsUploadScreenActive(false);
      setSelectedPillarIndex(idx);
      setActivePillar(pillar);
      setSelectedCategoryIndex(0);
      setActiveCastingCategory(null);
      setSelectedSubThemeIndex(0);
      setSelectedFinalChoice(null);
    }
    celestialAudio?.playOrbSelect?.();
  };

  const renderStudioPillarsHeader = () => (
    <div
      className="w-full shrink-0 z-30 border-none shadow-none rounded-none bg-black"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="w-full mx-auto px-2 pt-1.5 pb-2 shrink-0 h-[68px] sm:h-[76px] flex items-center justify-center overflow-hidden">
        <div
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'auto' }}
          className="flex items-center justify-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1 px-2 w-full max-w-full overscroll-x-contain touch-pan-x"
        >
          {VISIBLE_STUDIO_PILLARS.map((pillar, idx) => {
            const isSelected = activePillar
              ? activePillar.id === pillar.id
              : selectedPillarIndex === idx;

            return (
              <div
                key={`studio-pillar-thumb-${pillar.id}`}
                onClick={() => handleSelectPillarThumbnail(pillar, idx)}
                className="flex flex-col items-center cursor-pointer group shrink-0"
                title={pillar.title}
              >
                <div
                  className={`w-[52px] h-[52px] sm:w-14 sm:h-14 rounded-2xl p-0.5 border transition-all group-hover:scale-105 bg-stone-900 ${
                    isSelected
                      ? 'border-[#A2482B] ring-1 ring-[#A2482B]'
                      : 'border-stone-800/80 group-hover:border-[#A2482B]'
                  }`}
                  style={{ boxShadow: 'var(--story-ring-shadow, 0 1px 8px rgba(0, 0, 0, 0.6))' }}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden bg-stone-900 relative">
                    <img
                      src={pillar.posterUrl}
                      alt={pillar.title}
                      className="w-full h-full object-cover pointer-events-none"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Navigation dans le Carrousel 3D
  const goToNext = useCallback(() => {
    episodeVoiceReader.stop();
    setIsAudioLoading(false);
    setPlayingCardId(null);
    setCurrentIndex((prev) => (prev + 1) % currentList.length);
    celestialAudio?.playOrbSelect?.();
  }, [currentList.length, setCurrentIndex]);

  const goToPrev = useCallback(() => {
    episodeVoiceReader.stop();
    setIsAudioLoading(false);
    setPlayingCardId(null);
    setCurrentIndex((prev) => (prev - 1 + currentList.length) % currentList.length);
    celestialAudio?.playOrbSelect?.();
  }, [currentList.length, setCurrentIndex]);

  // Navigation clavier flèches gauche / droite / Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (synopsisModalItem) {
        if (e.key === 'Escape') {
          closeSynopsisModal();
        }
        return;
      }

      if (isUploadScreenActive) {
        if (e.key === 'Escape') {
          setIsUploadScreenActive(false);
        }
        return;
      }

      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'Escape') {
        if (selectedFinalChoice) {
          setSelectedFinalChoice(null);
          setDuoPreviewVideo(null);
        } else if (isLevel2 && activeRegistrySeries && selectedSeriesSide) {
          episodeVoiceReader.stop();
          setIsAudioLoading(false);
          setSelectedSeriesSide(null);
          setPlayingCardId(null);
        } else if (activeCastingCategory) {
          episodeVoiceReader.stop();
          setIsAudioLoading(false);
          setActiveCastingCategory(null);
          setSelectedSeriesSide(null);
          setPlayingCardId(null);
        } else if (SHOW_FOCUS && activePillar) {
          setActivePillar(null);
          setPlayingCardId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, activePillar, activeCastingCategory, activeRegistrySeries, selectedSeriesSide, isLevel2, selectedFinalChoice, synopsisModalItem, isUploadScreenActive, closeSynopsisModal]);

  // Gestion des événements tactiles
  const onTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, input, a, [role="button"]')) return;
    didDragRef.current = false;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = Date.now();
    isDraggingRef.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.touches[0].clientX - touchStartXRef.current;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 6) {
      didDragRef.current = true;
      setDragOffset(Math.max(-75, Math.min(75, deltaX * 0.45)));
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartXRef.current;
    const elapsed = Date.now() - touchStartTimeRef.current;
    const velocity = Math.abs(deltaX) / Math.max(1, elapsed);

    if (Math.abs(deltaX) > 24 || velocity > 0.28) {
      didDragRef.current = true;
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    setDragOffset(0);
    setTimeout(() => {
      didDragRef.current = false;
    }, 60);
  };

  // Gestion souris (drag desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, a, [role="button"]')) return;
    didDragRef.current = false;
    touchStartXRef.current = e.clientX;
    touchStartYRef.current = e.clientY;
    touchStartTimeRef.current = Date.now();
    isDraggingRef.current = true;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 6) {
      didDragRef.current = true;
      setDragOffset(Math.max(-75, Math.min(75, deltaX * 0.45)));
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const deltaX = e.clientX - touchStartXRef.current;
    const elapsed = Date.now() - touchStartTimeRef.current;
    const velocity = Math.abs(deltaX) / Math.max(1, elapsed);

    if (Math.abs(deltaX) > 24 || velocity > 0.28) {
      didDragRef.current = true;
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    setDragOffset(0);
    setTimeout(() => {
      didDragRef.current = false;
    }, 60);
  };

  // Gestion swipe horizontal simple à 2 positions pour le Niveau 0 (Focus <-> Dialogue, en boucle)
  const applyLevel0Drag = (deltaX: number) => {
    setLevel0DragOffset(Math.max(-240, Math.min(240, deltaX)));
  };

  const finishLevel0Drag = (deltaX: number, deltaY: number) => {
    const elapsed = Date.now() - level0TouchStartTimeRef.current;
    const velocity = Math.abs(deltaX) / Math.max(1, elapsed);
    const isHorizontalGesture = Math.abs(deltaX) > Math.abs(deltaY);

    if (isHorizontalGesture && (Math.abs(deltaX) > 36 || (velocity > 0.28 && Math.abs(deltaX) > 12))) {
      level0DidDragRef.current = true;
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    level0IsDraggingRef.current = false;
    setIsLevel0Dragging(false);
    setLevel0DragOffset(0);
    setTimeout(() => {
      level0DidDragRef.current = false;
    }, 50);
  };

  const onLevel0TouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    level0TouchStartXRef.current = e.touches[0].clientX;
    level0TouchStartYRef.current = e.touches[0].clientY;
    level0TouchStartTimeRef.current = Date.now();
    level0IsDraggingRef.current = true;
    level0DidDragRef.current = false;
    setIsLevel0Dragging(true);
  };

  const onLevel0TouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!level0IsDraggingRef.current) return;
    const deltaX = e.touches[0].clientX - level0TouchStartXRef.current;
    const deltaY = e.touches[0].clientY - level0TouchStartYRef.current;
    if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
      level0DidDragRef.current = true;
      applyLevel0Drag(deltaX);
    }
  };

  const onLevel0TouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!level0IsDraggingRef.current) return;
    const deltaX = e.changedTouches[0].clientX - level0TouchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - level0TouchStartYRef.current;
    finishLevel0Drag(deltaX, deltaY);
  };

  const onLevel0MouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    level0TouchStartXRef.current = e.clientX;
    level0TouchStartYRef.current = e.clientY;
    level0TouchStartTimeRef.current = Date.now();
    level0IsDraggingRef.current = true;
    level0DidDragRef.current = false;
    setIsLevel0Dragging(true);
  };

  const onLevel0MouseMove = (e: React.MouseEvent) => {
    if (!level0IsDraggingRef.current) return;
    const deltaX = e.clientX - level0TouchStartXRef.current;
    if (Math.abs(deltaX) > 8) {
      level0DidDragRef.current = true;
      applyLevel0Drag(deltaX);
    }
  };

  const onLevel0MouseUp = (e: React.MouseEvent) => {
    if (!level0IsDraggingRef.current) return;
    const deltaX = e.clientX - level0TouchStartXRef.current;
    const deltaY = e.clientY - level0TouchStartYRef.current;
    finishLevel0Drag(deltaX, deltaY);
  };

  const onLevel0MouseLeave = (e: React.MouseEvent) => {
    if (!level0IsDraggingRef.current) return;
    const deltaX = e.clientX - level0TouchStartXRef.current;
    const deltaY = e.clientY - level0TouchStartYRef.current;
    finishLevel0Drag(deltaX, deltaY);
  };

  const handleSubmitVideo = () => {
    if (!selectedFileName) {
      showToast('Veuillez sélectionner un fichier vidéo avant d’envoyer.');
      return;
    }
    const isMirrorTheme = activePillar?.id === 'duos' || (!activePillar && Boolean(selectedFinalChoice?.title.includes('‹ ›') || selectedFinalChoice?.title.includes('< >')));
    if (isMirrorTheme && !selectedPartId) {
      showToast('Veuillez choisir la partie de la série.');
      return;
    }

    const titleClean = selectedFileName.replace(/\.[^/.]+$/, "") || selectedFinalChoice?.title || 'Récit YonyWood';
    const authorName = currentUser?.name || 'Créateur YonyWood';
    const authorAvatar = currentUser?.avatarUrl || '/assets/images/romeo_avatar_1792698425983.jpg';

    const resolvedProfileTab = resolveSubmissionProfileTab({
      universe: selectedFinalChoice?.id || activePillar?.id || 'studio'
    });

    // Enregistrement dans le service des vidéos utilisateur avec contrôle de limite par onglet Profil
    const saveResult = trySaveUserVideoSubmission({
      userId: currentUser?.id || 'usr-guest',
      userType: currentUser?.accountType || 'INDIVIDUAL',
      authorName,
      authorAvatarUrl: authorAvatar,
      title: titleClean,
      synopsis: `Soumission pour ${selectedFinalChoice?.title || 'le Studio'} (${selectedPartId === 'part-a' ? 'Volet 1' : 'Volet 2'}). En attente de validation éditoriale.`,
      universe: activePillar?.id || 'studio',
      ...(resolvedProfileTab ? { profileTab: resolvedProfileTab } : {}),
      videoUrl: '/sample.mp4',
      thumbnailUrl: selectedFinalChoice?.posterUrl || '/assets/images/selfie_video_story.jpg',
      partId: selectedPartId,
      credits: {
        realisation: creditsRealisation.map(c => c.name),
        protagonistes: creditsProtagonistes.map(c => c.name),
        postProduction: creditsPostProd.map(c => c.name)
      }
    });

    if ('error' in saveResult) {
      showToast(saveResult.error);
      return;
    }

    // Remise à zéro et notification
    setSelectedFileName(null);
    setCreditsRealisation([]);
    setCreditsProtagonistes([]);
    setCreditsPostProd([]);
    setIsUploadScreenActive(false);
    setUploadSuccessToast(true);
    setTimeout(() => {
      setUploadSuccessToast(false);
    }, 4500);
  };

  // =========================================================================
  // ÉCRAN DIRECT SUR LA PLATEFORME : TÉLÉCHARGER SA VIDÉO (AUCUNE MODALE)
  // =========================================================================
  if (isUploadScreenActive && selectedFinalChoice) {
    const isMirrorTheme = activePillar?.id === 'duos' || (!activePillar && Boolean(selectedFinalChoice.title.includes('‹ ›') || selectedFinalChoice.title.includes('< >')));
    const parts = isMirrorTheme ? getSeriesParts(selectedFinalChoice) : null;

    return (
      <div className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between text-[#1C1917] select-none bg-white">
        {/* EN-TÊTE STUDIO : FOND NOIR AVEC 5 VIGNETTES CENTRÉES SOUS LE LOGO (masqué) */}
        {SHOW_TOP_STORIES_BANNER && renderStudioPillarsHeader()}

        <div className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-6 pt-2 pb-24 sm:pb-28 min-h-0 overflow-hidden flex flex-col justify-between">
          {/* EN-TÊTE HARMONISÉ AVEC RETOUR VERS LE DUO DE CHOIX */}
          <div className="relative flex items-center justify-between h-9 sm:h-11 shrink-0 gap-2 mb-1.5 sm:mb-2">
          <div className="flex items-center gap-1.5 sm:gap-2 h-full min-w-0">
            <button
              onClick={() => setIsUploadScreenActive(false)}
              className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 group py-1 shrink-0"
              title="Revenir au choix précédent"
            >
              <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs sm:text-sm font-medium">Retour</span>
            </button>

            {/* Titre intermédiaire : affiché sur grand écran uniquement pour éviter toute troncature sur mobile */}
            <span className="text-stone-300 font-light text-xs hidden sm:inline" aria-hidden="true">›</span>

            <span className="text-xs sm:text-sm text-stone-500 hidden sm:inline whitespace-nowrap" title={selectedFinalChoice.title}>
              {selectedFinalChoice.title}
            </span>

            <span className="text-stone-300 font-light text-xs" aria-hidden="true">›</span>

            <div className="relative flex items-center h-full overflow-visible">
              <span className="font-editorial text-xs sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-none whitespace-nowrap pr-2 select-none">
                Télécharger sa vidéo
              </span>
              <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
            </div>
          </div>
        </div>

        {/* CORPS DU FORMULAIRE : DIRECTEMENT SUR LA PLATEFORME (NON MODAL) */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2 py-1 sm:py-2 flex flex-col">
          <div className="space-y-3 sm:space-y-3.5">
            {/* 1A. CHOIX / RAPPEL DE LA PARTIE DE LA SÉRIE (UNIQUEMENT LORSQU'ON PASSE PAR LA CASE MIROIR) */}
            {isMirrorTheme && parts && (
              <div className="space-y-2">
                {(() => {
                  const activeSide = selectedPartId === 'part-a' ? parts.partA : parts.partB;
                  return (
                    <div className="flex items-center justify-between gap-2 rounded-2xl border border-[#A2482B]/25 bg-[#A2482B]/5 px-3 py-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {activeSide.posterUrl && (
                          <img
                            src={activeSide.posterUrl}
                            alt={activeSide.name}
                            className="w-7 h-10 rounded-lg object-cover border border-stone-200 shrink-0 shadow-2xs"
                          />
                        )}
                        <div className="min-w-0">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block">
                            Côté choisi
                          </span>
                          <span className="font-editorial text-xs sm:text-sm font-semibold text-stone-900 leading-tight block">
                            {activeSide.name}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-[#A2482B] shrink-0">
                        {selectedFinalChoice.title}
                      </span>
                    </div>
                  );
                })()}

                <p className="text-xs sm:text-sm font-semibold text-stone-700">
                  À quelle partie de la série se rattache votre vidéo ?
                </p>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                  {/* Bouton Partie A */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPartId('part-a');
                      setSelectedSeriesSide('part-a');
                    }}
                    className={`px-3 sm:px-4 py-3 sm:py-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 text-left shadow-xs hover:shadow-sm ${
                      selectedPartId === 'part-a'
                        ? 'bg-[#A2482B]/10 border-[#A2482B] text-stone-900 ring-1 ring-[#A2482B]'
                        : 'bg-white border-stone-200 hover:border-stone-300 text-stone-800'
                    }`}
                  >
                    <span className="font-editorial text-xs sm:text-sm font-semibold leading-tight">
                      {parts.partA.name}
                    </span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      selectedPartId === 'part-a' ? 'border-[#A2482B] bg-[#A2482B] text-white' : 'border-stone-300 bg-white'
                    }`}>
                      {selectedPartId === 'part-a' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>

                  {/* Bouton Partie B */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPartId('part-b');
                      setSelectedSeriesSide('part-b');
                    }}
                    className={`px-3 sm:px-4 py-3 sm:py-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 text-left shadow-xs hover:shadow-sm ${
                      selectedPartId === 'part-b'
                        ? 'bg-[#A2482B]/10 border-[#A2482B] text-stone-900 ring-1 ring-[#A2482B]'
                        : 'bg-white border-stone-200 hover:border-stone-300 text-stone-800'
                    }`}
                  >
                    <span className="font-editorial text-xs sm:text-sm font-semibold leading-tight">
                      {parts.partB.name}
                    </span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      selectedPartId === 'part-b' ? 'border-[#A2482B] bg-[#A2482B] text-white' : 'border-stone-300 bg-white'
                    }`}>
                      {selectedPartId === 'part-b' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* 1B. RAPPEL DE LA DIRECTION POUR LES THÉMATIQUES HORS MIROIR (CASTING, LUMIÈRE, PORTRAIT) */}
            {!isMirrorTheme && (
              <div className="rounded-2xl border border-stone-200/90 bg-stone-50/70 p-3 sm:p-3.5 shadow-xs">
                <div className="mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Rappel de la direction
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {/* Direction principale (ex: Casting, Lumière, Portrait) */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-[13px] font-semibold text-stone-800 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A2482B]" />
                    {activePillar?.title || 'Studio'}
                  </span>

                  {/* Catégorie intermédiaire (ex: Sagesses) si applicable */}
                  {activeCastingCategory && (
                    <>
                      <span className="text-stone-300 font-light text-xs" aria-hidden="true">›</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-[13px] font-semibold text-stone-800 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                        {activeCastingCategory.title}
                      </span>
                    </>
                  )}

                  {/* Thématique ou sujet sélectionné (ex: Sens de la vie) */}
                  <span className="text-stone-300 font-light text-xs" aria-hidden="true">›</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A2482B]/10 border border-[#A2482B]/30 text-xs sm:text-[13px] font-semibold text-[#A2482B] shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A2482B]" />
                    {selectedFinalChoice.title}
                  </span>
                </div>
              </div>
            )}

            {/* 2. SÉLECTION DU FICHIER VIDÉO (BARRE HORIZONTALE PLEINE LARGEUR HARMONIEUSE) */}
            <div className="relative border border-dashed border-stone-300 hover:border-[#A2482B] rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 bg-stone-50/70 hover:bg-stone-50 transition-all cursor-pointer group flex items-center justify-between gap-3.5 shadow-xs">
              <input 
                type="file" 
                accept="video/mp4,video/quicktime,video/webm"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFileName(e.target.files[0].name);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-4.5 h-4.5" />
                </div>
                {selectedFileName ? (
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-stone-900 truncate">{selectedFileName}</p>
                    <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Fichier prêt à être envoyé
                    </p>
                  </div>
                ) : (
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-stone-700 font-medium truncate">
                      Glissez votre vidéo ici ou <span className="text-[#A2482B] underline font-semibold">parcourez vos fichiers</span>
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      MP4, MOV (9:16 recommandé jusqu'à 500 Mo)
                    </p>
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold text-[#A2482B] bg-[#A2482B]/10 hover:bg-[#A2482B]/15 px-3.5 py-1.5 rounded-xl shrink-0 transition-colors">
                {selectedFileName ? 'Changer' : 'Sélectionner'}
              </span>
            </div>

            {/* 3. CRÉDITS D'ÉQUIPE ÉPURÉS (RÉALISATION, PROTAGONISTES, POST-PRODUCTION VIA @) */}
            <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2 border-t border-stone-200/80">

              {/* A. Réalisation */}
              <CollaboratorMentionInput
                label="Réalisation"
                sublabel="Cadreur, réalisateur, prise de vue"
                category="realisation"
                tagged={creditsRealisation}
                onAdd={(collab) => setCreditsRealisation((prev) => [...prev, collab])}
                onRemove={(id) => setCreditsRealisation((prev) => prev.filter((c) => c.id !== id))}
                placeholder="Tapez @ pour mentionner cadreur, réalisateur..."
              />

              {/* B. Protagonistes de la vidéo */}
              <CollaboratorMentionInput
                label="Protagonistes de la vidéo"
                sublabel="Témoins, intervenants face caméra"
                category="protagoniste"
                tagged={creditsProtagonistes}
                onAdd={(collab) => setCreditsProtagonistes((prev) => [...prev, collab])}
                onRemove={(id) => setCreditsProtagonistes((prev) => prev.filter((c) => c.id !== id))}
                placeholder="Tapez @ pour mentionner les protagonistes..."
              />

              {/* C. Post-production */}
              <CollaboratorMentionInput
                label="Post-production"
                sublabel="Monteur, mixage son, étalonnage"
                category="post_production"
                tagged={creditsPostProd}
                onAdd={(collab) => setCreditsPostProd((prev) => [...prev, collab])}
                onRemove={(id) => setCreditsPostProd((prev) => prev.filter((c) => c.id !== id))}
                placeholder="Tapez @ pour mentionner monteur, ingénieur son..."
              />
            </div>
          </div>

          {/* 4. ACTIONS EN BAS */}
          <div className="pt-2.5 sm:pt-3 flex items-center justify-between gap-3 border-t border-stone-200/80 mt-3 sm:mt-4 pb-1">
            <button
              type="button"
              onClick={() => setIsUploadScreenActive(false)}
              className="px-4.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={handleSubmitVideo}
              className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs sm:text-sm font-semibold cursor-pointer transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Envoyer ma vidéo</span>
            </button>
          </div>
        </div>

        {/* Toast d'information temporaire */}
        {toastMessage && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#A2482B] text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-xl animate-in fade-in duration-150">
            {toastMessage}
          </div>
        )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between text-[#1C1917] select-none bg-white">
      
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE STUDIO : FOND NOIR AVEC 5 VIGNETTES CENTRÉES (masqué)          */}
      {/* ========================================================================= */}
      {SHOW_TOP_STORIES_BANNER && renderStudioPillarsHeader()}

      {/* 2. ZONE CONTENU ET CARROUSEL 3D */}
      <div className={`flex-1 w-full max-w-3xl mx-auto px-3 sm:px-6 min-h-0 overflow-hidden flex flex-col justify-between ${((!isLevel0 && !(isLevel1 && !SHOW_FOCUS)) || preselectedDocumentaryId) ? 'pt-1 sm:pt-2' : ''}`}>
        
        {/* EN-TÊTE HARMONISÉ AVEC FIL D'ARIANE SELON LE NIVEAU ACTIF (UNIQUEMENT HORS NIVEAU 0 OU SI QUITTER) */}
        {((!isLevel0 && !(isLevel1 && !SHOW_FOCUS)) || preselectedDocumentaryId) && (
          <div className="relative flex items-center justify-between h-8 sm:h-10 shrink-0 gap-2 mb-0.5 sm:mb-1">
            <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 h-full">

          {/* Niveau 1 : Retour › Nom de la Porte (masqué si SHOW_FOCUS = false) */}
          {SHOW_FOCUS && isLevel1 && activePillar && (
            <div className="flex items-center gap-1.5 sm:gap-2 h-full min-w-0">
              <button
                onClick={() => {
                  setActivePillar(null);
                  setActiveCastingCategory(null);
                  setSelectedFinalChoice(null);
                  setPlayingCardId(null);
                }}
                className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 group py-1 shrink-0"
                title="Retour"
              >
                <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-xs sm:text-sm">Retour</span>
              </button>

              <span className="text-stone-300 font-light text-xs" aria-hidden="true">›</span>

              <div className="relative flex items-center h-full overflow-visible">
                <span className="font-editorial text-xs sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-none whitespace-nowrap pr-2 select-none">
                  {activePillar.title}
                </span>
                <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
              </div>
            </div>
          )}

          {/* Niveau intermédiaire : Sélection du côté (A ou B) pour les séries Duocumentaires */}
          {isSideSelectionLevel && activePillar && activeCastingCategory && (
            <div className="flex items-center gap-1.5 sm:gap-2 h-full min-w-0">
              <button
                onClick={() => {
                  episodeVoiceReader.stop();
                  setIsAudioLoading(false);
                  setActiveCastingCategory(null);
                  setSelectedSeriesSide(null);
                  setSelectedFinalChoice(null);
                  setPlayingCardId(null);
                }}
                className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 group py-1 shrink-0"
                title={`Revenir à ${activePillar?.title || 'Duocumentaires'}`}
              >
                <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[11px] sm:text-sm font-medium whitespace-nowrap">{activePillar?.title || 'Duocumentaires'}</span>
              </button>

              <span className="text-stone-300 font-light text-xs shrink-0" aria-hidden="true">›</span>

              <div className="relative flex items-center h-full min-w-0">
                <span className="font-editorial text-[10px] sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-tight sm:whitespace-nowrap pr-1 sm:pr-2 select-none">
                  {activeCastingCategory.title}
                </span>
                <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
              </div>
            </div>
          )}

          {/* Niveau 2 : (Retour ›) Porte/Côté › Série/Catégorie */}
          {isLevel2 && activePillar && activeCastingCategory && (
            <div className="flex items-center gap-1.5 sm:gap-2 h-full min-w-0">
              {SHOW_FOCUS && !activeRegistrySeries && (
                <>
                  <button
                    onClick={() => {
                      setActivePillar(null);
                      setActiveCastingCategory(null);
                      setSelectedSeriesSide(null);
                      setSelectedFinalChoice(null);
                      setPlayingCardId(null);
                    }}
                    className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer items-center gap-1 group py-1 shrink-0 hidden sm:flex"
                    title="Retour"
                  >
                    <span className="text-xs">Retour</span>
                  </button>

                  <span className="text-stone-300 font-light text-xs hidden sm:inline" aria-hidden="true">›</span>
                </>
              )}

              <button
                onClick={() => {
                  episodeVoiceReader.stop();
                  setIsAudioLoading(false);
                  if (activeRegistrySeries) {
                    setSelectedSeriesSide(null);
                  } else {
                    setActiveCastingCategory(null);
                  }
                  setSelectedFinalChoice(null);
                  setPlayingCardId(null);
                }}
                className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 group py-1 shrink-0"
                title={activeRegistrySeries ? 'Revenir au choix du côté' : `Revenir à ${activePillar?.title || 'Rush'}`}
              >
                <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[11px] sm:text-sm font-medium whitespace-nowrap">
                  {activeRegistrySeries ? 'Côtés' : (activePillar?.title || 'Rush')}
                </span>
              </button>

              <span className="text-stone-300 font-light text-xs shrink-0" aria-hidden="true">›</span>

              <div className="relative flex items-center h-full min-w-0">
                <span className="font-editorial text-[10px] sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-tight sm:whitespace-nowrap pr-1 sm:pr-2 select-none">
                  {activeCastingCategory.title}
                </span>
                <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
              </div>
            </div>
          )}

          {/* Niveau Duo de vidéos (Option finale choisie) */}
          {selectedFinalChoice && (
            <div className="flex items-center gap-1.5 sm:gap-2 h-full min-w-0">
              <button
                onClick={() => {
                  setSelectedFinalChoice(null);
                  setDuoPreviewVideo(null);
                }}
                className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 group py-1 shrink-0"
                title="Changer de thématique"
              >
                <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[11px] sm:text-sm font-medium whitespace-nowrap">
                  <span className="hidden sm:inline">Changer de question</span>
                  <span className="sm:hidden">Retour</span>
                </span>
              </button>

              <span className="text-stone-300 font-light text-xs shrink-0" aria-hidden="true">›</span>

              <div className="relative flex items-center h-full min-w-0">
                <span className="font-editorial text-[9.5px] sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-tight sm:whitespace-nowrap pr-1 sm:pr-2 select-none">
                  {selectedFinalChoice.badge ? `${selectedFinalChoice.title} — ${selectedFinalChoice.badge}` : selectedFinalChoice.title}
                </span>
                <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Côté droit épuré : Quitter si préselection externe */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {preselectedDocumentaryId && (
            <button
              onClick={() => onNavigate({ type: 'duo_feed' })}
              className="text-[11px] sm:text-xs text-stone-500 hover:text-stone-900 font-medium underline cursor-pointer shrink-0"
              title="Revenir aux duos"
            >
              Quitter
            </button>
          )}
        </div>
      </div>
      )}

      {/* Bandeau de rappel du côté choisi (visible au choix de question et avant l'envoi / recrutement vidéaste) */}
      {chosenSeriesSide && (isLevel2 || selectedFinalChoice) && (
        <div className="shrink-0 flex items-center justify-center mb-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-2xs max-w-full">
            <img
              src={chosenSeriesSide.posterUrl}
              alt={chosenSeriesSide.name}
              className="w-5 h-7 rounded-md object-cover border border-stone-200 shrink-0"
            />
            <span className="text-[11px] sm:text-xs text-stone-500 shrink-0">
              Côté choisi :
            </span>
            <span className="font-editorial text-[11px] sm:text-xs font-semibold text-[#1C1917] leading-tight">
              {chosenSeriesSide.name}
            </span>
            <button
              type="button"
              onClick={() => {
                episodeVoiceReader.stop();
                setIsAudioLoading(false);
                setPlayingCardId(null);
                setSelectedFinalChoice(null);
                setDuoPreviewVideo(null);
                setSelectedSeriesSide(null);
                setSelectedSideIndex(chosenSeriesSide.id === 'part-b' ? 1 : 0);
              }}
              className="text-[10px] sm:text-[11px] font-medium text-[#A2482B] hover:underline ml-0.5 cursor-pointer shrink-0"
            >
              Changer
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ZONE CENTRALE : DUO DE VIDÉOS CENTRÉ OU CARROUSEL 3D (SÉRIES/CÔTÉS/Q) */}
      {/* ========================================================================= */}
      {selectedFinalChoice ? (
        <div className="relative flex-1 flex flex-col justify-center items-center w-full min-h-0 py-1 sm:py-3 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl flex items-center justify-center h-full max-h-[560px]">
            {/* DUO DE VIDÉOS FACE-À-FACE CENTRÉ (STRICTEMENT CÔTE À CÔTE COMME SUR LE FEED MIROIR) */}
            <div className="flex items-center justify-center gap-2 sm:gap-5 md:gap-8 relative w-full px-1">
              
              {/* CARTE 1 : TÉLÉCHARGER SA VIDÉO */}
              <div 
                className="relative aspect-[9/16] w-[min(calc((100vw-28px)/2),calc((100dvh-230px)*9/16))] max-w-[185px] max-h-[min(480px,calc(100dvh-230px))] sm:max-w-none sm:max-h-none sm:w-[min(280px,calc((100dvh-210px)*9/16))] sm:h-[min(520px,calc(100dvh-210px))] lg:w-[min(310px,calc((100dvh-200px)*9/16))] lg:h-[min(550px,calc(100dvh-200px))] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-2.5 sm:p-4 bg-[#151513] text-white border border-stone-200/90 group shrink-0"
              >
                {/* Image selfie vidéo afro-futuriste OU Vidéo si lecture */}
                {duoPreviewVideo === 'upload' ? (
                  <video
                    src="/sample.mp4"
                    preload="metadata"
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/assets/images/selfie_video_story.jpg"
                    alt="Télécharger sa vidéo"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = '/src/assets/images/selfie_video_story_1792918744207.jpg';
                    }}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

                {/* Haut de carte : Titre à gauche + Lecteur & Mute à droite */}
                <div className="relative z-10 flex items-center justify-between w-full min-w-0">
                  <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/80 border border-white/20 text-[9px] sm:text-[11px] font-semibold text-white tracking-wide shadow-sm shrink-0 whitespace-nowrap leading-none select-none max-w-[calc(100%-60px)] truncate">
                    <span className="hidden sm:inline">Télécharger sa vidéo</span>
                    <span className="sm:hidden">Télécharger</span>
                  </span>
                  
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    {/* Icône mute si vidéo active */}
                    {duoPreviewVideo === 'upload' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(prev => !prev);
                        }}
                        className="w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-full bg-black/70 hover:bg-[#A2482B] active:bg-[#8A3B22] border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                        title={isMuted ? 'Activer le son' : 'Couper le son'}
                      >
                        {isMuted ? <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" /> : <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setDuoPreviewVideo(prev => prev === 'upload' ? null : 'upload')}
                      className="w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-black/72 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                      title={duoPreviewVideo === 'upload' ? "Arrêter la vidéo" : "Visionner l'exemple"}
                    >
                      {duoPreviewVideo === 'upload' ? (
                        <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white" />
                      ) : (
                        <TvPlayerIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={1.7} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bas de carte : Uniquement le bouton Choisir en bas à droite */}
                <div className="relative z-10 w-full flex items-center justify-end pointer-events-auto pt-1 sm:pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadScreenActive(true);
                      setDuoPreviewVideo(null);
                    }}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-black/70 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white font-medium text-[10.5px] sm:text-[12px] shadow-md flex items-center gap-1 sm:gap-1.5 transition-all duration-200 cursor-pointer border border-white/20 hover:border-[#A2482B] hover:scale-105 active:scale-95"
                  >
                    <DoorOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/90" />
                    <span>Choisir</span>
                  </button>
                </div>
              </div>

              {/* CARTE 2 : CHOISIR UN EXPERT */}
              <div 
                className="relative aspect-[9/16] w-[min(calc((100vw-28px)/2),calc((100dvh-230px)*9/16))] max-w-[185px] max-h-[min(480px,calc(100dvh-230px))] sm:max-w-none sm:max-h-none sm:w-[min(280px,calc((100dvh-210px)*9/16))] sm:h-[min(520px,calc(100dvh-210px))] lg:w-[min(310px,calc((100dvh-200px)*9/16))] lg:h-[min(550px,calc(100dvh-200px))] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-2.5 sm:p-4 bg-[#151513] text-white border border-stone-200/90 group shrink-0"
              >
                {/* Image personne filmée par un pro OU Vidéo si lecture */}
                {duoPreviewVideo === 'expert' ? (
                  <video
                    src="/sample.mp4"
                    preload="metadata"
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/assets/images/pro_shoot_story.jpg"
                    alt="Choisir un expert"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = '/src/assets/images/pro_shoot_story_1792918744384.jpg';
                    }}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

                {/* Haut de carte : Titre à gauche + Lecteur & Mute à droite */}
                <div className="relative z-10 flex items-center justify-between w-full min-w-0">
                  <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/80 border border-white/20 text-[9px] sm:text-[11px] font-semibold text-white tracking-wide shadow-sm shrink-0 whitespace-nowrap leading-none select-none max-w-[calc(100%-60px)] truncate">
                    <span className="hidden sm:inline">Choisir un expert</span>
                    <span className="sm:hidden">Un expert</span>
                  </span>
                  
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    {/* Icône mute si vidéo active */}
                    {duoPreviewVideo === 'expert' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(prev => !prev);
                        }}
                        className="w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-full bg-black/70 hover:bg-[#A2482B] active:bg-[#8A3B22] border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                        title={isMuted ? 'Activer le son' : 'Couper le son'}
                      >
                        {isMuted ? <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" /> : <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setDuoPreviewVideo(prev => prev === 'expert' ? null : 'expert')}
                      className="w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-black/72 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                      title={duoPreviewVideo === 'expert' ? "Arrêter la vidéo" : "Visionner l'exemple"}
                    >
                      {duoPreviewVideo === 'expert' ? (
                        <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white" />
                      ) : (
                        <TvPlayerIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={1.7} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bas de carte : Uniquement le bouton Choisir en bas à droite */}
                <div className="relative z-10 w-full flex items-center justify-end pointer-events-auto pt-1 sm:pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate({ 
                      type: 'request_videographer',
                      returnPillarId: activePillar?.id,
                      returnCastingCategoryId: activeCastingCategory?.id,
                      returnFinalChoiceId: selectedFinalChoice?.id,
                      returnPartId: selectedSeriesSide || selectedPartId
                    })}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-black/70 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white font-medium text-[10.5px] sm:text-[12px] shadow-md flex items-center gap-1 sm:gap-1.5 transition-all duration-200 cursor-pointer border border-white/20 hover:border-[#A2482B] hover:scale-105 active:scale-95"
                  >
                    <DoorOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/90" />
                    <span>Choisir</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : isTwoChoiceLevel0 ? (
        /* ========================================================================= */
        /* 3A. NIVEAU 0 ÉPURÉ : SWIPE HORIZONTAL SIMPLE À 2 POSITIONS (FOCUS / DIALOGUE) */
        /* ========================================================================= */
        <div
          className="relative flex-1 flex flex-col justify-center items-center w-full min-h-0 py-1 sm:py-2 animate-in fade-in duration-200 touch-pan-y select-none overflow-hidden"
          onTouchStart={onLevel0TouchStart}
          onTouchMove={onLevel0TouchMove}
          onTouchEnd={onLevel0TouchEnd}
          onMouseDown={onLevel0MouseDown}
          onMouseMove={onLevel0MouseMove}
          onMouseUp={onLevel0MouseUp}
          onMouseLeave={onLevel0MouseLeave}
        >
          {/* Flèche Gauche */}
          {SHOW_CAROUSEL_ARROWS && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="flex absolute left-1 sm:left-3 lg:left-6 z-40 w-8.5 h-8.5 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#1C1917] hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
            title="Précédent"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>
          )}

          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <div className="w-full overflow-hidden">
              <div
                className="flex w-[200%]"
                style={{
                  transform: `translateX(calc(-${selectedPillarIndex * 50}% + ${level0DragOffset}px))`,
                  transition: isLevel0Dragging ? 'none' : 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              >
                {VISIBLE_STUDIO_PILLARS.map((pillar, idx) => {
                  const isActiveSlide = selectedPillarIndex === idx;
                  const isPlaying = playingCardId === pillar.id && isActiveSlide;

                  return (
                    <div
                      key={`studio-pillar-card-${pillar.id}`}
                      className="w-1/2 flex items-center justify-center shrink-0"
                    >
                      <div
                        onClick={() => {
                          if (level0DidDragRef.current) return;
                          handleSelectPillar(pillar);
                        }}
                        className="relative aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-3 sm:p-4 bg-[#151513] text-white border border-stone-200/90 hover:border-white transition-colors cursor-pointer select-none group shrink-0"
                      >
                        {/* Image d'illustration cinéma OU Vidéo si lecture activée */}
                        {isPlaying ? (
                          <video
                            src={pillar.videoUrl}
                            poster={pillar.posterUrl}
                            preload="metadata"
                            autoPlay
                            loop
                            playsInline
                            muted={isMuted}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={pillar.posterUrl}
                            alt={pillar.title}
                            loading={isActiveSlide ? 'eager' : 'lazy'}
                            decoding="async"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.onerror = null;
                              target.src = '/assets/images/pillar_casting_phoenix.png';
                            }}
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500"
                          />
                        )}

                        {/* Voile cinématographique pour une visibilité optimale */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

                        {/* HAUT : Badge Titre à gauche + Lecteur & Mute à droite */}
                        <div className="relative z-10 flex items-center justify-between gap-1.5 pointer-events-auto w-full min-w-0">
                          <div className="inline-flex w-fit items-center px-2.5 py-1 rounded-full bg-black/75 border border-white/20 shadow-md">
                            <span
                              className="font-editorial text-[9.5px] sm:text-xs font-semibold text-white leading-none whitespace-nowrap tracking-wide select-none"
                              title={pillar.title}
                            >
                              {pillar.title}
                            </span>
                          </div>

                          <div
                            className="flex items-center gap-1.5 shrink-0"
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                          >
                            {isPlaying && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setIsMuted((prev) => !prev);
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                                className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-black/70 hover:bg-[#A2482B] active:bg-[#8A3B22] border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                                title={isMuted ? 'Activer le son' : 'Couper le son'}
                              >
                                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPlayingCardId(isPlaying ? null : pillar.id);
                              }}
                              onMouseDown={(e) => e.stopPropagation()}
                              onTouchStart={(e) => e.stopPropagation()}
                              className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl bg-black/72 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0"
                              title={isPlaying ? 'Mettre en pause' : `Visionner ${pillar.title}`}
                            >
                              {isPlaying ? (
                                <Pause className="w-3.5 h-3.5 fill-white text-white" />
                              ) : (
                                <TvPlayerIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white transition-transform" strokeWidth={1.7} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* BAS : Papyrus (synopsis) à gauche + Choisir à droite */}
                        <div
                          className="relative z-10 w-full flex items-center justify-between pointer-events-auto pt-2"
                          onMouseDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSynopsisModalItem(pillar);
                              celestialAudio?.playOrbSelect?.();
                            }}
                            className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl bg-black/70 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0"
                            title="Lire le synopsis"
                          >
                            <Scroll className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelectPillar(pillar);
                            }}
                            className="px-3 py-1.5 sm:py-2 rounded-xl bg-black/70 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white font-medium text-xs sm:text-[12px] shadow-md flex items-center gap-1.5 transition-all duration-200 cursor-pointer border border-white/20 hover:border-[#A2482B] hover:scale-105 active:scale-95"
                          >
                            <DoorOpen className="w-3.5 h-3.5 text-white/90" />
                            <span>Choisir</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Flèche Droite */}
          {SHOW_CAROUSEL_ARROWS && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="flex absolute right-1 sm:right-3 lg:right-6 z-40 w-8.5 h-8.5 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#1C1917] hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
            title="Suivant"
            aria-label="Suivant"
          >
            <ChevronRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* 3B. ZONE CENTRALE : CARROUSEL 3D DES THÉMATIQUES / CATÉGORIES             */
        /* ========================================================================= */
        <div 
          className="relative flex-1 flex flex-col items-center justify-center min-h-0 py-1 select-none overflow-hidden touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={() => { isDraggingRef.current = false; setDragOffset(0); }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* Flèche Gauche */}
          {SHOW_CAROUSEL_ARROWS && (
          <button
            onClick={goToPrev}
            className="flex absolute left-1 sm:left-3 lg:left-6 z-40 w-8.5 h-8.5 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#1C1917] hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
            title="Précédent"
            id="prev-carousel-btn"
          >
            <ChevronLeft className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>
          )}

          {/* SCÈNE 3D AVEC PERSPECTIVE JEU VIDÉO */}
          <div 
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
            style={{ 
              perspective: STAGE_PERSPECTIVE,
              perspectiveOrigin: 'center center'
            }}
          >
            <div 
              className="relative w-full h-full flex items-center justify-center pointer-events-none"
              style={{
                transformStyle: 'preserve-3d'
              }}
            >
              {currentList.map((item, idx) => {
                const n = currentList.length;
                const rawDiff = (idx - currentIndex) % n;
                const diff = rawDiff > n / 2 ? rawDiff - n : rawDiff < -n / 2 ? rawDiff + n : rawDiff;
                if (Math.abs(diff) > 2) return null;
                const isCenter = diff === 0;

                let transformStyle = '';
                let zIndex = 10;
                let opacity = 0;
                let pointerEvents: 'auto' | 'none' = 'none';

                if (diff === 0) {
                  // Carte active au centre
                  transformStyle = `translateX(${dragOffset}px) translateZ(${STAGE_CENTER_TRANSLATE_Z}px) rotateY(${dragOffset * -0.15}deg) scale(1)`;
                  zIndex = 30;
                  opacity = 1;
                  pointerEvents = 'auto';
                } else if (diff === 1) {
                  // Carte voisine droite
                  transformStyle = `translateX(calc(55% + ${dragOffset}px)) translateZ(-60px) rotateY(-26deg) scale(0.86)`;
                  zIndex = 20;
                  opacity = 0.75;
                  pointerEvents = 'auto';
                } else if (diff === -1) {
                  // Carte voisine gauche
                  transformStyle = `translateX(calc(-55% + ${dragOffset}px)) translateZ(-60px) rotateY(26deg) scale(0.86)`;
                  zIndex = 20;
                  opacity = 0.75;
                  pointerEvents = 'auto';
                } else if (diff === 2) {
                  // Carte droite plus éloignée
                  transformStyle = `translateX(calc(100% + ${dragOffset}px)) translateZ(-140px) rotateY(-40deg) scale(0.72)`;
                  zIndex = 10;
                  opacity = 0.35;
                  pointerEvents = 'auto';
                } else if (diff === -2) {
                  // Carte gauche plus éloignée
                  transformStyle = `translateX(calc(-100% + ${dragOffset}px)) translateZ(-140px) rotateY(40deg) scale(0.72)`;
                  zIndex = 10;
                  opacity = 0.35;
                  pointerEvents = 'auto';
                }

                const isPlaying = playingCardId === item.id && isCenter;
                const castingItem = item as StudioPillarItem;
                const hasSubCategories = isLevel1 && Boolean(castingItem.subCategories && castingItem.subCategories.length > 0);
                const isSeriesAudioCard = isLevel1 && activePillar?.id === 'duos';
                const isSideAudioCard = isSideSelectionLevel && activePillar?.id === 'duos';
                const isEpisodeAudioCard = isLevel2 && activePillar?.id === 'duos';
                const isAudioCard = isSeriesAudioCard || isSideAudioCard || isEpisodeAudioCard;
                const isSynopsisAudioMode = isSeriesAudioCard || isSideAudioCard;

                return (
                  <div
                    key={`carousel-card-${item.id}`}
                    onClick={() => {
                      if (didDragRef.current) {
                        didDragRef.current = false;
                        return;
                      }
                      if (isCenter) {
                        if (isLevel0) {
                          handleSelectPillar(item as StudioPillar);
                        } else if (isSideSelectionLevel) {
                          handleSelectSeriesSide(item.id as 'part-a' | 'part-b');
                        } else if (hasSubCategories) {
                          handleSelectCastingCategory(item as StudioPillarItem);
                        } else {
                          // Pour les feuilles terminales (épisodes d'une série, Lumière, Portrait ou sous-thème Casting)
                          handleSelectFinalChoice(item as StudioPillarItem);
                        }
                      } else {
                        // Clic sur une carte latérale : la faire pivoter immédiatement au centre
                        episodeVoiceReader.stop();
                        setIsAudioLoading(false);
                        setCurrentIndex(idx);
                        setPlayingCardId(null);
                        celestialAudio?.playOrbSelect?.();
                      }
                    }}
                    style={{
                      transform: transformStyle,
                      zIndex,
                      opacity,
                      pointerEvents,
                      transition: isDraggingRef.current ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease'
                    }}
                    className={`absolute ${STAGE_CARD_DIMENSIONS_CLASS} rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between p-2.5 sm:p-4 cursor-pointer select-none bg-[#151513] text-white border transition-colors ${
                      isCenter ? 'border-stone-200/90 ring-1 ring-white/30' : 'border-white/15'
                    }`}
                  >
                    {/* Image d'illustration cinéma OU Vidéo si lecture activée (affiche animée en zoom/dézoom pour cartes audio) */}
                    {isPlaying && !isAudioCard ? (
                      <video
                        src={item.videoUrl}
                        poster={item.posterUrl}
                        preload="metadata"
                        autoPlay
                        loop
                        playsInline
                        muted={isMuted}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        loading={Math.abs(diff) <= 1 ? 'eager' : 'lazy'}
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src =
                            isSideSelectionLevel && activeRegistrySeries?.posterUrl
                              ? activeRegistrySeries.posterUrl
                              : '/assets/images/pillar_casting_phoenix.png';
                        }}
                        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
                          isEpisodeAudioCard ? 'opacity-50' : ''
                        } ${isPlaying && isAudioCard ? 'animate-poster-kenburns' : ''}`}
                      />
                    )}

                    {/* Voile cinématographique pour une visibilité optimale */}
                    <div
                      className={`absolute inset-0 pointer-events-none ${
                        isEpisodeAudioCard
                          ? 'bg-gradient-to-b from-black/55 via-black/30 to-black/75'
                          : 'bg-gradient-to-b from-black/60 via-transparent to-black/85'
                      }`}
                    />

                    {/* ========================================================= */}
                    {/* HAUT : Titre série/côté sur une seule ligne + Lecture à droite */}
                    {/* ========================================================= */}
                    <div className="relative z-10 flex items-center justify-between gap-1 pointer-events-auto w-full min-w-0">
                      <div className="inline-flex w-fit max-w-full min-w-0 items-center rounded-full px-2 sm:px-2.5 py-1 bg-black/75 border border-white/20 shadow-md">
                        <span
                          className="font-editorial text-[8px] sm:text-[9.5px] md:text-[10.5px] font-semibold text-white leading-tight tracking-wide select-none"
                          title={item.title}
                        >
                          {item.title}
                        </span>
                      </div>

                      {/* Déclencheur lecture vidéo (ou lecture vocale sur carte Série / Côté / Épisode) en haut à droite */}
                      <div 
                        className="flex items-center gap-1 shrink-0"
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                      >
                        {/* Bouton Muet discret (uniquement si vidéo en cours hors carte audio) */}
                        {isPlaying && !isAudioCard && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsMuted((prev) => !prev);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/70 hover:bg-[#A2482B] active:bg-[#8A3B22] border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                            title={isMuted ? 'Activer le son' : 'Couper le son'}
                          >
                            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isCenter) {
                              episodeVoiceReader.stop();
                              setIsAudioLoading(false);
                              setPlayingCardId(null);
                              setCurrentIndex(idx);
                            } else if (isAudioCard) {
                              if (isPlaying) {
                                episodeVoiceReader.stop();
                                setIsAudioLoading(false);
                                setPlayingCardId(null);
                              } else {
                                setPlayingCardId(item.id);
                                episodeVoiceReader.speak(
                                  isSynopsisAudioMode
                                    ? {
                                        mode: 'synopsis',
                                        synopsis: castingItem.subtitle,
                                        onLoadStart: () => setIsAudioLoading(true),
                                        onStart: () => setIsAudioLoading(false),
                                        onEnd: () => {
                                          setIsAudioLoading(false);
                                          setPlayingCardId((prev) => (prev === item.id ? null : prev));
                                        },
                                        onError: (msg) => {
                                          setIsAudioLoading(false);
                                          setPlayingCardId((prev) => (prev === item.id ? null : prev));
                                          showToast(msg || "La lecture vocale n'est pas disponible.");
                                        }
                                      }
                                    : {
                                        mode: 'episode',
                                        episodeLabel: castingItem.badge,
                                        episodeTitle: castingItem.episodeTitle,
                                        question: castingItem.question,
                                        onLoadStart: () => setIsAudioLoading(true),
                                        onStart: () => setIsAudioLoading(false),
                                        onEnd: () => {
                                          setIsAudioLoading(false);
                                          setPlayingCardId((prev) => (prev === item.id ? null : prev));
                                        },
                                        onError: (msg) => {
                                          setIsAudioLoading(false);
                                          setPlayingCardId((prev) => (prev === item.id ? null : prev));
                                          showToast(msg || "La lecture vocale n'est pas disponible.");
                                        }
                                      }
                                );
                              }
                            } else {
                              setPlayingCardId(isPlaying ? null : item.id);
                            }
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-white border flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0 ${
                            isPlaying && isAudioCard
                              ? 'bg-[#A2482B] border-[#F3C677]/60 hover:bg-[#8A3B22]'
                              : 'bg-black/72 hover:bg-[#A2482B] active:bg-[#8A3B22] border-white/20 hover:border-[#A2482B]'
                          }`}
                          title={
                            isSynopsisAudioMode
                              ? isPlaying
                                ? 'Arrêter la lecture du synopsis'
                                : 'Écouter le synopsis'
                              : isEpisodeAudioCard
                                ? isPlaying
                                  ? 'Arrêter la lecture audio'
                                  : 'Écouter la question'
                                : isPlaying
                                  ? 'Mettre en pause'
                                  : `Visionner ${item.title}`
                          }
                        >
                          {isPlaying && isAudioCard && isAudioLoading ? (
                            <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                          ) : isPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-white text-white" />
                          ) : (
                            <TvPlayerIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white transition-transform" strokeWidth={1.7} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* ========================================================= */}
                    {/* CENTRE : Épisode + Titre à gauche, Question centrée (sans guillemets) */}
                    {/* ========================================================= */}
                    {isEpisodeAudioCard && castingItem.question && (
                      <div className="relative z-10 flex-1 flex flex-col justify-center min-h-0 px-1 sm:px-2 py-2 pointer-events-none">
                        <div className="w-full text-left mb-2.5 sm:mb-3 space-y-0.5">
                          {castingItem.badge && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#F3C677] drop-shadow-sm">
                                {castingItem.badge}
                              </span>
                              {isPlaying && (
                                <span className="inline-flex items-center gap-0.5 h-3" aria-hidden="true">
                                  <span className="w-0.5 h-2.5 bg-[#F3C677] rounded-full animate-modern-wave" />
                                  <span className="w-0.5 h-3 bg-[#F3C677] rounded-full animate-modern-wave [animation-delay:0.15s]" />
                                  <span className="w-0.5 h-2 bg-[#F3C677] rounded-full animate-modern-wave [animation-delay:0.3s]" />
                                </span>
                              )}
                            </div>
                          )}
                          {castingItem.episodeTitle && (
                            <p className="font-editorial text-xs sm:text-sm font-semibold text-white text-left leading-snug drop-shadow-sm">
                              {castingItem.episodeTitle}
                            </p>
                          )}
                        </div>

                        <p className="text-center text-[11.5px] sm:text-[13px] font-medium text-white leading-relaxed drop-shadow-md">
                          {castingItem.question}
                        </p>
                      </div>
                    )}

                    {/* ========================================================= */}
                    {/* BAS : ÉPURÉ (Pas de texte encombrant)                      */}
                    {/* À gauche : Papyrus (synopsis)                             */}
                    {/* À droite : Bouton discret « Choisir » avec icône de porte */}
                    {/* ========================================================= */}
                    <div 
                      className="relative z-10 w-full flex items-center justify-between pointer-events-auto pt-2"
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      {/* GROUPE GAUCHE : Uniquement le Papyrus pour le synopsis */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSynopsisModalItem(item);
                            celestialAudio?.playOrbSelect?.();
                          }}
                          className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl bg-black/70 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                          title="Lire le synopsis"
                        >
                          <Scroll className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                        </button>
                      </div>

                      {/* GROUPE DROIT : Bouton discret « Choisir » avec icône porte */}
                      <div>
                        {/* 1. Niveau 0 : Choisir */}
                        {isLevel0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isCenter) {
                                setCurrentIndex(idx);
                              } else {
                                handleSelectPillar(item as StudioPillar);
                              }
                            }}
                            className="px-3 py-1.5 sm:py-2 rounded-xl bg-black/70 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white font-medium text-xs sm:text-[12px] shadow-md flex items-center gap-1.5 transition-all duration-200 cursor-pointer border border-white/20 hover:border-[#A2482B] hover:scale-105 active:scale-95"
                          >
                            <DoorOpen className="w-3.5 h-3.5 text-white/90" />
                            <span>Choisir</span>
                          </button>
                        )}

                        {/* 1b. Sélection du côté (A ou B) : Choisir */}
                        {isSideSelectionLevel && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isCenter) {
                                setCurrentIndex(idx);
                              } else {
                                handleSelectSeriesSide(item.id as 'part-a' | 'part-b');
                              }
                            }}
                            className="px-3 py-1.5 sm:py-2 rounded-xl bg-black/70 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white font-medium text-xs sm:text-[12px] shadow-md flex items-center gap-1.5 transition-all duration-200 cursor-pointer border border-white/20 hover:border-[#A2482B] hover:scale-105 active:scale-95"
                          >
                            <DoorOpen className="w-3.5 h-3.5 text-white/90" />
                            <span>Choisir</span>
                          </button>
                        )}

                        {/* 2. Niveau 1 (Séries / Casting avec sous-catégories) : Choisir */}
                        {hasSubCategories && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isCenter) {
                                setCurrentIndex(idx);
                              } else {
                                handleSelectCastingCategory(item as StudioPillarItem);
                              }
                            }}
                            className="px-3 py-1.5 sm:py-2 rounded-xl bg-black/70 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white font-medium text-xs sm:text-[12px] shadow-md flex items-center gap-1.5 transition-all duration-200 cursor-pointer border border-white/20 hover:border-[#A2482B] hover:scale-105 active:scale-95"
                          >
                            <DoorOpen className="w-3.5 h-3.5 text-white/90" />
                            <span>Choisir</span>
                          </button>
                        )}

                        {/* 3. Choix final (Questions de série, Lumière, Portrait ou sous-thématiques Casting) */}
                        {(!isLevel0 && !isSideSelectionLevel && !hasSubCategories) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isCenter) {
                                setCurrentIndex(idx);
                              } else {
                                handleSelectFinalChoice(item as StudioPillarItem);
                              }
                            }}
                            className="px-3 py-1.5 sm:py-2 rounded-xl bg-black/70 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white font-medium text-xs sm:text-[12px] shadow-md flex items-center gap-1.5 transition-all duration-200 cursor-pointer border border-white/20 hover:border-[#A2482B] hover:scale-105 active:scale-95"
                          >
                            <DoorOpen className="w-3.5 h-3.5 text-white/90" />
                            <span>Choisir</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flèche Droite */}
          {SHOW_CAROUSEL_ARROWS && (
          <button
            onClick={goToNext}
            className="flex absolute right-1 sm:right-3 lg:right-6 z-40 w-8.5 h-8.5 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#1C1917] hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
            title="Suivant"
            id="next-carousel-btn"
          >
            <ChevronRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODALE SYNOPSIS ÉPURÉE (LARGEUR CALQUÉE SUR LA CARTE VIDÉO)           */}
      {/* ========================================================================= */}
      {synopsisModalItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-[2px] animate-modal-backdrop"
          onClick={closeSynopsisModal}
        >
          {/* Largeur strictement égale à la largeur d'une carte vidéo */}
          <div 
            className="w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] bg-[#FAF7F2] rounded-3xl p-4 sm:p-5 shadow-2xl border border-stone-200 space-y-3 animate-modal-sheet text-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header épuré : Papyrus + Nom de la carte + Fermer */}
            <div className="flex items-center gap-2 border-b border-stone-200/80 pb-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center shrink-0">
                <Scroll className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="font-editorial text-[11px] sm:text-sm font-semibold text-stone-900 leading-tight">
                  {synopsisModalItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeSynopsisModal}
                className="w-6.5 h-6.5 rounded-lg hover:bg-stone-200/70 text-stone-400 hover:text-stone-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Fermer"
                aria-label="Fermer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Corps de la présentation textuelle : uniquement le synopsis */}
            <div className="py-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                Synopsis
              </span>
              <p className="text-stone-700 text-xs sm:text-[13px] leading-relaxed">
                {synopsisModalItem.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast de succès téléversement */}
      {uploadSuccessToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#1C1917] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xl border border-stone-700 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Votre vidéo sera vérifiée par le comité de validation avant sa publication officielle.</span>
        </div>
      )}

      {/* Toast d'information temporaire */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#A2482B] text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-xl animate-in fade-in duration-150">
          {toastMessage}
        </div>
      )}

      </div>
    </div>
  );
};
