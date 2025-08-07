import { Application, Container } from 'pixi.js';
import { GameConstants } from '../core/GameConstants';

/**
 * Base Scene class
 */
export abstract class Scene {
    public container: Container;
    public isActive: boolean = false;
    public isInitialized: boolean = false;
    
    constructor() {
        this.container = new Container();
    }
    
    abstract init(): Promise<void>;
    abstract update(deltaTime: number): void;
    abstract destroy(): void;
    abstract onResize(width: number, height: number): void;
}

/**
 * Scene Manager - Manages game scenes and transitions
 */
export class SceneManager {
    private app: Application;
    private scenes: Map<string, Scene> = new Map();
    private currentScene: Scene | null = null;
    private isInitialized: boolean = false;
    
    constructor(app: Application) {
        this.app = app;
    }
    
    /**
     * Initialize scene manager
     */
    public async init(): Promise<void> {
        if (this.isInitialized) return;
        
        console.log('Initializing SceneManager...');
        
        // Create default scenes
        await this.createDefaultScenes();
        
        this.isInitialized = true;
        console.log('SceneManager initialized');
    }
    
    /**
     * Create default scenes
     */
    private async createDefaultScenes(): Promise<void> {
        // Main Menu Scene
        const mainMenuScene = new MainMenuScene();
        this.scenes.set('MainMenu', mainMenuScene);
        
        // Game Scene
        const gameScene = new GameScene();
        this.scenes.set('Game', gameScene);
        
        // Initialize all scenes
        for (const scene of this.scenes.values()) {
            await scene.init();
        }
    }
    
    /**
     * Load a scene
     */
    public async loadScene(sceneName: string): Promise<void> {
        const scene = this.scenes.get(sceneName);
        if (!scene) {
            console.error(`Scene '${sceneName}' not found`);
            return;
        }
        
        // Unload current scene
        if (this.currentScene) {
            this.currentScene.isActive = false;
            this.app.stage.removeChild(this.currentScene.container);
        }
        
        // Load new scene
        this.currentScene = scene;
        this.currentScene.isActive = true;
        this.app.stage.addChild(this.currentScene.container);
        
        console.log(`Loaded scene: ${sceneName}`);
    }
    
    /**
     * Update current scene
     */
    public update(deltaTime: number): void {
        if (this.currentScene && this.currentScene.isActive) {
            this.currentScene.update(deltaTime);
        }
    }
    
    /**
     * Handle resize
     */
    public onResize(width: number, height: number): void {
        if (this.currentScene) {
            this.currentScene.onResize(width, height);
        }
    }
    
    /**
     * Destroy scene manager
     */
    public destroy(): void {
        // Destroy all scenes
        for (const scene of this.scenes.values()) {
            scene.destroy();
        }
        
        this.scenes.clear();
        this.currentScene = null;
        this.isInitialized = false;
        
        console.log('SceneManager destroyed');
    }
}

/**
 * Main Menu Scene
 */
class MainMenuScene extends Scene {
    public async init(): Promise<void> {
        if (this.isInitialized) return;
        
        console.log('Initializing MainMenuScene...');
        
        // Add background
        const background = new Container();
        background.width = GameConstants.GAME_WIDTH;
        background.height = GameConstants.GAME_HEIGHT;
        this.container.addChild(background);
        
        // Add title
        const title = new Container();
        title.width = 200;
        title.height = 50;
        title.x = GameConstants.GAME_WIDTH / 2 - 100;
        title.y = 100;
        this.container.addChild(title);
        
        this.isInitialized = true;
        console.log('MainMenuScene initialized');
    }
    
    public update(deltaTime: number): void {
        // Update menu logic here
    }
    
    public destroy(): void {
        this.container.destroy({ children: true });
        this.isInitialized = false;
    }
    
    public onResize(width: number, height: number): void {
        // Handle resize
    }
}

/**
 * Game Scene
 */
class GameScene extends Scene {
    public async init(): Promise<void> {
        if (this.isInitialized) return;
        
        console.log('Initializing GameScene...');
        
        // Add game board
        const gameBoard = new Container();
        gameBoard.width = GameConstants.GAME_WIDTH;
        gameBoard.height = GameConstants.GAME_HEIGHT;
        this.container.addChild(gameBoard);
        
        this.isInitialized = true;
        console.log('GameScene initialized');
    }
    
    public update(deltaTime: number): void {
        // Update game logic here
    }
    
    public destroy(): void {
        this.container.destroy({ children: true });
        this.isInitialized = false;
    }
    
    public onResize(width: number, height: number): void {
        // Handle resize
    }
} 