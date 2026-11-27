import { SERIES_REGISTRY } from './seriesRegistry';
import { FOCUS_DATA } from './focusData';
import { FOCUS_EPISODE_POSTERS, DUO_EPISODE_POSTERS } from './episodePosters';

export interface StudioPillarItem {
  id: string;
  title: string;
  sousTitre?: string;
  subtitle: string;
  consigne?: string;
  question: string;
  posterUrl: string;
  videoUrl: string;
  badge?: string;
  episodeTitle?: string;
  durationBadge?: string;
  accentColor?: string;
  seriesId?: string;
  roles?: string[];
  partAName?: string;
  partADescription?: string;
  partAPosterUrl?: string;
  partBName?: string;
  partBDescription?: string;
  partBPosterUrl?: string;
  subCategories?: StudioPillarItem[];
}

export interface StudioPillar {
  id: 'duos' | 'soi' | 'itinerant' | 'organisations' | 'focus' | 'teaser';
  title: string;
  durationBadge?: string;
  subtitle: string;
  consigne?: string;
  question: string;
  posterUrl: string;
  videoUrl: string;
  items: StudioPillarItem[];
}

const STOCK_VIDEOS = [
  '/sample.mp4',
  '/sample.mp4',
  '/sample.mp4',
  '/sample.mp4',
  '/sample.mp4'
];

export const STUDIO_PILLARS: StudioPillar[] = [
  // =========================================================================
  // 1. DIALOGUE (8 séries documentaires diptyques alimentées par seriesRegistry.ts)
  // =========================================================================
  {
    id: 'duos',
    title: 'Duocumentaires',
    durationBadge: "Jusqu'à 2 minutes 56",
    subtitle: 'Une série avec deux perspectives. On choisit la sienne et on raconte une histoire posée.',
    question: 'Face à quel alter ego d’un autre monde souhaitez-vous confronter votre propre vécu ?',
    posterUrl: '/Posters/Studio/Studio.Duo.png?v=2',
    videoUrl: STOCK_VIDEOS[0],
    items: SERIES_REGISTRY.map((series, idx) => ({
      id: series.id,
      seriesId: series.id,
      title: series.title,
      subtitle: series.synopsis,
      question: series.episodes[0].question,
      posterUrl: series.posterUrl,
      videoUrl: STOCK_VIDEOS[idx % STOCK_VIDEOS.length],
      partAName: series.partA.name,
      partADescription: series.partA.description,
      partAPosterUrl: series.partA.posterUrl,
      partBName: series.partB.name,
      partBDescription: series.partB.description,
      partBPosterUrl: series.partB.posterUrl,
      subCategories: series.episodes.map((ep) => {
        const epPosters = DUO_EPISODE_POSTERS[series.id]?.[ep.id];
        const partAEpisodePoster = epPosters?.partA || series.partA.posterUrl;
        const partBEpisodePoster = epPosters?.partB || series.partB.posterUrl;
        return {
          id: `${series.id}__${ep.id}`,
          seriesId: series.id,
          title: series.title,
          badge: `Épisode ${parseInt(ep.number, 10) || ep.number}`,
          episodeTitle: ep.title,
          durationBadge: "Jusqu'à 2 minutes 56",
          subtitle: series.synopsis,
          question: ep.question,
          posterUrl: partAEpisodePoster,
          videoUrl: STOCK_VIDEOS[idx % STOCK_VIDEOS.length],
          partAName: series.partA.name,
          partADescription: series.partA.description,
          partAPosterUrl: partAEpisodePoster,
          partBName: series.partB.name,
          partBDescription: series.partB.description,
          partBPosterUrl: partBEpisodePoster
        };
      })
    }))
  },

  // =========================================================================
  // 2. PORTRAIT (jusqu'à 2 minutes 56 - 8 questions universelles pour se montrer au monde)
  // =========================================================================
  {
    id: 'soi',
    title: 'Portrait',
    durationBadge: "Jusqu'à 2 minutes 56",
    subtitle:
      "Huit fragments pour raconter l'essentiel d'une vie, avec vos propres mots. À la fin, ceux qui vous regardent ne voient plus un profil : ils connaissent votre histoire.",
    consigne:
      "Racontez ce que vous avez vécu, avec vos mots. Ne citez une personne reconnaissable qu'avec son accord.",
    question:
      "Racontez le souvenir qui, selon vous, explique le chemin que vous suivez aujourd'hui.",
    posterUrl: '/Posters/Studio/Studio.Portrait.png?v=2',
    videoUrl: STOCK_VIDEOS[3],
    items: [
      {
        id: 'portrait-q1',
        title: 'Souvenir',
        badge: 'Question 1',
        episodeTitle: 'Souvenir',
        durationBadge: "Jusqu'à 2 minutes 56",
        subtitle:
          "Huit fragments pour raconter l'essentiel d'une vie, avec vos propres mots. À la fin, ceux qui vous regardent ne voient plus un profil : ils connaissent votre histoire.",
        consigne:
          "Racontez ce que vous avez vécu, avec vos mots. Ne citez une personne reconnaissable qu'avec son accord.",
        question:
          "Racontez le souvenir qui, selon vous, explique le chemin que vous suivez aujourd'hui.",
        posterUrl: '/Posters/Portrait/portrait-souvenir.jpg',
        videoUrl: STOCK_VIDEOS[0]
      },
      {
        id: 'portrait-q2',
        title: 'Personne',
        badge: 'Question 2',
        episodeTitle: 'Personne',
        durationBadge: "Jusqu'à 2 minutes 56",
        subtitle:
          "Huit fragments pour raconter l'essentiel d'une vie, avec vos propres mots. À la fin, ceux qui vous regardent ne voient plus un profil : ils connaissent votre histoire.",
        consigne:
          "Racontez ce que vous avez vécu, avec vos mots. Ne citez une personne reconnaissable qu'avec son accord.",
        question:
          "Racontez la personne qui a le plus compté dans votre vie, et un moment avec elle que vous n'oublierez jamais.",
        posterUrl: '/Posters/Portrait/portrait-personne.jpg',
        videoUrl: STOCK_VIDEOS[1]
      },
      {
        id: 'portrait-q3',
        title: 'Rien à changer',
        badge: 'Question 3',
        episodeTitle: 'Rien à changer',
        durationBadge: "Jusqu'à 2 minutes 56",
        subtitle:
          "Huit fragments pour raconter l'essentiel d'une vie, avec vos propres mots. À la fin, ceux qui vous regardent ne voient plus un profil : ils connaissent votre histoire.",
        consigne:
          "Racontez ce que vous avez vécu, avec vos mots. Ne citez une personne reconnaissable qu'avec son accord.",
        question:
          "Racontez un jour où vous n'auriez rien voulu changer.",
        posterUrl: '/Posters/Portrait/portrait-rien-a-changer.jpg',
        videoUrl: STOCK_VIDEOS[2]
      },
      {
        id: 'portrait-q4',
        title: 'Carrefour',
        badge: 'Question 4',
        episodeTitle: 'Carrefour',
        durationBadge: "Jusqu'à 2 minutes 56",
        subtitle:
          "Huit fragments pour raconter l'essentiel d'une vie, avec vos propres mots. À la fin, ceux qui vous regardent ne voient plus un profil : ils connaissent votre histoire.",
        consigne:
          "Racontez ce que vous avez vécu, avec vos mots. Ne citez une personne reconnaissable qu'avec son accord.",
        question:
          'Racontez un moment où il fallait choisir entre deux vies, et ce que vous avez laissé derrière vous.',
        posterUrl: '/Posters/Portrait/portrait-carrefour.jpg',
        videoUrl: STOCK_VIDEOS[3]
      },
      {
        id: 'portrait-q5',
        title: 'Épreuve',
        badge: 'Question 5',
        episodeTitle: 'Épreuve',
        durationBadge: "Jusqu'à 2 minutes 56",
        subtitle:
          "Huit fragments pour raconter l'essentiel d'une vie, avec vos propres mots. À la fin, ceux qui vous regardent ne voient plus un profil : ils connaissent votre histoire.",
        consigne:
          "Racontez ce que vous avez vécu, avec vos mots. Ne citez une personne reconnaissable qu'avec son accord.",
        question:
          'Racontez le moment le plus dur de votre vie, et ce qui vous a permis de tenir.',
        posterUrl: '/Posters/Portrait/portrait-epreuve.jpg',
        videoUrl: STOCK_VIDEOS[4]
      },
      {
        id: 'portrait-q6',
        title: 'Leçon',
        badge: 'Question 6',
        episodeTitle: 'Leçon',
        durationBadge: "Jusqu'à 2 minutes 56",
        subtitle:
          "Huit fragments pour raconter l'essentiel d'une vie, avec vos propres mots. À la fin, ceux qui vous regardent ne voient plus un profil : ils connaissent votre histoire.",
        consigne:
          "Racontez ce que vous avez vécu, avec vos mots. Ne citez une personne reconnaissable qu'avec son accord.",
        question:
          "Racontez ce que les années vous ont appris de plus précieux, et le jour où vous l'avez compris.",
        posterUrl: '/Posters/Portrait/portrait-lecon.jpg',
        videoUrl: STOCK_VIDEOS[0]
      },
      {
        id: 'portrait-q7',
        title: 'Non-dit',
        badge: 'Question 7',
        episodeTitle: 'Non-dit',
        durationBadge: "Jusqu'à 2 minutes 56",
        subtitle:
          "Huit fragments pour raconter l'essentiel d'une vie, avec vos propres mots. À la fin, ceux qui vous regardent ne voient plus un profil : ils connaissent votre histoire.",
        consigne:
          "Racontez ce que vous avez vécu, avec vos mots. Ne citez une personne reconnaissable qu'avec son accord.",
        question:
          "Racontez ce que vous n'avez jamais pu dire à quelqu'un, et ce que vous lui diriez aujourd'hui.",
        posterUrl: '/Posters/Portrait/portrait-non-dit.jpg',
        videoUrl: STOCK_VIDEOS[1]
      },
      {
        id: 'portrait-q8',
        title: 'Espoir',
        badge: 'Question 8',
        episodeTitle: 'Espoir',
        durationBadge: "Jusqu'à 2 minutes 56",
        subtitle:
          "Huit fragments pour raconter l'essentiel d'une vie, avec vos propres mots. À la fin, ceux qui vous regardent ne voient plus un profil : ils connaissent votre histoire.",
        consigne:
          "Racontez ce que vous avez vécu, avec vos mots. Ne citez une personne reconnaissable qu'avec son accord.",
        question:
          'Racontez ce que vous espérez encore de la vie, et à quoi ressemblera le jour où cela arrivera.',
        posterUrl: '/Posters/Portrait/portrait-espoir.jpg',
        videoUrl: STOCK_VIDEOS[2]
      }
    ]
  },

  // =========================================================================
  // 3. RUSH (32 secondes - 8 catégories x 8 sous-catégories = 64 thématiques)
  // =========================================================================
  {
    id: 'itinerant',
    title: 'Rush',
    durationBadge: '32 secondes',
    subtitle: 'Une histoire courte, racontée vite et sans mise en scène, autour d’une valeur humaine fondamentale.',
    question: 'Quel savoir, quel rite ou quelle sagesse locale votre voix doit-elle transmettre ?',
    posterUrl: '/Posters/Onboardings/series-feed-hero.jpg',
    videoUrl: STOCK_VIDEOS[1],
    items: [
      // -----------------------------------------------------------------------
      // 1. Sagesses (8 sous-thématiques)
      // -----------------------------------------------------------------------
      {
        id: 'cat-sagesses',
        title: 'Sagesses',
        subtitle: 'Sens de la vie, foi, résilience, solidarité, gratitude, bienveillance, pardon, humilité.',
        question: 'Quel enseignement ou leçon de vie reçu de vos aïeux guide encore chacun de vos choix ?',
        posterUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: STOCK_VIDEOS[0],
        subCategories: [
          {
            id: 'sagesses-sens-vie',
            title: 'Sens de la vie',
            subtitle: 'Trouver son cap, donner du sens à son existence et à son chemin.',
            question: 'Qu’est-ce qui donne le plus profondément du sens à votre existence aujourd’hui ?',
            posterUrl: '/Posters/Sides/Wowmen.png',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'sagesses-foi',
            title: 'Foi',
            subtitle: 'La confiance inébranlable dans le sacré, en la vie ou en l’avenir.',
            question: 'Dans quoi puisez-vous cette foi inaltérable lorsque tout vacille autour de vous ?',
            posterUrl: '/assets/duos/tobi-ganvie.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'sagesses-resilience',
            title: 'Résilience',
            subtitle: 'Se relever après la tempête, transformer l’épreuve en force motrice.',
            question: 'Quelle tempête intérieure avez-vous traversée qui a révélé votre véritable résilience ?',
            posterUrl: '/assets/duos/athlete-hurdle.jpg',
            videoUrl: STOCK_VIDEOS[2]
          },
          {
            id: 'sagesses-solidarite',
            title: 'Solidarité',
            subtitle: 'La force de l’entraide, la main tendue sans rien attendre en retour.',
            question: 'Quel acte de fraternité ou d’entraide a marqué à jamais votre trajectoire ?',
            posterUrl: '/Posters/Onboardings/coproductions-hero.jpg',
            videoUrl: STOCK_VIDEOS[3]
          },
          {
            id: 'sagesses-gratitude',
            title: 'Gratitude',
            subtitle: 'Savoir remercier pour l’ordinaire, honorer ce qui a été reçu.',
            question: 'Pour quel cadeau secret de la vie éprouvez-vous chaque matin une profonde gratitude ?',
            posterUrl: '/Posters/Focus/Hoxo%CC%80.png',
            videoUrl: STOCK_VIDEOS[4]
          },
          {
            id: 'sagesses-bienveillance',
            title: 'Bienveillance',
            subtitle: 'Le regard qui accueille, la parole douce et le cœur ouvert à l’autre.',
            question: 'Comment cultivez-vous la bienveillance au quotidien, même face aux jugements ?',
            posterUrl: '/assets/duos/care-mireille.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'sagesses-pardon',
            title: 'Pardon',
            subtitle: 'Libérer le passé pour faire la paix avec soi-même et avec autrui.',
            question: 'Quel pardon donné ou reçu vous a permis de retrouver votre liberté intérieure ?',
            posterUrl: '/Posters/Sides/Jesus.png',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'sagesses-humilite',
            title: 'Humilité',
            subtitle: 'Reconnaître sa juste place dans le grand cycle de la vie.',
            question: 'Quelle leçon d’humilité a redéfini votre rapport aux autres et à la réussite ?',
            posterUrl: '/Posters/Sides/Irokos.png',
            videoUrl: STOCK_VIDEOS[2]
          }
        ]
      },

      // -----------------------------------------------------------------------
      // 2. Territoires (8 sous-thématiques)
      // -----------------------------------------------------------------------
      {
        id: 'cat-territoires',
        title: 'Territoires',
        subtitle: 'Patrimoine, tradition, culture, histoire, terroir, langue, diaspora, coutumes.',
        question: 'Quel terroir, lieu sacré ou tradition porte l’empreinte indélébile de votre communauté ?',
        posterUrl: '/Posters/Sides/Tradition.png',
        videoUrl: STOCK_VIDEOS[1],
        subCategories: [
          {
            id: 'territoires-patrimoine',
            title: 'Patrimoine',
            subtitle: 'Les trésors hérités du passé, pierres, œuvres et mémoires vivantes.',
            question: 'Quel monument ou trésor de mémoire portez-vous comme un bien inaliénable ?',
            posterUrl: '/Posters/Sides/Benin.png',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'territoires-tradition',
            title: 'Tradition',
            subtitle: 'Les rites séculaires et coutumes qui relient les générations.',
            question: 'Quelle tradition de votre terre continue de scander et bénir votre existence ?',
            posterUrl: '/Posters/Sides/Tradition.png',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'territoires-culture',
            title: 'Culture',
            subtitle: 'L’expression vibrante d’une identité, célébrée par les arts et la pensée.',
            question: 'Comment votre culture d’origine irrigue-t-elle votre manière de voir le monde ?',
            posterUrl: '/Posters/Sides/Legba.png',
            videoUrl: STOCK_VIDEOS[2]
          },
          {
            id: 'territoires-histoire',
            title: 'Histoire',
            subtitle: 'Les récits des luttes, des fondations et des victoires collectives.',
            question: 'Quelle page de l’histoire de votre peuple éclaire le plus votre présent ?',
            posterUrl: '/assets/duos/dah-zounon.jpg',
            videoUrl: STOCK_VIDEOS[3]
          },
          {
            id: 'territoires-terroir',
            title: 'Terroir',
            subtitle: 'La terre nourricière, ses saveurs, ses parfums et ses richesses uniques.',
            question: 'Quel coin de terre ou goût de terroir incarne pour vous la saveur des origines ?',
            posterUrl: '/Posters/Focus/E%20Vivi.png',
            videoUrl: STOCK_VIDEOS[4]
          },
          {
            id: 'territoires-langue',
            title: 'Langue',
            subtitle: 'La mélodie des mots maternels, véhicule de l’âme et de la transmission.',
            question: 'Quels proverbes ou mots de votre langue maternelle disent ce qu’aucun autre mot ne traduit ?',
            posterUrl: '/Posters/Sides/Paroles.png',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'territoires-diaspora',
            title: 'Diaspora',
            subtitle: 'Partir au loin tout en gardant intacte la pulsation de son pays natal.',
            question: 'Comment entretenez-vous le pont invisible entre votre terre d’accueil et votre patrie ?',
            posterUrl: '/Posters/Focus/Diasporas.png',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'territoires-coutumes',
            title: 'Coutumes',
            subtitle: 'Les habitudes partagées et le code de politesse d’un vivre-ensemble séculaire.',
            question: 'Quelle coutume locale préservez-vous avec ferveur auprès des plus jeunes ?',
            posterUrl: '/Posters/Sides/Horizons.png',
            videoUrl: STOCK_VIDEOS[2]
          }
        ]
      },

      // -----------------------------------------------------------------------
      // 3. Expertises (8 sous-thématiques)
      // -----------------------------------------------------------------------
      {
        id: 'cat-expertises',
        title: 'Expertises',
        subtitle: 'Artisanat, agriculture, éducation, numérique, justice, santé, sécurité, design.',
        question: 'Quel savoir-faire ou geste d’artisan protégez-vous contre l’oubli et l’uniformisation ?',
        posterUrl: '/Posters/Sides/Apprentis.png',
        videoUrl: STOCK_VIDEOS[2],
        subCategories: [
          {
            id: 'expertises-artisanat',
            title: 'Artisanat',
            subtitle: 'La main qui sculpte, tisse et façonne la matière brute avec passion.',
            question: 'Quel geste minutieux de votre métier protégez-vous contre la standardisation ?',
            posterUrl: '/Posters/Sides/Apprentis.png',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'expertises-agriculture',
            title: 'Agriculture',
            subtitle: 'Nourrir les hommes, soigner les sols et respecter les saisons de la terre.',
            question: 'Quel rapport intime cultivez-vous avec les cycles naturels qui nourrissent votre communauté ?',
            posterUrl: '/Posters/Sides/Builders.png',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'expertises-education',
            title: 'Éducation',
            subtitle: 'Transmettre le savoir, éveiller les consciences et former les bâtisseurs de demain.',
            question: 'Quel pédagogue ou maître a allumé en vous l’étincelle de la connaissance ?',
            posterUrl: '/Posters/Sides/PhD.png',
            videoUrl: STOCK_VIDEOS[2]
          },
          {
            id: 'expertises-numerique',
            title: 'Numérique',
            subtitle: 'Coder, connecter et concevoir des outils technologiques émancipateurs.',
            question: 'Comment mettez-vous la technologie au service de l’humain et du progrès partagé ?',
            posterUrl: '/Posters/Sides/Modernite%CC%81.png',
            videoUrl: STOCK_VIDEOS[3]
          },
          {
            id: 'expertises-justice',
            title: 'Justice',
            subtitle: 'Défendre l’équité, protéger les faibles et garantir le droit pour tous.',
            question: 'Pour quel combat de justice ou d’intégrité refuseriez-vous tout compromis ?',
            posterUrl: '/Posters/Focus/Votre%20Honneur.png',
            videoUrl: STOCK_VIDEOS[4]
          },
          {
            id: 'expertises-sante',
            title: 'Santé',
            subtitle: 'Soigner les corps et les âmes, prévenir le mal et préserver la vie.',
            question: 'Quel dévouement vous anime dans l’art de soulager la souffrance humaine ?',
            posterUrl: '/assets/duos/care-mireille.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'expertises-securite',
            title: 'Sécurité',
            subtitle: 'Veiller sur la communauté, protéger les biens et préserver la paix civile.',
            question: 'Comment instaurez-vous un climat de confiance et de sécurité durable ?',
            posterUrl: '/Posters/Onboardings/securite-hero.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'expertises-design',
            title: 'Design',
            subtitle: 'Épouser l’usage et la beauté, rendre l’environnement harmonieux et fluide.',
            question: 'Quelle création originale a réconcilié la beauté plastique et l’utilité pratique ?',
            posterUrl: '/Posters/Sides/Images.png',
            videoUrl: STOCK_VIDEOS[2]
          }
        ]
      },

      // -----------------------------------------------------------------------
      // 4. Personnalités (8 sous-thématiques)
      // -----------------------------------------------------------------------
      {
        id: 'cat-personnalites',
        title: 'Personnalités',
        subtitle: 'Engagement, légendes, musique, cinéma, art, sport, influenceurs, littérature.',
        question: 'Quelle figure inspirante ou créateur engagé a éveillé votre propre vocation ?',
        posterUrl: '/Posters/Sides/Blacks%20One.png',
        videoUrl: STOCK_VIDEOS[3],
        subCategories: [
          {
            id: 'personnalites-engagement',
            title: 'Engagement',
            subtitle: 'Donner sa vie et sa voix pour une cause plus grande que soi.',
            question: 'Pour quelle cause citoyenne avez-vous décidé de ne plus jamais vous taire ?',
            posterUrl: '/Posters/Sides/Blacks%20One.png',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'personnalites-legendes',
            title: 'Légendes',
            subtitle: 'Les figures mythiques dont le nom traverse les âges et inspire les foules.',
            question: 'Quelle légende vivante ou disparue constitue votre modèle d’élévation ?',
            posterUrl: '/Posters/Sides/Irokos.png',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'personnalites-musique',
            title: 'Musique',
            subtitle: 'Faire vibrer les cœurs, porter les rythmes et unir les âmes par le son.',
            question: 'Quelle mélodie ou rythme réveille instantanément votre énergie vitale ?',
            posterUrl: '/Posters/Focus/Artistes.png',
            videoUrl: STOCK_VIDEOS[2]
          },
          {
            id: 'personnalites-cinema',
            title: 'Cinéma',
            subtitle: 'Raconter le réel et l’imaginaire par la magie des images en mouvement.',
            question: 'Quel film ou réalisateur a bouleversé votre façon de percevoir l’humanité ?',
            posterUrl: '/Posters/Sides/Images.png',
            videoUrl: STOCK_VIDEOS[3]
          },
          {
            id: 'personnalites-art',
            title: 'Art',
            subtitle: 'Exprimer l’indicible par les toiles, les sculptures et les matières.',
            question: 'Comment l’art vous permet-il d’accéder à ce que les mots ne savent pas dire ?',
            posterUrl: '/assets/duos/performers-yede.jpg',
            videoUrl: STOCK_VIDEOS[4]
          },
          {
            id: 'personnalites-sport',
            title: 'Sport',
            subtitle: 'Dépassement de soi, discipline de fer et fraternité du jeu collectif.',
            question: 'Quelle victoire acquise au prix de l’effort physique a forgé votre mental ?',
            posterUrl: '/assets/duos/athlete-hurdle.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'personnalites-influenceurs',
            title: 'Influenceurs',
            subtitle: 'Inspirer, rassembler une communauté et porter des messages d’impact.',
            question: 'Comment utilisez-vous votre visibilité pour semer des graines constructives ?',
            posterUrl: '/Posters/Sides/Bambous.png',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'personnalites-litterature',
            title: 'Littérature',
            subtitle: 'La puissance des livres, l’écriture poétique et la profondeur des récits.',
            question: 'Quel livre fondateur a ouvert les portes secrètes de votre pensée ?',
            posterUrl: '/Posters/Sides/Paroles.png',
            videoUrl: STOCK_VIDEOS[2]
          }
        ]
      },

      // -----------------------------------------------------------------------
      // 5. Épreuves (8 sous-thématiques)
      // -----------------------------------------------------------------------
      {
        id: 'cat-epreuves',
        title: 'Épreuves',
        subtitle: 'Guerre, pauvreté, injustice, maladie, handicap, deuil, séparation, échec.',
        question: 'Quelle traversée difficile vous a révélé une force que vous ne soupçonniez pas ?',
        posterUrl: '/Posters/Sides/Jesus.png',
        videoUrl: STOCK_VIDEOS[4],
        subCategories: [
          {
            id: 'epreuves-guerre',
            title: 'Guerre',
            subtitle: 'Traverser le chaos des conflits et préserver la flamme de la paix.',
            question: 'Comment garde-t-on sa dignité et son humanité au milieu du tumulte ?',
            posterUrl: '/assets/duos/tobi-ganvie.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'epreuves-pauvrete',
            title: 'Pauvreté',
            subtitle: 'Le dénuement matériel transcendé par la richesse du cœur et l’ingéniosité.',
            question: 'Quelle ingéniosité et solidarité ont permis de vaincre la précarité ?',
            posterUrl: '/assets/duos/tobi-ganvie.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'epreuves-injustice',
            title: 'Injustice',
            subtitle: 'Se relever face à l’arbitraire et transformer la blessure en juste combat.',
            question: 'Quelle épreuve injuste vous a donné la force de défendre les autres ?',
            posterUrl: '/Posters/Focus/Votre%20Honneur.png',
            videoUrl: STOCK_VIDEOS[2]
          },
          {
            id: 'epreuves-maladie',
            title: 'Maladie',
            subtitle: 'La fragilité du corps, le courage du soin et la volonté de guérir.',
            question: 'Qu’avez-vous appris d’essentiel sur la valeur des jours en affrontant la maladie ?',
            posterUrl: '/assets/duos/care-mireille.jpg',
            videoUrl: STOCK_VIDEOS[3]
          },
          {
            id: 'epreuves-handicap',
            title: 'Handicap',
            subtitle: 'Déjouer les limites physiques, éveiller des sens décuplés et inspirer.',
            question: 'Comment votre différence est-elle devenue votre plus singulière puissance ?',
            posterUrl: '/assets/duos/codjo-blind.jpg',
            videoUrl: STOCK_VIDEOS[4]
          },
          {
            id: 'epreuves-deuil',
            title: 'Deuil',
            subtitle: 'Apprivoiser l’absence, honorer les disparus et célébrer la vie qui continue.',
            question: 'Comment transformez-vous l’absence d’un être cher en présence bienfaisante ?',
            posterUrl: '/assets/duos/dah-zounon.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'epreuves-separation',
            title: 'Séparation',
            subtitle: 'Les ruptures et l’éloignement nécessaires pour se retrouver soi-même.',
            question: 'Comment avez-vous reconstruit votre univers après une séparation marquante ?',
            posterUrl: '/Posters/Sides/Jesus.png',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'epreuves-echec',
            title: 'Échec',
            subtitle: 'Tomber, apprendre, ajuster sa trajectoire et repartir avec lucidité.',
            question: 'En quoi votre plus grand échec a-t-il été en réalité votre plus grand maître ?',
            posterUrl: '/assets/duos/athlete-hurdle.jpg',
            videoUrl: STOCK_VIDEOS[2]
          }
        ]
      },

      // -----------------------------------------------------------------------
      // 6. Produits et services (8 sous-thématiques)
      // -----------------------------------------------------------------------
      {
        id: 'cat-produits-services',
        title: 'Produits et services',
        subtitle: 'Beauté, restauration, mode, bien-être, tourisme, transport, commerce, immobilier.',
        question: 'Comment votre création, votre soin ou votre commerce apporte-t-il du bien au quotidien ?',
        posterUrl: '/Posters/Sides/Wowmen.png',
        videoUrl: STOCK_VIDEOS[0],
        subCategories: [
          {
            id: 'ps-beaute',
            title: 'Beauté',
            subtitle: 'Révéler l’éclat naturel, soins cosmétiques et bienveillance envers son corps.',
            question: 'Comment votre conception de la beauté redonne-t-elle confiance et estime de soi ?',
            posterUrl: '/Posters/Sides/Wowmen.png',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'ps-restauration',
            title: 'Restauration',
            subtitle: 'Les délices de la table, le plaisir du partage et l’accueil chaleureux.',
            question: 'Quelle recette emblématique réunit les gens autour de votre table ?',
            posterUrl: '/assets/duos/chef-koffi.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'ps-mode',
            title: 'Mode',
            subtitle: 'Couleurs, textiles nobles et coupes qui affirment la fierté identitaire.',
            question: 'Quelle histoire humaine raconte chaque vêtement que vous créez ?',
            posterUrl: '/assets/duos/fatou-diallo.jpg',
            videoUrl: STOCK_VIDEOS[2]
          },
          {
            id: 'ps-bien-etre',
            title: 'Bien-être',
            subtitle: 'Sérénité de l’esprit, détente physique et réconciliation intérieure.',
            question: 'Quelle routine ou soin permet à vos proches de retrouver la paix intérieure ?',
            posterUrl: '/assets/duos/mawuna-medium.jpg',
            videoUrl: STOCK_VIDEOS[3]
          },
          {
            id: 'ps-tourisme',
            title: 'Tourisme',
            subtitle: 'Guider les voyageurs au cœur des merveilles cachées et des cultures locales.',
            question: 'Quel trésor insoupçonné faites-vous découvrir à ceux qui viennent de loin ?',
            posterUrl: '/Posters/Sides/Horizons.png',
            videoUrl: STOCK_VIDEOS[4]
          },
          {
            id: 'ps-transport',
            title: 'Transport',
            subtitle: 'Relier les territoires, fluidifier les mobilités et rapprocher les êtres.',
            question: 'Comment votre service de mobilité facilite-t-il la vie de centaines de personnes ?',
            posterUrl: '/Posters/Sides/Coachs.png',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'ps-commerce',
            title: 'Commerce',
            subtitle: 'Les échoppes de proximité, la confiance mutuelle et le commerce équitable.',
            question: 'Quelle relation de confiance privilégiée avez-vous bâtie avec vos clients ?',
            posterUrl: '/Posters/Focus/Hoxo%CC%80.png',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'ps-immobilier',
            title: 'Immobilier',
            subtitle: 'Bâtir un toit, aménager des foyers chaleureux et valoriser l’habitat.',
            question: 'Comment créez-vous des espaces de vie où les familles peuvent s’épanouir en sécurité ?',
            posterUrl: '/Posters/Sides/Builders.png',
            videoUrl: STOCK_VIDEOS[2]
          }
        ]
      },

      // -----------------------------------------------------------------------
      // 7. Projets (8 sous-thématiques)
      // -----------------------------------------------------------------------
      {
        id: 'cat-projets',
        title: 'Projets',
        subtitle: 'Jeux, écologie, social, communautaire, innovation, entreprise, aventure, événements.',
        question: 'Quelle aventure, initiative collective ou innovation rêvez-vous de concrétiser ?',
        posterUrl: '/Posters/Sides/Modernite%CC%81.png',
        videoUrl: STOCK_VIDEOS[1],
        subCategories: [
          {
            id: 'projets-jeux',
            title: 'Jeux',
            subtitle: 'Éveil ludique, plaisir de jouer ensemble et stimulation de la créativité.',
            question: 'Quel jeu traditionnel ou moderne avez-vous imaginé pour rassembler petits et grands ?',
            posterUrl: '/Posters/Focus/Fou%20Rire.png',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'projets-ecologie',
            title: 'Écologie',
            subtitle: 'Protéger la biodiversité, recycler et préserver la terre pour les générations futures.',
            question: 'Quelle action concrète menez-vous pour soigner notre écosystème naturel ?',
            posterUrl: '/Posters/Sides/Irokos.png',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'projets-social',
            title: 'Social',
            subtitle: 'Tisser du lien solidaire, inclure les oubliés et créer des ponts d’espoir.',
            question: 'Quel impact direct votre initiative sociale apporte-t-elle aux plus vulnérables ?',
            posterUrl: '/assets/duos/tobi-houndegla.jpg',
            videoUrl: STOCK_VIDEOS[2]
          },
          {
            id: 'projets-communautaire',
            title: 'Communautaire',
            subtitle: 'La force du collectif qui s’organise pour bâtir son propre avenir.',
            question: 'Comment mobilisez-vous votre village ou quartier autour d’un projet commun ?',
            posterUrl: '/Posters/Onboardings/coproductions-hero.jpg',
            videoUrl: STOCK_VIDEOS[3]
          },
          {
            id: 'projets-innovation',
            title: 'Innovation',
            subtitle: 'Penser en dehors des sentiers battus, inventer de nouvelles solutions d’avenir.',
            question: 'Quelle trouvaille ingénieuse a résolu un problème réputé insurmontable ?',
            posterUrl: '/Posters/Sides/Modernite%CC%81.png',
            videoUrl: STOCK_VIDEOS[4]
          },
          {
            id: 'projets-entreprise',
            title: 'Entreprise',
            subtitle: 'Créer de la valeur durable, entreprendre avec éthique et générer des emplois.',
            question: 'Quel cap stratégique et éthique guide le développement de votre entreprise ?',
            posterUrl: '/Posters/Sides/Builders.png',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'projets-aventure',
            title: 'Aventure',
            subtitle: 'Partir à la découverte de l’inconnu, repousser les frontières et explorer.',
            question: 'Quelle expédition ou défi audacieux a élargi votre vision du possible ?',
            posterUrl: '/assets/duos/sayri-quispe.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'projets-evenements',
            title: 'Événements',
            subtitle: 'Fédérer les foules, célébrer les talents et vivre des moments inoubliables.',
            question: 'Quel festival ou rassemblement magique rêvez-vous d’organiser pour marquer les esprits ?',
            posterUrl: '/Posters/Focus/Artistes.png',
            videoUrl: STOCK_VIDEOS[2]
          }
        ]
      },

      // -----------------------------------------------------------------------
      // 8. Liens (8 sous-thématiques)
      // -----------------------------------------------------------------------
      {
        id: 'cat-liens',
        title: 'Liens',
        subtitle: 'Couple, parents, enfants, grands-parents, fratrie, amitié, communauté, animaux.',
        question: 'Quel lien d’amour, de famille ou d’amitié constitue le pilier inébranlable de votre existence ?',
        posterUrl: '/assets/duos/paroles-armel.jpg',
        videoUrl: STOCK_VIDEOS[2],
        subCategories: [
          {
            id: 'liens-couple',
            title: 'Couple',
            subtitle: 'L’alliance amoureuse, la complicité des jours et l’aventure à deux.',
            question: 'Quel secret de tendresse et de dialogue consolide votre couple au fil du temps ?',
            posterUrl: '/assets/duos/paroles-armel.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'liens-parents',
            title: 'Parents',
            subtitle: 'La responsabilité d’élever, de protéger et de guider avec amour.',
            question: 'Quel principe essentiel souhaitez-vous à tout prix transmettre à vos enfants ?',
            posterUrl: '/Posters/Sides/Irokos.png',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'liens-enfants',
            title: 'Enfants',
            subtitle: 'L’innocence, la joie spontanée et l’espoir radieux du futur.',
            question: 'Quelle leçon de pureté ou de curiosité un enfant vous a-t-il enseignée ?',
            posterUrl: '/Posters/Focus/Hoxo%CC%80.png',
            videoUrl: STOCK_VIDEOS[2]
          },
          {
            id: 'liens-grands-parents',
            title: 'Grands-parents',
            subtitle: 'La sagesse des aînés, la tendresse des souvenirs et la bénédiction des anciens.',
            question: 'Quelle histoire ou parole d’or de vos grands-parents résonne encore en vous ?',
            posterUrl: '/assets/duos/dah-zounon.jpg',
            videoUrl: STOCK_VIDEOS[3]
          },
          {
            id: 'liens-fratrie',
            title: 'Fratrie',
            subtitle: 'Les frères et sœurs, complices d’enfance et piliers face aux épreuves.',
            question: 'Quel pacte de fidélité ou d’entraide vous lie indéfectiblement à vos frères et sœurs ?',
            posterUrl: '/assets/duos/horizons-awa.jpg',
            videoUrl: STOCK_VIDEOS[4]
          },
          {
            id: 'liens-amitie',
            title: 'Amitié',
            subtitle: 'La famille que l’on choisit, la loyauté sans faille et le rire partagé.',
            question: 'Quel ami véritable a répondu présent au moment exact où vous en aviez le plus besoin ?',
            posterUrl: '/assets/duos/malik-diop.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'liens-communaute',
            title: 'Communauté',
            subtitle: 'Le sentiment d’appartenance à un peuple, un village ou un groupe soudé.',
            question: 'Comment votre communauté vous soutient-elle et comment l’honorez-vous en retour ?',
            posterUrl: '/Posters/Onboardings/coproductions-hero.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'liens-animaux',
            title: 'Animaux',
            subtitle: 'La fidélité pure des compagnons de vie et le respect de la faune vivante.',
            question: 'Quel lien extraordinaire avec un animal a transformé votre sensibilité au vivant ?',
            posterUrl: '/assets/duos/tobi-ganvie.jpg',
            videoUrl: STOCK_VIDEOS[2]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 4. INSERT (8 secondes - 8 thématiques vivantes au cœur des collectifs et entreprises)
  // =========================================================================
  {
    id: 'organisations',
    title: 'Insert',
    durationBadge: '8 secondes',
    subtitle: 'Le partage d’une leçon de vie en une phrase, un proverbe ou une affirmation inspirante. Chacun de ces partages sera mis en relation avec trois autres partages. La présentation se fait par série de quatre.',
    question: 'Quel défi collectif et quelle fierté humaine soudent votre organisation de l’intérieur ?',
    posterUrl: '/Posters/Focus/Fiat%20Luxe.png',
    videoUrl: STOCK_VIDEOS[2],
    items: [
      {
        id: 'lum-origines',
        title: 'Origines',
        subtitle: 'Pourquoi et comment tout a commencé.',
        question: 'Quelle étincelle visionnaire ou défi initial a donné naissance à votre organisation ?',
        posterUrl: '/Posters/Sides/Legba.png',
        videoUrl: STOCK_VIDEOS[0]
      },
      {
        id: 'lum-valeurs',
        title: 'Valeurs',
        subtitle: 'Ce qui compte vraiment ici.',
        question: 'Quels principes non négociables guident chaque décision au sein de votre collectif ?',
        posterUrl: '/Posters/Sides/Blacks%20One.png',
        videoUrl: STOCK_VIDEOS[1]
      },
      {
        id: 'lum-quotidien',
        title: 'Quotidien',
        subtitle: 'Une journée, un geste, un rituel.',
        question: 'Quel rituel quotidien ou geste d’attention caractérise l’ambiance de vos journées ?',
        posterUrl: '/assets/duos/chef-koffi.jpg',
        videoUrl: STOCK_VIDEOS[2]
      },
      {
        id: 'lum-epreuves',
        title: 'Épreuves',
        subtitle: 'Le moment où l’on a failli tout arrêter.',
        question: 'Quelle crise majeure a testé votre foi dans le projet et comment l’avez-vous surmontée ?',
        posterUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: STOCK_VIDEOS[3]
      },
      {
        id: 'lum-rencontres',
        title: 'Rencontres',
        subtitle: 'La personne qui a changé quelque chose.',
        question: 'Quelle rencontre décisive a fait basculer le destin de votre entreprise ?',
        posterUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: STOCK_VIDEOS[4]
      },
      {
        id: 'lum-impact',
        title: 'Impact',
        subtitle: 'Ce que l’organisation a changé, pour soi ou pour d’autres.',
        question: 'Quelle transformation concrète votre organisation apporte-t-elle à sa communauté ?',
        posterUrl: '/Posters/Sides/Modernite%CC%81.png',
        videoUrl: STOCK_VIDEOS[0]
      },
      {
        id: 'lum-transmission',
        title: 'Transmission',
        subtitle: 'Ce qu’on apprend, ce qu’on lègue, la relève.',
        question: 'Quel savoir précieux transmettez-vous à la nouvelle génération pour assurer la suite ?',
        posterUrl: '/Posters/Sides/Irokos.png',
        videoUrl: STOCK_VIDEOS[1]
      },
      {
        id: 'lum-avenir',
        title: 'Avenir',
        subtitle: 'Ce qu’on rêve de construire.',
        question: 'Quel rêve d’avenir ambitieux et lumineux guide aujourd’hui tous vos efforts ?',
        posterUrl: '/Posters/Sides/Horizons.png',
        videoUrl: STOCK_VIDEOS[2]
      }
    ]
  },

  // =========================================================================
  // 5. FOCUS (Alimenté dynamiquement par les 8 Focus ouverts à tous, hors sponsorisés)
  // =========================================================================
  {
    id: 'focus',
    title: 'Focus',
    durationBadge: "Jusqu'à 2 minutes 56",
    subtitle: 'Chaque thématique est un sujet précis et ouvert à tous. On partage son histoire, son souvenir ou sa voix pour enrichir le récit collectif.',
    question: 'Sur quelle thématique souhaitez-vous partager votre histoire ou votre souvenir personnel ?',
    posterUrl: '/Posters/Studio/Studio.Focus.png?v=2',
    videoUrl: STOCK_VIDEOS[4],
    items: FOCUS_DATA.filter((focus) => focus.accesOuvert && !focus.commandite).map((focus, idx) => ({
      id: focus.id,
      title: focus.titre,
      sousTitre: focus.sousTitre,
      subtitle: focus.synopsis,
      consigne: focus.consigne,
      question: focus.question,
      roles: focus.roles,
      posterUrl: focus.posterUrl,
      videoUrl: STOCK_VIDEOS[idx % STOCK_VIDEOS.length],
      subCategories: focus.questions.map((q) => ({
        id: `${focus.id}__${q.id}`,
        title: focus.titre,
        sousTitre: focus.sousTitre,
        badge: `Question ${parseInt(q.number, 10) || q.number}`,
        episodeTitle: q.title,
        durationBadge: "Jusqu'à 2 minutes 56",
        subtitle: focus.synopsis,
        consigne: focus.consigne,
        question: q.question,
        roles: focus.roles,
        posterUrl: FOCUS_EPISODE_POSTERS[focus.id]?.[q.id] || focus.posterUrl,
        videoUrl: STOCK_VIDEOS[idx % STOCK_VIDEOS.length]
      }))
    }))
  }
];
