/**
 * Utilitaires de formatage de texte pour les cartes vidéo et badges YonyWood.
 * Règle stricte d'affichage : Seule la première lettre est en majuscule,
 * tout le reste est en minuscule (Sentence case).
 */

export const formatFirstLetterOnly = (text?: string | null): string => {
  if (!text) return '';
  const trimmed = text.trim();
  if (!trimmed) return '';

  // Si le titre contient un séparateur de duo (<>, < > ou ‹ ›), conserver la casse exacte des titres de série
  if (/‹\s*›|<\s*>/.test(trimmed)) {
    const sep = trimmed.includes('<>')
      ? '<>'
      : trimmed.includes('< >')
        ? '< >'
        : '‹ ›';
    return trimmed
      .split(/‹\s*›|<\s*>/)
      .map(part => part.trim())
      .filter(Boolean)
      .join(` ${sep} `);
  }

  const lower = trimmed.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

