// script.js
document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const gender = document.getElementById('gender').value;
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const terms = document.getElementById('terms').checked;

  if (password !== confirmPassword) {
    alert("Password dan konfirmasi password tidak cocok.");
    return;
  }

  if (!terms) {
    alert("Anda harus menyetujui syarat dan ketentuan.");
    return;
  }

  alert(`Pendaftaran berhasil!\nNama: ${name}\nEmail: ${email}`);
});

document.querySelectorAll('.toggle-password').forEach(icon => {
  const targetId = icon.getAttribute('data-target');
  const input = document.getElementById(targetId);

  input.addEventListener('input', function () {
    icon.style.display = input.value ? 'inline' : 'none';
  });

  icon.addEventListener('click', function () {
    const isPassword = input.getAttribute('type') === 'password';
    input.setAttribute('type', isPassword ? 'text' : 'password');
    icon.textContent = isPassword ? '🙈' : '👁';
  });
});

// Tampilkan ikon 👁 saat user mulai mengetik
const passwordInput = document.getElementById("password");
const togglePassword = document.querySelector('[data-target="password"]');

passwordInput.addEventListener("input", () => {
  togglePassword.style.display = passwordInput.value ? "inline" : "none";
});

document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();
  
  window.location.href = "Home.html";
});
