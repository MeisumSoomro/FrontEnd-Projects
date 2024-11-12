class SecurityInteractions {
    constructor(visualizer) {
        this.visualizer = visualizer;
        this.soundManager = new SoundManager();
        this.attackPatterns = new AttackPatterns(visualizer);
        
        // Interactive elements state
        this.activeDefenses = new Set();
        this.securityLevel = 'normal';
        this.isScanning = false;
        
        // Defense mechanisms
        this.defenses = {
            firewall: {
                active: false,
                strength: 100,
                position: { x: 0, y: 0 },
                radius: 150
            },
            ids: {
                active: false,
                alerts: [],
                detectionRate: 0.8
            },
            encryption: {
                active: false,
                algorithm: 'AES-256',
                keys: new Map()
            }
        };

        this.initializeInteractions();
    }

    initializeInteractions() {
        // Add event listeners for mouse/touch interactions
        this.visualizer.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.visualizer.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.visualizer.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.deployDefense(e);
        });

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    handleMouseMove(e) {
        const rect = this.visualizer.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update firewall position if active
        if (this.defenses.firewall.active) {
            this.defenses.firewall.position = { x, y };
        }

        // Check for threats under cursor
        this.detectThreats(x, y);
    }

    handleClick(e) {
        const rect = this.visualizer.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Find clicked node
        const clickedNode = this.findClickedNode(x, y);
        if (clickedNode) {
            this.interactWithNode(clickedNode);
        }
    }

    deployDefense(e) {
        const rect = this.visualizer.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create defense menu
        const menu = this.createDefenseMenu(x, y);
        document.body.appendChild(menu);

        // Remove menu when clicking outside
        const removeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            }
        };
        document.addEventListener('click', removeMenu);
    }

    createDefenseMenu(x, y) {
        const menu = document.createElement('div');
        menu.className = 'defense-menu';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        const options = [
            { name: 'Deploy Firewall', action: () => this.activateFirewall() },
            { name: 'Enable IDS', action: () => this.activateIDS() },
            { name: 'Encrypt Node', action: () => this.activateEncryption() }
        ];

        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.name;
            button.addEventListener('click', () => {
                option.action();
                menu.remove();
            });
            menu.appendChild(button);
        });

        return menu;
    }

    activateFirewall() {
        this.defenses.firewall.active = true;
        this.soundManager.play('access');
        this.visualizer.createDefenseEffect('firewall');
    }

    activateIDS() {
        this.defenses.ids.active = true;
        this.soundManager.play('scan');
        this.startIDSScanning();
    }

    activateEncryption() {
        this.defenses.encryption.active = true;
        this.soundManager.play('encrypt');
        this.encryptNodes();
    }

    startIDSScanning() {
        if (this.isScanning) return;
        
        this.isScanning = true;
        const scanInterval = setInterval(() => {
            if (!this.defenses.ids.active) {
                clearInterval(scanInterval);
                this.isScanning = false;
                return;
            }

            this.scanForThreats();
        }, 1000);
    }

    scanForThreats() {
        this.visualizer.nodes.forEach(node => {
            if (node.infected && Math.random() < this.defenses.ids.detectionRate) {
                this.detectThreat(node);
            }
        });
    }

    detectThreat(node) {
        const alert = {
            node,
            type: 'malware',
            timestamp: Date.now()
        };

        this.defenses.ids.alerts.push(alert);
        this.soundManager.play('alert');
        this.visualizer.createAlertEffect(node);
    }

    encryptNodes() {
        this.visualizer.nodes.forEach(node => {
            if (!node.encrypted) {
                const key = this.generateEncryptionKey();
                this.defenses.encryption.keys.set(node, key);
                this.visualizer.createEncryptionEffect(node);
            }
        });
    }

    generateEncryptionKey() {
        return Array(32).fill(0)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join('');
    }

    findClickedNode(x, y) {
        return this.visualizer.nodes.find(node => {
            const dx = node.x - x;
            const dy = node.y - y;
            return Math.sqrt(dx * dx + dy * dy) < 10;
        });
    }

    interactWithNode(node) {
        if (node.infected) {
            this.cleanNode(node);
        } else if (node.type === 'interceptor') {
            this.disableInterceptor(node);
        }
    }

    cleanNode(node) {
        node.infected = false;
        this.soundManager.play('success');
        this.visualizer.createCleansingEffect(node);
    }

    disableInterceptor(node) {
        const index = this.visualizer.nodes.indexOf(node);
        if (index > -1) {
            this.visualizer.nodes.splice(index, 1);
            this.soundManager.play('access');
            this.visualizer.createDisableEffect(node);
        }
    }

    handleKeyPress(e) {
        switch(e.key.toLowerCase()) {
            case 'f':
                this.toggleFirewall();
                break;
            case 'i':
                this.toggleIDS();
                break;
            case 'e':
                this.toggleEncryption();
                break;
            case 'c':
                this.clearAllThreats();
                break;
        }
    }

    toggleFirewall() {
        this.defenses.firewall.active = !this.defenses.firewall.active;
        this.soundManager.play(this.defenses.firewall.active ? 'access' : 'denied');
    }

    toggleIDS() {
        this.defenses.ids.active = !this.defenses.ids.active;
        if (this.defenses.ids.active) {
            this.startIDSScanning();
        }
    }

    toggleEncryption() {
        this.defenses.encryption.active = !this.defenses.encryption.active;
        if (this.defenses.encryption.active) {
            this.encryptNodes();
        }
    }

    clearAllThreats() {
        this.visualizer.nodes.forEach(node => {
            if (node.infected) {
                this.cleanNode(node);
            }
        });
        this.soundManager.play('success');
    }
} 