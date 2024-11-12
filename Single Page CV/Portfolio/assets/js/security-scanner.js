class SecurityScanner {
    constructor() {
        this.scanPatterns = {
            vulnerabilities: [
                { name: 'SQL Injection', severity: 'critical', icon: 'database' },
                { name: 'XSS', severity: 'high', icon: 'code' },
                { name: 'CSRF', severity: 'medium', icon: 'shield-alt' },
                { name: 'Buffer Overflow', severity: 'critical', icon: 'memory' },
                { name: 'Memory Leak', severity: 'high', icon: 'exclamation-triangle' },
                { name: 'Insecure Authentication', severity: 'critical', icon: 'key' },
                { name: 'Data Exposure', severity: 'high', icon: 'eye' },
                { name: 'Weak Encryption', severity: 'medium', icon: 'lock' }
            ],
            scanStages: [
                'Initializing Scanner...',
                'Checking Entry Points...',
                'Analyzing Dependencies...',
                'Scanning Network Ports...',
                'Testing Authentication...',
                'Checking Encryption...',
                'Validating Input Handlers...',
                'Running Exploit Tests...',
                'Analyzing Results...'
            ]
        };

        this.soundManager = new SoundManager();
    }

    async scanProject(projectElement) {
        const scannerOverlay = this.createScannerOverlay();
        projectElement.appendChild(scannerOverlay);

        try {
            await this.runScanAnimation(scannerOverlay);
            const report = await this.performDeepScan(scannerOverlay);
            this.updateProjectWithFindings(projectElement, report);
            return report;
        } finally {
            setTimeout(() => {
                scannerOverlay.remove();
            }, 1000);
        }
    }

    createScannerOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'scanner-overlay';
        overlay.innerHTML = `
            <div class="scan-content">
                <div class="scan-header">
                    <div class="scan-title">Security Scan in Progress</div>
                    <div class="scan-progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
                <div class="scan-details">
                    <div class="current-operation"></div>
                    <div class="findings-list"></div>
                </div>
                <div class="scan-visualization">
                    <canvas class="scan-canvas"></canvas>
                </div>
            </div>
        `;
        return overlay;
    }

    async runScanAnimation(overlay) {
        const canvas = overlay.querySelector('.scan-canvas');
        const ctx = canvas.getContext('2d');
        const progressBar = overlay.querySelector('.progress-fill');
        const currentOperation = overlay.querySelector('.current-operation');
        const findingsList = overlay.querySelector('.findings-list');

        // Initialize scan visualization
        this.initializeScanCanvas(canvas, ctx);

        for (let i = 0; i < this.scanPatterns.scanStages.length; i++) {
            const progress = (i + 1) / this.scanPatterns.scanStages.length * 100;
            
            // Update progress bar
            progressBar.style.width = `${progress}%`;
            
            // Update current operation
            currentOperation.textContent = this.scanPatterns.scanStages[i];
            
            // Play scan sound
            this.soundManager.play('scan', { volume: 0.1 });

            // Simulate finding vulnerabilities
            if (Math.random() > 0.7) {
                const vulnerability = this.getRandomVulnerability();
                this.addFinding(findingsList, vulnerability);
                this.soundManager.play(vulnerability.severity === 'critical' ? 'alert' : 'warning');
            }

            // Wait for next stage
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    }

    initializeScanCanvas(canvas, ctx) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const gridSize = 20;
        const cols = Math.floor(canvas.width / gridSize);
        const rows = Math.floor(canvas.height / gridSize);

        // Draw scanning grid
        setInterval(() => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)';
            ctx.lineWidth = 1;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (Math.random() > 0.99) {
                        ctx.fillStyle = 'rgba(0, 255, 65, 0.3)';
                        ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
                    }
                }
            }

            // Draw scanning line
            const scanLine = (Date.now() / 10) % canvas.height;
            const gradient = ctx.createLinearGradient(0, scanLine - 10, 0, scanLine + 10);
            gradient.addColorStop(0, 'rgba(0, 255, 65, 0)');
            gradient.addColorStop(0.5, 'rgba(0, 255, 65, 0.5)');
            gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, scanLine - 10, canvas.width, 20);
        }, 50);
    }

    getRandomVulnerability() {
        return this.scanPatterns.vulnerabilities[
            Math.floor(Math.random() * this.scanPatterns.vulnerabilities.length)
        ];
    }

    addFinding(findingsList, vulnerability) {
        const finding = document.createElement('div');
        finding.className = `finding-item ${vulnerability.severity}`;
        finding.innerHTML = `
            <i class="fas fa-${vulnerability.icon}"></i>
            <span class="finding-name">${vulnerability.name}</span>
            <span class="finding-severity">${vulnerability.severity}</span>
        `;
        
        finding.style.animation = 'findingAppear 0.3s ease-out';
        findingsList.appendChild(finding);

        // Scroll to bottom
        findingsList.scrollTop = findingsList.scrollHeight;
    }

    async performDeepScan(overlay) {
        // Generate comprehensive security report
        return {
            score: Math.floor(Math.random() * 40) + 60,
            vulnerabilities: this.getRandomItems(this.scanPatterns.vulnerabilities, 3),
            timestamp: new Date().toISOString(),
            recommendations: this.generateRecommendations(),
            scanDuration: Math.floor(Math.random() * 5000) + 3000,
            totalEndpoints: Math.floor(Math.random() * 50) + 10,
            secureEndpoints: Math.floor(Math.random() * 40) + 5
        };
    }

    getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    generateRecommendations() {
        const recommendations = [
            { action: 'Implement input validation', priority: 'high' },
            { action: 'Add rate limiting', priority: 'medium' },
            { action: 'Enable HTTPS', priority: 'critical' },
            { action: 'Update dependencies', priority: 'high' },
            { action: 'Add security headers', priority: 'medium' }
        ];
        return this.getRandomItems(recommendations, 3);
    }

    updateProjectWithFindings(element, report) {
        // Update project card with scan results
        const statusClass = report.score > 80 ? 'status-secure' : 'status-vulnerable';
        const statusText = report.score > 80 ? 'Secure' : 'Vulnerable';
        
        element.querySelector('.vulnerability-status').className = 
            `vulnerability-status ${statusClass}`;
        element.querySelector('.vulnerability-status').innerHTML = 
            `<i class="fas fa-shield-alt"></i> ${statusText} (${report.score}/100)`;
    }
} 