// Слова статьи проявляются по мере прокрутки: от приглушённых до полной яркости.
const root = document.querySelector('.body');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (root && !reduce) {
  const words = [];
  let base = 0.26, ticking = false;
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  for (let n; (n = tw.nextNode()); ) {
    if (n.nodeValue.trim() && n.parentNode.closest('p, li')) nodes.push(n);
  }
  for (const t of nodes) {
    const f = document.createDocumentFragment();
    for (const s of t.nodeValue.split(/(\s+)/)) {
      if (!s) continue;
      if (/^\s+$/.test(s)) { f.append(s); continue; }
      const e = document.createElement('span');
      e.className = 'w';
      e.textContent = s;
      f.append(e);
      words.push({ el: e, top: 0, q: -1 });
    }
    t.replaceWith(f);
  }
  const paint = () => {
    ticking = false;
    const vh = innerHeight, sy = scrollY, dim = vh * 0.82, lit = vh * 0.5;
    for (const w of words) {
      let p = (dim - (w.top - sy)) / (dim - lit);
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      const q = Math.round(p * 20) / 20;
      if (q !== w.q) { w.q = q; w.el.style.opacity = (base + (1 - base) * q).toFixed(3); }
    }
  };
  const measure = () => {
    base = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dim')) || 0.26;
    const sy = scrollY;
    for (const w of words) { const r = w.el.getBoundingClientRect(); w.top = r.top + sy + r.height / 2; w.q = -1; }
    paint();
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
  addEventListener('resize', measure);
  addEventListener('themechange', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(root);
  document.fonts?.ready.then(measure);
  measure();
} else if (root) {
  root.classList.add('nofx');
}
