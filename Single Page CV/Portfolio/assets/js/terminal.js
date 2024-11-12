class Terminal {
    constructor(element) {
        this.element = element;
        this.history = [];
        this.commands = {
            help: {
                description: 'List all available commands',
                action: () => this.showHelp()
            },
            about: {
                description: 'Learn more about me',
                action: () => this.showAbout()
            },
            projects: {
                description: 'View my projects',
                action: () => this.showProjects()
            },
            contact: {
                description: 'Get my contact information',
                action: () => this.showContact()
            },
            clear: {
                description: 'Clear the terminal',
                action: () => this.clear()
            }
        };

        this.initialize();
    }

    initialize() {
        this.inputLine = document.createElement('div');
        this.inputLine.className = 'terminal-input';
        this.inputLine.innerHTML = `
            <span class="prompt">visitor@matrix:~$</span>
            <input type="text" class="command-input" autofocus />
        `;
        
        this.element.appendChild(this.inputLine);
        this.bindEvents();
    }

    bindEvents() {
        const input = this.inputLine.querySelector('.command-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim().toLowerCase();
                this.executeCommand(command);
                input.value = '';
            }
        });
    }

    executeCommand(command) {
        // Command execution logic
    }
} 