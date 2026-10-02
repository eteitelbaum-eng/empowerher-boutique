const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const backToTop = document.querySelector('a[href="#top"]');

backToTop?.addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

const joinForm = document.querySelector('.join-form');
joinForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = joinForm.querySelector('.join-status');
  const button = joinForm.querySelector('button[type="submit"]');
  const data = new FormData(joinForm);
  const interests = data.getAll('interest');
  data.delete('interest');
  data.set('interest', interests.join(', ') || 'Not specified');
  data.set('_replyto', data.get('email'));
  button.disabled = true;
  status.classList.remove('error');
  status.textContent = 'Sending…';
  try {
    const res = await fetch(joinForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data
    });
    if (!res.ok) throw new Error();
    joinForm.reset();
    status.textContent = "Thank you! We got your info and will be in touch soon. ♡";
  } catch {
    status.classList.add('error');
    status.textContent = 'Something went wrong. Please try again in a moment.';
  } finally {
    button.disabled = false;
  }
});
