export function initHeaderMenu(header) {
  const button = header.querySelector('.header-menu');
  const label = button.querySelector('.header-menu-label');
  const mobile = window.matchMedia('(max-width: 640px)');
  const events = new AbortController();
  const options = { signal: events.signal };

  function setOpen(open) {
    button.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Close' : 'Menu';
  }

  function isOpen() {
    return button.getAttribute('aria-expanded') === 'true';
  }

  button.addEventListener('click', () => setOpen(!isOpen()), options);
  header.addEventListener(
    'click',
    (event) => {
      if (event.target.closest('a')) setOpen(false);
    },
    options,
  );
  header.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && isOpen()) {
        event.preventDefault();
        setOpen(false);
        button.focus();
      }
    },
    options,
  );
  header.addEventListener(
    'focusout',
    (event) => {
      if (!header.contains(event.relatedTarget)) setOpen(false);
    },
    options,
  );
  document.addEventListener(
    'pointerdown',
    (event) => {
      if (!header.contains(event.target)) setOpen(false);
    },
    options,
  );
  mobile.addEventListener('change', () => setOpen(false), options);
  header.classList.add('has-menu');

  return () => {
    events.abort();
    setOpen(false);
    header.classList.remove('has-menu');
  };
}
