// ==========================================================================
// Globatech — contact form validation
// No backend wired up: swap the fetch() stub for your real endpoint
// (e.g. Formspree, Netlify Forms, or your own API) when ready.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const fields = {
    name: { el: form.querySelector('#name'), err: form.querySelector('#nameError') },
    email: { el: form.querySelector('#email'), err: form.querySelector('#emailError') },
    message: { el: form.querySelector('#message'), err: form.querySelector('#messageError') }
  };

  function showError(field, msg) {
    fields[field].err.textContent = msg;
    fields[field].el.style.borderColor = msg ? '#C98686' : '';
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validate() {
    let ok = true;
    if (!fields.name.el.value.trim()) { showError('name', 'Please enter your name.'); ok = false; }
    else showError('name', '');

    if (!fields.email.el.value.trim()) { showError('email', 'Please enter your email.'); ok = false; }
    else if (!validEmail(fields.email.el.value.trim())) { showError('email', 'That email doesn\'t look right.'); ok = false; }
    else showError('email', '');

    if (!fields.message.el.value.trim() || fields.message.el.value.trim().length < 10) {
      showError('message', 'Tell us a little more (10+ characters).'); ok = false;
    } else showError('message', '');

    return ok;
  }

  Object.values(fields).forEach(f => {
    f.el.addEventListener('blur', validate);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.classList.remove('show', 'success', 'error');

    if (!validate()) {
      status.textContent = 'Please fix the highlighted fields.';
      status.classList.add('show', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      // Placeholder — replace with a real endpoint to actually send the message.
      // await fetch('https://your-endpoint.example/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: fields.name.el.value,
      //     email: fields.email.el.value,
      //     message: fields.message.el.value
      //   })
      // });
      await new Promise(res => setTimeout(res, 700)); // simulated latency

      status.textContent = 'Message sent — we\'ll get back to you shortly.';
      status.classList.add('show', 'success');
      form.reset();
    } catch (err) {
      status.textContent = 'Something went wrong. Please try again or email us directly.';
      status.classList.add('show', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
});
