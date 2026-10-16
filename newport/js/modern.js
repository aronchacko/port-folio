/**
 * Aron Chacko Portfolio - Modern Theme Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.className = 'fa fa-times';
        } else {
          icon.className = 'fa fa-bars';
        }
      }
    });

    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa fa-bars';
      });
    });
  }

  // Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav);

  // Modal Dialogs for R&D Projects
  window.openProjectModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeProjectModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close modals when clicking on overlay background
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });

  // Numbers Counter Animation
  const statsElements = document.querySelectorAll('.stat-number');
  let animated = false;

  const countUp = () => {
    const statsSection = document.getElementById('impact');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight && !animated) {
      animated = true;
      statsElements.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        const duration = 1500;
        const step = Math.ceil(target / (duration / 25));
        let current = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            stat.textContent = target + (stat.getAttribute('data-suffix') || '');
            clearInterval(timer);
          } else {
            stat.textContent = current + (stat.getAttribute('data-suffix') || '');
          }
        }, 25);
      });
    }
  };

  window.addEventListener('scroll', countUp);
  countUp(); // Run once on load

  /* ===================================================================
   * 1. INTERACTIVE CYBERNETIC NEURAL MESH (PHYSICAL AI PARTICLES)
   * =================================================================== */
  const canvas = document.getElementById('neuralCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    let shockwaves = [];
    let isVisible = true;

    // Responsive particle count (fewer on mobile)
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 35 : 75;
    const maxDistance = isMobile ? 95 : 125;
    const mouseRadius = isMobile ? 120 : 170;

    const colors = [
      { r: 6, g: 182, b: 212 },   // Neon Cyan
      { r: 255, g: 0, b: 119 },   // Cyber Pink
      { r: 139, g: 92, b: 246 },  // Electric Violet
      { r: 224, g: 242, b: 254 }  // Polar White
    ];

    class Particle {
      constructor() {
        this.reset();
        this.x = Math.random() * width;
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.75;
        this.vy = (Math.random() - 0.5) * 0.75;
        this.radius = Math.random() * 1.6 + 1.2;
        this.baseAlpha = Math.random() * 0.4 + 0.35;
        this.pulse = Math.random() * Math.PI;
        this.pulseSpeed = Math.random() * 0.025 + 0.01;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.pulse += this.pulseSpeed;
        this.x += this.vx;
        this.y += this.vy;

        // Bounce gently at screen edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction (subtle attraction & magnetic orbit)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouseRadius && dist > 0) {
          const force = (1 - dist / mouseRadius) * 0.4;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }

        // Shockwaves from clicks
        for (let i = 0; i < shockwaves.length; i++) {
          const sw = shockwaves[i];
          const sdx = this.x - sw.x;
          const sdy = this.y - sw.y;
          const sdist = Math.hypot(sdx, sdy);
          const diff = Math.abs(sdist - sw.radius);

          if (diff < 30) {
            const push = (1 - diff / 30) * sw.intensity;
            this.x += (sdx / sdist) * push;
            this.y += (sdy / sdist) * push;
          }
        }
      }

      draw() {
        const alpha = this.baseAlpha + Math.sin(this.pulse) * 0.2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${Math.max(0.1, alpha)})`;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    const particles = Array.from({ length: particleCount }, () => new Particle());

    // Window Resize Handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse Tracking
    window.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    });

    // Shockwave on click
    window.addEventListener('click', (e) => {
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 180,
        intensity: 5,
        opacity: 0.6
      });
    });

    // Animation Loop
    let animId;
    const render = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Update and draw shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 4;
        sw.opacity *= 0.94;
        sw.intensity *= 0.94;

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(6, 182, 212, ${sw.opacity * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (sw.radius > sw.maxRadius || sw.opacity < 0.01) {
          shockwaves.splice(i, 1);
        }
      }

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        // Synapse to mouse cursor
        if (mouse.x > 0 && mouse.y > 0) {
          const mdx = p1.x - mouse.x;
          const mdy = p1.y - mouse.y;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist < mouseRadius) {
            const mAlpha = (1 - mdist / mouseRadius) * 0.55;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 0, 119, ${mAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    // Pause animation when tab is not focused to save battery/resources
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isVisible = false;
        cancelAnimationFrame(animId);
      } else {
        isVisible = true;
        render();
      }
    });
  }

  /* ===================================================================
   * 2. AMBIENT CURSOR GLOW SPOTLIGHT
   * =================================================================== */
  const cursorGlow = document.getElementById('ambientCursorGlow');
  if (cursorGlow) {
    let curX = -500, curY = -500;
    let targetX = -500, targetY = -500;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      cursorGlow.style.opacity = '1';
    });

    window.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });

    const updateGlow = () => {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      cursorGlow.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
      requestAnimationFrame(updateGlow);
    };
    updateGlow();
  }

  /* ===================================================================
   * 3. HERO VISUAL 3D PERSPECTIVE TILT
   * =================================================================== */
  const heroCard = document.getElementById('heroVisualCard');
  if (heroCard && window.innerWidth > 992) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      heroCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  /* ===================================================================
   * 4. REAL-TIME ROBOTICS HUD TELEMETRY TICKER
   * =================================================================== */
  const hudMetrics = document.getElementById('hudMetrics');
  if (hudMetrics) {
    const states = [
      ['<i class="fa fa-microchip"></i> 60 FPS', '<i class="fa fa-bolt"></i> 1.8ms'],
      ['<i class="fa fa-satellite"></i> LIDAR OK', '<i class="fa fa-microchip"></i> 59 FPS'],
      ['<i class="fa fa-network-wired"></i> ROS 2 SYNC', '<i class="fa fa-bolt"></i> 2.1ms'],
      ['<i class="fa fa-eye"></i> YOLOV8 ACT', '<i class="fa fa-microchip"></i> 60 FPS']
    ];
    let stateIdx = 0;
    setInterval(() => {
      stateIdx = (stateIdx + 1) % states.length;
      const [metric1, metric2] = states[stateIdx];
      hudMetrics.innerHTML = `
        <span class="hud-chip">${metric1}</span>
        <span class="hud-chip">${metric2}</span>
      `;
    }, 2800);
  }

  /* ===================================================================
   * 5. HOLOGRAPHIC GLITCH & DIGITAL MATRIX CONTROLLER
   * =================================================================== */
  const holoFrame = document.getElementById('avatarVisionFrame');
  const matrixStream = document.getElementById('matrixStream');
  const holoStatusLabel = document.getElementById('holoStatusLabel');
  const holoMatrixTag = document.getElementById('holoMatrixTag');

  if (holoFrame && matrixStream) {
    const defaultStream = '01000001 01010010 01001111 01001110';
    const matrixChars = '01ABCDEF0123456789X/::';
    let matrixInterval = null;

    function startMatrixScramble() {
      if (matrixInterval) clearInterval(matrixInterval);
      if (holoStatusLabel) holoStatusLabel.textContent = 'HOLO://SCHEMATIC_ACTIVE';
      if (holoMatrixTag) holoMatrixTag.textContent = 'MATRIX: 0xA4 // DECODE_OK';

      let count = 0;
      matrixInterval = setInterval(() => {
        let scrambled = '';
        for (let i = 0; i < defaultStream.length; i++) {
          if (defaultStream[i] === ' ') {
            scrambled += ' ';
          } else {
            scrambled += matrixChars[Math.floor(Math.random() * matrixChars.length)];
          }
        }
        matrixStream.textContent = scrambled;
        count++;
        if (count > 35 && !holoFrame.matches(':hover') && !holoFrame.classList.contains('active-blueprint')) {
          stopMatrixScramble();
        }
      }, 45);
    }

    function stopMatrixScramble() {
      if (matrixInterval) {
        clearInterval(matrixInterval);
        matrixInterval = null;
      }
      matrixStream.textContent = defaultStream;
      if (holoStatusLabel) holoStatusLabel.textContent = 'HOLO://SYS_STANDBY';
      if (holoMatrixTag) holoMatrixTag.textContent = 'MATRIX: 0x7F // LIVE';
    }

    // Hover triggers
    holoFrame.addEventListener('mouseenter', () => {
      startMatrixScramble();
    });

    holoFrame.addEventListener('mouseleave', () => {
      if (!holoFrame.classList.contains('active-blueprint')) {
        stopMatrixScramble();
      }
    });

    // Mobile tap support
    holoFrame.addEventListener('click', () => {
      holoFrame.classList.toggle('active-blueprint');
      if (holoFrame.classList.contains('active-blueprint')) {
        startMatrixScramble();
        if (holoStatusLabel) holoStatusLabel.textContent = 'HOLO://SCHEMATIC_LOCKED';
      } else {
        stopMatrixScramble();
      }
    });
  }
});
