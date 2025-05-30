// Certificate generation for Cybersecurity Awareness Training

/**
 * Certificate manager for generating completion certificates
 */
class CertificateManager {
    /**
     * Initialize certificate manager
     */
    constructor() {
        // Nothing to initialize
    }

    /**
     * Generate certificate based on user information
     */
    generateCertificate() {
        // Get user info
        const userInfo = storageManager.getUserInfo();
        
        // Get certificate container
        const certificateContainer = document.getElementById('certificate-container');
        if (!certificateContainer) return;
        
        // Get current date
        const currentDate = new Date();
        const dateString = currentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Create certificate HTML
        let certificateHTML = `
            <div class="certificate-container">
                <div class="certificate">
                    <div class="certificate-header">
                        <h1 class="certificate-title">${CERTIFICATE_CONFIG.title}</h1>
                        <h2 class="certificate-subtitle">${CERTIFICATE_CONFIG.subtitle}</h2>
                    </div>
                    <div class="certificate-body">
                        <p>This certifies that</p>
                        <h2 class="certificate-name">${userInfo.name || 'Participant'}</h2>
                        <p class="certificate-text">${CERTIFICATE_CONFIG.text}</p>
                        <p class="certificate-date">Completed on ${dateString}</p>
                    </div>
                    <div class="certificate-footer">
                        <div class="certificate-signature">
                            <div class="certificate-signature-line"></div>
                            <p>${CERTIFICATE_CONFIG.issuer}</p>
                            <p>${CERTIFICATE_CONFIG.signatoryTitle}</p>
                        </div>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-primary" id="download-certificate-btn">Download Certificate</button>
                    <button class="btn" id="return-home-btn">Return to Course</button>
                </div>
            </div>
        `;
        
        // Set certificate container content
        certificateContainer.innerHTML = certificateHTML;
        
        // Add event listeners
        const downloadBtn = document.getElementById('download-certificate-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadCertificate());
        }
        
        const returnHomeBtn = document.getElementById('return-home-btn');
        if (returnHomeBtn) {
            returnHomeBtn.addEventListener('click', () => {
                navigationManager.navigateTo('welcome-screen');
            });
        }
        
        // Update progress to mark certificate as generated
        const progress = storageManager.getProgress();
        if (!progress.certificateGenerated) {
            progress.certificateGenerated = true;
            storageManager.updateProgress(progress);
        }
    }

    /**
     * Download certificate as PDF or image
     */
    downloadCertificate() {
        // Get user info for filename
        const userInfo = storageManager.getUserInfo();
        const userName = userInfo.name || 'Participant';
        const safeUserName = userName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        // Get certificate element
        const certificateElement = document.querySelector('.certificate');
        if (!certificateElement) return;
        
        // Use html2canvas to capture certificate as image
        // Note: In a real implementation, we would use html2canvas or similar library
        // Since we can't include external libraries in this example, we'll just show an alert
        alert(`Certificate would be downloaded as "cybersecurity_certificate_${safeUserName}.pdf" in a real implementation.`);
        
        // In a real implementation with html2canvas:
        /*
        html2canvas(certificateElement).then(canvas => {
            // Convert to PDF using jsPDF
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 297, 210);
            pdf.save(`cybersecurity_certificate_${safeUserName}.pdf`);
        });
        */
    }
}

// Create global certificate manager instance
let certificateManager;
