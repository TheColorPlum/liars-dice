import React from 'react'
import { View, Image, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { PixelArt } from '../lib/PixelArtSystem'
import { assetManager } from '../lib/AssetManager'

interface PixelPanelProps {
  children?: React.ReactNode
  title?: string
  backgroundType?: 'black-white' | 'color'
  backgroundVariant?: number
  borderType?: number
  borderWithBackground?: boolean
  width?: number
  height?: number
  style?: ViewStyle
  titleStyle?: TextStyle
  padding?: number
  renderMethod?: 'auto' | 'stretch' | 'tile' | '9slice'
}

export const PixelPanel: React.FC<PixelPanelProps> = ({
  children,
  title,
  backgroundType = 'black-white',
  backgroundVariant,
  borderType,
  borderWithBackground = false,
  width,
  height,
  style,
  titleStyle,
  padding = 16,
  renderMethod = 'auto'
}) => {
  // Get the background asset
  const backgroundAsset = assetManager.getBackgroundSprite(backgroundType, backgroundVariant)
  
  // Determine render method if auto
  let finalRenderMethod = renderMethod
  if (renderMethod === 'auto') {
    const assetKey = `${backgroundType}_${backgroundVariant}`
    const analysis = PixelArt.Analyzer.analyzeBackgroundAsset(assetKey)
    
    // For background assets, we'll use stretch by default since they're designed as complete panels
    finalRenderMethod = analysis.recommendedUsage === 'full' ? 'stretch' : analysis.recommendedUsage
  }
  
  // Calculate container dimensions
  const containerStyle: ViewStyle = {
    width,
    height,
    minHeight: height || 80,
    position: 'relative',
    ...style
  }
  
  // Use static padding to avoid React Native Web dynamic style issues
  const scaledPadding = padding
  
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Background Image - use repeat/tile instead of stretch */}
      <Image
        source={backgroundAsset}
        style={[
          styles.backgroundImage,
          {
            width: '100%',
            height: '100%',
          }
        ]}
        resizeMode="repeat"
      />
      
      {/* Content Container */}
      <View style={[
        styles.contentContainer,
        {
          padding: scaledPadding,
        }
      ]}>
        {title && (
          <Text style={[styles.title, titleStyle]}>{title}</Text>
        )}
        {children}
      </View>
      
      {/* Optional Border Overlay */}
      {borderType && (
        <Image
          source={assetManager.getBorderSprite(borderType, borderWithBackground)}
          style={styles.borderOverlay}
          resizeMode="stretch"
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    position: 'relative',
    zIndex: 1,
    flex: 1,
  },
  title: {
    color: PixelArt.Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  borderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
})