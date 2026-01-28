/**
 * MICHINORI - Advanced JavaScript
 * Opening animation, scroll-driven parallax, multi-direction animations
 */

(function() {
    'use strict';

    // ============================================
    // Configuration
    // ============================================
    const CONFIG = {
        openingDuration: 3200, // 3.2 seconds
        fadeOutDuration: 800,
        scrollThreshold: 0.12,
        parallaxEnabled: true,
    };

    // ============================================
    // Opening Animation
    // ============================================
    function initOpeningAnimation() {
        const opening = document.getElementById('opening');
        
        if (!opening) return;

        // Check if opening has been shown in this session
        const hasSeenOpening = sessionStorage.getItem('michinori-opening-seen');
        
        if (hasSeenOpening) {
            // Skip opening animation
            opening.style.display = 'none';
            document.body.classList.remove('main-hidden');
            initAfterOpening();
            return;
        }

        // Hide main content initially
        document.body.classList.add('main-hidden');

        // Show opening animation
        setTimeout(() => {
            opening.classList.add('fade-out');
            
            setTimeout(() => {
                opening.style.display = 'none';
                document.body.classList.remove('main-hidden');
                sessionStorage.setItem('michinori-opening-seen', 'true');
                initAfterOpening();
            }, CONFIG.fadeOutDuration);
        }, CONFIG.openingDuration);
    }

    // ============================================
    // Initialize after opening
    // ============================================
    function initAfterOpening() {
        initScrollAnimations();
        initScrollDrivenParallax();
        initParallaxHero();
    }

    // ============================================
    // Scroll Animations (Multi-direction)
    // ============================================
    function initScrollAnimations() {
        const animateCards = document.querySelectorAll('.animate-card');
        
        if (animateCards.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: CONFIG.scrollThreshold,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add visible class
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animateCards.forEach(card => {
            observer.observe(card);
        });
    }

    // ============================================
    // Scroll-Driven Parallax Text
    // スクロールに連動して動く演出（多様な動き）
    // ============================================
    function initScrollDrivenParallax() {
        const parallaxTexts = document.querySelectorAll('.parallax-text');
        
        if (parallaxTexts.length === 0) return;

        // セクションを取得（各パララックステキストのトリガーポイント）
        const sections = {
            services: document.querySelector('.services'),
            videoTrigger: document.querySelector('.video-trigger-section'),
            profile: document.querySelector('.profile-section'),
            cta: document.querySelector('.cta-section')
        };

        // 各パララックステキストの設定
        // direction: 'float-up' | 'bottom-to-top'
        // 2つのキャッチコピー（ふわっと浮かぶ動き）
        const parallaxConfig = [
            {
                element: parallaxTexts[0], // 共に歩む。共に変わる。
                triggerSection: sections.services,
                direction: 'float-up', // ふわっと浮かぶ
                startOffset: -0.2, // 早めに出る
                endOffset: 0.6 // 早めに消える（被らないように）
            },
            {
                element: parallaxTexts[1], // 変わりたいを、変われるに。
                triggerSection: sections.profile,
                direction: 'right-to-left', // 右から左へスライド
                startOffset: -0.3, // 早めに開始
                endOffset: 1.2 // 消えるまで長く
            }
        ];

        let ticking = false;
        const maxOpacity = 0.16; // さらに少し濃く

        function updateParallax() {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;

            parallaxConfig.forEach(config => {
                if (!config.element || !config.triggerSection) return;

                const sectionRect = config.triggerSection.getBoundingClientRect();
                const sectionTop = sectionRect.top + scrollY;
                const sectionHeight = config.triggerSection.offsetHeight;

                // セクション内でのスクロール進捗を計算
                const sectionStart = sectionTop - windowHeight * 0.6;
                const sectionEnd = sectionTop + sectionHeight;
                const scrollProgress = (scrollY - sectionStart) / (sectionEnd - sectionStart);

                // 開始・終了の範囲内かチェック
                if (scrollProgress >= config.startOffset && scrollProgress <= config.endOffset) {
                    // アクティブ状態
                    config.element.classList.add('active');

                    // 進捗を正規化（0-1の範囲に）
                    const normalizedProgress = (scrollProgress - config.startOffset) / (config.endOffset - config.startOffset);

                    // 動きの種類に応じて変換
                    if (config.direction === 'right-to-left') {
                        // 右から左へスライド
                        const translateX = 100 - (normalizedProgress * 110);
                        config.element.style.transform = `translateX(${translateX}%)`;
                    } else if (config.direction === 'float-up') {
                        // ふわっと浮かぶ（下から中央へ）
                        const translateY = 100 - (normalizedProgress * 100);
                        config.element.style.transform = `translate(-50%, ${translateY}px)`;
                    } else if (config.direction === 'bottom-to-top') {
                        // 下から上へ流れて止まる
                        const translateY = 150 - (normalizedProgress * 150);
                        config.element.style.transform = `translate(-50%, ${translateY}px)`;
                    }

                    // フェードイン/フェードアウト（消えるまでの時間を長く）
                    let opacity;
                    if (normalizedProgress < 0.1) {
                        // フェードイン（早めに表示）
                        opacity = normalizedProgress / 0.1;
                    } else if (normalizedProgress > 0.9) {
                        // フェードアウト（ゆっくり消える）
                        opacity = (1 - normalizedProgress) / 0.1;
                    } else {
                        // 長く表示し続ける
                        opacity = 1;
                    }
                    config.element.style.opacity = Math.max(0, Math.min(maxOpacity, opacity * maxOpacity));

                } else {
                    // 非アクティブ状態
                    config.element.classList.remove('active');
                    config.element.style.opacity = 0;
                }
            });

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });

        // 初期状態を設定
        updateParallax();
    }

    // ============================================
    // Parallax Effect on Hero (subtle)
    // ============================================
    function initParallaxHero() {
        const hero = document.querySelector('.hero');
        
        if (!hero) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const heroHeight = hero.offsetHeight;
                    
                    if (scrolled < heroHeight) {
                        const video = hero.querySelector('.hero-video');
                        if (video) {
                            video.style.transform = `translateY(${scrolled * 0.4}px) scale(1.1)`;
                        }
                        
                        // Fade out hero content
                        const heroContent = hero.querySelector('.hero-content');
                        if (heroContent) {
                            const opacity = 1 - (scrolled / heroHeight) * 1.5;
                            heroContent.style.opacity = Math.max(0, opacity);
                        }
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // Card Hover Effects (Enhanced)
    // ============================================
    function initCardHoverEffects() {
        const cards = document.querySelectorAll('.service-card');
        
        cards.forEach(card => {
            // Mouse move tracking for light effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);
            });
            
            // Reset on mouse leave
            card.addEventListener('mouseleave', () => {
                card.style.removeProperty('--mouse-x');
                card.style.removeProperty('--mouse-y');
            });
        });
    }

    // ============================================
    // Smooth Scroll Enhancement
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ============================================
    // Touch Feedback for Mobile
    // ============================================
    function initTouchFeedback() {
        const interactiveElements = document.querySelectorAll('.line-cta-btn, .service-card, .btn');
        
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
    // Reveal Animation on Load
    // ============================================
    function initRevealOnLoad() {
        // Add loaded class to body for CSS animations
        document.body.classList.add('loaded');
    }

    // ============================================
    // Initialize
    // ============================================
    function init() {
        initOpeningAnimation();
        initCardHoverEffects();
        initSmoothScroll();
        initTouchFeedback();
        initRevealOnLoad();
        
        console.log('// MICHINORI v2.1 - Scroll-Driven Parallax initialized');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
