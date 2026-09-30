// ================================
// MOBILE MENU
// ================================

const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");

if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
        mainNav.classList.toggle("show");
    });
}


// ================================
// CLOSE MOBILE MENU
// WHEN CLICKING A LINK
// ================================

const navLinks = document.querySelectorAll(".main-nav a");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        mainNav.classList.remove("show");
    });
});


// ================================
// SEARCH
// ================================

const searchBox = document.querySelector(".search-box");

if (searchBox) {
    searchBox.addEventListener("submit", function(event) {

        const input = this.querySelector("input");

        if (!input.value.trim()) {
            event.preventDefault();
            input.focus();
            return;
        }

        console.log("Mencari berita:", input.value);
    });
}


// ================================
// WEBSITE READY
// ================================

console.log("Next Game News berhasil dimuat.");
