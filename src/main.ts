import './styles/main.scss';
import { CODE_VIBES_CARDS, DA_PROJECTS_CARDS, FOOD_CARDS } from './cards-data';
import { MemoryCard } from './template';
import { changeScreen, toggleModal, renderGameBoard } from './ui-manager';

// Typen & Interfaces 
type GameTheme = 'code' | 'gaming' | 'projects' | 'foods';
type PlayerColor = 'blue' | 'orange';
type BoardSize = '16' | '24' | '36';

/** Represents the configuration settings selected by the user. */
interface GameSettings {
    theme: GameTheme;
    player: PlayerColor;
    size: BoardSize;
}

// --- Global State ---
let currentSettings: GameSettings;
let activePlayer: PlayerColor;
const scores = { blue: 0, orange: 0 };
let lockBoard: boolean = false;
let flippedCards: HTMLButtonElement[] = [];
let selectedSize: string = '16';

init();

/**
 * Initializes the entire application state and sets up form tracking.
 */
function init(): void {
    const settingsForm = document.getElementById('settings-form') as HTMLFormElement | null;
    updateLiveDisplays();
    settingsForm?.addEventListener('change', updateLiveDisplays);
    setupUIEventListeners();
}

/**
 * Binds click events to global navigation buttons, modal toggles, and screen changers.
 */
function setupUIEventListeners(): void {
    document.getElementById('btn-to-settings')?.addEventListener('click', () => changeScreen('homescreen', 'settings-screen'));
    document.getElementById('btn-exit-game')?.addEventListener('click', () => toggleModal('exit-modal', true));
    document.getElementById('btn-back-to-game')?.addEventListener('click', () => toggleModal('exit-modal', false));
    document.getElementById('btn-confirm-exit')?.addEventListener('click', () => {
        toggleModal('exit-modal', false);
        changeScreen('game-screen', 'settings-screen');
        const showCards = document.getElementById('game-bord');
        if (showCards) showCards.innerHTML = '';
    });
    document.getElementById('btn-back-to-settings')?.addEventListener('click', () => {
        changeScreen('game-over-screen', 'settings-screen');
        resetGameState();
    });
    document.getElementById('btnStartGame')?.addEventListener('click', () => handleGameStart());
}

/**
 * Handles the game-start process by reading form data, preparing the deck, and rendering the board.
 */
function handleGameStart(): void {
    const settingsForm = document.getElementById('settings-form') as HTMLFormElement | null;
    if (!settingsForm) return;

    const data = new FormData(settingsForm);
    setupGameFromSettings(data);

    const selectedTheme = data.get('theme-choice') as string;
    const config = prepareCards(selectedTheme);

    changeScreen('settings-screen', 'game-screen');
    renderGameBoard(config.cards, config.backface, handleCardClick);
}

/**
 * Selects the correct card dataset and backface image based on the selected theme,
 * then cuts the array to fit the chosen board size and shuffles it.
 * 
 * @param theme - The text identifier of the chosen theme from the form.
 * @returns An object containing the sliced/shuffled array of cards and the backface asset path.
 */
function prepareCards(theme: string): { cards: MemoryCard[]; backface: string } {
    let backface = 'src/assets/game-page/card-backface1.png';
    let cards: MemoryCard[] = [];

    if (theme === 'Code vibes theme') cards = [...CODE_VIBES_CARDS];
    else if (theme === 'DA Projects theme') {
        backface = 'src/assets/game-page/card-backface2.png';
        cards = [...DA_PROJECTS_CARDS];
    } else if (theme === 'Foods theme') {
        backface = 'src/assets/game-page/card-backface3.png';
        cards = [...FOOD_CARDS];
    }

    const limit = parseInt(selectedSize);
    cards = cards.slice(0, limit);
    shuffleArray(cards);

    return { cards, backface };
}

/** Shuffles a provided array of cards (Fisher-Yates). */
function shuffleArray(array: MemoryCard[]): void {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/** Verarbeitet den Klick auf eine Memory-Karte. */
function handleCardClick(e: MouseEvent): void {
    updateHUD();
    const card = (e.target as HTMLElement).closest('.card') as HTMLButtonElement;

    if (!card || lockBoard || card.classList.contains('is-flipped') || flippedCards.includes(card)) {
        return;
    }

    flipCard(card);
    if (flippedCards.length === 2) {
        checkCardsMatch();
    }
}

/** Visually flips a card over. */
function flipCard(card: HTMLButtonElement): void {
    card.classList.add('is-flipped');
    flippedCards.push(card);
}

/** Check whether two face-up cards are identical. */
function checkCardsMatch(): void {
    lockBoard = true;
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];
    const isMatch = card1.dataset.image === card2.dataset.image;

    if (isMatch) {
        scores[activePlayer] += 1;
        flippedCards = [];
        lockBoard = false;
        updateHUD();
        checkGameOver();
    } else {
        setTimeout(() => {
            card1.classList.remove('is-flipped');
            card2.classList.remove('is-flipped');
            flippedCards = [];
            activePlayer = activePlayer === 'blue' ? 'orange' : 'blue';
            lockBoard = false;
            updateHUD();
        }, 2000);
    }
}

/** Updates the live preview data in the settings. */
function updateLiveDisplays(): void {
    const settingsForm = document.getElementById('settings-form') as HTMLFormElement | null;
    if (!settingsForm) return;
    const data = new FormData(settingsForm);
    const selectedTheme = data.get('theme-choice') as string;
    const liveThemeDisplay = document.getElementById('theme-display');
    const previewContainer = document.getElementById('theme-preview-container');

    if (liveThemeDisplay && selectedTheme) {
        liveThemeDisplay.textContent = selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1);
    }

    if (previewContainer && selectedTheme) {
        if (selectedTheme === 'Code vibes theme') {
            previewContainer.innerHTML = `<img src="src/assets/setting-page/1.themes/Theme Visual.png" alt="Code Theme" class="theme-preview-img">`;
        } else if (selectedTheme === 'Gaming theme') {
            previewContainer.innerHTML = `<img src="src/assets/setting-page/1.themes/Property 1=gameing.png" alt="Gaming Theme" class="theme-preview-img">`;
        } else if (selectedTheme === 'DA Projects theme') {
            previewContainer.innerHTML = `<img src="src/assets/setting-page/1.themes/Property 1=DA projects.png" alt="Projects Theme" class="theme-preview-img">`;
        } else if (selectedTheme === 'Foods theme') {
            previewContainer.innerHTML = `<img src="src/assets/setting-page/1.themes/Property 1=foods.png" alt="Foods Theme" class="theme-preview-img">`;
        }
    }

    const selectedPlayer = data.get('player-choice') as string;
    const livePlayerDisplay = document.getElementById('player-color');
    if (livePlayerDisplay && selectedPlayer) {
        livePlayerDisplay.textContent = selectedPlayer.charAt(0).toUpperCase() + selectedPlayer.slice(1);
    }

    selectedSize = data.get('size-choice') as string;
    const liveSizeDisplay = document.getElementById('size-display');
    if (liveSizeDisplay && selectedSize) {
        liveSizeDisplay.textContent = `${selectedSize} Cards`;
    }
}

/** Updates the score display and the current player on the HUD. */
function updateHUD(): void {
    const scoreBlueDisplay = document.getElementById('score-blue-val');
    const scoreOrangeDisplay = document.getElementById('score-orange-val');
    const playerDisplay = document.getElementById('current-player-display');

    if (scoreBlueDisplay) scoreBlueDisplay.textContent = scores.blue.toString();
    if (scoreOrangeDisplay) scoreOrangeDisplay.textContent = scores.orange.toString();
    if (playerDisplay && activePlayer) {
        playerDisplay.textContent = activePlayer.charAt(0).toUpperCase() + activePlayer.slice(1);
    }
}

/** Reads the initial configurations. */
function setupGameFromSettings(data: FormData): void {
    currentSettings = {
        theme: data.get('theme-choice') as GameTheme,
        player: (data.get('player-choice') as string).toLowerCase() as PlayerColor,
        size: data.get('size-choice') as BoardSize
    };

    activePlayer = currentSettings.player;
    resetGameState();
}

/** Resets the game state completely. */
function resetGameState(): void {
    scores.blue = 0;
    scores.orange = 0;
    flippedCards = [];
    lockBoard = false;
    const showCards = document.getElementById('game-bord');
    if (showCards) showCards.innerHTML = '';
    updateHUD();
}

/** Check whether all pairs have been found and end the game. */
function checkGameOver(): void {
    const totalPaare = parseInt(selectedSize) / 2;
    const foundPaare = scores.blue + scores.orange;

    if (foundPaare === totalPaare) {
        const gameOverScreen = document.getElementById('game-over-screen');
        const winnerText = document.getElementById('game-over-text');
        if (gameOverScreen && winnerText) {
            gameOverScreen.classList.remove('blue', 'orange');
            if (scores.blue > scores.orange) {
                winnerText.textContent = 'Blau gewinnt das Spiel!';
                gameOverScreen.classList.add('blue');
            } else if (scores.orange > scores.blue) {
                winnerText.textContent = 'Orange gewinnt das Spiel!';
                gameOverScreen.classList.add('orange');
            } else {
                winnerText.textContent = 'Unentschieden!';
            }
        }
        changeScreen('game-screen', 'game-over-screen');
    }
}
