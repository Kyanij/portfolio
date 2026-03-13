/* ════════════════════════════════════════════
   KYANIJ MAHARJAN — Portfolio JavaScript
   ════════════════════════════════════════════ */

'use strict';

/* ── Loader ─────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    // Trigger first reveals after loader
    triggerReveal();
    animateStats();
  }, 1800);
});
document.body.style.overflow = 'hidden';

/* ── Theme Toggle ────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('km-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('km-theme', next);
});

/* ── Custom Cursor ───────────────────────────── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left  = mouseX + 'px';
  dot.style.top   = mouseY + 'px';
});

(function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
})();

/* ── Navbar ──────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Mobile Menu ─────────────────────────────── */
const burger     = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── Smooth scroll for all anchor links ─────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Hero Canvas Particle Field ──────────────── */
(function initCanvas() {
  const canvas  = document.getElementById('heroCanvas');
  const ctx     = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -9999, y: -9999 };
  const PARTICLE_COUNT = 90;
  const CONNECTION_DIST = 140;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - .5) * .4;
      this.vy = (Math.random() - .5) * .4;
      this.r  = Math.random() * 1.8 + .6;
      this.alpha = Math.random() * .5 + .2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Mouse repulsion
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        this.x += dx / dist * 1.2;
        this.y += dy / dist * 1.2;
      }
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    // connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < CONNECTION_DIST) {
          const opacity = (1 - d / CONNECTION_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${opacity})`;
          ctx.lineWidth   = .8;
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── Typed Effect ────────────────────────────── */
(function initTyped() {
  const el     = document.getElementById('typed');
  const words  = [
    'Software Engineer',
    '.NET & C# Developer',
    'AWS Cloud Architect',
    'Full Stack Developer',
    'API Design Expert'
  ];
  let wi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 80, SPEED_DELETE = 45, PAUSE = 1800;

  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    let delay = deleting ? SPEED_DELETE : SPEED_TYPE;
    if (!deleting && ci > word.length) { deleting = true; delay = PAUSE; }
    else if (deleting && ci < 0)       { deleting = false; wi = (wi + 1) % words.length; ci = 0; delay = 300; }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 1200);
})();

/* ── Counter Animation ───────────────────────── */
function animateStats() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let current  = 0;
    const step   = Math.ceil(target / 30);
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 50);
  });
}

/* ── Intersection Observer — Reveal ─────────── */
function triggerReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        obs.unobserve(entry.target);
        // skill bars
        entry.target.querySelectorAll('.sb-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        // score bars
        entry.target.querySelectorAll('.score-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* Also re-check on scroll for late-loading content */
window.addEventListener('scroll', () => {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
      el.querySelectorAll('.sb-fill, .score-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { passive: true });

/* ── Active nav link highlight ───────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current
        ? 'var(--accent)' : '';
    });
  }, { passive: true });
})();

/* ── Contact Form ────────────────────────────── */
// Initialize EmailJS — put your actual Public Key here
emailjs.init('Nu4I7krMe_z5vfuHv');

document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn     = this.querySelector('.form-submit');
  const success = document.getElementById('formSuccess');

  btn.textContent = 'Sending…';
  btn.disabled    = true;

  const templateParams = {
    from_name:  document.getElementById('name').value,
    from_email: document.getElementById('email').value,
    subject:    document.getElementById('subject').value,
    message:    document.getElementById('message').value,
  };

  emailjs.send('service_obyby6f', 'template_1a8oazv', templateParams)
    .then(() => {
      btn.textContent = 'Send Message';
      btn.disabled    = false;
      success.classList.add('show');
      this.reset();
      setTimeout(() => success.classList.remove('show'), 4000);
    })
    .catch((err) => {
      btn.textContent = 'Send Message';
      btn.disabled    = false;
      alert('Failed to send. Please try again.');
      console.error(err);
    });
});

/* ── Project card tilt micro-interaction ─────── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - .5;
    const y    = (e.clientY - rect.top)  / rect.height - .5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── Skill chip progress tooltip ─────────────── */
document.querySelectorAll('.skill-chip').forEach(chip => {
  const lvl = chip.dataset.level;
  if (!lvl) return;
  chip.title = `Proficiency: ${lvl}%`;
});

/* ── Smooth page entrance ────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
});
