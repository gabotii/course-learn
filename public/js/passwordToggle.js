document.addEventListener('DOMContentLoaded', function () {
  const pswdBtn = document.querySelector('#pswdBtn');
  const pswdInput = document.getElementById('account_password');

  if (pswdBtn && pswdInput) {
    pswdBtn.addEventListener('click', function () {
      const type = pswdInput.getAttribute('type') === 'password' ? 'text' : 'password';
      pswdInput.setAttribute('type', type);
      pswdBtn.innerHTML = type === 'password' ? 'Show Password' : 'Hide Password';
    });
  }
});