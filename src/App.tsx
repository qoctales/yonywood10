import React, { useState, useEffect, Suspense } from 'react';
import { ViewScreen } from './types';
import { DOCUMENTARIES } from './data/mockData';
import { BottomMenu } from './components/BottomMenu';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ChunkErrorBoundary } from './components/ChunkErrorBoundary';
import { lazyWithRetry } from './utils/lazyWithRetry';
import { SHOW_FINANCIAL_SCREENS, SHOW_PORTRAIT_IN_BAR } from './config/flags';
import {
  normalizeSelectedSeriesList,
  migratePersistedScreenSeriesId
} from './data/legacySeriesIds';
import { io } from 'socket.io-client';

const loadMatrixExplorer = () => import('./components/MatrixExplorer').then(m => ({ default: m.MatrixExplorer }));
const loadDocumentariesListScreen = () => import('./components/DocumentariesListScreen').then(m => ({ default: m.DocumentariesListScreen }));
const loadDocumentaryDetailScreen = () => import('./components/DocumentaryDetailScreen').then(m => ({ default: m.DocumentaryDetailScreen }));
const loadDuoFeedScreen = () => import('./components/DuoFeedScreen').then(m => ({ default: m.DuoFeedScreen }));
const loadVideoPlayerScreen = () => import('./components/VideoPlayerScreen').then(m => ({ default: m.VideoPlayerScreen }));
const loadTransmissionScreen = () => import('./components/TransmissionScreen').then(m => ({ default: m.TransmissionScreen }));
const loadMyForestScreen = () => import('./components/MyForestScreen').then(m => ({ default: m.MyForestScreen }));
const loadProfileSettingsScreen = () => import('./components/ProfileSettingsScreen').then(m => ({ default: m.ProfileSettingsScreen }));
const loadSettingsScreen = () => import('./components/SettingsScreen').then(m => ({ default: m.SettingsScreen }));
const loadPortfolioScreen = () => import('./components/PortfolioScreen').then(m => ({ default: m.PortfolioScreen }));
const loadTransactionsScreen = () => import('./components/TransactionsScreen').then(m => ({ default: m.TransactionsScreen }));
const loadMessagingScreen = () => import('./components/MessagingScreen').then(m => ({ default: m.MessagingScreen }));
const loadMarketplaceScreen = () => import('./components/MarketplaceScreen').then(m => ({ default: m.MarketplaceScreen }));
const loadSubmitStoryScreen = () => import('./components/SubmitStoryScreen').then(m => ({ default: m.SubmitStoryScreen }));
const loadRequestVideographerScreen = () => import('./components/RequestVideographerScreen').then(m => ({ default: m.RequestVideographerScreen }));
const loadReviewSystemScreen = () => import('./components/ReviewSystemScreen').then(m => ({ default: m.ReviewSystemScreen }));
const loadEditorialBackOfficeScreen = () => import('./components/EditorialBackOfficeScreen').then(m => ({ default: m.EditorialBackOfficeScreen }));
const loadAdminDashboard = () => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard }));
const loadNavigationScreen = () => import('./components/NavigationScreen').then(m => ({ default: m.NavigationScreen }));
const loadFocusScreen = () => import('./components/FocusScreen').then(m => ({ default: m.FocusScreen }));
const loadParticipateScreen = () => import('./components/ParticipateScreen').then(m => ({ default: m.ParticipateScreen }));

const MatrixExplorer = lazyWithRetry(loadMatrixExplorer);
const DocumentariesListScreen = lazyWithRetry(loadDocumentariesListScreen);
const DocumentaryDetailScreen = lazyWithRetry(loadDocumentaryDetailScreen);
const DuoFeedScreen = lazyWithRetry(loadDuoFeedScreen);
const VideoPlayerScreen = lazyWithRetry(loadVideoPlayerScreen);
const TransmissionScreen = lazyWithRetry(loadTransmissionScreen);
const MyForestScreen = lazyWithRetry(loadMyForestScreen);
const ProfileSettingsScreen = lazyWithRetry(loadProfileSettingsScreen);
const SettingsScreen = lazyWithRetry(loadSettingsScreen);
const PortfolioScreen = lazyWithRetry(loadPortfolioScreen);
const TransactionsScreen = lazyWithRetry(loadTransactionsScreen);
const MessagingScreen = lazyWithRetry(loadMessagingScreen);
const MarketplaceScreen = lazyWithRetry(loadMarketplaceScreen);
const SubmitStoryScreen = lazyWithRetry(loadSubmitStoryScreen);
const RequestVideographerScreen = lazyWithRetry(loadRequestVideographerScreen);
const ReviewSystemScreen = lazyWithRetry(loadReviewSystemScreen);
const EditorialBackOfficeScreen = lazyWithRetry(loadEditorialBackOfficeScreen);
const AdminDashboard = lazyWithRetry(loadAdminDashboard);
const NavigationScreen = lazyWithRetry(loadNavigationScreen);
const FocusScreen = lazyWithRetry(loadFocusScreen);
const ParticipateScreen = lazyWithRetry(loadParticipateScreen);

// Résolution et redirection permanente des routes d'adresses internes
const resolveScreenFromPath = (): { screen: ViewScreen | null; redirectFrom?: string; redirectTo?: string } => {
  if (typeof window === 'undefined') return { screen: null };
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  
  // Redirections permanentes des anciennes adresses vers les nouvelles
  if (path === '/portraits' || path === '/lumiere' || path === '/lumieres' || path === '/entreprises' || path === '/entreprise') {
    return { screen: { type: 'focus' }, redirectFrom: path, redirectTo: '/focus' };
  }
  if (path === '/perspectives' || path === '/duo') {
    return { screen: { type: 'duo_feed' }, redirectFrom: path, redirectTo: '/duos' };
  }
  if (path === '/heritage') {
    return { screen: { type: 'home' }, redirectFrom: '/heritage', redirectTo: '/heritages' };
  }
  if (path === '/portfolio' || path === '/portefeuille' || path === '/transactions' || path === '/commandes' || path === '/contributions') {
    return { screen: { type: 'profile' }, redirectFrom: path, redirectTo: '/portrait' };
  }
  if (
    path === '/production' ||
    path === '/marche' ||
    path === '/marché' ||
    path === '/action' ||
    path === '/actions' ||
    path === '/productions' ||
    path === '/coproductions'
  ) {
    return { screen: { type: 'focus' }, redirectFrom: path, redirectTo: '/focus' };
  }
  if (path === '/profil') {
    return { screen: { type: 'profile' }, redirectFrom: '/profil', redirectTo: '/portrait' };
  }

  // Nouvelles adresses officielles
  if (path === '/focus') {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const topic = params?.get('topic') || params?.get('company') || undefined;
    return { screen: { type: 'focus', selectedTopicId: topic } };
  }
  if (path === '/dialogue' || path === '/dialogues' || path === '/duos' || path === '/miroir' || path === '/miroirs') {
    return { screen: { type: 'duo_feed' } };
  }
  if (path === '/studio') {
    return { screen: { type: 'submit_story' } };
  }
  if (path === '/portrait') {
    return { screen: { type: 'profile' } };
  }
  if (path === '/presentation' || path === '/co-construction' || path === '/participer') {
    return { screen: { type: 'participate' } };
  }

  return { screen: null };
};

const getScreenRouteInfo = (screen: ViewScreen): { path: string; title: string } => {
  switch (screen.type) {
    case 'duo_feed':
    case 'duo_detail':
    case 'landing':
    case 'home':
    case 'matrix_view':
    case 'documentaries':
    case 'documentary_detail':
      return { path: '/dialogue', title: 'Duocumentaires — YonyWood' };
    case 'focus':
    case 'enterprise':
    case 'marketplace':
      return { path: '/focus', title: 'Focus — YonyWood' };
    case 'submit_story':
    case 'request_videographer':
      return { path: '/studio', title: 'Studio — YonyWood' };
    case 'profile':
    case 'settings':
    case 'portfolio':
    case 'transactions':
    case 'protagonist_profile':
    case 'my_forest':
    case 'messaging':
    case 'editorial_backoffice':
      return { path: '/portrait', title: 'Portrait — YonyWood' };
    case 'participate':
      return { path: '/presentation', title: 'Présentation — YonyWood' };
    default:
      return { path: '/dialogue', title: 'Duocumentaires — YonyWood' };
  }
};

export default function App() {
  // Immersion directe : reconnaissance de la route et redirection si ancienne adresse
  const [currentScreen, setCurrentScreen] = useState<ViewScreen>(() => {
    const fromPath = resolveScreenFromPath();
    if (fromPath.redirectFrom && fromPath.redirectTo && typeof window !== 'undefined') {
      window.history.replaceState({ screen: fromPath.screen }, '', fromPath.redirectTo + window.location.search);
    }
    if (fromPath.screen) {
      return fromPath.screen;
    }
    try {
      const savedScreen = localStorage.getItem('yonywood_last_screen');
      if (savedScreen) {
        const rawParsed = JSON.parse(savedScreen);
        const { screen: parsed, changed } = migratePersistedScreenSeriesId(rawParsed);
        if (changed) {
          localStorage.setItem('yonywood_last_screen', JSON.stringify(parsed));
        }
        if (parsed && parsed.type && parsed.type !== 'landing') {
          if (parsed.type === 'marketplace') {
            return { type: 'focus' };
          }
          if (!SHOW_FINANCIAL_SCREENS) {
            if (parsed.type === 'portfolio' || parsed.type === 'transactions') {
              return { type: 'profile' };
            }
            if (parsed.type === 'profile') {
              const { initialModal: _im, ...restProfile } = parsed;
              return restProfile as ViewScreen;
            }
          }
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return { type: 'duo_feed' };
  });

  // Gestion de la modale d'authentification
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // User preferences & series filter state with localStorage persistence
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('yonywood_selected_series');
      if (saved) {
        const parsed = JSON.parse(saved);
        const { ids, changed } = normalizeSelectedSeriesList(parsed);
        if (changed) {
          localStorage.setItem('yonywood_selected_series', JSON.stringify(ids));
        }
        return ids;
      }
      const { ids } = normalizeSelectedSeriesList(null);
      localStorage.setItem('yonywood_selected_series', JSON.stringify(ids));
      return ids;
    } catch {
      const { ids } = normalizeSelectedSeriesList(null);
      return ids;
    }
  });
  const [language, setLanguage] = useState<string>('fr');
  const [hideQuestionByDefault, setHideQuestionByDefault] = useState<boolean>(true);

  const handleUpdateDocFilter = (docIds: string[]) => {
    if (docIds.length === 0) return;
    setSelectedSeriesFilter(docIds);
    try {
      localStorage.setItem('yonywood_selected_series', JSON.stringify(docIds));
    } catch {
      // ignore
    }
  };

  // Écoute de l'historique du navigateur (boutons Précédent / Suivant) avec redirections permanentes
  useEffect(() => {
    const handlePopState = () => {
      const { screen, redirectFrom, redirectTo } = resolveScreenFromPath();
      if (redirectFrom && redirectTo) {
        window.history.replaceState({ screen }, '', redirectTo + window.location.search);
      }
      if (screen) {
        setCurrentScreen(screen);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronisation permanente de l'URL, de la balise title et du défilement
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const { path, title } = getScreenRouteInfo(currentScreen);
    document.title = title;

    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const { redirectFrom, redirectTo } = resolveScreenFromPath();
      if (redirectFrom && redirectTo) {
        window.history.replaceState({ screen: currentScreen }, '', redirectTo + window.location.search);
      } else if (currentPath !== path && currentPath !== '') {
        window.history.pushState({ screen: currentScreen }, '', path + window.location.search);
      }
    }

    try {
      if (currentScreen.type !== 'video_player') {
        localStorage.setItem('yonywood_last_screen', JSON.stringify(currentScreen));
      }
    } catch {
      // ignore
    }
  }, [currentScreen]);

  // Initialize Socket.IO
  useEffect(() => {
    const socketEndpoint = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const socket = io(socketEndpoint, {
      path: '/socket.io',
      auth: { token: localStorage.getItem('yonywood_auth_token') },
      reconnectionAttempts: 3,
      timeout: 5000,
    });
    socket.on('connect', () => console.log('Socket.IO connected'));
    socket.on('connect_error', (err) => console.debug('Socket.IO:', err.message));
    socket.on('message', (msg) => console.log('New message:', msg));
    return () => {
      socket.disconnect();
    };
  }, []);

  // Préchargement discret des écrans principaux au repos (Studio, Duocumentaires, Portrait, Coproductions)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const navConn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (navConn?.saveData) return;

    const preloadMainScreens = () => {
      void loadSubmitStoryScreen().catch(() => {});
      void loadDuoFeedScreen().catch(() => {});
      void loadProfileSettingsScreen().catch(() => {});
      void loadFocusScreen().catch(() => {});
    };

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof win.requestIdleCallback === 'function') {
      const idleId = win.requestIdleCallback(preloadMainScreens, { timeout: 2500 });
      return () => {
        if (typeof win.cancelIdleCallback === 'function') {
          win.cancelIdleCallback(idleId);
        }
      };
    }

    const timerId = window.setTimeout(preloadMainScreens, 1200);
    return () => window.clearTimeout(timerId);
  }, []);

  // Swipe horizontal entre les rubriques principales de la barre (Studio ⇄ Duocumentaires ⇄ Focus)
  const appTouchStartRef = React.useRef<{ x: number; y: number } | null>(null);

  const PRIMARY_TABS: ViewScreen[] = [
    { type: 'submit_story' },
    { type: 'duo_feed' },
    ...(SHOW_PORTRAIT_IN_BAR ? [{ type: 'profile' } as ViewScreen] : []),
    { type: 'focus' },
  ];

  const getPrimaryTabIndex = (screen: ViewScreen): number => {
    if (screen.type === 'submit_story' || screen.type === 'request_videographer') {
      return PRIMARY_TABS.findIndex(t => t.type === 'submit_story');
    }
    if (screen.type === 'duo_feed' || screen.type === 'landing' || screen.type === 'home' || screen.type === 'matrix_view') {
      return PRIMARY_TABS.findIndex(t => t.type === 'duo_feed');
    }
    if (
      SHOW_PORTRAIT_IN_BAR &&
      (screen.type === 'profile' ||
        screen.type === 'settings' ||
        screen.type === 'portfolio' ||
        screen.type === 'transactions' ||
        screen.type === 'protagonist_profile' ||
        screen.type === 'my_forest' ||
        screen.type === 'messaging')
    ) {
      return PRIMARY_TABS.findIndex(t => t.type === 'profile');
    }
    if (screen.type === 'focus' || screen.type === 'enterprise') {
      return PRIMARY_TABS.findIndex(t => t.type === 'focus');
    }
    return -1;
  };

  // Redirection si un écran financier ou legacy marketplace est demandé
  useEffect(() => {
    if (currentScreen.type === 'marketplace') {
      setCurrentScreen({ type: 'focus' });
      return;
    }
    if (!SHOW_FINANCIAL_SCREENS) {
      if (currentScreen.type === 'portfolio' || currentScreen.type === 'transactions') {
        setCurrentScreen({ type: 'profile' });
      } else if (
        currentScreen.type === 'profile' &&
        (currentScreen.initialModal === 'orders' || currentScreen.initialModal === 'contributions')
      ) {
        const { initialModal: _im, ...rest } = currentScreen;
        setCurrentScreen(rest);
      }
    }
  }, [currentScreen]);

  const handleGlobalTouchStart = (e: React.TouchEvent) => {
    // Ne pas intercepter les gestes sur les écrans possédant leur propre carrousel / swipe 3D
    if (
      currentScreen.type === 'submit_story' ||
      currentScreen.type === 'duo_feed' ||
      currentScreen.type === 'focus' ||
      currentScreen.type === 'enterprise' ||
      currentScreen.type === 'marketplace' ||
      currentScreen.type === 'settings' ||
      currentScreen.type === 'profile' ||
      currentScreen.type === 'protagonist_profile'
    ) return;
    if ((e.target as HTMLElement).closest('input[type="range"]')) return;
    appTouchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleGlobalTouchEnd = (e: React.TouchEvent) => {
    if (
      currentScreen.type === 'submit_story' ||
      currentScreen.type === 'duo_feed' ||
      currentScreen.type === 'focus' ||
      currentScreen.type === 'enterprise' ||
      currentScreen.type === 'marketplace' ||
      currentScreen.type === 'settings' ||
      currentScreen.type === 'profile' ||
      currentScreen.type === 'protagonist_profile'
    ) return;
    if (!appTouchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - appTouchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - appTouchStartRef.current.y;
    appTouchStartRef.current = null;

    // Déplacement horizontal marqué (> 85px) avec faible déplacement vertical (< 50px)
    if (Math.abs(deltaX) > 85 && Math.abs(deltaY) < 50) {
      const currentIdx = getPrimaryTabIndex(currentScreen);
      if (currentIdx !== -1) {
        if (deltaX < 0 && currentIdx < PRIMARY_TABS.length - 1) {
          // Swipe gauche -> rubrique suivante
          setCurrentScreen(PRIMARY_TABS[currentIdx + 1]);
        } else if (deltaX > 0 && currentIdx > 0) {
          // Swipe droite -> rubrique précédente
          setCurrentScreen(PRIMARY_TABS[currentIdx - 1]);
        }
      }
    }
  };

  const isVideoPlayer = currentScreen.type === 'video_player';
  const isDarkScreen = currentScreen.type === 'video_player';
  const isFixedViewportScreen = 
    currentScreen.type === 'duo_feed' || 
    currentScreen.type === 'landing' || 
    currentScreen.type === 'home' || 
    currentScreen.type === 'matrix_view' || 
    currentScreen.type === 'focus' ||
    currentScreen.type === 'enterprise' ||
    currentScreen.type === 'marketplace' ||
    currentScreen.type === 'submit_story' ||
    currentScreen.type === 'settings' ||
    currentScreen.type === 'profile' ||
    currentScreen.type === 'protagonist_profile';

  return (
    <div className={`h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col font-sans antialiased selection:bg-[#C89B3C]/20 selection:text-[#1C1917] relative ${
      isDarkScreen ? 'bg-[#0E0D0B] text-white' : 'bg-white text-[#1C1917]'
    }`}>
      
      {/* Header universel YonyWood avec Logo et Nom de marque au centre */}
      {!isVideoPlayer && (
        <Navbar 
          currentScreen={currentScreen} 
          onNavigate={setCurrentScreen} 
          selectedSeriesFilter={selectedSeriesFilter}
          onUpdateDocFilter={handleUpdateDocFilter}
          onOpenAuth={(mode) => {
            setAuthMode(mode);
            setAuthModalOpen(true);
          }}
        />
      )}

      {/* Main Content Area avec swipe gestuel entre les pages */}
      <main 
        onTouchStart={handleGlobalTouchStart}
        onTouchEnd={handleGlobalTouchEnd}
        className="flex-1 min-h-0 relative overflow-hidden flex flex-col"
      >
        <ChunkErrorBoundary resetKey={currentScreen.type}>
        <Suspense fallback={<div className={`w-full h-full ${isDarkScreen ? 'bg-[#0E0D0B]' : 'bg-[#FAFAF9]'}`} />}>
        {currentScreen.type === 'landing' && (
          <DuoFeedScreen 
            onNavigate={setCurrentScreen} 
            allowedSeriesIds={selectedSeriesFilter}
          />
        )}

        {(currentScreen.type === 'home' || currentScreen.type === 'matrix_view') && (
          <MatrixExplorer onNavigate={setCurrentScreen} />
        )}

        {currentScreen.type === 'duo_feed' && (
          <DuoFeedScreen 
            onNavigate={setCurrentScreen} 
            initialDocId={currentScreen.selectedDocId} 
            initialDuoIndex={currentScreen.currentDuoIndex}
            allowedSeriesIds={selectedSeriesFilter}
          />
        )}

        {(currentScreen.type === 'focus' || currentScreen.type === 'enterprise') && (
          <FocusScreen 
            onNavigate={setCurrentScreen} 
            initialTopicId={currentScreen.type === 'focus' ? currentScreen.selectedTopicId : currentScreen.selectedCompanyId}
          />
        )}

        {currentScreen.type === 'marketplace' && (
          <MarketplaceScreen 
            onNavigate={setCurrentScreen} 
            initialPeerOfferId={currentScreen.initialPeerOfferId}
            initialPeerIndex={currentScreen.initialPeerIndex}
            initialTab={currentScreen.initialTab}
            restoreContext={currentScreen.restoreContext}
          />
        )}

        {currentScreen.type === 'profile' && (
          <ProfileSettingsScreen 
            key={currentScreen.protagonistId || 'own-profile'}
            onNavigate={setCurrentScreen}
            protagonistId={currentScreen.protagonistId}
            selectedDocFilter={selectedSeriesFilter}
            onUpdateDocFilter={handleUpdateDocFilter}
            language={language}
            onUpdateLanguage={setLanguage}
            hideQuestionByDefault={hideQuestionByDefault}
            onToggleHideQuestion={setHideQuestionByDefault}
            returnToDuoId={currentScreen.returnToDuoId}
            returnToDuoIndex={currentScreen.returnToDuoIndex}
            returnToDocId={currentScreen.returnToDocId}
            returnToProtagonistId={currentScreen.returnToProtagonistId}
            initialModal={currentScreen.initialModal}
          />
        )}

        {currentScreen.type === 'settings' && (
          <SettingsScreen 
            onNavigate={setCurrentScreen}
            returnTo={currentScreen.returnTo}
            selectedDocFilter={selectedSeriesFilter}
            onUpdateDocFilter={handleUpdateDocFilter}
            language={language}
            onUpdateLanguage={setLanguage}
          />
        )}

        {SHOW_FINANCIAL_SCREENS && currentScreen.type === 'portfolio' && (
          <PortfolioScreen 
            onNavigate={setCurrentScreen}
            returnToDuoId={currentScreen.returnToDuoId}
            returnToDuoIndex={currentScreen.returnToDuoIndex}
            returnToDocId={currentScreen.returnToDocId}
          />
        )}

        {SHOW_FINANCIAL_SCREENS && currentScreen.type === 'transactions' && (
          <TransactionsScreen 
            onNavigate={setCurrentScreen}
            initialTab={currentScreen.initialTab}
            returnToDuoId={currentScreen.returnToDuoId}
            returnToDuoIndex={currentScreen.returnToDuoIndex}
            returnToDocId={currentScreen.returnToDocId}
          />
        )}

        {currentScreen.type === 'messaging' && (
          <MessagingScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen.type === 'documentaries' && (
          <DocumentariesListScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen.type === 'documentary_detail' && (
          <DocumentaryDetailScreen 
            documentaryId={currentScreen.documentaryId} 
            onNavigate={setCurrentScreen} 
          />
        )}

        {currentScreen.type === 'duo_detail' && (
          <DuoFeedScreen 
            initialDuoId={currentScreen.duoId} 
            allowedSeriesIds={selectedSeriesFilter}
            onNavigate={setCurrentScreen} 
          />
        )}

        {currentScreen.type === 'video_player' && (
          <VideoPlayerScreen
            story={currentScreen.story}
            protagonist={currentScreen.protagonist}
            duoId={currentScreen.duoId}
            documentaryTitle={currentScreen.documentaryTitle}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen.type === 'protagonist_profile' && (
          <ProfileSettingsScreen 
            key={currentScreen.protagonistId || 'default-protagonist'}
            protagonistId={currentScreen.protagonistId} 
            onNavigate={setCurrentScreen} 
            selectedDocFilter={selectedSeriesFilter}
            onUpdateDocFilter={handleUpdateDocFilter}
            language={language}
            onUpdateLanguage={setLanguage}
            hideQuestionByDefault={hideQuestionByDefault}
            onToggleHideQuestion={setHideQuestionByDefault}
            returnToDuoId={currentScreen.returnToDuoId}
            returnToDuoIndex={currentScreen.returnToDuoIndex}
            returnToDocId={currentScreen.returnToDocId}
            returnToProtagonistId={currentScreen.returnToProtagonistId}
            returnToMarketplace={currentScreen.returnToMarketplace}
            marketplaceContext={currentScreen.marketplaceContext}
          />
        )}

        {currentScreen.type === 'transmission_detail' && (
          <TransmissionScreen 
            protagonistId={currentScreen.protagonistId} 
            transmissionId={currentScreen.transmissionId} 
            onNavigate={setCurrentScreen} 
          />
        )}

        {currentScreen.type === 'my_forest' && (
          <MyForestScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen.type === 'submit_story' && (
          <SubmitStoryScreen 
            preselectedDocumentaryId={currentScreen.preselectedDocumentaryId}
            initialPillarId={currentScreen.initialPillarId}
            initialCastingCategoryId={currentScreen.initialCastingCategoryId}
            initialFinalChoiceId={currentScreen.initialFinalChoiceId}
            initialPartId={currentScreen.initialPartId}
            onNavigate={setCurrentScreen} 
          />
        )}

        {currentScreen.type === 'request_videographer' && (
          <RequestVideographerScreen 
            returnPillarId={currentScreen.returnPillarId}
            returnCastingCategoryId={currentScreen.returnCastingCategoryId}
            returnFinalChoiceId={currentScreen.returnFinalChoiceId}
            returnPartId={currentScreen.returnPartId}
            onNavigate={setCurrentScreen} 
          />
        )}

        {(currentScreen.type === 'review_system' || currentScreen.type === 'forest_reviews') && (
          <ReviewSystemScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen.type === 'editorial_backoffice' && (
          <EditorialBackOfficeScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen.type === 'admin_dashboard' && (
          <AdminDashboard 
            onNavigate={setCurrentScreen} 
            initialTab={currentScreen.tab} 
          />
        )}

        {currentScreen.type === 'site_map' && (
          <NavigationScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen.type === 'participate' && (
          <ParticipateScreen 
            onNavigate={setCurrentScreen} 
            initialRole={currentScreen.initialRole}
            preselectedSeriesId={currentScreen.preselectedSeriesId}
          />
        )}
        </Suspense>
        </ChunkErrorBoundary>
      </main>

      {/* Menu de navigation principal : Studio, Héritage, Duo, Lumière, Production, Profil */}
      {!isVideoPlayer && (
        <BottomMenu 
          currentScreen={currentScreen} 
          onNavigate={setCurrentScreen} 
        />
      )}

      {/* Modale d'authentification épurée (Connexion / Inscription) */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={() => setAuthModalOpen(false)}
      />

    </div>
  );
}
