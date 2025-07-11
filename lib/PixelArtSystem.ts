/**
 * Pixel Art UI System - Designed for authentic retro game interfaces
 * 
 * This system is built around the principles of classic arcade/console game UI:
 * - Assets used at native resolution (no stretching)
 * - Proper 9-slice scaling for borders
 * - Tiling for backgrounds
 * - Integer scaling only (1x, 2x, 3x, 4x)
 * - Consistent pixel grid alignment
 */

import { ImageSourcePropType, ViewStyle } from 'react-native'
import { assetManager } from './AssetManager'

// Pixel Art Design Constants
export const PIXEL_ART_CONFIG = {
  // Base pixel unit - all measurements are multiples of this
  basePixel: 8,
  
  // Supported scaling factors (integer only for crisp pixels)
  supportedScales: [1, 2, 3, 4],
  
  // Standard dimensions based on typical pixel art conventions
  standardSizes: {
    button: { width: 80, height: 32 },
    panel: { minWidth: 160, minHeight: 80 },
    border: { thickness: 8 },
    dice: { size: 48 },
  },
  
  // Grid system for consistent alignment
  grid: {
    xs: 8,   // 1 unit
    sm: 16,  // 2 units
    md: 24,  // 3 units
    lg: 32,  // 4 units
    xl: 40,  // 5 units
    xxl: 48, // 6 units
  }
}

// Asset Usage Guidelines
export const ASSET_USAGE = {
  // Dice sprites - use at native resolution
  dice: {
    method: 'native',
    scaling: 'integer',
    notes: 'Individual sprites, no stretching'
  },
  
  // Button sprites - use at native resolution with proper states
  buttons: {
    method: 'native',
    scaling: 'integer',
    notes: 'Three states: normal, hover, clicked'
  },
  
  // Background sprites - analyze for tiling vs panel use
  backgrounds: {
    method: 'tile_or_panel',
    scaling: 'tile',
    notes: 'May be meant for tiling or as complete panels'
  },
  
  // Border sprites - designed for 9-slice scaling
  borders: {
    method: '9slice',
    scaling: 'slice',
    notes: 'Corner + edge pieces for scalable borders'
  }
}

// Pixel Art Scaling Utilities - Simplified for React Native Web compatibility
export class PixelArtScaler {
  private static currentScale: number = 1
  
  /**
   * Determine optimal scale based on screen size
   */
  static getOptimalScale(screenWidth: number, screenHeight: number): number {
    // Base design assumes 320px wide (classic arcade resolution)
    const baseWidth = 320
    const scale = Math.floor(screenWidth / baseWidth)
    
    // Clamp to supported scales
    return Math.max(1, Math.min(4, scale))
  }
  
  /**
   * Scale a value by current pixel scale - simplified for web compatibility
   */
  static scale(value: number): number {
    return value // Return value as-is to avoid dynamic style issues
  }
  
  /**
   * Set the current scale factor
   */
  static setScale(scale: number): void {
    this.currentScale = scale
  }
  
  /**
   * Get pixel-perfect dimensions for a component
   */
  static getDimensions(baseWidth: number, baseHeight: number): { width: number, height: number } {
    return {
      width: baseWidth,
      height: baseHeight
    }
  }
}

// Pixel Art Layout System - Simplified for React Native Web compatibility
export class PixelArtLayout {
  /**
   * Create a pixel-perfect container style
   */
  static createContainer(config: {
    width?: number
    height?: number
    padding?: number
    margin?: number
  }): ViewStyle {
    return {
      width: config.width,
      height: config.height,
      padding: config.padding,
      margin: config.margin,
      // Ensure pixel-perfect positioning
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    }
  }
  
  /**
   * Create a pixel grid layout
   */
  static createGrid(columns: number, gap: number = PIXEL_ART_CONFIG.grid.sm): ViewStyle {
    return {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      // Note: gap property not supported in React Native Web
      // Use margin on child elements instead
    }
  }
  
  /**
   * Create a pixel-perfect stack layout
   */
  static createStack(direction: 'horizontal' | 'vertical', gap: number = PIXEL_ART_CONFIG.grid.sm): ViewStyle {
    return {
      flexDirection: direction === 'horizontal' ? 'row' : 'column',
      alignItems: 'flex-start',
      // Note: gap property not supported in React Native Web
      // Use margin on child elements instead
    }
  }
}

// 9-Slice Border System - Simplified for React Native Web compatibility
export class NineSliceBorder {
  /**
   * Create a 9-slice border configuration
   */
  static createBorderConfig(borderAsset: ImageSourcePropType, sliceSize: number = 8) {
    return {
      borderAsset,
      sliceSize: sliceSize,
      // 9-slice areas: top-left, top, top-right, left, center, right, bottom-left, bottom, bottom-right
      slices: {
        topLeft: { x: 0, y: 0, width: sliceSize, height: sliceSize },
        top: { x: sliceSize, y: 0, width: sliceSize, height: sliceSize },
        topRight: { x: sliceSize * 2, y: 0, width: sliceSize, height: sliceSize },
        left: { x: 0, y: sliceSize, width: sliceSize, height: sliceSize },
        center: { x: sliceSize, y: sliceSize, width: sliceSize, height: sliceSize },
        right: { x: sliceSize * 2, y: sliceSize, width: sliceSize, height: sliceSize },
        bottomLeft: { x: 0, y: sliceSize * 2, width: sliceSize, height: sliceSize },
        bottom: { x: sliceSize, y: sliceSize * 2, width: sliceSize, height: sliceSize },
        bottomRight: { x: sliceSize * 2, y: sliceSize * 2, width: sliceSize, height: sliceSize },
      }
    }
  }
}

// Pixel Art Color System
export const PIXEL_ART_COLORS = {
  // Use exact colors that work well with pixel art
  primary: '#FFD700',    // Gold
  secondary: '#1B5E20',  // Dark Green
  accent: '#B71C1C',     // Red
  background: '#2A2A2A', // Dark Gray
  text: '#FFF8E1',       // Cream
  border: '#616161',     // Gray
  
  // Pixel art needs high contrast
  shadows: '#000000',
  highlights: '#FFFFFF',
}

// Pixel Art Component System
export class PixelArtRenderer {
  /**
   * Render a tiled background pattern
   */
  static renderTiledBackground(asset: ImageSourcePropType, containerWidth: number, containerHeight: number, tileSize: number = 64) {
    const scale = PixelArtScaler.scale
    const scaledTileSize = scale(tileSize)
    
    const tilesX = Math.ceil(containerWidth / scaledTileSize)
    const tilesY = Math.ceil(containerHeight / scaledTileSize)
    
    const tiles = []
    for (let y = 0; y < tilesY; y++) {
      for (let x = 0; x < tilesX; x++) {
        tiles.push({
          x: x * scaledTileSize,
          y: y * scaledTileSize,
          width: scaledTileSize,
          height: scaledTileSize,
          asset
        })
      }
    }
    
    return tiles
  }
  
  /**
   * Calculate 9-slice layout for a given size
   */
  static calculate9SliceLayout(width: number, height: number, sliceSize: number = 8) {
    const scale = PixelArtScaler.scale
    const scaledSlice = scale(sliceSize)
    
    // Ensure minimum size can accommodate corners
    const minWidth = scaledSlice * 2
    const minHeight = scaledSlice * 2
    
    const finalWidth = Math.max(width, minWidth)
    const finalHeight = Math.max(height, minHeight)
    
    return {
      // Corner pieces (fixed size)
      topLeft: { x: 0, y: 0, width: scaledSlice, height: scaledSlice },
      topRight: { x: finalWidth - scaledSlice, y: 0, width: scaledSlice, height: scaledSlice },
      bottomLeft: { x: 0, y: finalHeight - scaledSlice, width: scaledSlice, height: scaledSlice },
      bottomRight: { x: finalWidth - scaledSlice, y: finalHeight - scaledSlice, width: scaledSlice, height: scaledSlice },
      
      // Edge pieces (stretched)
      top: { x: scaledSlice, y: 0, width: finalWidth - (scaledSlice * 2), height: scaledSlice },
      bottom: { x: scaledSlice, y: finalHeight - scaledSlice, width: finalWidth - (scaledSlice * 2), height: scaledSlice },
      left: { x: 0, y: scaledSlice, width: scaledSlice, height: finalHeight - (scaledSlice * 2) },
      right: { x: finalWidth - scaledSlice, y: scaledSlice, width: scaledSlice, height: finalHeight - (scaledSlice * 2) },
      
      // Center piece (stretched)
      center: { x: scaledSlice, y: scaledSlice, width: finalWidth - (scaledSlice * 2), height: finalHeight - (scaledSlice * 2) },
      
      // Final dimensions
      finalWidth,
      finalHeight
    }
  }
}

// Asset Analysis System
export class PixelArtAssetAnalyzer {
  /**
   * Analyze background asset to determine best usage method
   */
  static analyzeBackgroundAsset(assetKey: string): {
    recommendedUsage: 'tile' | 'stretch' | '9slice' | 'full'
    notes: string
  } {
    // Based on asset names and typical pixel art conventions
    const key = assetKey.toLowerCase()
    
    if (key.includes('border')) {
      return {
        recommendedUsage: '9slice',
        notes: 'Border assets are designed for 9-slice scaling'
      }
    }
    
    if (key.includes('tile') || key.includes('pattern')) {
      return {
        recommendedUsage: 'tile',
        notes: 'Tileable patterns should be repeated'
      }
    }
    
    if (key.includes('background')) {
      // Most background assets in pixel art are designed to be stretched or used as full panels
      return {
        recommendedUsage: 'full',
        notes: 'Background assets typically designed as complete panels'
      }
    }
    
    return {
      recommendedUsage: 'stretch',
      notes: 'Default to controlled stretching with aspect ratio preservation'
    }
  }
}

// Export utilities
export const PixelArt = {
  Config: PIXEL_ART_CONFIG,
  Scaler: PixelArtScaler,
  Layout: PixelArtLayout,
  NineSlice: NineSliceBorder,
  Colors: PIXEL_ART_COLORS,
  Usage: ASSET_USAGE,
  Renderer: PixelArtRenderer,
  Analyzer: PixelArtAssetAnalyzer,
}