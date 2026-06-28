/* ============================================
   APP.JS - MC Lions 26.27 NST Application
   SPA Router + Animations + Interactions
   ============================================ */

(function () {
    'use strict';

    // --- DOM References ---
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const pageContainer = document.getElementById('page-container');

    // --- State ---
    let currentPage = 'home';

    // ============================================
    // ROUTER
    // ============================================
    function getPageFromHash() {
        const hash = window.location.hash.replace('#', '') || 'home';
        return hash;
    }

    function showPage(pageName) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(p => {
            p.style.display = 'none';
            p.style.animation = 'none';
        });

        // Show target page
        const target = document.getElementById('page-' + pageName);
        if (target) {
            target.style.display = 'block';
            // Force reflow for animation restart
            void target.offsetWidth;
            target.style.animation = 'pageIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both';
            currentPage = pageName;
        } else {
            // Fallback to home
            const home = document.getElementById('page-home');
            if (home) {
                home.style.display = 'block';
                void home.offsetWidth;
                home.style.animation = 'pageIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both';
                currentPage = 'home';
            }
        }

        // Update nav active states
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === currentPage) {
                link.classList.add('active');
            }
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Close mobile nav
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');

        // Initialize animations for visible elements
        initScrollAnimations();
    }

    // Listen to hash changes
    window.addEventListener('hashchange', () => {
        showPage(getPageFromHash());
    });

    // Initial page load
    showPage(getPageFromHash());

    // Handle all internal navigation clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-page], button[data-page]');
        if (link) {
            e.preventDefault();
            const page = link.dataset.page;
            window.location.hash = page;
        }
    });

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    }, { passive: true });

    // ============================================
    // MOBILE NAV TOGGLE
    // ============================================
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Mobile dropdown toggle
    document.querySelectorAll('.nav-dropdown > .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                link.parentElement.classList.toggle('open');
            }
        });
    });

    // Close mobile nav on link click
    document.querySelectorAll('.dropdown-menu .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // ============================================
    // HERO PARTICLES
    // ============================================
    function createParticles() {
        const container = document.getElementById('hero-particles');
        if (!container) return;

        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (6 + Math.random() * 6) + 's';
            particle.style.width = (1 + Math.random() * 2) + 'px';
            particle.style.height = particle.style.width;
            container.appendChild(particle);
        }
    }
    createParticles();

    // ============================================
    // SCROLL ANIMATIONS (IntersectionObserver)
    // ============================================
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.position-card, .role-card, .role-info-card, .contact-card, .form-card, .cta-card, .message-grid');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation for elegant cascading effect
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -30px 0px'
        });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(32px)';
            el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(el);
        });
    }

    // ============================================
    // SMOOTH PARALLAX ON HERO (subtle)
    // ============================================
    window.addEventListener('scroll', () => {
        if (currentPage !== 'home') return;
        const hero = document.querySelector('.hero-content');
        if (!hero) return;
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            hero.style.transform = `translateY(${scrollY * 0.15}px)`;
            hero.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
        }
    }, { passive: true });

})();
