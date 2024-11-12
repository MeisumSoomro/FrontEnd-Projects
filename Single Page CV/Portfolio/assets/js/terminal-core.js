class TerminalCore {
    constructor(element) {
        this.element = element;
        this.commandHistory = [];
        this.historyIndex = -1;
        
        // Core command set
        this.commands = {
            help: () => this.showHelp(),
            clear: () => this.clearTerminal(),
            about: () => this.showAbout(),
            skills: () => this.showSkills(),
            projects: () => this.showProjects(),
            contact: () => this.showContact()
        };
        
        // Add sound manager
        this.soundManager = new SoundManager();
        
        // Add typing sounds
        this.typingSounds = ['keyPress'];
        this.currentTypingSound = 0;
        
        this.initializeTerminal();
    }

    initializeTerminal() {
        this.inputLine = document.createElement('div');
        this.inputLine.className = 'terminal-input-line';
        this.inputLine.innerHTML = `
            <span class="prompt">visitor@matrix:~$</span>
            <input type="text" class="command-input" autofocus>
        `;
        
        this.element.appendChild(this.inputLine);
        this.bindEvents();
    }

    bindEvents() {
        const input = this.inputLine.querySelector('.command-input');
        
        input.addEventListener('keydown', (e) => {
            // Play typing sound
            this.playTypingSound();

            if (e.key === 'Enter') {
                this.executeCommand(input.value);
                input.value = '';
                // Play command execution sound
                this.soundManager.play('access');
            }
            // Command history navigation
            else if (e.key === 'ArrowUp') {
                this.navigateHistory('up');
            }
            else if (e.key === 'ArrowDown') {
                this.navigateHistory('down');
            }
        });
    }

    playTypingSound() {
        // Rotate through typing sounds for variety
        this.soundManager.play(this.typingSounds[this.currentTypingSound]);
        this.currentTypingSound = (this.currentTypingSound + 1) % this.typingSounds.length;
    }

    executeCommand(cmd) {
        const command = cmd.trim().toLowerCase();
        
        if (command) {
            this.commandHistory.push(command);
            this.historyIndex = this.commandHistory.length;
            
            if (this.commands[command]) {
                this.commands[command]();
                this.soundManager.play('access');
            } else {
                this.printOutput(`Command not found: ${command}`);
                this.soundManager.play('denied');
            }
        }
    }

    printOutput(text) {
        const output = document.createElement('div');
        output.className = 'terminal-output-line';
        output.textContent = text;
        this.element.insertBefore(output, this.inputLine);
    }
} 