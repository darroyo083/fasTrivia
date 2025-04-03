// traducir usando flossboxin
async function translateText(text) {
    const url = "https://translate.flossboxin.org.in/translate";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                q: text,
                source: "en",
                target: "es",
                format: "text"
            })
        });

        const data = await response.json();
        return data.translatedText || text;
    } catch (error) {
        console.error("Error al traducir:", error);
        return text;
    }
}

document.getElementById("translateBtn").addEventListener("click", async () => {
    const h2Elements = document.querySelectorAll("h2");
    const buttonElements = document.querySelectorAll(".opts button");
    
    const questionContainer = document.getElementById("question-container");
    const loadingTranslation = document.createElement("p");
    loadingTranslation.innerText = "Traduciendo...";
    loadingTranslation.id = "loading-translation";
    questionContainer.appendChild(loadingTranslation);
    
    for (let h2 of h2Elements) {
        h2.innerText = await translateText(h2.dataset.original);
    }
    
    for (let button of buttonElements) {
        button.innerText = await translateText(button.dataset.original);
    }
    
    document.getElementById("loading-translation").remove();
});

export {translateText}