const sceneRoot = document.getElementById('scene-root');
const brandWordmark = document.getElementById('brand-wordmark');
const progressBar = document.getElementById('progress-bar');
const sceneCounter = document.getElementById('scene-counter');

const BRAND_MARK_SVG = '<svg class="brand-mark" width="88" height="88" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#10130F"/><ellipse cx="12.5" cy="19" rx="7" ry="4.5" fill="#FFFFFF" transform="rotate(-35 12.5 19)"/><ellipse cx="19.5" cy="13" rx="7" ry="4.5" fill="#F7DC7D" transform="rotate(-35 19.5 13)"/></svg>';

const BADGE_ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 17l6-6 4 4 6-8" stroke="#3D2E00" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 7h5v5" stroke="#3D2E00" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const CHECK_ICON = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5l3.5 3.5L13 4" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function escapeHTML(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function bulletList(items) {
  return (items || []).map(item =>
    '<div class="bullet-item"><span class="bullet-check">' + CHECK_ICON + '</span><span>' + escapeHTML(item) + '</span></div>'
  ).join('');
}

const TEMPLATES = {
  title(s) {
    return '<section class="scene scene--title">' +
      (s.kicker ? '<span class="scene-kicker">' + escapeHTML(s.kicker) + '</span>' : '') +
      '<h1 class="scene-heading">' + escapeHTML(s.heading) + '</h1>' +
      (s.text ? '<hr class="scene-hairline"><p class="scene-text">' + escapeHTML(s.text) + '</p>' : '') +
    '</section>';
  },
  content(s) {
    return '<section class="scene scene--content">' +
      '<div class="scene-copy">' +
        (s.kicker ? '<span class="scene-kicker">' + escapeHTML(s.kicker) + '</span>' : '') +
        '<h2 class="scene-heading">' + escapeHTML(s.heading) + '</h2>' +
        '<hr class="scene-hairline">' +
        '<p class="scene-text">' + escapeHTML(s.text) + '</p>' +
      '</div>' +
      (s.image
        ? '<div class="scene-visual">' +
            (s.badge ? '<span class="visual-badge">' + BADGE_ICON + escapeHTML(s.badge) + '</span>' : '') +
            '<img src="' + escapeHTML(s.image) + '" alt="' + escapeHTML(s.heading || '') + '">' +
          '</div>'
        : '') +
    '</section>';
  },
  stat(s) {
    return '<section class="scene scene--stat">' +
      (s.kicker ? '<span class="scene-kicker">' + escapeHTML(s.kicker) + '</span>' : '') +
      '<div class="stat-value">' + escapeHTML(s.stat) + '</div>' +
      '<p class="stat-label">' + escapeHTML(s.text) + '</p>' +
      (s.source ? '<div class="stat-source">' + escapeHTML(s.source) + '</div>' : '') +
    '</section>';
  },
  bullets(s) {
    return '<section class="scene scene--bullets">' +
      (s.kicker ? '<span class="scene-kicker">' + escapeHTML(s.kicker) + '</span>' : '') +
      '<h2 class="scene-heading">' + escapeHTML(s.heading) + '</h2>' +
      '<div class="bullet-list">' + bulletList(s.bullets) + '</div>' +
    '</section>';
  },
  quote(s) {
    return '<section class="scene scene--quote">' +
      '<div class="quote-mark">&ldquo;</div>' +
      '<p class="quote-text">' + escapeHTML(s.quote) + '</p>' +
      (s.attribution ? '<div class="quote-attr">' + escapeHTML(s.attribution) + '</div>' : '') +
    '</section>';
  },
  outro(s) {
    return '<section class="scene scene--outro">' +
      BRAND_MARK_SVG +
      '<div class="outro-wordmark">' + escapeHTML(s.heading || 'Reels') + '</div>' +
      (s.text ? '<p class="outro-tagline">' + escapeHTML(s.text) + '</p>' : '') +
      (s.cta ? '<span class="outro-cta">' + escapeHTML(s.cta) + '</span>' : '') +
    '</section>';
  }
};

function sceneHTML(scene) {
  const type = TEMPLATES[scene.type] ? scene.type : 'content';
  return TEMPLATES[type](scene);
}

function preloadImage(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

async function play() {
  let data;
  try {
    const res = await fetch('scenes.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    data = await res.json();
  } catch (err) {
    sceneRoot.innerHTML = '<section class="scene scene--title"><h1 class="scene-heading">Failed to load scenes.json</h1><p class="scene-text">' + escapeHTML(err) + '</p></section>';
    document.title = 'DONE';
    return;
  }

  if (data.brand && brandWordmark) brandWordmark.textContent = String(data.brand).toUpperCase();
  document.title = data.title ? data.title + ' — Rendering' : 'Rendering';

  const scenes = Array.isArray(data.scenes) ? data.scenes : [];
  await Promise.all(scenes.map(s => (s.image ? preloadImage(s.image) : Promise.resolve())));

  const gsapAvailable = typeof window.gsap !== 'undefined';

  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    const durationMs = Math.max(1, Number(s.duration) || 5) * 1000;

    sceneCounter.textContent = (i + 1) + ' / ' + scenes.length;
    sceneRoot.innerHTML = sceneHTML(s);
    const sceneEl = sceneRoot.firstElementChild;
    const animated = sceneEl ? Array.from(sceneEl.querySelectorAll('.scene-kicker, .scene-heading, .scene-text, .stat-value, .stat-label, .bullet-item, .quote-mark, .quote-text, .quote-attr, .scene-visual, .outro-wordmark, .outro-tagline, .outro-cta, .stat-source, .scene-hairline')) : [];

    if (gsapAvailable) {
      gsap.fromTo(sceneEl, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      gsap.fromTo(animated, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.09, delay: 0.12, ease: 'power3.out' });
      gsap.fromTo(progressBar, { width: '0%' }, { width: '100%', duration: durationMs / 1000, ease: 'none' });
    } else {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      requestAnimationFrame(() => {
        progressBar.style.transition = 'width ' + durationMs + 'ms linear';
        progressBar.style.width = '100%';
      });
    }

    await new Promise(r => setTimeout(r, durationMs));

    if (gsapAvailable) {
      gsap.to(sceneEl, { opacity: 0, duration: 0.35, ease: 'power2.in' });
      await new Promise(r => setTimeout(r, 380));
    }
  }

  sceneCounter.textContent = '';
  progressBar.style.width = '0%';
  sceneRoot.innerHTML = '';
  document.title = 'DONE';
}

window.ScenePlayer = { sceneHTML, TEMPLATES };

if (typeof document !== 'undefined' && document.getElementById('scene-root') && !window.__PREVIEW__) {
  play();
}
