/**
 * BIP Escola - Sistema de Design Tokens (Soulful UI & UI/UX Guidelines)
 * Espaçamento estrito no Grid de 8px, tipografia harmônica e paleta unificada.
 */

export const colors = {
  // Cores Primárias (Identidade BIP Escola - Navy & Trust)
  primary: '#0B3B60',
  primaryLight: '#1C5B8C',
  primaryDark: '#06233B',
  primarySurface: '#EBF3FA',

  // Cores de Apoio / Destaque Semântico
  secondary: '#2E7D32',      // Verde Presença / Sucesso
  secondarySurface: '#E8F5E9',
  secondaryLight: '#4CAF50',

  accent: '#C25E00',         // Âmbar / Avaliações / Atenção
  accentSurface: '#FFF8E1',
  accentLight: '#F59E0B',

  highlight: '#9C27B0',      // Púrpura Admin
  highlightSurface: '#F3E5F5',

  notice: '#C2185B',         // Magenta / Avisos importantes
  noticeSurface: '#FCE4EC',

  // Neutros Sofisticados (Camadas e Profundidade)
  background: '#F8FAFC',     // Slate suave, orgânico (não cinza morto)
  surface: '#FFFFFF',
  surfaceCard: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  borderFocus: '#0B3B60',
  divider: '#F1F5F9',

  // Texto com Alto Contraste (WCAG AA+)
  textPrimary: '#0F172A',    // Slate 900
  textSecondary: '#475569',  // Slate 600
  textMuted: '#64748B',      // Slate 500
  textInverse: '#FFFFFF',

  // Feedback
  success: '#15803D',
  successSurface: '#DCFCE7',
  warning: '#B45309',
  warningSurface: '#FEF3C7',
  error: '#DC2626',
  errorSurface: '#FEE2E2',
};

// 8px Strict Grid (soulful-ui-architect: todo margin/padding/gap múltiplo de 8)
export const spacing = {
  none: 0,
  xs: 4,      // exceções mínimas pontuais como borders e micro-badges
  sm: 8,      // 8px
  md: 16,     // 16px
  lg: 24,     // 24px
  xl: 32,     // 32px
  xxl: 40,    // 40px
  xxxl: 48,   // 48px
};

// Raios de Borda Padronizados
export const radius = {
  sm: 8,      // inputs, botões pequenos
  md: 12,     // cards, dropdowns
  lg: 16,     // modais, containers principais
  xl: 24,     // bottoms sheets, grandes containers
  full: 9999, // avatares, pílulas
};

// Tipografia com Escala e Altura de Linha Respirada (line-height >= 1.5)
export const typography = {
  h1: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: 'Roboto_700Bold',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'Roboto_700Bold',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  h3: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Roboto_700Bold',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  body: {
    fontSize: 14,
    lineHeight: 22, // 22/14 = 1.57 (Respirado e legível)
    fontFamily: 'Roboto_400Regular',
    color: colors.textSecondary,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Roboto_500Medium',
    color: colors.textPrimary,
  },
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Roboto_400Regular',
    color: colors.textMuted,
  },
  captionBold: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Roboto_500Medium',
    color: colors.textPrimary,
  },
};

// Sombras Orgânicas Multi-Camadas (Soulful UI Rule 3)
export const shadows = {
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  modal: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
};
