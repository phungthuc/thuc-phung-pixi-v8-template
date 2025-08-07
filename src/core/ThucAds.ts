import { GameConstants } from './GameConstants';

/**
 * ThucAds - Ads integration system for playable ads
 * Handles communication with ad platforms
 */
export class ThucAds {
    private isInitialized: boolean = false;
    private currentState: string = GameConstants.GAME_STATES.LOADING;
    
    constructor() {}
    
    /**
     * Initialize the ads system
     */
    public async init(): Promise<void> {
        if (this.isInitialized) {
            console.warn('ThucAds already initialized');
            return;
        }
        
        try {
            console.log('Initializing ThucAds...');
            
            // Setup mock ads system for development
            this.setupMockAds();
            
            this.isInitialized = true;
            console.log('ThucAds initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize ThucAds:', error);
            throw error;
        }
    }
    
    /**
     * Setup mock ads system for development
     */
    private setupMockAds(): void {
        // Mock implementation for development
        console.log('Using mock ads system for development');
        
        // Simulate ads platform events
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'ads') {
                this.handleAdsEvent(event.data);
            }
        });
    }
    
    /**
     * Handle ads platform events
     */
    private handleAdsEvent(data: any): void {
        console.log('Ads event received:', data);
        
        switch (data.action) {
            case 'start':
                this.onStart();
                break;
            case 'pause':
                this.onPause();
                break;
            case 'resume':
                this.onResume();
                break;
            case 'win':
                this.onWin();
                break;
            case 'lose':
                this.onLose();
                break;
            case 'cta':
                this.onCTAClick();
                break;
        }
    }
    
    /**
     * Game loaded event
     */
    public onLoad(): void {
        console.log('ThucAds: Game loaded');
        this.sendAdsEvent('load');
    }
    
    /**
     * Game started event
     */
    public onStart(): void {
        console.log('ThucAds: Game started');
        this.currentState = GameConstants.GAME_STATES.PLAYING;
        this.sendAdsEvent('start');
    }
    
    /**
     * Game paused event
     */
    public onPause(): void {
        console.log('ThucAds: Game paused');
        this.currentState = GameConstants.GAME_STATES.PAUSED;
        this.sendAdsEvent('pause');
    }
    
    /**
     * Game resumed event
     */
    public onResume(): void {
        console.log('ThucAds: Game resumed');
        this.currentState = GameConstants.GAME_STATES.PLAYING;
        this.sendAdsEvent('resume');
    }
    
    /**
     * Player won event
     */
    public onWin(): void {
        console.log('ThucAds: Player won');
        this.currentState = GameConstants.GAME_STATES.WIN;
        this.sendAdsEvent('win');
    }
    
    /**
     * Player lost event
     */
    public onLose(): void {
        console.log('ThucAds: Player lost');
        this.currentState = GameConstants.GAME_STATES.LOSE;
        this.sendAdsEvent('lose');
    }
    
    /**
     * CTA button clicked event
     */
    public onCTAClick(): void {
        console.log('ThucAds: CTA clicked');
        this.sendAdsEvent('cta');
    }
    
    /**
     * Game state changed event
     */
    public onGameStateChange(newState: string): void {
        console.log('ThucAds: Game state changed to', newState);
        this.currentState = newState;
        this.sendAdsEvent('stateChange', { state: newState });
    }
    
    /**
     * Send event to ads platform
     */
    private sendAdsEvent(action: string, data?: any): void {
        const event = {
            type: 'ads',
            action: action,
            data: data || {},
            timestamp: Date.now()
        };
        
        // Send to parent window (ads platform)
        if (window.parent && window.parent !== window) {
            window.parent.postMessage(event, '*');
        }
        
        // Also log for development
        console.log('ThucAds event sent:', event);
    }
    
    /**
     * Get current ads state
     */
    public getCurrentState(): string {
        return this.currentState;
    }
    
    /**
     * Check if ads system is initialized
     */
    public isReady(): boolean {
        return this.isInitialized;
    }
    
    /**
     * Cleanup
     */
    public destroy(): void {
        console.log('ThucAds destroyed');
        this.isInitialized = false;
    }
} 