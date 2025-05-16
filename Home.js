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
    return; // MENCEGAH redirect
  }

  if (!terms) {
    alert("Anda harus menyetujui syarat dan ketentuan.");
    return;
  }

  alert(`Pendaftaran berhasil!\nNama: ${name}\nEmail: ${email}`);
  window.location.href = "Home.html";
});
