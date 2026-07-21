/**
 * Client brand palette — single source of truth for navigation, auth, and CTAs.
 * Referenced via CSS variables in index.css and Tailwind `client-*` utilities.
 */
export const clientColors = {
  /** Client primary blue */
  clientPrimaryBlue: '#000067',
  /** Blue helix dark */
  blueHelixDark: '#0000C9',
  /** Cyan helix light */
  cyanHelixLight: '#0095FF',
  /** Cyan 30 */
  cyan30: '#68d1ff',
  /** Cyan 10 */
  cyan10: '#E0F5FF',
} as const;

/** Bold brand gradient for promo cards and marketing surfaces. */
export const clientBrandGradient =
  'linear-gradient(145deg, #000067 0%, #0000C9 42%, #0095FF 78%, #68d1ff 100%)';

/** Soft cyan gradient fill for cards and the prompt composer. */
export const clientBrandCardGradient =
  'linear-gradient(145deg, #E0F5FF 0%, #ffffff 38%, #f5fbff 68%, #c8ebff 100%)';

export type ClientColorKey = keyof typeof clientColors;

export default clientColors;
