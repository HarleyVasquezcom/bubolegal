document.addEventListener('DOMContentLoaded', () => {

  // NAVBAR SCROLL
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // MOBILE MENU
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }

  // SCROLL ANIMATIONS
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // COUNTER ANIMATION
  const counters = document.querySelectorAll('.stat-item h3');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.textContent.replace(/[^0-9]/g, ''));
          const suffix = entry.target.textContent.replace(/[0-9]/g, '');
          let current = 0;
          const increment = target / 60;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              entry.target.textContent = target + suffix;
              clearInterval(timer);
            } else {
              entry.target.textContent = Math.floor(current) + suffix;
            }
          }, 25);
          counterObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    counters.forEach(c => counterObserver.observe(c));
  }

  // BLOG CAROUSEL
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');

  if (track) {
    const cards = track.querySelectorAll('.blog-carousel-card');
    const cardStyle = getComputedStyle(track);
    const gap = parseInt(cardStyle.gap) || 24;
    let currentIndex = 0;
    let visibleCount = getVisibleCount();

    function getVisibleCount() {
      const w = window.innerWidth;
      if (w > 1024) return 3;
      if (w > 768) return 2;
      return 1;
    }

    function getCardWidth() {
      const first = cards[0];
      if (!first) return 0;
      const rect = first.getBoundingClientRect();
      return rect.width + gap;
    }

    function update() {
      const step = getCardWidth();
      const max = Math.max(0, cards.length - visibleCount);
      currentIndex = Math.min(currentIndex, max);
      track.style.transform = `translateX(-${currentIndex * step}px)`;
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= max;
      updateDots(max);
    }

    function updateDots(max) {
      if (!dotsContainer) return;
      const totalDots = max + 1;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Ir al artículo ${i + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = i;
          update();
        });
        dotsContainer.appendChild(dot);
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) { currentIndex--; update(); }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const max = cards.length - visibleCount;
        if (currentIndex < max) { currentIndex++; update(); }
      });
    }

    window.addEventListener('resize', () => {
      const newCount = getVisibleCount();
      if (newCount !== visibleCount) {
        visibleCount = newCount;
        currentIndex = Math.min(currentIndex, Math.max(0, cards.length - visibleCount));
        update();
      }
    });

    update();
  }
});
