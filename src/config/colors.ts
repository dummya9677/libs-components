/**
 * Central color configuration for the application.
 * Tailwind maps these via CSS variables in index.css / tailwind.config.js.
 *
 * Brand tokens map to client palette — see src/config/clientColors.ts
 */
import { clientColors } from './clientColors';

export { clientColors };

export const colors = {
  /* Brand (client palette) */
  logo: clientColors.blueHelixDark,
  brand: clientColors.cyanHelixLight,
  brandDark: clientColors.blueHelixDark,
  brandSoft: clientColors.cyan10,

  /* Surfaces */
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  sidebar: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  /* Text */
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  /* Status */
  success: '#22C55E',
  successSoft: '#DCFCE7',
  warning: '#F59E0B',
  danger: '#EF4444',

  /* Chat */
  chatUser: '#2563EB',
  chatBot: '#F1F5F9',
  progress: '#3B82F6',

  /* Promo / CTA */
  promo: '#1E3A5F',
  promoButton: '#1E40AF',

  /* Agent themes */
  agents: {
    ticket: {
      primary: '#7C3AED',
      soft: '#F5F3FF',
      gradientFrom: '#EDE9FE',
      gradientTo: '#F5F3FF',
      chip: '#7C3AED',
      heroIcon: '#7C3AED',
    },
    impact: {
      primary: '#10B981',
      soft: '#ECFDF5',
      gradientFrom: '#D1FAE5',
      gradientTo: '#ECFDF5',
      chip: '#059669',
      heroIcon: '#10B981',
    },
    dataIssue: {
      primary: '#8B5CF6',
      soft: '#F5F3FF',
      gradientFrom: '#DDD6FE',
      gradientTo: '#EDE9FE',
      chip: '#7C3AED',
      heroIcon: '#8B5CF6',
    },
    knowledge: {
      primary: '#F59E0B',
      soft: '#FFFBEB',
      gradientFrom: '#FDE68A',
      gradientTo: '#FEF3C7',
      chip: '#D97706',
      heroIcon: '#F59E0B',
    },
    dataQuality: {
      primary: '#0D9488',
      soft: '#F0FDFA',
      gradientFrom: '#CCFBF1',
      gradientTo: '#F0FDFA',
      chip: '#0F766E',
      heroIcon: '#14B8A6',
    },
    cost: {
      primary: '#E11D48',
      soft: '#FFF1F2',
      gradientFrom: '#FECDD3',
      gradientTo: '#FFF1F2',
      chip: '#BE123C',
      heroIcon: '#F43F5E',
    },
  },

  /* Feature card accents (shared across agents) */
  feature: {
    purple: '#7C3AED',
    blue: '#3B82F6',
    green: '#10B981',
    orange: '#F97316',
    yellow: '#EAB308',
    gold: '#D97706',
  },

  /* Banner */
  banner: '#EEF2FF',
  bannerText: '#312E81',
} as const;

export type AgentColorKey = keyof typeof colors.agents;
export type AppColors = typeof colors;

export default colors;
