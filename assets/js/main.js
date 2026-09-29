(function () {
  var doc = document.documentElement;
  doc.classList.remove('no-js');

  // Mobile nav
  var toggle = document.querySelector('.nav__toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = doc.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav__menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        doc.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header shadow on scroll
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Client marquee: repeat each row's logos until they overflow the screen,
  // so the loop never shows a gap. Copies are hidden from screen readers.
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    document.querySelectorAll('.marquee').forEach(function (row) {
      var group = row.querySelector('.marquee__group');
      if (!group) return;
      var n = group.children.length;
      while (group.scrollWidth < window.innerWidth * 1.5 && n) {
        for (var i = 0; i < n; i++) group.appendChild(group.children[i].cloneNode(true)).setAttribute('aria-hidden', 'true');
      }
      var copy = group.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      row.appendChild(copy);
      row.style.setProperty('--speed', Math.round(group.scrollWidth / 45) + 's');
    });
  }

  // Services mega menu: hover/focus opens it on desktop; the chevron button
  // toggles it (and is the only way to open it in the mobile menu).
  document.querySelectorAll('.has-mega').forEach(function (item) {
    var btn = item.querySelector('.mega__toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && item.classList.contains('is-open')) {
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!item.contains(e.target) && window.innerWidth > 900) {
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Project slider
  document.querySelectorAll('.slider').forEach(function (slider) {
    var slides = slider.querySelectorAll('.case');
    var dots = slider.querySelectorAll('.slider__dot');
    var current = 0;
    var timer;
    function show(n) {
      n = (n + slides.length) % slides.length;
      if (n === current) return;
      slides[current].hidden = true;
      slides[n].hidden = false;
      slides[n].classList.remove('is-entering');
      void slides[n].offsetWidth;
      slides[n].classList.add('is-entering');
      dots[current].removeAttribute('aria-current');
      dots[n].setAttribute('aria-current', 'true');
      current = n;
    }
    function autoplay() {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(function () { show(current + 1); }, 7000);
    }
    slider.querySelector('.slider__arrow--prev').addEventListener('click', function () { show(current - 1); autoplay(); });
    slider.querySelector('.slider__arrow--next').addEventListener('click', function () { show(current + 1); autoplay(); });
    dots.forEach(function (dot, n) { dot.addEventListener('click', function () { show(n); autoplay(); }); });
    slider.addEventListener('mouseenter', function () { clearInterval(timer); });
    slider.addEventListener('mouseleave', autoplay);
    slider.addEventListener('focusin', function () { clearInterval(timer); });
    autoplay();
  });

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Contact form: no backend yet, so hand off to the visitor's email client.
  // To collect submissions server-side, set the form's action (e.g. Formspree)
  // and add data-native to the <form> to skip this handler.
  var form = document.querySelector('#contact-form');
  if (form && !form.hasAttribute('data-native')) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var subject = 'Enquiry: ' + (d.get('service') || 'General') + ' — ' + d.get('name');
      var body = [
        'Name: ' + d.get('name'),
        'Company: ' + (d.get('company') || '-'),
        'Email: ' + d.get('email'),
        'Phone: ' + (d.get('phone') || '-'),
        'Use: ' + (d.get('use') || '-'),
        'Service: ' + (d.get('service') || '-'),
        '',
        d.get('message')
      ].join('\n');
      window.location.href = 'mailto:info@splashnetech.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var status = form.querySelector('.form__status');
      if (status) status.textContent = 'Opening your email app… If nothing happens, email info@splashnetech.com directly.';
    });
  }
})();
