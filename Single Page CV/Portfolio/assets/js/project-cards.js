class SecurityProjectCard {
    constructor(element) {
        this.element = element;
        this.scanner = new SecurityScanner();
        this.soundManager = new SoundManager();
        this.isScanning = false;
        
        this.initializeCard();
    }

    initializeCard() {
        // Add hover interactions
        this.element.addEventListener('mouseenter', () => this.startHoverEffect());
        this.element.addEventListener('mouseleave', () => this.stopHoverEffect());
        
        // Add click interaction for detailed scan
        this.element.addEventListener('click', (e) => {
            if (!e.target.closest('.project-link')) {
                this.showDetailedScan();
            }
        });

        // Initialize security status
        this.updateSecurityStatus('secure');
    }

    async startHoverEffect() {
        if (this.isScanning) return;
        
        this.isScanning = true;
        this.element.classList.add('scanning');
        
        // Quick scan on hover
        await this.scanner.scanProject(this.element);
        
        this.isScanning = false;
        this.element.classList.remove('scanning');
    }

    stopHoverEffect() {
        if (!this.isScanning) {
            this.element.classList.remove('scanning');
        }
    }

    async showDetailedScan() {
        // Create and show detailed scan modal
        const modal = document.createElement('div');
        modal.className = 'security-modal';
        
        // Start with loading state
        modal.innerHTML = this.getLoadingModalContent();
        document.body.appendChild(modal);

        // Perform detailed scan
        const report = await this.scanner.generateSecurityReport();
        
        // Update modal with results
        setTimeout(() => {
            modal.innerHTML = this.getDetailedModalContent(report);
            this.bindModalEvents(modal);
        }, 2000);
    }

    getLoadingModalContent() {
        return `
            <div class="modal-content scanning">
                <div class="scan-status">
                    <div class="scan-animation"></div>
                    <h3>Performing Deep Security Scan...</h3>
                    <div class="scan-progress">
                        <div class="progress-bar"></div>
                    </div>
                </div>
            </div>
        `;
    }

    getDetailedModalContent(report) {
        return `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Security Analysis Report</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="security-score">
                        <div class="score-circle ${report.score > 80 ? 'high' : 'low'}">
                            ${report.score}
                        </div>
                        <h3>Security Score</h3>
                    </div>
                    <div class="security-details">
                        <div class="detail-section">
                            <h4>Detected Vulnerabilities</h4>
                            <ul class="vulnerability-list">
                                ${report.vulnerabilities.map(v => `
                                    <li class="vulnerability-item">
                                        <i class="fas fa-exclamation-triangle"></i>
                                        ${v}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        <div class="detail-section">
                            <h4>Security Features</h4>
                            <ul class="feature-list">
                                ${report.features.map(f => `
                                    <li class="feature-item">
                                        <i class="fas fa-shield-alt"></i>
                                        ${f}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        <div class="detail-section">
                            <h4>Recommendations</h4>
                            <ul class="recommendation-list">
                                ${report.recommendations.map(r => `
                                    <li class="recommendation-item">
                                        <i class="fas fa-lightbulb"></i>
                                        ${r}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindModalEvents(modal) {
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            this.soundManager.play('denied');
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.soundManager.play('denied');
                modal.remove();
            }
        });
    }
}

// Initialize all project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.security-project');
    projectCards.forEach(card => new SecurityProjectCard(card));
}); 