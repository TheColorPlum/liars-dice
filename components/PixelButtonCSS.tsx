import React, { useState } from 'react'
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  GestureResponderEvent
} from 'react-native'

interface PixelButtonCSSProps {
  text: string
  onPress: (event: GestureResponderEvent) => void
  color?: 'gold' | 'red' | 'green' | 'blue' | 'silver'
  disabled?: boolean
  size?: 'small' | 'medium' | 'large' | 'auto'
  style?: ViewStyle
  textStyle?: TextStyle
}

export const PixelButtonCSS: React.FC<PixelButtonCSSProps> = ({
  text,
  onPress,
  color = 'gold',
  disabled = false,
  size = 'auto',
  style,
  textStyle
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getButtonColors = () => {
    const colors = {
      gold: {
        base: '#FFD700',
        highlight: '#FFEC8B', 
        shadow: '#CC9900',
        border: '#B8860B',
        text: '#2A2A2A'
      },
      red: {
        base: '#FF4444',
        highlight: '#FF6666',
        shadow: '#CC2222',
        border: '#AA1111',
        text: '#FFFFFF'
      },
      green: {
        base: '#44AA44',
        highlight: '#66CC66',
        shadow: '#228822',
        border: '#116611',
        text: '#FFFFFF'
      },
      blue: {
        base: '#4444FF',
        highlight: '#6666FF',
        shadow: '#2222CC',
        border: '#1111AA',
        text: '#FFFFFF'
      },
      silver: {
        base: '#C0C0C0',
        highlight: '#E0E0E0',
        shadow: '#A0A0A0',
        border: '#808080',
        text: '#2A2A2A'
      }
    }
    return colors[color]
  }

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return { height: 36, paddingHorizontal: 12, minWidth: 80 }
      case 'large':
        return { height: 52, paddingHorizontal: 20, minWidth: 160 }
      case 'auto':
        return { height: 48, paddingHorizontal: 16, minWidth: 200 }
      default: // medium
        return { height: 44, paddingHorizontal: 16, minWidth: 120 }
    }
  }

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 10
      case 'large':
        return 14
      case 'auto':
        return 12
      default: // medium
        return 12
    }
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

  const colors = getButtonColors()
  const buttonSize = getButtonSize()
  const fontSize = getTextSize()

  // Dynamic styling based on state
  const getButtonStyle = (): ViewStyle => {
    let baseStyle: ViewStyle = {
      backgroundColor: colors.base,
      borderWidth: 2,
      borderTopColor: colors.highlight,
      borderLeftColor: colors.highlight,
      borderRightColor: colors.shadow,
      borderBottomColor: colors.shadow,
      borderRadius: 6, // Slight rounding for pixel art style
      ...buttonSize,
    }

    if (isPressed) {
      // Pressed state: invert the highlight/shadow
      baseStyle = {
        ...baseStyle,
        borderTopColor: colors.shadow,
        borderLeftColor: colors.shadow,
        borderRightColor: colors.highlight,
        borderBottomColor: colors.highlight,
        backgroundColor: colors.shadow, // Slightly darker when pressed
      }
    } else if (isHovered) {
      // Hover state: slightly brighter
      baseStyle = {
        ...baseStyle,
        backgroundColor: colors.highlight,
      }
    }

    if (disabled) {
      baseStyle = {
        ...baseStyle,
        backgroundColor: '#999999',
        borderTopColor: '#BBBBBB',
        borderLeftColor: '#BBBBBB',
        borderRightColor: '#777777',
        borderBottomColor: '#777777',
      }
    }

    return baseStyle
  }

  const getTextColor = () => {
    if (disabled) return '#666666'
    if (isPressed && color === 'gold') return colors.text // Maintain contrast when pressed
    return colors.text
  }

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
        getButtonStyle(),
        style
      ]}
      activeOpacity={disabled ? 1 : 0.9}
    >
      <Text 
        style={[
          styles.buttonText,
          { 
            fontSize,
            color: getTextColor(),
          },
          textStyle
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    // Perfect flexbox centering - no ImageBackground conflicts
  },
  buttonText: {
    fontFamily: 'PressStart2P_400Regular',
    textAlign: 'center',
    fontWeight: 'normal', // Pixel fonts don't need font-weight
    // Perfect text centering with flexbox parent
    textAlignVertical: 'center',
    includeFontPadding: false, // Android: remove extra padding
    // No line height needed - flexbox handles vertical centering
  },
})

export default PixelButtonCSS