import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  X,
  MessageSquare,
  CheckCircle2,
  Video,
  Send,
  Copy
} from 'lucide-react';
import { useAuth } from '../services/authContext';
import { ShareIcon } from './ShareIcon';
import { VideoCardShareModal } from './VideoCardShareModal';
import { 
  ParcoursDeVieIcon,
  ProduitsServicesIcon,
  ProjetsIcon,
  BesoinsHandsIcon,
  DirectorChairIcon
} from './YonywoodBrandIcons';
import { 
  ROMEO_SIMULATION_DATA,
  VideoSimulationItem, 
  DemoProfileCategory 
} from './landing/DemoProfilPascalSection';
import { UnifiedVideoCardOverlay } from './UnifiedVideoCardOverlay';
import { StageCarousel3D } from './shared/StageCarousel3D';
import { CARD_WIDTH_MODAL_CLASS } from './shared/CardWidthModal';
import { formatFirstLetterOnly } from '../utils/textFormatters';
import {
  ViewScreen,
  AffiliationPerson,
  Protagonist,
  ProfileCategory,
  DimensionTab
} from '../types';
import { PROTAGONISTS, DOCUMENTARIES } from '../data/mockData';
import { resolveCanonicalSeriesId } from '../data/seriesRegistry';
import { MATRIX_SERIES_DATA } from '../data/matrixData';
import { SHOW_CAROUSEL_ARROWS } from '../config/flags';
import {
  ProfileVideoTab,
  PROFILE_TAB_LABELS,
  USER_VIDEOS_UPDATED_EVENT,
  getUserProfileTabSubmissions
} from '../utils/userVideoService';

export type {
  ProfileCategory,
  DimensionTab,
  UserRecitItem,
  UserEpisodeVideo,
  UserProductionShare,
  ShareTransaction,
  UserCreationItem,
  UserInitiativeItem,
  UserAppelItem
} from '../types';

export interface ProfileSettingsScreenProps {
  onNavigate: (screen: ViewScreen) => void;
  selectedDocFilter?: string[];
  onUpdateDocFilter?: (docIds: string[]) => void;
  language?: string;
  onUpdateLanguage?: (lang: string) => void;
  hideQuestionByDefault?: boolean;
  onToggleHideQuestion?: (val: boolean) => void;
  protagonistId?: string; // Si fourni = mode Visiteur
  initialTab?: DimensionTab;
  returnToDuoId?: string;
  returnToDuoIndex?: number;
  returnToDocId?: string;
  returnToProtagonistId?: string;
  returnToMarketplace?: boolean;
  marketplaceContext?: {
    offerId: string;
    offerIndex: number;
    sellerId: string;
    sellerName: string;
    sharesCount: number;
    unitPrice: number;
    seriesTitle: string;
  };
  initialModal?: 'orders' | 'contributions';
}


const SHOW_HIDDEN_PROFILE_CATEGORIES = false;
const SHOW_MARKETPLACE_RETURN_BANNER = false;
const ENABLE_ORDERS_AND_CONTRIBUTIONS_MODAL = false;

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
  onNavigate,
  selectedDocFilter = [],
  onUpdateDocFilter = (_docIds: string[]) => {},
  language = 'fr',
  onUpdateLanguage = (_lang: string) => {},
  hideQuestionByDefault = false,
  onToggleHideQuestion = (_val: boolean) => {},
  protagonistId,
  initialTab = 'recit',
  returnToDuoId,
  returnToDuoIndex,
  returnToDocId,
  returnToProtagonistId,
  returnToMarketplace = false,
  marketplaceContext,
  initialModal
}) => {


  useEffect(() => {
    if (!ENABLE_ORDERS_AND_CONTRIBUTIONS_MODAL && (initialModal === 'orders' || initialModal === 'contributions')) {
      onNavigate({ type: 'profile' });
    }
  }, [initialModal, onNavigate]);

  // Déterminer le mode : Propriétaire ou Visiteur
  const isOwner = !protagonistId || protagonistId === 'me';

  // Résolution du protagoniste cible (depuis MATRIX_SERIES_DATA ou PROTAGONISTS)
  const targetProtagonist = React.useMemo<Protagonist | null>(() => {
    if (isOwner) return null;

    // 1. Chercher d'abord dans MATRIX_SERIES_DATA par l'identifiant exact cliqué dans l'explorateur
    for (const series of MATRIX_SERIES_DATA) {
      const search = (list: AffiliationPerson[]): AffiliationPerson | null => {
        for (const p of list) {
          if (p.id === protagonistId) return p;
          if (p.invitedPeople && p.invitedPeople.length > 0) {
            const res = search(p.invitedPeople);
            if (res) return res;
          }
        }
        return null;
      };
      const foundInMatrix = search(series.pioneers);
      if (foundInMatrix) {
        return {
          id: foundInMatrix.id,
          slug: foundInMatrix.id,
          name: foundInMatrix.name,
          role: foundInMatrix.role,
          age: foundInMatrix.age,
          territory: foundInMatrix.territory || 'Ganvié',
          country: foundInMatrix.country || 'Bénin',
          flag: foundInMatrix.flag || '🇧🇯',
          photoUrl: foundInMatrix.photoUrl,
          teaserVideoUrl: foundInMatrix.teaserVideoUrl || '/sample.mp4',
          quote: foundInMatrix.teaserPitch,
          bio: foundInMatrix.teaserPitch ? foundInMatrix.teaserPitch.replace(/«|»/g, '').trim() : `Passeur de savoirs et créateur dans la transmission ${foundInMatrix.universeTag || series.seriesTitle}.`,
          universeTag: foundInMatrix.universeTag,
          documentaryId: series.seriesId,
          stories: []
        } as unknown as Protagonist;
      }
    }

    // 2. Si non trouvé dans MATRIX_SERIES_DATA, chercher dans les protagonistes globaux PROTAGONISTS
    const found = PROTAGONISTS.find(p => p.id === protagonistId || p.slug === protagonistId);
    if (found) return found;

    // 2b. Chercher si la personne a été mise en cache lors de l'exploration
    try {
      if (protagonistId) {
        const storedPerson = localStorage.getItem(`yonywood_person_${protagonistId}`);
        if (storedPerson) {
          const p = JSON.parse(storedPerson) as AffiliationPerson;
          return {
            id: p.id,
            slug: p.id,
            name: p.name,
            role: p.role,
            age: p.age,
            territory: p.territory || 'Ganvié',
            country: p.country || 'Bénin',
            flag: p.flag || '🇧🇯',
            photoUrl: p.photoUrl,
            teaserVideoUrl: p.teaserVideoUrl || '/sample.mp4',
            quote: p.teaserPitch,
            bio: p.teaserPitch ? p.teaserPitch.replace(/«|»/g, '').trim() : `Passeur de savoirs et créateur dans la transmission ${p.universeTag || 'YonyWood'}.`,
            universeTag: p.universeTag,
            documentaryId: 'yonywood-explorer',
            stories: []
          } as unknown as Protagonist;
        }
      }
    } catch {
      // noop
    }

    // 3. Fallback de secours
    return {
      id: protagonistId,
      slug: protagonistId,
      name: 'Artisan Passeur',
      role: 'Passeur de savoirs traditionnels',
      territory: 'Ganvié',
      country: 'Bénin',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: 'Artisan et passeur de savoirs dans la transmission des savoirs ancestraux.',
      teaserVideoUrl: '/sample.mp4',
      stories: []
    } as unknown as Protagonist;
  }, [protagonistId, isOwner]);

  const mapInitialCategory = (tab?: string): ProfileCategory => {
    if (!tab) return 'parcours';
    if (tab === 'parcours' || tab === 'episodes' || tab === 'recit') return 'parcours';
    if (tab === 'projets' || tab === 'initiatives') return 'projets';
    if (SHOW_HIDDEN_PROFILE_CATEGORIES) {
      if (tab === 'produits' || tab === 'productions' || tab === 'production' || tab === 'creations' || tab === 'offre') return 'produits';
      if (tab === 'besoins' || tab === 'appels' || tab === 'appel') return 'besoins';
    }
    return 'parcours';
  };

  // 4 catégories : Parcours de vie, Produits et services, Projets, Besoins
  const [activeCategory, setActiveCategory] = useState<ProfileCategory>(() => mapInitialCategory(initialTab));
  const { currentUser, usersList } = useAuth();
  const effectiveOwner = currentUser || usersList.find(u => u.id === 'usr-admin-romeo') || null;

  // Identité du profil affiché (Roméo Nonvide par défaut)
  const [userName, setUserName] = useState<string>(() => {
    if (targetProtagonist) return targetProtagonist.name;
    if (effectiveOwner) return effectiveOwner.name.split(' ')[0];
    return 'Roméo';
  });
  const [userFullName, setUserFullName] = useState<string>(() => {
    if (targetProtagonist) return targetProtagonist.name;
    if (effectiveOwner) return effectiveOwner.name;
    return 'Roméo Nonvide';
  });
  const [userTerritory, setUserTerritory] = useState<string>(() => {
    if (targetProtagonist) return `${targetProtagonist.territory}, ${targetProtagonist.country}`;
    if (effectiveOwner && (effectiveOwner.city || effectiveOwner.territory)) {
      return `${effectiveOwner.city || effectiveOwner.territory}, ${effectiveOwner.country || 'Bénin'}`;
    }
    return 'Cotonou, Bénin';
  });
  const [userPhoto, setUserPhoto] = useState<string>(() => {
    if (targetProtagonist) return targetProtagonist.photoUrl;
    if (effectiveOwner && effectiveOwner.avatarUrl) return effectiveOwner.avatarUrl;
    return '/assets/images/romeo_avatar_1792698425983.jpg';
  });

  // Mise à jour de l'identité si effectiveOwner change en mode propriétaire
  useEffect(() => {
    if (isOwner && effectiveOwner) {
      setUserName(effectiveOwner.name.split(' ')[0]);
      setUserFullName(effectiveOwner.name);
      if (effectiveOwner.city || effectiveOwner.territory) {
        setUserTerritory(`${effectiveOwner.city || effectiveOwner.territory}, ${effectiveOwner.country || 'Bénin'}`);
      }
      if (effectiveOwner.avatarUrl) setUserPhoto(effectiveOwner.avatarUrl);
    }
  }, [isOwner, effectiveOwner]);

  useEffect(() => {
    if (targetProtagonist) {
      setUserName(targetProtagonist.name);
      setUserFullName(targetProtagonist.name);
      setUserTerritory(`${targetProtagonist.territory || 'Ganvié'}, ${targetProtagonist.country || 'Bénin'}`);
      setUserPhoto(targetProtagonist.photoUrl);
      setIsPlaying(false);
    }
  }, [targetProtagonist]);

  const [shareToast, setShareToast] = useState<string | null>(null);

  // Indices de navigation par catégorie (carrousel 3D horizontal)
  const [categoryIndices, setCategoryIndices] = useState<Record<string, number>>({
    parcours: 0,
    produits: 0,
    projets: 0,
    besoins: 0,
    recit: 0,
    production: 0,
    offre: 0,
    appel: 0,
  });

  // Video playback & scrubber
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Modale de Partage Réseaux Sociaux (profil entier ou vidéo spécifique)
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shareContentType, setShareContentType] = useState<'profile' | 'video'>('profile');
  const [isVideoCardShareModalOpen, setIsVideoCardShareModalOpen] = useState<boolean>(false);

  // Modale d'invitation à l'échange
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [inviteMotif, setInviteMotif] = useState<'coprod' | 'savoir_faire' | 'collab' | 'question'>('coprod');
  const [inviteMessage, setInviteMessage] = useState<string>('');

  // Synchronisation avec les vidéos déposées par l'utilisateur
  const ownerUserId = currentUser?.id || 'usr-admin-romeo';
  const [submissionsVersion, setSubmissionsVersion] = useState<number>(0);

  useEffect(() => {
    const refreshSubmissions = () => setSubmissionsVersion((v) => v + 1);
    window.addEventListener('storage', refreshSubmissions);
    window.addEventListener(USER_VIDEOS_UPDATED_EVENT, refreshSubmissions);
    return () => {
      window.removeEventListener('storage', refreshSubmissions);
      window.removeEventListener(USER_VIDEOS_UPDATED_EVENT, refreshSubmissions);
    };
  }, []);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviteModalOpen(false);
    setShareToast(`Invitation à échanger envoyée à ${userName} ! Vous serez averti(e) dès sa réponse.`);
    setTimeout(() => setShareToast(null), 3500);
    setInviteMessage('');
  };



  const isRomeoProfile = !targetProtagonist || targetProtagonist.name.toLowerCase().includes('roméo') || targetProtagonist.name.toLowerCase().includes('romeo') || targetProtagonist.id === 'usr-admin-romeo';

  const normalizedCategory: DemoProfileCategory = useMemo(() => {
    if (activeCategory === 'parcours' || activeCategory === 'recit') return 'parcours';
    if (activeCategory === 'projets') return 'projets';
    if (SHOW_HIDDEN_PROFILE_CATEGORIES) {
      if (activeCategory === 'produits' || activeCategory === 'offre' || activeCategory === 'production') return 'produits';
      if (activeCategory === 'besoins' || activeCategory === 'appel') return 'besoins';
    }
    return 'parcours';
  }, [activeCategory]);

  const activeProfileTab: ProfileVideoTab | null = useMemo(() => {
    if (normalizedCategory === 'parcours') return 'parcours';
    if (normalizedCategory === 'projets') return 'projets';
    return null;
  }, [normalizedCategory]);

  const getBaseItemsForCategory = useMemo(() => {
    return (cat: DemoProfileCategory): VideoSimulationItem[] => {
      if (isRomeoProfile) {
        return ROMEO_SIMULATION_DATA[cat] || [];
      }

      const pPhoto = targetProtagonist?.photoUrl || '/assets/images/amara_andine_1792933642777.jpg';
      const pVideo = targetProtagonist?.teaserVideoUrl || '/sample.mp4';
      const pName = targetProtagonist?.name || 'Artisan';

      if (cat === 'parcours') {
        return [
          {
            id: `parcours-${targetProtagonist?.id}-1`,
            title: `Mon chemin - ${pName}`,
            subtitle: 'Éveil sensoriel & origines',
            description: targetProtagonist?.bio || `Récit personnel de ${pName} sur ses origines et sa vocation.`,
            posterUrl: pPhoto,
            videoUrl: pVideo,
            duration: '06:15',
            tag: 'Origines & Mémoire'
          },
          {
            id: `parcours-${targetProtagonist?.id}-2`,
            title: 'L’initiation & l’apprentissage',
            subtitle: 'Savoirs traditionnels',
            description: 'Années de formation et secrets transmis de génération en génération.',
            posterUrl: pPhoto,
            videoUrl: '/sample.mp4',
            duration: '08:40',
            tag: 'Transmission'
          },
          {
            id: `parcours-${targetProtagonist?.id}-3`,
            title: 'Le geste & la résilience',
            subtitle: 'Confiance & ancrage',
            description: 'Surmonter les carrefours de vie grâce à l’artisanat et à la communauté.',
            posterUrl: pPhoto,
            videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            duration: '05:20',
            tag: 'Cheminement'
          },
          {
            id: `parcours-${targetProtagonist?.id}-4`,
            title: 'Mémoire & regard intérieur',
            subtitle: 'Transmission aux générations',
            description: 'Ce que je souhaite léguer aux générations qui viennent après moi.',
            posterUrl: pPhoto,
            videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
            duration: '07:10',
            tag: 'Héritage'
          }
        ];
      }
      if (SHOW_HIDDEN_PROFILE_CATEGORIES && cat === 'produits') {
        return [
          {
            id: `produits-${targetProtagonist?.id}-1`,
            title: 'Créations signature faites main',
            subtitle: 'Artisanat d’art traditionnel',
            description: 'Pièces uniques confectionnées selon les règles de l’art.',
            posterUrl: pPhoto,
            videoUrl: pVideo,
            duration: '04:30',
            tag: 'Pièce unique'
          },
          {
            id: `produits-${targetProtagonist?.id}-2`,
            title: 'Atelier de transmission pratique',
            subtitle: 'Immersion & Savoir-faire',
            description: 'Initiation pratique aux techniques et gestes du métier.',
            posterUrl: pPhoto,
            videoUrl: '/sample.mp4',
            duration: '05:45',
            tag: 'Atelier • 2h30'
          },
          {
            id: `produits-${targetProtagonist?.id}-3`,
            title: 'Consultations & guidances',
            subtitle: 'Conseil & écoute bienveillante',
            description: 'Éclairer vos questionnements par la sagesse transmise.',
            posterUrl: pPhoto,
            videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
            duration: '06:00',
            tag: 'Séance de conseil'
          },
          {
            id: `produits-${targetProtagonist?.id}-4`,
            title: 'Objets du quotidien & coopérative',
            subtitle: 'Production locale solidaire',
            description: 'Objets décoratifs et utilitaires réalisés par notre collectif.',
            posterUrl: pPhoto,
            videoUrl: '/sample.mp4',
            duration: '03:50',
            tag: 'Coopérative solidaire'
          }
        ];
      }
      if (cat === 'projets') {
        return [
          {
            id: `projets-${targetProtagonist?.id}-1`,
            title: 'L’Atelier communautaire',
            subtitle: 'Insertion & formation',
            description: 'Création d’un centre d’apprentissage pour les nouveaux arrivants.',
            posterUrl: pPhoto,
            videoUrl: pVideo,
            duration: '05:15',
            tag: 'Initiative personnelle',
            extraInfo: 'Insertion & formation'
          },
          {
            id: `projets-${targetProtagonist?.id}-2`,
            title: 'Charpente & matériaux nobles',
            subtitle: 'Éco-construction durable',
            description: 'Charpente et structure pensées pour durer des décennies.',
            posterUrl: pPhoto,
            videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
            duration: '04:10',
            tag: 'Initiative personnelle',
            extraInfo: 'Éco-construction durable'
          },
          {
            id: `projets-${targetProtagonist?.id}-3`,
            title: 'Classes de transmission',
            subtitle: 'Transmission aux écoles',
            description: 'Ateliers découvertes dans les écoles de la région.',
            posterUrl: pPhoto,
            videoUrl: '/sample.mp4',
            duration: '06:20',
            tag: 'Initiative personnelle',
            extraInfo: 'Transmission aux écoles'
          },
          {
            id: `projets-${targetProtagonist?.id}-4`,
            title: 'Passerelle d’accès solidaire',
            subtitle: 'Initiative partagée concrétisée',
            description: 'Ouverture de nos espaces à tous les visiteurs et partenaires.',
            posterUrl: pPhoto,
            videoUrl: '/sample.mp4',
            duration: '04:45',
            tag: 'Initiative personnelle',
            extraInfo: 'Ouverture & accueil'
          }
        ];
      }
      if (SHOW_HIDDEN_PROFILE_CATEGORIES && cat === 'besoins') {
        return [
          {
            id: `besoins-${targetProtagonist?.id}-1`,
            title: 'Équipement d’enregistrement et d’archivage',
            subtitle: 'Matériel d’archives sonores',
            description: 'Sauvegarde des chants et mémoires orales de notre communauté.',
            posterUrl: pPhoto,
            videoUrl: pVideo,
            duration: '04:00',
            tag: 'Prioritaire'
          },
          {
            id: `besoins-${targetProtagonist?.id}-2`,
            title: 'Matières premières naturelles locales',
            subtitle: 'Filière éco-responsable',
            description: 'Approvisionnement régulier en fil écru et teintures végétales.',
            posterUrl: pPhoto,
            videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            duration: '03:30',
            tag: 'D’ici mai'
          },
          {
            id: `besoins-${targetProtagonist?.id}-3`,
            title: 'Outillage adapté pour nos ateliers',
            subtitle: 'Sécurité & Ergonomie',
            description: 'Matériel sécurisé adapté aux artisans en formation.',
            posterUrl: pPhoto,
            videoUrl: '/sample.mp4',
            duration: '04:15',
            tag: 'En cours'
          },
          {
            id: `besoins-${targetProtagonist?.id}-4`,
            title: 'Mentors & partenaires bénévoles',
            subtitle: 'Accompagnement humain',
            description: 'Formateurs et spécialistes pour renforcer l’inclusion.',
            posterUrl: pPhoto,
            videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
            duration: '05:00',
            tag: 'Permanente'
          }
        ];
      }
      return [];
    };
  }, [isRomeoProfile, targetProtagonist]);

  const baseCategoryItems = useMemo(
    () => getBaseItemsForCategory(normalizedCategory),
    [getBaseItemsForCategory, normalizedCategory]
  );

  const ownerSubmittedItems: VideoSimulationItem[] = useMemo(() => {
    if (!isOwner || !activeProfileTab) return [];
    const stored = getUserProfileTabSubmissions(ownerUserId, activeProfileTab);
    return stored.map((sub) => ({
      id: sub.id,
      title: sub.title,
      subtitle: PROFILE_TAB_LABELS[activeProfileTab],
      description: sub.synopsis,
      posterUrl: sub.thumbnailUrl || userPhoto || '/assets/images/selfie_video_story.jpg',
      videoUrl: sub.videoUrl || '/sample.mp4',
      duration: '02:00',
      tag: sub.title || PROFILE_TAB_LABELS[activeProfileTab]
    }));
  }, [isOwner, activeProfileTab, ownerUserId, userPhoto, submissionsVersion]);

  // Aucune troncature ni suppression des vidéos déjà existantes (même au-delà de 8)
  const activeCategoryItems: VideoSimulationItem[] = useMemo(() => {
    return [...ownerSubmittedItems, ...baseCategoryItems];
  }, [ownerSubmittedItems, baseCategoryItems]);

  const totalItemsInActiveCategory = activeCategoryItems.length;

  const currentCategoryRawIndex = categoryIndices[activeCategory] ?? categoryIndices[normalizedCategory] ?? 0;
  const currentCategorySafeIndex = totalItemsInActiveCategory > 0
    ? ((currentCategoryRawIndex % totalItemsInActiveCategory) + totalItemsInActiveCategory) % totalItemsInActiveCategory
    : 0;

  const currentSimulationItem = activeCategoryItems[currentCategorySafeIndex] || activeCategoryItems[0];

  // Synchroniser la vidéo lors du changement de catégorie ou d'index vidéo
  useEffect(() => {
    setIsPlaying(false);
    setVideoProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [activeCategory, categoryIndices]);

  // Synchronisation continue du son avec l'élément vidéo
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Contrôle direct de l'élément vidéo lors des bascules play/pause
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = isMuted;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Lecture vidéo prévenue par le navigateur :", err);
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Gérer la lecture vidéo (bascule garantie et immédiate pour un comportement standardisé sur toute l'app)
  const toggleVideoPlayback = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    setIsPlaying((prev) => !prev);
  };

  // Basculer l'état du son (Mute / Unmute)
  const toggleMute = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    setIsMuted((prev) => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.muted = next;
      }
      return next;
    });
  };

  const handleSelectCategoryIndex = (nextIndex: number) => {
    setCategoryIndices((prev) => ({
      ...prev,
      [activeCategory]: nextIndex
    }));
  };

  // Prénom affiché uniquement (ex: Pascal)
  const profileDisplayName = useMemo(() => {
    const raw = targetProtagonist 
      ? targetProtagonist.name 
      : (userFullName || userName || 'Pascal');
    return raw.trim().split(' ')[0] || raw;
  }, [targetProtagonist, userFullName, userName]);

  // Prénom et nom complets affichés dans l'en-tête de la page portrait (ex: Pascal Cossi)
  const profileFullDisplayName = useMemo(() => {
    if (targetProtagonist?.name) return targetProtagonist.name;
    if (userFullName) return userFullName;
    if (currentUser?.name) return currentUser.name;
    return 'Roméo Nonvide';
  }, [targetProtagonist, userFullName, currentUser]);

  // Pays et drapeau pour la barre noire du portrait
  const countryName = useMemo(() => {
    if (targetProtagonist?.country) return targetProtagonist.country;
    if (currentUser?.country) return currentUser.country;
    if (userTerritory) {
      const parts = userTerritory.split(',');
      if (parts.length > 1) return parts[parts.length - 1].trim();
      return userTerritory.trim();
    }
    return 'Bénin';
  }, [targetProtagonist, currentUser, userTerritory]);

  const countryFlag = useMemo(() => {
    const c = countryName.toLowerCase();
    if (c.includes('bénin') || c.includes('benin')) return '🇧🇯';
    if (c.includes('france')) return '🇫🇷';
    if (c.includes('togo')) return '🇹🇬';
    if (c.includes('sénégal') || c.includes('senegal')) return '🇸🇳';
    if (c.includes('ivoire')) return '🇨🇮';
    if (c.includes('cameroun') || c.includes('cameroon')) return '🇨🇲';
    if (c.includes('ghana')) return '🇬🇭';
    if (c.includes('nigeria') || c.includes('nigéria')) return '🇳🇬';
    if (c.includes('mali')) return '🇲🇱';
    if (c.includes('burkina')) return '🇧🇫';
    if (c.includes('gabon')) return '🇬🇦';
    if (c.includes('congo')) return '🇨🇬';
    if (c.includes('belgique') || c.includes('belgium')) return '🇧🇪';
    if (c.includes('canada')) return '🇨🇦';
    if (c.includes('suisse') || c.includes('switzerland')) return '🇨🇭';
    if (c.includes('états-unis') || c.includes('usa') || c.includes('united states')) return '🇺🇸';
    return '🇧🇯';
  }, [countryName]);

  // Boutons de navigation verticale du profil (strictement 4 icônes visibles) :
  // 1. Parcours de vie (ParcoursDeVieIcon)
  // 2. Initiative personnelle (ProjetsIcon)
  // 3. Messagerie (MessageSquare) -> ouvre directement la messagerie
  // 4. Partage (ShareIcon)
  const profileCategoryActionButtons = useMemo(() => (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      {/* 1. Parcours de vie */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setActiveCategory('parcours');
        }}
        className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
          normalizedCategory === 'parcours'
            ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_12px_rgba(162,72,43,0.6)]'
            : 'bg-black/70 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white/90'
        }`}
        title="Parcours de vie"
        aria-label="Parcours de vie"
      >
        <ParcoursDeVieIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={1.75} />
      </button>

      {/* Catégorie masquée : Produits et services (conservée dans le code sans affichage) */}
      {SHOW_HIDDEN_PROFILE_CATEGORIES && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveCategory('produits');
          }}
          className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
            activeCategory === 'produits' || activeCategory === 'offre' || activeCategory === 'production'
              ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_12px_rgba(162,72,43,0.6)]'
              : 'bg-black/70 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white/90'
          }`}
          title="Produits et services"
          aria-label="Produits et services"
        >
          <ProduitsServicesIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={1.75} />
        </button>
      )}

      {/* 2. Initiative personnelle (anciennement Projets & initiatives) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setActiveCategory('projets');
        }}
        className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
          normalizedCategory === 'projets'
            ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_12px_rgba(162,72,43,0.6)]'
            : 'bg-black/70 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white/90'
        }`}
        title="Initiative personnelle"
        aria-label="Initiative personnelle"
      >
        <ProjetsIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={1.75} />
      </button>

      {/* Catégorie masquée : Besoins (conservée dans le code sans affichage) */}
      {SHOW_HIDDEN_PROFILE_CATEGORIES && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveCategory('besoins');
          }}
          className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
            activeCategory === 'besoins' || activeCategory === 'appel'
              ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_12px_rgba(162,72,43,0.6)]'
              : 'bg-black/70 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white/90'
          }`}
          title="Besoins exprimés"
          aria-label="Besoins exprimés"
        >
          <BesoinsHandsIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={1.75} />
        </button>
      )}

      {/* 3. Messagerie (ouvre directement la messagerie) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate({ type: 'messaging' });
        }}
        className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 bg-black/70 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white/90"
        title="Messagerie"
        aria-label="Messagerie"
      >
        <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
      </button>

      {/* 4 (Propriétaire uniquement). Mon Studio */}
      {isOwner && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate({ type: 'settings', returnTo: 'profile' });
          }}
          className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 bg-black/70 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white/90"
          title="Mon Studio"
          aria-label="Mon Studio"
        >
          <DirectorChairIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" isActive={true} />
        </button>
      )}

      {/* 5 (4 en mode visiteur). Partage */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleShareVideo();
        }}
        className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 bg-black/70 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white/90"
        title="Partager"
        aria-label="Partager"
      >
        <ShareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
      </button>
    </div>
  ), [activeCategory, normalizedCategory, isOwner, onNavigate]);

  // Partager la page entière du portrait (ouvre la modale des réseaux sociaux + copie de lien)
  const handleShareProfile = () => {
    setShareContentType('profile');
    setIsShareModalOpen(true);
  };

  // Partager la vidéo spécifique actuellement affichée
  const handleShareVideo = () => {
    setIsVideoCardShareModalOpen(true);
  };

  // Question existentielle à laquelle répond la personne dans la vidéo
  const getQuestionText = () => {
    if (targetProtagonist) {
      if (targetProtagonist.stories && targetProtagonist.stories.length > 0) {
        const story = targetProtagonist.stories[0];
        if (story.questionTitle) return story.questionTitle;
        if (story.title) return story.title;
      }
      if (targetProtagonist.documentaryId) {
        const canonicalDocId = resolveCanonicalSeriesId(targetProtagonist.documentaryId) || targetProtagonist.documentaryId;
        const doc = DOCUMENTARIES.find(d => d.id === canonicalDocId || d.id === targetProtagonist.documentaryId);
        if (doc?.centralQuestion) return doc.centralQuestion;
        if (doc?.questions && doc.questions.length > 0) return doc.questions[0].prompt;
      }
    }
    return "Qu’est-ce qui, un jour, vous a fait sentir que quelque chose de plus grand que vous était présent ?";
  };

  const getBadgeTitleForItem = (item: VideoSimulationItem) => {
    const stripFinancialText = (text?: string) => {
      if (!text) return undefined;
      if (/(€|%\s*financé|récoltés|contributeur|\bparts?\b|\binvestir\b|\brevenus?\b|\brendement\b|\bprix\b)/i.test(text)) {
        return undefined;
      }
      return text;
    };

    let badgeTitle = stripFinancialText(item.tag) || item.title || 'Origines & Mémoire';

    if (normalizedCategory === 'parcours') {
      badgeTitle = stripFinancialText(item.tag) || item.title || 'Retour au pays';
    } else if (normalizedCategory === 'projets') {
      const titleLower = item.title.toLowerCase();
      badgeTitle = titleLower.includes('atelier')
        ? 'L’Atelier créatif'
        : titleLower.includes('résidence')
        ? 'Résidence lagune'
        : titleLower.includes('passeurs')
        ? 'Passeurs d’avenir'
        : titleLower.includes('mémoires')
        ? 'Mémoires vivantes'
        : item.title.split(/[:–—]/)[0].trim();
    }
    return badgeTitle;
  };

  return (
    <div className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between text-[#1C1917] select-none bg-white">
      {/* TOAST SUCCÈS */}
      {shareToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4 py-2.5 rounded-2xl bg-[#1C1917] text-white text-xs font-semibold flex items-center gap-2 shadow-xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{shareToast}</span>
        </div>
      )}

      <div className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-6 min-h-0 overflow-hidden flex flex-col justify-between pt-1 sm:pt-2">

        {totalItemsInActiveCategory === 0 || !currentSimulationItem ? (
          <div className="flex-1 flex items-center justify-center min-h-0 py-1">
            <div className="aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-[#151513] text-white border border-stone-200/40 relative flex flex-col justify-between p-4 sm:p-5 text-center my-auto">
              <div className="my-auto flex flex-col items-center justify-center space-y-3 px-2">
                <div className="w-12 h-12 rounded-full bg-[#A2482B]/20 text-[#A2482B] flex items-center justify-center border border-[#A2482B]/40">
                  <Video className="w-6 h-6 text-[#A2482B]" />
                </div>
                <h3 className="font-editorial text-sm sm:text-base font-bold text-white">
                  Aucune vidéo pour le moment
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-300 leading-relaxed max-w-[210px]">
                  {isOwner
                    ? "Déposez votre premier récit depuis le Studio ou Mon Studio."
                    : "Ce profil n'a pas encore publié de vidéo dans cette catégorie."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <StageCarousel3D
            items={activeCategoryItems}
            currentIndex={currentCategorySafeIndex}
            onIndexChange={handleSelectCategoryIndex}
            getKey={(item) => item.id}
            circular={activeCategoryItems.length >= 3}
            dragDisabled={isShareModalOpen || isVideoCardShareModalOpen || isInviteModalOpen}
            showDesktopArrows={SHOW_CAROUSEL_ARROWS}
            prevAriaLabel="Vidéo précédente"
            nextAriaLabel="Vidéo suivante"
            onActiveCardClick={() => toggleVideoPlayback()}
            renderCard={(item, _idx, { isCenter }) => {
              const isThisPlaying = isCenter && isPlaying;
              return (
                <div
                  className="group relative w-full h-full flex flex-col justify-between text-white cursor-pointer"
                  id={`card-video-${item.id}`}
                >
                  {isThisPlaying ? (
                    <video
                      ref={videoRef}
                      key={`profile-video-${item.id}`}
                      src={item.videoUrl}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      onTimeUpdate={(e) => {
                        const v = e.currentTarget;
                        if (v.duration && v.duration > 0) {
                          setVideoProgress((v.currentTime / v.duration) * 100);
                        }
                      }}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      loading={isCenter ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

                  <UnifiedVideoCardOverlay
                    titleBadge={getBadgeTitleForItem(item)}
                    topLeftSlot={
                      <div className="inline-flex w-fit max-w-full min-w-0 items-center rounded-full px-2.5 py-1 bg-black/75 border border-white/20 shadow-md">
                        <span
                          className="font-editorial text-[8.5px] sm:text-[9.5px] md:text-[10.5px] font-semibold text-white leading-tight tracking-wide select-none truncate"
                          title={formatFirstLetterOnly(getBadgeTitleForItem(item))}
                        >
                          {formatFirstLetterOnly(getBadgeTitleForItem(item))}
                        </span>
                      </div>
                    }
                    displayName={profileDisplayName || 'Roméo'}
                    videoProgress={isCenter ? videoProgress : 0}
                    isPlaying={isThisPlaying}
                    onTogglePlay={isCenter ? toggleVideoPlayback : () => {}}
                    isMuted={isMuted}
                    onToggleMute={isCenter ? toggleMute : () => {}}
                    questionText={getQuestionText()}
                    factText={item.description}
                    onShare={isCenter ? handleShareProfile : undefined}
                    onReportVideo={
                      isCenter
                        ? () => {
                            setShareToast("Vidéo signalée à la modération.");
                            setTimeout(() => setShareToast(null), 2500);
                          }
                        : undefined
                    }
                    onBlockVideo={
                      isCenter
                        ? () => {
                            setShareToast("Cette vidéo a été masquée.");
                            setTimeout(() => setShareToast(null), 2500);
                          }
                        : undefined
                    }
                    customActionButtons={isCenter ? profileCategoryActionButtons : undefined}
                  />
                </div>
              );
            }}
          />
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODALE DE PARTAGE RÉSEAUX SOCIAUX (STRICTEMENT LARGEUR CARTE)             */}
      {/* ========================================================================= */}
      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white ${CARD_WIDTH_MODAL_CLASS} max-h-[calc(100dvh-48px)] overflow-y-auto no-scrollbar rounded-2xl sm:rounded-3xl p-4 shadow-2xl border border-stone-200 space-y-3.5 shrink-0`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2 min-w-0">
                <ShareIcon className="w-4 h-4 text-[#C89B3C] shrink-0" />
                <h3 className="font-editorial text-xs sm:text-sm font-bold text-[#1C1917] truncate">
                  {shareContentType === 'video' ? 'Partager la vidéo' : 'Partager le profil'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              {shareContentType === 'video' ? (
                <>
                  Partagez la vidéo <span className="font-bold text-[#1C1917]">« {currentSimulationItem?.title || 'Extrait'} »</span> de <span className="font-bold text-[#1C1917]">{profileDisplayName}</span> :
                </>
              ) : (
                <>
                  Faites rayonner le profil de <span className="font-bold text-[#1C1917]">{profileDisplayName}</span> sur vos réseaux :
                </>
              )}
            </p>

            {/* Réseaux sociaux */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  shareContentType === 'video'
                    ? `Regardez la vidéo « ${currentSimulationItem?.title || ''} » de ${profileDisplayName} sur Yonywood : ${window.location.origin}?protagonist=${protagonistId || 'romeo'}&category=${normalizedCategory}&video=${currentSimulationItem?.id || ''}`
                    : `Découvrez le profil de ${profileDisplayName} sur Yonywood : ${window.location.origin}?protagonist=${protagonistId || 'romeo'}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">W</span>
                <span>WhatsApp</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  shareContentType === 'video'
                    ? `Regardez la vidéo « ${currentSimulationItem?.title || ''} » de ${profileDisplayName}`
                    : `Découvrez le profil de ${profileDisplayName}`
                )}&url=${encodeURIComponent(
                  shareContentType === 'video'
                    ? `${window.location.origin}?protagonist=${protagonistId || 'romeo'}&category=${normalizedCategory}&video=${currentSimulationItem?.id || ''}`
                    : `${window.location.origin}?protagonist=${protagonistId || 'romeo'}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 text-xs font-bold transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">𝕏</span>
                <span>Twitter / X</span>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareContentType === 'video'
                    ? `${window.location.origin}?protagonist=${protagonistId || 'romeo'}&category=${normalizedCategory}&video=${currentSimulationItem?.id || ''}`
                    : `${window.location.origin}?protagonist=${protagonistId || 'romeo'}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">f</span>
                <span>Facebook</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  shareContentType === 'video'
                    ? `${window.location.origin}?protagonist=${protagonistId || 'romeo'}&category=${normalizedCategory}&video=${currentSimulationItem?.id || ''}`
                    : `${window.location.origin}?protagonist=${protagonistId || 'romeo'}`
                )}&text=${encodeURIComponent(
                  shareContentType === 'video'
                    ? `Regardez la vidéo « ${currentSimulationItem?.title || ''} » de ${profileDisplayName}`
                    : `Découvrez le profil de ${profileDisplayName}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-black">✈</span>
                <span>Telegram</span>
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  shareContentType === 'video'
                    ? `${window.location.origin}?protagonist=${protagonistId || 'romeo'}&category=${normalizedCategory}&video=${currentSimulationItem?.id || ''}`
                    : `${window.location.origin}?protagonist=${protagonistId || 'romeo'}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-bold transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-indigo-700 text-white flex items-center justify-center text-xs font-black">in</span>
                <span>Partager sur LinkedIn</span>
              </a>
            </div>

            {/* Bouton Copier le lien */}
            <div className="pt-1">
              <button
                onClick={() => {
                  const targetUrl = shareContentType === 'video'
                    ? `${window.location.origin}?protagonist=${protagonistId || 'romeo'}&category=${normalizedCategory}&video=${currentSimulationItem?.id || ''}`
                    : `${window.location.origin}?protagonist=${protagonistId || 'romeo'}`;
                  navigator.clipboard?.writeText(targetUrl);
                  setIsShareModalOpen(false);
                  setShareToast(
                    shareContentType === 'video'
                      ? "Lien direct de la vidéo copié dans le presse-papiers !"
                      : "Lien de la page copié dans le presse-papiers !"
                  );
                  setTimeout(() => setShareToast(null), 3000);
                }}
                className="w-full h-11 px-4 rounded-xl bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-[0.98]"
              >
                <Copy className="w-4 h-4 text-[#C89B3C]" />
                <span>
                  {shareContentType === 'video' ? 'Copier le lien direct de la vidéo' : 'Copier le lien de la page'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE D'INVITATION À L'ÉCHANGE (STRICTEMENT LARGEUR CARTE)               */}
      {/* ========================================================================= */}
      {isInviteModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
          onClick={() => setIsInviteModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white ${CARD_WIDTH_MODAL_CLASS} max-h-[calc(100dvh-48px)] overflow-y-auto no-scrollbar rounded-2xl sm:rounded-3xl p-4 shadow-2xl border border-stone-200 space-y-3 shrink-0`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-stone-200 shadow-xs bg-stone-100 shrink-0">
                  <img
                    src={userPhoto || '/assets/duos/codjo-blind.jpg'}
                    alt={profileDisplayName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-editorial text-xs sm:text-sm font-bold text-[#1C1917] truncate">
                    Inviter {profileDisplayName}
                  </h3>
                  <p className="text-[10px] text-stone-500 truncate">
                    Messagerie sur invitation
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsInviteModalOpen(false)} 
                className="p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-2.5 text-xs">
              <div>
                <label className="text-stone-800 font-semibold block mb-1 text-[11px]">
                  Motif :
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { id: 'coprod', label: 'Initiative & Projet' },
                    { id: 'savoir_faire', label: 'Savoir-faire & Métier' },
                    { id: 'collab', label: 'Collaboration artistique' },
                    { id: 'question', label: 'Question sur une œuvre' }
                  ].map((m) => {
                    const isSel = inviteMotif === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setInviteMotif(m.id as any)}
                        className={`px-2.5 py-2 rounded-xl border text-left cursor-pointer transition-all text-[11px] font-semibold ${
                          isSel
                            ? 'bg-[#A2482B] text-white border-[#A2482B]'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-stone-800 font-semibold block mb-1 text-[11px]">
                  Message :
                </label>
                <textarea
                  rows={2}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder={`Bonjour ${profileDisplayName}…`}
                  className="w-full px-2.5 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A2482B] resize-none"
                  required
                />
              </div>

              <div className="flex gap-1.5 pt-1 border-t border-stone-200">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#A2482B] hover:bg-[#8B3A20] text-white font-bold text-[11px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Envoyer</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)} 
                  className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] rounded-xl border border-stone-200/60 cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale de partage vidéo style YouTube (enregistrer dans une liste, partager, pas intéressé, signaler) */}
      <VideoCardShareModal
        isOpen={isVideoCardShareModalOpen}
        onClose={() => setIsVideoCardShareModalOpen(false)}
        videoTitle={currentSimulationItem?.title || profileDisplayName || 'cette vidéo'}
        videoId={currentSimulationItem?.id || `portrait-video-${activeCategory}-${currentCategorySafeIndex}`}
        shareUrl={
          typeof window !== 'undefined'
            ? `${window.location.origin}?protagonist=${protagonistId || 'romeo'}&category=${normalizedCategory}&video=${currentSimulationItem?.id || ''}`
            : undefined
        }
        onSaveToList={(saved) => {
          setShareToast(saved ? "Vidéo ajoutée à vos mémoires sauvegardées !" : "Vidéo retirée de votre sélection.");
          setTimeout(() => setShareToast(null), 3000);
        }}
        onBlockPerson={() => {
          setShareToast("Cette personne a été bloquée. Ses vidéos ne vous seront plus proposées.");
          setTimeout(() => setShareToast(null), 3000);
        }}
        onNotInterested={() => {
          setShareToast("Cette personne a été bloquée. Ses vidéos ne vous seront plus proposées.");
          setTimeout(() => setShareToast(null), 3000);
        }}
        onReport={() => {
          setShareToast("Signalement transmis à l'équipe de modération.");
          setTimeout(() => setShareToast(null), 3000);
        }}
      />

    </div>
  );
};
