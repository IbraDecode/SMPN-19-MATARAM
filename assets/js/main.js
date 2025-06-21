// ===== SMPN 19 MATARAM - MAIN JAVASCRIPT =====

// Global Variables
let isLoading = true;
let currentTheme = localStorage.getItem('theme') || 'light';
let scrollPosition = 0;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set initial theme
    setTheme(currentTheme);
    
    // Initialize loading screen
    initializeLoadingScreen();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize components
    initializeComponents();
    
    // Initialize event listeners
    initializeEventListeners();
}

// ===== LOADING SCREEN =====
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    const progressStatus = document.querySelector('.progress-status');
    
    if (!loadingScreen) return;
    
    let progress = 0;
    const loadingMessages = [
        'Memuat aset...',
        'Menyiapkan konten...',
        'Mengoptimalkan tampilan...',
        'Hampir selesai...',
        'Selamat datang!'
    ];
    
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                isLoading = false;
                
                // Initialize AOS after loading
                if (typeof AOS !== 'undefined') {
                    AOS.init({
                        duration: 1000,
                        once: true,
                        offset: 100
                    });
                }
                
                // Start counter animations
                startCounterAnimations();
                
                // Initialize scroll animations
                initializeScrollAnimations();
                
            }, 500);
        }
        
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        if (progressPercentage) {
            progressPercentage.textContent = Math.round(progress) + '%';
        }
        
        if (progressStatus) {
            const messageIndex = Math.min(Math.floor(progress / 20), loadingMessages.length - 1);
            progressStatus.textContent = loadingMessages[messageIndex];
        }
        
    }, 100);
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navbar = document.getElementById('mainNav');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        scrollPosition = window.scrollY;
    });
    
    // Mobile menu toggle
    if (navbarToggler) {
        navbarToggler.addEventListener('click', () => {
            navbarToggler.classList.toggle('collapsed');
        });
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                    navbarToggler.classList.add('collapsed');
                }
                
                // Update active nav link
                updateActiveNavLink(this.getAttribute('href'));
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLinkOnScroll);
}

function updateActiveNavLink(targetHref) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`a[href="${targetHref}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== THEME TOGGLE =====
function initializeThemeToggle() {
    const themeToggleButtons = document.querySelectorAll('#themeToggle, #themeToggleDesktop');
    
    themeToggleButtons.forEach(button => {
        button.addEventListener('click', toggleTheme);
        updateThemeIcon(button);
    });
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    // Update all theme toggle buttons
    document.querySelectorAll('#themeToggle, #themeToggleDesktop').forEach(updateThemeIcon);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
}

function updateThemeIcon(button) {
    const icon = button.querySelector('i');
    if (icon) {
        icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Initialize theme toggle
    initializeThemeToggle();
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Floating animation for hero particles
    animateHeroParticles();
    
    // Text reveal animations
    initializeTextRevealAnimations();
}

function animateHeroParticles() {
    const particles = document.querySelectorAll('.particle-float');
    
    particles.forEach((particle, index) => {
        const delay = index * 2;
        particle.style.animationDelay = `${delay}s`;
        
        // Random position
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        particle.style.left = `${randomX}%`;
        particle.style.top = `${randomY}%`;
    });
}

function initializeTextRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.section-title, .section-subtitle, .hero-content > *').forEach(el => {
        observer.observe(el);
    });
}

// ===== COUNTER ANIMATIONS =====
function startCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const profilSection = document.getElementById('profil');
            if (profilSection) {
                profilSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ===== COMPONENTS =====
function initializeComponents() {
    // Initialize gallery
    initializeGallery();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize lightbox
    initializeLightbox();
    
    // Initialize tooltips and popovers
    initializeTooltips();
}

// ===== GALLERY =====
function initializeGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.classList.add('animate-fadeIn');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('animate-fadeIn');
                }
            });
        });
    });
}

// ===== LIGHTBOX =====
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    if (!lightbox) return;
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    // Make function global for onclick handlers
    window.openLightbox = function(button) {
        const galleryItem = button.closest('.gallery-item');
        const img = galleryItem.querySelector('img');
        const title = galleryItem.querySelector('h5')?.textContent || '';
        const description = galleryItem.querySelector('p')?.textContent || '';
        
        if (img && lightboxImage) {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            
            if (lightboxCaption) {
                lightboxCaption.innerHTML = `<h6>${title}</h6><p>${description}</p>`;
            }
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (validateContactForm(data)) {
            // Simulate form submission
            showFormSuccess();
            contactForm.reset();
        }
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateContactForm(data) {
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        showFieldError('name', 'Nama harus diisi minimal 2 karakter');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showFieldError('email', 'Email tidak valid');
        isValid = false;
    }
    
    // Subject validation
    if (!data.subject || data.subject.trim().length < 5) {
        showFieldError('subject', 'Subjek harus diisi minimal 5 karakter');
        isValid = false;
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        showFieldError('message', 'Pesan harus diisi minimal 10 karakter');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(field);
    
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                showFieldError(fieldName, 'Nama harus diisi minimal 2 karakter');
                return false;
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(fieldName, 'Email tidak valid');
                return false;
            }
            break;
        case 'subject':
            if (value.length < 5) {
                showFieldError(fieldName, 'Subjek harus diisi minimal 5 karakter');
                return false;
            }
            break;
        case 'message':
            if (value.length < 10) {
                showFieldError(fieldName, 'Pesan harus diisi minimal 10 karakter');
                return false;
            }
            break;
    }
    
    return true;
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    field.classList.add('is-invalid');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-danger mt-1';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function showFormSuccess() {
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success mt-3';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        Pesan Anda telah berhasil dikirim! Kami akan segera menghubungi Anda.
    `;
    
    const contactForm = document.getElementById('contactForm');
    contactForm.appendChild(successDiv);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// ===== TOOLTIPS =====
function initializeTooltips() {
    // Initialize Bootstrap tooltips if available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Window resize handler
    window.addEventListener('resize', handleWindowResize);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Mouse events for enhanced interactions
    initializeMouseEvents();
    
    // Touch events for mobile
    initializeTouchEvents();
}

function handleWindowResize() {
    // Update particle positions
    animateHeroParticles();
    
    // Recalculate scroll positions
    updateActiveNavLinkOnScroll();
}

function handleKeyboardNavigation(e) {
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
    
    // Escape key handlers
    if (e.key === 'Escape') {
        // Close mobile menu
        const navbarCollapse = document.querySelector('.navbar-collapse.show');
        if (navbarCollapse) {
            navbarCollapse.classList.remove('show');
            document.querySelector('.navbar-toggler').classList.add('collapsed');
        }
    }
}

function initializeMouseEvents() {
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Enhanced hover effects
    document.querySelectorAll('.btn, .card, .nav-link').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

function initializeTouchEvents() {
    // Touch feedback for mobile devices
    document.querySelectorAll('.btn, .card').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Optimize scroll events
window.addEventListener('scroll', throttle(() => {
    updateActiveNavLinkOnScroll();
}, 100));

// Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // You could send this to a logging service
});

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initializeAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only sr-only-focusable';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 10000;
        color: white;
        background: var(--primary-color);
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 4px;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const mainContent = document.querySelector('main') || document.querySelector('.hero-section');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('role', 'main');
    }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        toggleTheme,
        validateContactForm,
        startCounterAnimations
    };
}

