class AttackPatterns {
    constructor(visualizer) {
        this.visualizer = visualizer;
        this.soundManager = new SoundManager();
        
        // Define attack patterns
        this.patterns = {
            ddos: {
                name: 'DDoS Attack',
                color: '#FF0000',
                speed: 3,
                spread: 0.8,
                sound: 'criticalAlert',
                execute: this.executeDDoS.bind(this)
            },
            bruteForce: {
                name: 'Brute Force',
                color: '#FFA500',
                speed: 1.5,
                spread: 0.3,
                sound: 'alert',
                execute: this.executeBruteForce.bind(this)
            },
            malware: {
                name: 'Malware Infection',
                color: '#FF00FF',
                speed: 2,
                spread: 0.6,
                sound: 'warning',
                execute: this.executeMalware.bind(this)
            },
            sqlInjection: {
                name: 'SQL Injection',
                color: '#FF4500',
                speed: 1,
                spread: 0.4,
                sound: 'alert',
                execute: this.executeSQLInjection.bind(this)
            },
            ransomware: {
                name: 'Ransomware Attack',
                color: '#8B0000',
                speed: 1.8,
                spread: 0.7,
                sound: 'criticalAlert',
                execute: this.executeRansomware.bind(this)
            },
            phishing: {
                name: 'Phishing Attack',
                color: '#4169E1',
                speed: 1.2,
                spread: 0.5,
                sound: 'warning',
                execute: this.executePhishing.bind(this)
            },
            zeroDay: {
                name: 'Zero-Day Exploit',
                color: '#800080',
                speed: 4,
                spread: 0.9,
                sound: 'criticalAlert',
                execute: this.executeZeroDay.bind(this)
            },
            mitm: {
                name: 'Man in the Middle',
                color: '#008B8B',
                speed: 1.5,
                spread: 0.6,
                sound: 'alert',
                execute: this.executeMITM.bind(this)
            }
        };
    }

    async executeAttack(patternName) {
        const pattern = this.patterns[patternName];
        if (!pattern) return;

        this.soundManager.play(pattern.sound);
        await pattern.execute();
    }

    async executeDDoS() {
        const targetNodes = this.visualizer.nodes.slice(0, 5);
        const attacks = targetNodes.map(async (node) => {
            for (let i = 0; i < 10; i++) {
                this.visualizer.createAttackParticle(
                    Math.random() * this.visualizer.canvas.width,
                    Math.random() * this.visualizer.canvas.height,
                    node,
                    this.patterns.ddos
                );
                await this.delay(100);
            }
        });

        await Promise.all(attacks);
    }

    async executeBruteForce() {
        const targetNode = this.visualizer.nodes[
            Math.floor(Math.random() * this.visualizer.nodes.length)
        ];
        
        for (let i = 0; i < 20; i++) {
            this.visualizer.createPasswordAttempt(targetNode);
            await this.delay(200);
        }
    }

    async executeMalware() {
        const startNode = this.visualizer.nodes[
            Math.floor(Math.random() * this.visualizer.nodes.length)
        ];
        
        await this.spreadInfection(startNode, 0);
    }

    async spreadInfection(node, depth) {
        if (depth > 3) return;

        node.infected = true;
        this.visualizer.createInfectionEffect(node);

        const connectedNodes = this.visualizer.getConnectedNodes(node);
        for (const nextNode of connectedNodes) {
            if (!nextNode.infected && Math.random() < this.patterns.malware.spread) {
                await this.delay(500);
                await this.spreadInfection(nextNode, depth + 1);
            }
        }
    }

    async executeSQLInjection() {
        const targetNode = this.visualizer.nodes[
            Math.floor(Math.random() * this.visualizer.nodes.length)
        ];
        
        this.visualizer.createSQLInjectionEffect(targetNode);
        
        const connectedNodes = this.visualizer.getConnectedNodes(targetNode);
        for (const node of connectedNodes) {
            await this.delay(300);
            this.visualizer.createDataLeakEffect(node);
        }
    }

    async executeRansomware() {
        const startNode = this.visualizer.nodes[
            Math.floor(Math.random() * this.visualizer.nodes.length)
        ];
        
        // Create encryption effect
        this.visualizer.createEncryptionEffect(startNode);
        this.soundManager.play('encrypt');

        // Spread encryption to connected nodes
        await this.spreadEncryption(startNode, 0);
    }

    async spreadEncryption(node, depth) {
        if (depth > 4) return;

        node.encrypted = true;
        const connectedNodes = this.visualizer.getConnectedNodes(node);
        
        for (const nextNode of connectedNodes) {
            if (!nextNode.encrypted) {
                await this.delay(300);
                this.visualizer.createEncryptionEffect(nextNode);
                this.soundManager.play('encrypt', { volume: 0.1 });
                await this.spreadEncryption(nextNode, depth + 1);
            }
        }
    }

    async executePhishing() {
        const targets = this.visualizer.nodes.slice(0, 3);
        
        for (const target of targets) {
            this.visualizer.createPhishingEmail(target);
            await this.delay(500);
            
            if (Math.random() > 0.5) {
                this.visualizer.createCompromiseEffect(target);
                this.soundManager.play('alert');
            }
        }
    }

    async executeZeroDay() {
        const targetNode = this.visualizer.nodes[
            Math.floor(Math.random() * this.visualizer.nodes.length)
        ];
        
        // Create exploit visualization
        this.visualizer.createExploitEffect(targetNode);
        this.soundManager.play('criticalAlert');

        // Rapid system compromise
        await this.rapidCompromise(targetNode);
    }

    async rapidCompromise(node) {
        const allNodes = this.visualizer.nodes;
        const compromiseOrder = this.getCompromiseOrder(node, allNodes);
        
        for (const targetNode of compromiseOrder) {
            await this.delay(100);
            this.visualizer.createCompromiseEffect(targetNode);
            this.soundManager.play('warning', { volume: 0.1 });
        }
    }

    async executeMITM() {
        // Find two nodes to intercept
        const node1 = this.visualizer.nodes[0];
        const node2 = this.visualizer.nodes[this.visualizer.nodes.length - 1];
        
        // Create interceptor node
        const interceptor = {
            x: (node1.x + node2.x) / 2,
            y: (node1.y + node2.y) / 2,
            type: 'interceptor'
        };

        // Visualize interception
        this.visualizer.createInterceptorNode(interceptor);
        await this.simulateDataInterception(node1, interceptor, node2);
    }

    async simulateDataInterception(source, interceptor, destination) {
        for (let i = 0; i < 5; i++) {
            // Data packet from source to interceptor
            this.visualizer.createDataPacket(source, interceptor, 'outgoing');
            await this.delay(300);
            
            // Intercepted data
            this.visualizer.createInterceptEffect(interceptor);
            this.soundManager.play('warning', { volume: 0.2 });
            await this.delay(200);
            
            // Modified data to destination
            this.visualizer.createDataPacket(interceptor, destination, 'modified');
            await this.delay(300);
        }
    }

    getCompromiseOrder(startNode, allNodes) {
        return allNodes
            .map(node => ({
                node,
                distance: this.getDistance(startNode, node)
            }))
            .sort((a, b) => a.distance - b.distance)
            .map(item => item.node);
    }

    getDistance(node1, node2) {
        const dx = node1.x - node2.x;
        const dy = node1.y - node2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Add these methods to the SecurityVisualizer class
class SecurityVisualizer {
    // ... existing code ...

    createAttackParticle(startX, startY, targetNode, pattern) {
        const particle = {
            x: startX,
            y: startY,
            targetX: targetNode.x,
            targetY: targetNode.y,
            speed: pattern.speed,
            color: pattern.color,
            size: 2,
            alpha: 1
        };

        this.particles.push(particle);
    }

    createPasswordAttempt(targetNode) {
        const text = this.generateRandomPassword();
        const attempt = {
            x: targetNode.x,
            y: targetNode.y - 20,
            text: text,
            alpha: 1,
            failed: true
        };

        this.passwordAttempts.push(attempt);
    }

    createInfectionEffect(node) {
        const effect = {
            x: node.x,
            y: node.y,
            radius: 0,
            maxRadius: 30,
            alpha: 1,
            color: this.patterns.malware.color
        };

        this.infectionEffects.push(effect);
    }

    createSQLInjectionEffect(node) {
        const effect = {
            x: node.x,
            y: node.y,
            text: 'SELECT * FROM users;',
            alpha: 1,
            scale: 1
        };

        this.sqlInjectionEffects.push(effect);
    }

    createDataLeakEffect(node) {
        const effect = {
            x: node.x,
            y: node.y,
            data: this.generateFakeData(),
            alpha: 1,
            distance: 0
        };

        this.dataLeakEffects.push(effect);
    }

    createEncryptionEffect(node) {
        const effect = {
            x: node.x,
            y: node.y,
            text: 'Encryption',
            alpha: 1,
            scale: 1
        };

        this.encryptionEffects.push(effect);
    }

    createExploitEffect(node) {
        const effect = {
            x: node.x,
            y: node.y,
            text: 'Exploit',
            alpha: 1,
            scale: 1
        };

        this.exploitEffects.push(effect);
    }

    createCompromiseEffect(node) {
        const effect = {
            x: node.x,
            y: node.y,
            text: 'Compromise',
            alpha: 1,
            scale: 1
        };

        this.compromiseEffects.push(effect);
    }

    createInterceptorNode(interceptor) {
        const node = {
            x: interceptor.x,
            y: interceptor.y,
            type: 'interceptor'
        };

        this.nodes.push(node);
    }

    createDataPacket(source, destination, direction) {
        const packet = {
            source,
            destination,
            direction
        };

        this.dataPackets.push(packet);
    }

    createInterceptEffect(interceptor) {
        const effect = {
            x: interceptor.x,
            y: interceptor.y,
            text: 'Intercepted',
            alpha: 1,
            scale: 1
        };

        this.interceptEffects.push(effect);
    }

    generateRandomPassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        return Array(10).fill(0).map(() => 
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');
    }

    generateFakeData() {
        const data = [
            'user_id: 1234',
            'email: user@example.com',
            'password_hash: *****',
            'credit_card: ****-****-****-1234'
        ];
        return data[Math.floor(Math.random() * data.length)];
    }

    getConnectedNodes(node) {
        return this.connections
            .filter(conn => conn.from === node || conn.to === node)
            .map(conn => conn.from === node ? conn.to : conn.from);
    }

    // Update the draw method to include new effects
    draw() {
        // ... existing drawing code ...

        // Draw attack particles
        this.particles.forEach((particle, index) => {
            // Update position
            const dx = particle.targetX - particle.x;
            const dy = particle.targetY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 5) {
                this.particles.splice(index, 1);
                return;
            }

            particle.x += (dx / distance) * particle.speed;
            particle.y += (dy / distance) * particle.speed;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${this.hexToRgb(particle.color)}, ${particle.alpha})`;
            this.ctx.fill();
        });

        // Draw other effects...
        this.drawPasswordAttempts();
        this.drawInfectionEffects();
        this.drawSQLInjectionEffects();
        this.drawDataLeakEffects();
        this.drawEncryptionEffects();
        this.drawExploitEffects();
        this.drawCompromiseEffects();
        this.drawInterceptorNodes();
        this.drawDataPackets();
        this.drawInterceptEffects();
    }
} 