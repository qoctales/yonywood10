export type ProfileOnboardingCardId = 'security' | 'series' | 'videos' | 'coproductions';

export interface ProfileOnboardingCardEntry {
  id: ProfileOnboardingCardId;
  title: string;
  posterUrl: string;
  papyrusText: string;
}

export const SERIES_FEED_SECTION_LABEL = 'Séries du feed';

/**
 * Contenu éditorial et visuels d'accueil de la page Profil (ordre imposé).
 * Les chemins respectent strictement la casse des fichiers dans public/Posters/Onboardings/.
 */
export const PROFILE_ONBOARDING_CARDS: ProfileOnboardingCardEntry[] = [
  {
    id: 'security',
    title: 'Sécurité',
    posterUrl: '/Posters/Onboardings/securite.png',
    papyrusText:
      'Ton compte, sous clé. Modifie ton nom, ton mot de passe et gère tes accès en toute tranquillité.'
  },
  {
    id: 'series',
    title: SERIES_FEED_SECTION_LABEL,
    posterUrl: '/Posters/Onboardings/choixdesseries.png',
    papyrusText:
      'Compose ton feed. Fais défiler les séries, valide celles qui te donnent envie et écarte les autres. Ton feed s’adapte à tes choix.'
  },
  {
    id: 'videos',
    title: 'Mes Vidéos',
    posterUrl: '/Posters/Onboardings/mesvideos.png',
    papyrusText:
      'Ta collection, tes règles. Retrouve toutes tes vidéos : change la couverture, modifie le titre ou supprime-les. Ajoute-en une nouvelle avec le « + ».'
  },
  {
    id: 'coproductions',
    title: 'Coproductions',
    posterUrl: '/Posters/Onboardings/coproductions.png',
    papyrusText:
      'Tes séries soutenues, au même endroit. Retrouve les séries que tu as choisi de coproduire en mode démo, leurs vues, leurs duos et le nombre de parts simulées.'
  }
];
