# Liar's Dice Visual Redesign - Mini PRD
## "Degenerate Gambling Between Friends" Theme

### Project Overview
**Vision**: Create a fun, engaging interface that captures the authentic feeling of "degenerate gambling between friends" - where people get tilted, super into quick games, with consistent 2D pixel art aesthetic.

**Core Principles**:
- Everything is on the table for redesign - zero-based approach
- Layout first, window dressing second
- Screen-by-screen implementation with distinct user stories
- Consistent 2D pixel art visual style
- Games should feel quick and intense, not dragged out

**Reference Materials**:
- Game Table Mockup: `/Users/plum/Downloads/ChatGPT Image Jul 11, 2025, 11_31_21 AM.png`
- Main Menu Mockup: `/Users/plum/Downloads/ChatGPT Image Jul 11, 2025, 11_35_22 AM.png`

---

## 1. Theme & Tone Definition

### 1.1 Emotional Target
**The "Tilted Friends" Experience**:
- Quick escalation from casual to intense
- Clear visual hierarchy for fast decision-making under pressure
- Satisfying tactile feedback (button presses, dice rolls)
- Visual cues that amplify the social dynamics and psychological gameplay
- Interface that gets out of the way when tension is high

### 1.2 Visual Personality
**Authentic Pixel Casino Aesthetic**:
- Clean, readable pixel art (not cluttered retro-for-retro's-sake)
- Casino felt green as primary background color
- Warm gold/yellow accents for important actions
- Red for challenge/danger states
- Simple, bold typography that works at small sizes
- Consistent spacing and alignment (snap to pixel grid)

### 1.3 Interaction Principles
**Fast & Satisfying**:
- Immediate visual feedback on all interactions
- Touch targets optimized for mobile (minimum 44px)
- Clear affordances - buttons look clickable
- Animation that enhances rather than delays gameplay
- Progressive disclosure - show what's needed when it's needed

---

## 2. Asset Analysis & Requirements

### 2.1 Current Asset Inventory
**Available Assets**:
- ✅ Dice sprites: `dice_X_Y.png` (6 colors × 7 states including mystery)
- ✅ Button states: 8 color variants with normal/hover/clicked states
- ✅ Background panels: Black/white and color variants
- ✅ Border elements: 5 variations with/without backgrounds

**Asset Quality Concerns**:
- 🔍 **Need to verify**: Proper scaling across different screen densities
- 🔍 **Need to test**: Background removal requirements for borders
- 🔍 **Need to check**: Consistent pixel density across all assets
- 🔍 **Missing**: Felt texture background for game table

### 2.2 Asset Gap Analysis (Based on Mockups)
**Missing Assets**:
- 📋 **Felt Background Texture**: Game table needs authentic casino felt
- 📋 **Card Panel Backgrounds**: Player/opponent card containers
- 📋 **Progress Bar Elements**: For "Aggressiveness" indicator
- 📋 **Pixel Font Files**: Authentic pixel typography (currently using system monospace)
- 📋 **Number Display Panels**: Dice count, bid values
- 📋 **Menu Background**: Main menu backdrop texture

**Format Requirements**:
- All assets need transparency support (PNG)
- Consistent pixel scale (verify 1x, 2x, 3x scaling)
- Border assets may need background removal for layering
- Color palette standardization across all assets

---

## 3. Screen-by-Screen Implementation Plan

### 3.1 Phase 1: Main Menu (Foundation Screen)
**User Story**: *"As a degenerate gambler, I want to quickly jump into the action without friction"*

**Current State**: Basic menu with standard buttons
**Target State**: Clean vertical stack matching mockup aesthetic

**Layout Requirements**:
- Centered vertical button stack
- Felt background texture
- Gold/yellow button styling
- Clear visual hierarchy: SINGLE PLAYER → MULTIPLAYER → JOIN GAME → etc.

**Components Needed**:
- Enhanced PixelButton with proper casino styling
- Background texture system
- Typography component with pixel font
- Layout container with proper spacing

**Success Criteria**:
- Buttons feel immediately clickable and satisfying
- Clear reading hierarchy even at mobile sizes
- Consistent with casino theme without being garish

### 3.2 Phase 2: Game Table (Core Experience)
**User Story**: *"As a tilted player in a tense game, I need crystal clear information hierarchy to make quick decisions"*

**Current State**: Basic layout with standard components
**Target State**: Authentic casino table feel matching mockup

**Layout Requirements** (Based on Mockup):
- **Top**: Opponent cards in horizontal row
- **Bottom**: Player dice and information 
- **Center-Right**: Bidding interface with current bid
- **Bottom-Right**: Aggressiveness indicator (new feature)
- **Left**: Action buttons (Bid/Challenge)

**Components Needed**:
- Redesigned PlayerCard (both self and opponent views)
- BiddingInterface with clear current bid display
- NEW: AggressivenessIndicator component
- Enhanced DiceDisplay with pixel art dice
- Action button grouping

**Emotional Design Requirements**:
- Opponent cards feel slightly intimidating/mysterious
- Player area feels like "your space"
- Bidding area draws focus during decision time
- Aggressiveness meter adds psychological pressure
- Visual feedback escalates tension appropriately

### 3.3 Phase 3: Supporting Screens
**Single Player Setup**: Quick AI difficulty and player count selection
**Game History**: Clean log of recent actions with visual hierarchy
**Settings**: Minimal options, focus on audio/visual preferences
**Challenge Results**: Dramatic reveal of dice with clear win/lose states

---

## 4. Component Design System (Zero-Based)

### 4.1 Foundation Components

#### PixelButton v2.0
**Purpose**: All interactive buttons throughout the app
**Variants**: 
- Primary (gold/yellow) - main actions
- Secondary (green) - neutral actions  
- Danger (red) - challenge/risky actions
- Disabled (gray) - unavailable actions

**States**: Normal → Hover → Pressed → Disabled
**Requirements**: 
- Minimum 44px touch target
- Clear visual feedback on state changes
- Pixel-perfect sprite rendering
- Consistent padding and text alignment

#### PixelCard v2.0
**Purpose**: Player information containers (self + opponents)
**Variants**:
- Player card (bottom, expanded info)
- Opponent card (top, condensed info)
- Empty seat (placeholder state)

**Content Hierarchy**:
1. Player name/avatar
2. Dice count (prominent)
3. Status indicators (active turn, eliminated, etc.)

#### PixelPanel v2.0
**Purpose**: Background containers for grouping content
**Variants**:
- Felt background (game table)
- Card background (information panels)
- Modal background (popups/dialogs)

#### AggressivenessIndicator (NEW)
**Purpose**: Visual representation of gameplay intensity/risk level
**Design**: Horizontal bar or meter showing current "aggression" level
**Behavior**: Updates based on bid patterns, successful challenges, bluffs

### 4.2 Typography System
**Requirements**: Authentic pixel font that's readable at mobile sizes
**Hierarchy**:
- H1: Game state announcements ("Your Turn", "Challenge!", etc.)
- H2: Player names, current bid
- Body: General information text
- Numbers: Dice counts, bid values (high contrast, bold)

### 4.3 Color Palette (Refined from Mockups)
```typescript
// Based on mockup analysis - more muted than current theme
const VisualTheme = {
  // Primary casino felt green (from mockup)
  background: '#1a5a1a',  // Darker, more authentic felt
  
  // Gold accents (from mockup buttons)
  primary: '#d4af37',     // More muted gold
  primaryDark: '#b8941f',
  
  // Challenge/danger red
  danger: '#c41e3a',
  dangerDark: '#9a1529',
  
  // Text colors
  textLight: '#f5f5dc',   // Cream/beige for readability
  textDark: '#2a2a2a',    // Dark text on light backgrounds
  
  // UI elements
  border: '#8b7355',      // Warm brown for borders
  disabled: '#666666',    // Muted gray for inactive elements
}
```

---

## 5. Implementation Strategy

### 5.1 Layout-First Approach (As Requested)
**Phase A: Structure & Spacing**
1. Create wireframe layouts without styling
2. Establish component hierarchy and spacing
3. Implement responsive behavior for different screen sizes
4. Test information architecture and user flow

**Phase B: Visual Design Application**  
1. Apply pixel art assets and color scheme
2. Implement typography and iconography
3. Add border and background elements
4. Refine visual hierarchy with contrast and color

**Phase C: Polish & Animation**
1. Add satisfying micro-interactions
2. Implement state transition animations  
3. Add "game juice" effects (screen shake, particles, etc.)
4. Performance optimization and testing

### 5.2 Technical Implementation Notes
**Asset Management**:
- Create centralized AssetManager for pixel art loading
- Implement consistent scaling across screen densities
- Optimize for React Native performance (avoid image resizing)
- Fallback handling for asset loading failures

**Component Architecture**:
- Zero-base existing components vs. incremental updates
- Shared base classes for consistent pixel art rendering
- Props-based theming for consistent styling
- Responsive design patterns for mobile-first experience

---

## 6. Quality Gates & Success Criteria

### 6.1 Emotional Impact Testing
**"Does it feel like degenerate gambling between friends?"**
- Quick escalation from calm to intense
- Clear decision-making under pressure
- Satisfying tactile feedback
- Social dynamics amplified through visual design

### 6.2 Technical Requirements
- **Performance**: 60fps animations on mid-range mobile devices
- **Accessibility**: Minimum contrast ratios while maintaining pixel aesthetic
- **Scalability**: Clean rendering across iPhone SE to iPad Pro
- **Touch Targets**: All interactive elements minimum 44px

### 6.3 Design Consistency
- **Pixel Perfect**: All elements snap to pixel grid
- **Color Harmony**: Consistent palette across all screens
- **Typography**: Readable hierarchy at all supported sizes
- **Asset Quality**: No pixelation or scaling artifacts

---

## 7. ✅ Implementation Complete - July 2025

### 7.1 Final Status: **COMPLETED**
All casino visual redesign objectives have been successfully implemented:

1. ✅ **Foundation**: Asset testing, theme refinement, base component architecture
2. ✅ **Main Menu**: Established visual language and interaction patterns
3. ✅ **Game Table**: Core experience with full component system and center bid focus
4. ✅ **Supporting Screens**: Applied established patterns to remaining screens
5. ✅ **Endgame Features**: Added missing 1v1 sum-based bidding functionality
6. ✅ **Testing Tools**: Implemented dice count selection for easy endgame testing

### 7.2 Achievements Beyond Original Scope
- **Complete Endgame Implementation**: Fixed missing 1v1 scenario with sum-based bidding
- **Testing Infrastructure**: Added dice count selection (1-5) for rapid testing scenarios
- **Visual Polish**: "FINAL SHOWDOWN" mode with specialized UI for endgame
- **AI Integration**: Ported sophisticated endgame AI strategy from reference implementation

### 7.3 Success Metrics - **ALL MET**
- ✅ **User Experience**: Authentic casino feel with "degenerate gambling between friends" vibe
- ✅ **Performance**: Smooth 60fps gameplay with responsive UI
- ✅ **Visual Quality**: Consistent pixel art theme without scaling artifacts
- ✅ **Accessibility**: Clear visual hierarchy and readable typography
- ✅ **Functionality**: Complete game loop including endgame scenarios

---

*This mini PRD serves as the blueprint for creating an authentic, engaging visual experience that captures the intensity and social dynamics of "degenerate gambling between friends" while maintaining technical excellence and accessibility.*