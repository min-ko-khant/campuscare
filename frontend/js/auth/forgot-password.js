const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const emailInput = document.getElementById('email');
const forgotMessage = document.getElementById('forgotMessage');
const forgotButton = document.getElementById('forgotButton');

const FORGOT_API = 'http://localhost:5000/api/auth/forgot-password';

forgotPasswordForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();

  forgotMessage.textContent = '';
  forgotMessage.className = 'form-message';

  if (!email) {
    forgotMessage.textContent = 'Email is required.';
    forgotMessage.classList.add('error');
    return;
  }

  forgotButton.disabled = true;
  forgotButton.textContent = 'Sending...';

  try {
    const response = await fetch(FORGOT_API, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || 'Could not create password reset request.'
      );
    }

    forgotMessage.textContent =
      data.message || 'Password reset request created.';
    forgotMessage.classList.add('success');

    // အခု backend က token ကို response ပြန်ပေးနေသေးလို့
    // Reset page မှာအသုံးပြုဖို့ sessionStorage ထဲသိမ်းထားမယ်။
    if (data.token) {
      sessionStorage.setItem('passwordResetToken', data.token);
      sessionStorage.setItem('passwordResetEmail', email);
    }

    console.log('Forgot password response:', data);

    setTimeout(() => {
      window.location.href = 'reset-password.html';
    }, 1000);
  } catch (error) {
    forgotMessage.textContent = error.message;
    forgotMessage.classList.add('error');
  } finally {
    forgotButton.disabled = false;
    forgotButton.textContent = 'Send Reset Request';
  }
});
