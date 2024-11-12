class SoundManager {
    constructor() {
        // Core sound effects
        this.sounds = {
            // UI Sounds
            keyPress: new Audio('assets/sounds/key-press.mp3'),
            keyPressAlt: new Audio('assets/sounds/key-press-alt.mp3'),
            enter: new Audio('assets/sounds/enter.mp3'),
            
            // System Sounds
            boot: new Audio('assets/sounds/system-boot.mp3'),
            shutdown: new Audio('assets/sounds/system-shutdown.mp3'),
            
            // Security Sounds
            alert: new Audio('assets/sounds/alert.mp3'),
            criticalAlert: new Audio('assets/sounds/critical-alert.mp3'),
            access: new Audio('assets/sounds/access-granted.mp3'),
            denied: new Audio('assets/sounds/access-denied.mp3'),
            scan: new Audio('assets/sounds/scan.mp3'),
            decrypt: new Audio('assets/sounds/decrypt.mp3'),
            encrypt: new Audio('assets/sounds/encrypt.mp3'),
            
            // Notification Sounds
            notification: new Audio('assets/sounds/notification.mp3'),
            warning: new Audio('assets/sounds/warning.mp3'),
            error: new Audio('assets/sounds/error.mp3'),
            success: new Audio('assets/sounds/success.mp3'),
            
            // Ambient Sounds
            ambient: new Audio('assets/sounds/cyber-ambient.mp3'),
            dataStream: new Audio('assets/sounds/data-stream.mp3')
        };

        // Sound categories for grouped control
        this.categories = {
            ui: ['keyPress', 'keyPressAlt', 'enter'],
            system: ['boot', 'shutdown'],
            security: ['alert', 'criticalAlert', 'access', 'denied', 'scan', 'decrypt', 'encrypt'],
            notifications: ['notification', 'warning', 'error', 'success'],
            ambient: ['ambient', 'dataStream']
        };

        // Volume settings per category
        this.volumeLevels = {
            ui: 0.2,
            system: 0.4,
            security: 0.5,
            notifications: 0.3,
            ambient: 0.1
        };

        this.initialize();
    }

    initialize() {
        // Initialize all sounds
        for (let [name, sound] of Object.entries(this.sounds)) {
            sound.load();
            
            // Find category for this sound
            const category = Object.entries(this.categories)
                .find(([_, sounds]) => sounds.includes(name))?.[0];
            
            // Set initial volume based on category
            if (category) {
                sound.volume = this.volumeLevels[category];
            } else {
                sound.volume = 0.3; // Default volume
            }

            // Set up looping for ambient sounds
            if (this.categories.ambient.includes(name)) {
                sound.loop = true;
            }
        }

        this.enabled = true;
        this.ambientEnabled = false;
    }

    play(soundName, options = {}) {
        if (!this.enabled || !this.sounds[soundName]) return;

        const sound = this.sounds[soundName];
        
        // Reset sound to start if it's already playing
        sound.currentTime = 0;
        
        // Apply options
        if (options.volume !== undefined) {
            sound.volume = Math.max(0, Math.min(1, options.volume));
        }
        
        if (options.loop !== undefined) {
            sound.loop = options.loop;
        }

        sound.play().catch(e => console.log('Audio play failed:', e));
    }

    playSequence(soundNames, interval = 500) {
        let delay = 0;
        soundNames.forEach(name => {
            setTimeout(() => this.play(name), delay);
            delay += interval;
        });
    }

    toggleSound() {
        this.enabled = !this.enabled;
        
        // Stop all sounds if disabled
        if (!this.enabled) {
            this.stopAll();
        }
        
        return this.enabled;
    }

    toggleAmbient() {
        this.ambientEnabled = !this.ambientEnabled;
        
        if (this.ambientEnabled && this.enabled) {
            this.play('ambient', { loop: true });
            this.play('dataStream', { loop: true, volume: 0.05 });
        } else {
            this.stopAmbient();
        }
        
        return this.ambientEnabled;
    }

    stopAmbient() {
        this.categories.ambient.forEach(name => {
            const sound = this.sounds[name];
            sound.pause();
            sound.currentTime = 0;
        });
    }

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    setCategoryVolume(category, level) {
        if (this.categories[category]) {
            this.volumeLevels[category] = Math.max(0, Math.min(1, level));
            this.categories[category].forEach(soundName => {
                this.sounds[soundName].volume = this.volumeLevels[category];
            });
        }
    }

    setMasterVolume(level) {
        const normalizedLevel = Math.max(0, Math.min(1, level));
        Object.keys(this.volumeLevels).forEach(category => {
            this.setCategoryVolume(category, normalizedLevel * this.volumeLevels[category]);
        });
    }
} 