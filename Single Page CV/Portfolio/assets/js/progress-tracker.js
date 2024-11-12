class ProgressTracker {
    constructor() {
        this.progressBar = null;
        this.progressText = null;
        this.currentProgress = 0;
        this.targetProgress = 0;
        this.steps = [];
        this.currentStep = 0;
        
        // Default steps for security scan
        this.defaultSteps = [
            { name: 'Initializing', weight: 10 },
            { name: 'Scanning Dependencies', weight: 20 },
            { name: 'Analyzing Code', weight: 30 },
            { name: 'Testing Security', weight: 25 },
            { name: 'Generating Report', weight: 15 }
        ];
    }

    initialize(container, steps = this.defaultSteps) {
        this.steps = steps;
        this.createProgressBar(container);
    }

    createProgressBar(container) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'github-progress-container';
        
        progressContainer.innerHTML = `
            <div class="progress-header">
                <span class="progress-step"></span>
                <span class="progress-percentage">0%</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>
        `;
        
        container.appendChild(progressContainer);
        
        this.progressBar = progressContainer.querySelector('.progress-fill');
        this.progressText = progressContainer.querySelector('.progress-step');
        this.progressPercentage = progressContainer.querySelector('.progress-percentage');
    }

    updateProgress(stepIndex, subProgress = 100) {
        if (stepIndex >= this.steps.length) return;

        const previousStepsWeight = this.steps
            .slice(0, stepIndex)
            .reduce((sum, step) => sum + step.weight, 0);
        
        const currentStepWeight = this.steps[stepIndex].weight;
        const weightedSubProgress = (subProgress / 100) * currentStepWeight;
        
        this.targetProgress = previousStepsWeight + weightedSubProgress;
        this.currentStep = stepIndex;
        
        this.progressText.textContent = this.steps[stepIndex].name;
        this.animateProgress();
    }

    animateProgress() {
        const animate = () => {
            if (this.currentProgress < this.targetProgress) {
                this.currentProgress = Math.min(
                    this.currentProgress + 1,
                    this.targetProgress
                );
                
                this.progressBar.style.width = `${this.currentProgress}%`;
                this.progressPercentage.textContent = `${Math.round(this.currentProgress)}%`;
                
                // Add color transitions based on progress
                if (this.currentProgress < 30) {
                    this.progressBar.style.backgroundColor = '#ff4444';
                } else if (this.currentProgress < 70) {
                    this.progressBar.style.backgroundColor = '#ffa600';
                } else {
                    this.progressBar.style.backgroundColor = '#00FF41';
                }
                
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    complete() {
        this.updateProgress(this.steps.length - 1, 100);
        
        // Add completion effect
        setTimeout(() => {
            this.progressBar.classList.add('completed');
            this.progressText.textContent = 'Scan Complete';
        }, 500);
    }

    reset() {
        this.currentProgress = 0;
        this.targetProgress = 0;
        this.currentStep = 0;
        this.progressBar.style.width = '0%';
        this.progressBar.classList.remove('completed');
        this.progressText.textContent = this.steps[0].name;
        this.progressPercentage.textContent = '0%';
    }
} 