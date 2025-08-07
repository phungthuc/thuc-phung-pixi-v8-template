import { Application } from 'pixi.js';

/**
 * InputManager - Handles all input events (touch, click, keyboard)
 */
export class InputManager {
    private app: Application;
    private isInitialized: boolean = false;
    private eventListeners: Map<string, Function[]> = new Map();
    
    constructor(app: Application) {
        this.app = app;
    }
    
    /**
     * Initialize input manager
     */
    public async init(): Promise<void> {
        if (this.isInitialized) {
            console.warn('InputManager already initialized');
            return;
        }
        
        try {
            console.log('Initializing InputManager...');
            
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('InputManager initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize InputManager:', error);
            throw error;
        }
    }
    
    /**
     * Setup event listeners
     */
    private setupEventListeners(): void {
        // Touch/Click events
        this.app.stage.eventMode = 'static';
        this.app.stage.on('pointerdown', (event) => this.handlePointerDown(event));
        this.app.stage.on('pointerup', (event) => this.handlePointerUp(event));
        this.app.stage.on('pointermove', (event) => this.handlePointerMove(event));
        
        // Keyboard events
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
        document.addEventListener('keyup', (event) => this.handleKeyUp(event));
        
        // Prevent context menu
        document.addEventListener('contextmenu', (event) => event.preventDefault());
    }
    
    /**
     * Handle pointer down event
     */
    private handlePointerDown(event: any): void {
        this.emit('pointerdown', {
            x: event.global.x,
            y: event.global.y,
            button: event.button,
            originalEvent: event
        });
    }
    
    /**
     * Handle pointer up event
     */
    private handlePointerUp(event: any): void {
        this.emit('pointerup', {
            x: event.global.x,
            y: event.global.y,
            button: event.button,
            originalEvent: event
        });
    }
    
    /**
     * Handle pointer move event
     */
    private handlePointerMove(event: any): void {
        this.emit('pointermove', {
            x: event.global.x,
            y: event.global.y,
            originalEvent: event
        });
    }
    
    /**
     * Handle key down event
     */
    private handleKeyDown(event: KeyboardEvent): void {
        this.emit('keydown', {
            key: event.key,
            code: event.code,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            originalEvent: event
        });
    }
    
    /**
     * Handle key up event
     */
    private handleKeyUp(event: KeyboardEvent): void {
        this.emit('keyup', {
            key: event.key,
            code: event.code,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            originalEvent: event
        });
    }
    
    /**
     * Add event listener
     */
    public on(event: string, callback: Function): void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)!.push(callback);
    }
    
    /**
     * Remove event listener
     */
    public off(event: string, callback: Function): void {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event)!;
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
    
    /**
     * Emit event to all listeners
     */
    private emit(event: string, data: any): void {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event)!;
            listeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in input event listener:', error);
                }
            });
        }
    }
    
    /**
     * Update input manager
     */
    public update(deltaTime: number): void {
        // Input-specific update logic can be added here
    }
    
    /**
     * Check if input manager is initialized
     */
    public isReady(): boolean {
        return this.isInitialized;
    }
    
    /**
     * Cleanup
     */
    public destroy(): void {
        console.log('InputManager destroyed');
        
        // Remove event listeners
        this.app.stage.off('pointerdown');
        this.app.stage.off('pointerup');
        this.app.stage.off('pointermove');
        
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        
        this.eventListeners.clear();
        this.isInitialized = false;
    }
} 