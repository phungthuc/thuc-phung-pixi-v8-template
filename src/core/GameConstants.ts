/**
 * Game Constants - Centralized configuration for the game
 */
export class GameConstants {
    // Game dimensions
    public static readonly GAME_WIDTH: number = 800;
    public static readonly GAME_HEIGHT: number = 600;
    
    // Colors
    public static readonly BACKGROUND_COLOR: number = 0x2c3e50;
    public static readonly PRIMARY_COLOR: number = 0x3498db;
    public static readonly SECONDARY_COLOR: number = 0xe74c3c;
    public static readonly SUCCESS_COLOR: number = 0x27ae60;
    public static readonly WARNING_COLOR: number = 0xf39c12;
    
    // Game states
    public static readonly GAME_STATES = {
        LOADING: 'loading',
        MAIN_MENU: 'mainMenu',
        PLAYING: 'playing',
        PAUSED: 'paused',
        GAME_OVER: 'gameOver',
        WIN: 'win',
        LOSE: 'lose'
    } as const;
    
    // Scene names
    public static readonly SCENES = {
        LOADING: 'Loading',
        MAIN_MENU: 'MainMenu',
        GAME_PLAY: 'GamePlay',
        GAME_OVER: 'GameOver'
    } as const;
    
    // Audio settings
    public static readonly AUDIO = {
        MASTER_VOLUME: 0.7,
        MUSIC_VOLUME: 0.5,
        SFX_VOLUME: 0.8
    };
    
    // Performance targets
    public static readonly PERFORMANCE = {
        TARGET_FPS: 60,
        MAX_MEMORY_MB: 100,
        MAX_LOAD_TIME_MS: 3000
    };
    
    // Asset paths - Using relative paths for deployment compatibility
    public static readonly ASSET_PATHS = {
        TEXTURES: 'assets/textures/',
        AUDIO: 'assets/audios/',
        FONTS: 'assets/fonts/',
        DATA: 'assets/data/'
    };
} 