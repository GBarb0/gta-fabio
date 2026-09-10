// Replace these assets with landscape photos and transparent character cutouts.
const SCENES = [
  { background: 'assets/bg-1.png', rotation: [-3, -1.5], character: 'assets/char-1.png', title: 'Fabio, 21 anni.<br>Il livello sale.<br>La maturità può aspettare.' },
  { background: 'assets/bg-2.png', rotation: [3, 1.5], character: 'assets/char-2.png', title: 'Ti volevamo regalare<br>una macchina rubata.<br>Ma non sapevamo che colore.' },
  { background: 'assets/bg-3.png', rotation: [-1, -3.5], character: 'assets/char-3.png', title: 'Per i tuoi 21 anni<br>abbiamo fatto le cose in grande.<br>Con i tempi di Rockstar.' },
];
const SCENE_DURATION = 14000;
const GIFT_DURATION = 15000;
let giftElapsed = 0;
function resetGiftTimer() {
  giftElapsed = 0;
  document.querySelector("#gift-countdown").textContent = "15 s";
}
const stage = document.querySelector('#stage');
const dots = [...document.querySelectorAll('.scene-dot')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let current = 0, elapsed = 0, lastTime = null, paused = reducedMotion.matches, revealed = false, started = false;
const experience = document.querySelector('.experience');
const story = document.querySelector('#story');
const gift = document.querySelector('#gift');
function revealGift() {
  if (revealed) return;
  revealed = true;
  resetGiftTimer();
  story.inert = true;
  story.setAttribute('aria-hidden', 'true');
  gift.hidden = false;
  experience.classList.add('gift-open');
  experience.classList.remove('paused');
  document.querySelector('#pause').hidden = true;
  document.querySelector('#gift-title').focus({preventScroll: true});
}
function nextScene() { if (current === SCENES.length - 1) revealGift(); else showScene(current + 1); }
document.querySelector('#next').addEventListener('click', nextScene);
document.querySelector('#replay').addEventListener('click', () => {
  revealed = false;
  gift.hidden = true;
  document.querySelector('#signatures').hidden = true;
  experience.classList.remove('gift-open', 'signatures-open');
  story.inert = false;
  story.removeAttribute('aria-hidden');
  document.querySelector('#pause').hidden = false;
  showScene(0);
  updatePause();
  dots[0].focus();
});
document.documentElement.style.setProperty('--duration', `${SCENE_DURATION}ms`);
SCENES.forEach((scene, i) => {
  const layer = document.createElement('div');
  layer.className = `scene${i === 0 ? ' active' : ''}`;
  layer.style.setProperty('--rotation-start', `${scene.rotation[0]}deg`);
  layer.style.setProperty('--rotation-end', `${scene.rotation[1]}deg`);
  const background = document.createElement('div');
  background.className = 'backdrop';
  background.style.backgroundImage = `url("${scene.background}")`;
  const character = document.createElement('img');
  character.className = 'character'; character.src = scene.character; character.alt = '';
  layer.append(background, character); stage.append(layer);
});
function showScene(index) {
  current = (index + SCENES.length) % SCENES.length; elapsed = 0;
  [...stage.children].forEach((layer, i) => {
    layer.classList.toggle('active', i === current);
    if (i === current) layer.querySelectorAll('.backdrop, .character').forEach(el => {
      el.style.animationName = 'none'; void el.offsetWidth; el.style.animationName = '';
    });
  });
  dots.forEach((dot, i) => { dot.classList.toggle('active', i === current); dot.setAttribute('aria-pressed', String(i === current)); });
  document.querySelector('#scene-title').innerHTML = SCENES[current].title;
  experience.classList.toggle('third-scene', current === 2);
}
dots.forEach((dot, i) => dot.addEventListener('click', () => showScene(i)));
function updatePause() {
  document.querySelector('.experience').classList.toggle('paused', paused);
  document.querySelector('#pause').textContent = paused ? '▶' : 'Ⅱ';
  document.querySelector('#pause').setAttribute('aria-label', paused ? 'Riprendi animazione' : 'Pausa animazione');
}
document.querySelector('#pause').addEventListener('click', () => { paused = !paused; updatePause(); });
updatePause();
function tick(time) {
  if (lastTime !== null && revealed && !gift.hidden && !document.hidden) {
    giftElapsed += time - lastTime;
    document.querySelector('#gift-countdown').textContent = `${Math.max(0, Math.ceil((GIFT_DURATION - giftElapsed) / 1000))} s`;
    if (giftElapsed >= GIFT_DURATION) showSignatures();
  }
  if (lastTime !== null && started && !paused && !document.hidden && !revealed) elapsed += Math.min(time - lastTime, 100);
  lastTime = time;
  if (started && !revealed && elapsed >= SCENE_DURATION) nextScene();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
const audio = document.querySelector('#soundtrack');
const soundToggle = document.querySelector('#sound-toggle');
audio.volume = .45;
function updateAudio() {
  soundToggle.setAttribute('aria-label', audio.paused ? 'Riproduci musica' : 'Pausa musica');
  document.querySelector('#sound-icon').textContent = audio.paused ? '▶' : 'Ⅱ';
}
soundToggle.addEventListener('click', async () => {
  if (!audio.paused) audio.pause();
  else try { await audio.play(); } catch { document.querySelector('#status').textContent = 'Impossibile riprodurre la musica. Controlla il file audio e riprova.'; }
  updateAudio();
});
audio.addEventListener('play', updateAudio); audio.addEventListener('pause', updateAudio);
document.querySelector('#volume').addEventListener('input', event => { audio.volume = Number(event.target.value); });
const fullscreen = document.querySelector('#fullscreen');
if (!document.fullscreenEnabled) fullscreen.hidden = true;
fullscreen.addEventListener('click', async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
  catch { document.querySelector('#status').textContent = 'Lo schermo intero non è disponibile in questo browser.'; }
});
document.addEventListener('fullscreenchange', () => fullscreen.setAttribute('aria-label', document.fullscreenElement ? 'Esci da schermo intero' : 'Attiva schermo intero'));
document.addEventListener('keydown', event => {
  if (!started || revealed || /INPUT|BUTTON|A/.test(event.target.tagName)) return;
  if (event.key === 'ArrowRight') nextScene();
  if (event.key === 'ArrowLeft') showScene(Math.max(0, current - 1));
  if (event.code === 'Space') { event.preventDefault(); paused = !paused; updatePause(); }
});

const startButton = document.querySelector('#start');
startButton.addEventListener('click', async () => {
  startButton.disabled = true;
  try {
    // Called directly from the click so browsers allow sound from the first scene.
    await audio.play();
    started = true;
    document.querySelector('#intro').hidden = true;
    experience.hidden = false;
    lastTime = null;
    showScene(0);
    updatePause();
    updateAudio();
    document.querySelector('#next').focus({preventScroll: true});
  } catch {
    document.querySelector('#intro-status').textContent = 'La musica non è partita. Premi Play per riprovare.';
  } finally {
    startButton.disabled = false;
  }
});

// Signature SVG paths are embedded in index.html to work offline too.
const signaturePage = document.querySelector('#signatures');
function showSignatures() {
  gift.hidden = true;
  signaturePage.hidden = false;
  signaturePage.scrollTop = 0;
  experience.classList.add('signatures-open');
  document.querySelector('#signatures-title').focus({preventScroll:true});
}
document.querySelector('#show-signatures').addEventListener('click', showSignatures);
document.querySelector('#back-gift').addEventListener('click', () => {
  signaturePage.hidden = true;
  gift.hidden = false;
  resetGiftTimer();
  experience.classList.remove('signatures-open');
  document.querySelector('#gift-title').focus({preventScroll:true});
});
