export class FPSMeter {
    private frameCount: number = 0;
    private lastTime: number = 0;
    private fps: number = 0;
    private memory: number = 0;

    constructor() {
        this.lastTime = performance.now();
    }

    update(): void {
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

    private updateUI(): void {
        const fpsElement = document.getElementById('fps');
        const memoryElement = document.getElementById('memory');
        
        if (fpsElement) {
            fpsElement.textContent = this.fps.toString();
        }
        
        if (memoryElement) {
            memoryElement.textContent = this.memory.toString();
        }
    }

    getFPS(): number {
        return this.fps;
    }

    getMemory(): number {
        return this.memory;
    }
} 