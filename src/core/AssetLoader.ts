import { Assets, Texture, Spritesheet, Graphics, Application, Texture as PixiTexture } from 'pixi.js';

export class AssetLoader {
    private static loadedAssets: Map<string, any> = new Map();
    private static loadingPromises: Promise<any>[] = [];
    private static app: Application | null = null;

    static setApp(app: Application): void {
        this.app = app;
    }

    static async loadAll(): Promise<void> {
        try {
            // Load individual textures
            await this.loadIndividualTextures();
            
            // Wait for all loading to complete
            await Promise.all(this.loadingPromises);
            
            console.log('All assets loaded successfully');
        } catch (error) {
            console.error('Failed to load assets:', error);
            // Không throw error, chỉ log warning
            console.warn('Continuing without assets...');
        }
    }

    private static async loadTextureAtlas(): Promise<void> {
        try {
            // Load texture atlas JSON và image
            const atlasData = await Assets.load('/assets/textures/texture-atlas.json');
            const atlasTexture = await Assets.load('/assets/textures/texture-atlas.webp');
            
            // Tạo spritesheet
            const spritesheet = new Spritesheet(atlasTexture, atlasData);
            await spritesheet.parse();
            
            // Lưu trữ các texture từ spritesheet
            for (const [name, texture] of Object.entries(spritesheet.textures)) {
                this.loadedAssets.set(name, texture);
            }
            
            console.log('Texture atlas loaded');
        } catch (error) {
            console.warn('Failed to load texture atlas, using fallback textures');
            // Fallback: tạo textures đơn giản
            await this.createFallbackTextures();
        }
    }

    private static async loadIndividualTextures(): Promise<void> {
        const textureList = [
            'background',
            'button',
            'button-hover',
            'button-pressed'
        ];

        for (const textureName of textureList) {
            const promise = Assets.load(`/assets/textures/${textureName}.webp`)
                .then((texture: any) => {
                    this.loadedAssets.set(textureName, texture);
                    console.log(`Loaded texture: ${textureName}`);
                })
                .catch((error: any) => {
                    console.warn(`Failed to load texture: ${textureName}`, error);
                    // Tạo fallback texture đơn giản
                    this.createSimpleFallbackTexture(textureName);
                });
            
            this.loadingPromises.push(promise);
        }
    }

    private static createSimpleFallbackTexture(name: string): void {
        // Tạo texture đơn giản bằng code mà không cần renderer
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;
        
        canvas.width = 100;
        canvas.height = 100;
        
        // Vẽ texture đơn giản dựa trên tên
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
        
        // Tạo texture từ canvas
        const texture = PixiTexture.from(canvas);
        this.loadedAssets.set(name, texture);
        console.log(`Created fallback texture: ${name}`);
    }

    private static async createFallbackTextures(): Promise<void> {
        if (!this.app || !this.app.renderer) {
            console.warn('App or renderer not set, cannot create fallback textures');
            return;
        }

        // Tạo các texture đơn giản bằng code
        const graphics = new Graphics();
        
        // Background texture
        graphics.clear();
        graphics.fill({ color: 0x1099bb });
        graphics.rect(0, 0, 100, 100);
        const backgroundTexture = this.app.renderer.generateTexture(graphics);
        this.loadedAssets.set('background', backgroundTexture);
        
        // Button texture
        graphics.clear();
        graphics.fill({ color: 0x4CAF50 });
        graphics.roundRect(0, 0, 100, 40, 10);
        const buttonTexture = this.app.renderer.generateTexture(graphics);
        this.loadedAssets.set('button', buttonTexture);
        
        // Button hover texture
        graphics.clear();
        graphics.fill({ color: 0x66BB6A });
        graphics.roundRect(0, 0, 100, 40, 10);
        const buttonHoverTexture = this.app.renderer.generateTexture(graphics);
        this.loadedAssets.set('button-hover', buttonHoverTexture);
        
        // Button pressed texture
        graphics.clear();
        graphics.fill({ color: 0x388E3C });
        graphics.roundRect(0, 0, 100, 40, 10);
        const buttonPressedTexture = this.app.renderer.generateTexture(graphics);
        this.loadedAssets.set('button-pressed', buttonPressedTexture);
        
        graphics.destroy();
    }

    static getTexture(name: string): Texture | null {
        return this.loadedAssets.get(name) || null;
    }

    static getSpritesheet(name: string): Spritesheet | null {
        return this.loadedAssets.get(name) || null;
    }

    static isLoaded(name: string): boolean {
        return this.loadedAssets.has(name);
    }

    static clear(): void {
        this.loadedAssets.clear();
        this.loadingPromises = [];
    }
} 