document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const registerPanel = document.getElementById('registerPanel');
  const loginPanel = document.getElementById('loginPanel');
  const authTitle = document.getElementById('authTitle');
  const authSubtitle = document.getElementById('authSubtitle');
  const switchText = document.getElementById('switchText');
  const registerPrompt = document.getElementById('registerPrompt');
  const showLoginLink = document.getElementById('showLoginLink');
  const showRegisterLink = document.getElementById('showRegisterLink');

  const style = document.createElement('style');
  style.textContent = `
    .auth-panel.hidden {
      display: none;
    }

    .hidden-link {
      display: none;
    }

    .alert {
      position: fixed;
      padding: 15px;
      border-radius: 8px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideDown 0.3s ease-out;
      transform: translateY(-20px);
      opacity: 0;
    }
    
    .alert.success {
      background-color: #4BB543;
    }
    
    .alert.error {
      background-color: #FF3333;
    }
    
    .alert.fade-out {
      animation: fadeOut 0.3s ease-out;
    }
    
    @keyframes slideDown {
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes fadeOut {
      to {
        opacity: 0;
        transform: translateY(-20px);
      }
    }
  `;
  document.head.appendChild(style);

  initPasswordToggle();

  const confirmPasswordInput = document.getElementById('confirmPassword');
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
  }

  function toggleAuthMode(mode) {
    const isRegister = mode === 'register';
    registerPanel.classList.toggle('hidden', !isRegister);
    loginPanel.classList.toggle('hidden', isRegister);

    authTitle.textContent = isRegister ? 'Buat Akun Baru' : 'Masuk ke Akun';
    authSubtitle.textContent = isRegister ? 'Bergabunglah dengan komunitas kami' : 'Selamat datang kembali';

    switchText.style.display = isRegister ? 'block' : 'none';
    registerPrompt.style.display = isRegister ? 'none' : 'block';

    clearAuthErrors();
  }

  showLoginLink.addEventListener('click', function(e) {
    e.preventDefault();
    toggleAuthMode('login');
  });

  showRegisterLink.addEventListener('click', function(e) {
    e.preventDefault();
    toggleAuthMode('register');
  });

  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    if (validateRegisterForm()) {
      const users = getStoredUsers();
      const user = {
        name: document.getElementById('name').value.trim(),
        username: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        gender: document.getElementById('gender').value
      };

      users.push(user);
      localStorage.setItem('vphoneUsers', JSON.stringify(users));
      localStorage.setItem('vphoneLoggedInUser', JSON.stringify({ name: user.name, email: user.email, username: user.username }));
      showAlert('Akun berhasil dibuat. Selamat datang!', 'success');
      setTimeout(() => {
        window.location.href = 'Home.html';
      }, 1000);
    }
  });

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;

    clearAuthErrors();

    if (!identifier) {
      showError('loginIdentifier', 'Email atau username wajib diisi');
      return;
    }

    if (!password) {
      showError('loginPassword', 'Password wajib diisi');
      return;
    }

    const users = getStoredUsers();
    const normalizedIdentifier = identifier.toLowerCase();
    const matchedUser = users.find(user => {
      return (
        user.email && user.email.toLowerCase() === normalizedIdentifier ||
        user.username && user.username.toLowerCase() === normalizedIdentifier
      );
    });

    if (!matchedUser) {
      showAlert('Email atau username tidak ditemukan. Silakan daftar akun terlebih dahulu.', 'error');
      return;
    }

    if (matchedUser.password !== password) {
      showAlert('Password salah. Silakan cek kembali password Anda.', 'error');
      return;
    }

    localStorage.setItem('vphoneLoggedInUser', JSON.stringify({ name: matchedUser.name, email: matchedUser.email, username: matchedUser.username }));
    showAlert('Login berhasil. Mengarahkan ke halaman Home...', 'success');
    setTimeout(() => {
      window.location.href = 'Home.html';
    }, 1000);
  });

  function getStoredUsers() {
    const storedUsers = localStorage.getItem('vphoneUsers');
    if (!storedUsers) {
      return [];
    }

    try {
      return JSON.parse(storedUsers);
    } catch (error) {
      return [];
    }
  }

  function validateRegisterForm() {
    let isValid = true;
    const name = document.getElementById('name').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const terms = document.getElementById('terms').checked;

    clearAuthErrors();

    if (name.length < 3) {
      showError('name', 'Nama harus minimal 3 karakter');
      isValid = false;
    }

    if (username.length < 3) {
      showError('username', 'Username minimal 3 karakter');
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('email', 'Email tidak valid');
      isValid = false;
    }

    if (!validatePasswordMatch()) {
      isValid = false;
    }

    if (!terms) {
      showAlert('Anda harus menyetujui syarat dan ketentuan', 'error');
      isValid = false;
    }

    const users = getStoredUsers();
    const existingUserByEmail = users.some(user => user.email && user.email.toLowerCase() === email.toLowerCase());
    const existingUserByUsername = users.some(user => user.username && user.username.toLowerCase() === username.toLowerCase());

    if (existingUserByEmail) {
      showError('email', 'Email sudah terdaftar');
      isValid = false;
    }

    if (existingUserByUsername) {
      showError('username', 'Username sudah digunakan');
      isValid = false;
    }

    return isValid;
  }

  function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (confirmPassword.length === 0) return true;

    if (password !== confirmPassword) {
      showError('confirmPassword', 'Password tidak cocok');
      return false;
    }

    clearError('confirmPassword');
    return true;
  }

  function initPasswordToggle() {
    const passwordFields = ['password', 'confirmPassword', 'loginPassword'];

    passwordFields.forEach(fieldId => {
      const input = document.getElementById(fieldId);
      if (!input) return;

      const toggle = input.nextElementSibling;
      if (toggle && toggle.classList.contains('toggle-password')) {
        toggle.classList.add('visible');
      }
    });
  }
});

function togglePassword(fieldId) {
  const input = document.getElementById(fieldId);
  if (!input) return;

  const icon = input.nextElementSibling?.querySelector('i');

  if (input.type === 'password') {
    input.type = 'text';
    if (icon) icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    if (icon) icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  if (!input) return;

  const formGroup = input.closest('.form-group');
  if (!formGroup) return;

  let errorElement = formGroup.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    formGroup.appendChild(errorElement);
  }

  errorElement.textContent = message;
  formGroup.classList.add('has-error');
}

function clearError(fieldId) {
  const input = document.getElementById(fieldId);
  if (!input) return;

  const formGroup = input.closest('.form-group');
  if (!formGroup) return;

  formGroup.classList.remove('has-error');
  const errorElement = formGroup.querySelector('.error-message');
  if (errorElement) {
    errorElement.remove();
  }
}

function clearAuthErrors() {
  document.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('has-error');
    const errorElement = group.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  });
}

function showAlert(message, type) {
  const alertBox = document.createElement('div');
  alertBox.className = `alert ${type}`;
  alertBox.textContent = message;

  const existingAlert = document.querySelector('.alert');
  if (existingAlert) {
    existingAlert.remove();
  }

  document.body.appendChild(alertBox);

  const formBox = document.querySelector('.form-box');
  if (formBox) {
    const formRect = formBox.getBoundingClientRect();
    alertBox.style.top = `${formRect.top - 60}px`;
    alertBox.style.left = `${formRect.left}px`;
    alertBox.style.width = `${formRect.width}px`;
  }

  setTimeout(() => {
    alertBox.classList.add('fade-out');
    setTimeout(() => {
      alertBox.remove();
    }, 300);
  }, 3000);
}
