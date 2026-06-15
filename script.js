/* Theme mode */
(function () {
  const root = document.documentElement;
  const button = document.getElementById('theme-toggle');
  if (!button) return;

  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
    button.querySelector('.toggle-text').textContent = theme === 'dark' ? 'Dark' : 'Light';
    button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }

  setTheme(initialTheme);

  button.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
})();

/* Canvas background */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const colors = [
    { r: 66, g: 133, b: 244 },
    { r: 234, g: 67, b: 53 },
    { r: 251, g: 188, b: 5 },
    { r: 52, g: 168, b: 83 },
  ];

  let width;
  let height;
  let nodes = [];
  let mouse = { x: 0, y: 0, active: false };

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function makeNode(index) {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2 + 1,
      color: colors[index % colors.length],
    };
  }

  function init() {
    const count = Math.min(68, Math.max(36, Math.floor(width / 22)));
    nodes = Array.from({ length: count }, (_, index) => makeNode(index));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < -20) node.x = width + 20;
      if (node.x > width + 20) node.x = -20;
      if (node.y < -20) node.y = height + 20;
      if (node.y > height + 20) node.y = -20;

      if (mouse.active) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 170) {
          node.x -= dx * 0.0018;
          node.y -= dy * 0.0018;
        }
      }
    });

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 145) {
          const { r, g, b: blue } = a.color;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${blue}, ${(1 - distance / 145) * 0.16})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    nodes.forEach((node) => {
      const { r, g, b } = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.42)`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  window.addEventListener('pointermove', (event) => {
    mouse = { x: event.clientX, y: event.clientY, active: true };
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    mouse.active = false;
  });
})();

/* Pointer spotlight */
(function () {
  window.addEventListener('pointermove', (event) => {
    document.body.style.setProperty('--mouse-x', `${event.clientX}px`);
    document.body.style.setProperty('--mouse-y', `${event.clientY}px`);
  }, { passive: true });
})();

/* Reveal animations */
(function () {
  const targets = document.querySelectorAll(
    '.section-header, .summary-card, .timeline-item, .logo-tile, .skill-note, .project-card, .skill-card, .recognition-card, .contact-card'
  );

  targets.forEach((target, index) => {
    target.classList.add('reveal');
    target.style.transitionDelay = `${Math.min(index * 30, 180)}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach((target) => observer.observe(target));
})();

/* Skill logo notes */
(function () {
  const tiles = document.querySelectorAll('.logo-tile[data-skill-note]');
  const note = document.getElementById('skill-note');
  if (!tiles.length || !note) return;

  tiles.forEach((tile) => {
    tile.addEventListener('click', () => {
      tiles.forEach((item) => item.classList.remove('active'));
      tile.classList.add('active');
      note.textContent = tile.dataset.skillNote;
      note.animate([
        { transform: 'translateY(8px)', opacity: 0.45 },
        { transform: 'translateY(0)', opacity: 1 },
      ], { duration: 240, easing: 'cubic-bezier(0.2, 0, 0, 1)' });
    });
  });
})();

/* Active navigation */
(function () {
  const links = document.querySelectorAll('nav a[href^="#"]');
  const sections = document.querySelectorAll('main section[id]');

  function setActiveLink() {
    let current = '';
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 180) current = section.id;
    });

    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  setActiveLink();
  window.addEventListener('scroll', setActiveLink, { passive: true });
})();

/* Expand project case studies */
(function () {
  const toggles = document.querySelectorAll('.project-toggle');
  if (!toggles.length) return;

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.project-card');
      const expanded = card.classList.toggle('expanded');
      toggle.textContent = expanded ? 'Close case study' : 'Open case study';
    });
  });
})();

/* Hero impact chips */
(function () {
  const chips = document.querySelectorAll('.impact-chip');
  const note = document.getElementById('impact-note');
  if (!chips.length || !note) return;

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((item) => item.classList.remove('active'));
      chip.classList.add('active');
      note.textContent = chip.dataset.note;
    });
  });
})();

/* Project filters */
(function () {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card[data-category]');
  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');

      cards.forEach((card) => {
        const categories = card.dataset.category.split(' ');
        card.classList.toggle('is-hidden', filter !== 'all' && !categories.includes(filter));
      });
    });
  });
})();

/* Profile card tilt */
(function () {
  const card = document.querySelector('.profile-console');
  if (!card) return;

  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-4px)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
})();
