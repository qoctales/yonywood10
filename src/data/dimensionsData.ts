import { LEGACY_SERIES_MAPPING, SERIES_POSTER_FILES } from './legacySeriesIds';

export interface Dimension {
  id: string; // 'series', 'sagesses', etc.
  ordre: number; // 1 à 8
  label: string;
  shortLabel: string;
  folder: string; // '16-series', '01-sagesses', etc.
  icone: string; // '16-series/_dimension', etc.
  tagline: string;
  description: string;
  badge: string;
  accentColor: string;
  glowColor: string;
  bgGradient: string;
  coverImage: string;
}

export interface SousCategorie {
  id: string; // composite 'dimension/slug', ex: 'sagesses/epreuves'
  dimensionId: string; // 'series', 'sagesses', etc.
  slug: string; // 'epreuves', etc.
  ordre: number; // 1 à 8
  label: string;
  icone: string; // '01-sagesses/epreuves'
  question?: string;
  tagline?: string;
  description?: string;
  badge?: string;
  photoUrl?: string;
  accentColor?: string;
  glowColor?: string;
  bgGradient?: string;
}

// =========================================================================
// SOURCE UNIQUE DE VÉRITÉ : LES 8 GRANDES PORTES OFFICIELLES YONYWOOD
// 1. Séries
// 2. Sagesses
// 3. Territoires
// 4. Expertises
// 5. Produits et services
// 6. Projets
// 7. Marques
// 8. Personnalités
// =========================================================================
export const DIMENSIONS: Dimension[] = [
  {
    id: 'series',
    ordre: 1,
    folder: '16-series',
    label: 'Séries',
    shortLabel: 'Séries',
    icone: '16-series/_dimension',
    tagline: '8 séries documentaires fondatrices et leurs pionniers',
    description: 'Explorez les séries documentaires fondatrices et leurs protagonistes en miroir. Remontez le fil des transmissions de génération en génération.',
    badge: '8 séries fondatrices',
    accentColor: '#C89B3C',
    glowColor: 'rgba(200, 155, 60, 0.65)',
    bgGradient: 'from-[#D97706] via-[#92400E] to-[#451A03]',
    coverImage: '/Posters/Onboardings/choixdesseries.png'
  },
  {
    id: 'sagesses',
    ordre: 2,
    folder: '01-sagesses',
    label: 'Sagesses',
    shortLabel: 'Sagesses',
    icone: '01-sagesses/_dimension',
    tagline: '8 thématiques de vie universelles',
    description: 'Face aux grands tournants de l’existence, les témoins partagent les enseignements reçus et forgés à travers les épreuves.',
    badge: '8 sagesses universelles',
    accentColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.65)',
    bgGradient: 'from-[#A855F7] via-[#7E22CE] to-[#3B0764]',
    coverImage: '/Posters/Sides/Irokos.png'
  },
  {
    id: 'territoires',
    ordre: 3,
    folder: '02-territoires',
    label: 'Territoires',
    shortLabel: 'Territoires',
    icone: '02-territoires/_dimension',
    tagline: 'Lieux d’ancrage, racines et chemins d’exil',
    description: 'Des villages de terre rouge aux métropoles vibrantes, la géographie intime qui façonne notre regard sur le monde.',
    badge: '8 horizons de vie',
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.65)',
    bgGradient: 'from-[#10B981] via-[#047857] to-[#064E3B]',
    coverImage: '/assets/Onboardings/Voyage.png'
  },
  {
    id: 'expertises',
    ordre: 4,
    folder: '03-expertises',
    label: 'Expertises',
    shortLabel: 'Expertises',
    icone: '03-expertises/_dimension',
    tagline: 'Métiers, compétences et vocations',
    description: 'De l’artisanat d’art aux technologies de pointe, l’intelligence de la main, de l’esprit et du cœur.',
    badge: '8 domaines de maîtrise',
    accentColor: '#0EA5E9',
    glowColor: 'rgba(14, 165, 233, 0.65)',
    bgGradient: 'from-[#0EA5E9] via-[#0369A1] to-[#082F49]',
    coverImage: '/Posters/Sides/Apprentis.png'
  },
  {
    id: 'produits-services',
    ordre: 5,
    folder: '04-produits-services',
    label: 'Produits et services',
    shortLabel: 'Produits & Serv.',
    icone: '04-produits-services/_dimension',
    tagline: 'Créations, soins, offres et utilité concrète',
    description: 'Ce que nous concevons pour nourrir, vêtir, soigner et embellir le quotidien des nôtres.',
    badge: '8 filières créatives',
    accentColor: '#6366F1',
    glowColor: 'rgba(99, 102, 241, 0.65)',
    bgGradient: 'from-[#6366F1] via-[#4338CA] to-[#1E1B4B]',
    coverImage: '/Posters/Focus/E%20Vivi.png'
  },
  {
    id: 'projets',
    ordre: 6,
    folder: '05-projets',
    label: 'Projets',
    shortLabel: 'Projets',
    icone: '05-projets/_dimension',
    tagline: 'Initiatives citoyennes, entreprises et élans de vie',
    description: 'Les aventures collectives et individuelles qui transforment notre communauté et construisent demain.',
    badge: '8 dynamiques d’action',
    accentColor: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.65)',
    bgGradient: 'from-[#EC4899] via-[#BE185D] to-[#500724]',
    coverImage: '/Posters/Sides/Builders.png'
  },
  {
    id: 'marques',
    ordre: 7,
    folder: '06-marques',
    label: 'Marques',
    shortLabel: 'Marques',
    icone: '06-marques/_dimension',
    tagline: 'Maisons emblématiques, confiance et histoire',
    description: 'Les enseignes, manufactures et labels qui portent une signature, une exigence et une fidélité intergénérationnelle.',
    badge: '8 univers de marques',
    accentColor: '#FB923C',
    glowColor: 'rgba(251, 146, 60, 0.65)',
    bgGradient: 'from-[#FB923C] via-[#C2410C] to-[#431407]',
    coverImage: '/Posters/Focus/Fiat%20Luxe.png'
  },
  {
    id: 'personnalites',
    ordre: 8,
    folder: '07-personnalites',
    label: 'Personnalités',
    shortLabel: 'Personnalités',
    icone: '07-personnalites/_dimension',
    tagline: 'Figures de proue, créateurs et voix marquantes',
    description: 'Celles et ceux dont la parole, le geste ou le destin ont ouvert une brèche et guidé les esprits.',
    badge: '8 horizons d’influence',
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.65)',
    bgGradient: 'from-[#F59E0B] via-[#B45309] to-[#78350F]',
    coverImage: '/Posters/Focus/Artistes.png'
  }
];

// =========================================================================
// SOURCE UNIQUE DE VÉRITÉ : LES 8 SOUS-CATÉGORIES DE CHAQUE PORTE
// Chaque catégorie dispose d'un visuel vibrant, d'un registre de couleurs
// distinctif et d'une question d'amorce puissante.
// =========================================================================
export const SOUS_CATEGORIES: SousCategorie[] = [
  // -----------------------------------------------------------------------
  // 01. SÉRIES (LES 8 SÉRIES FONDATRICES)
  // -----------------------------------------------------------------------
  {
    id: 'series/modernite-tradition',
    dimensionId: 'series',
    slug: 'modernite-tradition',
    ordre: 1,
    label: 'Modernité ‹ › Tradition',
    icone: '16-series/modernite-tradition',
    question: 'Racontez le moment où vous avez compris que ce métier serait le vôtre.',
    tagline: 'Méthodes récentes et savoirs transmis face à face',
    description: "Deux façons de faire que l'on oppose souvent, alors qu'elles cohabitent chaque jour : Modernité et Tradition.",
    badge: 'Série savoirs & métiers',
    photoUrl: SERIES_POSTER_FILES['modernite-tradition'].mainPosterUrl,
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    bgGradient: 'from-emerald-600 via-teal-700 to-stone-900'
  },
  {
    id: 'series/jesus-legba',
    dimensionId: 'series',
    slug: 'jesus-legba',
    ordre: 2,
    label: 'Jesus ‹ › Legba',
    icone: '16-series/jesus-legba',
    question: "Racontez le moment où vous avez senti qu'il existait quelque chose de plus grand que vous.",
    tagline: 'Chrétiens face aux pratiquants du Vodun et des traditions liées à Legba',
    description: "Au Bénin, la foi chrétienne et le Vodun coexistent au cœur des familles, des quartiers et des consciences.",
    badge: 'Série foi & traditions',
    photoUrl: SERIES_POSTER_FILES['jesus-legba'].mainPosterUrl,
    accentColor: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.6)',
    bgGradient: 'from-amber-600 via-orange-700 to-stone-900'
  },
  {
    id: 'series/phd-apprentis',
    dimensionId: 'series',
    slug: 'phd-apprentis',
    ordre: 3,
    label: 'PhD ‹ › Apprentis',
    icone: '16-series/phd-apprentis',
    question: 'Racontez votre tout premier jour là où vous avez commencé à apprendre votre métier.',
    tagline: 'Docteurs et chercheurs face aux apprentis et stagiaires de terrain',
    description: "Deux façons d'apprendre que l'on met rarement face à face : par les livres et la recherche, ou par la main.",
    badge: 'Série savoir & apprentissage',
    photoUrl: SERIES_POSTER_FILES['phd-apprentis'].mainPosterUrl,
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    bgGradient: 'from-amber-500 via-yellow-700 to-stone-900'
  },
  {
    id: 'series/blacks-one-wowmen',
    dimensionId: 'series',
    slug: 'blacks-one-wowmen',
    ordre: 4,
    label: 'Blacks One ‹ › Wowmen',
    icone: '16-series/blacks-one-wowmen',
    question: 'Racontez le moment où vous avez appris à être fier de qui vous êtes.',
    tagline: 'Identités noires face à la force et la beauté des femmes',
    description: "Deux manières de dire ce qui compte : l'unité dans la diversité des mondes noirs et le regard porté sur les femmes.",
    badge: 'Série fierté & dignité',
    photoUrl: SERIES_POSTER_FILES['blacks-one-wowmen'].mainPosterUrl,
    accentColor: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    bgGradient: 'from-pink-600 via-rose-700 to-stone-900'
  },
  {
    id: 'series/bambous-irokos',
    dimensionId: 'series',
    slug: 'bambous-irokos',
    ordre: 5,
    label: 'Bambous ‹ › Irokos',
    icone: '16-series/bambous-irokos',
    question: 'Racontez le jour où une personne d’un autre âge que le vôtre vous a appris quelque chose que vous n’avez jamais oublié.',
    tagline: 'La jeunesse qui se lance face à la sagesse des aînés',
    description: "Deux âges de la vie en dialogue : l'élan du bambou qui pousse vite et la profondeur de l'iroko qui dure.",
    badge: 'Série générations',
    photoUrl: SERIES_POSTER_FILES['bambous-irokos'].mainPosterUrl,
    accentColor: '#EAB308',
    glowColor: 'rgba(234, 179, 8, 0.6)',
    bgGradient: 'from-yellow-600 via-amber-700 to-stone-900'
  },
  {
    id: 'series/horizons-benin',
    dimensionId: 'series',
    slug: 'horizons-benin',
    ordre: 6,
    label: 'Horizons ‹ › Benin',
    icone: '16-series/horizons-benin',
    question: 'Racontez le moment où vous avez senti que vous étiez enfin chez vous.',
    tagline: 'D’autres nations face au Bénin et à sa diaspora',
    description: "Chacun a un endroit auquel il se sent profondément lié. Horizons rassemble d'autres nations face au Bénin.",
    badge: 'Série lieux & racines',
    photoUrl: SERIES_POSTER_FILES['horizons-benin'].mainPosterUrl,
    accentColor: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    bgGradient: 'from-blue-600 via-indigo-700 to-stone-900'
  },
  {
    id: 'series/builders-coachs',
    dimensionId: 'series',
    slug: 'builders-coachs',
    ordre: 7,
    label: 'Builders ‹ › Coachs',
    icone: '16-series/builders-coachs',
    question: "Racontez le moment où vous avez choisi cette voie, avec ce qu'elle comportait de risque ou de renoncement.",
    tagline: 'Celles et ceux qui bâtissent face à celles et ceux qui accompagnent',
    description: "Deux façons de faire grandir : ceux qui construisent et ceux qui conseillent, soutiennent ou orientent.",
    badge: 'Série bâtir & accompagner',
    photoUrl: SERIES_POSTER_FILES['builders-coachs'].mainPosterUrl,
    accentColor: '#84CC16',
    glowColor: 'rgba(132, 204, 22, 0.6)',
    bgGradient: 'from-lime-600 via-green-700 to-stone-900'
  },
  {
    id: 'series/regards-paroles',
    dimensionId: 'series',
    slug: 'regards-paroles',
    ordre: 8,
    label: 'Images ‹ › Paroles',
    icone: '16-series/regards-paroles',
    question: "Racontez le moment où vous avez compris que vous aviez quelque chose à faire ressentir aux autres, et que c'était à vous de le faire.",
    tagline: 'L’œil de l’image face aux maîtres de la parole et du verbe',
    description: "Deux façons de faire entendre une histoire : par les regards ou par la voix. Images réunit photographes, vidéastes, cinéastes et artistes visuels ; Paroles réunit écrivains, poètes, slameurs, conteurs et orateurs.",
    badge: 'Série regard & voix',
    photoUrl: SERIES_POSTER_FILES['regards-paroles'].mainPosterUrl,
    accentColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    bgGradient: 'from-purple-600 via-violet-700 to-stone-900'
  },

  // -----------------------------------------------------------------------
  // 02. SAGESSES (8 SOUS-CATÉGORIES OFFICIELLES)
  // 1. Résilience
  // 2. Amour
  // 3. Solidarité
  // 4. Gratitude
  // 5. Persévérance
  // 6. Bienveillance
  // 7. Pardon
  // -----------------------------------------------------------------------
  // 01. SAGESSES (4 DIRECTIONS OFFICIELLES)
  // 1. Résilience
  // 2. Amour
  // 3. Solidarité
  // 4. Gratitude
  // -----------------------------------------------------------------------
  {
    id: 'sagesses/resilience',
    dimensionId: 'sagesses',
    slug: 'resilience',
    ordre: 1,
    label: 'Résilience',
    icone: '01-sagesses/resilience',
    question: 'Quelle épreuve majeure a brisé vos certitudes pour forger votre résilience et votre force intérieure ?',
    tagline: 'La traversée de l’adversité, l’épreuve et la reconstruction intérieure',
    badge: 'Résilience',
    photoUrl: '/assets/duos/athlete-hurdle.jpg',
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    bgGradient: 'from-amber-500 via-orange-600 to-stone-950'
  },
  {
    id: 'sagesses/amour',
    dimensionId: 'sagesses',
    slug: 'amour',
    ordre: 2,
    label: 'Amour',
    icone: '01-sagesses/amour',
    question: 'Comment cultivez-vous l’harmonie, la fidélité et le don de soi face aux tempêtes de l’existence ?',
    tagline: 'L’amour véritable, la tendresse partagée et le compagnonnage',
    badge: 'Amour',
    photoUrl: '/Posters/Sides/Wowmen.png',
    accentColor: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    bgGradient: 'from-pink-500 via-rose-600 to-stone-950'
  },
  {
    id: 'sagesses/solidarite',
    dimensionId: 'sagesses',
    slug: 'solidarite',
    ordre: 3,
    label: 'Solidarité',
    icone: '01-sagesses/solidarite',
    question: 'Quel geste d’entraide ou d’engagement collectif a renforcé votre foi en la communauté ?',
    tagline: 'L’union fraternelle, le soutien mutuel et le vivre-ensemble',
    badge: 'Solidarité',
    photoUrl: '/Posters/Onboardings/coproductions.png',
    accentColor: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    bgGradient: 'from-orange-500 via-amber-700 to-stone-950'
  },
  {
    id: 'sagesses/gratitude',
    dimensionId: 'sagesses',
    slug: 'gratitude',
    ordre: 4,
    label: 'Gratitude',
    icone: '01-sagesses/gratitude',
    question: 'Pour quelle bénédiction ou quel enseignement de vie éprouvez-vous chaque jour une profonde gratitude ?',
    tagline: 'La reconnaissance du cœur, l’émerveillement et la paix de l’esprit',
    badge: 'Gratitude',
    photoUrl: '/Posters/Focus/Hoxo%CC%80.png',
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    bgGradient: 'from-emerald-500 via-teal-700 to-stone-950'
  },
  {
    id: 'sagesses/perseverance',
    dimensionId: 'sagesses',
    slug: 'perseverance',
    ordre: 5,
    label: 'Persévérance',
    icone: '01-sagesses/perseverance',
    question: 'Face aux obstacles insurmontables, comment avez-vous puisé l’énergie de continuer sans jamais abandonner ?',
    tagline: 'La ténacité, l’effort continu et le dépassement des limites',
    badge: 'Persévérance',
    photoUrl: '/assets/duos/tobi-ganvie.jpg',
    accentColor: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    bgGradient: 'from-blue-500 via-indigo-700 to-stone-950'
  },
  {
    id: 'sagesses/bienveillance',
    dimensionId: 'sagesses',
    slug: 'bienveillance',
    ordre: 6,
    label: 'Bienveillance',
    icone: '01-sagesses/bienveillance',
    question: 'Quel acte d’écoute, de douceur ou de compassion a transformé votre regard sur autrui ?',
    tagline: 'La gentillesse sincère, l’empathie et la protection des vulnérables',
    badge: 'Bienveillance',
    photoUrl: '/assets/duos/care-mireille.jpg',
    accentColor: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    bgGradient: 'from-cyan-500 via-teal-700 to-stone-950'
  },
  {
    id: 'sagesses/pardon',
    dimensionId: 'sagesses',
    slug: 'pardon',
    ordre: 7,
    label: 'Pardon',
    icone: '01-sagesses/pardon',
    question: 'Quel pardon difficile a libéré votre âme et guéri les blessures du passé ?',
    tagline: 'La réconciliation, la paix retrouvée et la libération intérieure',
    badge: 'Pardon',
    photoUrl: '/Posters/Sides/Jesus.png',
    accentColor: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.6)',
    bgGradient: 'from-violet-500 via-purple-700 to-stone-950'
  },
  {
    id: 'sagesses/humilite',
    dimensionId: 'sagesses',
    slug: 'humilite',
    ordre: 8,
    label: 'Humilité',
    icone: '01-sagesses/humilite',
    question: 'Quelle leçon de vie vous a rappelé la valeur de la modestie et du respect envers nos aînés et la Terre ?',
    tagline: 'La modestie du sage, l’écoute patiente et le respect des racines',
    badge: 'Humilité',
    photoUrl: '/Posters/Sides/Irokos.png',
    accentColor: '#EAB308',
    glowColor: 'rgba(234, 179, 8, 0.6)',
    bgGradient: 'from-yellow-500 via-amber-700 to-stone-950'
  },

  // -----------------------------------------------------------------------
  // 03. TERRITOIRES (8 SOUS-CATÉGORIES OFFICIELLES)
  // 1. Patrimoine
  // 2. Traditions
  // 3. Culture
  // 4. Histoire
  // 5. Terroirs
  // 6. Langues
  // 7. Diaspora
  // 8. Habitudes
  // -----------------------------------------------------------------------
  {
    id: 'territoires/patrimoine',
    dimensionId: 'territoires',
    slug: 'patrimoine',
    ordre: 1,
    label: 'Patrimoine',
    icone: '02-territoires/patrimoine',
    question: 'Quel monument, cité ancienne ou vestige séculaire incarne le trésor de vos ancêtres ?',
    tagline: 'Les pierres sacrées, l’architecture séculaire et les sanctuaires vivants',
    badge: 'Patrimoine',
    photoUrl: '/Posters/Sides/Benin.png',
    accentColor: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.6)',
    bgGradient: 'from-amber-600 via-yellow-800 to-stone-950'
  },
  {
    id: 'territoires/traditions',
    dimensionId: 'territoires',
    slug: 'traditions',
    ordre: 2,
    label: 'Traditions',
    icone: '02-territoires/traditions',
    question: 'Quelle fête coutumière ou rite ancestral réveille en vous le sentiment d’appartenance ?',
    tagline: 'Les cérémonies, les tambours, les danses et la mémoire vivante',
    badge: 'Traditions',
    photoUrl: '/Posters/Sides/Tradition.png',
    accentColor: '#E11D48',
    glowColor: 'rgba(225, 29, 72, 0.6)',
    bgGradient: 'from-rose-500 via-red-700 to-stone-950'
  },
  {
    id: 'territoires/culture',
    dimensionId: 'territoires',
    slug: 'culture',
    ordre: 3,
    label: 'Culture',
    icone: '02-territoires/culture',
    question: 'Quelle expression culturelle singulière fait battre le cœur de votre région ?',
    tagline: 'L’art vivant, les récits partagés, la musique et la vivacité populaire',
    badge: 'Culture',
    photoUrl: '/Posters/Sides/Legba.png',
    accentColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    bgGradient: 'from-purple-500 via-violet-700 to-stone-950'
  },
  {
    id: 'territoires/histoire',
    dimensionId: 'territoires',
    slug: 'histoire',
    ordre: 4,
    label: 'Histoire',
    icone: '02-territoires/histoire',
    question: 'Quel événement fondateur ou épopée héroïque a forgé l’identité de votre territoire ?',
    tagline: 'Les batailles, les traités, les royaumes et la transmission des aïeux',
    badge: 'Histoire',
    photoUrl: '/assets/duos/dah-zounon.jpg',
    accentColor: '#2563EB',
    glowColor: 'rgba(37, 99, 235, 0.6)',
    bgGradient: 'from-blue-600 via-indigo-800 to-stone-950'
  },
  {
    id: 'territoires/terroirs',
    dimensionId: 'territoires',
    slug: 'terroirs',
    ordre: 5,
    label: 'Terroirs',
    icone: '02-territoires/terroirs',
    question: 'Quelle saveur, produit de la terre ou paysage nourricier caractérise vos terroirs ?',
    tagline: 'La terre nourricière, les villages, les cultures et les saveurs uniques',
    badge: 'Terroirs',
    photoUrl: '/Posters/Focus/E%20Vivi.png',
    accentColor: '#16A34A',
    glowColor: 'rgba(22, 163, 74, 0.6)',
    bgGradient: 'from-green-600 via-emerald-800 to-stone-950'
  },
  {
    id: 'territoires/langues',
    dimensionId: 'territoires',
    slug: 'langues',
    ordre: 6,
    label: 'Langues',
    icone: '02-territoires/langues',
    question: 'Quelle langue ou dialecte de votre terre maternelle porte l’âme de vos pensées ?',
    tagline: 'Les parlers maternels, la poésie orale, les proverbes et la résonance des mots',
    badge: 'Langues',
    photoUrl: '/Posters/Sides/Paroles.png',
    accentColor: '#EA580C',
    glowColor: 'rgba(234, 88, 12, 0.6)',
    bgGradient: 'from-orange-600 via-amber-800 to-stone-950'
  },
  {
    id: 'territoires/diaspora',
    dimensionId: 'territoires',
    slug: 'diaspora',
    ordre: 7,
    label: 'Diaspora',
    icone: '02-territoires/diaspora',
    question: 'Comment gardez-vous le lien vivant avec votre terre d’origine depuis l’exil ou l’étranger ?',
    tagline: 'Les ponts entre continents, les retours au pays et le double ancrage',
    badge: 'Diaspora',
    photoUrl: '/Posters/Focus/Diasporas.png',
    accentColor: '#0EA5E9',
    glowColor: 'rgba(14, 165, 233, 0.6)',
    bgGradient: 'from-sky-500 via-cyan-700 to-stone-950'
  },
  {
    id: 'territoires/habitudes',
    dimensionId: 'territoires',
    slug: 'habitudes',
    ordre: 8,
    label: 'Habitudes',
    icone: '02-territoires/habitudes',
    question: 'Quel rituel quotidien ou habitude de vie locale incarne la saveur de vos journées ?',
    tagline: 'L’art de vivre quotidien, la convivialité et les gestes partagés',
    badge: 'Habitudes',
    photoUrl: '/Posters/Sides/Horizons.png',
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    bgGradient: 'from-amber-500 via-orange-700 to-stone-950'
  },

  // -----------------------------------------------------------------------
  // 04. EXPERTISES (8 SOUS-CATÉGORIES OFFICIELLES)
  // 1. Artisanat
  // 2. Éducation
  // 3. Numérique
  // 4. Business
  // 5. Justice
  // 6. Santé
  // 7. Sécurité
  // 8. Design
  // -----------------------------------------------------------------------
  {
    id: 'expertises/artisanat',
    dimensionId: 'expertises',
    slug: 'artisanat',
    ordre: 1,
    label: 'Artisanat',
    icone: '03-expertises/artisanat',
    question: 'Quel geste d’orfèvre ou savoir-faire manuel perpétuez-vous pour honorer la matière ?',
    tagline: 'La noblesse du travail de la main, la forge, le cuir, le bois et le tissage',
    badge: 'Artisanat',
    photoUrl: '/Posters/Sides/Apprentis.png',
    accentColor: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.6)',
    bgGradient: 'from-amber-600 via-yellow-800 to-stone-950'
  },
  {
    id: 'expertises/education',
    dimensionId: 'expertises',
    slug: 'education',
    ordre: 2,
    label: 'Éducation',
    icone: '03-expertises/education',
    question: 'Comment éveillez-vous l’esprit critique et transmettez-vous les clés du savoir aux jeunes générations ?',
    tagline: 'La pédagogie, la formation, l’école et les repères durables',
    badge: 'Éducation',
    photoUrl: '/Posters/Sides/PhD.png',
    accentColor: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    bgGradient: 'from-blue-500 via-indigo-700 to-stone-950'
  },
  {
    id: 'expertises/numerique',
    dimensionId: 'expertises',
    slug: 'numerique',
    ordre: 3,
    label: 'Numérique',
    icone: '03-expertises/numerique',
    question: 'Comment mettez-vous la technologie et le code au service de solutions concrètes et humaines ?',
    tagline: 'L’ingénierie logicielle, les données, l’intelligence artificielle et l’innovation',
    badge: 'Numérique',
    photoUrl: '/Posters/Sides/Modernite%CC%81.png',
    accentColor: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    bgGradient: 'from-cyan-500 via-teal-700 to-stone-950'
  },
  {
    id: 'expertises/business',
    dimensionId: 'expertises',
    slug: 'business',
    ordre: 4,
    label: 'Business',
    icone: '03-expertises/business',
    question: 'Quelle vision stratégique et quel modèle d’entreprise crée durablement de la valeur partagée ?',
    tagline: 'La finance d’entreprise, la gestion stratégique, le commerce et l’expansion',
    badge: 'Business',
    photoUrl: '/Posters/Sides/Builders.png',
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    bgGradient: 'from-amber-500 via-orange-700 to-stone-950'
  },
  {
    id: 'expertises/justice',
    dimensionId: 'expertises',
    slug: 'justice',
    ordre: 5,
    label: 'Justice',
    icone: '03-expertises/justice',
    question: 'Comment défendez-vous le droit, l’équité et la protection des plus vulnérables ?',
    tagline: 'L’état de droit, le barreau, la médiation et la rectitude juridique',
    badge: 'Justice',
    photoUrl: '/Posters/Focus/Votre%20Honneur.png',
    accentColor: '#0284C7',
    glowColor: 'rgba(2, 132, 199, 0.6)',
    bgGradient: 'from-sky-600 via-blue-800 to-stone-950'
  },
  {
    id: 'expertises/sante',
    dimensionId: 'expertises',
    slug: 'sante',
    ordre: 6,
    label: 'Santé',
    icone: '03-expertises/sante',
    question: 'Quel dévouement guide votre pratique médicale ou thérapeutique au chevet des patients ?',
    tagline: 'La médecine, les soins infirmiers, la santé publique et la recherche biomédicale',
    badge: 'Santé',
    photoUrl: '/assets/duos/care-mireille.jpg',
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    bgGradient: 'from-emerald-500 via-teal-700 to-stone-950'
  },
  {
    id: 'expertises/securite',
    dimensionId: 'expertises',
    slug: 'securite',
    ordre: 7,
    label: 'Sécurité',
    icone: '03-expertises/securite',
    question: 'Quel engagement et quel courage déployez-vous pour protéger les biens et la paix civile ?',
    tagline: 'La protection civile, la cybersécurité, les secours et la sûreté collective',
    badge: 'Sécurité',
    photoUrl: '/Posters/Onboardings/securite.png',
    accentColor: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.6)',
    bgGradient: 'from-red-600 via-rose-700 to-stone-950'
  },
  {
    id: 'expertises/design',
    dimensionId: 'expertises',
    slug: 'design',
    ordre: 8,
    label: 'Design',
    icone: '03-expertises/design',
    question: 'Comment façonnez-vous des formes élégantes et des espaces intuitifs qui enchantent l’usage ?',
    tagline: 'L’architecture, le design d’espace, l’esthétique industrielle et la création visuelle',
    badge: 'Design',
    photoUrl: '/Posters/Sides/Images.png',
    accentColor: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.6)',
    bgGradient: 'from-purple-500 via-violet-700 to-stone-950'
  },

  // -----------------------------------------------------------------------
  // 05. PRODUITS ET SERVICES (8 SOUS-CATÉGORIES OFFICIELLES)
  // 1. Beauté
  // 2. Restauration
  // 3. Mode
  // 4. Bien-être
  // 5. Tourisme
  // 6. Garde d’enfants
  // 7. Conciergerie
  // 8. Immobilier
  // -----------------------------------------------------------------------
  {
    id: 'produits-services/beaute',
    dimensionId: 'produits-services',
    slug: 'beaute',
    ordre: 1,
    label: 'Beauté',
    icone: '04-produits-services/beaute',
    question: 'Quelle vision bienveillante et naturelle de la beauté sublime vos produits et soins ?',
    tagline: 'Cosmétique naturelle, parures et mise en valeur des peaux',
    badge: 'Beauté',
    photoUrl: '/Posters/Sides/Wowmen.png',
    accentColor: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.6)',
    bgGradient: 'from-rose-500 via-pink-700 to-stone-950'
  },
  {
    id: 'produits-services/restauration',
    dimensionId: 'produits-services',
    slug: 'restauration',
    ordre: 2,
    label: 'Restauration',
    icone: '04-produits-services/restauration',
    question: 'Quelles saveurs authentiques et quelle hospitalité régale vos convives à table ?',
    tagline: 'Haute gastronomie, tables d’hôtes, street food d’auteur et art culinaire',
    badge: 'Restauration',
    photoUrl: '/assets/duos/chef-koffi.jpg',
    accentColor: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    bgGradient: 'from-orange-500 via-red-700 to-stone-950'
  },
  {
    id: 'produits-services/mode',
    dimensionId: 'produits-services',
    slug: 'mode',
    ordre: 3,
    label: 'Mode',
    icone: '04-produits-services/mode',
    question: 'Comment vos collections habillent-elles les silhouettes avec identité et panache ?',
    tagline: 'Textile éthique, coupes contemporaines et matières nobles',
    badge: 'Mode',
    photoUrl: '/assets/duos/fatou-diallo.jpg',
    accentColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    bgGradient: 'from-purple-500 via-violet-700 to-stone-950'
  },
  {
    id: 'produits-services/bien-etre',
    dimensionId: 'produits-services',
    slug: 'bien-etre',
    ordre: 4,
    label: 'Bien-être',
    icone: '04-produits-services/bien-etre',
    question: 'Quelle méthode de relaxation ou soin holistique offre un havre de paix à l’esprit ?',
    tagline: 'Massages, spas, méditation et équilibre corps-esprit',
    badge: 'Bien-être',
    photoUrl: '/assets/duos/mawuna-medium.jpg',
    accentColor: '#14B8A6',
    glowColor: 'rgba(20, 184, 166, 0.6)',
    bgGradient: 'from-teal-500 via-emerald-700 to-stone-950'
  },
  {
    id: 'produits-services/tourisme',
    dimensionId: 'produits-services',
    slug: 'tourisme',
    ordre: 5,
    label: 'Tourisme',
    icone: '04-produits-services/tourisme',
    question: 'Quelles échappées mémorables et immersions culturelles faites-vous vivre aux voyageurs ?',
    tagline: 'Écotourisme, voyages immersifs, hébergements de charme et circuits guidés',
    badge: 'Tourisme',
    photoUrl: '/assets/Onboardings/Voyage.png',
    accentColor: '#0284C7',
    glowColor: 'rgba(2, 132, 199, 0.6)',
    bgGradient: 'from-sky-500 via-blue-700 to-stone-950'
  },
  {
    id: 'produits-services/garde-enfants',
    dimensionId: 'produits-services',
    slug: 'garde-enfants',
    ordre: 6,
    label: 'Garde d’enfants',
    icone: '04-produits-services/garde-enfants',
    question: 'Quelle douceur et quel cadre d’éveil attentif assurez-vous aux tout-petits au quotidien ?',
    tagline: 'Crèches bienveillantes, nounous de confiance et activités d’éveil',
    badge: 'Garde d’enfants',
    photoUrl: '/Posters/Focus/Hoxo%CC%80.png',
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    bgGradient: 'from-emerald-500 via-teal-700 to-stone-950'
  },
  {
    id: 'produits-services/conciergerie',
    dimensionId: 'produits-services',
    slug: 'conciergerie',
    ordre: 7,
    label: 'Conciergerie',
    icone: '04-produits-services/conciergerie',
    question: 'Quel niveau d’exigence et de disponibilité sur-mesure déployez-vous pour vos résidents ?',
    tagline: 'Conciergerie privée, intendance, services VIP et assistance 24/7',
    badge: 'Conciergerie',
    photoUrl: '/Posters/Sides/Coachs.png',
    accentColor: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.6)',
    bgGradient: 'from-amber-600 via-yellow-800 to-stone-950'
  },
  {
    id: 'produits-services/immobilier',
    dimensionId: 'produits-services',
    slug: 'immobilier',
    ordre: 8,
    label: 'Immobilier',
    icone: '04-produits-services/immobilier',
    question: 'Comment dénichez-vous les lieux de vie d’exception où bâtir des mémoires durables ?',
    tagline: 'Promotion de prestige, habitats durables et gestion patrimoniale',
    badge: 'Immobilier',
    photoUrl: '/Posters/Sides/Builders.png',
    accentColor: '#6366F1',
    glowColor: 'rgba(99, 102, 241, 0.6)',
    bgGradient: 'from-indigo-500 via-blue-700 to-stone-950'
  },

  // -----------------------------------------------------------------------
  // 06. PROJETS (8 SOUS-CATÉGORIES OFFICIELLES)
  // 1. Jeux
  // 2. Écologie
  // 3. Culture
  // 4. Social
  // 5. Communautaire
  // 6. Innovation
  // 7. Entreprise
  // 8. Aventure
  // -----------------------------------------------------------------------
  {
    id: 'projets/jeux',
    dimensionId: 'projets',
    slug: 'jeux',
    ordre: 1,
    label: 'Jeux',
    icone: '05-projets/jeux',
    question: 'Quel univers ludique ou compétition stimulante rassemble petits et grands autour du jeu ?',
    tagline: 'Jeux vidéo, jeux de société traditionnels, esports et tournois',
    badge: 'Jeux',
    photoUrl: '/Posters/Focus/Pour%20Rire.png',
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    bgGradient: 'from-amber-500 via-orange-700 to-stone-950'
  },
  {
    id: 'projets/ecologie',
    dimensionId: 'projets',
    slug: 'ecologie',
    ordre: 2,
    label: 'Écologie',
    icone: '05-projets/ecologie',
    question: 'Quelle action environnementale concrète menez-vous pour préserver la terre et la biodiversité ?',
    tagline: 'Reforestation, énergies renouvelables, dépollution et agriculture régénératrice',
    badge: 'Écologie',
    photoUrl: '/Posters/Sides/Irokos.png',
    accentColor: '#22C55E',
    glowColor: 'rgba(34, 197, 94, 0.6)',
    bgGradient: 'from-green-500 via-emerald-700 to-stone-950'
  },
  {
    id: 'projets/culture',
    dimensionId: 'projets',
    slug: 'culture',
    ordre: 3,
    label: 'Culture',
    icone: '05-projets/culture',
    question: 'Quel projet artistique ou festival fédérateur réveille la flamme créative du public ?',
    tagline: 'Festivals, musées vivants, scènes ouvertes et patrimoines revisités',
    badge: 'Culture',
    photoUrl: '/Posters/Focus/Artistes.png',
    accentColor: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.6)',
    bgGradient: 'from-purple-500 via-violet-700 to-stone-950'
  },
  {
    id: 'projets/social',
    dimensionId: 'projets',
    slug: 'social',
    ordre: 4,
    label: 'Social',
    icone: '05-projets/social',
    question: 'Quelle initiative solidaire soulage la précarité et redonne dignité aux personnes fragilisées ?',
    tagline: 'Action caritative, soutien d’urgence, réinsertion et banques alimentaires',
    badge: 'Social',
    photoUrl: '/assets/duos/tobi-houndegla.jpg',
    accentColor: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.6)',
    bgGradient: 'from-red-500 via-rose-700 to-stone-950'
  },
  {
    id: 'projets/communautaire',
    dimensionId: 'projets',
    slug: 'communautaire',
    ordre: 5,
    label: 'Communautaire',
    icone: '05-projets/communautaire',
    question: 'Comment bâtissez-vous la confiance et l’entraide au sein de votre quartier ou village ?',
    tagline: 'Comités de quartier, coopératives citoyennes et lieux de vie partagés',
    badge: 'Communautaire',
    photoUrl: '/Posters/Onboardings/coproductions.png',
    accentColor: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    bgGradient: 'from-orange-500 via-amber-700 to-stone-950'
  },
  {
    id: 'projets/innovation',
    dimensionId: 'projets',
    slug: 'innovation',
    ordre: 6,
    label: 'Innovation',
    icone: '05-projets/innovation',
    question: 'Quelle solution ingénieuse et frugale inventez-vous pour surmonter un défi complexe ?',
    tagline: 'Technologies pionnières, recherche appliquée et prototypes audacieux',
    badge: 'Innovation',
    photoUrl: '/Posters/Sides/Modernite%CC%81.png',
    accentColor: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    bgGradient: 'from-cyan-500 via-sky-700 to-stone-950'
  },
  {
    id: 'projets/entreprise',
    dimensionId: 'projets',
    slug: 'entreprise',
    ordre: 7,
    label: 'Entreprise',
    icone: '05-projets/entreprise',
    question: 'Comment bâtissez-vous une entreprise pérenne qui crée de l’emploi et de la souveraineté économique ?',
    tagline: 'Création d’entreprises, modèles économiques résilients et essor industriel',
    badge: 'Entreprise',
    photoUrl: '/Posters/Sides/Builders.png',
    accentColor: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    bgGradient: 'from-blue-500 via-indigo-700 to-stone-950'
  },
  {
    id: 'projets/aventure',
    dimensionId: 'projets',
    slug: 'aventure',
    ordre: 8,
    label: 'Aventure',
    icone: '05-projets/aventure',
    question: 'Quel défi audacieux ou expédition hors normes vous a poussé au-delà de vos limites ?',
    tagline: 'Explorations, expéditions terrestres et maritimes, défis extrêmes',
    badge: 'Aventure',
    photoUrl: '/assets/duos/sayri-quispe.jpg',
    accentColor: '#EA580C',
    glowColor: 'rgba(234, 88, 12, 0.6)',
    bgGradient: 'from-orange-600 via-amber-800 to-stone-950'
  },

  // -----------------------------------------------------------------------
  // 07. MARQUES (8 SOUS-CATÉGORIES OFFICIELLES)
  // 1. Luxe
  // 2. Mode
  // 3. Beauté
  // 4. Tech
  // 5. Alimentation
  // 6. Sport
  // 7. Finance
  // 8. Services
  // -----------------------------------------------------------------------
  {
    id: 'marques/luxe',
    dimensionId: 'marques',
    slug: 'luxe',
    ordre: 1,
    label: 'Luxe',
    icone: '06-marques/luxe',
    question: 'Comment alliez-vous rareté, haute manufacture et prestige intemporel dans votre maison ?',
    tagline: 'Haute joaillerie, maroquinerie d’art, parfumerie rare et maisons de légende',
    badge: 'Luxe',
    photoUrl: '/Posters/Focus/Fiat%20Luxe.png',
    accentColor: '#C89B3C',
    glowColor: 'rgba(200, 155, 60, 0.6)',
    bgGradient: 'from-amber-500 via-yellow-700 to-stone-950'
  },
  {
    id: 'marques/mode',
    dimensionId: 'marques',
    slug: 'mode',
    ordre: 2,
    label: 'Mode',
    icone: '06-marques/mode',
    question: 'Comment votre signature stylistique impose-t-elle une allure reconnaissable entre mille ?',
    tagline: 'Maisons de couture, prêt-à-porter de caractère et accessoires iconiques',
    badge: 'Mode',
    photoUrl: '/assets/duos/fatou-diallo.jpg',
    accentColor: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    bgGradient: 'from-pink-500 via-rose-700 to-stone-950'
  },
  {
    id: 'marques/beaute',
    dimensionId: 'marques',
    slug: 'beaute',
    ordre: 3,
    label: 'Beauté',
    icone: '06-marques/beaute',
    question: 'Quelle formule secrète et quel rituel précieux fidélisent vos adeptes au quotidien ?',
    tagline: 'Lignes de soins premium, cosmétiques d’auteur et fragrances signatures',
    badge: 'Beauté',
    photoUrl: '/Posters/Sides/Wowmen.png',
    accentColor: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.6)',
    bgGradient: 'from-rose-500 via-pink-700 to-stone-950'
  },
  {
    id: 'marques/tech',
    dimensionId: 'marques',
    slug: 'tech',
    ordre: 4,
    label: 'Tech',
    icone: '06-marques/tech',
    question: 'Comment votre produit technologique redéfinit-il les standards d’usage de toute une industrie ?',
    tagline: 'Constructeurs, logiciels d’exception, équipements intelligents et tech visionnaire',
    badge: 'Tech',
    photoUrl: '/Posters/Sides/Modernite%CC%81.png',
    accentColor: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    bgGradient: 'from-cyan-500 via-sky-700 to-stone-950'
  },
  {
    id: 'marques/alimentation',
    dimensionId: 'marques',
    slug: 'alimentation',
    ordre: 5,
    label: 'Alimentation',
    icone: '06-marques/alimentation',
    question: 'Quel goût inimitable et quelle fidélité au goût d’origine font la réputation de votre marque ?',
    tagline: 'Boissons légendaires, épicerie fine, chocolateries et fleurons du goût',
    badge: 'Alimentation',
    photoUrl: '/Posters/Focus/E%20Vivi.png',
    accentColor: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    bgGradient: 'from-orange-500 via-amber-700 to-stone-950'
  },
  {
    id: 'marques/sport',
    dimensionId: 'marques',
    slug: 'sport',
    ordre: 6,
    label: 'Sport',
    icone: '06-marques/sport',
    question: 'Comment accompagnez-vous l’effort, le dépassement et la ferveur des athlètes sur tous les terrains ?',
    tagline: 'Équipementiers renommés, tenues techniques et marques de performance',
    badge: 'Sport',
    photoUrl: '/assets/duos/athlete-hurdle.jpg',
    accentColor: '#EA580C',
    glowColor: 'rgba(234, 88, 12, 0.6)',
    bgGradient: 'from-orange-500 via-amber-700 to-stone-950'
  },
  {
    id: 'marques/finance',
    dimensionId: 'marques',
    slug: 'finance',
    ordre: 7,
    label: 'Finance',
    icone: '06-marques/finance',
    question: 'Comment consolidez-vous la solidité et la confiance financière nécessaire aux grandes réalisations ?',
    tagline: 'Banques historiques, assurances fiables, fonds d’investissement et microfinance',
    badge: 'Finance',
    photoUrl: '/Posters/Sides/Coachs.png',
    accentColor: '#0284C7',
    glowColor: 'rgba(2, 132, 199, 0.6)',
    bgGradient: 'from-sky-500 via-blue-700 to-stone-950'
  },
  {
    id: 'marques/services',
    dimensionId: 'marques',
    slug: 'services',
    ordre: 8,
    label: 'Services',
    icone: '06-marques/services',
    question: 'Quelle promesse de service impeccable et de sérénité honorez-vous chaque jour auprès de vos clients ?',
    tagline: 'Grands réseaux de transport, télécoms, hôtellerie et enseignes de service',
    badge: 'Services',
    photoUrl: '/Posters/Focus/Mon%20histoire%20fera%20le%20job.png',
    accentColor: '#6366F1',
    glowColor: 'rgba(99, 102, 241, 0.6)',
    bgGradient: 'from-indigo-500 via-blue-700 to-stone-950'
  },

  // -----------------------------------------------------------------------
  // 08. PERSONNALITÉS (8 SOUS-CATÉGORIES OFFICIELLES)
  // 1. Engagement
  // 2. Légendes
  // 3. Musique
  // 4. Cinéma
  // 5. Arts
  // 6. Sport
  // 7. Influenceurs
  // 8. Foi
  // -----------------------------------------------------------------------
  {
    id: 'personnalites/engagement',
    dimensionId: 'personnalites',
    slug: 'engagement',
    ordre: 1,
    label: 'Engagement',
    icone: '07-personnalites/engagement',
    question: 'Quel combat citoyen ou lutte pour la justice guide l’ensemble de votre existence ?',
    tagline: 'Défenseurs des droits, figures militantes et voix du courage civique',
    badge: 'Engagement',
    photoUrl: '/Posters/Sides/Blacks%20One.png',
    accentColor: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.6)',
    bgGradient: 'from-red-600 via-rose-700 to-stone-950'
  },
  {
    id: 'personnalites/legendes',
    dimensionId: 'personnalites',
    slug: 'legendes',
    ordre: 2,
    label: 'Légendes',
    icone: '07-personnalites/legendes',
    question: 'Quelle figure historique ou souverain bâtisseur continue d’inspirer la grandeur de votre communauté ?',
    tagline: 'Rois fondateurs, pionniers visionnaires et héros entrés dans la postérité',
    badge: 'Légendes',
    photoUrl: '/Posters/Sides/Irokos.png',
    accentColor: '#C89B3C',
    glowColor: 'rgba(200, 155, 60, 0.6)',
    bgGradient: 'from-amber-500 via-yellow-700 to-stone-950'
  },
  {
    id: 'personnalites/musique',
    dimensionId: 'personnalites',
    slug: 'musique',
    ordre: 3,
    label: 'Musique',
    icone: '07-personnalites/musique',
    question: 'Quel artiste musicien a composé la bande-son de vos émotions les plus intenses ?',
    tagline: 'Chantres de la mémoire, virtuoses, icônes du rythme et voix légendaires',
    badge: 'Musique',
    photoUrl: '/Posters/Focus/Artistes.png',
    accentColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    bgGradient: 'from-purple-500 via-violet-700 to-stone-950'
  },
  {
    id: 'personnalites/cinema',
    dimensionId: 'personnalites',
    slug: 'cinema',
    icone: '07-personnalites/cinema',
    ordre: 4,
    label: 'Cinéma',
    question: 'Quel réalisateur ou comédien a su donner un visage inoubliable à nos mémoires ?',
    tagline: 'Maîtres de l’écran, actrices et acteurs charismatiques et metteurs en scène',
    badge: 'Cinéma',
    photoUrl: '/Posters/Sides/Images.png',
    accentColor: '#E11D48',
    glowColor: 'rgba(225, 29, 72, 0.6)',
    bgGradient: 'from-rose-500 via-red-700 to-stone-950'
  },
  {
    id: 'personnalites/arts',
    dimensionId: 'personnalites',
    slug: 'arts',
    ordre: 5,
    label: 'Arts',
    icone: '07-personnalites/arts',
    question: 'Quel plasticien, sculpteur ou peintre a révolutionné votre regard sur le monde ?',
    tagline: 'Artistes plasticiens, sculpteurs, photographes d’art et créateurs d’univers',
    badge: 'Arts',
    photoUrl: '/assets/duos/performers-yede.jpg',
    accentColor: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.6)',
    bgGradient: 'from-amber-600 via-yellow-800 to-stone-950'
  },
  {
    id: 'personnalites/sport',
    dimensionId: 'personnalites',
    slug: 'sport',
    ordre: 6,
    label: 'Sport',
    icone: '07-personnalites/sport',
    question: 'Quel champion incarne la bravoure, la discipline et la noblesse dans la victoire ?',
    tagline: 'Athlètes de légende, capitaines d’équipe et médaillés olympiques',
    badge: 'Sport',
    photoUrl: '/assets/duos/athlete-hurdle.jpg',
    accentColor: '#EA580C',
    glowColor: 'rgba(234, 88, 12, 0.6)',
    bgGradient: 'from-orange-500 via-amber-700 to-stone-950'
  },
  {
    id: 'personnalites/influenceurs',
    dimensionId: 'personnalites',
    slug: 'influenceurs',
    ordre: 7,
    label: 'Influenceurs',
    icone: '07-personnalites/influenceurs',
    question: 'Quelle voix des réseaux inspire la jeunesse par son authenticité et son impact positif ?',
    tagline: 'Créateurs de contenu, voix inspirantes du web et leaders d’opinion',
    badge: 'Influenceurs',
    photoUrl: '/Posters/Sides/Bambous.png',
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    bgGradient: 'from-emerald-500 via-teal-700 to-stone-950'
  },
  {
    id: 'personnalites/foi',
    dimensionId: 'personnalites',
    slug: 'foi',
    ordre: 8,
    label: 'Foi',
    icone: '07-personnalites/foi',
    question: 'Quel guide spirituel a éclairé votre route par sa parole de vérité, d’élévation et de paix ?',
    tagline: 'Sages vénérables, gardiens du culte, guides de confrérie et voix saintes',
    badge: 'Foi',
    photoUrl: '/Posters/Sides/Jesus.png',
    accentColor: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.6)',
    bgGradient: 'from-purple-500 via-indigo-700 to-stone-950'
  }
];

// Dictionnaire rapide pour lookup par ID composite ('dimensionId/slug')
export const SOUS_CATEGORIES_BY_ID: Record<string, SousCategorie> = Object.fromEntries(
  SOUS_CATEGORIES.map(sc => [sc.id, sc])
);

// Dictionnaire rapide des dimensions
export const DIMENSIONS_BY_ID: Record<string, Dimension> = Object.fromEntries(
  DIMENSIONS.map(d => [d.id, d])
);

// Table de correspondance rétrocompatible pour les anciens alias
export const LEGACY_CATEGORY_MAP: Record<string, string> = {
  countries: 'territoires',
  thematics: 'expertises',
  questions: 'sagesses',
  brands: 'marques',
  projects: 'projets',
  offers: 'produits-services',
  personalities: 'personnalites',
  'figures-du-quotidien': 'personnalites',
  evenements: 'sagesses',
  communautes: 'projets',
  institutions: 'expertises',
  objets: 'marques',
  'savoir-faire': 'expertises',
  passions: 'sagesses',
  'moments-de-vie': 'sagesses'
};

const LEGACY_SERIES_SUBCATEGORY_ENTRIES: Record<string, string> = Object.fromEntries(
  Object.values(LEGACY_SERIES_MAPPING).flatMap((entry) => {
    const resolved =
      entry.targetSeriesId ||
      entry.splitSides?.sideBTarget?.seriesId ||
      entry.splitSides?.sideATarget?.seriesId;
    if (!resolved) return [];
    return [
      [`series/${entry.legacyId}`, `series/${resolved}`],
      [entry.legacyId, resolved]
    ];
  })
);

// Correspondances d'anciennes sous-catégories
export const LEGACY_SUBCATEGORY_SLUG_MAP: Record<string, string> = {
  // Séries anciennes -> nouvelles (résolues via la table unique d'alias)
  ...LEGACY_SERIES_SUBCATEGORY_ENTRIES,

  // Sagesses anciennes -> nouvelles
  'sagesses/epreuves': 'sagesses/resilience',
  'sagesses/amour-couple': 'sagesses/amour',
  'sagesses/famille': 'sagesses/solidarite',
  'sagesses/travail': 'sagesses/perseverance',
  'sagesses/argent': 'sagesses/gratitude',
  'sagesses/spiritualite': 'sagesses/bienveillance',
  'sagesses/exil': 'sagesses/pardon',
  'sagesses/reinvention': 'sagesses/humilite',

  // Territoires anciennes -> nouvelles
  'territoires/villages': 'territoires/terroirs',
  'territoires/villes': 'territoires/patrimoine',
  'territoires/pays-origine': 'territoires/histoire',
  'territoires/vie-etranger': 'territoires/diaspora',
  'territoires/nature': 'territoires/terroirs',

  // Expertises anciennes -> nouvelles
  'expertises/terroir': 'expertises/artisanat',
  'expertises/droit-finance': 'expertises/justice',
  'expertises/technologie': 'expertises/numerique',
  'expertises/commerce': 'expertises/business',
  'expertises/agriculture': 'expertises/artisanat',
  'expertises/arts-medias': 'expertises/design',

  // Produits & Services anciennes -> nouvelles
  'produits-services/alimentation': 'produits-services/restauration',
  'produits-services/maison': 'produits-services/immobilier',
  'produits-services/numerique': 'produits-services/bien-etre',
  'produits-services/services-personne': 'produits-services/garde-enfants',
  'produits-services/transport-loisirs': 'produits-services/tourisme',

  // Projets anciennes -> nouvelles
  'projets/entreprises': 'projets/entreprise',
  'projets/humanitaire': 'projets/social',
  'projets/projets-de-vie': 'projets/aventure',
  'projets/environnement': 'projets/ecologie',
  'projets/education-sport': 'projets/jeux',

  // Marques anciennes -> nouvelles
  'marques/familiales': 'marques/luxe',
  'marques/alimentation-boissons': 'marques/alimentation',
  'marques/mode-luxe': 'marques/luxe',
  'marques/tech-medias': 'marques/tech',
  'marques/banque-assurance': 'marques/finance',
  'marques/industrie': 'marques/services',
  'marques/sante': 'marques/services',
  'marques/mode-beaute': 'marques/beaute',

  // Personnalités anciennes -> nouvelles
  'personnalites/politique': 'personnalites/engagement',
  'personnalites/cinema-spectacle': 'personnalites/cinema',
  'personnalites/art-litterature': 'personnalites/arts',
  'personnalites/figures-du-quotidien': 'personnalites/engagement',
  'personnalites/science': 'personnalites/legendes'
};

export function normalizeDimensionId(idOrAlias: string): string {
  return LEGACY_CATEGORY_MAP[idOrAlias] || idOrAlias;
}

export function getDimension(idOrAlias: string): Dimension | undefined {
  const norm = normalizeDimensionId(idOrAlias);
  return DIMENSIONS_BY_ID[norm];
}

export function getSubcategoriesForDimension(dimIdOrAlias: string): SousCategorie[] {
  const norm = normalizeDimensionId(dimIdOrAlias);
  return SOUS_CATEGORIES.filter(sc => sc.dimensionId === norm);
}

export function getSubcategory(compositeIdOrSlug: string, fallbackDimId?: string): SousCategorie | undefined {
  const mapped = LEGACY_SUBCATEGORY_SLUG_MAP[compositeIdOrSlug] || compositeIdOrSlug;
  if (SOUS_CATEGORIES_BY_ID[mapped]) {
    return SOUS_CATEGORIES_BY_ID[mapped];
  }
  // Si un slug seul a été passé sans préfixe
  if (fallbackDimId) {
    const normDim = normalizeDimensionId(fallbackDimId);
    const candidate = `${normDim}/${compositeIdOrSlug}`;
    const mappedCand = LEGACY_SUBCATEGORY_SLUG_MAP[candidate] || candidate;
    if (SOUS_CATEGORIES_BY_ID[mappedCand]) return SOUS_CATEGORIES_BY_ID[mappedCand];
  }
  // Recherche par slug seul
  return SOUS_CATEGORIES.find(sc => sc.slug === compositeIdOrSlug || sc.id.endsWith(`/${compositeIdOrSlug}`));
}
