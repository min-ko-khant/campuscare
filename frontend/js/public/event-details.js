/* =====================================
   CampusCare - Event Details
===================================== */

const EVENTS_API_URL = 'http://localhost:5000/api/events';

document.addEventListener('DOMContentLoaded', () => {
  loadEventDetails();
});

/* =====================================
   Load Event Details
===================================== */

async function loadEventDetails() {
  const container = document.getElementById('eventDetails');

  if (!container) {
    console.error('eventDetails container not found');
    return;
  }

  const params = new URLSearchParams(window.location.search);

  const eventId = params.get('id');

  if (!eventId || !/^\d+$/.test(eventId)) {
    showEventError(container, 'Invalid event ID.');

    return;
  }

  try {
    const response = await fetch(
      `${EVENTS_API_URL}/${encodeURIComponent(eventId)}`
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Event not found.');
    }

    const event = result.data;

    renderEvent(container, event);

    updatePageInformation(event);

    await loadRelatedEvents(event);
  } catch (error) {
    console.error('Load event details error:', error);

    showEventError(container, error.message || 'Unable to load this event.');
  }
}

/* =====================================
   Render Event
===================================== */

function renderEvent(container, event) {
  const imagePath = getEventImage(event.image);

  const status = calculateEventStatus(
    event.event_date,
    event.start_time,
    event.end_time
  );

  const formattedDate = formatEventDate(event.event_date);

  const startTime = formatEventTime(event.start_time);

  const endTime = formatEventTime(event.end_time);

  container.innerHTML = `

        <article class="event-details-card">

            <!-- HERO -->

            <div class="event-hero">

                <img
                    class="event-hero-image"
                    src="${escapeHTML(imagePath)}"
                    alt="${escapeHTML(event.title)}"
                    onerror="this.src='../../assets/images/events/default-event.jpg'"
                >

                <div class="event-hero-overlay"></div>

                <div class="event-hero-content">

                    <div class="event-hero-top">

                        <span class="event-category-badge">
                            ${escapeHTML(event.category || 'Event')}
                        </span>

                        <span
                            class="event-status-badge ${status.className}"
                        >
                            ${status.icon}
                            ${status.label}
                        </span>

                    </div>

                    <h1>
                        ${escapeHTML(event.title)}
                    </h1>

                    <div class="event-hero-location">

                        <span>📍</span>

                        <span>
                            ${escapeHTML(
                              event.location || 'Location not specified'
                            )}
                        </span>

                    </div>

                </div>

            </div>


            <!-- BODY -->

            <div class="event-body">

                <!-- LEFT -->

                <div>

                    <section class="event-description-section">

                        <span class="event-section-label">
                            About this event
                        </span>

                        <h2>
                            Event Overview
                        </h2>

                        <p class="event-description">
                            ${escapeHTML(
                              event.description ||
                                'No description is available for this event.'
                            )}
                        </p>

                    </section>


                    <!-- INFO CARDS -->

                    <div class="event-info-grid">

                        <article class="event-info-card">

                            <div class="event-info-icon">
                                📅
                            </div>

                            <div>

                                <span>
                                    Event Date
                                </span>

                                <strong>
                                    ${formattedDate}
                                </strong>

                            </div>

                        </article>


                        <article class="event-info-card">

                            <div class="event-info-icon">
                                🕒
                            </div>

                            <div>

                                <span>
                                    Event Time
                                </span>

                                <strong>
                                    ${startTime} – ${endTime}
                                </strong>

                            </div>

                        </article>


                        <article class="event-info-card">

                            <div class="event-info-icon">
                                📍
                            </div>

                            <div>

                                <span>
                                    Location
                                </span>

                                <strong>
                                    ${escapeHTML(
                                      event.location || 'Not specified'
                                    )}
                                </strong>

                            </div>

                        </article>


                        <article class="event-info-card">

                            <div class="event-info-icon">
                                🏷️
                            </div>

                            <div>

                                <span>
                                    Category
                                </span>

                                <strong>
                                    ${escapeHTML(event.category || 'Event')}
                                </strong>

                            </div>

                        </article>

                    </div>

                </div>


                <!-- RIGHT SIDEBAR -->

                <aside class="event-sidebar">

                    <div class="event-sidebar-card">

                        <h3>
                            Event Information
                        </h3>

                        <div class="event-sidebar-row">

                            <span>Status</span>

                            <strong>
                                ${status.label}
                            </strong>

                        </div>

                        <div class="event-sidebar-row">

                            <span>Category</span>

                            <strong>
                                ${escapeHTML(event.category || 'Event')}
                            </strong>

                        </div>

                        <div class="event-sidebar-row">

                            <span>Date</span>

                            <strong>
                                ${formattedDate}
                            </strong>

                        </div>

                        <div class="event-sidebar-row">

                            <span>Starts</span>

                            <strong>
                                ${startTime}
                            </strong>

                        </div>

                        <div class="event-sidebar-row">

                            <span>Ends</span>

                            <strong>
                                ${endTime}
                            </strong>

                        </div>

                    </div>


                    <!-- ACTIONS -->

                    <div
                        class="event-sidebar-card calendar-wrapper"
                    >

                        <h3>
                            Event Actions
                        </h3>

                        <div class="event-actions">

                            <button
                                type="button"
                                class="event-action-primary"
                                id="calendarButton"
                            >
                                📅 Add to Calendar
                            </button>

                            <div
                                class="calendar-options"
                                id="calendarOptions"
                                hidden
                            >

                                <button
                                    type="button"
                                    class="calendar-option"
                                    id="googleCalendarOption"
                                >
                                    🟦 Google Calendar
                                </button>

                                <button
                                    type="button"
                                    class="calendar-option"
                                    id="outlookCalendarOption"
                                >
                                    🟪 Outlook Calendar
                                </button>

                                <button
                                    type="button"
                                    class="calendar-option"
                                    id="icsCalendarOption"
                                >
                                    📥 Apple / Download .ics
                                </button>

                            </div>


                            <button
                                type="button"
                                class="event-action-secondary"
                                id="shareEventButton"
                            >
                                🔗 Share Event
                            </button>


                            <a
                                href="./events.html"
                                class="event-action-secondary"
                            >
                                ← Back to Events
                            </a>

                        </div>

                    </div>


                    <div class="event-login-note">

                        Event registration will become
                        available after the CampusCare
                        authentication module is connected.

                    </div>

                </aside>

            </div>

        </article>
    `;

  setupEventActions(event);
}

/* =====================================
   Page Information
===================================== */

function updatePageInformation(event) {
  document.title = `${event.title} | CampusCare`;

  const breadcrumb = document.getElementById('breadcrumbTitle');

  if (breadcrumb) {
    breadcrumb.textContent = event.title;
  }
}

/* =====================================
   Event Status
===================================== */

function calculateEventStatus(dateValue, startTime, endTime) {
  const eventDate = getLocalEventDate(dateValue);

  if (!eventDate) {
    return {
      label: 'Scheduled',
      icon: '●',
      className: '',
    };
  }

  const now = new Date();

  const eventStart = combineDateAndTime(eventDate, startTime);

  const eventEnd = combineDateAndTime(eventDate, endTime);

  if (eventStart && eventEnd && now >= eventStart && now <= eventEnd) {
    return {
      label: 'Happening Today',
      icon: '●',
      className: 'today',
    };
  }

  if (eventEnd && now > eventEnd) {
    return {
      label: 'Completed',
      icon: '●',
      className: 'completed',
    };
  }

  return {
    label: 'Upcoming',
    icon: '●',
    className: '',
  };
}

/* =====================================
   Setup Event Actions
===================================== */

function setupEventActions(event) {
  const calendarButton = document.getElementById('calendarButton');

  const calendarOptions = document.getElementById('calendarOptions');

  const googleButton = document.getElementById('googleCalendarOption');

  const outlookButton = document.getElementById('outlookCalendarOption');

  const icsButton = document.getElementById('icsCalendarOption');

  const shareButton = document.getElementById('shareEventButton');

  calendarButton?.addEventListener('click', () => {
    if (!calendarOptions) return;

    calendarOptions.hidden = !calendarOptions.hidden;
  });

  googleButton?.addEventListener('click', () => {
    openGoogleCalendar(event);

    if (calendarOptions) {
      calendarOptions.hidden = true;
    }
  });

  outlookButton?.addEventListener('click', () => {
    openOutlookCalendar(event);

    if (calendarOptions) {
      calendarOptions.hidden = true;
    }
  });

  icsButton?.addEventListener('click', () => {
    downloadEventCalendar(event);

    if (calendarOptions) {
      calendarOptions.hidden = true;
    }
  });

  shareButton?.addEventListener('click', () => {
    shareEvent(event);
  });
}

/* =====================================
   Google Calendar
===================================== */

function openGoogleCalendar(event) {
  const calendarData = buildCalendarData(event);

  if (!calendarData) {
    return;
  }

  const { start, end } = calendarData;

  const googleURL = new URL('https://calendar.google.com/calendar/render');

  googleURL.searchParams.set('action', 'TEMPLATE');

  googleURL.searchParams.set('text', event.title || 'CampusCare Event');

  googleURL.searchParams.set(
    'dates',
    `${toGoogleCalendarDate(start)}/${toGoogleCalendarDate(end)}`
  );

  googleURL.searchParams.set('details', event.description || '');

  googleURL.searchParams.set('location', event.location || '');

  googleURL.searchParams.set('sf', 'true');

  googleURL.searchParams.set('output', 'xml');

  const newWindow = window.open(googleURL.toString(), '_blank');

  if (!newWindow) {
    alert(
      'Your browser blocked the calendar window. Please allow pop-ups for this website.'
    );
  }
}

/* =====================================
   Outlook Calendar
===================================== */

function openOutlookCalendar(event) {
  const calendarData = buildCalendarData(event);

  if (!calendarData) {
    return;
  }

  const { start, end } = calendarData;

  const outlookURL = new URL(
    'https://outlook.live.com/calendar/0/deeplink/compose'
  );

  outlookURL.searchParams.set('path', '/calendar/action/compose');

  outlookURL.searchParams.set('rru', 'addevent');

  outlookURL.searchParams.set('subject', event.title || 'CampusCare Event');

  outlookURL.searchParams.set('startdt', start.toISOString());

  outlookURL.searchParams.set('enddt', end.toISOString());

  outlookURL.searchParams.set('body', event.description || '');

  outlookURL.searchParams.set('location', event.location || '');

  const newWindow = window.open(outlookURL.toString(), '_blank');

  if (!newWindow) {
    alert(
      'Your browser blocked the Outlook Calendar window. Please allow pop-ups.'
    );
  }
}

/* =====================================
   Download .ICS
   Apple Calendar / Outlook Desktop /
   Windows Calendar etc.
===================================== */

function downloadEventCalendar(event) {
  const calendarData = buildCalendarData(event);

  if (!calendarData) {
    return;
  }

  const { start, end } = calendarData;

  const calendarText = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CampusCare//Campus Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',

    'BEGIN:VEVENT',

    `UID:campuscare-event-${event.id}@campuscare.local`,

    `DTSTAMP:${toICSDate(new Date())}`,

    `DTSTART:${toICSDate(start)}`,

    `DTEND:${toICSDate(end)}`,

    `SUMMARY:${escapeICS(event.title || 'CampusCare Event')}`,

    `DESCRIPTION:${escapeICS(event.description || '')}`,

    `LOCATION:${escapeICS(event.location || '')}`,

    `URL:${escapeICS(window.location.href)}`,

    'STATUS:CONFIRMED',

    'END:VEVENT',

    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([calendarText], {
    type: 'text/calendar;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;

  link.download = `campuscare-${slugify(event.title || 'event')}.ics`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

/* =====================================
   Calendar Data
===================================== */

function buildCalendarData(event) {
  const eventDate = getLocalEventDate(event.event_date);

  if (!eventDate) {
    alert('Event date is unavailable.');

    return null;
  }

  const start = combineDateAndTime(eventDate, event.start_time);

  let end = combineDateAndTime(eventDate, event.end_time);

  if (!start) {
    alert('Event start time is unavailable.');

    return null;
  }

  /*
   * End time မရှိရင်
   * default 1 hour သတ်မှတ်မယ်။
   */

  if (!end) {
    end = new Date(start.getTime() + 60 * 60 * 1000);
  }

  /*
   * end <= start ဖြစ်နေရင်
   * နောက်နေ့အဖြစ်သတ်မှတ်မယ်။
   */

  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }

  return {
    start,
    end,
  };
}

/* =====================================
   Google Calendar Date
===================================== */

function toGoogleCalendarDate(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
}

/* =====================================
   Share Event
===================================== */

async function shareEvent(event) {
  const shareData = {
    title: event.title || 'CampusCare Event',

    text: event.description || 'CampusCare campus event',

    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);

      return;
    }

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(window.location.href);

      alert('Event link copied to clipboard.');

      return;
    }

    fallbackCopyToClipboard(window.location.href);

    alert('Event link copied to clipboard.');
  } catch (error) {
    if (error?.name !== 'AbortError') {
      console.error('Share event error:', error);
    }
  }
}

/* =====================================
   Clipboard Fallback
===================================== */

function fallbackCopyToClipboard(text) {
  const textarea = document.createElement('textarea');

  textarea.value = text;

  textarea.style.position = 'fixed';

  textarea.style.opacity = '0';

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  document.execCommand('copy');

  textarea.remove();
}

/* =====================================
   Related Events
===================================== */

async function loadRelatedEvents(currentEvent) {
  const section = document.getElementById('relatedEventsSection');

  const container = document.getElementById('relatedEventsContainer');

  if (!section || !container) {
    return;
  }

  try {
    const response = await fetch(EVENTS_API_URL);

    if (!response.ok) {
      return;
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      return;
    }

    const currentId = Number(currentEvent.id);

    const currentCategory = String(currentEvent.category || '').toLowerCase();

    const sameCategory = result.data.filter(
      (item) =>
        Number(item.id) !== currentId &&
        String(item.category || '').toLowerCase() === currentCategory
    );

    const otherEvents = result.data.filter(
      (item) =>
        Number(item.id) !== currentId &&
        !sameCategory.some((related) => Number(related.id) === Number(item.id))
    );

    const relatedEvents = [...sameCategory, ...otherEvents].slice(0, 3);

    if (relatedEvents.length === 0) {
      section.hidden = true;
      return;
    }

    container.innerHTML = relatedEvents.map(createRelatedEventCard).join('');

    section.hidden = false;
  } catch (error) {
    console.error('Related events error:', error);
  }
}

/* =====================================
   Related Event Card
===================================== */

function createRelatedEventCard(event) {
  const imagePath = getEventImage(event.image);

  const date = formatEventDate(event.event_date);

  return `

        <article class="related-event-card">

            <div class="related-event-image">

                <img
                    src="${escapeHTML(imagePath)}"
                    alt="${escapeHTML(event.title)}"
                    loading="lazy"
                    onerror="this.src='../../assets/images/events/default-event.jpg'"
                >

            </div>


            <div class="related-event-content">

                <span class="related-event-category">
                    ${escapeHTML(event.category || 'Event')}
                </span>

                <h3>
                    ${escapeHTML(event.title)}
                </h3>

                <p>
                    📅 ${date}
                </p>

                <a
                    href="./event-details.html?id=${encodeURIComponent(event.id)}"
                    class="related-event-link"
                >
                    View Event →
                </a>

            </div>

        </article>
    `;
}

/* =====================================
   Date Formatting
===================================== */

function formatEventDate(value) {
  const date = getLocalEventDate(value);

  if (!date) {
    return 'Date not available';
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/* =====================================
   MySQL Date Fix
===================================== */

function getLocalEventDate(value) {
  if (!value) {
    return null;
  }

  /*
   * API က
   * 2026-08-12T17:30:00.000Z
   * ပြန်လာနိုင်လို့ date portion
   * ကိုအရင်ယူတယ်။
   */

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (match) {
    const year = Number(match[1]);

    const month = Number(match[2]);

    const day = Number(match[3]);

    const result = new Date(year, month - 1, day);

    if (!Number.isNaN(result.getTime())) {
      return result;
    }
  }

  const fallback = new Date(value);

  if (Number.isNaN(fallback.getTime())) {
    return null;
  }

  return fallback;
}

/* =====================================
   Time Formatting
===================================== */

function formatEventTime(value) {
  if (!value) {
    return 'Not specified';
  }

  const parts = String(value).split(':');

  if (parts.length < 2) {
    return String(value);
  }

  const hours = Number(parts[0]);

  const minutes = Number(parts[1]);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return String(value);
  }

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/* =====================================
   Combine Date + Time
===================================== */

function combineDateAndTime(date, time) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return null;
  }

  if (!time) {
    return null;
  }

  const parts = String(time).split(':');

  if (parts.length < 2) {
    return null;
  }

  const hours = Number(parts[0]);

  const minutes = Number(parts[1]);

  const seconds = Number(parts[2] || 0);

  if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
    return null;
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    seconds
  );
}

/* =====================================
   Event Image
===================================== */

function getEventImage(image) {
  if (!image) {
    return '../../assets/images/events/' + 'default-event.jpg';
  }

  return '../../assets/images/events/' + image;
}

/* =====================================
   ICS Date
===================================== */

function toICSDate(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
}

/* =====================================
   Escape ICS
===================================== */

function escapeICS(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

/* =====================================
   Filename
===================================== */

function slugify(value) {
  return String(value || 'event')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* =====================================
   Escape HTML
===================================== */

function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/* =====================================
   Error State
===================================== */

function showEventError(container, message) {
  container.innerHTML = `

        <div class="event-error-state glass">

            <h2>
                Event Not Available
            </h2>

            <p>
                ${escapeHTML(message)}
            </p>

            <br>

            <a
                href="./pages/public/event-details.html"
                class="event-action-primary"
            >
                ← Return to Events
            </a>

        </div>
    `;
}
