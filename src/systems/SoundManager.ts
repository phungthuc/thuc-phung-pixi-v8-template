import { Howl, Howler } from 'howler';
import { GameConstants } from '../core/GameConstants';

/**
 * Sound Manager - Handles all audio in the game
 */
export class SoundManager {
    private sounds: Map<string, Howl> = new Map();
    private music: Howl | null = null;
    private isInitialized: boolean = false;
    private isMuted: boolean = false;
    private volume: number = 1.0;
    private musicVolume: number = 0.7;
    
    constructor() {}
    
    /**
     * Initialize sound manager
     */
    public async init(): Promise<void> {
        if (this.isInitialized) return;
        
        console.log('Initializing SoundManager...');
        
        // Set global volume
        Howler.volume(this.volume);
        
        // Load default sounds
        await this.loadDefaultSounds();
        
        this.isInitialized = true;
        console.log('SoundManager initialized');
    }
    
    /**
     * Load default sounds
     */
    private async loadDefaultSounds(): Promise<void> {
        // Load UI sounds
        this.loadSound('button-click', GameConstants.ASSET_PATHS.AUDIO + 'button-click.mp3');
        this.loadSound('button-hover', GameConstants.ASSET_PATHS.AUDIO + 'button-hover.mp3');
        
        // Load game sounds
        this.loadSound('game-start', GameConstants.ASSET_PATHS.AUDIO + 'game-start.mp3');
        this.loadSound('game-win', GameConstants.ASSET_PATHS.AUDIO + 'game-win.mp3');
        this.loadSound('game-lose', GameConstants.ASSET_PATHS.AUDIO + 'game-lose.mp3');
        
        // Load background music
        this.loadMusic(GameConstants.ASSET_PATHS.AUDIO + 'background-music.mp3');
    }
    
    /**
     * Load a sound effect
     */
    public loadSound(name: string, path: string): void {
        const sound = new Howl({
            src: [path],
            volume: this.volume,
            preload: true,
            onload: () => {
                console.log(`Sound loaded: ${name}`);
            },
            onloaderror: (id, error) => {
                console.warn(`Failed to load sound ${name}:`, error);
            }
        });
        
        this.sounds.set(name, sound);
    }
    
    /**
     * Load background music
     */
    public loadMusic(path: string): void {
        this.music = new Howl({
            src: [path],
            volume: this.musicVolume,
            loop: true,
            preload: true,
            onload: () => {
                console.log('Background music loaded');
            },
            onloaderror: (id, error) => {
                console.warn('Failed to load background music:', error);
            }
        });
    }
    
    /**
     * Play a sound effect
     */
    public playSound(name: string): void {
        if (this.isMuted) return;
        
        const sound = this.sounds.get(name);
        if (sound) {
            sound.play();
        } else {
            console.warn(`Sound '${name}' not found`);
        }
    }
    
    /**
     * Play background music
     */
    public playMusic(): void {
        if (this.isMuted || !this.music) return;
        
        this.music.play();
    }
    
    /**
     * Stop background music
     */
    public stopMusic(): void {
        if (this.music) {
            this.music.stop();
        }
    }
    
    /**
     * Pause background music
     */
    public pauseMusic(): void {
        if (this.music) {
            this.music.pause();
        }
    }
    
    /**
     * Resume background music
     */
    public resumeMusic(): void {
        if (this.isMuted || !this.music) return;
        
        this.music.play();
    }
    
    /**
     * Set volume for sound effects
     */
    public setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // Update all sounds
        for (const sound of this.sounds.values()) {
            sound.volume(this.volume);
        }
        
        // Update global volume
        Howler.volume(this.volume);
    }
    
    /**
     * Set volume for background music
     */
    public setMusicVolume(volume: number): void {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        if (this.music) {
            this.music.volume(this.musicVolume);
        }
    }
    
    /**
     * Mute/unmute all audio
     */
    public setMuted(muted: boolean): void {
        this.isMuted = muted;
        
        if (muted) {
            Howler.mute(true);
        } else {
            Howler.mute(false);
        }
    }
    
    /**
     * Check if audio is muted
     */
    public isAudioMuted(): boolean {
        return this.isMuted;
    }
    
    /**
     * Pause all audio
     */
    public pause(): void {
        Howler.ctx?.suspend();
    }
    
    /**
     * Resume all audio
     */
    public resume(): void {
        Howler.ctx?.resume();
    }
    
    /**
     * Destroy sound manager
     */
    public destroy(): void {
        // Stop and unload all sounds
        for (const sound of this.sounds.values()) {
            sound.stop();
            sound.unload();
        }
        
        // Stop and unload music
        if (this.music) {
            this.music.stop();
            this.music.unload();
        }
        
        this.sounds.clear();
        this.music = null;
        this.isInitialized = false;
        
        console.log('SoundManager destroyed');
    }
} 