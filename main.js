// Interaction Observer for Scroll Animations
const observeElements = () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-scale, .slide-in-left, .slide-in-right');
  animatedElements.forEach(el => observer.observe(el));
};

// 3D Tilt Effect for cards
const initTiltEffect = () => {
  const tiltElements = document.querySelectorAll('.tool-card, .service-card');

  tiltElements.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
      el.style.transition = 'none'; // remove transition for smooth follow
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)`;
      el.style.transition = 'all 0.4s ease'; // restore transition
    });
  });
};

// Header blur on scroll intensity
const handleScroll = () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.style.background = 'rgba(26, 27, 38, 0.85)';
    header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
  } else {
    header.style.background = 'rgba(26, 27, 38, 0.6)';
    header.style.boxShadow = 'none';
  }
};

// Cursor Glow Effect
const initCursorGlow = () => {
  const cursorGlow = document.createElement('div');
  cursorGlow.classList.add('cursor-glow');
  document.body.appendChild(cursorGlow);

  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animateGlow = () => {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  };
  animateGlow();

  const clickables = document.querySelectorAll('a, button, .portfolio-item, .service-card, .tool-card');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => cursorGlow.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
  });
};

// Canvas Network Animation
const initCanvasBg = () => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  };

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }
    draw() {
      ctx.fillStyle = 'rgba(0, 210, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const initParticles = () => {
    particles = [];
    const isMobile = window.innerWidth <= 768;
    const density = isMobile ? 8000 : 12000;
    const particleCount = Math.floor((width * height) / density);
    const finalCount = Math.max(isMobile ? 35 : 80, Math.min(particleCount, 150));

    for (let i = 0; i < finalCount; i++) {
      const p = new Particle();
      if (isMobile) {
        p.size = Math.random() * 2 + 1; // Larger on mobile
      }
      particles.push(p);
    }
  };

  initParticles();

  const animate = () => {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 210, 255, ${0.15 - distance / 800})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  };

  animate();
};

// Fireflies Setup (Mobile Friendly)
const initFireflies = () => {
  const container = document.createElement('div');
  container.className = 'fireflies-container';
  document.body.appendChild(container);

  const count = window.innerWidth <= 768 ? 15 : 30; // Density

  for (let i = 0; i < count; i++) {
    const firefly = document.createElement('div');
    firefly.className = 'firefly';
    firefly.style.left = `${Math.random() * 100}vw`;
    firefly.style.top = `${Math.random() * 100}vh`;
    firefly.style.animationDuration = `${Math.random() * 10 + 15}s`;
    firefly.style.animationDelay = `-${Math.random() * 20}s`;
    container.appendChild(firefly);
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initCanvasBg();
  initFireflies();
  observeElements();
  initTiltEffect();
  initCursorGlow();
  window.addEventListener('scroll', handleScroll);
});
