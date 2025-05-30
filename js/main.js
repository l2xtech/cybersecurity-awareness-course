// Main JavaScript for Cybersecurity Awareness Training

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize managers
    quizManager = new QuizManager();
    certificateManager = new CertificateManager();
    navigationManager = new NavigationManager();
    
    // Log initialization
    console.log('Cybersecurity Awareness Training initialized');
});

// Helper function to load module content for testing
function loadModuleContent(moduleId) {
    if (navigationManager) {
        navigationManager.loadModule(moduleId);
    }
}

// Helper function to load quiz for testing
function loadQuiz(moduleId) {
    if (quizManager) {
        quizManager.loadQuiz(moduleId);
    }
}

// Helper function to show certificate for testing
function showCertificate() {
    if (navigationManager) {
        navigationManager.showCertificate();
    }
}

// Helper function to reset progress for testing
function resetProgress() {
    if (storageManager) {
        storageManager.resetAllProgress();
        navigationManager.initializeNavigation();
        navigationManager.navigateTo('welcome-screen');
    }
}
