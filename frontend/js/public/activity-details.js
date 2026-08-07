/* =====================================
   CampusCare Activity Details
===================================== */

const ACTIVITIES_API_URL =
    "http://localhost:5000/api/activities";

let galleryImages = [];
let currentGalleryIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    initActivityDetails();
});


/* =====================================
   Init
===================================== */

async function initActivityDetails() {

    const params =
        new URLSearchParams(window.location.search);

    const activityId =
        params.get("id");

    if (
        !activityId ||
        !/^\d+$/.test(activityId)
    ) {
        showActivityError(
            "Invalid activity ID."
        );

        return;
    }

    await loadActivity(activityId);
}


/* =====================================
   Load Activity
===================================== */

async function loadActivity(activityId) {

    const container =
        document.getElementById(
            "activityDetailsContainer"
        );

    if (!container) return;

    try {

        const response =
            await fetch(
                `${ACTIVITIES_API_URL}/${encodeURIComponent(activityId)}`
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success ||
            !result.data
        ) {
            throw new Error(
                result.message ||
                "Activity not found."
            );
        }

        const activity =
            result.data;

        renderActivity(activity);

        updateActivityPageInfo(activity);

        await Promise.all([
            loadActivityMedia(activityId),
            loadRelatedActivities(activity)
        ]);

    } catch (error) {

        console.error(
            "Load activity error:",
            error
        );

        showActivityError(
            error.message ||
            "Unable to load activity."
        );
    }
}


/* =====================================
   Render Main Activity
===================================== */

function renderActivity(activity) {

    const container =
        document.getElementById(
            "activityDetailsContainer"
        );

    if (!container) return;

    const imagePath =
        getActivityImage(activity.image);

    const formattedDate =
        formatActivityDate(
            activity.activity_date
        );

    container.innerHTML = `
        <article class="activity-detail-card">

            <div class="activity-hero">

                <img
                    class="activity-hero-image"
                    src="${escapeHTML(imagePath)}"
                    alt="${escapeHTML(activity.title)}"
                    onerror="this.src='../../assets/images/activities/default-activity.jpg'"
                >

                <div class="activity-hero-overlay"></div>

                <div class="activity-hero-content">

                    <div class="activity-hero-meta">

                        <span class="activity-category-badge">
                            ${escapeHTML(
        activity.category ||
        "Activity"
    )}
                        </span>

                        <span class="activity-date-badge">
                            📅 ${formattedDate}
                        </span>

                    </div>

                    <h1>
                        ${escapeHTML(activity.title)}
                    </h1>

                </div>

            </div>


            <div class="activity-detail-body">

                <div>

                    <section class="activity-overview">

                        <span class="activity-section-label">
                            About this activity
                        </span>

                        <h2>
                            Activity Overview
                        </h2>

                        <p class="activity-description">
                            ${escapeHTML(
        activity.description ||
        "No description available."
    )}
                        </p>

                    </section>


                    <div class="activity-info-grid">

                        <article class="activity-info-card">

                            <div class="activity-info-icon">
                                📅
                            </div>

                            <div>
                                <span>
                                    Activity Date
                                </span>

                                <strong>
                                    ${formattedDate}
                                </strong>
                            </div>

                        </article>


                        <article class="activity-info-card">

                            <div class="activity-info-icon">
                                🏷️
                            </div>

                            <div>
                                <span>
                                    Category
                                </span>

                                <strong>
                                    ${escapeHTML(
        activity.category ||
        "Activity"
    )}
                                </strong>
                            </div>

                        </article>

                    </div>

                </div>


                <aside class="activity-sidebar">

                    <div class="activity-sidebar-card">

                        <h3>
                            Activity Information
                        </h3>

                        <div class="activity-sidebar-row">
                            <span>
                                Activity
                            </span>

                            <strong>
                                ${escapeHTML(
        activity.title
    )}
                            </strong>
                        </div>

                        <div class="activity-sidebar-row">
                            <span>
                                Category
                            </span>

                            <strong>
                                ${escapeHTML(
        activity.category ||
        "Activity"
    )}
                            </strong>
                        </div>

                        <div class="activity-sidebar-row">
                            <span>
                                Date
                            </span>

                            <strong>
                                ${formattedDate}
                            </strong>
                        </div>

                    </div>


                    <div class="activity-sidebar-card">

                        <h3>
                            Explore
                        </h3>

                        <a
                            href="./activities.html"
                            class="activity-back-button"
                        >
                            ← Back to Activities
                        </a>

                    </div>

                </aside>

            </div>

        </article>
    `;
}


/* =====================================
   Load Media
===================================== */

async function loadActivityMedia(activityId) {

    try {

        const response =
            await fetch(
                `${ACTIVITIES_API_URL}/${encodeURIComponent(activityId)}/media`
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success ||
            !Array.isArray(result.data)
        ) {
            return;
        }

        const media =
            result.data;

        const images =
            media.filter(
                item =>
                    item.media_type === "image"
            );

        const videos =
            media.filter(
                item =>
                    item.media_type === "video"
            );

        renderGallery(images);

        renderVideos(videos);

    } catch (error) {

        console.error(
            "Load activity media error:",
            error
        );
    }
}


/* =====================================
   Gallery
===================================== */

function renderGallery(images) {

    const section =
        document.getElementById(
            "activityGallerySection"
        );

    const container =
        document.getElementById(
            "activityGalleryContainer"
        );

    if (
        !section ||
        !container
    ) {
        return;
    }

    if (
        !Array.isArray(images) ||
        images.length === 0
    ) {
        section.hidden = true;
        return;
    }

    galleryImages =
        images.map(item => ({
            ...item,
            imagePath:
                getGalleryImage(
                    item.media_url
                )
        }));

    container.innerHTML =
        galleryImages
            .map(
                (item, index) =>
                    createGalleryItem(
                        item,
                        index
                    )
            )
            .join("");

    section.hidden = false;

    setupGalleryEvents();
}


function createGalleryItem(
    item,
    index
) {

    return `
        <article
            class="activity-gallery-item"
            data-gallery-index="${index}"
            tabindex="0"
            role="button"
            aria-label="Open ${escapeHTML(
        item.title ||
        "activity image"
    )}"
        >

            <img
                src="${escapeHTML(item.imagePath)}"
                alt="${escapeHTML(
        item.title ||
        "Activity image"
    )}"
                loading="lazy"
                onerror="this.src='../../assets/images/activities/default-activity.jpg'"
            >

            <div class="activity-gallery-overlay">

                <h3>
                    ${escapeHTML(
        item.title ||
        "Activity Moment"
    )}
                </h3>

            </div>

        </article>
    `;
}


function setupGalleryEvents() {

    document
        .querySelectorAll(
            "[data-gallery-index]"
        )
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {
                    const index =
                        Number(
                            item.dataset.galleryIndex
                        );

                    openLightbox(index);
                }
            );

            item.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {
                        event.preventDefault();

                        openLightbox(
                            Number(
                                item.dataset.galleryIndex
                            )
                        );
                    }
                }
            );

        });
}


/* =====================================
   Lightbox
===================================== */

function openLightbox(index) {

    if (
        galleryImages.length === 0
    ) {
        return;
    }

    currentGalleryIndex =
        index;

    updateLightbox();

    const lightbox =
        document.getElementById(
            "activityLightbox"
        );

    if (!lightbox) return;

    lightbox.classList.add(
        "active"
    );

    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}


function closeLightbox() {

    const lightbox =
        document.getElementById(
            "activityLightbox"
        );

    if (!lightbox) return;

    lightbox.classList.remove(
        "active"
    );

    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";
}


function updateLightbox() {

    const image =
        galleryImages[
        currentGalleryIndex
        ];

    if (!image) return;

    const imageElement =
        document.getElementById(
            "lightboxImage"
        );

    const titleElement =
        document.getElementById(
            "lightboxTitle"
        );

    const counterElement =
        document.getElementById(
            "lightboxCounter"
        );

    if (imageElement) {

        imageElement.src =
            image.imagePath;

        imageElement.alt =
            image.title ||
            "Activity image";
    }

    if (titleElement) {

        titleElement.textContent =
            image.title ||
            "Activity Moment";
    }

    if (counterElement) {

        counterElement.textContent =
            `${currentGalleryIndex + 1} / ${galleryImages.length}`;
    }
}


function showPreviousImage() {

    currentGalleryIndex =
        (
            currentGalleryIndex -
            1 +
            galleryImages.length
        ) %
        galleryImages.length;

    updateLightbox();
}


function showNextImage() {

    currentGalleryIndex =
        (
            currentGalleryIndex +
            1
        ) %
        galleryImages.length;

    updateLightbox();
}


/* =====================================
   Videos
===================================== */

function renderVideos(videos) {

    const section =
        document.getElementById(
            "activityVideoSection"
        );

    const container =
        document.getElementById(
            "activityVideoContainer"
        );

    if (
        !section ||
        !container
    ) {
        return;
    }

    if (
        !Array.isArray(videos) ||
        videos.length === 0
    ) {
        section.hidden = true;
        return;
    }

    container.innerHTML =
        videos
            .map(
                (video, index) =>
                    createVideoCard(
                        video,
                        index
                    )
            )
            .join("");

    section.hidden = false;

    setupVideoEvents(videos);
}


function createVideoCard(
    video,
    index
) {

    const thumbnail =
        getVideoThumbnail(
            video.media_url,
            video.thumbnail
        );

    return `
        <article
            class="activity-video-card"
            data-video-index="${index}"
            tabindex="0"
            role="button"
        >

            <div class="activity-video-preview">

                ${thumbnail
            ? `
                            <img
                                src="${escapeHTML(thumbnail)}"
                                alt="${escapeHTML(
                video.title ||
                "Activity video"
            )}"
                                loading="lazy"
                            >
                        `
            : ""
        }

                <div class="activity-video-play">
                    ▶
                </div>

            </div>

            <div class="activity-video-card-content">

                <h3>
                    ${escapeHTML(
            video.title ||
            "Activity Video"
        )}
                </h3>

            </div>

        </article>
    `;
}


function setupVideoEvents(videos) {

    document
        .querySelectorAll(
            "[data-video-index]"
        )
        .forEach(card => {

            const openVideo =
                () => {

                    const index =
                        Number(
                            card.dataset.videoIndex
                        );

                    const video =
                        videos[index];

                    if (!video) return;

                    openVideoModal(video);
                };


            card.addEventListener(
                "click",
                openVideo
            );


            card.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        openVideo();
                    }
                }
            );

        });
}


/* =====================================
   Video Modal
===================================== */

function openVideoModal(video) {

    const modal =
        document.getElementById(
            "activityVideoModal"
        );

    const player =
        document.getElementById(
            "activityVideoPlayer"
        );

    const title =
        document.getElementById(
            "videoModalTitle"
        );

    if (
        !modal ||
        !player
    ) {
        return;
    }

    const embedUrl =
        normalizeYouTubeEmbedUrl(
            video.media_url
        );

    if (!embedUrl) {

        alert(
            "Video URL is invalid."
        );

        return;
    }

    player.src =
        `${embedUrl}?autoplay=1`;

    if (title) {

        title.textContent =
            video.title ||
            "Activity Video";
    }

    modal.classList.add(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}


function closeVideoModal() {

    const modal =
        document.getElementById(
            "activityVideoModal"
        );

    const player =
        document.getElementById(
            "activityVideoPlayer"
        );

    if (!modal) return;

    modal.classList.remove(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    if (player) {
        player.src = "";
    }

    document.body.style.overflow =
        "";
}


/* =====================================
   Related Activities
===================================== */

async function loadRelatedActivities(
    currentActivity
) {

    const section =
        document.getElementById(
            "relatedActivitiesSection"
        );

    const container =
        document.getElementById(
            "relatedActivitiesContainer"
        );

    if (
        !section ||
        !container
    ) {
        return;
    }

    try {

        const response =
            await fetch(
                ACTIVITIES_API_URL
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success ||
            !Array.isArray(result.data)
        ) {
            return;
        }

        const currentId =
            Number(
                currentActivity.id
            );

        const sameCategory =
            result.data.filter(
                activity =>
                    Number(activity.id) !== currentId &&
                    String(
                        activity.category || ""
                    ).toLowerCase() ===
                    String(
                        currentActivity.category || ""
                    ).toLowerCase()
            );

        const others =
            result.data.filter(
                activity =>
                    Number(activity.id) !== currentId &&
                    !sameCategory.some(
                        item =>
                            Number(item.id) ===
                            Number(activity.id)
                    )
            );

        const related = [
            ...sameCategory,
            ...others
        ].slice(0, 3);

        if (
            related.length === 0
        ) {
            section.hidden = true;
            return;
        }

        container.innerHTML =
            related
                .map(
                    createRelatedActivityCard
                )
                .join("");

        section.hidden = false;

    } catch (error) {

        console.error(
            "Related activities error:",
            error
        );
    }
}


function createRelatedActivityCard(
    activity
) {

    const imagePath =
        getActivityImage(
            activity.image
        );

    const formattedDate =
        formatActivityDate(
            activity.activity_date
        );

    return `
        <article class="related-activity-card">

            <div class="related-activity-image">

                <img
                    src="${escapeHTML(imagePath)}"
                    alt="${escapeHTML(activity.title)}"
                    loading="lazy"
                    onerror="this.src='../../assets/images/activities/default-activity.jpg'"
                >

            </div>

            <div class="related-activity-content">

                <span class="related-activity-category">
                    ${escapeHTML(
        activity.category ||
        "Activity"
    )}
                </span>

                <h3>
                    ${escapeHTML(
        activity.title
    )}
                </h3>

                <p>
                    📅 ${formattedDate}
                </p>

                <a
                    href="./activity-details.html?id=${encodeURIComponent(activity.id)}"
                    class="related-activity-link"
                >
                    View Activity →
                </a>

            </div>

        </article>
    `;
}


/* =====================================
   Page Info
===================================== */

function updateActivityPageInfo(
    activity
) {

    document.title =
        `${activity.title} | CampusCare`;

    const breadcrumb =
        document.getElementById(
            "activityBreadcrumbTitle"
        );

    if (breadcrumb) {

        breadcrumb.textContent =
            activity.title;
    }
}


/* =====================================
   Image Helpers
===================================== */

function getActivityImage(image) {

    if (!image) {

        return "../../assets/images/activities/default-activity.jpg";
    }

    return (
        "../../assets/images/activities/" +
        image
    );
}


function getGalleryImage(image) {

    if (!image) {

        return "../../assets/images/activities/default-activity.jpg";
    }

    return (
        "../../assets/images/activities/" +
        image
    );
}


/* =====================================
   YouTube Helpers
===================================== */

function normalizeYouTubeEmbedUrl(url) {

    if (!url) {
        return null;
    }

    const value =
        String(url).trim();

    if (
        value.includes(
            "youtube.com/embed/"
        )
    ) {
        return value.split("?")[0];
    }

    try {

        const parsed =
            new URL(value);

        if (
            parsed.hostname.includes(
                "youtu.be"
            )
        ) {

            const id =
                parsed.pathname
                    .replace("/", "")
                    .trim();

            return id
                ? `https://www.youtube.com/embed/${id}`
                : null;
        }

        if (
            parsed.hostname.includes(
                "youtube.com"
            )
        ) {

            const id =
                parsed.searchParams.get(
                    "v"
                );

            if (id) {

                return `https://www.youtube.com/embed/${id}`;
            }
        }

    } catch {

        return null;
    }

    return null;
}


function getVideoThumbnail(
    url,
    customThumbnail
) {

    if (customThumbnail) {

        return (
            "../../assets/images/activities/" +
            customThumbnail
        );
    }

    const embedUrl =
        normalizeYouTubeEmbedUrl(
            url
        );

    if (!embedUrl) {
        return null;
    }

    const videoId =
        embedUrl.split(
            "/embed/"
        )[1];

    if (!videoId) {
        return null;
    }

    return (
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    );
}


/* =====================================
   Date
===================================== */

function formatActivityDate(value) {

    const date =
        getLocalActivityDate(value);

    if (!date) {

        return "Date not available";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}


function getLocalActivityDate(value) {

    if (!value) {
        return null;
    }

    const match =
        String(value).match(
            /^(\d{4})-(\d{2})-(\d{2})/
        );

    if (match) {

        const date =
            new Date(
                Number(match[1]),
                Number(match[2]) - 1,
                Number(match[3])
            );

        if (
            !Number.isNaN(
                date.getTime()
            )
        ) {
            return date;
        }
    }

    const fallback =
        new Date(value);

    if (
        Number.isNaN(
            fallback.getTime()
        )
    ) {
        return null;
    }

    return fallback;
}


/* =====================================
   HTML Escape
===================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =====================================
   Error State
===================================== */

function showActivityError(message) {

    const container =
        document.getElementById(
            "activityDetailsContainer"
        );

    if (!container) return;

    container.innerHTML = `
        <div class="activity-error-state glass">

            <h2>
                Activity Not Available
            </h2>

            <p>
                ${escapeHTML(message)}
            </p>

            <br>
            <a
                href="./frontend/pages/public/activity-details.html"
                class="activity-back-button"
            >
                ← Return to Activities
            </a>
        </div>
    `;
}


/* =====================================
   Global UI Events
===================================== */

document
    .getElementById(
        "lightboxCloseButton"
    )
    ?.addEventListener(
        "click",
        closeLightbox
    );

document
    .getElementById(
        "lightboxPreviousButton"
    )
    ?.addEventListener(
        "click",
        showPreviousImage
    );

document
    .getElementById(
        "lightboxNextButton"
    )
    ?.addEventListener(
        "click",
        showNextImage
    );

document
    .getElementById(
        "videoModalCloseButton"
    )
    ?.addEventListener(
        "click",
        closeVideoModal
    );


document.addEventListener(
    "keydown",
    event => {

        const lightbox =
            document.getElementById(
                "activityLightbox"
            );

        const videoModal =
            document.getElementById(
                "activityVideoModal"
            );

        if (event.key === "Escape") {

            if (
                lightbox?.classList.contains(
                    "active"
                )
            ) {
                closeLightbox();
            }

            if (
                videoModal?.classList.contains(
                    "active"
                )
            ) {
                closeVideoModal();
            }
        }

        if (
            lightbox?.classList.contains(
                "active"
            )
        ) {

            if (
                event.key === "ArrowLeft"
            ) {
                showPreviousImage();
            }

            if (
                event.key === "ArrowRight"
            ) {
                showNextImage();
            }
        }

    }
);


document
    .getElementById(
        "activityLightbox"
    )
    ?.addEventListener(
        "click",
        event => {

            if (
                event.target.id ===
                "activityLightbox"
            ) {
                closeLightbox();
            }
        }
    );


document
    .getElementById(
        "activityVideoModal"
    )
    ?.addEventListener(
        "click",
        event => {

            if (
                event.target.id ===
                "activityVideoModal"
            ) {
                closeVideoModal();
            }
        }
    );