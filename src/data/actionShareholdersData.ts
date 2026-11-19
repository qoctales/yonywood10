export interface ActionShareholderProfile {
  id: string;
  name: string;
  photo: string;
  video?: string;
  phrase: string;
  series: string[];
  protagonistId: string;
}

/**
 * 3 profils de démo de coproducteurs affichés sur la page Coproductions.
 * Chacun dispose de son portrait, de sa vidéo et des séries dans lesquelles il a investi.
 */
export const ACTION_SHAREHOLDERS: ActionShareholderProfile[] = [
  {
    id: 'coprod-demo-1',
    name: 'Nadia Kossi',
    photo: '/assets/duos/fatou-diallo.jpg',
    video: '/sample.mp4',
    phrase: 'Soutenir les bâtisseurs et les initiatives locales qui transforment nos territoires.',
    series: ['Builders ‹ › Mi do kpô', 'Remèdes ‹ › E Vivi'],
    protagonistId: 'coprod-nadia-kossi',
  },
  {
    id: 'coprod-demo-2',
    name: 'Armel Sarr',
    photo: '/assets/duos/coach-office.jpg',
    video: '/sample.mp4',
    phrase: 'Faire dialoguer la recherche, l’artisanat d’art et la mémoire vivante.',
    series: ['Fiat Luxe ‹ › Irokos', 'Regards ‹ › Gbé'],
    protagonistId: 'coprod-armel-sarr',
  },
  {
    id: 'coprod-demo-3',
    name: 'Amara Kouyaté',
    photo: '/assets/images/amara-kouyate-illus.jpg',
    video: '/sample.mp4',
    phrase: 'Propulser les créatrices et les récits africains qui inspirent les nouvelles générations.',
    series: ['Blacks One ‹ › Nyonoukpo', 'Horizons ‹ › Finagnon'],
    protagonistId: 'coprod-amara-kouyate',
  },
];
