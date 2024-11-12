class AudioControlsManager {
    constructor() {
        this.audioControls = document.querySelector('.audio-controls');
        this.footer = document.querySelector('.matrix-footer');
        this.initialBottom = 20; // Initial bottom position
        this.footerHeight = this.footer.offsetHeight;
        
        this.setupPositioning();
    }

    setupPositioning() {
        window.addEventListener('scroll', () => this.updatePosition());
        window.addEventListener('resize', () => {
            this.footerHeight = this.footer.offsetHeight;
            this.updatePosition();
        });
    }

    updatePosition() {
        const footerRect = this.footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (footerRect.top < viewportHeight) {
            // Footer is visible, adjust audio controls position
            const overlap = viewportHeight - footerRect.top;
            const newBottom = Math.min(
                this.initialBottom + overlap + 20, // Add 20px padding
                this.footerHeight + this.initialBottom
            );
            this.audioControls.style.bottom = `${newBottom}px`;
        } else {
            // Reset to initial position
            this.audioControls.style.bottom = `${this.initialBottom}px`;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AudioControlsManager();
}); 