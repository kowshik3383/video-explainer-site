const toggle = document.querySelector('.nav-toggle');
if (toggle) {
  toggle.addEventListener('click', () => document.body.classList.toggle('nav-open'));
}
const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
