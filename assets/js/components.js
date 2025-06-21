// ===== SMPN 19 MATARAM - INTERACTIVE COMPONENTS =====

// ===== ADVANCED GALLERY COMPONENT =====
class AdvancedGallery {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            autoPlay: options.autoPlay || false,
            autoPlayInterval: options.autoPlayInterval || 5000,
            showThumbnails: options.showThumbnails || true,
            enableZoom: options.enableZoom || true,
            enableFullscreen: options.enableFullscreen || true,
            ...options
        };
        
        this.currentIndex = 0;
        this.items = [];
        this.isPlaying = false;
        
        this.init();
    }
    
    init() {
        this.setupGallery();
        this.setupControls();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
        
        if (this.options.autoPlay) {
            this.startAutoPlay();
        }
    }
    
    setupGallery() {
        this.items = Array.from(this.container.querySelectorAll('.gallery-item'));
        
        this.items.forEach((item, index) => {
            item.addEventListener('click', () => this.openLightbox(index));
            
            // Add lazy loading
            const img = item.querySelector('img');
            if (img && img.dataset.src) {
                this.lazyLoadImage(img);
            }
        });
    }
    
    setupControls() {
        // Create lightbox
        this.createLightbox();
        
        // Create navigation controls
        this.createNavigationControls();
        
        // Create thumbnail strip
        if (this.options.showThumbnails) {
            this.createThumbnailStrip();
        }
    }
    
    createLightbox() {
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'advanced-lightbox';
        this.lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-container">
                <div class="lightbox-header">
                    <div class="lightbox-title"></div>
                    <div class="lightbox-controls">
                        <button class="lightbox-btn zoom-btn" title="Zoom">
                            <i class="fas fa-search-plus"></i>
                        </button>
                        <button class="lightbox-btn fullscreen-btn" title="Fullscreen">
                            <i class="fas fa-expand"></i>
                        </button>
                        <button class="lightbox-btn close-btn" title="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="lightbox-content">
                    <button class="lightbox-nav prev-btn">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="lightbox-image-container">
                        <img class="lightbox-image" src="" alt="">
                        <div class="lightbox-loading">
                            <div class="loading-spinner"></div>
                        </div>
                    </div>
                    <button class="lightbox-nav next-btn">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="lightbox-footer">
                    <div class="lightbox-caption"></div>
                    <div class="lightbox-counter">
                        <span class="current-index">1</span> / <span class="total-items">${this.items.length}</span>
                    </div>
                </div>
                <div class="lightbox-thumbnails"></div>
            </div>
        `;
        
        document.body.appendChild(this.lightbox);
        this.setupLightboxEvents();
    }
    
    setupLightboxEvents() {
        const overlay = this.lightbox.querySelector('.lightbox-overlay');
        const closeBtn = this.lightbox.querySelector('.close-btn');
        const prevBtn = this.lightbox.querySelector('.prev-btn');
        const nextBtn = this.lightbox.querySelector('.next-btn');
        const zoomBtn = this.lightbox.querySelector('.zoom-btn');
        const fullscreenBtn = this.lightbox.querySelector('.fullscreen-btn');
        
        overlay.addEventListener('click', () => this.closeLightbox());
        closeBtn.addEventListener('click', () => this.closeLightbox());
        prevBtn.addEventListener('click', () => this.previousImage());
        nextBtn.addEventListener('click', () => this.nextImage());
        zoomBtn.addEventListener('click', () => this.toggleZoom());
        fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }
    
    openLightbox(index) {
        this.currentIndex = index;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.updateLightboxContent();
        this.updateThumbnails();
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset zoom
        const image = this.lightbox.querySelector('.lightbox-image');
        image.style.transform = '';
    }
    
    updateLightboxContent() {
        const item = this.items[this.currentIndex];
        const img = item.querySelector('img');
        const title = item.querySelector('h5')?.textContent || '';
        const caption = item.querySelector('p')?.textContent || '';
        
        const lightboxImage = this.lightbox.querySelector('.lightbox-image');
        const lightboxTitle = this.lightbox.querySelector('.lightbox-title');
        const lightboxCaption = this.lightbox.querySelector('.lightbox-caption');
        const currentIndexSpan = this.lightbox.querySelector('.current-index');
        
        // Show loading
        const loading = this.lightbox.querySelector('.lightbox-loading');
        loading.style.display = 'flex';
        
        lightboxImage.onload = () => {
            loading.style.display = 'none';
        };
        
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxTitle.textContent = title;
        lightboxCaption.textContent = caption;
        currentIndexSpan.textContent = this.currentIndex + 1;
    }
    
    previousImage() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.updateLightboxContent();
        this.updateThumbnails();
    }
    
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.updateLightboxContent();
        this.updateThumbnails();
    }
    
    toggleZoom() {
        const image = this.lightbox.querySelector('.lightbox-image');
        const isZoomed = image.style.transform.includes('scale');
        
        if (isZoomed) {
            image.style.transform = '';
            image.style.cursor = 'zoom-in';
        } else {
            image.style.transform = 'scale(2)';
            image.style.cursor = 'zoom-out';
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.lightbox.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    createThumbnailStrip() {
        const thumbnailContainer = this.lightbox.querySelector('.lightbox-thumbnails');
        
        this.items.forEach((item, index) => {
            const img = item.querySelector('img');
            const thumbnail = document.createElement('div');
            thumbnail.className = 'lightbox-thumbnail';
            thumbnail.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
            
            thumbnail.addEventListener('click', () => {
                this.currentIndex = index;
                this.updateLightboxContent();
                this.updateThumbnails();
            });
            
            thumbnailContainer.appendChild(thumbnail);
        });
    }
    
    updateThumbnails() {
        const thumbnails = this.lightbox.querySelectorAll('.lightbox-thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
                case 'Escape':
                    this.closeLightbox();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleZoom();
                    break;
            }
        });
    }
    
    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;
        
        this.lightbox.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.lightbox.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextImage();
                } else {
                    this.previousImage();
                }
            }
        });
    }
    
    lazyLoadImage(img) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        observer.observe(img);
    }
    
    startAutoPlay() {
        this.isPlaying = true;
        this.autoPlayInterval = setInterval(() => {
            this.nextImage();
        }, this.options.autoPlayInterval);
    }
    
    stopAutoPlay() {
        this.isPlaying = false;
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// ===== INTERACTIVE TIMELINE COMPONENT =====
class InteractiveTimeline {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            autoProgress: options.autoProgress || false,
            progressInterval: options.progressInterval || 3000,
            ...options
        };
        
        this.currentStep = 0;
        this.steps = [];
        
        this.init();
    }
    
    init() {
        this.setupTimeline();
        this.setupNavigation();
        
        if (this.options.autoProgress) {
            this.startAutoProgress();
        }
    }
    
    setupTimeline() {
        this.steps = Array.from(this.container.querySelectorAll('.timeline-item'));
        
        this.steps.forEach((step, index) => {
            step.addEventListener('click', () => this.goToStep(index));
            
            // Add step numbers
            const stepNumber = document.createElement('div');
            stepNumber.className = 'timeline-step-number';
            stepNumber.textContent = index + 1;
            step.insertBefore(stepNumber, step.firstChild);
        });
        
        this.updateTimeline();
    }
    
    setupNavigation() {
        const navContainer = document.createElement('div');
        navContainer.className = 'timeline-navigation';
        navContainer.innerHTML = `
            <button class="timeline-nav-btn prev-btn" disabled>
                <i class="fas fa-chevron-left"></i> Previous
            </button>
            <div class="timeline-progress">
                <div class="timeline-progress-bar"></div>
            </div>
            <button class="timeline-nav-btn next-btn">
                Next <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        this.container.appendChild(navContainer);
        
        const prevBtn = navContainer.querySelector('.prev-btn');
        const nextBtn = navContainer.querySelector('.next-btn');
        
        prevBtn.addEventListener('click', () => this.previousStep());
        nextBtn.addEventListener('click', () => this.nextStep());
    }
    
    goToStep(index) {
        this.currentStep = Math.max(0, Math.min(index, this.steps.length - 1));
        this.updateTimeline();
    }
    
    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.updateTimeline();
        }
    }
    
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateTimeline();
        }
    }
    
    updateTimeline() {
        this.steps.forEach((step, index) => {
            step.classList.toggle('active', index === this.currentStep);
            step.classList.toggle('completed', index < this.currentStep);
        });
        
        // Update navigation
        const prevBtn = this.container.querySelector('.prev-btn');
        const nextBtn = this.container.querySelector('.next-btn');
        const progressBar = this.container.querySelector('.timeline-progress-bar');
        
        prevBtn.disabled = this.currentStep === 0;
        nextBtn.disabled = this.currentStep === this.steps.length - 1;
        
        const progress = ((this.currentStep + 1) / this.steps.length) * 100;
        progressBar.style.width = progress + '%';
    }
    
    startAutoProgress() {
        this.autoProgressInterval = setInterval(() => {
            if (this.currentStep < this.steps.length - 1) {
                this.nextStep();
            } else {
                this.currentStep = 0;
                this.updateTimeline();
            }
        }, this.options.progressInterval);
    }
    
    stopAutoProgress() {
        if (this.autoProgressInterval) {
            clearInterval(this.autoProgressInterval);
        }
    }
}

// ===== ADVANCED SEARCH COMPONENT =====
class AdvancedSearch {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            searchDelay: options.searchDelay || 300,
            minSearchLength: options.minSearchLength || 2,
            highlightResults: options.highlightResults || true,
            showSuggestions: options.showSuggestions || true,
            ...options
        };
        
        this.searchInput = null;
        this.searchResults = null;
        this.searchTimeout = null;
        this.currentQuery = '';
        
        this.init();
    }
    
    init() {
        this.createSearchInterface();
        this.setupEventListeners();
    }
    
    createSearchInterface() {
        this.container.innerHTML = `
            <div class="advanced-search">
                <div class="search-input-container">
                    <input type="text" class="search-input" placeholder="Cari konten website...">
                    <button class="search-btn">
                        <i class="fas fa-search"></i>
                    </button>
                    <div class="search-suggestions"></div>
                </div>
                <div class="search-filters">
                    <button class="filter-btn active" data-filter="all">Semua</button>
                    <button class="filter-btn" data-filter="berita">Berita</button>
                    <button class="filter-btn" data-filter="galeri">Galeri</button>
                    <button class="filter-btn" data-filter="prestasi">Prestasi</button>
                </div>
                <div class="search-results"></div>
            </div>
        `;
        
        this.searchInput = this.container.querySelector('.search-input');
        this.searchResults = this.container.querySelector('.search-results');
    }
    
    setupEventListeners() {
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(this.searchInput.value);
            }
        });
        
        // Filter buttons
        const filterBtns = this.container.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.performSearch(this.searchInput.value, btn.dataset.filter);
            });
        });
    }
    
    handleSearch(query) {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, this.options.searchDelay);
    }
    
    performSearch(query, filter = 'all') {
        this.currentQuery = query.toLowerCase();
        
        if (this.currentQuery.length < this.options.minSearchLength) {
            this.searchResults.innerHTML = '';
            return;
        }
        
        const results = this.searchContent(this.currentQuery, filter);
        this.displayResults(results);
        
        if (this.options.showSuggestions) {
            this.showSuggestions(this.currentQuery);
        }
    }
    
    searchContent(query, filter) {
        const searchableElements = document.querySelectorAll(`
            .news-card,
            .gallery-item,
            .achievement-card,
            .profile-content,
            .ppdb-content
        `);
        
        const results = [];
        
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            const title = element.querySelector('h1, h2, h3, h4, h5, h6')?.textContent || '';
            const category = this.getElementCategory(element);
            
            if (filter !== 'all' && category !== filter) return;
            
            if (text.includes(query) || title.toLowerCase().includes(query)) {
                results.push({
                    element,
                    title,
                    text: text.substring(0, 200) + '...',
                    category,
                    relevance: this.calculateRelevance(text, title.toLowerCase(), query)
                });
            }
        });
        
        return results.sort((a, b) => b.relevance - a.relevance);
    }
    
    getElementCategory(element) {
        if (element.classList.contains('news-card')) return 'berita';
        if (element.classList.contains('gallery-item')) return 'galeri';
        if (element.classList.contains('achievement-card')) return 'prestasi';
        return 'lainnya';
    }
    
    calculateRelevance(text, title, query) {
        let relevance = 0;
        
        // Title matches are more relevant
        if (title.includes(query)) relevance += 10;
        
        // Count occurrences in text
        const matches = (text.match(new RegExp(query, 'g')) || []).length;
        relevance += matches;
        
        // Shorter texts with matches are more relevant
        relevance += (100 - text.length / 10);
        
        return relevance;
    }
    
    displayResults(results) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Tidak ada hasil ditemukan untuk "${this.currentQuery}"</p>
                </div>
            `;
            return;
        }
        
        const resultsHTML = results.map(result => `
            <div class="search-result-item" data-category="${result.category}">
                <div class="result-category">${result.category}</div>
                <h6 class="result-title">${this.highlightText(result.title, this.currentQuery)}</h6>
                <p class="result-text">${this.highlightText(result.text, this.currentQuery)}</p>
                <button class="result-link" onclick="this.scrollToElement('${result.element.id || result.element.className}')">
                    Lihat Detail
                </button>
            </div>
        `).join('');
        
        this.searchResults.innerHTML = `
            <div class="search-results-header">
                <h6>Ditemukan ${results.length} hasil</h6>
            </div>
            <div class="search-results-list">
                ${resultsHTML}
            </div>
        `;
    }
    
    highlightText(text, query) {
        if (!this.options.highlightResults) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    showSuggestions(query) {
        const suggestions = this.generateSuggestions(query);
        const suggestionsContainer = this.container.querySelector('.search-suggestions');
        
        if (suggestions.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        const suggestionsHTML = suggestions.map(suggestion => `
            <div class="search-suggestion" onclick="this.selectSuggestion('${suggestion}')">
                ${suggestion}
            </div>
        `).join('');
        
        suggestionsContainer.innerHTML = suggestionsHTML;
        suggestionsContainer.style.display = 'block';
    }
    
    generateSuggestions(query) {
        const commonTerms = [
            'berita', 'galeri', 'prestasi', 'profil', 'kontak',
            'ppdb', 'pendaftaran', 'fasilitas', 'guru', 'siswa',
            'kegiatan', 'pembelajaran', 'ekstrakurikuler'
        ];
        
        return commonTerms.filter(term => 
            term.includes(query) && term !== query
        ).slice(0, 5);
    }
    
    selectSuggestion(suggestion) {
        this.searchInput.value = suggestion;
        this.performSearch(suggestion);
        this.container.querySelector('.search-suggestions').style.display = 'none';
    }
    
    scrollToElement(identifier) {
        const element = document.getElementById(identifier) || document.querySelector(`.${identifier}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlight-result');
            setTimeout(() => {
                element.classList.remove('highlight-result');
            }, 3000);
        }
    }
}

// ===== NOTIFICATION SYSTEM =====
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }
    
    init() {
        this.createContainer();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    }
    
    show(message, type = 'info', duration = 5000) {
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.notifications.push(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            this.remove(notification);
        }, duration);
        
        return notification;
    }
    
    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 16px 20px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-left: 4px solid var(--${type === 'success' ? 'success' : type === 'error' ? 'danger' : type === 'warning' ? 'warning' : 'primary'}-color);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            pointer-events: auto;
            max-width: 300px;
        `;
        
        const icon = this.getIcon(type);
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="${icon}" style="color: var(--${type === 'success' ? 'success' : type === 'error' ? 'danger' : type === 'warning' ? 'warning' : 'primary'}-color);"></i>
                <span style="flex: 1; font-size: 14px; line-height: 1.4;">${message}</span>
                <button class="notification-close" style="background: none; border: none; font-size: 16px; cursor: pointer; color: #999;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.remove(notification));
        
        return notification;
    }
    
    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    remove(notification) {
        notification.classList.remove('show');
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }
    
    success(message, duration) {
        return this.show(message, 'success', duration);
    }
    
    error(message, duration) {
        return this.show(message, 'error', duration);
    }
    
    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }
    
    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// ===== INITIALIZE COMPONENTS =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize advanced gallery
    const galleryContainer = document.querySelector('.gallery-section');
    if (galleryContainer) {
        window.advancedGallery = new AdvancedGallery(galleryContainer, {
            autoPlay: false,
            showThumbnails: true,
            enableZoom: true,
            enableFullscreen: true
        });
    }
    
    // Initialize interactive timeline
    const timelineContainer = document.querySelector('.timeline');
    if (timelineContainer) {
        window.interactiveTimeline = new InteractiveTimeline(timelineContainer, {
            autoProgress: false,
            progressInterval: 4000
        });
    }
    
    // Initialize notification system
    window.notifications = new NotificationSystem();
    
    // Initialize search (if search container exists)
    const searchContainer = document.querySelector('#search-container');
    if (searchContainer) {
        window.advancedSearch = new AdvancedSearch(searchContainer, {
            searchDelay: 300,
            minSearchLength: 2,
            highlightResults: true,
            showSuggestions: true
        });
    }
    
    // Show welcome notification
    setTimeout(() => {
        window.notifications.success('Selamat datang di website SMPN 19 Mataram!', 3000);
    }, 2000);
});

// ===== EXPORT FOR GLOBAL ACCESS =====
window.AdvancedGallery = AdvancedGallery;
window.InteractiveTimeline = InteractiveTimeline;
window.AdvancedSearch = AdvancedSearch;
window.NotificationSystem = NotificationSystem;

