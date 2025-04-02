import { initPopups, Popup } from './popup-manager.js';
import { initConnect, initSprites } from './connect.js';

const initApp = () => {
  const refs = {
    body: document.querySelector('body'),
    preloader: document.querySelector('[data-preloader]'),
    popupOpenElements: document.querySelectorAll('[data-popup-open]'),
  };

  const hidePreloader = () => {
    refs.body.classList.add('ready');
    setTimeout(() => {
      refs.preloader.classList.add('hidden');
    }, 200);
  };

  refs.popupOpenElements.forEach(btn =>
    btn.addEventListener('click', e => {
      e.preventDefault();
      Popup.open(e.currentTarget.dataset.popupOpen);
    })
  );

  hidePreloader();
};

document.addEventListener('DOMContentLoaded', async () => {
  await initConnect().then(() => initApp());
  initSprites('./assets/img/svg/sprite.svg');
  initPopups('./components/popups.html', ['ok']);
});
