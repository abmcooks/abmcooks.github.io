const motionOK = !matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease = t => 1 - Math.pow(1 - t, 3);

// ── Hero claim: split into per-letter spans for staggered choreography ──
if (motionOK) {
  let i = 0;
  document.querySelectorAll('#heroClaim .l').forEach(line => {
    [...line.childNodes].forEach(node => {
      const isEm = node.nodeName === 'EM';
      const text = node.textContent;
      const frag = document.createDocumentFragment();
      [...text].forEach(c => {
        if (c === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
        const s = document.createElement('span');
        s.className = 'ch'; s.textContent = c; s.style.setProperty('--i', i++);
        if (isEm) { s.style.color = 'var(--red)'; s.style.webkitTextStroke = '0'; }
        frag.appendChild(s);
      });
      line.replaceChild(frag, node);
    });
  });
}
// ── Loader: hold the curtain until the page is ready, then reveal the hero ──
(function(){
  const loader = document.getElementById('loader');
  const reveal = () => {
    document.body.classList.add('loaded');
    if (loader) loader.classList.add('done');
    if (motionOK) setTimeout(() => document.body.classList.add('filled'), 1700);
  };
  if (!motionOK) { reveal(); return; }              // reduced motion: no curtain
  const MIN = 1600, start = performance.now();      // let the tube light + dot pop once
  let done = false;
  const finish = () => {
    if (done) return; done = true;
    setTimeout(reveal, Math.max(0, MIN - (performance.now() - start)));
  };
  if (document.readyState === 'complete') finish();
  else addEventListener('load', finish);
  setTimeout(finish, 4500);                          // safety: never stuck
})();

// ── Breaker chain: auto-advance, click flips to the next word ──
{
  const chain = document.querySelector('.br-chain');
  const breaker = document.querySelector('.breaker');
  const total = chain.children.length - 1; // last word duplicates the first
  let wi = 0, timer = null;
  const resetToTop = () => {
    chain.style.transition = 'none';
    chain.style.transform = 'translateY(0)';
    wi = 0;
    chain.getBoundingClientRect(); // flush so the jump doesn't animate
  };
  const flip = fast => {
    if (wi >= total) resetToTop(); // clicked mid-wrap: snap home first
    wi++;
    const dur = motionOK ? (fast ? .38 : .75) : 0;
    chain.style.transition = dur ? `transform ${dur}s var(--ease)` : 'none';
    chain.style.transform = `translateY(${-wi * 1.08}em)`;
    if (!dur && wi === total) resetToTop(); // no transitionend without a transition
  };
  chain.addEventListener('transitionend', () => { if (wi === total) resetToTop(); });
  const start = () => { if (motionOK) timer = setInterval(() => flip(false), 2800); };
  start();
  breaker.addEventListener('click', () => { clearInterval(timer); flip(true); start(); });
}

// ── Custom cursor: red dot, hollows to outline over interactive ──
if (motionOK && matchMedia('(pointer:fine)').matches) {
  const cur = document.createElement('div');
  cur.className = 'cursor';
  document.body.appendChild(cur);
  document.body.classList.add('cursor-on');
  let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
  addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    cur.classList.toggle('is-link', !!e.target.closest('a, button, .breaker'));
  }, { passive: true });
  addEventListener('mousedown', () => cur.classList.add('is-down'));
  addEventListener('mouseup', () => cur.classList.remove('is-down'));
  document.documentElement.addEventListener('mouseleave', () => { cur.style.opacity = '0'; });
  document.documentElement.addEventListener('mouseenter', () => { cur.style.opacity = ''; });
  (function follow() {
    cx += (tx - cx) * .22; cy += (ty - cy) * .22;
    cur.style.left = cx + 'px'; cur.style.top = cy + 'px';
    requestAnimationFrame(follow);
  })();
}

// ── Mobile menu ──
{
  const menu = document.getElementById('menu');
  const burger = document.getElementById('burger');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-locked', open);
  };
  burger.addEventListener('click', () => setMenu(true));
  menu.addEventListener('click', e => { if (e.target.closest('a') || e.target.closest('.menu-close')) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
}

// ── Scroll reveals ──
const io = new IntersectionObserver((es) => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

// ── The SadaPay ad: 9 full-bleed cards, one message each, ~20s ──
{
  const loop = document.getElementById('sloop');
  const cards = [...loop.querySelectorAll('.sl-card')];
  const fmt = n => Math.round(n).toLocaleString('en-US');
  if (!motionOK) {
    loop.classList.add('static'); // park on the payoff card
  } else {
    const waitNum = loop.querySelector('[data-counter="wait"]');
    const usersNum = loop.querySelector('[data-counter="users"]');
    // counter that walks segments: {to, d} animates, {hold} pauses
    const runSegments = (el, segs) => {
      let i = 0, from = 0;
      const step = () => {
        if (i >= segs.length) return;
        const s = segs[i++];
        if (s.hold) { setTimeout(step, s.hold); return; }
        const t0 = performance.now();
        (function tick(t) {
          const p = Math.min((t - t0) / s.d, 1);
          el.textContent = fmt(from + (s.to - from) * ease(p)) + (s.suffix || '');
          if (p < 1) requestAnimationFrame(tick);
          else { from = s.to; step(); }
        })(t0);
      };
      step();
    };
    //        logo  first  87%   waitlist money users chips team acquired end
    const DUR = [2400, 2900, 2700, 3600,   3200, 3400, 5400, 2900, 3600, 2600];
    let ci = 0, timer = null;
    const show = i => {
      cards.forEach((c, j) => c.classList.toggle('on', j === i));
      if (i === 3) { // waitlist: milestone pacing — 100K, 300K, then the run
        waitNum.textContent = '0';
        runSegments(waitNum, [
          { to: 100000, d: 700 }, { hold: 350 },
          { to: 300000, d: 600 }, { hold: 300 },
          { to: 700000, d: 700 }
        ]);
      }
      if (i === 5) { usersNum.textContent = '0'; runSegments(usersNum, [{ to: 4000000, d: 1900, suffix: '+' }]); }
    };
    const advance = () => {
      ci = (ci + 1) % cards.length;
      show(ci);
      timer = setTimeout(advance, DUR[ci]);
    };
    const loopIO = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && !timer) timer = setTimeout(advance, DUR[ci]);
      else if (!e.isIntersecting && timer) { clearTimeout(timer); timer = null; }
    }), { threshold: 0.3 });
    loopIO.observe(loop);
  }
}

// ── Chapter film: tap for sound (inside a link — don't navigate); pause offscreen ──
document.querySelectorAll('.vid-sound').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    const v = btn.closest('.chap').querySelector('video');
    v.muted = !v.muted;
    btn.classList.toggle('sound-on', !v.muted);
    btn.setAttribute('aria-label', v.muted ? 'Unmute video' : 'Mute video');
  });
});
// ── Theater mode: the plate shows on any activity, then rests after 2s
//    of stillness — including when you arrive by scroll and never move
//    the mouse. Fine pointers only; touch/keyboard always see it. ──
if (motionOK && matchMedia('(pointer:fine)').matches) {
  const chList = [...document.querySelectorAll('.chap')];
  const arm = chap => {
    clearTimeout(chap._idle);
    chap._idle = setTimeout(() => chap.classList.add('plate-rest'), 2000);
  };
  const wake = chap => { chap.classList.remove('plate-rest'); arm(chap); };
  chList.forEach(chap => {
    chap.addEventListener('mousemove', () => wake(chap), { passive: true });
    chap.addEventListener('mouseleave', () => wake(chap));
  });
  const restIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) arm(e.target);
    else { clearTimeout(e.target._idle); e.target.classList.remove('plate-rest'); }
  }), { threshold: 0.4 });
  chList.forEach(c => restIO.observe(c));
  addEventListener('scroll', () => chList.forEach(c => { if (c.classList.contains('plate-rest')) wake(c); }), { passive: true });
}

const vidIO = new IntersectionObserver(es => es.forEach(e => {
  const v = e.target;
  if (e.isIntersecting) { if (motionOK) v.play().catch(() => {}); }
  else { v.pause(); if (!v.muted) { v.muted = true; const b = v.parentElement.querySelector('.vid-sound'); b && b.classList.remove('sound-on'); } }
}), { threshold: 0.25 });
document.querySelectorAll('.chap video').forEach(v => { if (!motionOK) v.removeAttribute('autoplay'); vidIO.observe(v); });

// ── Stats: count up on entry ──
const statIO = new IntersectionObserver((es) => {
  es.forEach(e => {
    if (!e.isIntersecting) return;
    statIO.unobserve(e.target);
    const el = e.target, n = +el.dataset.num;
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    if (!motionOK) return; // static fallback already in markup
    el.classList.add('counting'); // outlined while counting, fills on landing
    const t0 = performance.now(), dur = 1400;
    (function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = pre + Math.round(ease(p) * n) + suf;
      if (p < 1) requestAnimationFrame(tick);
      else el.classList.remove('counting');
    })(t0);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-v').forEach(el => statIO.observe(el));

// ── Magnetic pull on big CTAs ──
if (motionOK && matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.btn-circle, .btn, .btn-sec, .nav-cta').forEach(host => {
    const target = host.querySelector('.big') || host;
    host.addEventListener('mousemove', e => {
      const r = host.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      target.style.translate = `${dx * 0.18}px ${dy * 0.18}px`;
    });
    host.addEventListener('mouseleave', () => {
      target.style.transition = 'translate .5s cubic-bezier(.23,1,.32,1)';
      target.style.translate = '0px 0px';
      setTimeout(() => target.style.transition = '', 500);
    });
  });
}

// ── Nav hide on scroll ──
let last = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  document.getElementById('nav').classList.toggle('hide', y > last && y > 120);
  last = y;
}, { passive: true });
