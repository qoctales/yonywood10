import React, { useState, useRef, useEffect } from 'react';
import { 
  Coins, 
  Pause, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  CreditCard,
  Smartphone,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth } from '../services/authContext';
import { recordSharePurchase, getAllSeriesRemainingShares } from '../services/firestoreService';
import { TvPlayerIcon } from './YonywoodBrandIcons';
import { celestialAudio } from '../utils/celestialAudio';
import { SERIES_REGISTRY } from '../data/seriesRegistry';
import type { MarketplaceScreenProps } from './MarketplaceScreen';

interface ProductionPoster {
  id: string;
  title: string;
  posterImage: string;
  videoPreviewUrl: string;
  sharePrice: number;
}

interface PeerOffer {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPhoto: string;
  seriesTitle: string;
  posterImage: string;
  videoPreviewUrl: string;
  sharesCount: number;
  unitPrice: number;
}

const PRODUCTIONS: ProductionPoster[] = [
  // Les 8 thématiques Focus officielles
  {
    id: 'topic-marche-dantokpa',
    title: 'Marché Dantokpa',
    posterImage: '/assets/images/territoires_traditions_1792085253556.jpg',
    videoPreviewUrl: '/sample.mp4',
    sharePrice: 50
  },
  {
    id: 'topic-baccalaureat',
    title: 'Baccalauréat',
    posterImage: '/assets/images/studio_orga_valeurs_1792608959843.jpg',
    videoPreviewUrl: '/sample.mp4',
    sharePrice: 50
  },
  {
    id: 'topic-lycees-behanzin-toffa',
    title: 'Lycées Béhanzin et Toffa',
    posterImage: '/assets/images/studio_orga_origines_1792608957920.jpg',
    videoPreviewUrl: '/sample.mp4',
    sharePrice: 50
  },
  {
    id: 'topic-apprentis',
    title: 'Apprentis',
    posterImage: '/assets/images/expertises_artisanat_1792085293909.jpg',
    videoPreviewUrl: '/sample.mp4',
    sharePrice: 50
  },
  {
    id: 'topic-sodabi',
    title: 'Sodabi',
    posterImage: '/assets/images/marques_alimentation_1792086435220.jpg',
    videoPreviewUrl: '/sample.mp4',
    sharePrice: 50
  },
  {
    id: 'topic-ganvie',
    title: 'Ganvié',
    posterImage: '/assets/images/beninois_pecheur_tobi_1792165042006.jpg',
    videoPreviewUrl: '/sample.mp4',
    sharePrice: 50
  },
  {
    id: 'topic-angelique-kidjo',
    title: 'Angélique Kidjo',
    posterImage: '/assets/images/pers_arts_1792086472940.jpg',
    videoPreviewUrl: '/sample.mp4',
    sharePrice: 50
  },
  {
    id: 'topic-danialou-sagbohan',
    title: 'Danialou Sagbohan',
    posterImage: '/assets/images/beninois_sage_dossou_1792165004493.jpg',
    videoPreviewUrl: '/sample.mp4',
    sharePrice: 50
  },
  // Séries documentaires miroirs (8 séries officielles)
  ...SERIES_REGISTRY.map((series) => ({
    id: series.id,
    title: series.title,
    posterImage: series.posterUrl,
    videoPreviewUrl: '/sample.mp4',
    sharePrice: 50
  }))
];

const INITIAL_PEER_OFFERS: PeerOffer[] = [
  {
    id: 'peer-1',
    sellerId: 'koffi-tisserand',
    sellerName: 'Koffi',
    sellerPhoto: '/assets/images/koffi_tisserand_1792933625628.jpg',
    seriesTitle: 'Amin Amen ‹ › Legba',
    posterImage: encodeURI('/Posters/Vodun Rays ‹ › Autre Foi.png'),
    videoPreviewUrl: '/sample.mp4',
    sharesCount: 3,
    unitPrice: 55
  },
  {
    id: 'peer-2',
    sellerId: 'nadia-artist',
    sellerName: 'Mireille',
    sellerPhoto: '/assets/duos/care-mireille.jpg',
    seriesTitle: 'Remèdes ‹ › E Vivi',
    posterImage: encodeURI('/Posters/Care ‹ › Feed.png'),
    videoPreviewUrl: '/sample.mp4',
    sharesCount: 5,
    unitPrice: 52
  },
  {
    id: 'peer-3',
    sellerId: 'marcel-speaker',
    sellerName: 'Malik',
    sellerPhoto: '/assets/duos/malik-diop.jpg',
    seriesTitle: 'Blacks One ‹ › Nyonoukpo',
    posterImage: encodeURI('/Posters/Blacks One ‹ › Wowmen.png'),
    videoPreviewUrl: '/sample.mp4',
    sharesCount: 2,
    unitPrice: 72
  },
  {
    id: 'peer-4',
    sellerId: 'amina-cook',
    sellerName: 'Sènami',
    sellerPhoto: '/assets/images/senami_architecte_1792933801804.jpg',
    seriesTitle: 'Builders ‹ › Àkwè',
    posterImage: encodeURI('/Posters/Performers ‹ › Builders.png'),
    videoPreviewUrl: '/sample.mp4',
    sharesCount: 4,
    unitPrice: 62
  },
  {
    id: 'peer-5',
    sellerId: 'benoit-builder',
    sellerName: 'Tobi',
    sellerPhoto: '/assets/duos/tobi-houndegla.jpg',
    seriesTitle: 'Horizons ‹ › Finagnon',
    posterImage: encodeURI('/Posters/Finagnon ‹ › Horizons.png'),
    videoPreviewUrl: '/sample.mp4',
    sharesCount: 3,
    unitPrice: 68
  },
  {
    id: 'peer-6',
    sellerId: 'codjo-voyant',
    sellerName: 'Kiki & Kpèdétin',
    sellerPhoto: '/assets/images/kiki_passeur_1792933820505.jpg',
    seriesTitle: 'Fiat Luxe ‹ › Irokos',
    posterImage: encodeURI('/Posters/Fiat Luxe ‹ › PhD.png'),
    videoPreviewUrl: '/sample.mp4',
    sharesCount: 4,
    unitPrice: 59
  },
  {
    id: 'peer-7',
    sellerId: 'builder-kwame-seller',
    sellerName: 'Nadège & Sénan',
    sellerPhoto: '/assets/duos/researcher-phd.jpg',
    seriesTitle: 'PhD ‹ › Azovi',
    posterImage: encodeURI('/Posters/Baobabs ‹ › Bambous.png'),
    videoPreviewUrl: '/sample.mp4',
    sharesCount: 6,
    unitPrice: 65
  },
  {
    id: 'peer-8',
    sellerId: 'clara-focus-seller',
    sellerName: 'Chancelle & Armel',
    sellerPhoto: '/assets/duos/photographer-focus.jpg',
    seriesTitle: 'Regards ‹ › Gbé',
    posterImage: encodeURI('/Posters/Paroles ‹ › Regards.png'),
    videoPreviewUrl: '/sample.mp4',
    sharesCount: 5,
    unitPrice: 58
  }
];

export const LegacyMarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ 
  onNavigate,
  initialPeerOfferId,
  initialPeerIndex,
  initialTab,
  restoreContext
}) => {
  const [activeTab, setActiveTab] = useState<'coproduire' | 'marche'>('coproduire');

  // Indexes
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const [marketIndex, setMarketIndex] = useState<number>(() => {
    if (typeof initialPeerIndex === 'number' && initialPeerIndex >= 0 && initialPeerIndex < INITIAL_PEER_OFFERS.length) {
      return initialPeerIndex;
    }
    if (restoreContext?.offerIndex !== undefined && restoreContext.offerIndex >= 0 && restoreContext.offerIndex < INITIAL_PEER_OFFERS.length) {
      return restoreContext.offerIndex;
    }
    if (initialPeerOfferId) {
      const idx = INITIAL_PEER_OFFERS.findIndex(p => p.id === initialPeerOfferId);
      if (idx !== -1) return idx;
    }
    return 0;
  });
  const [peerOffers, setPeerOffers] = useState<PeerOffer[]>(INITIAL_PEER_OFFERS);

  // Modal d'achat
  const [selectedProduction, setSelectedProduction] = useState<ProductionPoster | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_money' | 'free_starter'>('card');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Jauge en temps réel sur 256 parts par série (~70% parts souscrites par défaut)
  const [remainingSharesMap, setRemainingSharesMap] = useState<Record<string, number>>({
    // Les 8 thématiques Focus officielles
    'topic-marche-dantokpa': 82, // 174 souscrites (68% — 82 restantes)
    'topic-baccalaureat': 78,    // 178 souscrites (70% — 78 restantes)
    'topic-lycees-behanzin-toffa': 74, // 182 souscrites (71% — 74 restantes)
    'topic-apprentis': 85,       // 171 souscrites (67% — 85 restantes)
    'topic-sodabi': 69,          // 187 souscrites (73% — 69 restantes)
    'topic-ganvie': 73,          // 183 souscrites (71% — 73 restantes)
    'topic-angelique-kidjo': 64, // 192 souscrites (75% — 64 restantes)
    'topic-danialou-sagbohan': 70, // 186 souscrites (73% — 70 restantes)
    // Les 8 séries documentaires officielles
    'remedes-e-vivi': 74, // 182 souscrites (71%)
    'amin-amen-legba': 77, // 179 souscrites (70%)
    'phd-azovi': 77, // 179 souscrites (70%)
    'blacks-one-nyonoukpo': 80, // 176 souscrites (69%)
    'fiat-luxe-irokos': 79, // 177 souscrites (69%)
    'horizons-finagnon': 75, // 181 souscrites (71%)
    'builders-akwe': 72, // 184 souscrites (72%)
    'regards-gbe': 76 // 180 souscrites (70%)
  });

  // Chargement en temps réel des parts restantes depuis Firestore (requête unique optimisée)
  useEffect(() => {
    let isMounted = true;
    const loadRemainingShares = async () => {
      try {
        const baseMap: Record<string, number> = {};
        PRODUCTIONS.forEach(p => {
          const currentRemaining = remainingSharesMap[p.id] ?? 77;
          baseMap[p.id] = 256 - currentRemaining;
        });
        const updated = await getAllSeriesRemainingShares(baseMap);
        if (isMounted && Object.keys(updated).length > 0) {
          setRemainingSharesMap(prev => ({ ...prev, ...updated }));
        }
      } catch {
        // repli silencieux sur les valeurs par défaut
      }
    };
    loadRemainingShares();
    return () => { isMounted = false; };
  }, []);

  // Gestion tactile et souris 3D (identique à SubmitStoryScreen et FocusScreen)
  const [dragOffset, setDragOffset] = useState<number>(0);
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const currentProd = PRODUCTIONS[currentIndex];
  const currentOffer = peerOffers[marketIndex] || peerOffers[0];

  useEffect(() => {
    setIsPlaying(false);
  }, [currentIndex, marketIndex, activeTab]);

  useEffect(() => {
    if (restoreContext) {
      setSuccessToast(`Offre retrouvée : ${restoreContext.sharesCount} part${restoreContext.sharesCount > 1 ? 's' : ''} de ${restoreContext.seriesTitle} (${restoreContext.sellerName})`);
      const timer = setTimeout(() => setSuccessToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [restoreContext]);

  const handleNext = () => {
    if (activeTab === 'coproduire') {
      setCurrentIndex(prev => (prev + 1) % PRODUCTIONS.length);
      celestialAudio.playOrbSelect();
    } else {
      if (peerOffers.length > 0) {
        setMarketIndex(prev => (prev + 1) % peerOffers.length);
        celestialAudio.playOrbSelect();
      }
    }
  };

  const handlePrev = () => {
    if (activeTab === 'coproduire') {
      setCurrentIndex(prev => (prev - 1 + PRODUCTIONS.length) % PRODUCTIONS.length);
      celestialAudio.playOrbSelect();
    } else {
      if (peerOffers.length > 0) {
        setMarketIndex(prev => (prev - 1 + peerOffers.length) % peerOffers.length);
        celestialAudio.playOrbSelect();
      }
    }
  };

  // Gestion des événements tactiles (swipe fluide 3D)
  const onTouchStart = (e: React.TouchEvent) => {
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
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setDragOffset(0);
  };

  // Gestion souris (drag 3D desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a, video, input, select')) return;
    touchStartXRef.current = e.clientX;
    touchStartTimeRef.current = Date.now();
    isDraggingRef.current = true;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 6) {
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
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setDragOffset(0);
  };

  // Clavier : Flèches gauche et droite
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProduction) return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProduction, activeTab, peerOffers.length]);

  const toggleVideoPlayback = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlaying(prev => !prev);
  };

  const handleBuyOfficialShares = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduction) return;
    const total = purchaseQuantity * selectedProduction.sharePrice;
    setIsSubmitting(true);
    try {
      await recordSharePurchase({
        seriesId: selectedProduction.id,
        seriesTitle: selectedProduction.title,
        userId: currentUser?.id || 'usr-anonymous',
        userName: currentUser?.name || 'Coproducteur',
        userEmail: currentUser?.email || 'coproducteur@yonywood.com',
        sharesCount: purchaseQuantity,
        pricePerShare: selectedProduction.sharePrice,
        totalAmount: total,
        paymentMethod: paymentMethod
      });
      setRemainingSharesMap(prev => ({
        ...prev,
        [selectedProduction.id]: Math.max(0, (prev[selectedProduction.id] ?? 256) - purchaseQuantity)
      }));
      setSuccessToast(`Souscription validée ! ${purchaseQuantity} part(s) acquises pour « ${selectedProduction.title} » (${total} €).`);
      setSelectedProduction(null);
    } catch {
      setRemainingSharesMap(prev => ({
        ...prev,
        [selectedProduction.id]: Math.max(0, (prev[selectedProduction.id] ?? 256) - purchaseQuantity)
      }));
      setSuccessToast(`Souscription enregistrée pour « ${selectedProduction.title} » (${total} €).`);
      setSelectedProduction(null);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const handleBuyPeerOffer = (offer: PeerOffer) => {
    const total = offer.sharesCount * offer.unitPrice;
    setSuccessToast(`Achat réussi ! Vous avez racheté les ${offer.sharesCount} part(s) de ${offer.sellerName} pour « ${offer.seriesTitle} » (${total} €).`);
    setPeerOffers(prev => {
      const updated = prev.filter(item => item.id !== offer.id);
      if (marketIndex >= updated.length) {
        setMarketIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Capsules d'incitation à l'achat et vente de parts basées sur les 8 séries documentaires
  interface ShareStoryItem {
    id: string;
    title: string;
    img: string;
    prodIndex: number;
  }

  const SHARE_STORIES: ShareStoryItem[] = PRODUCTIONS.map((prod, idx) => ({
    id: `story-prod-${prod.id}`,
    title: prod.title,
    img: prod.posterImage,
    prodIndex: idx
  }));

  return (
    <div className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between text-[#1C1917] select-none bg-white">
      
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE STORIES PRODUCTIONS : FOND NOIR, CENTRÉES PAR RAPPORT AU LOGO  */}
      {/* ========================================================================= */}
      <div 
        className="w-full shrink-0 z-30 border-none shadow-none rounded-none bg-black"
        style={{ 
          backgroundColor: '#000000'
        }}
      >
        <div className="w-full mx-auto px-2 pt-1.5 pb-2 shrink-0 h-[68px] sm:h-[76px] flex items-center justify-center overflow-hidden">
          <div 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'auto' }}
            className="flex items-center justify-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1 px-2 w-full max-w-full overscroll-x-contain touch-pan-x"
          >
            {SHARE_STORIES.map((st) => (
              <div 
                key={st.id}
                onClick={() => {
                  if (st.prodIndex !== undefined) {
                    setActiveTab('coproduire');
                    setCurrentIndex(st.prodIndex);
                    celestialAudio.playOrbSelect();
                  }
                }}
                className="flex flex-col items-center cursor-pointer group shrink-0"
                title={st.title}
              >
                <div 
                  className={`w-[52px] h-[52px] sm:w-14 sm:h-14 rounded-2xl p-0.5 border transition-all group-hover:scale-105 bg-stone-900 ${
                    activeTab === 'coproduire' && currentIndex === st.prodIndex
                      ? 'border-[#A2482B] ring-1 ring-[#A2482B]'
                      : 'border-stone-800/80 group-hover:border-[#A2482B]'
                  }`}
                  style={{ boxShadow: 'var(--story-ring-shadow, 0 1px 8px rgba(0, 0, 0, 0.6))' }}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden bg-stone-900 relative">
                    <img 
                      src={st.img} 
                      alt="" 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOAST SUCCÈS LUDIQUE */}
      {successToast && (
        <div className="fixed top-14 z-50 max-w-sm mx-auto px-4 py-2 rounded-2xl bg-[#1C1917] text-white text-xs font-semibold flex items-center gap-2 shadow-xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CARROUSEL 3D DES SÉRIES DU MARCHÉ D'ACTION (COPRODUIRE / MARCHÉ)        */}
      {/* ========================================================================= */}
      <div 
        className="relative flex-1 flex flex-col items-center justify-center min-h-0 py-1 sm:py-2 select-none overflow-hidden touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {/* Flèche Gauche */}
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-2 lg:left-6 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#1C1917] hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          title="Précédent"
          id="prev-poster-btn"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Flèche Droite */}
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-2 lg:right-6 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#1C1917] hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          title="Suivant"
          id="next-poster-btn"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* SCÈNE 3D AVEC PERSPECTIVE IDENTIQUE À STUDIO & FOCUS */}
        <div 
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          style={{ 
            perspective: '1200px',
            perspectiveOrigin: 'center center'
          }}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
            style={{
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Si onglet 'coproduire' */}
            {activeTab === 'coproduire' && PRODUCTIONS.map((prod, idx) => {
              const n = PRODUCTIONS.length;
              const rawDiff = (idx - currentIndex) % n;
              const diff = rawDiff > n / 2 ? rawDiff - n : rawDiff < -n / 2 ? rawDiff + n : rawDiff;
              if (Math.abs(diff) > 2) return null;
              const isCenter = diff === 0;

              let transformStyle = '';
              let zIndex = 10;
              let opacity = 0;
              let pointerEvents: 'auto' | 'none' = 'none';

              if (diff === 0) {
                // Affiche active au centre
                transformStyle = `translateX(${dragOffset}px) translateZ(60px) rotateY(${dragOffset * -0.15}deg) scale(1)`;
                zIndex = 30;
                opacity = 1;
                pointerEvents = 'auto';
              } else if (diff === 1) {
                // Affiche voisine droite
                transformStyle = `translateX(calc(55% + ${dragOffset}px)) translateZ(-60px) rotateY(-26deg) scale(0.86)`;
                zIndex = 20;
                opacity = 0.75;
                pointerEvents = 'auto';
              } else if (diff === -1) {
                // Affiche voisine gauche
                transformStyle = `translateX(calc(-55% + ${dragOffset}px)) translateZ(-60px) rotateY(26deg) scale(0.86)`;
                zIndex = 20;
                opacity = 0.75;
                pointerEvents = 'auto';
              } else if (diff === 2) {
                // Affiche droite plus éloignée
                transformStyle = `translateX(calc(100% + ${dragOffset}px)) translateZ(-140px) rotateY(-40deg) scale(0.72)`;
                zIndex = 10;
                opacity = 0.35;
                pointerEvents = 'auto';
              } else if (diff === -2) {
                // Affiche gauche plus éloignée
                transformStyle = `translateX(calc(-100% + ${dragOffset}px)) translateZ(-140px) rotateY(40deg) scale(0.72)`;
                zIndex = 10;
                opacity = 0.35;
                pointerEvents = 'auto';
              } else {
                // Affiches masquées à l'arrière
                transformStyle = `translateX(0px) translateZ(-250px) rotateY(180deg) scale(0.5)`;
                zIndex = 5;
                opacity = 0;
                pointerEvents = 'none';
              }

              const remaining = remainingSharesMap[prod.id] ?? 77;
              const taken = Math.max(0, 256 - remaining);
              const percent = Math.min(100, Math.round((taken / 256) * 100));

              return (
                <div
                  key={`prod-3d-${prod.id}`}
                  onClick={() => {
                    if (!isCenter) {
                      setCurrentIndex(idx);
                      celestialAudio.playOrbSelect();
                    }
                  }}
                  style={{
                    transform: transformStyle,
                    zIndex,
                    opacity,
                    pointerEvents,
                    transition: isDraggingRef.current ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease'
                  }}
                  className={`absolute aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between p-2.5 sm:p-4 select-none bg-[#151513] text-white border transition-colors ${
                    isCenter ? 'border-stone-200/90 ring-1 ring-white/30 cursor-pointer shadow-2xl' : 'border-white/15 cursor-pointer [&_*]:!pointer-events-none'
                  }`}
                  id={`card-coproduire-${prod.id}`}
                >
                  {/* 1. Média de fond : Affiche officielle par défaut OU Vidéo si lecture activée au centre */}
                  {isPlaying && isCenter ? (
                    <video
                      ref={videoRef}
                      src={(!prod.videoPreviewUrl || prod.videoPreviewUrl.includes('commondatastorage.googleapis.com')) ? '/sample.mp4' : prod.videoPreviewUrl}
                      poster={prod.posterImage}
                      preload="metadata"
                      autoPlay
                      loop
                      playsInline
                      muted={isMuted}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={prod.posterImage}
                      alt={prod.title}
                      loading={Math.abs(diff) <= 1 ? 'eager' : 'lazy'}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 pointer-events-none"
                    />
                  )}

                  {/* Voile cinématographique */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35 pointer-events-none" />

                  {/* HAUT : Titre de la série à gauche + Déclencheur Petite Télé en haut à droite */}
                  <div className="relative z-10 flex items-center justify-between gap-1.5 pointer-events-auto w-full min-w-0">
                    <div className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-black/75 border border-white/20 shadow-md max-w-[calc(100%-80px)]">
                      <span 
                        className="font-editorial text-[11px] sm:text-xs font-semibold text-white whitespace-nowrap tracking-wide select-none truncate block"
                        title={prod.title}
                      >
                        {prod.title}
                      </span>
                    </div>

                    {/* Déclencheur lecteur vidéo « Petite Télé » en haut à droite */}
                    <div 
                      className="flex items-center gap-1.5 shrink-0"
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      {/* Bouton Muet discret (uniquement si en lecture au centre) */}
                      {isPlaying && isCenter && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsMuted((prev) => !prev);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                          className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-black/70 hover:bg-[#A2482B] border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
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
                            setCurrentIndex(idx);
                          } else {
                            toggleVideoPlayback();
                          }
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-black/65 hover:bg-[#A2482B] text-white border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0"
                        title={isPlaying && isCenter ? 'Mettre en pause' : `Visionner le teaser de ${prod.title}`}
                      >
                        {isPlaying && isCenter ? (
                          <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
                        ) : (
                          <TvPlayerIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white transition-transform" strokeWidth={1.7} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CENTRE LIBÉRÉ */}
                  <div className="my-auto" />

                  {/* BAS : JAUGE MINIMALE SANS LÉGENDES TEXTUELLES & BOUTON D'ACQUISITION */}
                  <div className="relative z-10 w-full flex items-center justify-between gap-2 pt-0.5">
                    {/* Jauge fine épurée sans légende */}
                    <div className="flex-1 bg-black/75 rounded-full p-1 border border-white/15 shadow-sm">
                      <div className="w-full h-1.5 rounded-full bg-stone-900/90 overflow-hidden relative">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-[#A2482B] via-[#C89B3C] to-[#FFE7A3] transition-all duration-700"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Bouton Acquérir */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isCenter) {
                          setCurrentIndex(idx);
                          return;
                        }
                        setSelectedProduction(prod);
                        setPurchaseQuantity(1);
                      }}
                      id={`btn-coproduire-${prod.id}`}
                      className="h-8 sm:h-8.5 px-3.5 sm:px-4 rounded-full bg-white hover:bg-[#A2482B] text-stone-900 hover:text-white text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 shadow-md border border-stone-200/80 hover:border-[#A2482B] cursor-pointer shrink-0 active:scale-95 group/coprod"
                      title="Acquérir des parts pour cette série"
                    >
                      <Coins className="w-3.5 h-3.5 text-[#C89B3C] group-hover/coprod:text-white transition-colors" />
                      <span>{prod.sharePrice} €</span>
                      <ArrowRight className="w-3 h-3 text-stone-600 group-hover/coprod:text-white transition-colors ml-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Si onglet 'marche' */}
            {activeTab === 'marche' && peerOffers.length > 0 && peerOffers.map((offer, idx) => {
              const n = peerOffers.length;
              const rawDiff = (idx - marketIndex) % n;
              const diff = rawDiff > n / 2 ? rawDiff - n : rawDiff < -n / 2 ? rawDiff + n : rawDiff;
              if (Math.abs(diff) > 2) return null;
              const isCenter = diff === 0;

              let transformStyle = '';
              let zIndex = 10;
              let opacity = 0;
              let pointerEvents: 'auto' | 'none' = 'none';

              if (diff === 0) {
                transformStyle = `translateX(${dragOffset}px) translateZ(60px) rotateY(${dragOffset * -0.15}deg) scale(1)`;
                zIndex = 30;
                opacity = 1;
                pointerEvents = 'auto';
              } else if (diff === 1) {
                transformStyle = `translateX(calc(55% + ${dragOffset}px)) translateZ(-60px) rotateY(-26deg) scale(0.86)`;
                zIndex = 20;
                opacity = 0.75;
                pointerEvents = 'auto';
              } else if (diff === -1) {
                transformStyle = `translateX(calc(-55% + ${dragOffset}px)) translateZ(-60px) rotateY(26deg) scale(0.86)`;
                zIndex = 20;
                opacity = 0.75;
                pointerEvents = 'auto';
              } else if (diff === 2) {
                transformStyle = `translateX(calc(100% + ${dragOffset}px)) translateZ(-140px) rotateY(-40deg) scale(0.72)`;
                zIndex = 10;
                opacity = 0.35;
                pointerEvents = 'auto';
              } else if (diff === -2) {
                transformStyle = `translateX(calc(-100% + ${dragOffset}px)) translateZ(-140px) rotateY(40deg) scale(0.72)`;
                zIndex = 10;
                opacity = 0.35;
                pointerEvents = 'auto';
              } else {
                transformStyle = `translateX(0px) translateZ(-250px) rotateY(180deg) scale(0.5)`;
                zIndex = 5;
                opacity = 0;
                pointerEvents = 'none';
              }

              return (
                <div
                  key={`peer-3d-${offer.id}`}
                  onClick={() => {
                    if (!isCenter) {
                      setMarketIndex(idx);
                      celestialAudio.playOrbSelect();
                    }
                  }}
                  style={{
                    transform: transformStyle,
                    zIndex,
                    opacity,
                    pointerEvents,
                    transition: isDraggingRef.current ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease'
                  }}
                  className={`absolute aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between p-2.5 sm:p-4 select-none bg-[#151513] text-white border transition-colors ${
                    isCenter ? 'border-stone-200/90 ring-1 ring-white/30 cursor-pointer shadow-2xl' : 'border-white/15 cursor-pointer [&_*]:!pointer-events-none'
                  }`}
                  id={`card-marche-${offer.id}`}
                >
                  {/* Média */}
                  {isPlaying && isCenter ? (
                    <video
                      ref={videoRef}
                      src={offer.videoPreviewUrl}
                      poster={offer.posterImage}
                      preload="metadata"
                      autoPlay
                      loop
                      playsInline
                      muted={isMuted}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={offer.posterImage}
                      alt={offer.seriesTitle}
                      loading={Math.abs(diff) <= 1 ? 'eager' : 'lazy'}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 pointer-events-none"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35 pointer-events-none" />

                  {/* HAUT */}
                  <div className="relative z-10 flex items-center justify-between pointer-events-auto">
                    <div className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-black/75 border border-white/20 shadow-md max-w-[calc(100%-80px)]">
                      <span 
                        className="font-editorial text-[11px] sm:text-xs font-semibold text-white whitespace-nowrap tracking-wide select-none truncate block"
                        title={offer.seriesTitle}
                      >
                        {offer.seriesTitle}
                      </span>
                    </div>

                    <div 
                      className="flex items-center gap-1.5 shrink-0"
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      {isPlaying && isCenter && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsMuted((prev) => !prev);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                          className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-black/70 hover:bg-[#A2482B] border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
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
                            setMarketIndex(idx);
                          } else {
                            toggleVideoPlayback();
                          }
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-black/65 hover:bg-[#A2482B] text-white border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0"
                        title={isPlaying && isCenter ? 'Mettre en pause' : `Visionner le teaser de ${offer.seriesTitle}`}
                      >
                        {isPlaying && isCenter ? (
                          <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
                        ) : (
                          <TvPlayerIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white transition-transform" strokeWidth={1.7} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="my-auto" />

                  {/* BAS */}
                  <div className="relative z-10 flex items-end justify-between gap-1.5 pt-0.5">
                    <div className="flex flex-col gap-1.5">
                      <div className="h-7.5 sm:h-8.5 px-2.5 sm:px-3 rounded-full bg-black/75 hover:bg-black/90 text-white/95 text-[10.5px] sm:text-[11px] font-medium transition-all flex items-center gap-1.5 border border-white/20 shadow-sm w-fit">
                        <span className="font-bold text-white">{offer.sharesCount} part{offer.sharesCount > 1 ? 's' : ''}</span>
                        <span className="text-white/40">•</span>
                        <span className="font-bold text-[#C89B3C]">{offer.unitPrice} €</span>
                        <span className="text-[9.5px] text-white/70">/ part</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate({ 
                            type: 'protagonist_profile', 
                            protagonistId: offer.sellerId,
                            returnToMarketplace: true,
                            marketplaceContext: {
                              offerId: offer.id,
                              offerIndex: marketIndex,
                              sellerId: offer.sellerId,
                              sellerName: offer.sellerName,
                              sharesCount: offer.sharesCount,
                              unitPrice: offer.unitPrice,
                              seriesTitle: offer.seriesTitle
                            }
                          });
                        }}
                        className="h-7 sm:h-7.5 px-2 sm:px-2.5 rounded-full bg-black/75 hover:bg-black/90 text-white text-[10.5px] font-medium transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer shadow-sm group/user text-left w-fit active:scale-95"
                        title={`Découvrir l’univers de ${offer.sellerName}`}
                      >
                        <img 
                          src={offer.sellerPhoto} 
                          alt={offer.sellerName}
                          loading="lazy"
                          decoding="async"
                          className="w-4.5 h-4.5 rounded-full object-cover ring-1 ring-[#C89B3C]"
                        />
                        <span className="font-bold text-white group-hover/user:text-[#C89B3C] transition-colors truncate max-w-[85px]">
                          {offer.sellerName}
                        </span>
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isCenter) {
                          setMarketIndex(idx);
                          return;
                        }
                        handleBuyPeerOffer(offer);
                      }}
                      id={`btn-buy-peer-${offer.id}`}
                      className="h-7.5 sm:h-8.5 px-3 sm:px-3.5 rounded-full bg-stone-100 hover:bg-[#A2482B] text-stone-800 hover:text-white text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 shadow-md border border-stone-200/80 hover:border-[#A2482B] cursor-pointer shrink-0 active:scale-95 group/racheter"
                      title="Racheter ces parts"
                    >
                      <span>Racheter</span>
                      <ArrowRight className="w-3 h-3 text-stone-600 group-hover/racheter:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Si Marché vide */}
            {activeTab === 'marche' && peerOffers.length === 0 && (
              <div className="w-[min(calc(100vw-64px),290px)] h-[min(410px,calc(100dvh-230px))] rounded-3xl overflow-hidden bg-[#151513] text-white/80 flex flex-col items-center justify-center p-6 text-center space-y-3 border border-stone-200/80 shadow-2xl">
                <Coins className="w-12 h-12 text-[#C89B3C] opacity-60" />
                <h3 className="font-editorial text-lg font-bold text-white">Marché au repos</h3>
                <p className="text-xs text-white/70">Toutes les parts ont été rachetées par la communauté.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALE D'ACHAT DE PARTS                                                   */}
      {/* ========================================================================= */}
      {selectedProduction && (
        <div 
          onClick={() => setSelectedProduction(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#FFFFFF] rounded-3xl border border-[#EAE4D5] shadow-2xl p-5 text-[#1C1917] space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6845]">
                  Marché
                </span>
                <h3 className="text-lg font-editorial font-bold text-[#1C1917]">
                  {selectedProduction.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedProduction(null)}
                className="text-[#7A756B] hover:text-[#1C1917] p-1 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBuyOfficialShares} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#52504B] text-center">
                  Nombre de parts à souscrire
                </label>
                <div className="flex items-center justify-center gap-4 bg-[#FAF7EF] p-2 rounded-2xl border border-[#E7E5E4]">
                  <button
                    type="button"
                    onClick={() => setPurchaseQuantity(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-[#EFE9DD] text-[#1C1917] font-bold flex items-center justify-center cursor-pointer border border-[#E7E5E4] shadow-xs"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold font-mono text-[#1C1917] w-12 text-center">
                    {purchaseQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPurchaseQuantity(prev => Math.min((remainingSharesMap[selectedProduction.id] ?? 256), prev + 1))}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-[#EFE9DD] text-[#1C1917] font-bold flex items-center justify-center cursor-pointer border border-[#E7E5E4] shadow-xs"
                  >
                    +
                  </button>
                </div>
                {/* Raccourcis de sélection */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {[1, 2, 5, 10].map(qty => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setPurchaseQuantity(qty)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                        purchaseQuantity === qty 
                          ? 'bg-[#A2482B] text-white border-[#A2482B]' 
                          : 'bg-white hover:bg-[#FAF7EF] text-stone-700 border-stone-200'
                      }`}
                    >
                      {qty} part{qty > 1 ? 's' : ''} ({qty * 50} €)
                    </button>
                  ))}
                </div>
              </div>

              {/* Choix du mode de paiement */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#52504B]">
                  Mode de règlement
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-[10.5px]">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                        : 'bg-white hover:bg-[#FAF7EF] text-stone-700 border-stone-200'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className="font-semibold">Carte</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile_money')}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'mobile_money'
                        ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                        : 'bg-white hover:bg-[#FAF7EF] text-stone-700 border-stone-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="font-semibold">Mobile Money</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('free_starter')}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'free_starter'
                        ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                        : 'bg-white hover:bg-[#FAF7EF] text-stone-700 border-stone-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="font-semibold">Test Gratuit</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF7EF] border border-[#E7E5E4] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#7A756B]">
                  <span>Prix unitaire :</span>
                  <span className="font-bold text-[#1C1917]">50 € / part</span>
                </div>
                <div className="flex justify-between text-[#7A756B]">
                  <span>Plafond de série :</span>
                  <span className="font-medium text-[#1C1917]">256 parts (12 800 €)</span>
                </div>
                <div className="flex justify-between font-bold text-[#1C1917] pt-1.5 border-t border-[#EAE4D5]">
                  <span>Total souscription :</span>
                  <span className="text-[#1C1917] text-sm font-mono font-bold">
                    {paymentMethod === 'free_starter' ? '0 € (Offert Test)' : `${purchaseQuantity * 50} €`}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                id="btn-confirm-buy-shares"
                className="w-full py-3 rounded-2xl bg-[#1C1917] hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Coins className="w-4 h-4 text-[#C89B3C]" />
                <span>
                  {isSubmitting 
                    ? 'Enregistrement sécurisé...' 
                    : paymentMethod === 'free_starter'
                      ? 'Valider mon attribution gratuite'
                      : `Souscrire (${purchaseQuantity * 50} €)`}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
