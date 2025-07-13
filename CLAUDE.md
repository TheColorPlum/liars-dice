# Claude Development Memory & Notes

This document serves as a running memory for development decisions, strategies, and notes for the Liar's Dice project.

## Project Overview
- **Tech Stack**: Expo (React Native), TypeScript, Supabase
- **Target**: Cross-platform mobile game (iOS/Android)
- **Current Status**: v0.6.5 - Endgame functionality and testing features complete
- **Latest Achievement**: Implemented missing 1v1 endgame sum-based bidding + dice count selection for testing
- **Next Phase**: v0.7.0 - Advanced features and social systems

## Development History

### v0.6.x - Casino Visual Redesign (July 2025) - **✅ COMPLETED**
- ✅ Fixed AI player count issue (was hardcoded to 4)
- ✅ Fixed game history display and ordering  
- ✅ Replaced quantity selection with intuitive stepper
- ✅ Added left/right split layout for better space utilization
- ✅ **Phase 0.6.1**: Core casino theme system and layout restructuring
- ✅ **Phase 0.6.2**: Component-by-component casino styling implementation
- ✅ **Phase 0.6.3**: Pixel art asset integration and sprite management
- ✅ **Phase 0.6.4**: Game table redesign with center bid focus and simplified bidding interface
- **Status**: Complete and ready for next phase

### v0.6.4 - Game Table Redesign & UX Optimization (July 2025)
- ✅ **Removed confusing aggressiveness indicator** - eliminated unnecessary UI clutter
- ✅ **Scaled up player elements** - increased PlayerCard (160px→200px) and DiceDisplay (48px→60px) for better prominence
- ✅ **Center bid as focal point** - moved current bid to center of table with large, prominent display (24px font)
- ✅ **Simplified bidding interface** - replaced complex QuantityStepper with clean PixelButtonCSS +/- controls
- ✅ **Applied menu button success patterns** - consistent auto-sizing, generous padding, proper visual hierarchy
- ✅ **Improved layout density** - reduced excessive spacing while maintaining component substance
- ✅ **Turn indicator repositioning** - made smaller (70% scale) and less prominent to highlight bid
- **Result**: Cohesive, focused game table that feels like unified playing surface vs scattered UI elements

### v0.6.5 - Endgame Implementation & Testing Features (July 2025) - **✅ COMPLETED**
- ✅ **Missing endgame functionality** - implemented 1v1 sum-based bidding for final showdown scenario
- ✅ **Game engine updates** - added `isEndgame()` detection and sum-based bid validation (range 2-12)
- ✅ **Challenge resolution** - updated to calculate dice sum instead of quantity matching in endgame
- ✅ **AI endgame strategy** - ported conservative sum-based logic from old implementation
- ✅ **UI endgame mode** - BiddingInterface shows "FINAL SHOWDOWN" with sum stepper instead of quantity/face
- ✅ **Center bid display** - shows "Sum: X" format in endgame vs normal "X × Y" format
- ✅ **Dice count selection** - added testing feature to SinglePlayerSetup for custom starting dice (1-5)
- ✅ **Instant endgame testing** - 2 players + 1 die each = immediate endgame scenario for testing
- ✅ **Visual indicators** - red highlighting and "⚡ INSTANT ENDGAME" text for quick testing setup
- **Result**: Complete endgame implementation with powerful testing capabilities for sum-based bidding

### v0.6.6 - Game History & Action Tracking (July 2025) - **✅ COMPLETED**
- ✅ **Game log restoration** - brought back visible game history displaying all actions and challenge results
- ✅ **GameHistory component** - created comprehensive action tracking with casino-themed styling
- ✅ **Three-section layout** - reorganized GameBoard into History | Player | Bidding sections
- ✅ **Action formatting** - proper display of bids, challenges, dice losses, and game outcomes
- ✅ **Endgame awareness** - history correctly formats sum-based vs quantity-based actions
- ✅ **Auto-scroll functionality** - automatically scrolls to show latest actions as they occur
- ✅ **Height constraints** - fixed scrolling issues with proper container height limits (150px)
- ✅ **Visual enhancements** - added "GAME LOG" header, action icons, timestamps, and color-coded borders
- **Result**: Complete action tracking system that enhances gameplay visibility and debugging

### v0.6.7 - Bidding Interface UX Redesign (July 2025) - **✅ COMPLETED**
- ✅ **Eliminated button spam** - replaced annoying +/- stepper with efficient multi-increment system
- ✅ **Multi-increment buttons** - [−5] [−1] [value] [+1] [+5] for quick quantity adjustment
- ✅ **Tappable value display** - tap quantity number to open numeric keypad for exact entry
- ✅ **Better defaults** - start with minimum legal bid instead of complex percentage calculations
- ✅ **Context display** - show "X dice on table" for better bidding context
- ✅ **Mobile-optimized** - larger touch targets and improved visual hierarchy
- ✅ **Reliable input** - button-based approach works consistently across all platforms
- ✅ **Range validation** - automatic bounds checking prevents invalid bids
- **Result**: Fast, reliable bid construction that eliminates mobile UX friction and supports quick decision-making

## Next Phase: Visual Polish & UI Cleanup

### v0.7.0 - Visual Polish & Asset Integration (Planned)
Before implementing multiplayer and advanced features, focus on visual consistency and polish:
- **Asset integration cleanup** - implement pixel art dice and UI elements consistently
- **Visual hierarchy refinement** - improve spacing, alignment, and component relationships  
- **Component standardization** - ensure consistent styling patterns across all UI elements
- **Mobile responsiveness** - optimize layouts for various screen sizes and orientations
- **Animation polish** - add smooth transitions and micro-interactions for better UX
- **Theme consistency** - audit and standardize casino color palette usage
- **Accessibility improvements** - enhance contrast, touch targets, and screen reader support
- **Performance optimization** - optimize renders and component updates
- **Goal**: Cohesive, polished visual experience ready for multiplayer and advanced features

### Future Phases (v0.8.0+)
After visual polish is complete:
- **Multiplayer implementation** - real-time game sessions with Supabase
- **Social features** - friend systems, leaderboards, tournaments
- **Advanced game modes** - custom rules, different variants
- **Monetization features** - in-app purchases, premium themes

### Key Technical Fixes (Historical)
1. **AI Player Count**: Fixed hardcoded `max_players: 4` in GameContext to use actual `playerCount`
2. **Game History**: Fixed GameEngine recreation issue causing empty history
3. **Quantity Selection**: Replaced button grid with smart bounds calculation
4. **Layout**: Changed from vertical stack to left/right split for better UX
5. **Button Text Centering**: Created PixelButtonCSS component solving cross-platform text positioning issues

## Current Asset Strategy

### Budget-Friendly 2D Pixel Art Plan

#### Asset Sources & Budget ($8-18 total)
- **Dice Asset Pack**: $3-5 (from itch.io, similar to "Squares Dungeons and Dice")
- **UI/Card Framework**: $2-5 (card backgrounds, borders, panels)
- **Table Texture**: $1-3 (pixel casino table)
- **Icon Set**: $2-5 (basic UI icons)

#### Implementation Phases
1. **Phase 1: Asset Integration** (1-2 days)
   - Purchase and download pixel art assets
   - Create asset management system in `/assets/` folder
   - Build sprite loading utilities
   - Replace current dice with pixel art versions

2. **Phase 2: UI Component Upgrade** (2-3 days)
   - Redesign PlayerCard using purchased card backgrounds
   - Update BiddingInterface with pixel art panels
   - Create pixel art buttons and interactive elements
   - Implement consistent pixel art spacing/grid

3. **Phase 3: Polish & Animation** (1-2 days)
   - Add dice rolling animations
   - Create smooth transitions between game states
   - Add pixel art particle effects
   - Implement screen shake and juice effects

#### Actual Asset Structure (Updated July 2025)
```
assets/ui/
├── dice/
│   ├── dice_1_1.png through dice_1_6.png (black/white dice)
│   ├── dice_1_7.png (blank/mystery dice)
│   └── dice_X_Y.png (color variants where X=color, Y=value)
├── borders/
│   └── [pixel art border elements]
├── buttons/
│   ├── [color-folders]/
│   │   ├── normal.png
│   │   ├── hover.png
│   │   └── clicked.png
└── backgrounds/
    ├── black-and-white/
    │   └── [pixel backgrounds]
    └── color/
        └── [colored pixel backgrounds]
```

**Asset Naming Convention:**
- **Dice**: `dice_[color]_[value].png` (e.g., dice_1_4.png = black/white dice showing 4)
- **Buttons**: Organized by color folders with normal/hover/clicked states
- **Backgrounds**: Separated into black-and-white and color variants
- **All assets**: PNG format for transparency support

#### Visual Cohesion Rules
- All elements snap to 16px grid
- Use same color palette across all assets
- Maintain consistent pixel density
- Apply uniform scaling (2x, 3x for high-DPI)
- Recolor purchased assets to match casino theme

#### Code Changes Required
- Create `AssetManager` utility class
- Update `DiceDisplay` component to use sprites
- Modify `CasinoTheme` to include pixel art spacing
- Add animation utilities for sprite sequences

## Git Workflow
Following PRD strategy:
- Feature branches for development
- Pull requests for review
- Tagged releases for milestones
- Current: v0.6.x (casino redesign phases)
- Next: v0.7.0 (advanced features)

## Architecture Notes

### Current Theme System
- Comprehensive casino color palette in `lib/theme.ts`
- Consistent spacing and typography
- Component-specific styling utilities
- Already supports pixel art with monospace fonts

### Game Engine
- Single GameEngine instance maintained in GameContext
- AI move processing with difficulty levels
- Real-time game state synchronization
- Action history tracking

### UI Components
- Modular React Native components
- Responsive design for mobile
- Casino-themed styling system
- Already optimized for pixel art integration

## Asset Integration Status

### ✅ Assets Acquired (July 2025)
1. **Dice Assets**: Complete set with dice_X_Y.png naming (color_value)
2. **UI Borders**: Pixel art border elements
3. **Button Assets**: Multiple colors with normal/hover/clicked states
4. **Backgrounds**: Black/white and color variants for panels

### 🔄 Current Implementation Steps (Phase 0.6)

**Phase 0.6.1: Core Theme System** 
1. ✅ Update theme.ts with comprehensive casino color palette
2. 🔄 Implement responsive layout system for mobile
3. 🔄 Create reusable style utilities and base components

**Phase 0.6.2: Component Styling**
4. 📋 Apply casino theme to PlayerCard component
5. 📋 Redesign BiddingInterface with mobile-first approach
6. 📋 Update GameHistory with clear visual hierarchy
7. 📋 Enhance TurnIndicator and QuantityStepper components

**Phase 0.6.3: Asset Integration**
8. 📋 Create `AssetManager` utility class for loading sprites
9. 📋 Update `DiceDisplay` component to use dice_X_Y.png assets
10. 📋 Integrate button sprites into all TouchableOpacity components
11. 📋 Apply background assets to PlayerCard, BiddingInterface, GameHistory

**Phase 0.6.4: Polish & Animation**
12. 📋 Add dice rolling animations and smooth transitions
13. 📋 Implement border elements for visual polish
14. 📋 Add responsive design refinements and game juice effects

### 📝 Implementation Notes
- **Mystery Dice**: dice_1_7.png available for hidden/unknown states
- **Button States**: Ready for interactive feedback (normal→hover→clicked)
- **Backgrounds**: Can be used as "panels" for any UI container
- **Scalability**: All PNG assets ready for 2x/3x scaling on high-DPI displays

### 📝 Development and Problem Solving Notes
1. Always give your honest assessment. Do not try to present a solution in a better light than your honest opinion in order to give the user a more pleasant experience.
2. Never proceed with implementing a solution to a bug without first confirming the root cause of the issue and explaining WHY your solution will both fix the current bug and prevent future errors.
3. Always opt for the simplest solution when implementing a new feature or bug fix to improve long term maintainability.
4. Push changes to github and update the roadmap progress / PRD as checkpoints after each task is fully completed including testing / verifying desired behavior.
5. Never independently claim that your code is fixed and working as expected without first
6. Use agents for smaller tasks as if they were your personal team of engineers working across different aspects of the feature. 