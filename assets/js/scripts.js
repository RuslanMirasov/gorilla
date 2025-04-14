// import { Popup } from './popup-manager.js';
import { popup } from './popup.js';
import { throttle } from './throttle.js';
import { accordeonToggle } from './accordeon.js';
import { scrollToBlock } from './scrollToBlock.js';

const backgroundEl = document.querySelector('[data-background]');
const faqEl = document.querySelector('[data-questions]');

const initNavigationMenu = () => {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.navigation ');

  const toggleMenu = () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
  };

  const closeMenu = () => {
    burger.classList.remove('open');
    menu.classList.remove('open');
  };

  const handleMenuClick = e => {
    if (e.target.hasAttribute('data-scrollto')) {
      e.preventDefault();
      const target = e.target.href.split('#')[1];
      closeMenu();
      scrollToBlock(`#${target}`);
    }
  };

  burger.addEventListener('click', toggleMenu);
  document.addEventListener('click', handleMenuClick);
};

function updateOpacity() {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;

  const fadeOutStart = windowHeight;
  const fadeOutEnd = fadeOutStart + windowHeight;
  const fadeInStart = docHeight - windowHeight * 3;
  const fadeInEnd = docHeight - windowHeight;

  let opacity = 0.3;

  if (scrollY < fadeOutStart || scrollY >= fadeInEnd) {
    opacity = 1;
  } else if (scrollY < fadeOutEnd) {
    const progress = (scrollY - fadeOutStart) / windowHeight;
    opacity = 1 - progress * 0.9;
  } else if (scrollY >= fadeInStart && scrollY < fadeInEnd) {
    const progress = (scrollY - fadeInStart) / (windowHeight * 2);
    opacity = 0.1 + progress * 0.9;
  }

  backgroundEl.style.opacity = opacity.toFixed(2);
}

const hidePreloader = () => {
  const preloader = document.querySelector('[data-preloader]');
  if (!preloader) return;

  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 200);
};

popup.init();
window.popup = popup;
initNavigationMenu();
updateOpacity();
window.addEventListener('scroll', throttle(updateOpacity, 50));
faqEl && faqEl.addEventListener('click', accordeonToggle);
hidePreloader();
