const progressBar = document.getElementById("readingProgress");
const progressTarget = document.querySelector("[data-progress-target]");

if (progressBar && progressTarget) {
  const calculateProgress = () => {
    const rect = progressTarget.getBoundingClientRect();
    const start = window.scrollY + rect.top;
    const end = start + progressTarget.offsetHeight - window.innerHeight;
    const scrollY = window.scrollY;

    if (end <= start) {
      progressBar.style.clipPath = "inset(0 0 0 0)";
      return;
    }

    const progress = Math.min(Math.max((scrollY - start) / (end - start), 0), 1);
    const rightInset = (1 - progress) * 100;
    progressBar.style.clipPath = `inset(0 ${rightInset}% 0 0)`;
  };

  calculateProgress();
  window.addEventListener("scroll", calculateProgress, { passive: true });
  window.addEventListener("resize", calculateProgress);
}
