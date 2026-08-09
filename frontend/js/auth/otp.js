const otpForm = document.getElementById('otpForm');
const otpInputs = document.querySelectorAll('.otp-input');
const otpEmail = document.getElementById('otpEmail');
const otpMessage = document.getElementById('otpMessage');
const verifyButton = document.getElementById('verifyButton');
const resendOtp = document.getElementById('resendOtp');

const API_URL = 'http://localhost:5000/api/auth';

// Register page ကနေ သိမ်းလာတဲ့ email
const userId = sessionStorage.getItem('otpUserId');
const email = sessionStorage.getItem('otpEmail');

if (email) {
  otpEmail.textContent = email;
} else {
  otpEmail.textContent = 'Email not found';
}

// ===============================
// OTP INPUT AUTO FOCUS
// ===============================
otpInputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    // Number ပဲလက်ခံမယ်
    input.value = input.value.replace(/\D/g, '');

    if (input.value && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }
  });

  // Backspace နှိပ်ရင် previous box ပြန်သွားမယ်
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace' && !input.value && index > 0) {
      otpInputs[index - 1].focus();
    }
  });
});

// ===============================
// PASTE 6 DIGIT OTP
// ===============================
otpInputs[0].addEventListener('paste', (event) => {
  event.preventDefault();

  const pastedData = event.clipboardData
    .getData('text')
    .replace(/\D/g, '')
    .slice(0, 6);

  pastedData.split('').forEach((number, index) => {
    if (otpInputs[index]) {
      otpInputs[index].value = number;
    }
  });

  if (pastedData.length === 6) {
    otpInputs[5].focus();
  }
});

// ===============================
// VERIFY OTP
// ===============================
otpForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  otpMessage.textContent = '';

  const otp = Array.from(otpInputs)
    .map((input) => input.value)
    .join('');

  if (!email) {
    showMessage('Email not found. Please register again.', 'error');
    return;
  }

  if (otp.length !== 6) {
    showMessage('Please enter the 6-digit verification code.', 'error');
    return;
  }

  try {
    verifyButton.disabled = true;
    verifyButton.textContent = 'Verifying...';

    const response = await fetch(`${API_URL}/verify-otp`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        user_id: Number(userId),
        otp_code: otp,
      }),
    });

    const data = await response.json();

    console.log('OTP response:', data);

    if (!response.ok || !data.success) {
      showMessage(data.message || 'OTP verification failed.', 'error');

      return;
    }

    showMessage(data.message || 'Email verified successfully!', 'success');

    sessionStorage.removeItem('otpUserId');
    sessionStorage.removeItem('otpEmail');

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1200);
  } catch (error) {
    console.error('OTP error:', error);

    showMessage('Cannot connect to server.', 'error');
  } finally {
    verifyButton.disabled = false;
    verifyButton.textContent = 'Verify Code';
  }
});

// ===============================
// RESEND OTP
// ===============================
resendOtp.addEventListener('click', async () => {
  if (!email) {
    showMessage('Email not found. Please register again.', 'error');

    return;
  }

  try {
    resendOtp.disabled = true;
    resendOtp.textContent = 'Sending...';

    const response = await fetch(`${API_URL}/resend-otp`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        email: email,
      }),
    });

    const data = await response.json();

    console.log('Resend OTP response:', data);

    if (!response.ok || !data.success) {
      showMessage(data.message || 'Could not resend OTP.', 'error');

      return;
    }

    showMessage(data.message || 'A new OTP has been sent.', 'success');

    // OTP boxes clear
    otpInputs.forEach((input) => {
      input.value = '';
    });

    otpInputs[0].focus();
  } catch (error) {
    console.error('Resend OTP error:', error);

    showMessage('Cannot connect to server.', 'error');
  } finally {
    resendOtp.disabled = false;
    resendOtp.textContent = 'Resend Code';
  }
});

// ===============================
// MESSAGE
// ===============================
function showMessage(message, type) {
  otpMessage.textContent = message;

  otpMessage.className = `form-message ${type}`;
}
