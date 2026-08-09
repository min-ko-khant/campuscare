const resetPasswordForm = document.getElementById('resetPasswordForm');

const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

const togglePassword = document.getElementById('togglePassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

const resetMessage = document.getElementById('resetMessage');
const resetButton = document.getElementById('resetButton');

const RESET_API = 'http://localhost:5000/api/auth/reset-password';

const resetToken = sessionStorage.getItem('passwordResetToken');

togglePassword.addEventListener('click', () => {
  const hidden = passwordInput.type === 'password';

  passwordInput.type = hidden ? 'text' : 'password';
  togglePassword.textContent = hidden ? 'Hide' : 'Show';
});

toggleConfirmPassword.addEventListener('click', () => {
  const hidden = confirmPasswordInput.type === 'password';

  confirmPasswordInput.type = hidden ? 'text' : 'password';
  toggleConfirmPassword.textContent = hidden ? 'Hide' : 'Show';
});

resetPasswordForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  resetMessage.textContent = '';
  resetMessage.className = 'form-message';

  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!resetToken) {
    resetMessage.textContent =
      'Reset token not found. Please request a new password reset.';
    resetMessage.classList.add('error');
    return;
  }

  if (!password || !confirmPassword) {
    resetMessage.textContent = 'Please fill in both password fields.';
    resetMessage.classList.add('error');
    return;
  }

  if (password.length < 8) {
    resetMessage.textContent = 'Password must be at least 8 characters.';
    resetMessage.classList.add('error');
    return;
  }

  if (password !== confirmPassword) {
    resetMessage.textContent = 'Passwords do not match.';
    resetMessage.classList.add('error');
    return;
  }

  resetButton.disabled = true;
  resetButton.textContent = 'Resetting...';

  try {
    const response = await fetch(RESET_API, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        token: resetToken,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Password reset failed.');
    }

    resetMessage.textContent = data.message || 'Password reset successful.';
    resetMessage.classList.add('success');

    sessionStorage.removeItem('passwordResetToken');
    sessionStorage.removeItem('passwordResetEmail');

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  } catch (error) {
    resetMessage.textContent = error.message;
    resetMessage.classList.add('error');
  } finally {
    resetButton.disabled = false;
    resetButton.textContent = 'Reset Password';
  }
});
