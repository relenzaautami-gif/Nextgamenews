let newsData = [];

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchTitle = document.getElementById("searchTitle");


// ================================
// LOAD NEWS DATABASE
// ================================

async function loadNews() {

    try {

        const response = await fetch("data/news.json");

        if (!response.ok) {
            throw new Error("Gagal mengambil data berita");
        }

        const data = await response.json();

        newsData = data.articles || [];

        displayNews(newsData);

    } catch (error) {

        console.error(error);

        searchResults.innerHTML = `
            <p>
                Gagal memuat berita.
            </p>
        `;
    }
}


// ================================
// DISPLAY NEWS
// ================================

function displayNews(news) {

    searchResults.innerHTML = "";

    if (news.length === 0) {

        searchResults.innerHTML = `
            <p>
                Berita tidak ditemukan.
            </p>
        `;

        return;
    }


    news.forEach(article => {

        const card = document.createElement("article");

        card.className = "news-card";


        card.innerHTML = `

            <div class="news-image">

                <span>
                    ${article.category}
                </span>

            </div>


            <div class="news-content">

                <span class="category">
                    ${article.category}
                </span>


                <h3>
                    ${article.title}
                </h3>


                <p>
                    ${article.description}
                </p>


                <small>
                    ${article.source}
                    ·
                    ${formatDate(article.published_at)}
                </small>

            </div>

        `;


        searchResults.appendChild(card);

    });

}


// ================================
// FORMAT DATE
// ================================

function formatDate(date) {

    const d = new Date(date);

    return d.toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short"
    });

}


// ================================
// SEARCH
// ================================

searchForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const keyword =
        searchInput.value
        .trim()
        .toLowerCase();


    if (!keyword) {

        searchTitle.textContent =
            "Berita Terbaru";

        displayNews(newsData);

        return;
    }


    const results = newsData.filter(article => {

        const text = (

            article.title +
            " " +
            article.category +
            " " +
            article.description +
            " " +
            article.source

        ).toLowerCase();


        return text.includes(keyword);

    });


    searchTitle.textContent =
        `Hasil pencarian: ${searchInput.value}`;


    displayNews(results);

});


// ================================
// START
// ================================

loadNews();
