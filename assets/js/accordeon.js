export const accordeonToggle = e => {
  if (e.target.dataset.js !== 'accordeon-head' && e.target.dataset.js !== 'accordeon-button') return;

  const accordeon = e.target.closest('.accordeon');
  const answer = accordeon.querySelector('.accordeon__answer');

  document.querySelectorAll('.accordeon.active').forEach(opened => {
    if (opened !== accordeon) {
      opened.classList.remove('active');
      const openedAnswer = opened.querySelector('.accordeon__answer');
      if (openedAnswer) {
        openedAnswer.style.height = '0px';
      }
    }
  });

  const isActive = accordeon.classList.contains('active');
  accordeon.classList.toggle('active');
  answer.style.height = isActive ? '0px' : answer.scrollHeight + 'px';
};
