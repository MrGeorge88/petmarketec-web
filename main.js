/* Petmarketec · World's Best Cat Litter Ecuador · interacciones */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Nav sólido al hacer scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Hero: partículas de maíz (canvas) ---------- */
  const canvas = document.getElementById('kernels');
  if (canvas && !reduce) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, grains = [];
    const N = () => Math.min(90, Math.floor((w * h) / 16000));
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      grains = Array.from({ length: N() }, () => spawn(true));
    }
    function spawn(anywhere) {
      const s = 3 + Math.random() * 6;
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 20,
        s, rx: s, ry: s * (0.55 + Math.random() * 0.25),
        vy: -(0.15 + Math.random() * 0.35),
        vx: (Math.random() - 0.5) * 0.2,
        rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.01,
        a: 0.25 + Math.random() * 0.5,
        c: Math.random() < 0.7 ? '#F2B825' : '#F7CE55',
      };
    }
    let mx = -1e4, my = -1e4;
    canvas.parentElement.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
    });
    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < grains.length; i++) {
        const g = grains[i];
        const dx = g.x - mx, dy = g.y - my, d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140) { const f = (1 - Math.sqrt(d2) / 140) * 0.6; g.x += dx / Math.sqrt(d2) * f * 4; g.y += dy / Math.sqrt(d2) * f * 4; }
        g.x += g.vx; g.y += g.vy; g.rot += g.vr;
        if (g.y < -20 || g.x < -20 || g.x > w + 20) grains[i] = spawn(false);
        ctx.save();
        ctx.translate(g.x, g.y); ctx.rotate(g.rot);
        ctx.globalAlpha = g.a; ctx.fillStyle = g.c;
        ctx.beginPath(); ctx.ellipse(0, 0, g.rx, g.ry, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(tick);
    }
    resize(); window.addEventListener('resize', resize); tick();
  }

  /* ---------- Hero: titular palabra por palabra ---------- */
  const title = document.querySelector('[data-split]');
  if (title) {
    const accent = new Set(['dura', 'más,', 'pesa', 'menos', 'polvo.']);
    const words = title.textContent.trim().split(/\s+/);
    title.innerHTML = words.map((wd) => `<span class="w${accent.has(wd) ? ' w-accent' : ''}">${wd} </span>`).join('');
  }
  if (hasGsap && !reduce) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero__title .w', { y: 40, opacity: 0, duration: 0.9, stagger: 0.05 }, 0.1)
      .from('[data-hero]', { y: 24, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.5);
  }

  /* ---------- Contadores ---------- */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    if (!hasGsap || reduce) return;
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 1.6, ease: 'power2.out', delay: 0.8,
      onUpdate: () => { el.textContent = pre + Math.round(o.v) + suf; },
    });
  });

  /* ---------- Reveals genéricos (IntersectionObserver + CSS) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    revealEls.forEach((el) => io.observe(el));
    // Seguridad: si algo queda fuera de pantalla por más de 4 s, se muestra igual.
    setTimeout(() => revealEls.forEach((el) => el.classList.add('is-in')), 4000);
  }

  /* ---------- Por qué maíz: razón activa + bolsa ---------- */
  const reasons = document.querySelectorAll('.reason');
  const badge = document.getElementById('whyBadge');
  const bag = document.querySelector('.bag');
    function activate(li) {
    reasons.forEach((r) => r.classList.toggle('is-active', r === li));
    if (badge) badge.innerHTML = `<span>${li.dataset.reason}</span> ${li.dataset.label}`;
  }
  if (reasons.length) activate(reasons[0]);
  if (hasGsap && !reduce) {
    reasons.forEach((li) => {
      ScrollTrigger.create({
        trigger: li, start: 'top 55%', end: 'bottom 55%',
        onEnter: () => activate(li), onEnterBack: () => activate(li),
      });
    });
    if (bag) {
      gsap.to(bag, {
        rotate: 8, y: -10, ease: 'none',
        scrollTrigger: { trigger: '.why__list', start: 'top 60%', end: 'bottom 40%', scrub: 0.4 },
      });
      gsap.to('.bag__seal line', { strokeDashoffset: -140, duration: 6, repeat: -1, ease: 'none' });
    }
  } else {
    reasons.forEach((r) => r.classList.add('is-active'));
  }

  /* ---------- Comparativa: filas que se encienden ---------- */
  if (hasGsap && !reduce) {
    document.querySelectorAll('.cmp tbody tr').forEach((tr, i) => {
      ScrollTrigger.create({
        trigger: tr, start: 'top 60%', end: 'bottom 60%',
        onToggle: (s) => tr.classList.toggle('is-lit', s.isActive),
      });
    });
  }

  /* ---------- Calculadora ---------- */
  const form = document.getElementById('calc');
  if (form) {
    const DAYS_PER_LB_PER_CAT = 38 / 8; // tabla oficial: 8 lb → 38+ días, 1 gato
    const out = {
      days: document.getElementById('days'), cats: document.getElementById('catsOut'),
      lb: document.getElementById('lbOut'), bags: document.getElementById('bagsYear'),
      bar: document.getElementById('bar'), hint: document.getElementById('hint'),
    };
    const hints = {
      1: { 7: 'Ideal para un solo gato. Si tienes dos, la de 14 lb te sale más cómoda.', 14: 'Más de dos meses sin volver a comprar. Buena opción si prefieres pedir menos seguido.', 28: 'Cuatro meses para un gato. Guárdala bien cerrada para que rinda igual hasta el final.' },
      2: { 7: 'Con dos gatos se acaba en dos semanas; la de 14 o 28 lb te conviene más.', 14: 'La medida justa para dos gatos: poco más de un mes por bolsa.', 28: 'Más de dos meses para dos gatos. Es la bolsa que más rinde por kilo.' },
      3: { 7: 'Para tres gatos esta bolsa es de emergencia. Mira la de 28 lb.', 14: 'Tres semanas. Considera la de 28 lb para pedir menos seguido.', 28: 'Mes y medio para tres gatos. Recuerda: una caja más que gatos.' },
      4: { 7: 'Con cuatro gatos, esta bolsa dura poco más de una semana.', 14: 'Dos semanas. Con cuatro gatos, la de 28 lb es la única que tiene sentido.', 28: 'Un mes para cuatro gatos. Recoger a diario es clave para que rinda.' },
    };
    let shown = +out.days.textContent;
    function update() {
      const cats = +form.cats.value, lb = +form.lb.value;
      const days = Math.round(DAYS_PER_LB_PER_CAT * lb / cats);
      out.cats.textContent = cats + (cats === 1 ? ' gato' : ' gatos');
      out.lb.textContent = lb + ' lb';
      out.bags.textContent = Math.ceil(365 / days);
      out.bar.style.width = Math.min(100, days / 140 * 100) + '%';
      out.hint.textContent = hints[cats][lb];
      if (hasGsap && !reduce) {
        const o = { v: shown };
        gsap.to(o, { v: days, duration: 0.6, ease: 'power2.out', onUpdate: () => { out.days.textContent = Math.round(o.v); } });
      } else out.days.textContent = days;
      shown = days;
    }
    form.addEventListener('change', update);
    update();
  }

  /* ---------- Tarjetas de producto: tilt 3D ---------- */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
})();
