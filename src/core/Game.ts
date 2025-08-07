import { Application } from 'pixi.js';
import { AssetManager } from '../core/AssetManager';
import { InputManager } from '../systems/InputManager';
import { GameStateManager } from '../systems/GameStateManager';
import { SceneManager } from '../systems/SceneManager';
import { SoundManager } from '../systems/SoundManager';
import { ThucAds } from '../core/ThucAds';
import { GameConstants } from '../core/GameConstants';
import { DebugManager } from '../core/DebugManager';

/**
 * Main Game Class - Entry point for the playable ad
 * Follows Singleton pattern for global access
 */
export class Game {
    private static instance: Game;
    
    // Core systems
    public app!: Application;
    public assetManager!: AssetManager;
    public sceneManager!: SceneManager;
    public soundManager!: SoundManager;
    public inputManager!: InputManager;
    public gameStateManager!: GameStateManager;
    public thucAds!: ThucAds;
    public debugManager!: DebugManager;
    
    // Game state
    private isInitialized: boolean = false;
    private isPaused: boolean = false;
    
    private constructor() {}
    
    public static getInstance(): Game {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }
    
    /**
     * Initialize the game
     */
    public async init(): Promise<void> {
        if (this.isInitialized) {
            console.warn('Game already initialized');
            return;
        }
        
        try {
            console.log('Initializing Game...');
            
            // Initialize core systems
            await this.initializeCoreSystems();
            
            // Initialize managers
            await this.initializeManagers();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start the game
            await this.start();
            
            this.isInitialized = true;
            console.log('Game initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            throw error;
        }
    }
    
    /**
     * Initialize core PixiJS application and systems
     */
    private async initializeCoreSystems(): Promise<void> {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = GameConstants.GAME_WIDTH;
        canvas.height = GameConstants.GAME_HEIGHT;
        
        // Add canvas to container
        const container = document.getElementById('game-container');
        if (container) {
            container.appendChild(canvas);
        }
        
        // Initialize PixiJS Application
        this.app = new Application();
        await this.app.init({
            canvas: canvas,
            width: GameConstants.GAME_WIDTH,
            height: GameConstants.GAME_HEIGHT,
            backgroundColor: GameConstants.BACKGROUND_COLOR,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });
        
        // Initialize debug manager
        this.debugManager = new DebugManager(this.app);
    }
    
    /**
     * Initialize all managers
     */
    private async initializeManagers(): Promise<void> {
        // Initialize asset manager first
        this.assetManager = new AssetManager();
        await this.assetManager.init();
        
        // Initialize other managers
        this.soundManager = new SoundManager();
        this.inputManager = new InputManager(this.app);
        this.gameStateManager = new GameStateManager();
        this.sceneManager = new SceneManager(this.app);
        this.thucAds = new ThucAds();
        
        // Initialize managers
        await this.soundManager.init();
        await this.inputManager.init();
        await this.sceneManager.init();
        await this.thucAds.init();
    }
    
    /**
     * Setup event listeners
     */
    private setupEventListeners(): void {
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Handle visibility change (pause/resume)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Handle game state changes
        this.gameStateManager.setStateChangeCallback((newState: string) => {
            console.log('Game state changed to:', newState);
            this.thucAds.onGameStateChange(newState);
        });
    }
    
    /**
     * Start the game
     */
    private async start(): Promise<void> {
        console.log('Starting game...');
        
        // Load initial scene
        await this.sceneManager.loadScene('MainMenu');
        
        // Start game loop
        this.startGameLoop();
        
        // Notify ads system
        this.thucAds.onStart();
        
        console.log('Game started successfully');
    }
    
    /**
     * Main game loop
     */
    private startGameLoop(): void {
        if (this.app.ticker) {
            this.app.ticker.add(() => {
                const deltaTime = this.app.ticker.deltaMS;
                
                // Update debug info
                this.debugManager.update(deltaTime);
                
                // Update game systems
                if (!this.isPaused) {
                    this.sceneManager.update(deltaTime);
                    this.inputManager.update(deltaTime);
                    this.gameStateManager.update(deltaTime);
                }
            });
        } else {
            // Fallback: use requestAnimationFrame
            const gameLoop = () => {
                const deltaTime = 16.67; // ~60fps
                
                this.debugManager.update(deltaTime);
                
                if (!this.isPaused) {
                    this.sceneManager.update(deltaTime);
                    this.inputManager.update(deltaTime);
                    this.gameStateManager.update(deltaTime);
                }
                
                requestAnimationFrame(gameLoop);
            };
            requestAnimationFrame(gameLoop);
        }
    }
    
    /**
     * Handle window resize
     */
    private handleResize(): void {
        const container = document.getElementById('game-container');
        if (!container) return;
        
        const containerRect = container.getBoundingClientRect();
        const scale = Math.min(
            containerRect.width / GameConstants.GAME_WIDTH,
            containerRect.height / GameConstants.GAME_HEIGHT
        );
        
        // Resize canvas
        const canvas = container.querySelector('canvas');
        if (canvas) {
            canvas.style.width = (GameConstants.GAME_WIDTH * scale) + 'px';
            canvas.style.height = (GameConstants.GAME_HEIGHT * scale) + 'px';
        }
        
        // Scale stage
        if (this.app.stage) {
            this.app.stage.scale.set(scale);
        }
        
        // Notify scene manager
        this.sceneManager.onResize(GameConstants.GAME_WIDTH * scale, GameConstants.GAME_HEIGHT * scale);
    }
    
    /**
     * Pause the game
     */
    public pause(): void {
        if (this.isPaused) return;
        
        this.isPaused = true;
        this.soundManager.pause();
        this.thucAds.onPause();
        console.log('Game paused');
    }
    
    /**
     * Resume the game
     */
    public resume(): void {
        if (!this.isPaused) return;
        
        this.isPaused = false;
        this.soundManager.resume();
        this.thucAds.onResume();
        console.log('Game resumed');
    }
    
    /**
     * Get game instance
     */
    public static get game(): Game {
        return Game.getInstance();
    }
    
    /**
     * Cleanup and destroy
     */
    public destroy(): void {
        console.log('Destroying game...');
        
        this.sceneManager.destroy();
        this.soundManager.destroy();
        this.inputManager.destroy();
        this.assetManager.destroy();
        this.debugManager.destroy();
        
        if (this.app) {
            this.app.destroy(true);
        }
        
        this.isInitialized = false;
        console.log('Game destroyed');
    }
} 