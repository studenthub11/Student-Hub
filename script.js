document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Send analytics event for theme toggle
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_toggle', {
                'event_category': 'ui_interaction',
                'event_label': newTheme
            });
        }
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-moon';
        } else {
            themeIcon.className = 'fas fa-sun';
        }
    }

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        
        // Update menu icon
        const icon = menuToggle.querySelector('i');
        if (mainNav.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    // Close mobile menu when a link is clicked
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });
    });

    // Testimonial Slider
    let currentSlideIndex = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');

    function showSlide(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current testimonial and activate corresponding dot
        if (testimonials[index]) {
            testimonials[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }

    // Auto-advance testimonials every 5 seconds
    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % testimonials.length;
        showSlide(currentSlideIndex);
    }

    // Start auto-advance
    let slideInterval = setInterval(nextSlide, 5000);

    // Manual slide control
    window.currentSlide = function(index) {
        currentSlideIndex = index - 1; // Convert to 0-based index
        showSlide(currentSlideIndex);
        
        // Reset auto-advance timer
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
        
        // Send analytics event for manual slide change
        if (typeof gtag !== 'undefined') {
            gtag('event', 'testimonial_slide', {
                'event_category': 'ui_interaction',
                'event_label': 'manual_slide_' + index
            });
        }
    };

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Send analytics event for internal navigation
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'internal_navigation', {
                        'event_category': 'navigation',
                        'event_label': targetId
                    });
                }
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.service-card, .pricing-card, .point');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Add scroll transition to header
    header.style.transition = 'transform 0.3s ease';

    // Form validation and enhancement (if forms are added later)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Basic form validation can be added here
            console.log('Form submitted');
            
            // Send analytics event for form submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'conversion',
                    'event_label': form.id || 'unknown_form'
                });
            }
        });
    });

    // Lazy loading for images (if more images are added)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Performance monitoring
    window.addEventListener('load', function() {
        // Send page load time to analytics
        if (typeof gtag !== 'undefined' && 'performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            gtag('event', 'page_load_time', {
                'event_category': 'performance',
                'value': Math.round(loadTime)
            });
        }
    });

    // Error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        
        // Send error to analytics (optional)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'javascript_error', {
                'event_category': 'error',
                'event_label': e.error.message
            });
        }
    });

    // Console welcome message
    console.log('%c🎓 The Student Hub', 'color: #4A90E2; font-size: 24px; font-weight: bold;');
    console.log('%cشريكك الأكاديمي الموثوق نحو التميز', 'color: #F5A623; font-size: 16px;');
    console.log('Website developed with ❤️ for students');
});

