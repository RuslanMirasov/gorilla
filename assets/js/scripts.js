import { Popup } from './popup-manager.js';
import { initConnect, initSprites } from './connect.js';

const initNavigationMenu = () => {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.navigation ');

  const toggleMenu = () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
  };

  burger.addEventListener('click', toggleMenu);
};

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
});
