// 1. Dynamic Year in Footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// 2. Light / Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const next = theme === 'light' ? 'dark' : 'light';
  themeToggle.setAttribute('aria-label', 'Switch to ' + next + ' mode');
  themeToggle.setAttribute('title', 'Switch to ' + next + ' mode');
}

applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// 3. Lightbox (certificate images and playable games)
const modal = document.getElementById('certModal');
const modalImg = document.getElementById('modalImage');
const modalGame = document.getElementById('modalGame');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.querySelector('.modal-close');
const certImages = document.querySelectorAll('.cert-img-wrapper:not(.game-thumb) img');
const gameThumbs = document.querySelectorAll('.game-thumb');

function closeModal() {
  modal.style.display = 'none';
  // Unload the game so it stops running when the pop-up closes
  modalGame.removeAttribute('srcdoc');
  modalGame.src = 'about:blank';
}

// Certificate images open as pictures
certImages.forEach(img => {
  img.addEventListener('click', () => {
    modalGame.style.display = 'none';
    modalImg.style.display = '';
    modalImg.src = img.src;
    modalCaption.textContent = img.alt;
    modal.style.display = 'flex';
  });
});

// Project thumbnails open the game itself
function decodeBase64Utf8(b64) {
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

gameThumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    const src = thumb.getAttribute('data-game-src');
    const embedded = window.GAME_SOURCES && window.GAME_SOURCES[src];

    modalImg.style.display = 'none';
    modalGame.style.display = 'block';

    if (embedded) {
      // Single-file version: the game is embedded in this page
      modalGame.srcdoc = decodeBase64Utf8(embedded);
    } else {
      // Normal folder version: load the game file next to index.html
      modalGame.removeAttribute('srcdoc');
      modalGame.src = src;
    }

    modalCaption.textContent = thumb.getAttribute('data-game-title');
    modal.style.display = 'flex';
  });
});

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'flex') {
    closeModal();
  }
});

// 4. Contact Form Submission Demo
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  alert(`Thank you, ${name}! Your message has been received.`);
  form.reset();
});