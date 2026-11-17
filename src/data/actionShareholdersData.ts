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
 * Fichier unique et simple (modifiable à la main) pour les profils affichés sur la page Action.
 * - video : optionnel (si absent, la carte affiche la photo, le nom et la phrase).
 * - series : une ou plusieurs séries dans lesquelles la personne a des actions.
 */
export const ACTION_SHAREHOLDERS: ActionShareholderProfile[] = [
  {
    id: 'action-exemple-1',
    name: 'Kora Lemaire (EXEMPLE)',
    photo: '/assets/protagonists/amara-tisserande.jpg',
    video: '/sample.mp4',
    phrase: 'Passionnée par la mémoire des savoir-faire et des artisans de terrain.',
    series: ['Benin ‹ › Le Monde'],
    protagonistId: 'exemple-kora-lemaire',
  },
  {
    id: 'action-exemple-2',
    name: 'Nilo Sarr (EXEMPLE)',
    photo: '/assets/protagonists/armel-hounkpatin.jpg',
    video: '/sample.mp4',
    phrase: 'Soutien des récits documentaires qui relient les générations.',
    series: ['Blacks One ‹ › Amazones', 'Roots < > Routes'],
    protagonistId: 'exemple-nilo-sarr',
  },
  {
    id: 'action-exemple-3',
    name: 'Tavi Boka (EXEMPLE)',
    photo: '/assets/protagonists/koffi-tisserand.jpg',
    phrase: 'Faire vivre nos récits patrimoniaux pour que chacun retrouve ses repères.',
    series: ['Vodun Rays ‹ › Autre Foi'],
    protagonistId: 'exemple-tavi-boka',
  },
];
