const NEWS_API_URL = "http://localhost:5000/api/news";

document.addEventListener("DOMContentLoaded", () => {
    loadAllNews();
});

async function loadAllNews() {
    const container = document.getElementById("newsContainer");

    if (!container) {
        console.error("newsContainer not found");
        return;
    }

    try {
        const response = await fetch(NEWS_API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Invalid news response");
        }

        if (result.data.length === 0) {
            container.innerHTML = `
                <div class="news-empty glass">
                    <h2>No News Available</h2>
                    <p>Latest campus news will appear here.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = result.data
            .map((news) => createNewsCard(news))
            .join("");
    } catch (error) {
        console.error("Load news error:", error);

        container.innerHTML = `
            <div class="news-error glass">
                <h2>Unable to Load News</h2>
                <p>Please check the backend server and try again.</p>
            </div>
        `;
    }
}

function createNewsCard(news) {
    const imagePath = news.image
        ? `../../assets/images/news/${news.image}`
        : "../../assets/images/news/default-news.jpg";

    const publishedDate = formatNewsDate(news.created_at);

    return `
        <article class="news-card glass">

            <div class="news-image">
                <img
                    src="${escapeHTML(imagePath)}"
                    alt="${escapeHTML(news.title)}"
                    loading="lazy"
                    onerror="this.src='../../assets/images/news/default-news.jpg'"
                />

                <span class="news-category">
                    ${escapeHTML(news.category || "Campus")}
                </span>
            </div>

            <div class="news-content">

                <span class="news-date">
                    📅 ${publishedDate}
                </span>

                <h3>
                    ${escapeHTML(news.title)}
                </h3>

                <p>
                    ${escapeHTML(
        news.summary || "No summary available."
    )}
                </p>

                <div class="news-footer">

                    <div class="news-meta">
                        <span>
                            👁️ ${Number(news.views || 0).toLocaleString()}
                        </span>
                    </div>

                    <a
                        href="./news-details.html?id=${encodeURIComponent(news.id)}"
                    >
                        Read More →
                    </a>

                </div>

            </div>

        </article>
    `;
}

function formatNewsDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}