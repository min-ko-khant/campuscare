document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');

  const searchButton = document.getElementById('searchButton');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchBackdrop = document.getElementById('searchBackdrop');
  const searchCloseButton = document.getElementById('searchCloseButton');

  // Mobile toggle bar
  mobileMenuButton?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');

    mobileMenuButton.classList.toggle('open', isOpen);
    mobileMenuButton.setAttribute('aria-expanded', String(isOpen));

    document.body.classList.toggle('menu-open', isOpen);
  });

  // Mobile menu link နှိပ်ရင် menu ပိတ်မယ်
  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mobileMenuButton.classList.remove('open');
      mobileMenuButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  });

  // Search popup open
  searchButton?.addEventListener('click', () => {
    searchOverlay.classList.add('open');
    searchOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  });

  // Search popup close
  function closeSearch() {
    searchOverlay.classList.remove('open');
    searchOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  searchBackdrop?.addEventListener('click', closeSearch);
  searchCloseButton?.addEventListener('click', closeSearch);

  // Escape key နဲ့ menu/search ပိတ်မယ်
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSearch();

      mobileMenu.classList.remove('open');
      mobileMenuButton.classList.remove('open');
      mobileMenuButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  });

  // Desktop size ပြန်ရောက်ရင် mobile menu ပိတ်မယ်
  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) {
      mobileMenu.classList.remove('open');
      mobileMenuButton.classList.remove('open');
      mobileMenuButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  });
});

/* ===========================
   Statistics Counter
=========================== */

const counters = document.querySelectorAll('.counter');
const speed = 100;
counters.forEach((counter) => {
  const update = () => {
    const target = +counter.dataset.target;
    const count = +counter.innerText;
    const increment = target / speed;
    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(update, 20);
    } else {
      counter.innerText = target.toLocaleString();
    }
  };
  update();
});

/* ===========================
   Load Latest News From API
=========================== */

const NEWS_API_URL = 'http://localhost:5000/api/news';

async function loadLatestNews() {
  const newsGrid = document.querySelector('.news-grid');

  if (!newsGrid) return;

  try {
    const response = await fetch(NEWS_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error('Invalid news response');
    }

    const latestNews = result.data.slice(0, 3);

    if (latestNews.length === 0) {
      newsGrid.innerHTML = `
                <div class="news-empty-state glass">
                    <h3>No news available</h3>
                    <p>Latest campus news will appear here.</p>
                </div>
            `;
      return;
    }

    newsGrid.innerHTML = latestNews
      .map((news) => createNewsCard(news))
      .join('');
  } catch (error) {
    console.error('Failed to load latest news:', error);

    newsGrid.innerHTML = `
            <div class="news-error-state glass">
                <h3>Unable to load news</h3>
                <p>Please check the backend server and try again.</p>
            </div>
        `;
  }
}

function createNewsCard(news) {
  const imagePath = news.image
    ? `./assets/images/news/${news.image}`
    : './assets/images/news/default-news.jpg';

  const publishedDate = new Date(news.created_at).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return `
        <article class="news-card glass">
            <div class="news-image">
                <img
                    src="${escapeHTML(imagePath)}"
                    alt="${escapeHTML(news.title)}"
                    onerror="this.src='./assets/images/news/default-news.jpg'"
                />

                <span class="news-category">
                    ${escapeHTML(news.category || 'Campus')}
                </span>
            </div>

            <div class="news-content">
                <span class="news-date">
                    📅 ${publishedDate}
                </span>

                <h3>${escapeHTML(news.title)}</h3>

                <p>
                    ${escapeHTML(news.summary || 'No summary available.')}
                </p>

                <div class="news-footer">
                    <div class="news-meta">
                        <span>👁️ ${Number(news.views || 0).toLocaleString()}</span>
                    </div>

                    <a href="./pages/public/news-details.html?id=${news.id}">
                        Read More →
                    </a>
                </div>
            </div>
        </article>
    `;
}

function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

loadLatestNews();

/* ===========================
   Load Announcement
=========================== */

const ANNOUNCEMENT_API = 'http://localhost:5000/api/announcements';

async function loadAnnouncement() {
  const titleElement = document.getElementById('announcementTitle');

  const descriptionElement = document.getElementById('announcementDescription');

  const typeElement = document.getElementById('announcementType');

  const deadlineElement = document.getElementById('announcementDeadline');

  const detailsButton = document.getElementById('announcementDetailsButton');

  if (
    !titleElement ||
    !descriptionElement ||
    !typeElement ||
    !deadlineElement
  ) {
    return;
  }

  try {
    const response = await fetch(ANNOUNCEMENT_API);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to load announcement');
    }

    if (!Array.isArray(result.data) || result.data.length === 0) {
      titleElement.textContent = 'No Active Announcement';

      descriptionElement.textContent =
        'There are no active announcements at the moment.';

      typeElement.textContent = 'Announcement';
      deadlineElement.textContent = '--';

      if (detailsButton) {
        detailsButton.style.display = 'none';
      }

      return;
    }

    const announcement = result.data[0];

    titleElement.textContent = announcement.title;

    descriptionElement.textContent =
      announcement.description || 'No description available.';

    typeElement.textContent =
      announcement.type === 'Emergency'
        ? 'Emergency Announcement'
        : announcement.type === 'Academic'
          ? 'Academic Announcement'
          : 'General Announcement';

    deadlineElement.textContent = formatAnnouncementDate(announcement.end_date);

    if (detailsButton) {
      detailsButton.href = `./pages/public/announcement-details.html?id=${announcement.id}`;
    }
  } catch (error) {
    console.error('Announcement error:', error);

    titleElement.textContent = 'Unable to Load Announcement';

    descriptionElement.textContent =
      'Please check the backend server and try again.';

    typeElement.textContent = 'Announcement';

    deadlineElement.textContent = '--';

    if (detailsButton) {
      detailsButton.style.display = 'none';
    }
  }
}

function formatAnnouncementDate(value) {
  if (!value) return 'No deadline';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'No deadline';
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
  });
}

loadAnnouncement();

/* ===========================
   Upcoming Events
=========================== */

const EVENTS_API_URL = 'http://localhost:5000/api/events';

async function loadUpcomingEvents() {
  const container = document.getElementById('eventsContainer');

  if (!container) {
    console.error('eventsContainer not found');
    return;
  }

  try {
    const response = await fetch(EVENTS_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json();

    console.log('Events API result:', result);

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error('Invalid events response');
    }

    if (result.data.length === 0) {
      container.innerHTML = `
                <div class="events-loading glass">
                    No upcoming events available.
                </div>
            `;
      return;
    }

    container.innerHTML = result.data
      .map((event) => createEventCard(event))
      .join('');
  } catch (error) {
    console.error('Load events error:', error);

    container.innerHTML = `
            <div class="events-loading glass">
                Unable to load upcoming events.
            </div>
        `;
  }
}

function createEventCard(event) {
  const eventDate = new Date(event.event_date);

  const day = eventDate.toLocaleDateString('en-US', {
    day: '2-digit',
  });

  const month = eventDate
    .toLocaleDateString('en-US', {
      month: 'short',
    })
    .toUpperCase();

  const startTime = formatEventTime(event.start_time);
  const endTime = formatEventTime(event.end_time);

  const imagePath = event.image
    ? `./assets/images/events/${event.image}`
    : './assets/images/events/default-event.jpg';

  return `
        <article class="event-card glass">

            <div class="event-date">
                <span class="event-day">${day}</span>
                <span class="event-month">${month}</span>
            </div>

            <div class="event-image">
                <img
                    src="${escapeEventHTML(imagePath)}"
                    alt="${escapeEventHTML(event.title)}"
                    onerror="this.src='./assets/images/events/default-event.jpg'"
                />

                <span class="event-type">
                    ${escapeEventHTML(event.category || 'Event')}
                </span>
            </div>

            <div class="event-content">

                <div class="event-time">
                    <span>🕘 ${startTime} – ${endTime}</span>
                </div>

                <h3>${escapeEventHTML(event.title)}</h3>

                <p>
                    ${escapeEventHTML(
                      event.description || 'No description available.'
                    )}
                </p>

                <div class="event-location">
                    <span aria-hidden="true">📍</span>
                    <span>
                        ${escapeEventHTML(
                          event.location || 'Location not specified'
                        )}
                    </span>
                </div>

                <div class="event-footer">
                    <a
                        href="./pages/public/event-details.html?id=${event.id}"
                        class="event-button"
                    >
                        View Details
                    </a>
                </div>

            </div>
        </article>
    `;
}

function formatEventTime(timeValue) {
  if (!timeValue) return '--:--';

  const [hours, minutes] = timeValue.split(':');
  const date = new Date();

  date.setHours(Number(hours), Number(minutes), 0);

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function escapeEventHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

loadUpcomingEvents();

/* ===========================
   Campus Activities
=========================== */

const ACTIVITIES_API_URL = 'http://localhost:5000/api/activities';

async function loadActivities() {
  const container = document.getElementById('activitiesContainer');

  if (!container) return;

  try {
    const response = await fetch(ACTIVITIES_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error('Invalid activities response');
    }

    if (result.data.length === 0) {
      container.innerHTML = `
                <div class="activities-loading glass">
                    No upcoming activities available.
                </div>
            `;
      return;
    }

    container.innerHTML = result.data
      .map((activity) => createActivityCard(activity))
      .join('');
  } catch (error) {
    console.error('Load activities error:', error);

    container.innerHTML = `
            <div class="activities-loading glass">
                Unable to load campus activities.
            </div>
        `;
  }
}

function createActivityCard(activity) {
  const activityDate = new Date(activity.activity_date);

  const formattedDate = Number.isNaN(activityDate.getTime())
    ? 'Date not available'
    : activityDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  const imagePath = activity.image
    ? `./assets/images/activities/${activity.image}`
    : './assets/images/activities/default-activity.jpg';

  return `
        <article class="activity-card glass">

            <img
                src="${escapeActivityHTML(imagePath)}"
                alt="${escapeActivityHTML(activity.title)}"
                onerror="this.src='./assets/images/activities/activity-2.jpg'"
            />

            <div class="activity-content">

                <span class="activity-tag">
                    ${escapeActivityHTML(activity.category || 'Activity')}
                </span>

                <h3>
                    ${escapeActivityHTML(activity.title)}
                </h3>

                <p>
                    ${escapeActivityHTML(
                      activity.description || 'No description available.'
                    )}
                </p>

                <div class="activity-meta">
                    📅 ${formattedDate}
                </div>

                <a
                    href="./pages/public/activity-details.html?id=${activity.id}"
                    class="activity-link"
                >
                    View Details →
                </a>

            </div>
        </article>
    `;
}

function escapeActivityHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

loadActivities();

/* ===========================
   Exam Notices
=========================== */

const EXAM_NOTICES_API_URL = 'http://localhost:5000/api/exam-notices';

async function loadExamNotices() {
  const container = document.getElementById('examNoticesContainer');

  if (!container) return;

  try {
    const response = await fetch(EXAM_NOTICES_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error('Invalid exam notices response');
    }

    if (result.data.length === 0) {
      container.innerHTML = `
                <div class="exam-notices-loading glass">
                    No upcoming exam notices available.
                </div>
            `;

      updateExamSummary(null);
      return;
    }

    container.innerHTML = result.data
      .map((notice) => createExamNoticeCard(notice))
      .join('');

    updateExamSummary(result.data[0]);
  } catch (error) {
    console.error('Load exam notices error:', error);

    container.innerHTML = `
            <div class="exam-notices-loading glass">
                Unable to load exam notices.
            </div>
        `;

    updateExamSummary(null);
  }
}

function createExamNoticeCard(notice) {
  const formattedDate = formatExamDate(notice.exam_date);

  const buttonMarkup = notice.file_url
    ? `
            <a
                href="./assets/documents/exams/${encodeURIComponent(notice.file_url)}"
                class="exam-download-button"
                target="_blank"
                rel="noopener"
            >
                Download
            </a>
        `
    : `
            <a
                href="./pages/public/exam-notice-details.html?id=${notice.id}"
                class="exam-download-button"
            >
                View Details
            </a>
        `;

  return `
        <article class="exam-notice-card glass">

            <div class="exam-timeline-dot"></div>

            <div class="exam-notice-icon">
                📄
            </div>

            <div class="exam-notice-content">

                <div class="exam-notice-top">

                    <span class="exam-notice-category">
                        ${escapeExamHTML(
                          notice.department || 'All Departments'
                        )}
                    </span>

                    <span class="exam-notice-status important">
                        Important
                    </span>

                </div>

                <h3>
                    ${escapeExamHTML(notice.title)}
                </h3>

                <p>
                    ${escapeExamHTML(
                      notice.description || 'No description available.'
                    )}
                </p>

                <div class="exam-notice-meta">
                    <span>📅 ${formattedDate}</span>

                    <span>
                        🏫 ${escapeExamHTML(
                          notice.department || 'All Departments'
                        )}
                    </span>
                </div>

            </div>

            ${buttonMarkup}

        </article>
    `;
}

function updateExamSummary(notice) {
  const titleElement = document.getElementById('nextExamTitle');

  const dayElement = document.getElementById('nextExamDay');

  const monthYearElement = document.getElementById('nextExamMonthYear');

  const countdownElement = document.getElementById('examCountdown');

  const downloadElement = document.getElementById('nextExamDownload');

  if (
    !titleElement ||
    !dayElement ||
    !monthYearElement ||
    !countdownElement ||
    !downloadElement
  ) {
    return;
  }

  if (!notice) {
    titleElement.textContent = 'No Upcoming Examination';
    dayElement.textContent = '--';
    monthYearElement.textContent = '--';
    countdownElement.innerHTML = `
            <div>
                <strong>--</strong>
                <span>Days</span>
            </div>
        `;
    downloadElement.style.display = 'none';
    return;
  }

  const examDate = new Date(notice.exam_date);

  titleElement.textContent = notice.title;

  dayElement.textContent = examDate.toLocaleDateString('en-US', {
    day: '2-digit',
  });

  monthYearElement.textContent = examDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const daysRemaining = calculateDaysRemaining(examDate);

  countdownElement.innerHTML = `
        <div>
            <strong>${daysRemaining}</strong>
            <span>Days</span>
        </div>
    `;

  if (notice.file_url) {
    downloadElement.href = `./assets/documents/exams/${encodeURIComponent(
      notice.file_url
    )}`;

    downloadElement.target = '_blank';
    downloadElement.rel = 'noopener';
    downloadElement.style.display = 'inline-flex';
  } else {
    downloadElement.href = `./pages/public/exam-notice-details.html?id=${notice.id}`;

    downloadElement.style.display = 'inline-flex';
  }
}

function formatExamDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date not available';
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function calculateDaysRemaining(examDate) {
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const targetDate = new Date(
    examDate.getFullYear(),
    examDate.getMonth(),
    examDate.getDate()
  );

  const difference = targetDate - today;

  return Math.max(0, Math.ceil(difference / (1000 * 60 * 60 * 24)));
}

function escapeExamHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

loadExamNotices();

/* =====================================
   Contact & Feedback
===================================== */

const CONTACT_API_URL = 'http://localhost:5000/api/contact';

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');

  const messageInput = document.getElementById('contactMessage');

  const messageCount = document.getElementById('contactMessageCount');

  if (!contactForm) {
    return;
  }

  /*
   * Message character counter
   */

  messageInput?.addEventListener('input', () => {
    if (!messageCount) {
      return;
    }

    messageCount.textContent = `${messageInput.value.length} / 3000`;
  });

  /*
   * Submit contact form
   */

  contactForm.addEventListener('submit', handleContactSubmit);
});

async function handleContactSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;

  const submitButton = document.getElementById('contactSubmitButton');

  const submitText = document.getElementById('contactSubmitText');

  const submitArrow = document.getElementById('contactSubmitArrow');

  const spinner = document.getElementById('contactSubmitSpinner');

  const statusBox = document.getElementById('contactFormStatus');

  clearContactErrors();

  const formData = new FormData(form);

  const contactData = {
    name: String(formData.get('name') || '').trim(),

    email: String(formData.get('email') || '').trim(),

    phone: String(formData.get('phone') || '').trim(),

    subject: String(formData.get('subject') || '').trim(),

    message: String(formData.get('message') || '').trim(),
  };

  /*
   * Frontend Validation
   */

  const isValid = validateContactForm(contactData);

  if (!isValid) {
    showContactStatus('Please check the highlighted fields.', 'error');

    return;
  }

  /*
   * Loading state
   */

  setContactLoading(true, submitButton, submitText, submitArrow, spinner);

  if (statusBox) {
    statusBox.textContent = '';
    statusBox.className = 'contact-form-status';
  }

  try {
    const response = await fetch(CONTACT_API_URL, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(contactData),
    });

    let result = {};

    try {
      result = await response.json();
    } catch {
      throw new Error('The server returned an invalid response.');
    }

    if (!response.ok) {
      /*
       * express-validator errors
       */

      if (Array.isArray(result.errors)) {
        applyBackendContactErrors(result.errors);
      }

      throw new Error(
        result.message ||
          getFirstValidationMessage(result.errors) ||
          'Unable to send your message.'
      );
    }

    if (!result.success) {
      throw new Error(result.message || 'Unable to send your message.');
    }

    /*
     * Success
     */

    showContactStatus(
      result.message || 'Your message has been sent successfully.',
      'success'
    );

    form.reset();

    const messageCount = document.getElementById('contactMessageCount');

    if (messageCount) {
      messageCount.textContent = '0 / 3000';
    }
  } catch (error) {
    console.error('Contact form error:', error);

    showContactStatus(
      error.message || 'Unable to send your message. Please try again.',
      'error'
    );
  } finally {
    setContactLoading(false, submitButton, submitText, submitArrow, spinner);
  }
}

/* =====================================
   Contact Validation
===================================== */

function validateContactForm(data) {
  let isValid = true;

  if (data.name.length < 2) {
    setContactFieldError('contactName', 'Please enter your name.');

    isValid = false;
  }

  if (!isValidContactEmail(data.email)) {
    setContactFieldError('contactEmail', 'Please enter a valid email address.');

    isValid = false;
  }

  if (data.phone && !/^[0-9+\-\s()]{7,20}$/.test(data.phone)) {
    setContactFieldError('contactPhone', 'Please enter a valid phone number.');

    isValid = false;
  }

  if (data.subject.length < 3) {
    setContactFieldError('contactSubject', 'Please enter a subject.');

    isValid = false;
  }

  if (data.message.length < 10) {
    setContactFieldError(
      'contactMessage',
      'Message must contain at least 10 characters.'
    );

    isValid = false;
  }

  if (data.message.length > 3000) {
    setContactFieldError(
      'contactMessage',
      'Message must not exceed 3000 characters.'
    );

    isValid = false;
  }

  return isValid;
}

function isValidContactEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* =====================================
   Field Errors
===================================== */

function setContactFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);

  if (!input) {
    return;
  }

  input.classList.add('contact-input-error');

  const field = input.closest('.contact-field');

  const errorElement = field?.querySelector('.contact-field-error');

  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearContactErrors() {
  document.querySelectorAll('.contact-input-error').forEach((element) => {
    element.classList.remove('contact-input-error');
  });

  document.querySelectorAll('.contact-field-error').forEach((element) => {
    element.textContent = '';
  });
}

/* =====================================
   Backend Validation Errors
===================================== */

function applyBackendContactErrors(errors) {
  const fieldMap = {
    name: 'contactName',

    email: 'contactEmail',

    phone: 'contactPhone',

    subject: 'contactSubject',

    message: 'contactMessage',
  };

  errors.forEach((error) => {
    const fieldName = error.path || error.param;

    const elementId = fieldMap[fieldName];

    if (!elementId) {
      return;
    }

    setContactFieldError(elementId, error.msg || 'Invalid value.');
  });
}

function getFirstValidationMessage(errors) {
  if (!Array.isArray(errors) || errors.length === 0) {
    return '';
  }

  return errors[0].msg || '';
}

/* =====================================
   Status
===================================== */

function showContactStatus(message, type) {
  const statusBox = document.getElementById('contactFormStatus');

  if (!statusBox) {
    return;
  }

  statusBox.textContent = message;

  statusBox.className = `contact-form-status ${type}`;

  /*
   * Success message only:
   * automatically remove later.
   */

  if (type === 'success') {
    setTimeout(() => {
      statusBox.textContent = '';

      statusBox.className = 'contact-form-status';
    }, 7000);
  }
}

/* =====================================
   Loading State
===================================== */

function setContactLoading(loading, button, text, arrow, spinner) {
  if (button) {
    button.disabled = loading;

    button.classList.toggle('loading', loading);
  }

  if (text) {
    text.textContent = loading ? 'Sending...' : 'Send Message';
  }

  if (arrow) {
    arrow.style.display = loading ? 'none' : 'inline';
  }

  if (spinner) {
    spinner.style.display = loading ? 'block' : 'none';
  }
}

/* ==========================================
   FAQ Accordion
========================================== */

document.addEventListener('DOMContentLoaded', initializeFAQ);

function initializeFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');

    if (!button) return;

    button.addEventListener('click', () => toggleFAQ(item));

    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();

        toggleFAQ(item);
      }
    });
  });
}

function toggleFAQ(selectedItem) {
  const allItems = document.querySelectorAll('.faq-item');

  const isOpen = selectedItem.classList.contains('active');

  allItems.forEach((item) => {
    item.classList.remove('active');

    const button = item.querySelector('.faq-question');

    if (button) {
      button.setAttribute('aria-expanded', 'false');
    }
  });

  if (!isOpen) {
    selectedItem.classList.add('active');

    const button = selectedItem.querySelector('.faq-question');

    if (button) {
      button.setAttribute('aria-expanded', 'true');
    }
  }
}
/* ===========================
   Emergency Notice
=========================== */
const EMERGENCY_API_URL = 'http://localhost:5000/api/emergencies';
async function loadEmergencyNotice() {
  const levelElement = document.getElementById('emergencyLevel');

  const titleElement = document.getElementById('emergencyTitle');

  const descriptionElement = document.getElementById('emergencyDescription');

  const buttonElement = document.getElementById('emergencyDetailsButton');

  if (!titleElement) return;

  try {
    const response = await fetch(EMERGENCY_API_URL);

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error('Invalid emergency data');
    }

    if (result.data.length === 0) {
      levelElement.textContent = 'No Emergency';

      titleElement.textContent = 'No active emergency notice';

      descriptionElement.textContent =
        'There are currently no emergency updates.';

      buttonElement.style.display = 'none';

      return;
    }

    const emergency = result.data[0];

    levelElement.textContent = emergency.level || 'Emergency';

    titleElement.textContent = emergency.title;

    descriptionElement.textContent = emergency.description;

    buttonElement.href = `./pages/public/emergency-details.html?id=${emergency.id}`;
  } catch (error) {
    console.error('Emergency load error:', error);

    titleElement.textContent = 'Unable to load emergency notice';
  }
}

loadEmergencyNotice();
