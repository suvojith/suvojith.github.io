/* ============================================
   LOADER
   ============================================ */
(function () {
    const loader = document.getElementById('loader');
    const progress = document.getElementById('loaderProgress');
    let width = 0;
    let done = false;
    const interval = setInterval(() => {
        width += Math.random() * 15 + 5;
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
                startTyping();
                animateReveals();
                done = true;
            }, 400);
        }
        progress.style.width = width + '%';
    }, 100);
    // Fallback: force-hide loader after 3s even if something fails
    setTimeout(() => {
        if (!done) {
            clearInterval(interval);
            loader.classList.add('hidden');
            startTyping();
            animateReveals();
        }
    }, 3000);
})();

/* ============================================
   CUSTOM CURSOR
   ============================================ */
(function () {
    if (window.innerWidth <= 768) return;
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('[data-cursor="hover"]') || e.target.matches('a, button, input, textarea')) {
            ring.classList.add('hover');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('[data-cursor="hover"]') || e.target.matches('a, button, input, textarea')) {
            ring.classList.remove('hover');
        }
    });

    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });
})();

/* ============================================
   PARTICLE NETWORK CANVAS
   ============================================ */
(function () {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 2 + 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 1.5;
                    this.y -= (dy / dist) * force * 1.5;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(162, 155, 254, 0.5)';
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    const opacity = (1 - dist / 130) * 0.3;
                    ctx.strokeStyle = `rgba(108, 92, 231, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connect();
        requestAnimationFrame(animate);
    }
    animate();
})();

/* ============================================
   TYPING ANIMATION
   ============================================ */
let typingStarted = false;
function startTyping() {
    if (typingStarted) return;
    typingStarted = true;
    const el = document.getElementById('typingText');
    const phrases = [
        'Forward Deployed Senior AI Engineer',
        'Agentic AI Systems Architect',
        'LLM Production Engineer',
        'RAG & Multimodal AI Builder',
        '6.5+ Years in GenAI, NLP & CV',
        'BITS Pilani · NLP Specialization'
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        const current = phrases[phraseIdx];
        if (isDeleting) {
            el.textContent = current.substring(0, charIdx - 1);
            charIdx--;
        } else {
            el.textContent = current.substring(0, charIdx + 1);
            charIdx++;
        }

        let delay = isDeleting ? 40 : 70;

        if (!isDeleting && charIdx === current.length) {
            delay = 2200;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            delay = 400;
        }
        setTimeout(type, delay);
    }
    type();
}

/* ============================================
   SCROLL REVEAL
   ============================================ */
function animateReveals() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
}

/* ============================================
   ANIMATED COUNTERS
   ============================================ */
(function () {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.count);
                const isDecimal = target % 1 !== 0;
                let current = 0;
                const duration = 1800;
                const startTime = performance.now();

                function update(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    current = target * eased;
                    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = isDecimal ? target.toFixed(1) : target;
                    }
                }
                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
})();

/* ============================================
   SKILL BAR ANIMATION
   ============================================ */
(function () {
    const skillFills = document.querySelectorAll('.skill-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const width = el.dataset.width;
                setTimeout(() => {
                    el.style.width = width + '%';
                }, 100);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    skillFills.forEach(f => observer.observe(f));
})();

/* ============================================
   3D TILT EFFECT
   ============================================ */
(function () {
    if (window.innerWidth <= 768) return;
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
})();

/* ============================================
   NAVIGATION SCROLL
   ============================================ */
(function () {
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const scrollProgress = document.getElementById('scrollProgress');
    const backTop = document.getElementById('backTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / docHeight) * 100;

        nav.classList.toggle('scrolled', scrollY > 50);
        scrollProgress.style.width = progress + '%';
        backTop.classList.toggle('visible', scrollY > 500);

        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            if (scrollY >= top) current = section.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    });

    backTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* ============================================
   MOBILE MENU
   ============================================ */
(function () {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const navLinks = document.querySelectorAll('.nav-link');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
        });
    });
})();

/* ============================================
   EMAIL POPUP & COPY
   ============================================ */
const EMAIL = 'suvojit.hore.1@gmail.com';

function sendEmail() {
    const popup = document.getElementById('emailPopup');
    const fill = document.getElementById('emailPopupFill');
    popup.classList.add('show');
    fill.style.width = '0%';
    let w = 0;
    const interval = setInterval(() => {
        w += 4;
        fill.style.width = w + '%';
        if (w >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                popup.classList.remove('show');
                window.location.href = 'mailto:' + EMAIL;
            }, 300);
        }
    }, 40);
}

function copyEmail() {
    navigator.clipboard.writeText(EMAIL).then(() => {
        sendEmail();
    }).catch(() => {
        sendEmail();
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset = 90;
            const top = target.offsetTop - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ============================================
   FOOTER YEAR
   ============================================ */
document.getElementById('year').textContent = new Date().getFullYear();
