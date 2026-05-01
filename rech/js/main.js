/* ============================================================
   CONSCIOUSNESS RESEARCH WEBSITE
   Interactive Engine — Particles, Scroll, Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initCosmicCanvas();
    initMouseGlow();
    initScrollProgress();
    initSectionObserver();
    initSectionDots();
    initParallax();
    initSmoothScroll();
});

/* -------------------- COSMIC PARTICLE CANVAS -------------------- */
function initCosmicCanvas() {
    const canvas = document.getElementById('cosmic-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let stars = [];
    let nebula = [];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    // Create stars
    const starCount = Math.min(200, Math.floor(window.innerWidth / 8));
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.3,
            alpha: Math.random() * 0.6 + 0.1,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinklePhase: Math.random() * Math.PI * 2
        });
    }
    
    // Create floating particles
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3 - 0.1,
            size: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.4 + 0.1,
            color: Math.random() > 0.5 ? [110, 231, 255] : [139, 92, 246]
        });
    }
    
    // Create nebula fog
    for (let i = 0; i < 5; i++) {
        nebula.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 300 + 200,
            vx: (Math.random() - 0.5) * 0.05,
            vy: (Math.random() - 0.5) * 0.05,
            color: Math.random() > 0.5 ? [110, 231, 255] : [139, 92, 246],
            alpha: Math.random() * 0.03 + 0.01
        });
    }
    
    let scrollOffset = 0;
    window.addEventListener('scroll', () => {
        scrollOffset = window.scrollY * 0.1;
    }, { passive: true });
    
    function drawStars() {
        stars.forEach(star => {
            const twinkle = Math.sin(Date.now() * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * twinkle})`;
            ctx.fill();
        });
    }
    
    function drawNebula() {
        nebula.forEach(fog => {
            fog.x += fog.vx;
            fog.y += fog.vy;
            
            if (fog.x < -fog.radius) fog.x = width + fog.radius;
            if (fog.x > width + fog.radius) fog.x = -fog.radius;
            if (fog.y < -fog.radius) fog.y = height + fog.radius;
            if (fog.y > height + fog.radius) fog.y = -fog.radius;
            
            const gradient = ctx.createRadialGradient(fog.x, fog.y, 0, fog.x, fog.y, fog.radius);
            gradient.addColorStop(0, `rgba(${fog.color[0]}, ${fog.color[1]}, ${fog.color[2]}, ${fog.alpha})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(fog.x - fog.radius, fog.y - fog.radius, fog.radius * 2, fog.radius * 2);
        });
    }
    
    function drawParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy + scrollOffset * 0.001;
            
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.alpha})`;
            ctx.fill();
        });
    }
    
    function drawConnections() {
        const maxDist = 100;
        const maxConnections = 3;
        
        for (let i = 0; i < particles.length; i++) {
            let connections = 0;
            for (let j = i + 1; j < particles.length; j++) {
                if (connections >= maxConnections) break;
                
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(110, 231, 255, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    connections++;
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Background gradient
        const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
        bgGradient.addColorStop(0, '#02030A');
        bgGradient.addColorStop(0.5, '#050814');
        bgGradient.addColorStop(1, '#0B1020');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);
        
        drawNebula();
        drawStars();
        drawConnections();
        drawParticles();
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* -------------------- MOUSE GLOW -------------------- */
function initMouseGlow() {
    const glow = document.getElementById('mouse-glow');
    if (!glow) return;
    
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });
    
    function updateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        
        requestAnimationFrame(updateGlow);
    }
    
    updateGlow();
}

/* -------------------- SCROLL PROGRESS -------------------- */
function initScrollProgress() {
    const progressLine = document.getElementById('scroll-progress');
    if (!progressLine) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressLine.style.width = progress + '%';
    }, { passive: true });
}

/* -------------------- SECTION OBSERVER -------------------- */
function initSectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            const index = parseInt(section.dataset.section);
            
            // Update section dots
            const dots = document.querySelectorAll('.section-dots .dot');
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
            
            // Reveal animations
            const revealElements = section.querySelectorAll('.reveal-section');
            revealElements.forEach(el => {
                if (entry.isIntersecting) {
                    el.classList.add('visible');
                }
            });
            
            // Special section reveals
            if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
                section.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.section').forEach(section => {
        sectionObserver.observe(section);
    });
}

/* -------------------- SECTION DOTS NAVIGATION -------------------- */
function initSectionDots() {
    const dots = document.querySelectorAll('.section-dots .dot');
    
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const sectionIndex = dot.dataset.section;
            const targetSection = document.getElementById(`section-${sectionIndex}`);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* -------------------- PARALLAX EFFECTS -------------------- */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-glow, .section-bg-fog, .curse-bg, .fermi-bg');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(el => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const speed = el.dataset.speed || 0.5;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const offset = (scrollY - el.offsetTop) * speed;
                el.style.transform = `translateY(${offset}px)`;
            }
        });
    }, { passive: true });
}

/* -------------------- SMOOTH SCROLL -------------------- */
function initSmoothScroll() {
    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.getElementById('section-1');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Timeline progress animation
    const timelineProgress = document.querySelector('.timeline-progress');
    if (timelineProgress) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timelineProgress.style.height = '100%';
                }
            });
        }, { threshold: 0.3 });
        
        const timelineContainer = document.querySelector('.timeline-container');
        if (timelineContainer) {
            timelineObserver.observe(timelineContainer);
        }
    }
    
    // Timeline items stagger reveal
    const timelineItems = document.querySelectorAll('.timeline-item');
    const itemObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(timelineItems).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
                itemObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    timelineItems.forEach(item => itemObserver.observe(item));
}

/* -------------------- DEATH PARTICLES -------------------- */
function initDeathParticles() {
    const container = document.getElementById('death-particles');
    if (!container) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'death-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: var(--accent-cyan);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.2};
            animation: particleFloat ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        container.appendChild(particle);
    }
}

// Initialize death particles when section is visible
const deathSection = document.querySelector('.death-section');
if (deathSection) {
    const deathObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initDeathParticles();
                deathObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    deathObserver.observe(deathSection);
}

/* -------------------- HERO TITLE ANIMATION -------------------- */
function initHeroAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    // Ensure letters are ready
    const letters = heroTitle.querySelectorAll('.letter');
    letters.forEach((letter, i) => {
        letter.style.display = 'inline-block';
    });
}

initHeroAnimation();

/* -------------------- CURSOR EFFECTS ON CARDS -------------------- */
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

/* -------------------- PERFORMANCE OPTIMIZATIONS -------------------- */
// Throttle scroll events for better performance
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
    };
}

// Prevent layout thrashing
window.addEventListener('resize', throttle(() => {
    document.querySelectorAll('.section').forEach(section => {
        section.style.willChange = 'transform';
        requestAnimationFrame(() => {
            section.style.willChange = 'auto';
        });
    });
}, 100));

/* -------------------- KEYBOARD NAVIGATION -------------------- */
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const currentSection = document.querySelector('.section-dots .dot.active');
        if (currentSection) {
            const nextIndex = parseInt(currentSection.dataset.section) + 1;
            const nextSection = document.getElementById(`section-${nextIndex}`);
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const currentSection = document.querySelector('.section-dots .dot.active');
        if (currentSection) {
            const prevIndex = parseInt(currentSection.dataset.section) - 1;
            if (prevIndex >= 0) {
                const prevSection = document.getElementById(`section-${prevIndex}`);
                if (prevSection) {
                    prevSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    }
});
