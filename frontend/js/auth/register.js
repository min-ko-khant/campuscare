const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

const togglePassword = document.getElementById('togglePassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

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

const registerForm = document.getElementById('registerForm');

const studentIdInput = document.getElementById('studentId');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');

const facultyInput = document.getElementById('faculty');
const departmentInput = document.getElementById('department');
const yearInput = document.getElementById('year');

const registerButton = document.getElementById('registerButton');
const registerMessage = document.getElementById('registerMessage');

const REGISTER_API = 'http://localhost:5000/api/auth/register';

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  registerMessage.textContent = '';
  registerMessage.className = 'form-message';

  const student_id = studentIdInput.value.trim();
  const faculty = facultyInput.value;
  const name = nameInput.value.trim();
  const department = departmentInput.value;
  const year = Number(yearInput.value);
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (
    !student_id ||
    !faculty ||
    !name ||
    !department ||
    !year ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    registerMessage.textContent = 'Please fill in all fields.';
    registerMessage.classList.add('error');
    return;
  }

  if (password.length < 8) {
    registerMessage.textContent = 'Password must be at least 8 characters.';
    registerMessage.classList.add('error');
    return;
  }

  if (password !== confirmPassword) {
    registerMessage.textContent = 'Passwords do not match.';
    registerMessage.classList.add('error');
    return;
  }

  registerButton.disabled = true;
  registerButton.textContent = 'Registering...';

  try {
    const response = await fetch(REGISTER_API, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        student_id,
        faculty,
        name,
        department,
        year,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed.');
    }

    registerMessage.textContent = data.message || 'OTP sent to your email.';
    registerMessage.classList.add('success');

    // OTP page မှာလိုမယ့် data သိမ်းထားမယ်
    sessionStorage.setItem('otpUserId', data.user_id);
    sessionStorage.setItem('otpEmail', email);

    console.log('Register response:', data);

    setTimeout(() => {
      window.location.href = 'otp.html';
    }, 800);
  } catch (error) {
    registerMessage.textContent = error.message;
    registerMessage.classList.add('error');
  } finally {
    registerButton.disabled = false;
    registerButton.textContent = 'Register';
  }
});
