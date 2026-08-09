const EVENTS_API_URL = 'http://localhost:5000/api/events';

let allEvents = [];

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('eventSearchInput');

  const categoryFilter = document.getElementById('eventCategoryFilter');

  searchInput?.addEventListener('input', renderFilteredEvents);
  categoryFilter?.addEventListener('change', renderFilteredEvents);

  loadAllEvents();
});

async function loadAllEvents() {
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

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error('Invalid events response');
    }

    allEvents = result.data;

    renderEvents(allEvents);
  } catch (error) {
    console.error('Load events error:', error);

    container.innerHTML = `
            <div class="events-error glass">
                <h2>Unable to Load Events</h2>

                <p>
                    Please check the backend server and try again.
                </p>
            </div>
        `;
  }
}

function renderFilteredEvents() {
  const searchValue =
    document.getElementById('eventSearchInput')?.value.trim().toLowerCase() ||
    '';

  const selectedCategory =
    document.getElementById('eventCategoryFilter')?.value.toLowerCase() ||
    'all';

  const filteredEvents = allEvents.filter((event) => {
    const title = String(event.title || '').toLowerCase();

    const description = String(event.description || '').toLowerCase();

    const location = String(event.location || '').toLowerCase();

    const category = String(event.category || '').toLowerCase();

    const matchesSearch =
      title.includes(searchValue) ||
      description.includes(searchValue) ||
      location.includes(searchValue) ||
      category.includes(searchValue);

    const matchesCategory =
      selectedCategory === 'all' || category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  renderEvents(filteredEvents);
}

function renderEvents(events) {
  const container = document.getElementById('eventsContainer');

  if (!container) return;

  if (!Array.isArray(events) || events.length === 0) {
    container.innerHTML = `
            <div class="events-empty glass">
                <h2>No Events Found</h2>

                <p>
                    Try another search term or category.
                </p>
            </div>
        `;

    return;
  }

  container.innerHTML = events.map((event) => createEventCard(event)).join('');
}

function createEventCard(event) {
  const dateParts = formatEventDateParts(event.event_date);

  const startTime = formatEventTime(event.start_time);

  const endTime = formatEventTime(event.end_time);

  const imagePath = event.image
    ? `../../assets/images/events/${event.image}`
    : '../../assets/images/events/default-event.jpg';

  return `
        <article class="event-card glass">

            <div class="event-date">

                <span class="event-day">
                    ${dateParts.day}
                </span>

                <span class="event-month">
                    ${dateParts.month}
                </span>

            </div>

            <div class="event-main">

                <div class="event-image">

                    <img
                        src="${escapeHTML(imagePath)}"
                        alt="${escapeHTML(event.title)}"
                        loading="lazy"
                        onerror="this.src='../../assets/images/events/default-event.jpg'"
                    >

                    <span class="event-type">
                        ${escapeHTML(event.category || 'Event')}
                    </span>

                </div>

                <div class="event-content">

                    <div class="event-time">
                        🕘 ${startTime} – ${endTime}
                    </div>

                    <h2>
                        ${escapeHTML(event.title)}
                    </h2>

                    <p>
                        ${escapeHTML(
                          event.description || 'No description available.'
                        )}
                    </p>

                    <div class="event-location">

                        <span aria-hidden="true">
                            📍
                        </span>

                        <span>
                            ${escapeHTML(
                              event.location || 'Location not specified'
                            )}
                        </span>

                    </div>

                    <div class="event-footer">

                        <a
                            href="./event-details.html?id=${encodeURIComponent(event.id)}"
                            class="event-details-button"
                        >
                            View Details →
                        </a>

                    </div>

                </div>

            </div>

        </article>
    `;
}

function formatEventDateParts(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      day: '--',
      month: '---',
    };
  }

  return {
    day: date.toLocaleDateString('en-US', {
      day: '2-digit',
    }),

    month: date
      .toLocaleDateString('en-US', {
        month: 'short',
      })
      .toUpperCase(),
  };
}

function formatEventTime(value) {
  if (!value) {
    return 'Time not specified';
  }

  const [hours, minutes] = String(value).split(':');

  const date = new Date();

  date.setHours(Number(hours), Number(minutes), 0, 0);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
