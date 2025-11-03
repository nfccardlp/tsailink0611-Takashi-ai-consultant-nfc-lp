/**
 * NFC Landing Page - JavaScript
 * vCard generation and download functionality
 */

// Contact Information
const contactInfo = {
    firstName: '崇',
    lastName: '佐々木',
    firstNameEN: 'Takashi',
    lastNameEN: 'Sasaki',
    title: 'AI-Driven Development Consultant',
    company: 'Freelance',
    email: 'tsailink0611@gmail.com',
    phone: '', // Hidden per requirements
    url: 'https://line.me/ti/p/NWGjZAM_AY',
    location: '仙台',
    note: '東北の中小企業向けAI導入コンサルタント。AIワークフロー構築、業務自動化、AI駆動開発サポートを提供。Tech Stack: N8N | Dify | Claude Code | Cursor'
};

/**
 * Generate vCard 3.0 format string
 * @returns {string} vCard formatted string
 */
function generateVCard() {
    const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${contactInfo.lastName};${contactInfo.firstName};;;`,
        `FN:${contactInfo.lastName} ${contactInfo.firstName} (${contactInfo.firstNameEN} ${contactInfo.lastNameEN})`,
        `TITLE:${contactInfo.title}`,
        `ORG:${contactInfo.company}`,
        `EMAIL;TYPE=INTERNET:${contactInfo.email}`,
        contactInfo.phone ? `TEL;TYPE=CELL:${contactInfo.phone}` : '',
        `URL:${contactInfo.url}`,
        `ADR;TYPE=WORK:;;;;;;${contactInfo.location}`,
        `NOTE:${contactInfo.note}`,
        'END:VCARD'
    ].filter(line => line !== '').join('\r\n');

    return vcard;
}

/**
 * Download vCard file
 * @param {string} vcardData - vCard formatted string
 * @param {string} filename - Name of the file to download
 */
function downloadVCard(vcardData, filename = 'takashi-sasaki.vcf') {
    // Create a Blob from the vCard data
    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

/**
 * Handle vCard button click
 */
function handleVCardDownload() {
    try {
        const vcardData = generateVCard();
        downloadVCard(vcardData);

        // Show success feedback
        showFeedback('連絡先を保存しました！', 'success');
    } catch (error) {
        console.error('Error generating vCard:', error);
        showFeedback('エラーが発生しました。もう一度お試しください。', 'error');
    }
}

/**
 * Bookmark Guide Modal Functions
 */
function openBookmarkGuide() {
    const modal = document.getElementById('bookmark-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeBookmarkGuide() {
    const modal = document.getElementById('bookmark-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Show feedback message
 * @param {string} message - Message to display
 * @param {string} type - Type of message ('success' or 'error')
 */
function showFeedback(message, type = 'success') {
    // Check if feedback element already exists
    let feedback = document.querySelector('.feedback-message');

    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'feedback-message';
        document.body.appendChild(feedback);
    }

    // Set message and style
    feedback.textContent = message;
    feedback.className = `feedback-message feedback-${type} show`;

    // Remove after 3 seconds
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 3000);
}

/**
 * Add smooth scroll behavior for future internal links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Add animation on scroll (for future enhancements)
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });
}

/**
 * Video Modal Functions
 */
function openVideoModal() {
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('modal-video');

    if (modal && video) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll

        // Play video after modal animation
        setTimeout(() => {
            video.play().catch(err => {
                console.log('Autoplay prevented:', err);
            });
        }, 400);
    }
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('modal-video');

    if (modal && video) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll

        // Pause and reset video
        video.pause();
        video.currentTime = 0;
    }
}

/**
 * Initialize application
 */
function init() {
    // Add vCard download handler (legacy support)
    const vcardBtn = document.getElementById('vcard-btn');
    if (vcardBtn) {
        vcardBtn.addEventListener('click', handleVCardDownload);
    }

    // Add bookmark guide handler
    const bookmarkBtn = document.getElementById('bookmark-btn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', openBookmarkGuide);
    }

    // Add video modal handlers
    const videoTriggerBtn = document.getElementById('video-trigger-btn');
    const videoModalCloseBtn = document.querySelector('.modal-close');
    const videoModalOverlay = document.querySelector('#video-modal .modal-overlay');
    const videoModal = document.getElementById('video-modal');

    if (videoTriggerBtn) {
        videoTriggerBtn.addEventListener('click', openVideoModal);
    }

    if (videoModalCloseBtn) {
        videoModalCloseBtn.addEventListener('click', closeVideoModal);
    }

    if (videoModalOverlay) {
        videoModalOverlay.addEventListener('click', closeVideoModal);
    }

    // Add bookmark modal handlers
    const bookmarkModalCloseBtn = document.querySelector('.bookmark-modal-close');
    const bookmarkModalOverlay = document.querySelector('#bookmark-modal .modal-overlay');
    const guideCloseBtn = document.querySelector('.guide-close-btn');
    const bookmarkModal = document.getElementById('bookmark-modal');

    if (bookmarkModalCloseBtn) {
        bookmarkModalCloseBtn.addEventListener('click', closeBookmarkGuide);
    }

    if (bookmarkModalOverlay) {
        bookmarkModalOverlay.addEventListener('click', closeBookmarkGuide);
    }

    if (guideCloseBtn) {
        guideCloseBtn.addEventListener('click', closeBookmarkGuide);
    }

    // Close modals on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (videoModal && videoModal.classList.contains('active')) {
                closeVideoModal();
            }
            if (bookmarkModal && bookmarkModal.classList.contains('active')) {
                closeBookmarkGuide();
            }
        }
    });

    // Initialize smooth scroll
    initSmoothScroll();

    // Initialize scroll animations (optional)
    // initScrollAnimations();

    console.log('// NFC Landing Page initialized');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Add CSS for feedback message dynamically
const style = document.createElement('style');
style.textContent = `
    .feedback-message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-family: var(--font-sans, sans-serif);
        font-size: 0.9375rem;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 1000;
    }

    .feedback-message.show {
        transform: translateX(0);
    }

    .feedback-success {
        background: #000;
        color: #fff;
    }

    .feedback-error {
        background: #dc2626;
        color: #fff;
    }

    @media (max-width: 768px) {
        .feedback-message {
            left: 20px;
            right: 20px;
            transform: translateY(-100px);
        }

        .feedback-message.show {
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
