import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Scroll
} from 'lucide-react';
import { ViewScreen } from '../types';
import { 
  FOCUS_TOPICS, 
  FocusTopic, 
  FocusSequence, 
  clampFocusTitle,
  FOCUS_MAX_TITLE_LENGTH
} from '../data/focusTopicsData';
import { FOCUS_THEMATIC_STORIES } from '../data/thematicStoriesData';
import { 
  TvPlayerIcon,
  DoorArchIcon
} from './YonywoodBrandIcons';
import { FocusVideoCard } from './FocusVideoCard';
import { StoriesStudioCoverflow } from './StoriesStudioCoverflow';
import { VideoCardShareModal } from './VideoCardShareModal';
import { celestialAudio } from '../utils/celestialAudio';
import { SHOW_CAROUSEL_ARROWS } from '../config/flags';

const SHOW_TOP_STORIES_BANNER = false;

interface FocusScreenProps {
  onNavigate?: (screen: ViewScreen) => void;
  initialTopicId?: string;
  selectedCompanyId?: string;
}

export const FocusScreen: React.FC<FocusScreenProps> = ({ 
  onNavigate, 
  initialTopicId, 
  selectedCompanyId 
}) => {
  // 1. Sujet actif (index de la thématique 0 à 7)
  const [topicIndex, setTopicIndex] = useState<number>(() => {
    const targetId = initialTopicId || selectedCompanyId;
    if (targetId) {
      const idx = FOCUS_TOPICS.findIndex(t => t.id === targetId || t.title.toLowerCase() === targetId.toLowerCase());
      if (idx !== -1) return idx;
    }
    return 0;
  });

  const currentTopic: FocusTopic = FOCUS_TOPICS[topicIndex] || FOCUS_TOPICS[0];

  // 2. État d'entrée dans le sujet (Affiche en 3D d'abord -> Vidéos après clic sur la carte ou la porte)
  const [isTopicOpened, setIsTopicOpened] = useState<boolean>(false);

  // 3. Modale Papyrus (Présentation textuelle : Titre, Synopsis et Question - SANS le mot Focus)
  const [showPapyrusModal, setShowPapyrusModal] = useState<boolean>(false);

  // 4. Séquence active par sujet (quand on est dans les vidéos)
  const [sequenceIndices, setSequenceIndices] = useState<Record<string, number>>({});
  const currentSequenceIndex = sequenceIndices[currentTopic.id] || 0;
  const currentSequence: FocusSequence = currentTopic.sequences[currentSequenceIndex] || currentTopic.sequences[0];

  // 5. Lecteur vidéo & Contrôles
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(0);

  // 6. Modale Partage & Stories Coverflow
  const [shareItem, setShareItem] = useState<{ title: string; id: string } | null>(null);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [storyViewerIndex, setStoryViewerIndex] = useState(0);

  // 7. Gestes tactiles et souris pour le Carrousel 3D (calqué sur la page Studio)
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);

  // NAVIGATION ENTRE THÉMATIQUES (Carrousel 3D)
  const goToNextTopic = useCallback(() => {
    const total = FOCUS_TOPICS.length;
    setTopicIndex((prev) => (prev + 1) % total);
    setVideoProgress(0);
    celestialAudio.playOrbSelect();
  }, []);

  const goToPrevTopic = useCallback(() => {
    const total = FOCUS_TOPICS.length;
    setTopicIndex((prev) => (prev - 1 + total) % total);
    setVideoProgress(0);
    celestialAudio.playOrbSelect();
  }, []);

  // NAVIGATION ENTRE SÉQUENCES VIDÉO (quand on est entré dans le sujet)
  const handleNextSequence = useCallback(() => {
    const total = currentTopic.sequences.length;
    const nextIdx = (currentSequenceIndex + 1) % total;
    setSequenceIndices(prev => ({
      ...prev,
      [currentTopic.id]: nextIdx
    }));
    setVideoProgress(0);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  }, [currentTopic, currentSequenceIndex]);

  const handlePrevSequence = useCallback(() => {
    const total = currentTopic.sequences.length;
    const prevIdx = (currentSequenceIndex - 1 + total) % total;
    setSequenceIndices(prev => ({
      ...prev,
      [currentTopic.id]: prevIdx
    }));
    setVideoProgress(0);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  }, [currentTopic, currentSequenceIndex]);

  // ENTRER DANS LE SUJET (Clic sur la porte ou la carte)
  const handleEnterSubject = () => {
    setIsTopicOpened(true);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  };

  // RETOUR AU CARROUSEL 3D DES THÉMATIQUES
  const handleBackToPosters = () => {
    setIsTopicOpened(false);
    setIsPlaying(false);
    setVideoProgress(0);
    celestialAudio.playOrbSelect();
  };

  // RACCOURCI STORY -> OUVERTURE DIRECTE DE LA THÉMATIQUE
  const handleOpenTopicFromStory = useCallback((topicId: string) => {
    setIsStoryViewerOpen(false);
    const targetIdx = FOCUS_TOPICS.findIndex(t => t.id === topicId || t.title.toLowerCase() === topicId.toLowerCase());
    if (targetIdx !== -1) {
      setTopicIndex(targetIdx);
    }
    setIsTopicOpened(true);
    setIsPlaying(true);
    setShowPapyrusModal(false);
    setVideoProgress(0);
    celestialAudio.playOrbSelect();
  }, []);

  // Gestion du play / pause de la balise vidéo
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isTopicOpened && isPlaying) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isTopicOpened, isPlaying, currentSequenceIndex, topicIndex]);

  // Progression de la vidéo
  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid) return;
    const cTime = vid.currentTime;
    const dur = vid.duration || 176;
    setVideoProgress((cTime / dur) * 100);
  };

  // Fin de la vidéo : boucle naturelle sur la prochaine séquence
  const handleVideoEnded = () => {
    handleNextSequence();
  };

  // NAVIGATION CLAVIER (Gauche/Droite = carrousel 3D ou séquences, Escape = retour)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isStoryViewerOpen || shareItem || showPapyrusModal) {
        if (e.key === 'Escape') {
          setShowPapyrusModal(false);
          setShareItem(null);
          setIsStoryViewerOpen(false);
        }
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (isTopicOpened) {
          handleNextSequence();
        } else {
          goToNextTopic();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (isTopicOpened) {
          handlePrevSequence();
        } else {
          goToPrevTopic();
        }
      } else if (e.key === 'Escape' && isTopicOpened) {
        e.preventDefault();
        handleBackToPosters();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStoryViewerOpen, shareItem, showPapyrusModal, isTopicOpened, handleNextSequence, handlePrevSequence, goToNextTopic, goToPrevTopic]);

  // GESTES TACTILES & SOURIS CALQUÉS SUR LE CARROUSEL 3D STUDIO
  const onTouchStart = (e: React.TouchEvent) => {
    if (showPapyrusModal || isStoryViewerOpen || shareItem) return;
    if ((e.target as HTMLElement).closest('button, input, a, [role="button"]')) return;
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
        if (isTopicOpened) handleNextSequence();
        else goToNextTopic();
      } else {
        if (isTopicOpened) handlePrevSequence();
        else goToPrevTopic();
      }
    }
    setDragOffset(0);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (showPapyrusModal || isStoryViewerOpen || shareItem) return;
    if ((e.target as HTMLElement).closest('button, input, a, [role="button"]')) return;
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
        if (isTopicOpened) handleNextSequence();
        else goToNextTopic();
      } else {
        if (isTopicOpened) handlePrevSequence();
        else goToPrevTopic();
      }
    }
    setDragOffset(0);
  };

  // Prénom de l'intervenant pour la carte vidéo
  const speakerFirstName = currentSequence?.speakerName?.split(' ')[0] || '';

  return (
    <div 
      className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between text-[#1C1917] select-none bg-white relative"
    >
      
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE STORIES : FOND NOIR, 8 VIGNETTES CENTRÉES SOUS LE LOGO          */}
      {/* Conservé dans le code pour de futures stories, non affiché actuellement    */}
      {/* ========================================================================= */}
      {SHOW_TOP_STORIES_BANNER && (
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
            {/* 8 Vignettes d'invitation Focus centrées par rapport au logo */}
            {FOCUS_THEMATIC_STORIES.map((story, idx) => (
              <div
                key={story.id}
                onClick={() => {
                  setStoryViewerIndex(idx);
                  setIsStoryViewerOpen(true);
                  celestialAudio.playOrbSelect();
                }}
                className="cursor-pointer group shrink-0"
                title={`${story.authorName} — ${story.themeLabel}`}
              >
                <div 
                  className="w-[52px] h-[52px] sm:w-14 sm:h-14 rounded-2xl p-0.5 border border-stone-800/80 group-hover:border-[#A2482B] transition-all group-hover:scale-105 bg-stone-900"
                  style={{ boxShadow: 'var(--story-ring-shadow, 0 1px 8px rgba(0, 0, 0, 0.6))' }}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden bg-stone-900 relative">
                    <img 
                      src={story.authorAvatar} 
                      alt={story.authorName} 
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
      )}

      {/* ========================================================================= */}
      {/* 2. ZONE CENTRALE :                                                        */}
      {/* - MODE 1 (!isTopicOpened) : CARROUSEL 3D DES 8 AFFICHES (comme Studio)    */}
      {/* - MODE 2 (isTopicOpened)  : LECTEUR VIDÉO SÉQUENTIEL DE LA THÉMATIQUE     */}
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
        {/* ======================================================================= */}
        {/* MODE 1 : CARROUSEL 3D DES 8 AFFICHES OFFICIELLES (EFFET STUDIO)          */}
        {/* ======================================================================= */}
        {!isTopicOpened ? (
          <>
            {/* Flèche Gauche (Desktop) */}
            {SHOW_CAROUSEL_ARROWS && (
            <button
              onClick={goToPrevTopic}
              className="flex absolute left-1 sm:left-3 lg:left-6 z-40 w-8.5 h-8.5 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#1C1917] hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
              title="Affiche précédente"
            >
              <ChevronLeft className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>
            )}

            {/* SCÈNE 3D AVEC PERSPECTIVE IDENTIQUE À LA PAGE STUDIO */}
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
                {FOCUS_TOPICS.map((topic, idx) => {
                  const n = FOCUS_TOPICS.length;
                  const rawDiff = (idx - topicIndex) % n;
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

                  return (
                    <div
                      key={`focus-3d-card-${topic.id}`}
                      onClick={() => {
                        if (isCenter) {
                          handleEnterSubject();
                        } else {
                          setTopicIndex(idx);
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
                      className={`absolute aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between p-3 sm:p-4 select-none bg-[#151513] text-white border transition-colors ${
                        isCenter ? 'border-stone-200/90 ring-1 ring-white/30 cursor-pointer' : 'border-white/15 cursor-pointer [&_*]:!pointer-events-none'
                      }`}
                    >
                      {/* Image d'affiche officielle */}
                      <img 
                        src={topic.posterUrl} 
                        alt={topic.title} 
                        loading={Math.abs(diff) <= 1 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35 pointer-events-none" />

                      {/* HAUT DE CARTE : Titre à gauche + Icône TV à droite */}
                      <div className="relative z-10 flex items-center justify-between gap-1.5 pointer-events-auto w-full min-w-0">
                        <div 
                          className="inline-flex w-fit items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/75 border border-white/20 shadow-md max-w-[calc(100%-52px)]"
                          title={topic.title}
                        >
                          <span className="font-editorial text-xs font-semibold text-white whitespace-nowrap tracking-wide select-none truncate">
                            {clampFocusTitle(topic.title, FOCUS_MAX_TITLE_LENGTH)}
                          </span>
                        </div>

                        <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-black/75 text-white border border-white/20 flex items-center justify-center shadow-md select-none shrink-0">
                          <TvPlayerIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white/90" />
                        </div>
                      </div>

                      {/* BAS DE CARTE : PAPYRUS à gauche & PORTE à droite */}
                      <div 
                        className="relative z-10 w-full flex items-center justify-between pointer-events-auto pt-2"
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                      >
                        {/* Bouton Papyrus (Synopsis & Question) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isCenter) {
                              setTopicIndex(idx);
                            }
                            setShowPapyrusModal(true);
                            celestialAudio.playOrbSelect();
                          }}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black/75 hover:bg-[#A2482B] active:bg-[#8A3B22] border border-white/20 text-white flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer"
                          title="Lire le synopsis et la question"
                        >
                          <Scroll className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                        </button>

                        {/* Bouton Porte (Entrer dans le sujet) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isCenter) {
                              setTopicIndex(idx);
                            }
                            handleEnterSubject();
                          }}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black/75 hover:bg-[#A2482B] active:bg-[#8A3B22] border border-white/20 text-white flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer group"
                          title="Entrer dans le sujet"
                        >
                          <DoorArchIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Flèche Droite (Desktop) */}
            {SHOW_CAROUSEL_ARROWS && (
            <button
              onClick={goToNextTopic}
              className="flex absolute right-1 sm:right-3 lg:right-6 z-40 w-8.5 h-8.5 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#1C1917] hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
              title="Affiche suivante"
            >
              <ChevronRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>
            )}
          </>
        ) : (
          /* ===================================================================== */
          /* MODE 2 : VIDÉOS SÉQUENTIELLES DANS LA THÉMATIQUE SÉLECTIONNÉE         */
          /* ===================================================================== */
          <div className="relative w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            {/* Flèche Vidéo Précédente (Desktop) */}
            {SHOW_CAROUSEL_ARROWS && (
            <button
              onClick={handlePrevSequence}
              className="hidden md:flex absolute left-4 lg:left-8 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-[#1C1917] text-stone-800 hover:text-white border border-stone-200 shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
              title="Vidéo précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            )}

            {/* Flèche Vidéo Suivante (Desktop) */}
            {SHOW_CAROUSEL_ARROWS && (
            <button
              onClick={handleNextSequence}
              className="hidden md:flex absolute right-4 lg:right-8 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-[#1C1917] text-stone-800 hover:text-white border border-stone-200 shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
              title="Vidéo suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            )}

            {/* CARTE VIDÉO FORMAT 9:16 */}
            <FocusVideoCard
              mediaKey={currentSequence.id}
              topLeftLabel={clampFocusTitle(currentTopic.title, FOCUS_MAX_TITLE_LENGTH)}
              topLeftFullTitle="Revenir aux affiches 3D"
              topLeftShowBackArrow={true}
              onTopLeftClick={handleBackToPosters}
              videoUrl={currentSequence.videoUrl || '/sample.mp4'}
              displayName={speakerFirstName}
              videoRef={videoRef}
              isPlaying={isPlaying}
              isMuted={isMuted}
              videoProgress={videoProgress}
              dragOffset={dragOffset}
              isDragging={isDraggingRef.current}
              onTogglePlay={() => setIsPlaying((p) => !p)}
              onToggleMute={() => setIsMuted((m) => !m)}
              onTimeUpdate={handleTimeUpdate}
              onVideoEnded={handleVideoEnded}
              onOpenPortrait={() =>
                onNavigate?.({
                  type: 'profile',
                  protagonistId: currentSequence.protagonistId || 'senan-agossa',
                })
              }
              portraitTitle={`Portrait de ${currentSequence.speakerName}`}
              onOpenShare={() =>
                setShareItem({
                  title: `Focus : ${currentTopic.title} — ${currentSequence.speakerName}`,
                  id: currentSequence.id,
                })
              }
            />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. MODALE D'INFORMATION PAPYRUS (SANS LE MOT FOCUS, DIRECTEMENT LE TITRE)  */}
      {/* ========================================================================= */}
      {showPapyrusModal && (
        <div 
          onClick={() => setShowPapyrusModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-[min(calc(100vw-64px),290px)] max-w-[290px] bg-[#FAF7F2] rounded-3xl p-4 sm:p-5 shadow-2xl border border-stone-200 space-y-3 animate-in zoom-in-95 duration-200 text-stone-800"
          >
            {/* Header épuré : Icône Scroll + Titre de la thématique uniquement (sans le mot "Focus") */}
            <div className="flex items-center gap-2.5 border-b border-stone-200/80 pb-2.5">
              <div className="w-7.5 h-7.5 rounded-xl bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center shrink-0">
                <Scroll className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="font-editorial text-sm sm:text-base font-semibold text-stone-900 leading-snug break-words">
                  {currentTopic.title}
                </h3>
              </div>
            </div>

            {/* Texte de présentation : Synopsis et Question juste en dessous */}
            <div className="py-1 space-y-2.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Synopsis
                </span>
                <p className="text-stone-700 text-xs sm:text-[13px] leading-relaxed">
                  {currentTopic.synopsis || currentTopic.description}
                </p>
              </div>

              {currentTopic.question && (
                <div className="pt-2 border-t border-stone-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A2482B] block mb-1">
                    Question
                  </span>
                  <p className="text-stone-800 text-xs sm:text-[12.5px] font-medium leading-relaxed italic">
                    « {currentTopic.question} »
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODALE STORIES STUDIO COVERFLOW                                         */}
      {/* ========================================================================= */}
      <StoriesStudioCoverflow
        isOpen={isStoryViewerOpen}
        stories={FOCUS_THEMATIC_STORIES}
        initialIndex={storyViewerIndex}
        onClose={() => setIsStoryViewerOpen(false)}
        onNavigateToTopic={handleOpenTopicFromStory}
      />

      {/* ========================================================================= */}
      {/* 5. MODALE DE PARTAGE                                                      */}
      {/* ========================================================================= */}
      {shareItem && (
        <VideoCardShareModal
          isOpen={true}
          onClose={() => setShareItem(null)}
          videoTitle={shareItem.title}
          videoId={shareItem.id}
          shareUrl={typeof window !== 'undefined' ? `${window.location.origin}/focus?topic=${currentTopic.id}` : ''}
        />
      )}

    </div>
  );
};
