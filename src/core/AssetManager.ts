import { Assets, Texture, Spritesheet, Texture as PixiTexture } from 'pixi.js';
import { GameConstants } from './GameConstants';

/**
 * AssetManager - Manages loading and caching of all game assets
 */
export class AssetManager {
    private loadedAssets: Map<string, any> = new Map();
    private loadingPromises: Promise<any>[] = [];
    private isInitialized: boolean = false;
    
    constructor() {}
    
    /**
     * Initialize asset manager
     */
    public async init(): Promise<void> {
        if (this.isInitialized) {
            console.warn('AssetManager already initialized');
            return;
        }
        
        try {
            console.log('Initializing AssetManager...');
            
            // Load all assets
            await this.loadAllAssets();
            
            this.isInitialized = true;
            console.log('AssetManager initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize AssetManager:', error);
            throw error;
        }
    }
    
    /**
     * Load all game assets
     */
    private async loadAllAssets(): Promise<void> {
        try {
            // Load textures
            await this.loadTextures();
            
            // Wait for all loading to complete
            await Promise.all(this.loadingPromises);
            
            console.log('All assets loaded successfully');
        } catch (error) {
            console.error('Failed to load assets:', error);
            // Create fallback assets
            await this.createFallbackAssets();
        }
    }
    
    /**
     * Load texture assets
     */
    private async loadTextures(): Promise<void> {
        const textureList = [
            'background',
            'button',
            'button-hover',
            'button-pressed'
        ];

        for (const textureName of textureList) {
            const promise = Assets.load(`${GameConstants.ASSET_PATHS.TEXTURES}${textureName}.webp`)
                .then((texture: any) => {
                    this.loadedAssets.set(textureName, texture);
                    console.log(`Loaded texture: ${textureName}`);
                })
                .catch((error: any) => {
                    console.warn(`Failed to load texture: ${textureName}`, error);
                    // Create fallback texture
                    this.createFallbackTexture(textureName);
                });
            
            this.loadingPromises.push(promise);
        }
    }
    
    /**
     * Create fallback texture using Canvas
     */
    private createFallbackTexture(name: string): void {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;
        
        canvas.width = 100;
        canvas.height = 100;
        
        // Draw texture based on name
        switch (name) {
            case 'background':
                ctx.fillStyle = '#1099bb';
                ctx.fillRect(0, 0, 100, 100);
                break;
            case 'button':
                ctx.fillStyle = '#4CAF50';
                ctx.fillRect(0, 0, 100, 40);
                break;
            case 'button-hover':
                ctx.fillStyle = '#66BB6A';
                ctx.fillRect(0, 0, 100, 40);
                break;
            case 'button-pressed':
                ctx.fillStyle = '#388E3C';
                ctx.fillRect(0, 0, 100, 40);
                break;
        }
        
        // Create texture from canvas
        const texture = PixiTexture.from(canvas);
        this.loadedAssets.set(name, texture);
        console.log(`Created fallback texture: ${name}`);
    }
    
    /**
     * Create all fallback assets
     */
    private async createFallbackAssets(): Promise<void> {
        console.log('Creating fallback assets...');
        
        const assetList = [
            'background',
            'button',
            'button-hover',
            'button-pressed'
        ];
        
        for (const assetName of assetList) {
            this.createFallbackTexture(assetName);
        }
    }
    
    /**
     * Get texture by name
     */
    public getTexture(name: string): Texture | null {
        return this.loadedAssets.get(name) || null;
    }
    
    /**
     * Get spritesheet by name
     */
    public getSpritesheet(name: string): Spritesheet | null {
        return this.loadedAssets.get(name) || null;
    }
    
    /**
     * Check if asset is loaded
     */
    public isAssetLoaded(name: string): boolean {
        return this.loadedAssets.has(name);
    }
    
    /**
     * Get all loaded asset names
     */
    public getLoadedAssetNames(): string[] {
        return Array.from(this.loadedAssets.keys());
    }
    
    /**
     * Clear all assets
     */
    public clear(): void {
        this.loadedAssets.clear();
        this.loadingPromises = [];
    }
    
    /**
     * Check if asset manager is initialized
     */
    public isReady(): boolean {
        return this.isInitialized;
    }
    
    /**
     * Cleanup
     */
    public destroy(): void {
        console.log('AssetManager destroyed');
        this.clear();
        this.isInitialized = false;
    }
} 