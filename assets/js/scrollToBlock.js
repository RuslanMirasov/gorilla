export const scrollToBlock = (selector, offset = 0) => {
  const element = document.querySelector(selector);
  if (!element) {
    window.location.href = `./${selector}`;
    return;
  }

  const y = element.getBoundingClientRect().top + window.scrollY + offset;

  window.scrollTo({
    top: y,
    behavior: 'smooth',
  });
};
