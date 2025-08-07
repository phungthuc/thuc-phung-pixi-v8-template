# PixiJS v8 Template

A comprehensive template for building HTML5 games and playable ads using PixiJS v8, TypeScript, and Vite. This template follows OOP principles and SOLID design patterns, providing a robust foundation for creating engaging interactive content.

## 🚀 Features

- **PixiJS v8.6.2** - Latest version with modern rendering capabilities
- **TypeScript 5.7.2** - Type-safe development
- **Vite 5.4.19** - Fast build tool with hot module replacement
- **OOP Architecture** - Clean, maintainable code structure
- **SOLID Principles** - Well-designed, extensible systems
- **Asset Management** - Optimized loading and caching
- **Scene Management** - Modular scene-based architecture
- **UI System** - Flexible screen-based UI components
- **Input Management** - Touch, click, and keyboard handling
- **Game State Management** - Robust state transitions
- **ThucAds Integration** - Mock ads system for testing
- **Performance Monitoring** - Real-time FPS and memory tracking
- **Responsive Design** - Scales across different screen sizes
- **WebP Compression** - Optimized image assets
- **Multiple Build Options** - Inline and multiple file builds

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd pixijs-v8-template

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run preview          # Preview production build

# Building
npm run build            # Standard build
npm run build:inline     # Single file build (all JS inline)
npm run build:multiple   # Multiple file build (separate JS files)
npm run build:assets     # Process and compress assets
npm run build:inline-complete   # Complete inline build for deployment
npm run build:multiple-complete # Complete multiple file build for deployment

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking
npm run clean            # Clean dist directory
```

## 🏗️ Project Structure

```
src/
├── core/                 # Core game systems
│   ├── Game.ts          # Main game singleton
│   ├── GameConstants.ts # Game constants
│   ├── ThucAds.ts       # Ads integration
│   ├── DebugManager.ts  # Performance monitoring
│   └── AssetManager.ts  # Asset loading and caching
├── systems/             # Game systems
│   ├── GameStateManager.ts # State management
│   └── InputManager.ts     # Input handling
├── scenes/              # Game scenes
│   ├── MainMenuScene.ts
│   ├── GamePlayScene.ts
│   └── GameOverScene.ts
├── ui/                  # UI components
│   ├── Screen.ts
│   ├── Button.ts
│   └── Text.ts
├── game/                # Game-specific logic
│   ├── TicTacToeBoard.ts
│   └── UI.ts
└── main.ts              # Entry point
```

## 🎮 Game Architecture

### Core Systems
- **Game Singleton**: Central orchestrator managing all game systems
- **AssetManager**: Handles loading, caching, and fallback assets
- **SceneManager**: Manages scene transitions and lifecycle
- **InputManager**: Processes all input events
- **GameStateManager**: Handles game state transitions
- **ThucAds**: Mock ads integration for testing
- **DebugManager**: Performance monitoring and debugging

### Design Patterns
- **Singleton Pattern**: Game class ensures single instance
- **Observer Pattern**: Event-driven communication between systems
- **Factory Pattern**: Asset creation and management
- **State Pattern**: Game state management
- **Command Pattern**: Input handling

## 🌐 Deployment

### For Web Servers (Recommended)

Use the legacy build for maximum compatibility:

```bash
# Build for production with legacy support
npm run build:legacy

# The dist/ folder will contain:
# - index.html (with proper script tags)
# - assets/main-6F3hq9O7.js (modern browsers)
# - assets/main-legacy-CnvmjJHj.js (legacy browsers)
# - assets/polyfills-legacy-Bj7NGYSK.js (polyfills)
```

### Server Configuration

#### Apache (.htaccess included)
The template includes an `.htaccess` file that:
- Sets proper MIME types for JavaScript modules
- Enables CORS for playable ads
- Configures caching for static assets
- Enables compression

#### Nginx
Add to your nginx.conf:
```nginx
location ~* \.js$ {
    add_header Content-Type application/javascript;
}

location ~* \.(css|png|jpg|jpeg|gif|webp|mp3|wav|ogg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### Node.js/Express
```javascript
app.use('/assets', express.static('dist/assets', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));
```

### For Playable Ad Platforms

1. **Build the project**:
   ```bash
   npm run build:all
   ```

2. **Upload the `dist/` folder** to your ad platform

3. **Ensure your platform supports**:
   - ES modules (modern browsers)
   - Legacy JavaScript (older browsers)
   - WebP image format
   - Audio files (MP3, WAV, OGG)

## 🎯 Playable Ad Integration

### ThucAds System
The template includes a mock ads system (`src/core/ThucAds.ts`) that simulates real ad platform events:

```typescript
// Example usage
ThucAds.onLoad(() => {
  console.log('Ad loaded');
});

ThucAds.onStart(() => {
  console.log('Game started');
});

ThucAds.onWin(() => {
  console.log('Player won');
});
```

### Key Events
- `onLoad`: Ad assets loaded
- `onStart`: Game started
- `onPause`: Game paused
- `onResume`: Game resumed
- `onWin`: Player won
- `onLose`: Player lost
- `onCTAClick`: Call-to-action clicked
- `onGameStateChange`: Game state changed

## 🎨 Asset Management

### Supported Formats
- **Images**: PNG, JPG, JPEG, WebP, GIF
- **Audio**: MP3, WAV, OGG
- **Spine**: JSON animations
- **Fonts**: TTF, OTF, WOFF, WOFF2

### Asset Processing
The `thucBuild.js` script automatically:
- Compresses images to WebP format
- Optimizes file sizes
- Generates asset manifest
- Creates fallback textures

```bash
# Process assets
npm run build:assets
```

## 🔧 Configuration

### Vite Configuration
Located in `vite.config.ts`:
- Legacy browser support
- Asset optimization
- Development server settings
- Build optimizations

### Game Constants
Located in `src/core/GameConstants.ts`:
- Game dimensions
- Colors and themes
- Scene names
- Audio settings
- Performance thresholds

## 🐛 Troubleshooting

### Common Issues

1. **MIME Type Error**: Use `npm run build:legacy` for better web server compatibility

2. **Assets Not Loading**: Check the asset paths in `src/core/AssetManager.ts`

3. **Performance Issues**: Monitor with `DebugManager` and optimize assets

4. **Mobile Touch Issues**: Ensure proper touch event handling in `InputManager`

### Debug Mode
Enable debug mode to see performance metrics:
```typescript
DebugManager.setVisible(true);
```

## 📝 Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add JSDoc comments for public methods
- Follow SOLID principles

### Performance
- Optimize asset sizes
- Use object pooling for frequently created objects
- Minimize DOM manipulation
- Monitor FPS and memory usage

### Testing
- Test on multiple browsers
- Test on mobile devices
- Verify ad platform compatibility
- Check performance on slower devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- PixiJS team for the amazing rendering engine
- Vite team for the fast build tool
- The open-source community for various libraries and tools

---

**Happy coding! 🎮** 