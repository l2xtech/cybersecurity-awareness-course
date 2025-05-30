// Storage management for Cybersecurity Awareness Training

/**
 * Storage utility for managing user data and progress
 */
class StorageManager {
    /**
     * Initialize storage
     */
    constructor() {
        this.checkAndInitializeStorage();
    }

    /**
     * Check if storage is initialized and set up default values if not
     */
    checkAndInitializeStorage() {
        // Initialize user info if not exists
        if (!localStorage.getItem(STORAGE_KEYS.userInfo)) {
            localStorage.setItem(STORAGE_KEYS.userInfo, JSON.stringify({
                name: "Guest User",
                email: "",
                company: ""
            }));
        }

        // Initialize progress if not exists
        if (!localStorage.getItem(STORAGE_KEYS.progress)) {
            localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify({
                currentModule: 0,
                overallProgress: 0,
                completedModules: 0,
                completedQuizzes: 0,
                certificateGenerated: false
            }));
        }

        // Initialize module status if not exists
        if (!localStorage.getItem(STORAGE_KEYS.moduleStatus)) {
            const moduleStatus = MODULES.map(module => ({
                id: module.id,
                completed: false,
                quizCompleted: false,
                lastAccessed: null
            }));
            localStorage.setItem(STORAGE_KEYS.moduleStatus, JSON.stringify(moduleStatus));
        }

        // Initialize quiz results if not exists
        if (!localStorage.getItem(STORAGE_KEYS.quizResults)) {
            const quizResults = MODULES.map(module => ({
                moduleId: module.id,
                attempts: 0,
                lastScore: 0,
                passed: false,
                lastAttemptDate: null
            }));
            localStorage.setItem(STORAGE_KEYS.quizResults, JSON.stringify(quizResults));
        }
    }

    /**
     * Get user information
     * @returns {Object} User information
     */
    getUserInfo() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.userInfo));
    }

    /**
     * Save user information
     * @param {Object} userInfo - User information object
     */
    saveUserInfo(userInfo) {
        localStorage.setItem(STORAGE_KEYS.userInfo, JSON.stringify(userInfo));
    }

    /**
     * Get overall progress
     * @returns {Object} Progress information
     */
    getProgress() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.progress));
    }

    /**
     * Update overall progress
     * @param {Object} progress - Progress information
     */
    updateProgress(progress) {
        localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
    }

    /**
     * Get module status
     * @returns {Array} Array of module status objects
     */
    getModuleStatus() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.moduleStatus));
    }

    /**
     * Update module status
     * @param {number} moduleId - ID of the module to update
     * @param {Object} updates - Properties to update
     */
    updateModuleStatus(moduleId, updates) {
        const moduleStatus = this.getModuleStatus();
        const moduleIndex = moduleStatus.findIndex(m => m.id === moduleId);
        
        if (moduleIndex !== -1) {
            moduleStatus[moduleIndex] = { ...moduleStatus[moduleIndex], ...updates };
            localStorage.setItem(STORAGE_KEYS.moduleStatus, JSON.stringify(moduleStatus));
            
            // Update overall progress
            this.recalculateOverallProgress();
        }
    }

    /**
     * Get quiz results
     * @returns {Array} Array of quiz result objects
     */
    getQuizResults() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.quizResults));
    }

    /**
     * Update quiz results
     * @param {number} moduleId - ID of the module quiz
     * @param {Object} results - Quiz results to update
     */
    updateQuizResults(moduleId, results) {
        const quizResults = this.getQuizResults();
        const quizIndex = quizResults.findIndex(q => q.moduleId === moduleId);
        
        if (quizIndex !== -1) {
            quizResults[quizIndex] = { ...quizResults[quizIndex], ...results };
            localStorage.setItem(STORAGE_KEYS.quizResults, JSON.stringify(quizResults));
            
            // If quiz is passed, update module status
            if (results.passed) {
                this.updateModuleStatus(moduleId, { quizCompleted: true });
            }
        }
    }

    /**
     * Recalculate overall progress based on module and quiz completion
     */
    recalculateOverallProgress() {
        const moduleStatus = this.getModuleStatus();
        const totalModules = MODULES.length;
        
        const completedModules = moduleStatus.filter(m => m.completed).length;
        const completedQuizzes = moduleStatus.filter(m => m.quizCompleted).length;
        
        // Calculate overall progress (modules and quizzes have equal weight)
        const overallProgress = Math.round(((completedModules + completedQuizzes) / (totalModules * 2)) * 100);
        
        // Check if all modules and quizzes are completed
        const allCompleted = completedModules === totalModules && completedQuizzes === totalModules;
        
        // Update progress
        const progress = this.getProgress();
        const updatedProgress = {
            ...progress,
            completedModules,
            completedQuizzes,
            overallProgress,
            certificateGenerated: allCompleted ? true : progress.certificateGenerated
        };
        
        this.updateProgress(updatedProgress);
        
        return updatedProgress;
    }

    /**
     * Reset all progress and user data
     */
    resetAllProgress() {
        // Keep user info but reset everything else
        const userInfo = this.getUserInfo();
        
        // Clear storage
        localStorage.removeItem(STORAGE_KEYS.progress);
        localStorage.removeItem(STORAGE_KEYS.moduleStatus);
        localStorage.removeItem(STORAGE_KEYS.quizResults);
        
        // Re-initialize with defaults
        this.checkAndInitializeStorage();
        
        // Restore user info
        this.saveUserInfo(userInfo);
    }

    /**
     * Check if all modules and quizzes are completed
     * @returns {boolean} True if all completed, false otherwise
     */
    isTrainingCompleted() {
        const progress = this.getProgress();
        return progress.completedModules === MODULES.length && 
               progress.completedQuizzes === MODULES.length;
    }
}

// Create global storage manager instance
const storageManager = new StorageManager();
