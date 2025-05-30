// Navigation and module loading for Cybersecurity Awareness Training

/**
 * Navigation manager for handling module navigation and content loading
 */
class NavigationManager {
    /**
     * Initialize navigation
     */
    constructor() {
        this.currentSection = 'welcome-screen';
        this.currentModule = null;
        this.setupEventListeners();
        this.initializeNavigation();
    }

    /**
     * Set up event listeners for navigation elements
     */
    setupEventListeners() {
        // Start course button
        const startCourseBtn = document.getElementById('start-course-btn');
        if (startCourseBtn) {
            startCourseBtn.addEventListener('click', () => this.startCourse());
        }

        // Reset progress button
        const resetProgressBtn = document.getElementById('reset-progress-btn');
        if (resetProgressBtn) {
            resetProgressBtn.addEventListener('click', () => this.resetProgress());
        }

        // Login button and modal
        const loginBtn = document.getElementById('login-btn');
        const loginModal = document.getElementById('login-modal');
        const closeBtn = document.querySelector('.close');
        const loginForm = document.getElementById('login-form');

        if (loginBtn && loginModal) {
            loginBtn.addEventListener('click', () => {
                loginModal.style.display = 'block';
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                loginModal.style.display = 'none';
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveUserInfo();
                loginModal.style.display = 'none';
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
            }
        });
    }

    /**
     * Initialize navigation based on saved progress
     */
    initializeNavigation() {
        // Generate module navigation
        this.generateModuleNavigation();
        
        // Update user info display
        this.updateUserInfoDisplay();
        
        // Update progress display
        this.updateProgressDisplay();
        
        // Check if we should show certificate
        const progress = storageManager.getProgress();
        if (storageManager.isTrainingCompleted() && progress.certificateGenerated) {
            this.showCertificate();
        }
    }

    /**
     * Generate module navigation in sidebar
     */
    generateModuleNavigation() {
        const moduleNavigation = document.getElementById('module-navigation');
        if (!moduleNavigation) return;
        
        // Clear existing navigation
        moduleNavigation.innerHTML = '';
        
        // Add welcome screen link
        const welcomeItem = document.createElement('li');
        welcomeItem.textContent = 'Course Overview';
        welcomeItem.dataset.section = 'welcome-screen';
        welcomeItem.addEventListener('click', () => this.navigateTo('welcome-screen'));
        moduleNavigation.appendChild(welcomeItem);
        
        // Get module status
        const moduleStatus = storageManager.getModuleStatus();
        
        // Add module links
        MODULES.forEach(module => {
            const moduleItem = document.createElement('li');
            moduleItem.textContent = `Module ${module.id}: ${module.title}`;
            moduleItem.dataset.module = module.id;
            
            // Add completed class if module is completed
            const status = moduleStatus.find(m => m.id === module.id);
            if (status && status.completed) {
                moduleItem.classList.add('completed');
            }
            
            // Add event listener
            moduleItem.addEventListener('click', () => this.loadModule(module.id));
            
            moduleNavigation.appendChild(moduleItem);
        });
        
        // Add certificate link if all modules completed
        if (storageManager.isTrainingCompleted()) {
            const certificateItem = document.createElement('li');
            certificateItem.textContent = 'View Certificate';
            certificateItem.dataset.section = 'certificate';
            certificateItem.addEventListener('click', () => this.showCertificate());
            moduleNavigation.appendChild(certificateItem);
        }
    }

    /**
     * Update the displayed user information
     */
    updateUserInfoDisplay() {
        const userNameElement = document.getElementById('user-name');
        const loginBtn = document.getElementById('login-btn');
        
        if (userNameElement && loginBtn) {
            const userInfo = storageManager.getUserInfo();
            
            if (userInfo.name !== 'Guest User' && userInfo.name !== '') {
                userNameElement.textContent = userInfo.name;
                loginBtn.textContent = 'Edit Info';
            } else {
                userNameElement.textContent = 'Guest User';
                loginBtn.textContent = 'Login';
            }
        }
    }

    /**
     * Update the progress display
     */
    updateProgressDisplay() {
        const progressElement = document.getElementById('overall-progress');
        const progressPercentage = document.getElementById('progress-percentage');
        
        if (progressElement && progressPercentage) {
            const progress = storageManager.getProgress();
            progressElement.style.width = `${progress.overallProgress}%`;
            progressPercentage.textContent = `${progress.overallProgress}%`;
        }
    }

    /**
     * Save user information from form
     */
    saveUserInfo() {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const companyInput = document.getElementById('company');
        
        if (nameInput && emailInput && companyInput) {
            const userInfo = {
                name: nameInput.value,
                email: emailInput.value,
                company: companyInput.value
            };
            
            storageManager.saveUserInfo(userInfo);
            this.updateUserInfoDisplay();
        }
    }

    /**
     * Start the course - load the first module
     */
    startCourse() {
        // Get progress
        const progress = storageManager.getProgress();
        
        // If user has started before, load the last accessed module
        if (progress.currentModule > 0) {
            this.loadModule(progress.currentModule);
        } else {
            // Otherwise start with module 1
            this.loadModule(1);
        }
    }

    /**
     * Reset all progress
     */
    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            storageManager.resetAllProgress();
            this.initializeNavigation();
            this.navigateTo('welcome-screen');
        }
    }

    /**
     * Navigate to a specific section
     * @param {string} sectionId - ID of the section to navigate to
     */
    navigateTo(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }
        
        // Update active state in navigation
        const navItems = document.querySelectorAll('#module-navigation li');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });
    }

    /**
     * Load a specific module
     * @param {number} moduleId - ID of the module to load
     */
    loadModule(moduleId) {
        // Find the module
        const module = MODULES.find(m => m.id === moduleId);
        if (!module) return;
        
        // Update current module
        this.currentModule = moduleId;
        
        // Update progress
        const progress = storageManager.getProgress();
        progress.currentModule = moduleId;
        storageManager.updateProgress(progress);
        
        // Load module content
        this.loadModuleContent(module);
        
        // Update module status - mark as accessed
        storageManager.updateModuleStatus(moduleId, {
            lastAccessed: new Date().toISOString()
        });
        
        // Update navigation
        const navItems = document.querySelectorAll('#module-navigation li');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.module == moduleId) {
                item.classList.add('active');
            }
        });
    }

    /**
     * Load module content from file
     * @param {Object} module - Module object
     */
    loadModuleContent(module) {
        const moduleContainer = document.getElementById('module-container');
        if (!moduleContainer) return;
        
        // Show module container
        this.navigateTo('module-container');
        
        // Fetch module content
        fetch(module.file)
            .then(response => response.text())
            .then(html => {
                // Insert module content
                moduleContainer.innerHTML = html;
                
                // Add navigation buttons
                this.addModuleNavButtons(moduleContainer, module);
                
                // Scroll to top
                window.scrollTo(0, 0);
            })
            .catch(error => {
                console.error('Error loading module content:', error);
                moduleContainer.innerHTML = `
                    <div class="module-header">
                        <h2>Error Loading Module</h2>
                    </div>
                    <p>There was an error loading the module content. Please try again later.</p>
                `;
            });
    }

    /**
     * Add navigation buttons to module content
     * @param {HTMLElement} container - Module container element
     * @param {Object} module - Module object
     */
    addModuleNavButtons(container, module) {
        // Create buttons container
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'action-buttons';
        
        // Previous module button
        if (module.id > 1) {
            const prevButton = document.createElement('button');
            prevButton.className = 'btn';
            prevButton.textContent = 'Previous Module';
            prevButton.addEventListener('click', () => this.loadModule(module.id - 1));
            buttonsDiv.appendChild(prevButton);
        }
        
        // Complete module button
        const completeButton = document.createElement('button');
        completeButton.className = 'btn btn-primary';
        completeButton.textContent = 'Complete & Continue to Quiz';
        completeButton.addEventListener('click', () => {
            // Mark module as completed
            storageManager.updateModuleStatus(module.id, {
                completed: true,
                lastAccessed: new Date().toISOString()
            });
            
            // Load quiz
            quizManager.loadQuiz(module.id);
            
            // Update navigation
            this.generateModuleNavigation();
            this.updateProgressDisplay();
        });
        buttonsDiv.appendChild(completeButton);
        
        // Next module button (only if quiz is completed)
        const moduleStatus = storageManager.getModuleStatus();
        const status = moduleStatus.find(m => m.id === module.id);
        
        if (status && status.quizCompleted && module.id < MODULES.length) {
            const nextButton = document.createElement('button');
            nextButton.className = 'btn btn-success';
            nextButton.textContent = 'Next Module';
            nextButton.addEventListener('click', () => this.loadModule(module.id + 1));
            buttonsDiv.appendChild(nextButton);
        }
        
        // Append buttons to container
        container.appendChild(buttonsDiv);
    }

    /**
     * Show the certificate
     */
    showCertificate() {
        // Only show certificate if all modules and quizzes are completed
        if (!storageManager.isTrainingCompleted()) {
            alert('You need to complete all modules and quizzes to view your certificate.');
            return;
        }
        
        // Navigate to certificate section
        this.navigateTo('certificate-container');
        
        // Generate certificate
        certificateManager.generateCertificate();
    }
}

// Create global navigation manager instance
let navigationManager;
