export const popup = {
  _backdrop: null,
  _popup: null,
  _isOpening: false,
  _isAnimating: false,

  init() {
    this._backdrop = document.querySelector('[data-backdrop]');
    this._popup = this._backdrop?.querySelector('[data-popup]');

    if (!this._backdrop || !this._popup) {
      console.warn('Контейнеры для попапа не найдены');
      return;
    }

    this._bindCloseEvents();
  },

  async open(id) {
    if (this._isOpening || this._isAnimating) return;
    this._isOpening = true;

    const newContent = this._popup.querySelector(`#${id}`);
    if (!newContent) {
      console.warn(`Попап с id="${id}" не найден`);
      this._isOpening = false;
      return;
    }

    const isVisible = this._popup.classList.contains('visible');

    if (isVisible) {
      this._popup.classList.remove('visible');
      await this._waitForTransition(this._backdrop, 'opacity');
      this._popup.querySelectorAll('.popup-content').forEach(el => {
        el.style.display = 'none';
      });
      newContent.style.display = 'block';
      this._popup.classList.add('visible');
    } else {
      // Сначала показываем нужный
      this._popup.querySelectorAll('.popup-content').forEach(el => {
        el.style.display = el.id === id ? 'block' : 'none';
      });

      const scrollbarWidth = this._getScrollbarWidth();
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.classList.add('locked');
      this._adjustFixedElements(scrollbarWidth);

      this._backdrop.classList.add('active');
      this._popup.classList.add('visible');

      await this._waitForTransition(this._backdrop, 'opacity');
    }

    this._isOpening = false;
  },

  async close() {
    if (!this._popup || !this._backdrop || this._isAnimating) return;

    this._popup.classList.remove('visible');
    this._backdrop.classList.remove('active');

    await this._waitForTransition(this._backdrop, 'opacity');

    this._popup.querySelectorAll('.popup-content').forEach(el => {
      el.style.display = 'none';
    });

    document.body.classList.remove('locked');
    document.body.style.paddingRight = '';
    this._adjustFixedElements(0);
  },

  async _waitForTransition(element, propertyName = 'opacity') {
    this._isAnimating = true;

    return new Promise(resolve => {
      const computed = getComputedStyle(element);
      const duration = parseFloat(computed.transitionDuration) * 1000;

      if (duration === 0) {
        this._isAnimating = false;
        resolve();
        return;
      }

      let finished = false;

      const handler = e => {
        if (e.propertyName !== propertyName) return;
        finished = true;
        element.removeEventListener('transitionend', handler);
        this._isAnimating = false;
        resolve();
      };

      element.addEventListener('transitionend', handler, { once: true });

      setTimeout(() => {
        if (!finished) {
          element.removeEventListener('transitionend', handler);
          this._isAnimating = false;
          resolve();
        }
      }, duration + 50);
    });
  },

  _bindCloseEvents() {
    document.addEventListener('click', e => {
      const openBtn = e.target.closest('[data-popup-open]');
      if (!openBtn || this._isAnimating) return;

      const popupId = openBtn.dataset.popupOpen;
      if (popupId) {
        e.preventDefault();
        this.open(popupId);
      }
    });

    document.addEventListener('keydown', e => {
      if (this._isAnimating) return;
      if (e.key === 'Escape') {
        this.close();
      }
    });

    if (this._backdrop) {
      this._backdrop.addEventListener('click', e => {
        if (this._isAnimating) return;
        if (e.target === this._backdrop || e.target.hasAttribute('data-popup-close')) {
          this.close();
        }
      });
    }
  },

  _getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  },

  _adjustFixedElements(scrollbarWidth) {
    document.querySelectorAll('[data-fixed]').forEach(el => {
      const style = getComputedStyle(el);

      // Очистка, если скролл не нужен
      if (scrollbarWidth === 0) {
        el.style.paddingRight = '';

        if (el.dataset.popupRestoreRight !== undefined) {
          el.style.right = el.dataset.popupRestoreRight;
          delete el.dataset.popupRestoreRight;
        }

        return;
      }

      // Если явно указан right: 0px — заменяем на ширину скроллбара
      if (style.right === '0px') {
        if (el.dataset.popupRestoreRight === undefined) {
          el.dataset.popupRestoreRight = el.style.right || '0px';
        }
        el.style.right = `${scrollbarWidth}px`;
        return; // 💥 не трогаем paddingRight!
      }

      // Если ширина элемента совпадает с шириной вьюпорта — добавляем paddingRight
      if (el.offsetWidth === document.documentElement.clientWidth) {
        el.style.paddingRight = `${scrollbarWidth}px`;
      }
    });
    // document.querySelectorAll('[data-fixed]').forEach(el => {
    //   const style = getComputedStyle(el);
    //   if (scrollbarWidth === 0) {
    //     el.style.paddingRight = '';
    //     if (el.dataset.popupRestoreRight !== undefined) {
    //       el.style.right = el.dataset.popupRestoreRight;
    //       delete el.dataset.popupRestoreRight;
    //     }
    //     return;
    //   }
    //   if (el.offsetWidth === document.documentElement.clientWidth) {
    //     el.style.paddingRight = `${scrollbarWidth}px`;
    //     return;
    //   }
    // });
  },
};
