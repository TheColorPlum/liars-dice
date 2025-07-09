// Retro Casino Theme System
// Pixel art inspired color palette with casino aesthetics

export const CasinoTheme = {
  // Primary Colors - Casino Table
  colors: {
    // Deep casino green - like felt tables
    casinoGreen: '#1B5E20',
    casinoGreenLight: '#2E7D32',
    casinoGreenDark: '#0D2818',
    
    // Rich gold - for accents and highlights
    gold: '#FFD700',
    goldLight: '#FFECB3',
    goldDark: '#FF8F00',
    
    // Casino red - for danger/challenge actions
    casinoRed: '#B71C1C',
    casinoRedLight: '#D32F2F',
    casinoRedDark: '#8B0000',
    
    // Rich backgrounds
    charcoal: '#212121',
    charcoalLight: '#424242',
    charcoalDark: '#121212',
    
    // Text colors
    cream: '#FFF8E1',
    creamDark: '#F5F5DC',
    white: '#FFFFFF',
    
    // Accent colors
    purple: '#6A1B9A',
    purpleLight: '#8E24AA',
    orange: '#E65100',
    orangeLight: '#FF6F00',
    
    // Neutral grays
    gray: '#616161',
    grayLight: '#9E9E9E',
    grayDark: '#424242',
  },
  
  // Typography
  fonts: {
    // Pixel/retro style for headers
    header: {
      fontFamily: 'monospace', // Will use system monospace for pixel feel
      fontWeight: 'bold',
    },
    // Clean modern for body text
    body: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    // Bold numbers for important values
    numbers: {
      fontFamily: 'monospace',
      fontWeight: 'bold',
    }
  },
  
  // Spacing (based on 8px grid for pixel perfect alignment)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border radius for pixel art style
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  
  // Shadows for depth
  shadows: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 0, // Sharp shadows for pixel art
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 0,
      elevation: 4,
    },
    large: {
      shadowColor: '#000000',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 0,
      elevation: 6,
    }
  },
  
  // Common component styles
  components: {
    // Casino table felt background
    feltBackground: {
      backgroundColor: '#1B5E20',
      // Could add background image for felt texture
    },
    
    // Gold bordered container
    goldContainer: {
      borderWidth: 3,
      borderColor: '#FFD700',
      backgroundColor: '#212121',
    },
    
    // Player seat styling
    playerSeat: {
      backgroundColor: '#424242',
      borderWidth: 2,
      borderColor: '#FFD700',
      borderRadius: 8,
    },
    
    // Betting button
    betButton: {
      backgroundColor: '#FFD700',
      borderWidth: 2,
      borderColor: '#FF8F00',
      borderRadius: 8,
    },
    
    // Challenge button
    challengeButton: {
      backgroundColor: '#B71C1C',
      borderWidth: 2,
      borderColor: '#8B0000',
      borderRadius: 8,
    },
    
    // Dice styling
    dice: {
      backgroundColor: '#FFF8E1',
      borderWidth: 2,
      borderColor: '#212121',
      borderRadius: 4,
    }
  }
};

// Utility functions for theme usage
export const getContainerStyle = (variant: 'felt' | 'gold' | 'seat' = 'gold') => {
  switch (variant) {
    case 'felt':
      return CasinoTheme.components.feltBackground;
    case 'seat':
      return CasinoTheme.components.playerSeat;
    default:
      return CasinoTheme.components.goldContainer;
  }
};

export const getButtonStyle = (variant: 'bet' | 'challenge' = 'bet') => {
  return variant === 'challenge' 
    ? CasinoTheme.components.challengeButton 
    : CasinoTheme.components.betButton;
};

export const getTextStyle = (variant: 'header' | 'body' | 'numbers' = 'body') => {
  return CasinoTheme.fonts[variant];
};