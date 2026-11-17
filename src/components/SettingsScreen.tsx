import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Video,
  Clapperboard,
  CheckCircle2
} from 'lucide-react';
import { ViewScreen, UserAccount } from '../types';
import { useAuth, DEFAULT_ADMIN_USER } from '../services/authContext';
import {
  getUserVideoSubmissions,
  UserVideoSubmission,
  USER_VIDEOS_UPDATED_EVENT
} from '../utils/userVideoService';
import { SecuritySwipeSection } from './mon-studio/SecuritySwipeSection';
import { MyVideosCarouselSection } from './mon-studio/MyVideosCarouselSection';
import { SeriesSelectionSection } from './mon-studio/SeriesSelectionSection';

interface SettingsScreenProps {
  onNavigate: (screen: ViewScreen) => void;
  returnTo?: 'profile' | 'duo_feed';
  selectedDocFilter: string[];
  onUpdateDocFilter: (filter: string[]) => void;
  language: string;
  onUpdateLanguage: (lang: string) => void;
}

type MonStudioSection = 'home' | 'security' | 'videos' | 'series';

const MENU_ENTRIES: Array<{
  id: Exclude<MonStudioSection, 'home'>;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'videos', label: 'Mes Vidéos', icon: Video },
  { id: 'series', label: 'Séries', icon: Clapperboard }
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onNavigate,
  returnTo = 'profile',
  selectedDocFilter,
  onUpdateDocFilter
}) => {
  const { currentUser, usersList, updateProfile, changePassword, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<MonStudioSection>('home');

  const activeProfile: UserAccount =
    currentUser ||
    usersList.find((u) => u.id === DEFAULT_ADMIN_USER.id) ||
    DEFAULT_ADMIN_USER;

  const [userVideos, setUserVideos] = useState<UserVideoSubmission[]>(() =>
    getUserVideoSubmissions(activeProfile.id)
  );

  const [savedToast, setSavedToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setSavedToast(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setSavedToast(null);
    }, 2600);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const reloadVideos = () => {
    setUserVideos(getUserVideoSubmissions(activeProfile.id));
  };

  useEffect(() => {
    reloadVideos();
    const syncVideos = () => {
      setUserVideos(getUserVideoSubmissions(activeProfile.id));
    };
    window.addEventListener('storage', syncVideos);
    window.addEventListener(USER_VIDEOS_UPDATED_EVENT, syncVideos);
    return () => {
      window.removeEventListener('storage', syncVideos);
      window.removeEventListener(USER_VIDEOS_UPDATED_EVENT, syncVideos);
    };
  }, [activeProfile.id]);

  const handleExitMonStudio = () => {
    if (returnTo === 'profile') {
      onNavigate({ type: 'profile' });
    } else {
      onNavigate({ type: 'duo_feed' });
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate({ type: 'duo_feed' });
  };

  return (
    <>
      {activeSection === 'home' && (
        <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans select-none overflow-hidden">
          <header className="shrink-0 h-14 sm:h-16 px-4 sm:px-6 border-b border-stone-200/80 bg-white/95 flex items-center gap-3 z-30">
            <button
              type="button"
              onClick={handleExitMonStudio}
              className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shrink-0"
              aria-label="Revenir"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="font-editorial text-base sm:text-lg font-bold text-stone-900">
              Mon Studio
            </h1>
          </header>

          <main className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 py-6 sm:py-10 max-w-xl mx-auto w-full">
            <nav
              aria-label="Sections Mon Studio"
              className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden divide-y divide-stone-100"
            >
              {MENU_ENTRIES.map((entry) => {
                const Icon = entry.icon;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setActiveSection(entry.id)}
                    className="w-full px-5 py-4.5 min-h-[64px] flex items-center justify-between gap-4 hover:bg-stone-50 active:bg-stone-100 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Icon className="w-5 h-5 text-stone-700 stroke-[1.6] shrink-0" />
                      <span className="text-sm sm:text-base font-semibold text-stone-900 truncate">
                        {entry.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                  </button>
                );
              })}
            </nav>
          </main>
        </div>
      )}

      {activeSection === 'security' && (
        <SecuritySwipeSection
          profile={activeProfile}
          onUpdateProfile={updateProfile}
          onChangePassword={changePassword}
          onLogout={handleLogout}
          onBack={() => setActiveSection('home')}
          onShowToast={showToast}
        />
      )}

      {activeSection === 'videos' && (
        <MyVideosCarouselSection
          videos={userVideos}
          onRefreshVideos={reloadVideos}
          onOpenStudioSubmit={() => onNavigate({ type: 'submit_story' })}
          onBack={() => setActiveSection('home')}
          onShowToast={showToast}
        />
      )}

      {activeSection === 'series' && (
        <SeriesSelectionSection
          selectedDocFilter={selectedDocFilter}
          onUpdateDocFilter={onUpdateDocFilter}
          onBack={() => setActiveSection('home')}
          onShowToast={showToast}
        />
      )}

      {savedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#1C1917] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xl border border-stone-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedToast}</span>
        </div>
      )}
    </>
  );
};
