const newsContainer = document.getElementById("newsContainer");

async function loadNews() {
    try {
        const response = await fetch("data/news.json");

        if (!response.ok) {
            throw new Error("Gagal mengambil news.json");
        }

        const data = await response.json();

        renderNews(data.articles || []);

    } catch (error) {
        console.error(error);

        newsContainer.innerHTML = `
            <p>
                Gagal memuat berita.
            </p>
        `;
    }
}


function renderNews(articles) {

    newsContainer.innerHTML = "";

    if (articles.length === 0) {
        newsContainer.innerHTML = `
            <p>Belum ada berita.</p>
        `;
        return;
    }


    articles.forEach(article => {

        const card = document.createElement("article");

        card.className = "news-card";

        card.innerHTML = `
            <div class="news-image">
                <span>${escapeHTML(article.category)}</span>
            </div>

            <div class="news-content">

                <span class="category">
                    ${escapeHTML(article.category)}
                </span>

                <h3>
                    ${escapeHTML(article.title)}
                </h3>

                <p>
                    ${escapeHTML(article.description)}
                </p>

                <small>
                    ${escapeHTML(article.source)}
                    ·
                    ${formatDate(article.published_at)}
                </small>

                <br><br>

                <a
                    href="${escapeAttribute(article.url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Baca sumber →
                </a>

            </div>
        `;

        newsContainer.appendChild(card);

    });
}


function formatDate(date) {

    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return date;
    }

    return parsed.toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}


function escapeHTML(value = "") {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function escapeAttribute(value = "") {

    return escapeHTML(value);
}


loadNews();
