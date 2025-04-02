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

let triviaQuestions = [];
let currentQuestionIndex = 0;
let selectedAnswer = false;

async function initializeTrivia() {
    const numberOfQuestions = 10;
    const URL = `https://opentdb.com/api.php?amount=${numberOfQuestions}&type=multiple&category=18`;
    const main = document.querySelector("main");
    
    const translateBtn = document.getElementById("translateBtn");
    main.innerHTML = '';
    main.appendChild(translateBtn);
    
    const questionContainer = document.createElement("div");
    questionContainer.id = "question-container";
    main.appendChild(questionContainer);
    
    const navigationContainer = document.createElement("div");
    navigationContainer.id = "navigation-container";
    main.appendChild(navigationContainer);
    
    try {
        questionContainer.innerHTML = "<p>Loading...</p>";
        
        const res = await fetch(URL);
        const data = await res.json();
        
        triviaQuestions = data.results;
        
        if (triviaQuestions.length > 0) {
            displayQuestion(0);
        } else {
            questionContainer.innerHTML = "<p>Try again later</p>";
        }
    } catch (error) {
        console.error("No se ha podido obtener los datos", error);
        questionContainer.innerHTML = "<p>Try again later.</p>";
    }
}

function displayQuestion(index) {
    if (index < 0 || index >= triviaQuestions.length) {
        return;
    }
    
    currentQuestionIndex = index;
    selectedAnswer = false;
    
    const questionData = triviaQuestions[index];
    const questionText = questionData.question;
    const correctAnswer = questionData.correct_answer;
    const incorrectAnswers = questionData.incorrect_answers;
    
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = '';
    
    const counter = document.createElement("p");
    counter.className = "question-counter";
    counter.innerText = `${index + 1}/${triviaQuestions.length}`;
    
    // pregunta
    const h2 = document.createElement("h2");
    h2.innerText = questionText;
    h2.dataset.original = questionText;
    
    // opciones
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "opts";
    
    const answers = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);
    
    const colors = ['option1', 'option2', 'option3', 'option4'];
    
    answers.forEach((answer, idx) => {
        const button = document.createElement("button");
        button.innerText = answer;
        button.dataset.correct = answer === correctAnswer;
        button.dataset.original = answer;
        
        button.classList.add(colors[idx]);
        
        button.addEventListener("click", () => {
            selectedAnswer = true;
            
            const buttons = optionsContainer.querySelectorAll("button");
            buttons.forEach(btn => btn.disabled = true);
            
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            } else {
                button.classList.add("incorrect");
                
                buttons.forEach(btn => {
                    if (btn.dataset.correct === "true") {
                        btn.classList.add("correct");
                    }
                });
            }
            updateNavigationButtons();
        });
        optionsContainer.appendChild(button);
    });
    
    questionContainer.append(counter, h2, optionsContainer);
    
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const navigationContainer = document.getElementById("navigation-container");
    navigationContainer.innerHTML = '';
    
    if (currentQuestionIndex < triviaQuestions.length - 1) {
        const nextButton = document.createElement("button");
        nextButton.innerText = "Next";
        nextButton.id = "next-button";
        
        nextButton.disabled = !selectedAnswer;
        
        nextButton.addEventListener("click", () => {
            displayQuestion(currentQuestionIndex + 1);
        });
        
        navigationContainer.appendChild(nextButton);
    } else if (selectedAnswer) {
        const restartButton = document.createElement("button");
        restartButton.innerText = "Jugar de nuevo";
        restartButton.id = "restart-button";
        
        restartButton.addEventListener("click", () => {
            initializeTrivia();
        });
        
        navigationContainer.appendChild(restartButton);
    }
}

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
    console.log("Traducción completada");
});

function localStorage(){
    
}