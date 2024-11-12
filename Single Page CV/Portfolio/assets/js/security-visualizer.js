class SecurityVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.threats = [];
        this.soundManager = new SoundManager();
        
        this.colors = {
            safe: '#00FF41',
            warning: '#FFB700',
            danger: '#FF0000',
            node: '#1a1a1a',
            connection: 'rgba(0, 255, 65, 0.2)'
        };

        this.initialize();
    }

    initialize() {
        this.resizeCanvas();
        this.createNetwork();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.createNetwork();
    }

    createNetwork() {
        // Create nodes
        this.nodes = [];
        const nodeCount = Math.floor(this.canvas.width / 100);
        
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 4,
                color: this.colors.node,
                status: 'safe',
                pulseRadius: 0,
                pulseAlpha: 1
            });
        }

        // Create connections
        this.connections = [];
        this.nodes.forEach((node, i) => {
            this.nodes.slice(i + 1).forEach(otherNode => {
                if (this.getDistance(node, otherNode) < 150) {
                    this.connections.push({
                        from: node,
                        to: otherNode,
                        status: 'safe'
                    });
                }
            });
        });
    }

    simulateAttack(type = 'random') {
        const targetNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
        targetNode.status = 'danger';
        targetNode.pulseRadius = 0;
        targetNode.pulseAlpha = 1;

        // Play alert sound
        this.soundManager.play('alert', { volume: 0.2 });

        // Create threat visualization
        this.threats.push({
            x: targetNode.x,
            y: targetNode.y,
            radius: 0,
            alpha: 1,
            color: this.colors.danger
        });

        // Propagate threat through connections
        this.propagateThreat(targetNode);
    }

    propagateThreat(sourceNode, depth = 0) {
        if (depth > 3) return; // Limit propagation depth

        const affectedConnections = this.connections.filter(conn => 
            conn.from === sourceNode || conn.to === sourceNode
        );

        affectedConnections.forEach(conn => {
            conn.status = 'danger';
            const targetNode = conn.from === sourceNode ? conn.to : conn.from;
            
            setTimeout(() => {
                targetNode.status = 'warning';
                this.soundManager.play('warning', { volume: 0.1 });
                this.propagateThreat(targetNode, depth + 1);
            }, 500 * depth);
        });
    }

    defendNode(node) {
        node.status = 'safe';
        node.pulseRadius = 0;
        node.pulseAlpha = 1;
        
        // Play defense sound
        this.soundManager.play('access', { volume: 0.2 });

        // Create defense visualization
        this.threats.push({
            x: node.x,
            y: node.y,
            radius: 0,
            alpha: 1,
            color: this.colors.safe
        });
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        this.connections.forEach(conn => {
            this.ctx.beginPath();
            this.ctx.moveTo(conn.from.x, conn.from.y);
            this.ctx.lineTo(conn.to.x, conn.to.y);
            this.ctx.strokeStyle = conn.status === 'danger' ? 
                this.colors.danger : this.colors.connection;
            this.ctx.stroke();
        });

        // Draw nodes
        this.nodes.forEach(node => {
            // Draw pulse effect
            if (node.pulseRadius > 0) {
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.pulseRadius, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(${this.hexToRgb(
                    node.status === 'danger' ? this.colors.danger : this.colors.safe
                )}, ${node.pulseAlpha})`;
                this.ctx.stroke();
                
                node.pulseRadius += 1;
                node.pulseAlpha *= 0.95;
                
                if (node.pulseAlpha < 0.1) {
                    node.pulseRadius = 0;
                    node.pulseAlpha = 1;
                }
            }

            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.colors[node.status];
            this.ctx.fill();
        });

        // Draw threats
        this.threats = this.threats.filter(threat => {
            this.ctx.beginPath();
            this.ctx.arc(threat.x, threat.y, threat.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(${this.hexToRgb(threat.color)}, ${threat.alpha})`;
            this.ctx.stroke();

            threat.radius += 2;
            threat.alpha *= 0.95;

            return threat.alpha > 0.1;
        });
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    getDistance(point1, point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '0, 255, 65';
    }
} 