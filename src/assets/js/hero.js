const docEl = document.documentElement;
const heroSection = document.querySelector('.hero');
const heroMedia = heroSection?.querySelector('.hero__media');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

if (heroSection && heroMedia && !motionQuery.matches) {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const minOpacity = 0.25;
  let heroStart = 0;
  let fadeDistance = 0;
  let ticking = false;

  const setOpacity = (value) => {
    docEl.style.setProperty('--hero-media-opacity', value.toFixed(3));
  };

  const recalculateBounds = () => {
    const rect = heroSection.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    heroStart = scrollY + rect.top;
    fadeDistance = Math.max(heroSection.offsetHeight * 0.8, 280);
  };

  const updateOpacity = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const distanceIntoHero = scrollY - heroStart;

    if (distanceIntoHero <= 0) {
      setOpacity(1);
      return;
    }

    const progress = clamp(distanceIntoHero / fadeDistance, 0, 1);
    const opacity = 1 - progress * (1 - minOpacity);
    setOpacity(opacity);
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        updateOpacity();
        ticking = false;
      });
    }
  };

  let resizeTimeout;
  const onResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      recalculateBounds();
      updateOpacity();
    }, 100);
  };

  recalculateBounds();
  updateOpacity();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
} else if (heroSection && heroMedia) {
  docEl.style.setProperty('--hero-media-opacity', '1');
}
