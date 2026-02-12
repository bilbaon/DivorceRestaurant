/* ===================================================
   Irreconcilable Bites — Main JavaScript
   Navigation, modals, accordions, gallery, etc.
   =================================================== */

(function () {
  'use strict';

  // ─── Mobile Navigation ────────────────────────────
  const navToggle = document.querySelector('.site-nav__toggle');
  const navMenu = document.querySelector('.site-nav__menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.getAttribute('data-open') === 'true';
      navMenu.setAttribute('data-open', !isOpen);
      navToggle.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    // Close on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.setAttribute('data-open', 'false');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.getAttribute('data-open') === 'true') {
        navMenu.setAttribute('data-open', 'false');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  // ─── Order Online Modal ───────────────────────────
  const orderModal = document.getElementById('order-modal');
  const orderBtns = document.querySelectorAll('[data-order-btn]');

  function openModal(modal) {
    if (!modal) return;
    modal.setAttribute('data-open', 'true');
    modal.querySelector('.modal__close')?.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute('data-open', 'false');
    document.body.style.overflow = '';
  }

  orderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(orderModal);
    });
  });

  // Close modals
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    // Close button
    overlay.querySelector('.modal__close')?.addEventListener('click', () => closeModal(overlay));

    // Click backdrop
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  // Escape key for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay[data-open="true"]').forEach(closeModal);
    }
  });

  // ─── Reservation Modal ────────────────────────────
  const resModal = document.getElementById('reservation-modal');
  const resBtns = document.querySelectorAll('[data-reservation-btn]');

  resBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(resModal);
    });
  });

  // Reservation form validation
  const resForm = document.getElementById('reservation-form');
  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      resForm.querySelectorAll('[required]').forEach(field => {
        const error = field.parentElement.querySelector('.form-error');
        if (!field.value.trim()) {
          field.classList.add('invalid');
          if (error) error.classList.add('visible');
          valid = false;
        } else {
          field.classList.remove('invalid');
          if (error) error.classList.remove('visible');
        }
      });

      if (valid) {
        resForm.style.display = 'none';
        const success = resModal.querySelector('.reservation-success');
        if (success) success.classList.add('visible');
      }
    });
  }

  // ─── Separate Checks Toggle (Menu page) ───────────
  const separateChecksToggle = document.getElementById('separate-checks');
  const menuSplit = document.querySelector('.menu-split');

  if (separateChecksToggle && menuSplit) {
    separateChecksToggle.addEventListener('change', () => {
      menuSplit.classList.toggle('menu-split--active', separateChecksToggle.checked);
    });
  }

  // ─── Gallery Filter ───────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.setAttribute('data-hidden', 'false');
        } else {
          item.setAttribute('data-hidden', 'true');
        }
      });
    });
  });

  // ─── Gallery Lightbox ─────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = lightbox?.querySelector('.lightbox__content');
  const lightboxCaption = lightbox?.querySelector('.lightbox__caption');
  let currentLightboxIndex = 0;
  let visibleItems = [];

  function getVisibleGalleryItems() {
    return Array.from(galleryItems).filter(item => item.getAttribute('data-hidden') !== 'true');
  }

  function openLightbox(index) {
    visibleItems = getVisibleGalleryItems();
    if (!lightbox || !visibleItems[index]) return;

    currentLightboxIndex = index;
    const item = visibleItems[index];
    const svg = item.querySelector('svg');
    const caption = item.getAttribute('data-caption') || '';

    if (lightboxContent && svg) {
      lightboxContent.innerHTML = svg.outerHTML;
    }
    if (lightboxCaption) lightboxCaption.textContent = caption;

    lightbox.setAttribute('data-open', 'true');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox__close')?.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute('data-open', 'false');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    visibleItems = getVisibleGalleryItems();
    currentLightboxIndex = (currentLightboxIndex + direction + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentLightboxIndex];
    const svg = item.querySelector('svg');
    const caption = item.getAttribute('data-caption') || '';

    if (lightboxContent && svg) lightboxContent.innerHTML = svg.outerHTML;
    if (lightboxCaption) lightboxCaption.textContent = caption;
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      const vis = getVisibleGalleryItems();
      const idx = vis.indexOf(item);
      openLightbox(idx >= 0 ? idx : 0);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const vis = getVisibleGalleryItems();
        const idx = vis.indexOf(item);
        openLightbox(idx >= 0 ? idx : 0);
      }
    });
  });

  if (lightbox) {
    lightbox.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__nav--prev')?.addEventListener('click', () => navigateLightbox(-1));
    lightbox.querySelector('.lightbox__nav--next')?.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.getAttribute('data-open') !== 'true') return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  // ─── Events Print View ────────────────────────────
  const printBtn = document.getElementById('print-events');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ─── Active Nav Highlighting ──────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });

  // ─── Scroll-triggered animations ──────────────────
  const animateEls = document.querySelectorAll('.animate-in');
  if (animateEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animateEls.forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }

})();
