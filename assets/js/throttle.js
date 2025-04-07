export const throttle = (callback, delay) => {
  let lastCall = 0;
  let scheduled = null;

  return function (...args) {
    const now = Date.now();
    const remaining = delay - (now - lastCall);

    if (remaining <= 0) {
      if (scheduled) {
        cancelAnimationFrame(scheduled);
        scheduled = null;
      }
      lastCall = now;
      callback(...args);
    } else if (!scheduled) {
      scheduled = requestAnimationFrame(() => {
        lastCall = Date.now();
        callback(...args);
        scheduled = null;
      });
    }
  };
};
