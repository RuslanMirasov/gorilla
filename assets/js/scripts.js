import { Popup } from './popup-manager.js';
import { initConnect, initSprites } from './connect.js';
import { throttle } from './throttle.js';
import { accordeonToggle } from './accordeon.js';

const backgroundEl = document.querySelector('[data-background]');
const faqEl = document.querySelector('[data-questions]');

const initNavigationMenu = () => {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.navigation ');

  const toggleMenu = () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
  };

  burger.addEventListener('click', toggleMenu);
};

function updateOpacity() {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;

  const scrollMiddle = scrollY + windowHeight / 2;
  const middleOfPage = docHeight / 2;

  const distance = Math.abs(scrollMiddle - middleOfPage);
  const maxDistance = middleOfPage;

  const normalized = distance / maxDistance;
  const opacity = 0.1 + 1 * normalized;

  backgroundEl.style.opacity = opacity.toFixed(2);
}

const hidePreloader = () => {
  const preloader = document.querySelector('[data-preloader]');
  if (!preloader) return;

  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 200);
};

initConnect().then(() => {
  initSprites('./assets/img/svg/sprite.svg');
  Popup.init('./components/popups.html');
  hidePreloader();
  initNavigationMenu();
  updateOpacity();
  window.addEventListener('scroll', throttle(updateOpacity, 50));
  faqEl.addEventListener('click', accordeonToggle);
});
