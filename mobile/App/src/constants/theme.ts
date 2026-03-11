export const theme = {
  colors: {
    // Primary Brand Colors (Solana)
    primary: '#9945FF',
    primaryLight: 'rgba(153, 69, 255, 0.1)',
    secondary: '#10B981', // More professional emerald green
    secondaryLight: 'rgba(16, 185, 129, 0.1)',
    
    // Light Mode Backgrounds & Surfaces
    background: '#F9FAFB', // Very subtle off-white/gray
    surface: '#FFFFFF', // Crisp white for cards
    surfaceMuted: '#F3F4F6', // For nested elements like code blocks
    surfaceHighlight: '#F9FAFB',
    
    // Status Colors
    error: '#EF4444',
    errorLight: '#FEE2E2',
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    
    // Text Colors
    textMain: '#111827', // Deep gray/almost black for high readability
    textDim: '#4B5563', // Muted text for secondary info
    textLight: '#9CA3AF', // Placeholders or tertiary info
    
    // Borders & UI Elements
    border: '#E5E7EB', // Light dividers
    iconMain: '#374151',
    iconDim: '#6B7280',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  
  typography: {
    // We retain the default system fonts but standardize structural weights
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    }
  },
  
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    button: {
      shadowColor: '#9945FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    }
  }
};
