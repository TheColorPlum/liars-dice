import React, { useState } from 'react'
import { 
  TouchableOpacity, 
  ImageBackground, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  GestureResponderEvent
} from 'react-native'
import { CasinoTheme } from '../lib/theme'
import { assetManager } from '../lib/AssetManager'

interface PixelButtonProps {
  text: string
  onPress: (event: GestureResponderEvent) => void
  color?: 'lightblue' | 'red' | 'yellow' | 'green' | 'blue' | 'silver' | 'gold' | 'wood'
  disabled?: boolean
  size?: 'small' | 'medium' | 'large' | 'auto'
  style?: ViewStyle
  textStyle?: TextStyle
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  text,
  onPress,
  color = 'gold',
  disabled = false,
  size = 'medium',
  style,
  textStyle
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getButtonState = () => {
    if (disabled) return 'normal' // Use normal state for disabled, will be styled differently
    if (isPressed) return 'clicked'
    if (isHovered) return 'hover'
    return 'normal'
  }

  const getButtonImage = () => {
    return assetManager.getButtonSprite(color, getButtonState())
  }

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return { width: 80, height: 36 }
      case 'large':
        return { width: 200, height: 52 }
      case 'auto':
        return { width: undefined, height: 48, minWidth: 200, paddingHorizontal: 16 } // Much wider for menu text
      default: // medium
        return { width: 120, height: 44 }
    }
  }

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 10
      case 'large':
        return 14
      case 'auto':
        return 12 // Good for menu buttons
      default: // medium
        return 12
    }
  }

  const getTextLineHeight = () => {
    // For pixel fonts, line height should be slightly larger than font size for better centering
    const fontSize = getTextSize()
    return fontSize * 1.2 // 20% larger for better vertical centering
  }

  const handlePressIn = () => {
    if (!disabled) {
      setIsPressed(true)
    }
  }

  const handlePressOut = () => {
    setIsPressed(false)
  }

  const handlePress = (event: GestureResponderEvent) => {
    if (!disabled) {
      onPress(event)
    }
  }

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const buttonSize = getButtonSize()
  const fontSize = getTextSize()
  const lineHeight = getTextLineHeight()

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      style={[
        styles.button,
        buttonSize,
        disabled && styles.disabledButton,
        style
      ]}
      activeOpacity={disabled ? 1 : 0.8}
    >
      <ImageBackground
        source={getButtonImage()}
        style={[styles.buttonBackground, buttonSize]}
        resizeMode="stretch"
        imageStyle={[styles.buttonImage, buttonSize]}
      >
        <Text 
          style={[
            styles.buttonText,
            { fontSize, lineHeight },
            disabled && styles.disabledText,
            textStyle
          ]}
        >
          {text}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 200, // Ensure minimum width for text
    paddingHorizontal: 8, // Small padding to ensure text isn't touching edges
  },
  buttonImage: {
    borderRadius: 0, // Ensure pixel-perfect rendering
  },
  buttonText: {
    fontFamily: 'PressStart2P_400Regular', // Use pixel font
    textAlign: 'center',
    color: CasinoTheme.colors.charcoalDark,
    // Fix vertical centering for pixel fonts
    textAlignVertical: 'center',
    includeFontPadding: false, // Android: remove extra font padding
    // lineHeight will be set dynamically in component
  },
  disabledText: {
    color: CasinoTheme.colors.grayDark,
  },
})

export default PixelButton