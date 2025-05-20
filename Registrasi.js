document.addEventListener('DOMContentLoaded', function() {
  // Initialize form elements
  const registerForm = document.getElementById('registerForm');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  
  // Add CSS for alerts dynamically
  const style = document.createElement('style');
  style.textContent = `
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

  // Initialize password toggle functionality
  initPasswordToggle();
  
  // Confirm password validation
  confirmPasswordInput.addEventListener('input', function() {
    validatePasswordMatch();
  });
  
  // Form submission
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      // Always redirect to home.html after successful validation
      window.location.href = "Home.html";
    }
  });
});

// Initialize password toggle functionality
function initPasswordToggle() {
  const passwordFields = ['password', 'confirmPassword'];
  
  passwordFields.forEach(fieldId => {
    const input = document.getElementById(fieldId);
    const toggle = input.nextElementSibling;
    
    // Make eye icon always visible
    toggle.classList.add('visible');
  });
}

// Toggle password visibility
function togglePassword(fieldId) {
  const input = document.getElementById(fieldId);
  const icon = input.nextElementSibling.querySelector('i');
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

// Validate password match
function validatePasswordMatch() {
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if (confirmPassword.length === 0) return true;
  
  if (password !== confirmPassword) {
    showError('confirmPassword', 'Password tidak cocok');
    return false;
  } else {
    clearError('confirmPassword');
    return true;
  }
}

// Validate entire form
function validateForm() {
  let isValid = true;
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const terms = document.getElementById('terms').checked;
  
  // Clear previous errors
  clearErrors();
  
  // Validate name
  if (name.length < 3) {
    showError('name', 'Nama harus minimal 3 karakter');
    isValid = false;
  }
  
  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('email', 'Email tidak valid');
    isValid = false;
  }
  
  // Validate password match
  if (!validatePasswordMatch()) {
    isValid = false;
  }
  
  // Validate terms
  if (!terms) {
    showAlert('Anda harus menyetujui syarat dan ketentuan', 'error');
    isValid = false;
  }
  
  return isValid;
}

// Show error message for specific input
function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const formGroup = input.closest('.form-group');
  
  let errorElement = formGroup.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    formGroup.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
  formGroup.classList.add('has-error');
}

// Clear error from specific input
function clearError(fieldId) {
  const input = document.getElementById(fieldId);
  const formGroup = input.closest('.form-group');
  
  formGroup.classList.remove('has-error');
  const errorElement = formGroup.querySelector('.error-message');
  if (errorElement) {
    errorElement.remove();
  }
}

// Clear all error messages
function clearErrors() {
  document.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('has-error');
    const errorElement = group.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  });
}

// Show alert message
function showAlert(message, type) {
  const alertBox = document.createElement('div');
  alertBox.className = `alert ${type}`;
  alertBox.textContent = message;
  
  // Remove any existing alerts
  const existingAlert = document.querySelector('.alert');
  if (existingAlert) {
    existingAlert.remove();
  }
  
  document.body.appendChild(alertBox);
  
  // Position alert
  const formBox = document.querySelector('.form-box');
  const formRect = formBox.getBoundingClientRect();
  alertBox.style.top = `${formRect.top - 60}px`;
  alertBox.style.left = `${formRect.left}px`;
  alertBox.style.width = `${formRect.width}px`;
  
  // Remove alert after 3 seconds
  setTimeout(() => {
    alertBox.classList.add('fade-out');
    setTimeout(() => {
      alertBox.remove();
    }, 300);
  }, 3000);
}
