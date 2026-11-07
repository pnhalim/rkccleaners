import './style.css';

const form = document.querySelector('#contact-form');
const status = document.querySelector('#contact-status');
const button = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.elements['h-captcha-response']?.value) {
    status.textContent = 'Please complete the captcha.';
    return;
  }
  button.disabled = true;
  status.textContent = 'Sending…';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    // Relative so PR previews stay on their own thank-you page.
    location.assign(new URL('../thank-you/', location.href));
  } catch {
    status.textContent =
      'Sorry, your message could not be sent. Please try again.';
    // hCaptcha tokens work once, so a retry needs a fresh check.
    window.hcaptcha?.reset();
    button.disabled = false;
  }
});
