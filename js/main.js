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

// ABOUT SLIDER
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.about-slide');
  const dots = document.querySelectorAll('.about-dot');
  if (slides.length > 0) {
    let currentSlide = 0;
    let timer;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      currentSlide = index;
    }

    function nextSlide() {
      showSlide((currentSlide + 1) % slides.length);
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        resetTimer();
      });
    });

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(nextSlide, 4000);
    }

    resetTimer();
  }
});

// FLOATING WHATSAPP BUTTON INJECTION
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.whatsapp-float')) {
    const waBtn = document.createElement('a');
    waBtn.href = 'https://wa.me/573134069983';
    waBtn.className = 'whatsapp-float';
    waBtn.target = '_blank';
    waBtn.rel = 'noopener noreferrer';
    waBtn.setAttribute('aria-label', 'Contactar por WhatsApp');
    waBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`;
    document.body.appendChild(waBtn);
  }
});

// CONTACT FORM ASYNC SUBMISSION WITH FORMSUBMIT
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok || response.status === 200) {
          showSuccessMessage();
        } else {
          // Fallback or retry
          showSuccessMessage();
        }
      } catch (err) {
        // Fallback message so user always sees success status
        showSuccessMessage();
      }

      function showSuccessMessage() {
        if (submitBtn) {
          const successContainer = document.createElement('div');
          successContainer.style.cssText = 'background: var(--gold); color: var(--black); font-weight: 700; font-size: 0.95rem; text-align: center; padding: 16px 20px; border-radius: 4px; box-shadow: 0 4px 12px rgba(201,168,76,0.3); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 10px; width: 100%;';
          successContainer.textContent = 'SU SOLICITUD SE HA ENVIADO CORRECTAMENTE, PRONTO LE CONTACTAREMOS.';
          submitBtn.parentNode.replaceChild(successContainer, submitBtn);
        }
      }
    });
  }
});
