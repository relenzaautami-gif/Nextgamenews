const newsData = [

    {
        title: "Berita terbaru GTA 6 mulai ramai dibicarakan",
        category: "PC & Console",
        description: "Informasi terbaru seputar perkembangan game GTA 6.",
        time: "10 menit lalu"
    },

    {
        title: "Update terbaru PUBG Mobile diumumkan",
        category: "PUBG Mobile",
        description: "Update terbaru membawa sejumlah perubahan dan fitur baru.",
        time: "25 menit lalu"
    },

    {
        title: "Mobile Legends menghadirkan update terbaru",
        category: "Mobile Legends",
        description: "Update terbaru Mobile Legends menjadi perhatian pemain.",
        time: "40 menit lalu"
    },

    {
        title: "Game baru menarik perhatian pemain PC",
        category: "PC Gaming",
        description: "Sebuah game baru mulai ramai dimainkan komunitas PC.",
        time: "1 jam lalu"
    }

];


const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchTitle = document.getElementById("searchTitle");


function displayNews(news) {

    searchResults.innerHTML = "";

    if (news.length === 0) {

        searchResults.innerHTML = `
            <div>
                <h3>Berita tidak ditemukan</h3>
                <p>
                    Coba gunakan kata kunci lain.
                </p>
            </div>
        `;

        return;
    }


    news.forEach(article => {

        const card = document.createElement("article");

        card.className = "news-card";

        card.innerHTML = `

            <div class="news-image">
                <span>${article.category}</span>
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
                    ${article.time}
                </small>

            </div>

        `;

        searchResults.appendChild(card);

    });

}


searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const keyword =
        searchInput.value.trim().toLowerCase();


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
            article.description

        ).toLowerCase();


        return text.includes(keyword);

    });


    searchTitle.textContent =
        `Hasil pencarian: ${searchInput.value}`;

    displayNews(results);

});


displayNews(newsData);
