# Trivia Game

## Description  
A web-based trivia game built with **JavaScript**, **HTML**, and **CSS** that uses two APIs:  
1. **Open Trivia Database API** ([opentdb.com](https://opentdb.com/api_config.php)) - for fetching trivia questions  
2. **LibreTranslate API** ([translate.flossboxin.org.in](https://translate.flossboxin.org.in)) - for translating questions  

The game presents multiple-choice questions, tracks scores, and allows question translation.

## Features  
- Fetches random trivia questions in English  
- Option to translate questions to Spanish  
- Tracks correct/incorrect answers  
- Shows question progress (e.g., "2/5")  
- Stores up to 3 previous scores using localStorage  
- Simple, responsive interface  

## How to Run Locally  
1. Clone or download the repository  
2. Open `index.html` in a web browser  
3. The game will automatically load 5 random questions  

## Dependencies  
- No API keys required  
- Requires internet connection for API calls  
- Uses vanilla JavaScript (no frameworks/libraries)  

## Notes  
- Translation feature depends on LibreTranslate API availability  
- Questions are cached for smoother gameplay  
- Default language is English (translation is optional)