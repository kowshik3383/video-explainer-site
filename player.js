const stage = document.getElementById('stage');
const sceneImage = document.getElementById('scene-image');
const sceneHeading = document.getElementById('scene-heading');
const sceneText = document.getElementById('scene-text');
const progressBar = document.getElementById('progress-bar');
const sceneCounter = document.getElementById('scene-counter');

function preloadImage(url) {
  return new Promise((resolve) => {
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
    sceneHeading.textContent = 'Failed to load scenes.json';
    sceneText.textContent = String(err);
    document.title = 'DONE';
    return;
  }

  document.title = data.title ? data.title + ' — Rendering' : 'Rendering';

  const scenes = Array.isArray(data.scenes) ? data.scenes : [];
  await Promise.all(scenes.map(s => s.image ? preloadImage(s.image) : Promise.resolve()));

  const gsapAvailable = typeof window.gsap !== 'undefined';

  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    const durationMs = Math.max(1, Number(s.duration) || 5) * 1000;

    sceneImage.src = s.image || '';
    sceneImage.style.opacity = s.image ? 0.55 : 0;
    sceneHeading.textContent = s.heading || '';
    sceneText.textContent = s.text || '';
    sceneCounter.textContent = (i + 1) + ' / ' + scenes.length;

    if (gsapAvailable) {
      gsap.set([sceneHeading, sceneText], { opacity: 0, y: 40 });
      gsap.set(sceneImage, { opacity: 0, scale: 1.06 });
      gsap.to(sceneImage, { opacity: s.image ? 0.55 : 0, scale: 1, duration: 1.1, ease: 'power2.out' });
      gsap.to(sceneHeading, { opacity: 1, y: 0, duration: 0.8, delay: 0.25, ease: 'power3.out' });
      gsap.to(sceneText, { opacity: 1, y: 0, duration: 0.8, delay: 0.45, ease: 'power3.out' });
      gsap.fromTo(progressBar, { width: '0%' }, { width: '100%', duration: durationMs / 1000, ease: 'none' });
      await new Promise(r => setTimeout(r, durationMs));
      gsap.to([sceneHeading, sceneText, sceneImage], { opacity: 0, duration: 0.4, ease: 'power2.in' });
      await new Promise(r => setTimeout(r, 450));
    } else {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      await new Promise(r => setTimeout(r, 50));
      progressBar.style.transition = 'width ' + durationMs + 'ms linear';
      progressBar.style.width = '100%';
      await new Promise(r => setTimeout(r, durationMs));
    }
  }

  sceneHeading.textContent = data.title || 'The End';
  sceneText.textContent = '';
  sceneImage.style.opacity = 0;
  sceneCounter.textContent = '';
  progressBar.style.width = '0%';

  if (gsapAvailable) {
    gsap.fromTo(sceneHeading, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' });
  } else {
    sceneHeading.style.opacity = 1;
  }

  await new Promise(r => setTimeout(r, 2500));
  document.title = 'DONE';
}

play();
