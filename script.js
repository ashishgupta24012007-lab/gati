/* ===================================================
   GATI NODE TRANSPORT — INTERACTIONS & ANIMATIONS
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ---- JS ready ---- */
  document.body.classList.add('js-loaded');

  /* ---- DOM Refs ---- */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const backToTop = document.getElementById('backToTop');
  const navLinks  = document.querySelectorAll('.nav-links a, .mobile-nav a:not(.btn)');
  const toast     = document.getElementById('toast');

  /* ================================================
     1. HERO FLOATING PARTICLES
     ================================================ */
  const particleContainer = document.getElementById('heroParticles');
  if (particleContainer) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size     = Math.random() * 4 + 2;
      const left     = Math.random() * 100;
      const bottom   = Math.random() * 40;
      const duration = Math.random() * 8 + 6;
      const delay    = Math.random() * 8;
      const opacity  = Math.random() * 0.4 + 0.2;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${left}%; bottom:${bottom}%;
        opacity:${opacity};
        animation-duration:${duration}s;
        animation-delay:-${delay}s;
      `;
      particleContainer.appendChild(p);
    }
  }

  /* ================================================
     2. NAVBAR — scroll + active link
     ================================================ */
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const scrollY = window.scrollY;
    if (navbar)    navbar.classList.toggle('scrolled', scrollY > 60);
    if (backToTop) backToTop.classList.toggle('visible', scrollY > 600);

    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) link.classList.toggle('active', href === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ================================================
     3. MOBILE NAV
     ================================================ */
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ================================================
     4. HEADING SLIDE — direction-aware on every scroll
     Every section heading slides in from bottom (scroll down)
     or from top (scroll up), and resets when it leaves view
     so the animation repeats every time you pass it.
     ================================================ */
  const headings = document.querySelectorAll('.section-heading, .hero-title');
  let lastScrollY = window.scrollY;

  headings.forEach(h => h.classList.add('heading-anim'));

  if ('IntersectionObserver' in window) {
    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const scrollingDown = window.scrollY >= lastScrollY;

        if (entry.isIntersecting) {
          entry.target.classList.remove('slide-from-bottom', 'slide-from-top');
          requestAnimationFrame(() => {
            entry.target.classList.add('heading-visible');
          });
        } else {
          entry.target.classList.remove('heading-visible');
          if (scrollingDown) {
            entry.target.classList.add('slide-from-bottom');
            entry.target.classList.remove('slide-from-top');
          } else {
            entry.target.classList.add('slide-from-top');
            entry.target.classList.remove('slide-from-bottom');
          }
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    window.addEventListener('scroll', () => {
      lastScrollY = window.scrollY;
    }, { passive: true });

    headings.forEach(h => {
      h.classList.add('slide-from-bottom');
      headingObserver.observe(h);
    });
  }

  /* ================================================
     5. GENERAL SCROLL ANIMATIONS (fade-up / left / right)
     ================================================ */
  const animEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

  if ('IntersectionObserver' in window && animEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    animEls.forEach(el => observer.observe(el));
  } else {
    animEls.forEach(el => el.classList.add('visible'));
  }

  /* ================================================
     6. STATS COUNT-UP
     ================================================ */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let statsCounted  = false;

  function countUp(el) {
    const target = parseInt(el.dataset.target, 10);
    const steps  = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      el.textContent = Math.min(Math.round((target / steps) * step), target) + '+';
      if (step >= steps) { clearInterval(timer); el.textContent = target + '+'; }
    }, 2000 / steps);
  }

  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statsObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          statNumbers.forEach(el => countUp(el));
          statsObs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    const statsSection = document.getElementById('stats');
    if (statsSection) statsObs.observe(statsSection);
  }

  /* ================================================
     7. STAR RATING
     ================================================ */
  const starContainer = document.getElementById('starRating');
  const ratingInput   = document.getElementById('ratingValue');

  if (starContainer && ratingInput) {
    const stars = starContainer.querySelectorAll('.star');
    const setStars = (val, cls) => stars.forEach((s, i) => s.classList.toggle(cls, i < val));

    stars.forEach(star => {
      star.addEventListener('mouseenter', () => setStars(+star.dataset.value, 'hover'));
      star.addEventListener('click', () => {
        ratingInput.value = +star.dataset.value;
        setStars(+star.dataset.value, 'active');
      });
    });
    starContainer.addEventListener('mouseleave', () => stars.forEach(s => s.classList.remove('hover')));
  }

  /* ================================================
     8. TOAST
     ================================================ */
  function showToast(msg, dur) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), dur || 3000);
  }

  /* ================================================
     9. FORM SUBMISSIONS
     ================================================ */
  /* ================================================
     9. FORM SUBMISSIONS — mailto (opens Gmail compose)
     ================================================ */
  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', e => {
      e.preventDefault();
      if (ratingInput && ratingInput.value === '0') { showToast('⭐ Please select a star rating'); return; }

      const stars = ['','⭐','⭐⭐','⭐⭐⭐','⭐⭐⭐⭐','⭐⭐⭐⭐⭐'];
      const name   = document.getElementById('reviewName')?.value || '';
      const desig  = document.getElementById('reviewDesignation')?.value || '';
      const email  = document.getElementById('reviewEmail')?.value || '';
      const rating = stars[ratingInput.value] + ' (' + ratingInput.value + '/5)';
      const review = document.getElementById('reviewText')?.value || '';

      const subject = encodeURIComponent('New Client Review — ' + name);
      const body    = encodeURIComponent(
        'GATI NODE — NEW CLIENT REVIEW\n' +
        '================================\n\n' +
        'Name        : ' + name   + '\n' +
        'Designation : ' + desig  + '\n' +
        'Email       : ' + email  + '\n' +
        'Rating      : ' + rating + '\n\n' +
        'Review:\n' + review + '\n\n' +
        '================================'
      );

      window.open('mailto:gatinode.admin@gmail.com?subject=' + subject + '&body=' + body, '_blank');

      showToast('✅ Thank you! Your review has been submitted.');
      reviewForm.reset();
      if (ratingInput) ratingInput.value = '0';
      if (starContainer) starContainer.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const name    = document.getElementById('contactName')?.value    || '';
      const phone   = document.getElementById('contactPhone')?.value   || '';
      const email   = document.getElementById('contactEmail')?.value   || '';
      const service = document.getElementById('contactService')?.value || '';
      const details = document.getElementById('contactDetails')?.value || 'N/A';

      const subject = encodeURIComponent('New Enquiry from ' + name + ' — Gati Node');
      const body    = encodeURIComponent(
        'GATI NODE — NEW CUSTOMER ENQUIRY\n' +
        '==================================\n\n' +
        'Name / Company : ' + name    + '\n' +
        'Phone          : ' + phone   + '\n' +
        'Email          : ' + email   + '\n' +
        'Service        : ' + service + '\n\n' +
        'Additional Details:\n' + details + '\n\n' +
        '=================================='
      );

      window.open('mailto:gatinode.admin@gmail.com?subject=' + subject + '&body=' + body, '_blank');

      showToast('✅ Message sent!');
      contactForm.reset();
    });
  }

  /* ================================================
     10. SMOOTH SCROLL
     ================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 10 : 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  /* ================================================
     11. HERO MOUSE PARALLAX ON ORBS
     ================================================ */
  const heroSection = document.getElementById('home');
  const orbs = document.querySelectorAll('.orb');

  if (heroSection && orbs.length) {
    heroSection.addEventListener('mousemove', e => {
      const { left, top, width, height } = heroSection.getBoundingClientRect();
      const x = ((e.clientX - left) / width  - 0.5) * 30;
      const y = ((e.clientY - top)  / height - 0.5) * 30;
      orbs.forEach((orb, i) => {
        const f = (i + 1) * 0.5;
        orb.style.transform = `translate(${x * f}px, ${y * f}px)`;
      });
    });
    heroSection.addEventListener('mouseleave', () => {
      orbs.forEach(orb => { orb.style.transform = ''; });
    });
  }

});
