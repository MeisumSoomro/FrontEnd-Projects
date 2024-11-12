class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Enhanced configuration
        this.config = {
            fontSize: 14,
            baseSpeed: 1.5,
            maxSpeed: 5,
            density: 0.95, // Chance of spawning new drops
            fadeSpeed: 0.05,
            colorCycle: false, // Enable color cycling for alerts
            alertMode: false, // Special effect for security alerts
        };

        // Security-themed characters
        this.charSets = {
            default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            symbols: '@#$%&*(){}[]<>~^|¦+=',
            binary: '01',
            hex: '0123456789ABCDEF',
            security: 'ALERTSECURITYBREACH',
        };

        // Color schemes
        this.colors = {
            default: '#00FF41',
            alert: '#FF0000',
            warning: '#FFB700',
            success: '#00FF00',
            current: '#00FF41'
        };

        this.drops = [];

        // Add sound manager
        this.soundManager = new SoundManager();
        
        // Add alert states
        this.alertStates = {
            normal: {
                color: '#00FF41',
                sound: null
            },
            warning: {
                color: '#FFB700',
                sound: 'alert'
            },
            danger: {
                color: '#FF0000',
                sound: 'alert'
            },
            success: {
                color: '#00FF00',
                sound: 'access'
            }
        };

        this.initialize();
    }

    initialize() {
        this.handleResize();
        this.createDrops();
        this.animate();
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.config.fontSize);
    }

    createDrops() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops.push({
                x: i * this.config.fontSize,
                y: Math.random() * -100,
                speed: this.getRandomSpeed(),
                chars: this.getRandomChars(20),
                opacity: Math.random() * 0.5 + 0.5,
                charSet: 'default'
            });
        }
    }

    getRandomSpeed() {
        return Math.random() * 
            (this.config.maxSpeed - this.config.baseSpeed) + 
            this.config.baseSpeed;
    }

    getRandomChars(length) {
        const chars = [];
        const set = this.charSets[this.config.alertMode ? 'security' : 'default'] + 
                   this.charSets.symbols;
        
        for (let i = 0; i < length; i++) {
            chars.push(set[Math.floor(Math.random() * set.length)]);
        }
        return chars;
    }

    triggerSecurityAlert() {
        this.config.alertMode = true;
        this.config.colorCycle = true;
        this.colors.current = this.colors.alert;
        
        // Play alert sound
        this.soundManager.play('alert');
        
        // Reset after 5 seconds
        setTimeout(() => {
            this.config.alertMode = false;
            this.config.colorCycle = false;
            this.colors.current = this.colors.default;
            // Play access granted sound when returning to normal
            this.soundManager.play('access');
        }, 5000);
    }

    updateDrops() {
        for (let i = 0; i < this.drops.length; i++) {
            const drop = this.drops[i];
            
            // Update position
            drop.y += drop.speed;

            // Reset if off screen
            if (drop.y > this.canvas.height) {
                drop.y = -this.config.fontSize;
                drop.speed = this.getRandomSpeed();
                drop.chars = this.getRandomChars(20);
                drop.opacity = Math.random() * 0.5 + 0.5;
            }

            // Randomly change characters
            if (Math.random() < 0.02) {
                const idx = Math.floor(Math.random() * drop.chars.length);
                drop.chars[idx] = this.getRandomChars(1)[0];
            }
        }
    }

    draw() {
        // Create fade effect
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.config.fadeSpeed})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw characters
        this.ctx.font = `${this.config.fontSize}px monospace`;
        
        for (const drop of this.drops) {
            for (let i = 0; i < drop.chars.length; i++) {
                const y = drop.y - i * this.config.fontSize;
                if (y < -this.config.fontSize) continue;
                
                // Calculate color and opacity
                const alpha = drop.opacity * (1 - i / drop.chars.length);
                this.ctx.fillStyle = this.config.colorCycle ? 
                    this.getCycleColor(y) : 
                    this.getGlowColor(this.colors.current, alpha);
                
                // Draw character
                this.ctx.fillText(
                    drop.chars[i],
                    drop.x,
                    y
                );
            }
        }
    }

    getCycleColor(y) {
        const cycle = (Date.now() / 1000) % 3;
        if (cycle < 1) return this.colors.alert;
        if (cycle < 2) return this.colors.warning;
        return this.colors.success;
    }

    getGlowColor(baseColor, alpha) {
        return `rgba(${this.hexToRgb(baseColor)}, ${alpha})`;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '0, 255, 65';
    }

    animate() {
        this.updateDrops();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
} 