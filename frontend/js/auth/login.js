const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');

togglePassword.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';

  passwordInput.type = isHidden ? 'text' : 'password';
  togglePassword.textContent = isHidden ? 'Hide' : 'Show';

  togglePassword.setAttribute(
    'aria-label',
    isHidden ? 'Hide password' : 'Show password'
  );
});

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const loginButton = document.getElementById('loginButton');
const loginButtonText = document.getElementById('loginButtonText');
const loginMessage = document.getElementById('loginMessage');

const API_URL = 'http://localhost:5000/api/auth/login';

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Clear previous message
  loginMessage.textContent = '';
  loginMessage.className = 'form-message';

  if (!email || !password) {
    loginMessage.textContent = 'Email and password are required.';
    loginMessage.classList.add('error');
    return;
  }

  // Loading state
  loginButton.disabled = true;
  loginButtonText.textContent = 'Logging in...';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed.');
    }

    // Save tokens
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    // Save basic user information if returned
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    loginMessage.textContent = data.message || 'Login successful.';
    loginMessage.classList.add('success');
    setTimeout(() => {
      window.location.href = '../student/dashboard.html';
    }, 100);
    console.log('Login response:', data);
  } catch (error) {
    loginMessage.textContent = error.message;
    loginMessage.classList.add('error');
  } finally {
    loginButton.disabled = false;
    loginButtonText.textContent = 'Login';
  }
});
