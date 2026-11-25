(function () {
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Menü: kaydırınca dolu zemin
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Açık / kapalı: her gün 09:00 – 00:00, Türkiye saati
  function istanbulHour() {
    try {
      var parts = new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var h = 0, m = 0;
      parts.forEach(function (p) { if (p.type === 'hour') h = +p.value; if (p.type === 'minute') m = +p.value; });
      return h % 24 + m / 60;
    } catch (e) { return null; }
  }
  var t = istanbulHour();
  if (t !== null) {
    var open = t >= 9;
    var short = open ? 'Şu an açık · 00:00\'a kadar' : 'Şu an kapalı · 09:00\'da açılıyor';
    var long = open ? 'Şu an açık. Bugün gece 00:00\'a kadar buradayız.' : 'Şu an kapalı. Her gün 09:00\'da açılıyor.';
    document.querySelectorAll('[data-status]').forEach(function (el) { el.textContent = short; el.classList.toggle('is-open', open); });
    document.querySelectorAll('[data-status-long]').forEach(function (el) { el.textContent = long; el.classList.toggle('is-open', open); });
    document.querySelectorAll('[data-status-dot]').forEach(function (el) { el.classList.toggle('is-open', open); });
  }
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Görünür olunca belirme
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Kısa videolar: ekrana girince yükle ve oynat
  var reels = document.querySelectorAll('video[data-src]');
  if ('IntersectionObserver' in window) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.src) v.src = v.dataset.src;
          if (!reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else { v.pause(); }
      });
    }, { threshold: 0.35 });
    reels.forEach(function (v) { vo.observe(v); });
  } else {
    reels.forEach(function (v) { v.src = v.dataset.src; v.controls = true; });
  }
  if (reduce) {
    var hv = document.querySelector('.hero video');
    if (hv) { hv.removeAttribute('autoplay'); hv.pause(); }
  }

  // Köşk fotoğrafında hafif paralaks
  var par = document.querySelector('.kosk-wide img');
  if (par && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var r = par.parentElement.getBoundingClientRect();
        var prog = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        if (prog > 0 && prog < 1) par.style.transform = 'translateY(' + (-prog * 16) + '%)';
        ticking = false;
      });
    }, { passive: true });
  }
})();
