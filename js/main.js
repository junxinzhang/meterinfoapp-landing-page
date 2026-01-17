/**
 * 电表信息管理系统 - 落地页交互脚本
 * MeterInfo Landing Page JavaScript
 */

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function() {
  // Mobile menu toggle
  const btn = document.getElementById('menu-btn');
  const nav = document.getElementById('mobile-nav');

  if (btn && nav) {
    btn.addEventListener('click', () => {
      nav.classList.toggle('active');
      const isOpen = nav.classList.contains('active');
      btn.setAttribute('aria-expanded', isOpen);
      btn.innerHTML = isOpen
        ? '<i class="ri-close-line text-xl text-white"></i>'
        : '<i class="ri-menu-line text-xl text-white"></i>';
    });

    // Close mobile menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<i class="ri-menu-line text-xl text-white"></i>';
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<i class="ri-menu-line text-xl text-white"></i>';
      }
    });
  }

  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Add scroll effect to header
  const header = document.querySelector('header');
  if (header) {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScrollY = currentScrollY;
    });
  }

  // Dynamic copyright year
  const copyrightEl = document.getElementById('copyright-year');
  if (copyrightEl) {
    const startYear = 2025;
    const currentYear = new Date().getFullYear();
    copyrightEl.textContent = currentYear > startYear
      ? `${startYear}-${currentYear}`
      : `${startYear}`;
  }

  // Lazy load images
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // Animate stats on scroll
  const statCards = document.querySelectorAll('.stat-card');
  if ('IntersectionObserver' in window && statCards.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-in');
        }
      });
    }, { threshold: 0.5 });

    statCards.forEach(card => statsObserver.observe(card));
  }

  // Handle FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const summary = item.querySelector('summary');
    if (summary) {
      summary.addEventListener('click', (e) => {
        // Optional: close other FAQs when opening one
        // faqItems.forEach(otherItem => {
        //   if (otherItem !== item && otherItem.open) {
        //     otherItem.open = false;
        //   }
        // });
      });
    }
  });

  // Track external link clicks (for analytics)
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function() {
      const href = this.getAttribute('href');
      console.log('External link clicked:', href);
      // Add your analytics tracking here
      // gtag('event', 'click', { 'event_category': 'outbound', 'event_label': href });
    });
  });

  // Add loading state for demo video links
  const videoLinks = document.querySelectorAll('.demo-card a');
  videoLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const icon = this.querySelector('i');
      if (icon) {
        icon.className = 'ri-loader-4-line animate-spin';
        setTimeout(() => {
          icon.className = 'ri-play-fill';
        }, 500);
      }
    });
  });

  // Scroll progress indicator (optional)
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #10b981, #0ea5e9);
    z-index: 9999;
    transition: width 0.1s ease;
    width: 0%;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  });

  // Console welcome message
  console.log('%c电表信息管理系统 - MeterInfo', 'color: #10b981; font-size: 20px; font-weight: bold;');
  console.log('%c智能抄表 · OCR识别 · 移动采集', 'color: #64748b; font-size: 12px;');
});

// Utility function: throttle
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Utility function: debounce
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
