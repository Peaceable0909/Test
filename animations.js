// Animation Controller
class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoading();
        this.setupCursor();
        this.initScrollAnimations();
        this.initIntersectionObserver();
        document.addEventListener('DOMContentLoaded', () => this.onDOMLoaded());
    }

    setupLoading() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.querySelector('.loading-screen').style.opacity = '0';
                setTimeout(() => {
                    document.querySelector('.loading-screen').style.display = 'none';
                }, 500);
            }, 1000);
        });
    }

    setupCursor() {
        if (window.innerWidth > 768) {
            const cursor = document.querySelector('.cursor');
            
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });

            const hoverElements = document.querySelectorAll('a, button, .product-card, .feature-card');
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.style.transform = 'scale(1.5)';
                    cursor.style.borderColor = '#FFD700';
                });
                
                el.addEventListener('mouseleave', () => {
                    cursor.style.transform = 'scale(1)';
                    cursor.style.borderColor = '#FF6B00';
                });
            });
        }
    }

    onDOMLoaded() {
        this.initHeroAnimations();
        this.initProductHoverEffects();
        this.initSmoothScroll();
    }

    initHeroAnimations() {
        // Parallax effect for floating products
        document.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-product');
            
            parallaxElements.forEach((el, index) => {
                const speed = (index + 1) * 0.5;
                el.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
            });
        });
    }

    initProductHoverEffects() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    initSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger animation based on element type
                    if (entry.target.classList.contains('product-card')) {
                        this.animateProductCard(entry.target);
                    } else if (entry.target.classList.contains('feature-card')) {
                        this.animateFeatureCard(entry.target);
                    } else if (entry.target.classList.contains('preview-box')) {
                        this.animatePreviewBox(entry.target);
                    }
                    
                    // Add visible class for CSS animations
                    entry.target.classList.add('is-visible');
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.product-card, .feature-card, .preview-box').forEach(el => {
            observer.observe(el);
        });
    }

    animateProductCard(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.9)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, Math.random() * 200);
    }

    animateFeatureCard(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        }, 100);
    }

    animatePreviewBox(box) {
        box.style.opacity = '0';
        box.style.transform = 'scale(0.8)';
        box.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            box.style.opacity = '1';
            box.style.transform = 'scale(1)';
        }, 200);
    }

    initScrollAnimations() {
        // Section reveal animations
        const sections = document.querySelectorAll('.products-section, .custom-section, .features-section');
        
        const revealSection = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        };

        const sectionObserver = new IntersectionObserver(revealSection, {
            threshold: 0.15
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // Custom background text parallax
        const customBg = document.querySelector('.custom-bg-text');
        if (customBg) {
            document.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const customSection = document.querySelector('.custom-section');
                const sectionTop = customSection.offsetTop;
                const sectionHeight = customSection.offsetHeight;
                
                if (scrolled > sectionTop - window.innerHeight && scrolled < sectionTop + sectionHeight) {
                    const relativeScroll = scrolled - sectionTop + window.innerHeight;
                    const parallax = -relativeScroll * 0.2;
                    customBg.style.transform = `translate(${parallax}px, ${parallax}px)`;
                }
            });
        }
    }
}

// Initialize animations
new AnimationController();

// Additional scroll-triggered animations
let ticking = false;

function updateAnimations() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Hero title parallax
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const titleParallax = scrolled * 0.5;
        heroTitle.style.transform = `translateY(${titleParallax}px)`;
    }
    
    // Scroll indicator fade
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator && scrolled > 100) {
        scrollIndicator.style.opacity = '0';
    }
    
    ticking = false