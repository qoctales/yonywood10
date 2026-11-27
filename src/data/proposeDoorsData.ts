import React from 'react';
import { DimensionIcon } from '../components/DimensionIcon';
import { DIMENSIONS, getSubcategoriesForDimension } from './dimensionsData';
import { SERIES_REGISTRY } from './seriesRegistry';

export interface ProposeSubject {
  id: string;
  title: string;
  subtitle: string;
  question?: string;
  synopsis?: string;
  videoUrl: string;
  posterUrl: string;
  actionLabel: string;
  doorId?: string;
  iconName?: string;
  covers?: string[];
  accentColor?: string;
  glowColor?: string;
  bgGradient?: string;
  badge?: string;
}

export interface ProposeDoor {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  tagline: string;
  videoUrl: string;
  posterUrl: string;
  advantages: string[];
  actionDoorLabel: string;
  subjects: ProposeSubject[];
}

const STOCK_VIDEOS = [
  '/sample.mp4',
  '/sample.mp4',
  '/sample.mp4',
  '/sample.mp4',
  '/sample.mp4'
];

const SERIES_STYLES: Record<string, { accentColor: string; glowColor: string; bgGradient: string }> = {
  'modernite-tradition': {
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.65)',
    bgGradient: 'from-emerald-600 via-teal-700 to-[#121F4B]'
  },
  'jesus-legba': {
    accentColor: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.65)',
    bgGradient: 'from-amber-600 via-orange-700 to-[#121F4B]'
  },
  'phd-apprentis': {
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.65)',
    bgGradient: 'from-amber-500 via-yellow-700 to-[#121F4B]'
  },
  'blacks-one-wowmen': {
    accentColor: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.65)',
    bgGradient: 'from-pink-600 via-rose-700 to-[#121F4B]'
  },
  'bambous-irokos': {
    accentColor: '#EAB308',
    glowColor: 'rgba(234, 179, 8, 0.65)',
    bgGradient: 'from-yellow-600 via-amber-700 to-[#121F4B]'
  },
  'horizons-benin': {
    accentColor: '#0284C7',
    glowColor: 'rgba(2, 132, 199, 0.65)',
    bgGradient: 'from-sky-600 via-blue-800 to-[#121F4B]'
  },
  'builders-coachs': {
    accentColor: '#84CC16',
    glowColor: 'rgba(132, 204, 22, 0.65)',
    bgGradient: 'from-lime-600 via-green-700 to-[#121F4B]'
  },
  'regards-paroles': {
    accentColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.65)',
    bgGradient: 'from-purple-600 via-violet-700 to-[#121F4B]'
  }
};

// Les 8 séries documentaires fondatrices
const SERIES_SUBJECTS: ProposeSubject[] = SERIES_REGISTRY.map((series, index) => {
  const style = SERIES_STYLES[series.id] || SERIES_STYLES['modernite-tradition'];
  return {
    id: series.id,
    title: series.title,
    subtitle: `${series.partA.name} face à ${series.partB.name}.`,
    synopsis: series.synopsis,
    question: series.episodes[0].question,
    videoUrl: STOCK_VIDEOS[index % STOCK_VIDEOS.length],
    posterUrl: series.posterUrl,
    actionLabel: 'Choisir cette série',
    doorId: 'series',
    iconName: `16-series/${series.id}`,
    accentColor: style.accentColor,
    glowColor: style.glowColor,
    bgGradient: style.bgGradient
  };
});

// Helper pour créer l'icône dynamique d'une porte
function createDoorIcon(iconeName: string): React.FC<{ className?: string }> {
  const IconComponent: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => 
    React.createElement(DimensionIcon, {
      name: iconeName,
      className,
      size: 18,
      strokeWidth: 1.8
    });
  IconComponent.displayName = `DoorIcon_${iconeName}`;
  return IconComponent;
}

// Construction des 16 portes officielles
export const PROPOSE_DOORS: ProposeDoor[] = DIMENSIONS.map((dim, idx) => {
  if (dim.id === 'series') {
    return {
      id: 'series',
      label: 'Séries',
      icon: createDoorIcon('16-series/_dimension'),
      tagline: 'Racontez votre histoire face à un alter ego d’un autre continent.',
      videoUrl: STOCK_VIDEOS[0],
      posterUrl: '/Posters/Onboardings/series-feed-hero.jpg',
      actionDoorLabel: 'Choisir cette porte',
      advantages: [
        'Dialogue face-à-face avec un alter ego d’un autre continent.',
        'Raconter votre histoire intime face aux grandes épreuves humaines.',
        'Mise en miroir de traditions et de spiritualités d’égal à égal.',
        'Réalisation cinématographique 9:16 soignée par Gbadoo.',
        'Diffusion pérenne au cœur des séries fondatrices de la plateforme.'
      ],
      subjects: SERIES_SUBJECTS
    };
  }

  const subcats = getSubcategoriesForDimension(dim.id);
  const subjects: ProposeSubject[] = subcats.map((sc, sIdx) => ({
    id: sc.slug,
    title: sc.label,
    subtitle: sc.tagline || `${dim.label} · ${sc.label}`,
    synopsis: sc.description || `Témoignage face caméra explorant la dimension ${dim.label} à travers le prisme de ${sc.label}.`,
    question: sc.question || `Quelle histoire singulière souhaitez-vous partager sur le thème de « ${sc.label} » ?`,
    videoUrl: STOCK_VIDEOS[sIdx % STOCK_VIDEOS.length],
    posterUrl: sc.photoUrl || dim.coverImage,
    actionLabel: `Choisir ce sujet`,
    doorId: dim.id,
    iconName: sc.icone,
    accentColor: sc.accentColor || dim.accentColor,
    glowColor: sc.glowColor || dim.glowColor,
    bgGradient: sc.bgGradient || dim.bgGradient,
    badge: sc.badge
  }));

  return {
    id: dim.id,
    label: dim.label,
    icon: createDoorIcon(dim.icone),
    tagline: dim.tagline,
    videoUrl: STOCK_VIDEOS[idx % STOCK_VIDEOS.length],
    posterUrl: dim.coverImage,
    actionDoorLabel: 'Choisir cette porte',
    advantages: [
      `Diffusion officielle dans la dimension « ${dim.label} » de l'astrolabe.`,
      `Récit court 9:16 face caméra centré sur la transmission et la vérité du vécu.`,
      `Valorisation pérenne de votre mémoire et de votre expérience vécue.`,
      `Référencement parmi les témoins clés cooptés par la communauté.`,
      `Accompagnement par les cinéastes de la communauté Gbadoo.`
    ],
    subjects
  };
});

export function getDoorById(id: string): ProposeDoor | undefined {
  return PROPOSE_DOORS.find(d => d.id === id);
}

export function getSubjectByDoorAndId(doorId: string, subjectId: string): ProposeSubject | undefined {
  const door = getDoorById(doorId);
  if (!door) return undefined;
  return door.subjects.find(s => s.id === subjectId);
}
