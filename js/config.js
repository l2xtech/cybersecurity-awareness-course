// Configuration for the Cybersecurity Awareness Training

// Module configuration
const MODULES = [
    {
        id: 1,
        title: "Introduction to Information Security",
        description: "Learn the fundamentals of information security and why it matters.",
        file: "modules/module1.html",
        quizFile: "quizzes/quiz1.json",
        completed: false,
        quizCompleted: false
    },
    {
        id: 2,
        title: "Common Cyber Threats and Attacks",
        description: "Understand the most common cyber threats and how they work.",
        file: "modules/module2.html",
        quizFile: "quizzes/quiz2.json",
        completed: false,
        quizCompleted: false
    },
    {
        id: 3,
        title: "Password Security and Authentication",
        description: "Learn best practices for creating and managing secure passwords.",
        file: "modules/module3.html",
        quizFile: "quizzes/quiz3.json",
        completed: false,
        quizCompleted: false
    },
    {
        id: 4,
        title: "Email and Communication Security",
        description: "Discover how to identify and avoid email-based threats.",
        file: "modules/module4.html",
        quizFile: "quizzes/quiz4.json",
        completed: false,
        quizCompleted: false
    },
    {
        id: 5,
        title: "Safe Internet Browsing",
        description: "Learn how to browse the internet safely and securely.",
        file: "modules/module5.html",
        quizFile: "quizzes/quiz5.json",
        completed: false,
        quizCompleted: false
    },
    {
        id: 6,
        title: "Mobile Device and Remote Work Security",
        description: "Understand the security challenges of mobile devices and remote work.",
        file: "modules/module6.html",
        quizFile: "quizzes/quiz6.json",
        completed: false,
        quizCompleted: false
    },
    {
        id: 7,
        title: "Data Protection and Privacy",
        description: "Learn how to protect sensitive data and maintain privacy.",
        file: "modules/module7.html",
        quizFile: "quizzes/quiz7.json",
        completed: false,
        quizCompleted: false
    },
    {
        id: 8,
        title: "Document and File Security",
        description: "Discover best practices for securing documents and files.",
        file: "modules/module8.html",
        quizFile: "quizzes/quiz8.json",
        completed: false,
        quizCompleted: false
    },
    {
        id: 9,
        title: "Company Security Policies",
        description: "Understand the importance of security policies and how to follow them.",
        file: "modules/module9.html",
        quizFile: "quizzes/quiz9.json",
        completed: false,
        quizCompleted: false
    },
    {
        id: 10,
        title: "Incident Reporting and Response",
        description: "Learn how to recognize and report security incidents.",
        file: "modules/module10.html",
        quizFile: "quizzes/quiz10.json",
        completed: false,
        quizCompleted: false
    }
];

// Quiz configuration
const QUIZ_CONFIG = {
    passingScore: 80, // Percentage required to pass a quiz
    questionsPerQuiz: 5, // Number of questions per quiz
    showFeedback: true, // Whether to show feedback after each question
    allowRetry: true // Whether to allow retrying failed quizzes
};

// Certificate configuration
const CERTIFICATE_CONFIG = {
    title: "Certificate of Completion",
    subtitle: "Cybersecurity Awareness Training",
    text: "has successfully completed all modules of the Cybersecurity Awareness Training program, demonstrating knowledge and understanding of essential cybersecurity principles and practices.",
    issuer: "Information Security Department",
    signatoryTitle: "Chief Information Security Officer"
};

// Storage keys
const STORAGE_KEYS = {
    userInfo: "cybersecurity_user_info",
    progress: "cybersecurity_progress",
    moduleStatus: "cybersecurity_module_status",
    quizResults: "cybersecurity_quiz_results"
};
