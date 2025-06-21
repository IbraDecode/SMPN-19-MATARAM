// ===== SMPN 19 MATARAM - ADVANCED ANIMATIONS =====

// Advanced Animation Controller
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }
    
    init() {
        this.setupIntersectionObservers();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupLoadingAnimations();
    }
    
    // ===== LOADING ANIMATIONS =====
    setupLoadingAnimations() {
        this.createParticleSystem();
        this.createTextMorphing();
        this.createLogoAnimations();
    }
    
    createParticleSystem() {
        const particleContainer = document.querySelector('.loading-bg');
        if (!particleContainer) return;
        
        // Create additional particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'dynamic-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.6 + 0.2});
                border-radius: 50%;
                pointer-events: none;
                animation: particleFloat ${Math.random() * 3 + 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
            `;
            particleContainer.appendChild(particle);
        }
    }
    
    createTextMorphing() {
        const letters = document.querySelectorAll('.loading-text .letter');
        
        letters.forEach((letter, index) => {
            letter.addEventListener('animationend', (e) => {
                if (e.animationName === 'letterReveal') {
                    letter.style.animation += ', textNeon 2s ease-in-out infinite';
                }
            });
        });
    }
    
    createLogoAnimations() {
        const logo = document.querySelector('.loading-logo .logo-img');
        if (!logo) return;
        
        // Add pulsing glow effect
        logo.addEventListener('animationiteration', () => {
            if (Math.random() > 0.7) {
                logo.style.filter = 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.8))';
                setTimeout(() => {
                    logo.style.filter = 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))';
                }, 200);
            }
        });
    }
    
    // ===== SCROLL ANIMATIONS =====
    setupScrollAnimations() {
        this.createScrollTriggers();
        this.createParallaxEffects();
        this.createRevealAnimations();
    }
    
    createScrollTriggers() {
        const scrollTriggers = [
            { selector: '.hero-stats', animation: 'slideInUp', delay: 0 },
            { selector: '.profile-highlights', animation: 'fadeInLeft', delay: 200 },
            { selector: '.news-card', animation: 'flipInY', delay: 100 },
            { selector: '.achievement-card', animation: 'bounceIn', delay: 150 },
            { selector: '.gallery-item', animation: 'zoomIn', delay: 50 }
        ];
        
        scrollTriggers.forEach(trigger => {
            const elements = document.querySelectorAll(trigger.selector);
            
            elements.forEach((element, index) => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                element.classList.add(`animate-${trigger.animation}`);
                            }, index * trigger.delay);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                
                observer.observe(element);
            });
        });
    }
    
    createParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero-bg, .statistics-section');
        
        window.addEventListener('scroll', () => {
            if (this.isReducedMotion) return;
            
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.2);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    createRevealAnimations() {
        const revealElements = document.querySelectorAll('.section-title, .section-subtitle');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }
    
    // ===== HOVER ANIMATIONS =====
    setupHoverAnimations() {
        this.createButtonAnimations();
        this.createCardAnimations();
        this.createImageAnimations();
    }
    
    createButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (this.isReducedMotion) return;
                
                button.style.animation = 'buttonPulse 0.6s ease';
                
                // Create ripple effect
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: buttonRipple 0.6s linear;
                    pointer-events: none;
                `;
                
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (rect.width / 2 - size / 2) + 'px';
                ripple.style.top = (rect.height / 2 - size / 2) + 'px';
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
            
            button.addEventListener('animationend', () => {
                button.style.animation = '';
            });
        });
    }
    
    createCardAnimations() {
        const cards = document.querySelectorAll('.news-card, .achievement-card, .stat-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (this.isReducedMotion) return;
                
                card.style.animation = 'hoverLift 0.3s ease forwards';
                
                // Add glow effect
                card.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.2)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.animation = '';
                card.style.boxShadow = '';
            });
        });
    }
    
    createImageAnimations() {
        const images = document.querySelectorAll('.gallery-item img, .news-image img');
        
        images.forEach(image => {
            image.addEventListener('mouseenter', () => {
                if (this.isReducedMotion) return;
                
                image.style.transform = 'scale(1.1) rotate(2deg)';
                image.style.filter = 'brightness(1.1) contrast(1.1)';
            });
            
            image.addEventListener('mouseleave', () => {
                image.style.transform = '';
                image.style.filter = '';
            });
        });
    }
    
    // ===== INTERSECTION OBSERVERS =====
    setupIntersectionObservers() {
        this.createCounterObserver();
        this.createProgressObserver();
        this.createTypewriterObserver();
    }
    
    createCounterObserver() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
                element.style.animation = 'pulse 0.5s ease';
            }
        };
        
        updateCounter();
    }
    
    createProgressObserver() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'progressFill 2s ease-out forwards';
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    }
    
    createTypewriterObserver() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        const typewriterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.typewriterEffect(entry.target);
                    typewriterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        typewriterElements.forEach(element => {
            typewriterObserver.observe(element);
        });
    }
    
    typewriterEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid currentColor';
        element.style.animation = 'blinkCursor 1s infinite';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(typeInterval);
                setTimeout(() => {
                    element.style.borderRight = '';
                    element.style.animation = '';
                }, 1000);
            }
        }, 50);
    }
    
    // ===== UTILITY METHODS =====
    addAnimation(name, element, options = {}) {
        if (this.isReducedMotion) return;
        
        const animation = {
            element,
            name,
            duration: options.duration || 1000,
            delay: options.delay || 0,
            easing: options.easing || 'ease',
            iterations: options.iterations || 1
        };
        
        this.animations.set(name, animation);
        this.playAnimation(name);
    }
    
    playAnimation(name) {
        const animation = this.animations.get(name);
        if (!animation) return;
        
        const { element, name: animName, duration, delay, easing, iterations } = animation;
        
        setTimeout(() => {
            element.style.animation = `${animName} ${duration}ms ${easing} ${iterations}`;
        }, delay);
    }
    
    removeAnimation(name) {
        const animation = this.animations.get(name);
        if (animation) {
            animation.element.style.animation = '';
            this.animations.delete(name);
        }
    }
    
    pauseAllAnimations() {
        document.querySelectorAll('*').forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }
    
    resumeAllAnimations() {
        document.querySelectorAll('*').forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
}

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.particles = [];
        this.options = {
            count: options.count || 50,
            speed: options.speed || 1,
            size: options.size || 2,
            color: options.color || 'rgba(255, 255, 255, 0.5)',
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.createParticles();
        this.animate();
    }
    
    createParticles() {
        for (let i = 0; i < this.options.count; i++) {
            const particle = {
                x: Math.random() * this.container.offsetWidth,
                y: Math.random() * this.container.offsetHeight,
                vx: (Math.random() - 0.5) * this.options.speed,
                vy: (Math.random() - 0.5) * this.options.speed,
                size: Math.random() * this.options.size + 1,
                opacity: Math.random() * 0.5 + 0.2,
                element: this.createElement()
            };
            
            this.particles.push(particle);
            this.container.appendChild(particle.element);
        }
    }
    
    createElement() {
        const element = document.createElement('div');
        element.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: ${this.options.color};
            pointer-events: none;
            z-index: 1;
        `;
        return element;
    }
    
    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x <= 0 || particle.x >= this.container.offsetWidth) {
                particle.vx *= -1;
            }
            if (particle.y <= 0 || particle.y >= this.container.offsetHeight) {
                particle.vy *= -1;
            }
            
            // Update element
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
            particle.element.style.width = particle.size + 'px';
            particle.element.style.height = particle.size + 'px';
            particle.element.style.opacity = particle.opacity;
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        this.particles.forEach(particle => {
            particle.element.remove();
        });
        this.particles = [];
    }
}

// ===== MORPHING TEXT EFFECT =====
class MorphingText {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.currentIndex = 0;
        this.options = {
            duration: options.duration || 3000,
            morphDuration: options.morphDuration || 500,
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.element.textContent = this.texts[0];
        this.startMorphing();
    }
    
    startMorphing() {
        setInterval(() => {
            this.morphToNext();
        }, this.options.duration);
    }
    
    morphToNext() {
        const currentText = this.texts[this.currentIndex];
        const nextIndex = (this.currentIndex + 1) % this.texts.length;
        const nextText = this.texts[nextIndex];
        
        this.morphText(currentText, nextText);
        this.currentIndex = nextIndex;
    }
    
    morphText(from, to) {
        const maxLength = Math.max(from.length, to.length);
        let progress = 0;
        
        const morphInterval = setInterval(() => {
            let morphed = '';
            
            for (let i = 0; i < maxLength; i++) {
                const fromChar = from[i] || '';
                const toChar = to[i] || '';
                
                if (progress > i / maxLength) {
                    morphed += toChar;
                } else {
                    morphed += fromChar;
                }
            }
            
            this.element.textContent = morphed;
            progress += 0.1;
            
            if (progress >= 1) {
                clearInterval(morphInterval);
                this.element.textContent = to;
            }
        }, this.options.morphDuration / 10);
    }
}

// ===== GLITCH EFFECT =====
class GlitchEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            intensity: options.intensity || 5,
            duration: options.duration || 200,
            interval: options.interval || 3000,
            ...options
        };
        
        this.init();
    }
    
    init() {
        setInterval(() => {
            this.glitch();
        }, this.options.interval);
    }
    
    glitch() {
        const originalText = this.element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        let glitchedText = '';
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() < 0.1) {
                glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitchedText += originalText[i];
            }
        }
        
        this.element.textContent = glitchedText;
        this.element.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.element.style.textShadow = `${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(255,0,0,0.5)`;
        
        setTimeout(() => {
            this.element.textContent = originalText;
            this.element.style.color = '';
            this.element.style.textShadow = '';
        }, this.options.duration);
    }
}

// ===== INITIALIZE ADVANCED ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animation controller
    window.animationController = new AnimationController();
    
    // Initialize particle system for hero section
    const heroParticles = document.querySelector('.hero-particles');
    if (heroParticles) {
        window.heroParticleSystem = new ParticleSystem(heroParticles, {
            count: 30,
            speed: 0.5,
            size: 3,
            color: 'rgba(255, 255, 255, 0.3)'
        });
    }
    
    // Initialize morphing text for hero title
    const heroTitle = document.querySelector('.hero-title .text-gradient');
    if (heroTitle) {
        window.morphingTitle = new MorphingText(heroTitle, [
            'SMPN 19 Mataram',
            'Sekolah Unggul',
            'Pendidikan Berkualitas',
            'Generasi Berkarakter'
        ], {
            duration: 4000,
            morphDuration: 800
        });
    }
    
    // Initialize glitch effect for loading text
    const loadingLetters = document.querySelectorAll('.loading-text .letter.number');
    loadingLetters.forEach(letter => {
        new GlitchEffect(letter, {
            intensity: 3,
            duration: 100,
            interval: 5000
        });
    });
});

// ===== EXPORT FOR GLOBAL ACCESS =====
window.AnimationController = AnimationController;
window.ParticleSystem = ParticleSystem;
window.MorphingText = MorphingText;
window.GlitchEffect = GlitchEffect;

