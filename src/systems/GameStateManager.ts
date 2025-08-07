import { GameConstants } from '../core/GameConstants';

/**
 * GameStateManager - Manages game state transitions
 */
export class GameStateManager {
    private currentState: string = GameConstants.GAME_STATES.LOADING;
    private previousState: string = GameConstants.GAME_STATES.LOADING;
    private onStateChange?: (newState: string) => void;
    
    constructor() {}
    
    /**
     * Initialize state manager
     */
    public async init(): Promise<void> {
        console.log('GameStateManager initialized');
    }
    
    /**
     * Set current game state
     */
    public setState(newState: string): void {
        if (this.currentState === newState) {
            return;
        }
        
        this.previousState = this.currentState;
        this.currentState = newState;
        
        console.log(`Game state changed: ${this.previousState} -> ${this.currentState}`);
        
        // Notify listeners
        if (this.onStateChange) {
            this.onStateChange(newState);
        }
    }
    
    /**
     * Get current state
     */
    public getCurrentState(): string {
        return this.currentState;
    }
    
    /**
     * Get previous state
     */
    public getPreviousState(): string {
        return this.previousState;
    }
    
    /**
     * Check if current state matches
     */
    public isState(state: string): boolean {
        return this.currentState === state;
    }
    
    /**
     * Check if game is playing
     */
    public isPlaying(): boolean {
        return this.currentState === GameConstants.GAME_STATES.PLAYING;
    }
    
    /**
     * Check if game is paused
     */
    public isPaused(): boolean {
        return this.currentState === GameConstants.GAME_STATES.PAUSED;
    }
    
    /**
     * Check if game is over
     */
    public isGameOver(): boolean {
        return this.currentState === GameConstants.GAME_STATES.GAME_OVER ||
               this.currentState === GameConstants.GAME_STATES.WIN ||
               this.currentState === GameConstants.GAME_STATES.LOSE;
    }
    
    /**
     * Set state change callback
     */
    public setStateChangeCallback(callback: (newState: string) => void): void {
        this.onStateChange = callback;
    }
    
    /**
     * Update state manager
     */
    public update(deltaTime: number): void {
        // State-specific update logic can be added here
    }
    
    /**
     * Reset to initial state
     */
    public reset(): void {
        this.setState(GameConstants.GAME_STATES.LOADING);
    }
    
    /**
     * Cleanup
     */
    public destroy(): void {
        console.log('GameStateManager destroyed');
        this.onStateChange = undefined;
    }
} 