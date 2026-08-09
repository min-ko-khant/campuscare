const NEWS_DETAILS_API = 'http://localhost:5000/api/news';

document.addEventListener('DOMContentLoaded', () => {
  loadNewsDetails();
});

async function loadNewsDetails() {
  const container = document.getElementById('newsDetailsContainer');

  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const newsId = params.get('id');

  if (!newsId || !/^\d+$/.test(newsId)) {
    showError(container, 'Invalid news ID.');
    return;
  }

  try {
    const response = await fetch(
      `${NEWS_DETAILS_API}/${encodeURIComponent(newsId)}`
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'News not found');
    }

    renderNewsDetails(container, result.data);
  } catch (error) {
    console.error('News details error:', error);

    showError(container, error.message || 'Unable to load news details.');
  }
}

function renderNewsDetails(container, news) {
  const imagePath = news.image
    ? `../../assets/images/news/${news.image}`
    : '../../assets/images/news/default-news.jpg';

  const publishedDate = formatDate(news.created_at);

  container.className = 'news-details-article glass';

  container.innerHTML = `
        <img
            class="news-details-image"
            src="${escapeHTML(imagePath)}"
            alt="${escapeHTML(news.title)}"
            onerror="this.src='../../assets/images/news/default-news.jpg'"
        />

        <div class="news-details-content">

            <span class="news-details-category">
                ${escapeHTML(news.category || 'Campus')}
            </span>

            <h1 class="news-details-title">
                ${escapeHTML(news.title)}
            </h1>

            <p class="news-details-summary">
                ${escapeHTML(news.summary || '')}
            </p>

            <div class="news-details-meta">
                <span>📅 ${publishedDate}</span>
                <span>✍️ ${escapeHTML(news.author || 'CampusCare')}</span>
                <span>👁️ ${Number(news.views || 0).toLocaleString()} views</span>
            </div>

            <div class="news-details-body">
                ${escapeHTML(news.content || 'No content available.')}
            </div>

        </div>
    `;
}

function showError(container, message) {
  container.className = 'news-details-error glass';

  container.innerHTML = `
        <h2>Unable to open this news</h2>
        <p>${escapeHTML(message)}</p>
    `;
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
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
