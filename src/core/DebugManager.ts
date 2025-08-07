import { Application, Text } from 'pixi.js';

/**
 * DebugManager - Performance monitoring and debugging tools
 */
export class DebugManager {
    private app: Application;
    private fpsText!: Text;
    private memoryText!: Text;
    private frameCount: number = 0;
    private lastTime: number = 0;
    private fps: number = 0;
    private memory: number = 0;
    
    constructor(app: Application) {
        this.app = app;
        this.init();
    }
    
    /**
     * Initialize debug UI
     */
    private init(): void {
        // Create FPS text
        this.fpsText = new Text({
            text: 'FPS: 0',
            style: {
                fontSize: 16,
                fontWeight: 'bold',
                fill: 0xffffff
            }
        });
        this.fpsText.position.set(10, 10);
        this.app.stage.addChild(this.fpsText);
        
        // Create memory text
        this.memoryText = new Text({
            text: 'Memory: 0 MB',
            style: {
                fontSize: 16,
                fontWeight: 'bold',
                fill: 0xffffff
            }
        });
        this.memoryText.position.set(10, 30);
        this.app.stage.addChild(this.memoryText);
        
        this.lastTime = performance.now();
    }
    
    /**
     * Update debug information
     */
    public update(deltaTime: number): void {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Update memory usage
            if ('memory' in performance) {
                this.memory = Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024);
            }
            
            this.updateUI();
        }
    }
    
    /**
     * Update debug UI
     */
    private updateUI(): void {
        this.fpsText.text = `FPS: ${this.fps}`;
        this.memoryText.text = `Memory: ${this.memory} MB`;
        
        // Color coding based on performance
        if (this.fps < 30) {
            this.fpsText.style.fill = 0xff0000; // Red
        } else if (this.fps < 50) {
            this.fpsText.style.fill = 0xffff00; // Yellow
        } else {
            this.fpsText.style.fill = 0x00ff00; // Green
        }
        
        if (this.memory > 100) {
            this.memoryText.style.fill = 0xff0000; // Red
        } else if (this.memory > 50) {
            this.memoryText.style.fill = 0xffff00; // Yellow
        } else {
            this.memoryText.style.fill = 0x00ff00; // Green
        }
    }
    
    /**
     * Get current FPS
     */
    public getFPS(): number {
        return this.fps;
    }
    
    /**
     * Get current memory usage
     */
    public getMemory(): number {
        return this.memory;
    }
    
    /**
     * Show/hide debug UI
     */
    public setVisible(visible: boolean): void {
        this.fpsText.visible = visible;
        this.memoryText.visible = visible;
    }
    
    /**
     * Cleanup
     */
    public destroy(): void {
        if (this.fpsText) {
            this.fpsText.destroy();
        }
        if (this.memoryText) {
            this.memoryText.destroy();
        }
    }
} 