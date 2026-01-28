/**
 * MICHINORI - AIX伴走パートナー
 * セルフブランディングサイト JavaScript
 */

(function() {
    'use strict';

    // ============================================
    // Configuration
    // ============================================
    const CONFIG = {
        openingDuration: 4500, // Opening animation duration in ms
        fadeOutDuration: 800,
        scrollThreshold: 0.2,
    };

    // ============================================
    // DOM Elements
    // ============================================
    const elements = {
        opening: document.getElementById('opening'),
        mainContent: document.getElementById('main-content'),
        bookmarkBtn: document.getElementById('bookmark-btn'),
        bookmarkModal: document.getElementById('bookmark-modal'),
        serviceCards: document.querySelectorAll('.service-card'),
        profileCard: document.querySelector('.profile-card'),
    };

    // ============================================
    // Opening Animation
    // ============================================
    function initOpeningAnimation() {
        // Check if opening has been shown before in this session
        const hasSeenOpening = sessionStorage.getItem('michinori-opening-seen');
        
        if (hasSeenOpening) {
            // Skip opening animation
            elements.opening.style.display = 'none';
            elements.mainContent.classList.remove('hidden');
            initScrollAnimations();
            return;
        }

        // Show opening animation
        setTimeout(() => {
            elements.opening.classList.add('fade-out');
            
            setTimeout(() => {
                elements.opening.style.display = 'none';
                elements.mainContent.classList.remove('hidden');
                sessionStorage.setItem('michinori-opening-seen', 'true');
                initScrollAnimations();
            }, CONFIG.fadeOutDuration);
        }, CONFIG.openingDuration);
    }

    // ============================================
    // Service Cards Accordion
    // ============================================
    function initServiceCards() {
        elements.serviceCards.forEach((card, index) => {
            const header = card.querySelector('.card-header');
            
            // Open first card by default
            if (index === 0) {
                card.classList.add('active');
            }

            header.addEventListener('click', () => {
                const isActive = card.classList.contains('active');
                
                // Close all cards
                elements.serviceCards.forEach(c => c.classList.remove('active'));
                
                // Open clicked card if it wasn't active
                if (!isActive) {
                    card.classList.add('active');
                }
            });
        });
    }

    // ============================================
    // Scroll Animations
    // ============================================
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: CONFIG.scrollThreshold,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe service cards
        elements.serviceCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        // Observe profile card
        if (elements.profileCard) {
            observer.observe(elements.profileCard);
        }
    }

    // ============================================
    // Bookmark Modal
    // ============================================
    function initBookmarkModal() {
        if (!elements.bookmarkBtn || !elements.bookmarkModal) return;

        const modal = elements.bookmarkModal;
        const overlay = modal.querySelector('.modal-overlay');
        const closeBtn = modal.querySelector('.modal-close');
        const guideCloseBtn = modal.querySelector('.guide-close-btn');

        function openModal() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        elements.bookmarkBtn.addEventListener('click', openModal);
        overlay.addEventListener('click', closeModal);
        closeBtn.addEventListener('click', closeModal);
        guideCloseBtn.addEventListener('click', closeModal);

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // ============================================
    // Smooth Scroll
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
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

    // ============================================
    // Touch Feedback
    // ============================================
    function initTouchFeedback() {
        const interactiveElements = document.querySelectorAll('.contact-btn, .card-header');
        
        interactiveElements.forEach(el => {
            el.addEventListener('touchstart', () => {
                el.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            el.addEventListener('touchend', () => {
                el.style.transform = '';
            }, { passive: true });
        });
    }

    // ============================================
    // vCard Download (Optional)
    // ============================================
    function generateVCard() {
        const contact = {
            firstName: '崇',
            lastName: '佐々木',
            firstNameEn: 'Takashi',
            lastNameEn: 'Sasaki',
            organization: 'MICHINORI',
            title: 'AIX伴走パートナー',
            email: 'tsailink0611@gmail.com',
            url: 'https://line.me/ti/p/NWGjZAM_AY',
            note: '変わる勇気に、伴走する。',
            location: '仙台'
        };

        const vCard = `BEGIN:VCARD
VERSION:3.0
N;CHARSET=UTF-8:${contact.lastName};${contact.firstName};;;
FN;CHARSET=UTF-8:${contact.lastName} ${contact.firstName}
ORG;CHARSET=UTF-8:${contact.organization}
TITLE;CHARSET=UTF-8:${contact.title}
EMAIL;TYPE=WORK:${contact.email}
URL:${contact.url}
NOTE;CHARSET=UTF-8:${contact.note}
ADR;TYPE=WORK;CHARSET=UTF-8:;;${contact.location};;;;
END:VCARD`;

        return vCard;
    }

    function downloadVCard() {
        const vCard = generateVCard();
        const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sasaki-takashi-michinori.vcf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // ============================================
    // Initialization
    // ============================================
    function init() {
        initOpeningAnimation();
        initServiceCards();
        initBookmarkModal();
        initSmoothScroll();
        initTouchFeedback();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
