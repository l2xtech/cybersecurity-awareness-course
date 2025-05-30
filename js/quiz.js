// Quiz management for Cybersecurity Awareness Training

/**
 * Quiz manager for handling quiz loading, interaction, and scoring
 */
class QuizManager {
    /**
     * Initialize quiz manager
     */
    constructor() {
        this.currentQuiz = null;
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.quizScore = 0;
    }

    /**
     * Load a quiz for a specific module
     * @param {number} moduleId - ID of the module
     */
    loadQuiz(moduleId) {
        // Find the module
        const module = MODULES.find(m => m.id === moduleId);
        if (!module) return;
        
        this.currentQuiz = moduleId;
        
        // Show quiz container
        const quizContainer = document.getElementById('quiz-container');
        if (!quizContainer) return;
        
        // Navigate to quiz section
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        quizContainer.classList.add('active');
        
        // Fetch quiz questions
        fetch(module.quizFile)
            .then(response => response.json())
            .then(data => {
                this.currentQuestions = data.questions;
                this.currentQuestionIndex = 0;
                this.userAnswers = new Array(this.currentQuestions.length).fill(null);
                this.quizScore = 0;
                
                // Display first question
                this.displayCurrentQuestion();
            })
            .catch(error => {
                console.error('Error loading quiz:', error);
                quizContainer.innerHTML = `
                    <div class="quiz-header">
                        <h2>Error Loading Quiz</h2>
                    </div>
                    <p>There was an error loading the quiz. Please try again later.</p>
                    <div class="action-buttons">
                        <button class="btn" onclick="navigationManager.loadModule(${moduleId})">Return to Module</button>
                    </div>
                `;
            });
    }

    /**
     * Display the current question
     */
    displayCurrentQuestion() {
        const quizContainer = document.getElementById('quiz-container');
        if (!quizContainer) return;
        
        const question = this.currentQuestions[this.currentQuestionIndex];
        if (!question) return;
        
        // Create quiz header
        const moduleTitle = MODULES.find(m => m.id === this.currentQuiz)?.title || 'Quiz';
        
        // Build quiz HTML
        let quizHTML = `
            <div class="quiz-header">
                <h2>Module ${this.currentQuiz} Quiz: ${moduleTitle}</h2>
                <p>Question ${this.currentQuestionIndex + 1} of ${this.currentQuestions.length}</p>
            </div>
            <div class="quiz-question">
                <h3>${question.question}</h3>
                <ul class="quiz-options">
        `;
        
        // Add options
        question.options.forEach((option, index) => {
            const isSelected = this.userAnswers[this.currentQuestionIndex] === index;
            quizHTML += `
                <li class="quiz-option ${isSelected ? 'selected' : ''}" data-index="${index}">
                    ${option}
                </li>
            `;
        });
        
        quizHTML += `
                </ul>
                <div class="quiz-feedback"></div>
            </div>
            <div class="action-buttons">
        `;
        
        // Add navigation buttons
        if (this.currentQuestionIndex > 0) {
            quizHTML += `<button class="btn" id="prev-question-btn">Previous Question</button>`;
        }
        
        quizHTML += `<button class="btn btn-primary" id="next-question-btn">Next Question</button>`;
        
        quizHTML += `</div>`;
        
        // Set quiz container content
        quizContainer.innerHTML = quizHTML;
        
        // Add event listeners
        const options = quizContainer.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                this.selectOption(parseInt(option.dataset.index));
            });
        });
        
        const prevButton = document.getElementById('prev-question-btn');
        if (prevButton) {
            prevButton.addEventListener('click', () => this.previousQuestion());
        }
        
        const nextButton = document.getElementById('next-question-btn');
        if (nextButton) {
            nextButton.addEventListener('click', () => this.nextQuestion());
        }
    }

    /**
     * Select an option for the current question
     * @param {number} optionIndex - Index of the selected option
     */
    selectOption(optionIndex) {
        // Update user answer
        this.userAnswers[this.currentQuestionIndex] = optionIndex;
        
        // Update UI
        const options = document.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.classList.remove('selected');
            if (parseInt(option.dataset.index) === optionIndex) {
                option.classList.add('selected');
            }
        });
        
        // If showing feedback is enabled, show it
        if (QUIZ_CONFIG.showFeedback) {
            this.showFeedback(optionIndex);
        }
    }

    /**
     * Show feedback for the selected option
     * @param {number} optionIndex - Index of the selected option
     */
    showFeedback(optionIndex) {
        const question = this.currentQuestions[this.currentQuestionIndex];
        const feedbackElement = document.querySelector('.quiz-feedback');
        
        if (!feedbackElement || !question) return;
        
        const isCorrect = optionIndex === question.correctAnswer;
        
        // Update option classes
        const options = document.querySelectorAll('.quiz-option');
        options.forEach(option => {
            const index = parseInt(option.dataset.index);
            if (index === optionIndex) {
                option.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
        });
        
        // Show feedback
        feedbackElement.innerHTML = isCorrect 
            ? `<p>Correct! ${question.feedback}</p>`
            : `<p>Incorrect. ${question.feedback}</p>`;
        
        feedbackElement.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedbackElement.style.display = 'block';
    }

    /**
     * Go to the previous question
     */
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayCurrentQuestion();
        }
    }

    /**
     * Go to the next question or finish the quiz
     */
    nextQuestion() {
        // If no option selected, prompt user
        if (this.userAnswers[this.currentQuestionIndex] === null) {
            alert('Please select an answer before proceeding.');
            return;
        }
        
        // If last question, finish quiz
        if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
            this.finishQuiz();
        } else {
            // Otherwise go to next question
            this.currentQuestionIndex++;
            this.displayCurrentQuestion();
        }
    }

    /**
     * Calculate quiz score and display results
     */
    finishQuiz() {
        // Calculate score
        let correctAnswers = 0;
        
        this.currentQuestions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correctAnswer) {
                correctAnswers++;
            }
        });
        
        this.quizScore = Math.round((correctAnswers / this.currentQuestions.length) * 100);
        
        // Check if passed
        const passed = this.quizScore >= QUIZ_CONFIG.passingScore;
        
        // Update quiz results
        storageManager.updateQuizResults(this.currentQuiz, {
            attempts: storageManager.getQuizResults().find(q => q.moduleId === this.currentQuiz).attempts + 1,
            lastScore: this.quizScore,
            passed: passed,
            lastAttemptDate: new Date().toISOString()
        });
        
        // Display results
        const quizContainer = document.getElementById('quiz-container');
        if (!quizContainer) return;
        
        const moduleTitle = MODULES.find(m => m.id === this.currentQuiz)?.title || 'Quiz';
        
        let resultsHTML = `
            <div class="quiz-header">
                <h2>Module ${this.currentQuiz} Quiz Results: ${moduleTitle}</h2>
            </div>
            <div class="quiz-results">
                <h3>Your Score: ${this.quizScore}%</h3>
                <p>${correctAnswers} out of ${this.currentQuestions.length} questions answered correctly.</p>
                <div class="result-message ${passed ? 'correct' : 'incorrect'}">
                    <p>${passed 
                        ? 'Congratulations! You have passed the quiz.' 
                        : `You did not pass the quiz. You need ${QUIZ_CONFIG.passingScore}% to pass.`}</p>
                </div>
            </div>
            <div class="action-buttons">
        `;
        
        // Add buttons based on result
        if (passed) {
            // If this is the last module and all quizzes are completed, show certificate button
            const allCompleted = storageManager.isTrainingCompleted();
            
            if (this.currentQuiz < MODULES.length) {
                resultsHTML += `<button class="btn btn-primary" id="next-module-btn">Next Module</button>`;
            }
            
            if (allCompleted) {
                resultsHTML += `<button class="btn btn-success" id="view-certificate-btn">View Certificate</button>`;
            }
        } else if (QUIZ_CONFIG.allowRetry) {
            resultsHTML += `<button class="btn btn-warning" id="retry-quiz-btn">Retry Quiz</button>`;
        }
        
        resultsHTML += `<button class="btn" id="return-module-btn">Return to Module</button>`;
        resultsHTML += `</div>`;
        
        // Set quiz container content
        quizContainer.innerHTML = resultsHTML;
        
        // Add event listeners
        const nextModuleBtn = document.getElementById('next-module-btn');
        if (nextModuleBtn) {
            nextModuleBtn.addEventListener('click', () => {
                navigationManager.loadModule(this.currentQuiz + 1);
            });
        }
        
        const viewCertificateBtn = document.getElementById('view-certificate-btn');
        if (viewCertificateBtn) {
            viewCertificateBtn.addEventListener('click', () => {
                navigationManager.showCertificate();
            });
        }
        
        const retryQuizBtn = document.getElementById('retry-quiz-btn');
        if (retryQuizBtn) {
            retryQuizBtn.addEventListener('click', () => {
                this.loadQuiz(this.currentQuiz);
            });
        }
        
        const returnModuleBtn = document.getElementById('return-module-btn');
        if (returnModuleBtn) {
            returnModuleBtn.addEventListener('click', () => {
                navigationManager.loadModule(this.currentQuiz);
            });
        }
        
        // Update navigation and progress
        navigationManager.generateModuleNavigation();
        navigationManager.updateProgressDisplay();
    }
}

// Create global quiz manager instance
let quizManager;
