/**
 * AssetManager - Centralized asset loading and management for pixel art sprites
 * Handles dice, buttons, backgrounds, and borders with proper scaling and caching
 */

import { ImageSourcePropType } from 'react-native'

// Static imports for all dice assets
import dice_1_1 from '../assets/dice/dice_1_1.png'
import dice_1_2 from '../assets/dice/dice_1_2.png'
import dice_1_3 from '../assets/dice/dice_1_3.png'
import dice_1_4 from '../assets/dice/dice_1_4.png'
import dice_1_5 from '../assets/dice/dice_1_5.png'
import dice_1_6 from '../assets/dice/dice_1_6.png'
import dice_1_7 from '../assets/dice/dice_1_7.png'
import dice_2_1 from '../assets/dice/dice_2_1.png'
import dice_2_2 from '../assets/dice/dice_2_2.png'
import dice_2_3 from '../assets/dice/dice_2_3.png'
import dice_2_4 from '../assets/dice/dice_2_4.png'
import dice_2_5 from '../assets/dice/dice_2_5.png'
import dice_2_6 from '../assets/dice/dice_2_6.png'
import dice_2_7 from '../assets/dice/dice_2_7.png'
import dice_3_1 from '../assets/dice/dice_3_1.png'
import dice_3_2 from '../assets/dice/dice_3_2.png'
import dice_3_3 from '../assets/dice/dice_3_3.png'
import dice_3_4 from '../assets/dice/dice_3_4.png'
import dice_3_5 from '../assets/dice/dice_3_5.png'
import dice_3_6 from '../assets/dice/dice_3_6.png'
import dice_3_7 from '../assets/dice/dice_3_7.png'
import dice_4_1 from '../assets/dice/dice_4_1.png'
import dice_4_2 from '../assets/dice/dice_4_2.png'
import dice_4_3 from '../assets/dice/dice_4_3.png'
import dice_4_4 from '../assets/dice/dice_4_4.png'
import dice_4_5 from '../assets/dice/dice_4_5.png'
import dice_4_6 from '../assets/dice/dice_4_6.png'
import dice_4_7 from '../assets/dice/dice_4_7.png'
import dice_5_1 from '../assets/dice/dice_5_1.png'
import dice_5_2 from '../assets/dice/dice_5_2.png'
import dice_5_3 from '../assets/dice/dice_5_3.png'
import dice_5_4 from '../assets/dice/dice_5_4.png'
import dice_5_5 from '../assets/dice/dice_5_5.png'
import dice_5_6 from '../assets/dice/dice_5_6.png'
import dice_5_7 from '../assets/dice/dice_5_7.png'
import dice_6_1 from '../assets/dice/dice_6_1.png'
import dice_6_2 from '../assets/dice/dice_6_2.png'
import dice_6_3 from '../assets/dice/dice_6_3.png'
import dice_6_4 from '../assets/dice/dice_6_4.png'
import dice_6_5 from '../assets/dice/dice_6_5.png'
import dice_6_6 from '../assets/dice/dice_6_6.png'
import dice_6_7 from '../assets/dice/dice_6_7.png'

// Static imports for button assets
import button_lightblue_normal from '../assets/ui/buttons/[1] Light Blue/[1] Normal.png'
import button_lightblue_hover from '../assets/ui/buttons/[1] Light Blue/[3] Hover.png'
import button_lightblue_clicked from '../assets/ui/buttons/[1] Light Blue/[2] Clicked.png'
import button_red_normal from '../assets/ui/buttons/[2] Red/[1] Normal.png'
import button_red_hover from '../assets/ui/buttons/[2] Red/[3] Hover.png'
import button_red_clicked from '../assets/ui/buttons/[2] Red/[2] Clicked.png'
import button_yellow_normal from '../assets/ui/buttons/[3]Yellow/[1] Normal.png'
import button_yellow_hover from '../assets/ui/buttons/[3]Yellow/[3] Hover.png'
import button_yellow_clicked from '../assets/ui/buttons/[3]Yellow/[2] Clicked.png'
import button_green_normal from '../assets/ui/buttons/[4] Green/[1] Normal.png'
import button_green_hover from '../assets/ui/buttons/[4] Green/[3] Hover.png'
import button_green_clicked from '../assets/ui/buttons/[4] Green/[2] Clicked.png'
import button_blue_normal from '../assets/ui/buttons/[5] Blue/[1] Normal.png'
import button_blue_hover from '../assets/ui/buttons/[5] Blue/[3] Hover.png'
import button_blue_clicked from '../assets/ui/buttons/[5] Blue/[2] Clicked.png'
import button_silver_normal from '../assets/ui/buttons/[6] Silver/[1] Normal.png'
import button_silver_hover from '../assets/ui/buttons/[6] Silver/[3] Hover.png'
import button_silver_clicked from '../assets/ui/buttons/[6] Silver/[2] Clicked.png'
import button_gold_normal from '../assets/ui/buttons/[7] Gold/[1] Normal.png'
import button_gold_hover from '../assets/ui/buttons/[7] Gold/[3] Hover.png'
import button_gold_clicked from '../assets/ui/buttons/[7] Gold/[2] Clicked.png'
import button_wood_normal from '../assets/ui/buttons/[8] Wood/[1] Normal.png'
import button_wood_hover from '../assets/ui/buttons/[8] Wood/[3] Hover.png'
import button_wood_clicked from '../assets/ui/buttons/[8] Wood/[2] Clicked.png'

// Static imports for background assets
import bg_bw_47 from '../assets/ui/backgrounds/black and white/black_background_47.png'
import bg_bw_55 from '../assets/ui/backgrounds/black and white/black_background_55.png'
import bg_bw_57 from '../assets/ui/backgrounds/black and white/black_background_57.png'
import bg_bw_58 from '../assets/ui/backgrounds/black and white/black_background_58.png'
import bg_bw_66 from '../assets/ui/backgrounds/black and white/black_background_66.png'
import bg_color_60 from '../assets/ui/backgrounds/color/color_background_60.png'
import bg_color_67 from '../assets/ui/backgrounds/color/color_background_67.png'
import bg_color_72 from '../assets/ui/backgrounds/color/color_background_72.png'
import bg_color_80 from '../assets/ui/backgrounds/color/color_background_80.png'
import bg_color_84 from '../assets/ui/backgrounds/color/color_background_84.png'
import bg_color_91 from '../assets/ui/backgrounds/color/color_background_91.png'

// Static imports for border assets
import border_01 from '../assets/ui/borders/border_01.png'
import border_01_nobg from '../assets/ui/borders/border_01_nobackground.png'
import border_02 from '../assets/ui/borders/border_02.png'
import border_02_nobg from '../assets/ui/borders/border_02_nobackground.png'
import border_03 from '../assets/ui/borders/border_03.png'
import border_03_nobg from '../assets/ui/borders/border_03_nobackground.png'
import border_04 from '../assets/ui/borders/border_04.png'
import border_04_nobg from '../assets/ui/borders/border_04_nobackground.png'
import border_05 from '../assets/ui/borders/border_05.png'
import border_05_nobg from '../assets/ui/borders/border_05_nobackground.png'

// Create static asset mappings
const DICE_ASSETS: { [key: string]: ImageSourcePropType } = {
  '1_1': dice_1_1, '1_2': dice_1_2, '1_3': dice_1_3, '1_4': dice_1_4, '1_5': dice_1_5, '1_6': dice_1_6, '1_7': dice_1_7,
  '2_1': dice_2_1, '2_2': dice_2_2, '2_3': dice_2_3, '2_4': dice_2_4, '2_5': dice_2_5, '2_6': dice_2_6, '2_7': dice_2_7,
  '3_1': dice_3_1, '3_2': dice_3_2, '3_3': dice_3_3, '3_4': dice_3_4, '3_5': dice_3_5, '3_6': dice_3_6, '3_7': dice_3_7,
  '4_1': dice_4_1, '4_2': dice_4_2, '4_3': dice_4_3, '4_4': dice_4_4, '4_5': dice_4_5, '4_6': dice_4_6, '4_7': dice_4_7,
  '5_1': dice_5_1, '5_2': dice_5_2, '5_3': dice_5_3, '5_4': dice_5_4, '5_5': dice_5_5, '5_6': dice_5_6, '5_7': dice_5_7,
  '6_1': dice_6_1, '6_2': dice_6_2, '6_3': dice_6_3, '6_4': dice_6_4, '6_5': dice_6_5, '6_6': dice_6_6, '6_7': dice_6_7,
}

const BUTTON_ASSETS: { [key: string]: ImageSourcePropType } = {
  'lightblue_normal': button_lightblue_normal, 'lightblue_hover': button_lightblue_hover, 'lightblue_clicked': button_lightblue_clicked,
  'red_normal': button_red_normal, 'red_hover': button_red_hover, 'red_clicked': button_red_clicked,
  'yellow_normal': button_yellow_normal, 'yellow_hover': button_yellow_hover, 'yellow_clicked': button_yellow_clicked,
  'green_normal': button_green_normal, 'green_hover': button_green_hover, 'green_clicked': button_green_clicked,
  'blue_normal': button_blue_normal, 'blue_hover': button_blue_hover, 'blue_clicked': button_blue_clicked,
  'silver_normal': button_silver_normal, 'silver_hover': button_silver_hover, 'silver_clicked': button_silver_clicked,
  'gold_normal': button_gold_normal, 'gold_hover': button_gold_hover, 'gold_clicked': button_gold_clicked,
  'wood_normal': button_wood_normal, 'wood_hover': button_wood_hover, 'wood_clicked': button_wood_clicked,
}

const BACKGROUND_ASSETS: { [key: string]: ImageSourcePropType } = {
  'black-white_47': bg_bw_47, 'black-white_55': bg_bw_55, 'black-white_57': bg_bw_57, 'black-white_58': bg_bw_58, 'black-white_66': bg_bw_66,
  'color_60': bg_color_60, 'color_67': bg_color_67, 'color_72': bg_color_72, 'color_80': bg_color_80, 'color_84': bg_color_84, 'color_91': bg_color_91,
}

const BORDER_ASSETS: { [key: string]: ImageSourcePropType } = {
  '1_true': border_01, '1_false': border_01_nobg,
  '2_true': border_02, '2_false': border_02_nobg,
  '3_true': border_03, '3_false': border_03_nobg,
  '4_true': border_04, '4_false': border_04_nobg,
  '5_true': border_05, '5_false': border_05_nobg,
}

export class AssetManager {
  private static instance: AssetManager | null = null
  private assetCache: Map<string, ImageSourcePropType> = new Map()

  private constructor() {}

  public static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager()
    }
    return AssetManager.instance
  }

  /**
   * Get dice sprite by color and value
   * @param color - Dice color (1=black/white, 2-6=color variants)
   * @param value - Dice value (1-6, 7=mystery/blank)
   * @returns ImageSourcePropType for the dice sprite
   */
  public getDiceSprite(color: number = 1, value: number): ImageSourcePropType {
    // Validate inputs
    if (value < 1 || value > 7) {
      console.warn(`Invalid dice value: ${value}, using 1`)
      value = 1
    }
    if (color < 1 || color > 6) {
      console.warn(`Invalid dice color: ${color}, using 1`)
      color = 1
    }

    const key = `${color}_${value}`
    const cacheKey = `dice_${key}`
    
    if (this.assetCache.has(cacheKey)) {
      return this.assetCache.get(cacheKey)!
    }

    const sprite = DICE_ASSETS[key] || DICE_ASSETS['1_1'] // fallback to default dice
    
    if (!sprite) {
      console.warn(`Failed to load dice sprite: ${key}, using fallback`)
      return DICE_ASSETS['1_1']
    }

    this.assetCache.set(cacheKey, sprite)
    return sprite
  }

  /**
   * Get button sprite by color and state
   * @param color - Button color ('lightblue', 'red', 'yellow', 'green', 'blue', 'silver', 'gold', 'wood')
   * @param state - Button state ('normal', 'hover', 'clicked')
   * @returns ImageSourcePropType for the button sprite
   */
  public getButtonSprite(color: string, state: string = 'normal'): ImageSourcePropType {
    const normalizedColor = color.toLowerCase()
    const normalizedState = state.toLowerCase() === 'pressed' ? 'clicked' : state.toLowerCase()

    const key = `${normalizedColor}_${normalizedState}`
    const cacheKey = `button_${key}`
    
    if (this.assetCache.has(cacheKey)) {
      return this.assetCache.get(cacheKey)!
    }

    const sprite = BUTTON_ASSETS[key] || BUTTON_ASSETS['gold_normal'] // fallback to gold normal
    
    if (!sprite) {
      console.warn(`Failed to load button sprite: ${key}, using fallback`)
      return BUTTON_ASSETS['gold_normal']
    }

    this.assetCache.set(cacheKey, sprite)
    return sprite
  }

  /**
   * Get background sprite by type and variant
   * @param type - Background type ('black-white' or 'color')
   * @param variant - Background variant number (47, 55, 57, 58, 66 for b&w; 60, 67, 72, 80, 84, 91 for color)
   * @returns ImageSourcePropType for the background sprite
   */
  public getBackgroundSprite(type: 'black-white' | 'color', variant?: number): ImageSourcePropType {
    const blackWhiteVariants = [47, 55, 57, 58, 66]
    const colorVariants = [60, 67, 72, 80, 84, 91]

    let selectedVariant: number

    if (type === 'black-white') {
      selectedVariant = variant || blackWhiteVariants[0]
    } else {
      selectedVariant = variant || colorVariants[0]
    }

    const key = `${type}_${selectedVariant}`
    const cacheKey = `background_${key}`
    
    console.log(`[AssetManager] Loading background: ${key}`)
    
    if (this.assetCache.has(cacheKey)) {
      console.log(`[AssetManager] Background ${key} found in cache`)
      return this.assetCache.get(cacheKey)!
    }

    const sprite = BACKGROUND_ASSETS[key] || BACKGROUND_ASSETS['black-white_47'] // fallback to first black-white
    
    if (!sprite) {
      console.warn(`[AssetManager] Failed to load background sprite: ${key}, using fallback`)
      return BACKGROUND_ASSETS['black-white_47']
    }

    if (sprite === BACKGROUND_ASSETS['black-white_47'] && key !== 'black-white_47') {
      console.warn(`[AssetManager] Background ${key} not found, using fallback`)
    } else {
      console.log(`[AssetManager] Background ${key} loaded successfully`)
    }

    this.assetCache.set(cacheKey, sprite)
    return sprite
  }

  /**
   * Get border sprite by number and background preference
   * @param borderNumber - Border number (1-5)
   * @param withBackground - Whether to use version with background (default: false)
   * @returns ImageSourcePropType for the border sprite
   */
  public getBorderSprite(borderNumber: number = 1, withBackground: boolean = false): ImageSourcePropType {
    // Validate border number
    if (borderNumber < 1 || borderNumber > 5) {
      console.warn(`Invalid border number: ${borderNumber}, using 1`)
      borderNumber = 1
    }

    const key = `${borderNumber}_${withBackground}`
    const cacheKey = `border_${key}`
    
    if (this.assetCache.has(cacheKey)) {
      return this.assetCache.get(cacheKey)!
    }

    const sprite = BORDER_ASSETS[key] || BORDER_ASSETS['1_false'] // fallback to border 1 without background
    
    if (!sprite) {
      console.warn(`Failed to load border sprite: ${key}, using fallback`)
      return BORDER_ASSETS['1_false']
    }

    this.assetCache.set(cacheKey, sprite)
    return sprite
  }

  /**
   * Preload commonly used assets for better performance
   */
  public preloadCommonAssets(): void {
    // Preload default dice (black/white, values 1-6)
    for (let value = 1; value <= 6; value++) {
      this.getDiceSprite(1, value)
    }
    
    // Preload mystery dice
    this.getDiceSprite(1, 7)
    
    // Preload common button colors in all states
    const commonColors = ['gold', 'red', 'green', 'silver']
    const states = ['normal', 'hover', 'clicked']
    
    for (const color of commonColors) {
      for (const state of states) {
        this.getButtonSprite(color, state)
      }
    }
    
    // Preload first background of each type
    this.getBackgroundSprite('black-white')
    this.getBackgroundSprite('color')
    
    // Preload first border
    this.getBorderSprite(1, false)
  }

  /**
   * Clear asset cache (useful for memory management)
   */
  public clearCache(): void {
    this.assetCache.clear()
  }

  /**
   * Get cache size for debugging
   */
  public getCacheSize(): number {
    return this.assetCache.size
  }
}

// Export singleton instance
export const assetManager = AssetManager.getInstance()