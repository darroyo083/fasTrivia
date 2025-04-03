import { initializeTrivia } from "./trivia.js";
import { translateText } from "./translate.js"; 

document.addEventListener("DOMContentLoaded", () => {
    footer();
    
    initializeTrivia();
});

function footer() {
    const footer = document.querySelector("footer");
    const divFooter = document.createElement("div");
    divFooter.className = "footer";
    divFooter.innerText = "2025";
    footer.appendChild(divFooter);
}