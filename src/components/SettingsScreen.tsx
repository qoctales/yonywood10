import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Scroll,
  DoorOpen,
  X
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
import { StageCarousel3D } from './shared/StageCarousel3D';
import { CardWidthModal } from './shared/CardWidthModal';

import {
  PROFILE_ONBOARDING_CARDS,
  ProfileOnboardingCardEntry
} from '../constants/profileOnboardingContent';

interface SettingsScreenProps {
  onNavigate: (screen: ViewScreen) => void;
  returnTo?: 'profile' | 'duo_feed';
  selectedDocFilter: string[];
  onUpdateDocFilter: (filter: string[]) => void;
  language: string;
  onUpdateLanguage: (lang: string) => void;
}

type MonStudioSection = 'home' | 'security' | 'videos' | 'series';

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onNavigate,
  selectedDocFilter,
  onUpdateDocFilter
}) => {
  const { currentUser, usersList, updateProfile, changePassword, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<MonStudioSection>('home');
  const [homeCardIndex, setHomeCardIndex] = useState<number>(0);
  const [synopsisModalEntry, setSynopsisModalEntry] =
    useState<ProfileOnboardingCardEntry | null>(null);
  const [failedPosterIds, setFailedPosterIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    PROFILE_ONBOARDING_CARDS.forEach((card) => {
      const img = new window.Image();
      img.src = card.posterUrl;
    });
  }, []);

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

  const handleLogout = () => {
    logout();
    onNavigate({ type: 'duo_feed' });
  };

  return (
    <>
      {activeSection === 'home' && (
        <div className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between text-[#1C1917] select-none bg-white">
          <div className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-6 min-h-0 overflow-hidden flex flex-col justify-between pt-1 sm:pt-2">
            <StageCarousel3D
              items={PROFILE_ONBOARDING_CARDS}
              currentIndex={homeCardIndex}
              onIndexChange={setHomeCardIndex}
              getKey={(entry) => entry.id}
              circular={true}
              dragDisabled={Boolean(synopsisModalEntry)}
              showDesktopArrows={true}
              prevAriaLabel="Section précédente"
              nextAriaLabel="Section suivante"
              onActiveCardClick={(entry) => setActiveSection(entry.id)}
              renderCard={(entry, idx, { isCenter }) => {
                const isImageFailed = Boolean(failedPosterIds[entry.id]);

                return (
                  <div className="relative w-full h-full flex flex-col justify-between p-2.5 sm:p-4 text-white bg-[#A2482B]">
                    {!isImageFailed && (
                      <img
                        src={entry.posterUrl}
                        alt={entry.title}
                        loading="eager"
                        decoding="async"
                        onError={() =>
                          setFailedPosterIds((prev) =>
                            prev[entry.id] ? prev : { ...prev, [entry.id]: true }
                          )
                        }
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/80 pointer-events-none" />

                    {/* HAUT : Pastille titre en haut à gauche */}
                    <div className="relative z-10 flex items-center justify-between gap-1 w-full min-w-0">
                      <div className="inline-flex w-fit max-w-[calc(100%-64px)] min-w-0 items-center rounded-full px-2.5 py-1 bg-black/75 border border-white/20 shadow-md">
                        <span className="font-editorial text-[8.5px] sm:text-[9.5px] md:text-[10.5px] font-semibold text-white leading-tight tracking-wide select-none truncate">
                          {entry.title}
                        </span>
                      </div>
                    </div>

                    {/* BAS : Papyrus (gauche) + Porte Choisir (droite) */}
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
                          setSynopsisModalEntry(entry);
                        }}
                        className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-black/70 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                        title="En savoir plus"
                        aria-label={`Présentation — ${entry.title}`}
                      >
                        <Scroll className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isCenter) {
                            setHomeCardIndex(idx);
                          } else {
                            setActiveSection(entry.id);
                          }
                        }}
                        className="px-3 py-1.5 sm:py-2 rounded-xl bg-black/70 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white font-medium text-xs sm:text-[12px] shadow-md flex items-center gap-1.5 transition-all duration-200 cursor-pointer border border-white/20 hover:border-[#A2482B] hover:scale-105 active:scale-95"
                      >
                        <DoorOpen className="w-3.5 h-3.5 text-white/90" />
                        <span>Choisir</span>
                      </button>
                    </div>
                  </div>
                );
              }}
            />
          </div>

          <CardWidthModal
            isOpen={Boolean(synopsisModalEntry)}
            onClose={() => setSynopsisModalEntry(null)}
            ariaLabel={synopsisModalEntry ? synopsisModalEntry.title : 'Présentation'}
            className="p-4 sm:p-5 space-y-2.5 text-[#1C1917]"
          >
            {synopsisModalEntry && (
              <>
                <div className="flex items-center gap-2 border-b border-stone-200/80 pb-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center shrink-0">
                    <Scroll className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-editorial text-xs sm:text-sm font-semibold text-[#1C1917] leading-tight flex-1 min-w-0 truncate">
                    {synopsisModalEntry.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSynopsisModalEntry(null)}
                    className="w-7 h-7 rounded-lg hover:bg-stone-200/70 text-stone-500 hover:text-[#1C1917] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title="Fermer"
                    aria-label="Fermer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[#44403C] text-xs sm:text-[13px] leading-relaxed pt-0.5">
                  {synopsisModalEntry.papyrusText}
                </p>
              </>
            )}
          </CardWidthModal>
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
          profile={activeProfile}
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
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-[#1C1917] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xl border border-stone-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedToast}</span>
        </div>
      )}
    </>
  );
};
