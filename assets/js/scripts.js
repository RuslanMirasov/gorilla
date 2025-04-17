// import { Popup } from './popup-manager.js';
import { popup } from './popup.js';
import { throttle } from './throttle.js';
import { accordeonToggle } from './accordeon.js';
import { scrollToBlock } from './scrollToBlock.js';

const animatedElements = document.querySelectorAll('[data-animate]');
const backgroundEl = document.querySelector('[data-background]');
const faqEl = document.querySelector('[data-questions]');

const initAnimations = () => {
  if (animatedElements.length === 0) return;
  animatedElements.forEach(anim => anim.classList.add('animate'));
};

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

  const fadeStart = 200;
  const fadeEnd = fadeStart + windowHeight; // на протяжении одного экрана

  let opacity = 1;

  if (scrollY <= fadeStart) {
    opacity = 1;
  } else if (scrollY > fadeStart && scrollY < fadeEnd) {
    const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
    opacity = 1 - progress * 0.7; // до 0.3
  } else {
    opacity = 0.3;
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

window.addEventListener('load', () => {
  hidePreloader();
  initAnimations();
});
