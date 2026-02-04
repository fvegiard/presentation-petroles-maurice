/**
 * Alliance Gagnante V15 - Enhanced Features
 * Navigation, Progress, Theme Toggle, Accessibility
 */

(function() {
  'use strict';

  // ============================================
  // NAVIGATION DOTS
  // ============================================
  function initNavDots() {
    const slides = document.querySelectorAll('.reveal .slides > section');
    const navContainer = document.createElement('nav');
    navContainer.className = 'nav-dots-v15';
    navContainer.setAttribute('aria-label', 'Navigation des slides');

    slides.forEach((slide, index) => {
      const dot = document.createElement('button');
      dot.className = 'nav-dot';
      dot.setAttribute('aria-label', `Aller au slide ${index + 1}`);
      dot.setAttribute('data-slide', index);

      dot.addEventListener('click', () => {
        if (window.Reveal) {
          Reveal.slide(index);
        }
      });

      navContainer.appendChild(dot);
    });

    document.body.appendChild(navContainer);
    updateActiveDot(0);
  }

  function updateActiveDot(slideIndex) {
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === slideIndex);
    });
  }

  // ============================================
  // PROGRESS BAR
  // ============================================
  function initProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar-v15';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', 'Progression de la présentation');
    document.body.appendChild(progressBar);
    updateProgress(0, 1);
  }

  function updateProgress(current, total) {
    const progressBar = document.querySelector('.progress-bar-v15');
    if (progressBar) {
      const percentage = ((current + 1) / total) * 100;
      progressBar.style.width = `${percentage}%`;
      progressBar.setAttribute('aria-valuenow', Math.round(percentage));
    }
  }

  // ============================================
  // THEME TOGGLE (Dark/Light)
  // ============================================
  function initThemeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.innerHTML = '🌙';
    toggle.setAttribute('aria-label', 'Basculer le thème');
    toggle.setAttribute('title', 'Mode sombre/clair');

    let isDark = true;

    toggle.addEventListener('click', () => {
      isDark = !isDark;
      document.body.classList.toggle('light-theme', !isDark);
      toggle.innerHTML = isDark ? '🌙' : '☀️';

      // Update CSS variables for light mode
      if (!isDark) {
        document.documentElement.style.setProperty('--dark', '#f5f5f5');
        document.body.style.background = '#f5f5f5';
      } else {
        document.documentElement.style.setProperty('--dark', '#0a0a12');
        document.body.style.background = '#0a0a12';
      }
    });

    document.body.appendChild(toggle);
  }

  // ============================================
  // KEYBOARD NAVIGATION ENHANCED
  // ============================================
  function initKeyboardNav() {
    document.addEventListener('keydown', (event) => {
      if (!window.Reveal) return;

      switch (event.key) {
        case 'Home':
          event.preventDefault();
          Reveal.slide(0);
          break;
        case 'End':
          event.preventDefault();
          Reveal.slide(Reveal.getTotalSlides() - 1);
          break;
        case 'f':
        case 'F':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            Reveal.toggleOverview();
          }
          break;
        case 'Escape':
          if (Reveal.isOverview()) {
            Reveal.toggleOverview();
          }
          break;
      }
    });
  }

  // ============================================
  // SKIP LINK FOR ACCESSIBILITY
  // ============================================
  function initSkipLink() {
    // Skip link already exists in HTML, just ensure main-content id exists
    const existingSkipLink = document.querySelector('.skip-link');
    if (!existingSkipLink) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Aller au contenu principal';
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Ensure main-content target exists (don't duplicate if already set)
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
      const firstSlide = document.querySelector('.reveal .slides > section');
      if (firstSlide) {
        firstSlide.id = 'main-content';
      }
    }
  }

  // ============================================
  // LAZY LOADING FOR IMAGES
  // ============================================
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '100px'
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  // ============================================
  // ANIMATED COUNTERS
  // ============================================
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const animateCounter = (counter) => {
      const target = parseInt(counter.dataset.count, 10);
      const duration = 2000;
      const start = 0;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

        const current = Math.round(start + (target - start) * easeProgress);
        counter.textContent = current.toLocaleString('fr-FR');

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString('fr-FR');
        }
      };

      requestAnimationFrame(updateCounter);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(counter => observer.observe(counter));
    }
  }

  // ============================================
  // TOUCH GESTURES FOR MOBILE
  // ============================================
  function initTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (event) => {
      touchEndX = event.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (!window.Reveal) return;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          Reveal.next();
        } else {
          Reveal.prev();
        }
      }
    }
  }

  // ============================================
  // PRINT FUNCTIONALITY
  // ============================================
  function initPrintButton() {
    // Add print button if needed
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'p') {
        event.preventDefault();
        window.print();
      }
    });
  }

  // ============================================
  // PURPLE ARROWS STYLING
  // ============================================
  function initPurpleArrows() {
    // Inject CSS - Reveal uses ::before/::after with background-color: currentcolor
    // So we need to change the color property on the button
    const style = document.createElement('style');
    style.textContent = `
      .reveal .controls button {
        color: #9333ea !important;
      }
      .reveal .controls button:hover {
        color: #a855f7 !important;
      }
      .reveal .controls .controls-arrow::before,
      .reveal .controls .controls-arrow::after {
        background-color: #9333ea !important;
      }
      .reveal .controls button:hover .controls-arrow::before,
      .reveal .controls button:hover .controls-arrow::after {
        background-color: #a855f7 !important;
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================
  // REVEAL.JS EVENT LISTENERS
  // ============================================
  function initRevealListeners() {
    if (!window.Reveal) {
      console.warn('Reveal.js not found');
      return;
    }

    // Apply purple arrows after Reveal is ready
    initPurpleArrows();

    Reveal.on('slidechanged', (event) => {
      updateActiveDot(event.indexh);
      updateProgress(event.indexh, Reveal.getTotalSlides());
    });

    Reveal.on('ready', () => {
      const { indexh } = Reveal.getIndices();
      updateActiveDot(indexh);
      updateProgress(indexh, Reveal.getTotalSlides());
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  }

  function initAll() {
    initSkipLink();
    initProgressBar();
    initNavDots();
    initThemeToggle();
    initKeyboardNav();
    initLazyLoading();
    initCounters();
    initTouchGestures();
    initPrintButton();

    // Wait for Reveal.js to be ready
    if (window.Reveal) {
      if (Reveal.isReady()) {
        initRevealListeners();
      } else {
        Reveal.on('ready', initRevealListeners);
      }
    } else {
      // Retry after a short delay
      setTimeout(() => {
        if (window.Reveal) {
          initRevealListeners();
        }
      }, 1000);
    }

    // V15 Features loaded successfully
  }

  // Start initialization
  init();

})();
