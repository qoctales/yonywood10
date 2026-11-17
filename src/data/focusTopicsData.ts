/**
 * DONNÉES OFFICIELLES DE LA SECTION FOCUS YONYWOOD
 * 8 thématiques phares avec titres, synopsis, questions et affiches officielles.
 */

export interface FocusSubtitle {
  start: number; // en secondes
  end: number;   // en secondes
  text: string;
}

export interface FocusSequence {
  id: string;
  topicId: string;
  number: number;
  title: string;
  speakerName: string;
  speakerRole: string;
  speakerAvatar: string;
  protagonistId?: string;
  videoUrl: string;
  duration: number;
  durationFormatted: string;
  anecdoteSummary: string;
  subtitles?: FocusSubtitle[];
}

export type FocusCategory = 'Focus' | 'Entreprise' | 'Association' | 'Personnalité' | 'Produit du terroir';

/** Longueur maximale recommandée pour les titres Focus afin d'éviter les coupures sur mobile */
export const FOCUS_MAX_TITLE_LENGTH = 32;

/** Formate et tronque proprement un titre si nécessaire */
export const clampFocusTitle = (title: string, maxLength = FOCUS_MAX_TITLE_LENGTH): string => {
  if (!title) return '';
  const trimmed = title.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1).trimEnd()}…`;
};

export interface FocusTopic {
  id: string;
  title: string;
  category: FocusCategory | string;
  posterUrl: string;
  tagline: string;
  synopsis: string;
  question: string;
  description: string;
  sequences: FocusSequence[];
}

export const FOCUS_TOPICS: FocusTopic[] = [
  // 1. Marché Dantokpa
  {
    id: 'topic-marche-dantokpa',
    title: 'Marché Dantokpa',
    category: 'Focus',
    posterUrl: encodeURI('/assets/posters/Focus/Marche Dantokpa.png'),
    tagline: "Au petit matin, avant l'ouverture des étals, le marché s'éveille.",
    synopsis: "Au petit matin, avant l'ouverture des étals, le marché s'éveille. Des commerçantes, des porteurs et des clients de toujours racontent ce lieu où l'on vient pour acheter, flâner, marchander et partager. De génération en génération, le marché est devenu une grande famille, et chaque témoin explique pourquoi ce lieu est unique.",
    question: "Quelle histoire, quelle rencontre ou quelle scène du marché Dantokpa raconteriez-vous pour faire comprendre à quelqu'un d'ailleurs ce qui rend ce lieu unique ?",
    description: "Au petit matin, avant l'ouverture des étals, le marché s'éveille. Des commerçantes, des porteurs et des clients de toujours racontent ce lieu où l'on vient pour acheter, flâner, marchander et partager. De génération en génération, le marché est devenu une grande famille, et chaque témoin explique pourquoi ce lieu est unique.",
    sequences: [
      {
        id: 'dantokpa-seq-1',
        topicId: 'topic-marche-dantokpa',
        number: 1,
        title: "L'éveil des étals au chant du coq",
        speakerName: 'Maman Sika Dossou',
        speakerRole: 'Commerçante de tissus Wax & Étoffes',
        speakerAvatar: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'À 4 heures du matin, quand les pirogues débarquent les premiers ballots, Dantokpa bat déjà au rythme du cœur de Cotonou.',
        subtitles: [
          { start: 1, end: 5, text: '« Avant le lever du soleil, nous savons déjà qui a besoin d’aide pour décharger. »' },
          { start: 6, end: 12, text: '« Ici, on ne vend pas seulement des tissus, on partage les nouvelles et le pain quotidien. »' }
        ]
      },
      {
        id: 'dantokpa-seq-2',
        topicId: 'topic-marche-dantokpa',
        number: 2,
        title: 'La solidarité des porteurs de la lagune',
        speakerName: 'Codjo Hounkpatin',
        speakerRole: 'Porteur & Doyen des manutentionnaires',
        speakerAvatar: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Comment les porteurs se relaient depuis trente ans pour veiller sur les marchandises sans jamais perdre un sac.',
        subtitles: [
          { start: 1, end: 6, text: '« La confiance à Dantokpa vaut tous les contrats du monde écrit. »' },
          { start: 7, end: 13, text: '« Quand une cliente dépose sa charge, elle sait qu’elle la retrouvera intacte au hangar. »' }
        ]
      },
      {
        id: 'dantokpa-seq-3',
        topicId: 'topic-marche-dantokpa',
        number: 3,
        title: 'Le parfum des épices fraîches et du piment',
        speakerName: 'Blandine Adjovi',
        speakerRole: 'Marchande d’aromates et de graines',
        speakerAvatar: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Les recettes secrètes transmises de mère en fille au milieu du dédale des ruelles parfumées.',
        subtitles: [
          { start: 1, end: 5, text: '« Le piment de Dantokpa a une saveur qu’aucun supermarché ne pourra reproduire. »' },
          { start: 6, end: 11, text: '« Les chefs cuisiniers viennent ici à l’aube pour choisir grain après grain. »' }
        ]
      }
    ]
  },

  // 2. Baccalauréat
  {
    id: 'topic-baccalaureat',
    title: 'Baccalauréat',
    category: 'Focus',
    posterUrl: encodeURI('/assets/posters/Focus/Baccalaureat.png'),
    tagline: "La veille de l'épreuve, les révisions, puis la joie de toute une famille.",
    synopsis: "La veille de l'épreuve, les révisions à la lueur d'une lampe, le centre d'examen, l'attente des résultats, puis la liste affichée et la joie de toute une famille. Anciens bacheliers d'hier et d'aujourd'hui racontent le jour où tout a basculé.",
    question: "Le jour où vous avez appris que vous étiez bachelier(ère), qu'est-ce que cela a représenté pour vous, pour votre famille, et quelle fierté en avez-vous tirée ?",
    description: "La veille de l'épreuve, les révisions à la lueur d'une lampe, le centre d'examen, l'attente des résultats, puis la liste affichée et la joie de toute une famille. Anciens bacheliers d'hier et d'aujourd'hui racontent le jour où tout a basculé.",
    sequences: [
      {
        id: 'bac-seq-1',
        topicId: 'topic-baccalaureat',
        number: 1,
        title: 'La lampe tempête des révisions nocturnes',
        speakerName: 'Sénan Agossa',
        speakerRole: 'Bachelière & Ingénieure Télécoms',
        speakerAvatar: '/assets/protagonists/senan-agossa.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Réviser les mathématiques et la physique à quatre sous la véranda commune pendant les coupures de courant.',
        subtitles: [
          { start: 1, end: 5, text: '« On se relayait pour pomper la lampe à pétrole jusqu’à 3 heures du matin. »' },
          { start: 6, end: 12, text: '« Nous étions tous portés par le rêve de voir notre nom imprimé sur cette fameuse liste. »' }
        ]
      },
      {
        id: 'bac-seq-2',
        topicId: 'topic-baccalaureat',
        number: 2,
        title: 'L’attente fiévreuse devant les grilles du centre',
        speakerName: 'Armel Hounkpatin',
        speakerRole: 'Enseignant & Ancien Lauréat Série C',
        speakerAvatar: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Ce moment suspendu où les examinateurs sortent avec les grands cartons d’affichage des résultats.',
        subtitles: [
          { start: 1, end: 6, text: '« Tout le quartier retenait son souffle derrière les grilles de fer forgé. »' },
          { start: 7, end: 13, text: '« Quand mon nom a été scandé, j’ai senti que la porte de l’avenir s’ouvrait grand. »' }
        ]
      },
      {
        id: 'bac-seq-3',
        topicId: 'topic-baccalaureat',
        number: 3,
        title: 'Les larmes de joie et la fête au village',
        speakerName: 'Reine Dossou',
        speakerRole: 'Première bachelière de sa communauté',
        speakerAvatar: '/assets/protagonists/fatou-diallo.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Le retour au village avec l’attestation en main, accueillie par les danses et les tambours des mères.',
        subtitles: [
          { start: 1, end: 5, text: '« Ma grand-mère n’avait jamais été à l’école, mais ce jour-là, c’était sa victoire à elle. »' },
          { start: 6, end: 12, text: '« Le baccalauréat au Bénin, ce n’est pas le succès d’un individu, c’est le sacre de toute une lignée. »' }
        ]
      }
    ]
  },

  // 3. Lycées Béhanzin et Toffa
  {
    id: 'topic-lycees-behanzin-toffa',
    title: 'Lycées Béhanzin et Toffa',
    category: 'Focus',
    posterUrl: encodeURI('/assets/posters/Focus/Lycees Behanzin et Toffa.png'),
    tagline: 'Des histoires parallèles qui se croisent entre garçons et filles.',
    synopsis: "Un lycée de garçons, un lycée de filles, des histoires parallèles qui se croisent. Anciens et anciennes évoquent leurs professeurs, leurs bêtises et les amitiés nées dans la cour. Garçons et filles, ils se répondent et montrent ce que ces murs leur ont donné pour la vie.",
    question: "Un souvenir du lycée Béhanzin ou du lycée Toffa vous fait encore sourire aujourd'hui : lequel raconteriez-vous à vos enfants ou à vos petits-enfants ?",
    description: "Un lycée de garçons, un lycée de filles, des histoires parallèles qui se croisent. Anciens et anciennes évoquent leurs professeurs, leurs bêtises et les amitiés nées dans la cour. Garçons et filles, ils se répondent et montrent ce que ces murs leur ont donné pour la vie.",
    sequences: [
      {
        id: 'lycees-seq-1',
        topicId: 'topic-lycees-behanzin-toffa',
        number: 1,
        title: 'Les billets secrets par-dessus la clôture',
        speakerName: 'Gatien Agossa',
        speakerRole: 'Ancien élève du Lycée Béhanzin',
        speakerAvatar: '/assets/protagonists/kwame-mensah.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Les stratagèmes des garçons de Béhanzin pour transmettre des poèmes aux élèves de Toffa à la sortie des cours.',
        subtitles: [
          { start: 1, end: 5, text: '« La sonnerie de 17 heures annonçait le défilé des regards complices sur l’avenue. »' },
          { start: 6, end: 12, text: '« On rivalisait de belles lettres manuscrites pour impressionner les meilleures en lettres de Toffa. »' }
        ]
      },
      {
        id: 'lycees-seq-2',
        topicId: 'topic-lycees-behanzin-toffa',
        number: 2,
        title: 'La rigueur légendaire des professeurs de Porto-Novo',
        speakerName: 'Pr. Hélène Saint-Amand',
        speakerRole: 'Ancienne élève du Lycée Toffa',
        speakerAvatar: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'L’exigence académique et morale qui a forgé des générations entières de cadres et de scientifiques béninois.',
        subtitles: [
          { start: 1, end: 6, text: '« À Toffa, on nous apprenait à lever la tête et à ne jamais douter de notre légitimité intellectuelle. »' },
          { start: 7, end: 13, text: '« Ces murs centenaires respiraient le respect du savoir et la fierté républicaine. »' }
        ]
      },
      {
        id: 'lycees-seq-3',
        topicId: 'topic-lycees-behanzin-toffa',
        number: 3,
        title: 'Les tournois inter-lycées sous les acacias',
        speakerName: 'Marcellin Houessou',
        speakerRole: 'Ancien capitaine d’équipe Béhanzin',
        speakerAvatar: '/assets/protagonists/dah-zounon.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Les joutes oratoires et les finales de football mémorables où toute la ville de Porto-Novo venait applaudir.',
        subtitles: [
          { start: 1, end: 5, text: '« Quand Béhanzin et Toffa s’unissaient pour les concours nationaux, personne ne pouvait nous battre. »' },
          { start: 6, end: 11, text: '« Ce lien reste vivant quarante ans après : c’est une fraternité indélébile. »' }
        ]
      }
    ]
  },

  // 4. Apprentis
  {
    id: 'topic-apprentis',
    title: 'Apprentis',
    category: 'Focus',
    posterUrl: encodeURI('/assets/posters/Focus/Apprentis.png'),
    tagline: "Comment un métier se transmet, du premier jour à son propre atelier.",
    synopsis: "Couturiers, coiffeuses, menuisiers, mécaniciens, frigoristes : des apprentis, des patrons et des anciens apprentis devenus patrons racontent comment un métier se transmet, du premier jour à l'ouverture de son propre atelier. Patience, fierté et geste qu'on apprend en regardant les autres.",
    question: "De tout votre apprentissage, quelle histoire vous rend le plus fier, celle du moment où vous avez compris que vous aviez appris quelque chose pour la vie ?",
    description: "Couturiers, coiffeuses, menuisiers, mécaniciens, frigoristes : des apprentis, des patrons et des anciens apprentis devenus patrons racontent comment un métier se transmet, du premier jour à l'ouverture de son propre atelier. Patience, fierté et geste qu'on apprend en regardant les autres.",
    sequences: [
      {
        id: 'apprentis-seq-1',
        topicId: 'topic-apprentis',
        number: 1,
        title: 'Le premier coup de ciseau et la patience du maître',
        speakerName: 'Sika Dossou',
        speakerRole: 'Maître Couturière & Ancienne Apprentie',
        speakerAvatar: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Pendant six mois, on observe sans toucher au tissu précieux, jusqu’au jour où le maître confie sa propre veste.',
        subtitles: [
          { start: 1, end: 5, text: '« Le maître me disait : "Regarde avec les yeux de l’esprit avant de couper avec tes mains". »' },
          { start: 6, end: 12, text: '« Le jour où j’ai cousu ma première boutonnière sans défaut, il a souri en silence. »' }
        ]
      },
      {
        id: 'apprentis-seq-2',
        topicId: 'topic-apprentis',
        number: 2,
        title: 'Le son du moteur qu’on diagnostique à l’oreille',
        speakerName: 'Tobi Houndégla',
        speakerRole: 'Maître Mécanicien Atelier Marina',
        speakerAvatar: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'L’art mécanique transmis au garage : reconnaître la panne d’un carburateur rien qu’au cliquetis des culbuteurs.',
        subtitles: [
          { start: 1, end: 6, text: '« Un bon apprenti écoute la machine comme un médecin ausculte un cœur. »' },
          { start: 7, end: 13, text: '« Quand tu as les mains pleines de cambouis mais l’esprit clair, aucun moteur ne te résiste. »' }
        ]
      },
      {
        id: 'apprentis-seq-3',
        topicId: 'topic-apprentis',
        number: 3,
        title: 'La cérémonie de libération et les outils bénis',
        speakerName: 'Pascal Dossou',
        speakerRole: 'Menuisier-Ébéniste Bâtisseur',
        speakerAvatar: '/assets/protagonists/koffi-tisserand.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Le grand jour où le patron remet le rabot et le niveau d’eau devant les parents réunis pour ouvrir son atelier.',
        subtitles: [
          { start: 1, end: 5, text: '« Recevoir la boîte à outils de son maître, c’est recevoir les clés de son indépendance. »' },
          { start: 6, end: 11, text: '« Aujourd’hui, c’est à mon tour de former quatre jeunes pour qu’ils deviennent leurs propres patrons. »' }
        ]
      }
    ]
  },

  // 5. Sodabi
  {
    id: 'topic-sodabi',
    title: 'Sodabi',
    category: 'Focus',
    posterUrl: encodeURI('/assets/posters/Focus/Sodabi.png'),
    tagline: 'Le fil d’une culture où l’on partage, honore les ancêtres et se retrouve.',
    synopsis: "Entre les palmiers, la fermentation et la distillation artisanale, le sodabi voit le jour. Producteurs, familles et amateurs racontent les libations, les cérémonies et les souvenirs qui entourent cette boisson. Le sodabi devient le fil d'une culture où l'on partage, on honore les ancêtres et on se retrouve.",
    question: "Pour faire comprendre à quelqu'un d'ailleurs ce que représente le sodabi pour les Béninois, quelle histoire choisiriez-vous (une fabrication, une cérémonie, une libation, un souvenir de famille) ?",
    description: "Entre les palmiers, la fermentation et la distillation artisanale, le sodabi voit le jour. Producteurs, familles et amateurs racontent les libations, les cérémonies et les souvenirs qui entourent cette boisson. Le sodabi devient le fil d'une culture où l'on partage, on honore les ancêtres et on se retrouve.",
    sequences: [
      {
        id: 'sodabi-seq-1',
        topicId: 'topic-sodabi',
        number: 1,
        title: 'La montée au palmier et la sève de l’aube',
        speakerName: 'Dah Zounon',
        speakerRole: 'Producteur & Gardien des palmeraies de Tori',
        speakerAvatar: '/assets/protagonists/dah-zounon.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Entailler l’arbre à l’aube avec le geste précis hérité du grand-père pour recueillir le vin de palme pur.',
        subtitles: [
          { start: 1, end: 5, text: '« Le palmier ne donne sa sève qu’à celui qui le salue avec respect. »' },
          { start: 6, end: 12, text: '« La première goutte distillée est claire comme l’eau de source et chaude comme la terre. »' }
        ]
      },
      {
        id: 'sodabi-seq-2',
        topicId: 'topic-sodabi',
        number: 2,
        title: 'La libation sacrée avant chaque parole importante',
        speakerName: 'Mahougnon Zounon',
        speakerRole: 'Garant des mémoires orales & Rituels',
        speakerAvatar: '/assets/protagonists/mahougnon-zounon.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Verser les trois gouttes au sol pour les aïeux avant de sceller une alliance ou de célébrer un nouveau-né.',
        subtitles: [
          { start: 1, end: 6, text: '« On ne boit jamais le sodabi seul : on invite d’abord ceux qui nous ont précédés. »' },
          { start: 7, end: 13, text: '« C’est le lien vivant entre le monde visible et les racines invisibles. »' }
        ]
      },
      {
        id: 'sodabi-seq-3',
        topicId: 'topic-sodabi',
        number: 3,
        title: 'Les macérations d’écorces médicinales sous la véranda',
        speakerName: 'Chef Koffi',
        speakerRole: 'Maître Cuisinier & Connaisseur des racines',
        speakerAvatar: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Ajouter les racines d’Ahoho et les écorces bienfaisantes pour transformer le spiritueux en remède familial.',
        subtitles: [
          { start: 1, end: 5, text: '« Chaque famille béninoise a sa bonbonne en verre où infusent des herbes précieuses. »' },
          { start: 6, end: 11, text: '« Une gorgée partagée avec un voyageur, et il n’est plus un étranger dans notre cour. »' }
        ]
      }
    ]
  },

  // 6. Ganvié
  {
    id: 'topic-ganvie',
    title: 'Ganvié',
    category: 'Focus',
    posterUrl: encodeURI('/assets/posters/Focus/Ganvie.png'),
    tagline: "Un village sur pilotis qui a fait de l'eau une force et un art de vivre.",
    synopsis: "Sur le lac Nokoué, un village entier vit sur pilotis. Pêcheurs, commerçantes sur pirogue et enfants qui apprennent à ramer racontent leur quotidien et leur lien à l'eau. Un village qui a fait de son environnement une force et qui transmet un art de vivre unique.",
    question: "Vivre sur l'eau, ça ne se devine pas quand on n'y est jamais allé : quelle histoire de Ganvié raconteriez-vous pour le faire comprendre ?",
    description: "Sur le lac Nokoué, un village entier vit sur pilotis. Pêcheurs, commerçantes sur pirogue et enfants qui apprennent à ramer racontent leur quotidien et leur lien à l'eau. Un village qui a fait de son environnement une force et qui transmet un art de vivre unique.",
    sequences: [
      {
        id: 'ganvie-seq-1',
        topicId: 'topic-ganvie',
        number: 1,
        title: 'Apprendre à tenir l’équilibre sur l’eau avant de marcher',
        speakerName: 'Tobi Houndégla',
        speakerRole: 'Maître Piroguier Toffinou (Ganvié)',
        speakerAvatar: '/assets/protagonists/tobi-ganvie.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'À trois ans, nos enfants tiennent la pagaie avec l’assurance naturelle des gens qui ne craignent pas le flot.',
        subtitles: [
          { start: 1, end: 5, text: '« La pirogue est notre prolongement corporel, nos rues sont les canaux du lac Nokoué. »' },
          { start: 6, end: 12, text: '« Ici, l’eau n’a jamais été un obstacle : elle a été notre refuge et notre liberté. »' }
        ]
      },
      {
        id: 'ganvie-seq-2',
        topicId: 'topic-ganvie',
        number: 2,
        title: 'Le marché flottant au milieu des joncs',
        speakerName: 'Séraphine Gbaguidi',
        speakerRole: 'Commerçante lacustre sur pirogue',
        speakerAvatar: '/assets/protagonists/amara-tisserande.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Acheter les tomates, le maïs et le poisson frais d’embarcation à embarcation sans jamais poser le pied à terre.',
        subtitles: [
          { start: 1, end: 5, text: '« On s’amarre bord contre bord pour échanger les récoltes et les sourires. »' },
          { start: 6, end: 11, text: '« Le clapotis des rames remplace le vacarme des moteurs des villes terrestres. »' }
        ]
      },
      {
        id: 'ganvie-seq-3',
        topicId: 'topic-ganvie',
        number: 3,
        title: 'Le bois d’ébène et les pieux qui résistent aux crues',
        speakerName: 'Kokou Mensah',
        speakerRole: 'Charpentier lacustre de père en fils',
        speakerAvatar: '/assets/protagonists/kwame-mensah.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Le savoir secret pour enfoncer les troncs de teck dans la vase afin qu’ils soutiennent les maisons pendant un demi-siècle.',
        subtitles: [
          { start: 1, end: 6, text: '« Chaque maison est un bateau immobile qui brave les saisons d’inondation. »' },
          { start: 7, end: 13, text: '« Ganvié prouve au monde qu’on peut vivre en harmonie totale avec le vivant aquatique. »' }
        ]
      }
    ]
  },

  // 7. Angélique Kidjo
  {
    id: 'topic-angelique-kidjo',
    title: 'Angélique Kidjo',
    category: 'Focus',
    posterUrl: encodeURI('/assets/posters/Focus/Angelique Kidjo.png'),
    tagline: 'Le portrait d’une femme immense, né de ceux qu’elle a touchés.',
    synopsis: "Cinq Grammy Awards, une étoile sur le Hollywood Walk of Fame, une voix portée sur toutes les scènes du monde : Angélique Kidjo est l'une des plus grandes ambassadrices du Bénin. Fans, proches, musiciens, jeunes artistes et anonymes racontent le moment où sa musique, sa voix ou son parcours a compté pour eux. Le portrait d'une femme, né de ceux qu'elle a touchés.",
    question: "Une chanson, un concert, une rencontre, un mot d'elle : quel moment lié à Angélique Kidjo a changé quelque chose en vous, et qu'est-ce qu'il vous a donné ?",
    description: "Cinq Grammy Awards, une étoile sur le Hollywood Walk of Fame, une voix portée sur toutes les scènes du monde : Angélique Kidjo est l'une des plus grandes ambassadrices du Bénin. Fans, proches, musiciens, jeunes artistes et anonymes racontent le moment où sa musique, sa voix ou son parcours a compté pour eux. Le portrait d'une femme, né de ceux qu'elle a touchés.",
    sequences: [
      {
        id: 'kidjo-seq-1',
        topicId: 'topic-angelique-kidjo',
        number: 1,
        title: 'La première fois que sa voix a traversé le poste radio',
        speakerName: 'Éléonore Vance',
        speakerRole: 'Chanteuse & Admiratrice de la première heure',
        speakerAvatar: '/assets/protagonists/eleonore-vance.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Entendre chanter en Fongbé sur les plus grandes ondes internationales a réveillé une fierté inébranlable chez les jeunes filles du pays.',
        subtitles: [
          { start: 1, end: 5, text: '« Elle chantait nos proverbes et le monde entier se levait pour danser. »' },
          { start: 6, end: 12, text: '« Grâce à Angélique, nous avons compris que notre culture n’avait pas de frontières. »' }
        ]
      },
      {
        id: 'kidjo-seq-2',
        topicId: 'topic-angelique-kidjo',
        number: 2,
        title: 'Le concert incandescent au stade de Cotonou',
        speakerName: 'Malik Diop',
        speakerRole: 'Percussionniste & Musicien de scène',
        speakerAvatar: '/assets/protagonists/malik-diop.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'L’énergie pure déployée sur scène : deux heures sans s’arrêter, pieds nus, communiant avec 30 000 Béninois en liesse.',
        subtitles: [
          { start: 1, end: 6, text: '« Elle ne chante pas avec sa gorge seulement : c’est tout son être qui vibre comme un tambour sacré. »' },
          { start: 7, end: 13, text: '« Voir cette femme béninoise dominer la scène mondiale nous a donné la force d’oser nos propres rêves. »' }
        ]
      },
      {
        id: 'kidjo-seq-3',
        topicId: 'topic-angelique-kidjo',
        number: 3,
        title: 'Le mot d’encouragement en coulisses pour les jeunes filles',
        speakerName: 'Senami Hountondji',
        speakerRole: 'Architecte & Lauréate Fondation Batonga',
        speakerAvatar: '/assets/protagonists/coach-office.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Un échange impromptu où Angélique pose sa main sur l’épaule d’une étudiante et lui dit : "Ne demande jamais la permission d’être brillante".',
        subtitles: [
          { start: 1, end: 5, text: '« Cette phrase a guidé mes dix années d’études d’architecture. »' },
          { start: 6, end: 11, text: '« Elle donne aux femmes d’Afrique la certitude qu’elles peuvent transformer le continent. »' }
        ]
      }
    ]
  },

  // 8. Danialou Sagbohan
  {
    id: 'topic-danialou-sagbohan',
    title: 'Danialou Sagbohan',
    category: 'Focus',
    posterUrl: encodeURI('/assets/posters/Focus/Danialou Sagbohan.png'),
    tagline: 'Des souvenirs de concerts et de chansons dessinent le portrait de l’homme-orchestre.',
    synopsis: "Surnommé « l'homme-orchestre », Danialou Sagbohan est l'une des grandes figures de la musique béninoise. Admirateurs, proches et musiciens racontent ce qu'il a représenté pour eux. Des souvenirs de concerts, de chansons entendues en famille ou dans la rue dessinent peu à peu le portrait d'un homme et de la fierté qu'il inspire.",
    question: "Quand vous pensez à Danialou Sagbohan, quel souvenir vous revient en premier, et en quoi a-t-il marqué votre vie ou celle de votre entourage ?",
    description: "Surnommé « l'homme-orchestre », Danialou Sagbohan est l'une des grandes figures de la musique béninoise. Admirateurs, proches et musiciens racontent ce qu'il a représenté pour eux. Des souvenirs de concerts, de chansons entendues en famille ou dans la rue dessinent peu à peu le portrait d'un homme et de la fierté qu'il inspire.",
    sequences: [
      {
        id: 'sagbohan-seq-1',
        topicId: 'topic-danialou-sagbohan',
        number: 1,
        title: 'L’homme-orchestre et la pulsation du Kakagbo',
        speakerName: 'Mahougnon Zounon',
        speakerRole: 'Percussionniste & Compagnon de scène',
        speakerAvatar: '/assets/protagonists/mahougnon-zounon.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Voir Sagbohan jouer simultanément des cloches, du tambour sous le bras et du chant traditionnel avec une maestria inégalée.',
        subtitles: [
          { start: 1, end: 5, text: '« Il n’avait pas besoin d’un orchestre de vingt personnes : à lui seul, il faisait trembler la scène. »' },
          { start: 6, end: 12, text: '« Il a réinventé le rythme traditionnel pour en faire une musique moderne et respectée partout. »' }
        ]
      },
      {
        id: 'sagbohan-seq-2',
        topicId: 'topic-danialou-sagbohan',
        number: 2,
        title: 'Les cassettes audio qui ont bercé notre enfance',
        speakerName: 'Pascal Cossy',
        speakerRole: 'Conteur & Mélomane de Porto-Novo',
        speakerAvatar: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Les dimanches en famille où chaque parole de ses chansons servait de leçon d’humilité et de fidélité pour les enfants.',
        subtitles: [
          { start: 1, end: 6, text: '« Mon père allumait la radio et disait : "Écoutez bien ce que dit Sagbohan sur le travail et l’amitié". »' },
          { start: 7, end: 13, text: '« Ses chansons étaient de véritables livres de philosophie populaire chantés en langue maternelle. »' }
        ]
      },
      {
        id: 'sagbohan-seq-3',
        topicId: 'topic-danialou-sagbohan',
        number: 3,
        title: 'La dignité de l’artiste face aux épreuves de la vie',
        speakerName: 'Christian Dossou',
        speakerRole: 'Ingénieur du son & Témoin de ses enregistrements',
        speakerAvatar: '/assets/protagonists/athlete-hurdle.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Même dans la douleur ou le deuil, Sagbohan n’a jamais cessé de remercier son public et d’insuffler le courage d’avancer.',
        subtitles: [
          { start: 1, end: 5, text: '« C’est un monument de résilience et de noblesse d’âme. »' },
          { start: 6, end: 11, text: '« Chaque Béninois porte un couplet de Sagbohan gravé dans son cœur comme un talisman. »' }
        ]
      }
    ]
  }
];

/**
 * Récupère un sujet par son identifiant
 */
export const getFocusTopicById = (id?: string): FocusTopic | undefined => {
  if (!id) return FOCUS_TOPICS[0];
  return FOCUS_TOPICS.find(t => t.id === id || t.title.toLowerCase() === id.toLowerCase());
};

/**
 * Pagination quasi infinie sans répétition dans la même session.
 * Retourne la prochaine séquence pour le sujet donné.
 */
export const getNextSequentialSequence = (
  topic: FocusTopic, 
  currentIndex: number, 
  sessionSeenSequenceIds: Set<string>
): { nextIndex: number; sequence: FocusSequence; isExhausted: boolean } => {
  const total = topic.sequences.length;
  if (total === 0) {
    throw new Error('Aucune séquence pour ce sujet');
  }

  // Chercher d'abord la séquence suivante non encore vue dans la session
  for (let i = 1; i <= total; i++) {
    const candidateIdx = (currentIndex + i) % total;
    const candidate = topic.sequences[candidateIdx];
    if (!sessionSeenSequenceIds.has(candidate.id)) {
      return { nextIndex: candidateIdx, sequence: candidate, isExhausted: false };
    }
  }

  // Si toutes ont été vues dans cette session, boucler naturellement en reprenant
  const nextIdx = (currentIndex + 1) % total;
  return { nextIndex: nextIdx, sequence: topic.sequences[nextIdx], isExhausted: true };
};
