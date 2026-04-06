document.addEventListener('DOMContentLoaded', () => {
    // Check which page we are on and run the appropriate logic
    if (document.getElementById('deck-list')) {
        loadDeckList();
    } else if (document.getElementById('flashcard')) {
        loadQuiz();
    }
});

// --- Logic for index.html (Deck Listing Page) ---

function loadDeckList() {
    fetch('data/decks.json')
        .then(response => response.json())
        .then(data => {
            const deckList = document.getElementById('deck-list');
            deckList.innerHTML = ''; // Clear existing content
            data.decks.forEach(deck => {
                const deckLink = document.createElement('a');
                deckLink.href = `quiz.html?deck=${deck.file}`;
                deckLink.textContent = deck.title;
                deckList.appendChild(deckLink);
            });
        });
}

// --- Logic for quiz.html (The Quiz UI) ---

let currentDeck = [];
let currentIndex = 0;

function loadQuiz() {
    const urlParams = new URLSearchParams(window.location.search);
    const deckFile = urlParams.get('deck');

    if (!deckFile) {
        window.location.href = 'index.html'; // Go back if no deck is selected
        return;
    }

    fetch(`data/${deckFile}`)
        .then(response => response.json())
        .then(data => {
            currentDeck = data.flashcards;
            document.getElementById('deck-title').textContent = data.title;
            displayCard();
            setupEventListeners();
        });
}

function displayCard() {
    if (currentDeck.length === 0) return;

    const flashcard = document.getElementById('flashcard');
    flashcard.classList.remove('is-flipped'); // Always show the front first

    const front = document.getElementById('card-front');
    const back = document.getElementById('card-back');
    const counter = document.getElementById('card-counter');

    front.innerHTML = currentDeck[currentIndex].front;
    back.innerHTML = currentDeck[currentIndex].back;
    counter.textContent = `${currentIndex + 1} / ${currentDeck.length}`;
    
    updateNavButtons();
}

function updateNavButtons() {
    document.getElementById('prev-btn').disabled = (currentIndex === 0);
    document.getElementById('next-btn').disabled = (currentIndex === currentDeck.length - 1);
}

function setupEventListeners() {
    const flashcard = document.getElementById('flashcard');
    flashcard.addEventListener('click', () => {
        flashcard.classList.toggle('is-flipped');
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentIndex < currentDeck.length - 1) {
            currentIndex++;
            displayCard();
        }
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            displayCard();
        }
    });
}
