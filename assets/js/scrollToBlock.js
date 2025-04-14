export const scrollToBlock = (selector, duration = 1500, offset = -100) => {
  const element = document.querySelector(selector);
  if (!element) {
    window.location.href = `./${selector}`;
  }

  const targetY = element.getBoundingClientRect().top + window.scrollY + offset;
  const startY = window.scrollY;
  const startTime = performance.now();

  function scroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startY + (targetY - startY) * ease);

    if (progress < 1) {
      requestAnimationFrame(scroll);
    }
  }

  requestAnimationFrame(scroll);
};
