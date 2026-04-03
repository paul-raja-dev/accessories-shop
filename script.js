// =============================================
// THE ACCESSORIES STORE — Interactive JS
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // --- Sticky Navbar ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinkElements = document.querySelectorAll('.nav-links a');

    function updateActiveLink() {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinkElements.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll(
        '.about-card, .product-card, .why-card, .review-card, .hours-card, .contact-item, .contact-map, .section-header'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Staggered reveal for grids ---
    const gridContainers = document.querySelectorAll('.about-grid, .products-grid, .why-grid, .reviews-grid');
    
    gridContainers.forEach(grid => {
        const gridObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.querySelectorAll('.reveal');
                    children.forEach((child, i) => {
                        child.style.transitionDelay = `${i * 0.1}s`;
                        setTimeout(() => child.classList.add('visible'), 10);
                    });
                    gridObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        gridObserver.observe(grid);
    });

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(el, target) {
        const duration = 2000;
        const start = performance.now();
        const startVal = 0;

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startVal + (target - startVal) * eased);
            
            el.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    }

    // --- Highlight Today's Day in Store Hours ---
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    
    document.querySelectorAll('.hours-row').forEach(row => {
        const dayEl = row.querySelector('.day');
        if (dayEl && dayEl.textContent.trim() === today) {
            row.classList.add('today');
            dayEl.textContent = `${today} (Today)`;
        }
    });

    // --- Hero Card Tilt Effect ---
    const heroCard = document.querySelector('.hero-card-inner');
    
    if (heroCard && window.matchMedia('(hover: hover)').matches) {
        heroCard.addEventListener('mousemove', (e) => {
            const rect = heroCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        heroCard.addEventListener('mouseleave', () => {
            heroCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const position = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: position,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Dynamic "Open Now" Badge ---
    function updateOpenStatus() {
        const badge = document.querySelector('.hero-badge');
        if (!badge) return;

        const now = new Date();
        const hours = now.getHours();
        const isOpen = hours >= 10 && hours < 23; // 10 AM to 11 PM

        const dot = badge.querySelector('.badge-dot');
        if (isOpen) {
            badge.innerHTML = '';
            const dotEl = document.createElement('span');
            dotEl.className = 'badge-dot';
            badge.appendChild(dotEl);
            badge.appendChild(document.createTextNode(' Open Now · Closes at 11 PM'));
            dot && (dot.style.background = '#4ade80');
        } else {
            badge.innerHTML = '';
            const dotEl = document.createElement('span');
            dotEl.className = 'badge-dot';
            dotEl.style.background = '#ef4444';
            dotEl.style.animation = 'none';
            badge.appendChild(dotEl);
            badge.appendChild(document.createTextNode(' Closed · Opens at 10 AM'));
        }
    }

    updateOpenStatus();
    setInterval(updateOpenStatus, 60000);

    // --- Parallax subtle effect on hero glows ---
    if (window.matchMedia('(hover: hover)').matches) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            const glow1 = document.querySelector('.hero-glow-1');
            const glow2 = document.querySelector('.hero-glow-2');
            
            if (glow1) glow1.style.transform = `translate(${x}px, ${y}px)`;
            if (glow2) glow2.style.transform = `translate(${-x}px, ${-y}px)`;
        }, { passive: true });
    }
});
