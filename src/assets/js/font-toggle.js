const toggleButton = document.querySelector('[data-font-toggle]');
const siteMain = document.querySelector('.site-main');
const siteFooter = document.querySelector('.site-footer');
const STORAGE_KEY = 'treadmill-font-size';

const applyPreference = (mode) => {
  const elements = [siteMain, siteFooter].filter(Boolean);
  
  if (mode === 'large') {
    elements.forEach(el => el.classList.add('font-size-large'));
    if (toggleButton) {
      toggleButton.setAttribute('aria-pressed', 'true');
    }
  } else {
    elements.forEach(el => el.classList.remove('font-size-large'));
    if (toggleButton) {
      toggleButton.setAttribute('aria-pressed', 'false');
    }
  }
};

let storedPreference = null;

try {
  storedPreference = window.localStorage.getItem(STORAGE_KEY);
} catch (error) {
  storedPreference = null;
}

if (storedPreference) {
  applyPreference(storedPreference);
}

if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    const elements = [siteMain, siteFooter].filter(Boolean);
    const isLarge = siteMain && siteMain.classList.contains('font-size-large');
    const newMode = isLarge ? 'normal' : 'large';
    
    applyPreference(newMode);
    
    try {
      window.localStorage.setItem(STORAGE_KEY, newMode);
    } catch (error) {
      // ignore persistence errors
    }
  });
}
