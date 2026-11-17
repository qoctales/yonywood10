// Dimensions partagées des cartes vidéo centrales (Studio, Duocumentaires, Coproductions)
// Calibrées sur le rendu 9:16 de Duocumentaires, lisibles entre l'en-tête et la barre du bas dès 360×640.
export const STAGE_CARD_DIMENSIONS_CLASS =
  'aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))]';

export const STAGE_PERSPECTIVE = '1200px';
export const STAGE_CENTER_TRANSLATE_Z = 45;
