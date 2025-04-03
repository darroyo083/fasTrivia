// Obtener las puntuaciones del localStorage
function getScores() {
    const savedData = localStorage.getItem("triviaData");
    return savedData ? JSON.parse(savedData) : [];
}

// Guardar puntuación en localStorage
function saveScore(scoreData) {
    let allScores = getScores();
    
    allScores.push(scoreData);
    
    if (allScores.length > 3) {
        allScores = allScores.slice(-3);
    }
    
    localStorage.setItem("triviaData", JSON.stringify(allScores));
}

// Borrar puntuaciones
function clearScores() {
    localStorage.removeItem("triviaData");
    return [];
}

export { getScores, saveScore, clearScores };