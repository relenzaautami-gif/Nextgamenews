const fs = require("fs");
const https = require("https");

const NEWS_FILE = "data/news.json";

// RSS yang akan dipantau.
// Nanti kita bisa menambahkan sumber lain.
const RSS_FEEDS = [
    {
        name: "Google News Gaming",
        url: "https://news.google.com/rss/search?q=gaming&hl=en-US&gl=US&ceid=US:en",
        category: "Gaming"
    },
    {
        name: "Google News Esports",
        url: "https://news.google.com/rss/search?q=esports&hl=en-US&gl=US&ceid=US:en",
        category: "Esports"
    }
];


// ================================
// DOWNLOAD RSS
// ================================

function download(url) {

    return new Promise((resolve, reject) => {

        https.get(url, {
            headers: {
                "User-Agent": "NextGameNews/1.0"
            }
        }, response => {

            let data = "";

            response.on("data", chunk => {
                data += chunk;
            });

            response.on("end", () => {
                resolve(data);
            });

        }).on("error", reject);

    });

}


// ================================
// ESCAPE HTML
// ================================

function stripHtml(text = "") {

    return text
        .replace(/<[^>]*>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim();

}


// ================================
// EXTRACT XML TAG
// ================================

function getTag(xml, tag) {

    const regex =
        new RegExp(
            `<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`,
            "i"
        );

    const match = xml.match(regex);

    return match ? stripHtml(match[1]) : "";

}


// ================================
// PARSE RSS
// ================================

function parseRSS(xml, feed) {

    const items =
        xml.match(/<item[\s\S]*?<\/item>/gi) || [];


    return items.map(item => {

        const title =
            getTag(item, "title");

        const link =
            getTag(item, "link");

        const description =
            getTag(item, "description");

        const pubDate =
            getTag(item, "pubDate");


        return {

            id: Buffer
                .from(link || title)
                .toString("base64")
                .slice(0, 20),

            title,

            category: feed.category,

            description,

            source: feed.name,

            url: link,

            published_at:
                pubDate ||
                new Date().toISOString()

        };

    });

}


// ================================
// MAIN
// ================================

async function main() {

    console.log("Starting news collector...");


    let existing = {
        articles: []
    };


    if (fs.existsSync(NEWS_FILE)) {

        existing =
            JSON.parse(
                fs.readFileSync(
                    NEWS_FILE,
                    "utf8"
                )
            );

    }


    const oldArticles =
        existing.articles || [];


    const existingUrls =
        new Set(
            oldArticles.map(
                article => article.url
            )
        );


    let newArticles = [];


    for (const feed of RSS_FEEDS) {

        try {

            console.log(
                `Reading: ${feed.name}`
            );


            const xml =
                await download(feed.url);


            const articles =
                parseRSS(xml, feed);


            for (const article of articles) {

                if (!article.url) {
                    continue;
                }


                if (existingUrls.has(article.url)) {
                    continue;
                }


                existingUrls.add(article.url);

                newArticles.push(article);

            }


        } catch (error) {

            console.error(
                `Failed: ${feed.name}`,
                error.message
            );

        }

    }


    const allArticles = [
        ...newArticles,
        ...oldArticles
    ];


    // Batasi database sementara
    // menjadi 200 berita terbaru.

    const limited =
        allArticles.slice(0, 200);


    fs.writeFileSync(

        NEWS_FILE,

        JSON.stringify(
            {
                articles: limited
            },
            null,
            2
        )

    );


    console.log(
        `Added ${newArticles.length} new articles.`
    );

    console.log(
        `Total articles: ${limited.length}`
    );

}


main();
