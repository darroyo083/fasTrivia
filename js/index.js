import { decodeHTML } from "./decodeHTML.js";
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


let triviaQuestions = [];
let currentQuestionIndex = 0;
let selectedAnswer = false;
let correctAnswers = 0;

async function initializeTrivia() {
    const numberOfQuestions = 5;
    const URL = `https://opentdb.com/api.php?amount=${numberOfQuestions}&type=multiple`; // &category=18
    const main = document.querySelector("main");
    
    const translateBtn = document.getElementById("translateBtn");
    main.innerHTML = '';
    main.appendChild(translateBtn);
    
    showLastScore(main);
    
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
            correctAnswers = 0;
            displayQuestion(0);
        } else {
            questionContainer.innerHTML = "<p>Try again later</p>";
        }
    } catch (error) {
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
    const questionText = decodeHTML(questionData.question);
    const correctAnswer = decodeHTML(questionData.correct_answer);
    const incorrectAnswers = questionData.incorrect_answers.map(answer => decodeHTML(answer));
    
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
    
    // desordenar
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
                correctAnswers++;
            } else {
                button.classList.add("incorrect");
                
                buttons.forEach(btn => {
                    if (btn.dataset.correct === "true") {
                        btn.classList.add("correct");
                    }
                });
            }
            
            if (currentQuestionIndex === triviaQuestions.length - 1) {
                saveScore();
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
        restartButton.innerText = "Play again";
        restartButton.id = "restart-button";
        
        restartButton.addEventListener("click", () => {
            initializeTrivia();
        });
        
        // boton borrar puntuacion
        const clearButton = document.createElement("button");
        clearButton.innerText = "Delete scores";
        clearButton.id = "clear-button";
        
        clearButton.addEventListener("click", () => {
            localStorage.removeItem("triviaData");
            initializeTrivia();
        });
        
        navigationContainer.appendChild(restartButton);
        navigationContainer.appendChild(clearButton);
    }
}


// localstorage
function saveScore() {
    const scoreData = {
        correct: correctAnswers,
        total: triviaQuestions.length,
        percentage: Math.round((correctAnswers / triviaQuestions.length) * 100)
    };
    
    let allScores = [];
    const savedData = localStorage.getItem("triviaData");
    
    if (savedData) {
        allScores = JSON.parse(savedData);
    }
    
    allScores.push(scoreData);
    
    if (allScores.length > 3) {
        allScores = allScores.slice(-3);
    }
    
    localStorage.setItem("triviaData", JSON.stringify(allScores));
    
}

function showLastScore(container) {
    const savedData = localStorage.getItem("triviaData");
    
    if (savedData) {
        const allScores = JSON.parse(savedData);
        
        if (allScores.length > 0) {
            const scoreElement = document.createElement("div");
            scoreElement.className = "score-info";
            
            const lastScore = allScores[allScores.length - 1];
            scoreElement.innerHTML = `
                <p>Last score: ${lastScore.correct}/${lastScore.total} (${lastScore.percentage}%)</p>
            `;
            
            if (allScores.length > 1) {
                const historialElement = document.createElement("div");
                historialElement.className = "historial";
                historialElement.innerHTML = "<p>Score history:</p>";
                
                const lista = document.createElement("ul");
                
                for (let i = allScores.length - 1; i >= 0; i--) {
                    const score = allScores[i];
                    const item = document.createElement("li");
                    item.innerText = `${score.correct}/${score.total} (${score.percentage}%)`;
                    lista.appendChild(item);
                }
                
                historialElement.appendChild(lista);
                scoreElement.appendChild(historialElement);
            }
            
            container.appendChild(scoreElement);
        }
    }
}