const observedElements = document.querySelectorAll('[data-observe]');

if ("IntersectionObserver" in window && observedElements.length) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      }
    },
    {
      threshold: 0.15
    }
  );

  observedElements.forEach((element) => observer.observe(element));
} else {
  observedElements.forEach((element) => element.classList.add('is-visible'));
}
