const API = 'http://localhost:5000/api/emergencies';

document.addEventListener('DOMContentLoaded', loadEmergencyDetail);

async function loadEmergencyDetail() {
  const params = new URLSearchParams(window.location.search);

  const id = params.get('id');

  if (!id) {
    return;
  }

  try {
    const response = await fetch(`${API}/${id}`);

    const result = await response.json();

    if (!result.success) {
      throw new Error('Emergency not found');
    }

    const emergency = result.data;

    document.getElementById('emergencyTitle').textContent = emergency.title;

    document.getElementById('emergencyDescription').textContent =
      emergency.description;

    document.getElementById('emergencyDetails').textContent = emergency.details;

    document.getElementById('emergencyCategory').textContent =
      '🚨 Emergency Notice';

    document.getElementById('emergencyDate').textContent =
      '📅 ' + formatDate(emergency.created_at);

    const badge = document.getElementById('priorityBadge');

    badge.textContent = emergency.level;

    badge.classList.add(emergency.level.toLowerCase());
  } catch (error) {
    console.error(error);

    document.getElementById('emergencyTitle').textContent =
      'Emergency information unavailable';
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
