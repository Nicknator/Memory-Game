import './styles/main.scss';
import { CODE_VIBES_CARDS, DA_PROJECTS_CARDS, FOOD_CARDS } from './cards-data';
import {
    MemoryCard,
    renderHomescreen,
    renderSettingsScreen,
    renderGameScreen,
    renderGameOverScreen
} from './template';
import { renderScreen, toggleModal, renderGameBoard } from './ui-manager';

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

const THEME_PREVIEWS: Record<string, string> = {
    'Code vibes theme': 'assets/setting-page/1.themes/Theme Visual.png',
    'Gaming theme': 'assets/setting-page/1.themes/Property 1=gameing.png',
    'DA Projects theme': 'assets/setting-page/1.themes/Property 1=DA projects.png',
    'Foods theme': 'assets/setting-page/1.themes/Property 1=foods.png',
};

init();

/**
 * Initializes the entire application by rendering the homescreen.
 */
function init(): void {
    showHomescreen();
}

/**
 * Renders the homescreen into #app and binds the start navigation button.
 */
function showHomescreen(): void {
    document.body.classList.remove('theme-code', 'theme-projects', 'theme-foods', 'theme-gaming');
    renderScreen(renderHomescreen(), () => {
        document.getElementById('btn-to-settings')?.addEventListener('click', () => {
            showSettingsScreen();
        });
    });
}

/**
 * Renders the settings screen into #app without preselection and binds form tracking.
 */
function showSettingsScreen(): void {
    document.body.classList.remove('theme-code', 'theme-projects', 'theme-foods', 'theme-gaming');
    renderScreen(renderSettingsScreen(), () => {
        const settingsForm = document.getElementById('settings-form') as HTMLFormElement | null;
        updateLiveDisplays(); updateStartButtonState();
        settingsForm?.addEventListener('change', () => {
            updateLiveDisplays(); updateStartButtonState();
        });
        themeSwitcher();
        document.getElementById('btnStartGame')?.addEventListener('click', () => handleGameStart());
    });
}

/**
 * Enables or disables the start button depending on whether all settings are selected.
 */
function updateStartButtonState(): void {
    const form = document.getElementById('settings-form') as HTMLFormElement | null;
    const startBtn = document.getElementById('btnStartGame') as HTMLButtonElement | null;
    if (!form || !startBtn) return;
    const data = new FormData(form);
    const isComplete = Boolean(data.get('theme-choice') && data.get('player-choice') && data.get('size-choice'));
    startBtn.disabled = !isComplete;
}

/**
 * Handles the game-start process by reading form data, preparing the deck, and rendering the board.
 */
function handleGameStart(): void {
    const settingsForm = document.getElementById('settings-form') as HTMLFormElement | null;
    if (!settingsForm) return;
    const data = new FormData(settingsForm);
    const selectedTheme = data.get('theme-choice') as string | null;
    const selectedPlayer = data.get('player-choice') as string | null;
    const chosenSize = data.get('size-choice') as string | null;
    if (!selectedTheme || !selectedPlayer || !chosenSize) return;
    setupGameFromSettings(data); const config = prepareCards(selectedTheme);
    renderScreen(renderGameScreen(), () => {
        updateHUD(); setupGameEventListeners();
        renderGameBoard(config.cards, config.backface, handleCardClick);
    });
}

/**
 * Binds click events for the in-game exit modal and confirmation buttons.
 */
function setupGameEventListeners(): void {
    document.getElementById('btn-exit-game')?.addEventListener('click', () => toggleModal('exit-modal', true));
    document.getElementById('btn-back-to-game')?.addEventListener('click', () => toggleModal('exit-modal', false));
    document.getElementById('btn-confirm-exit')?.addEventListener('click', () => {
        toggleModal('exit-modal', false);
        resetGameState();
        showSettingsScreen();
    });
}

/**
 * Selects the correct card dataset and backface image based on the selected theme,
 * then cuts the array to fit the chosen board size and shuffles it.
 */
function prepareCards(theme: string): { cards: MemoryCard[]; backface: string } {
    let backface = 'assets/game-page/card-backface1.png';
    let cards: MemoryCard[] = [];
    document.body.classList.remove('theme-code', 'theme-projects', 'theme-foods', 'theme-gaming');
    if (theme === 'Code vibes theme') { document.body.classList.add('theme-code'); cards = [...CODE_VIBES_CARDS]; }
    else if (theme === 'DA Projects theme') { document.body.classList.add('theme-projects'); backface = 'assets/game-page/card-backface2.png'; cards = [...DA_PROJECTS_CARDS]; }
    else if (theme === 'Foods theme') { document.body.classList.add('theme-foods'); backface = 'assets/game-page/card-backface3.png'; cards = [...FOOD_CARDS]; }
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
    if (flippedCards.length === 2) { checkCardsMatch(); }
}

/** Visually flips a card over. */
function flipCard(card: HTMLButtonElement): void {
    card.classList.add('is-flipped');
    flippedCards.push(card);
}

/** Check whether two face-up cards are identical. */
function checkCardsMatch(): void {
    lockBoard = true;
    const card1 = flippedCards[0]; const card2 = flippedCards[1];
    const isMatch = card1.dataset.image === card2.dataset.image;
    if (isMatch) { scores[activePlayer] += 1; flippedCards = []; lockBoard = false; updateHUD(); checkGameOver(); }
    else {
        setTimeout(() => {
            card1.classList.remove('is-flipped'); card2.classList.remove('is-flipped');
            flippedCards = [];
            activePlayer = activePlayer === 'blue' ? 'orange' : 'blue';
            lockBoard = false; updateHUD();
        }, 1200);
    }
}

/** Updates all live preview displays in the settings. */
function updateLiveDisplays(): void {
    const form = document.getElementById('settings-form') as HTMLFormElement | null;
    if (!form) return;
    const data = new FormData(form);
    updateThemePreview(data.get('theme-choice') as string | null);
    updatePlayerPreview(data.get('player-choice') as string | null);
    updateSizePreview(data.get('size-choice') as string | null);
}

/** Updates the theme text and preview image. */
function updateThemePreview(theme: string | null): void {
    const textEl = document.getElementById('theme-display');
    const imgBox = document.getElementById('theme-preview-container');
    if (textEl) {
        textEl.textContent = theme ? theme.charAt(0).toUpperCase() + theme.slice(1) : 'Choose theme';
    }
    if (imgBox) {
        if (theme && THEME_PREVIEWS[theme]) {
            imgBox.innerHTML = `<img src="${THEME_PREVIEWS[theme]}" alt="${theme}" class="theme-preview-img">`;
        } else {
            imgBox.innerHTML = '';
        }
    }
}

/** Updates the selected starting player text. */
function updatePlayerPreview(player: string | null): void {
    const playerEl = document.getElementById('player-color');
    if (playerEl) {
        playerEl.textContent = player ? player.charAt(0).toUpperCase() + player.slice(1) : 'Choose';
    }
}

/** Updates the selected board size text. */
function updateSizePreview(size: string | null): void {
    const sizeEl = document.getElementById('size-display');
    if (!size) {
        if (sizeEl) sizeEl.textContent = 'Size';
        return;
    }
    selectedSize = size;
    if (sizeEl) {
        sizeEl.textContent = `${selectedSize} Cards`;
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
        playerDisplay.className = activePlayer;
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

/** Check whether all pairs have been found and trigger the game-over flow. */
function checkGameOver(): void {
    const totalPairs = parseInt(selectedSize) / 2;
    if (scores.blue + scores.orange !== totalPairs) return;
    const finalScores = { blue: scores.blue, orange: scores.orange };
    renderScreen(renderGameOverScreen(), () => initGameOverView(finalScores));
}

/** Sets up scores, button listeners, and the transition to the winner screen. */
function initGameOverView(finalScores: { blue: number; orange: number }): void {
    setFinalScores(finalScores);
    document.getElementById('btn-back-to-start')?.addEventListener('click', () => {
        resetGameState();
        showSettingsScreen();
    });
    setTimeout(() => switchToWinnerScreen(), 2000);
}

/** Writes the final scores into the summary screen. */
function setFinalScores(finalScores: { blue: number; orange: number }): void {
    const finalBlue = document.getElementById('final-score-blue');
    const finalOrange = document.getElementById('final-score-orange');
    if (finalBlue) finalBlue.textContent = finalScores.blue.toString();
    if (finalOrange) finalOrange.textContent = finalScores.orange.toString();
}

/** Transitions from the summary step to the winner announcement. */
function switchToWinnerScreen(): void {
    document.getElementById('game-over-summary')?.classList.add('hidden');
    document.getElementById('winner-screen')?.classList.remove('hidden');
    showWinnerResult();
}


/** Determines the match outcome and triggers the winner display. */
function showWinnerResult(): void {
    const isProjects = document.body.classList.contains('theme-projects');
    if (scores.blue > scores.orange) {
        const img = isProjects ? 'assets/game-over-page/Player-blue1.png' : 'assets/game-over-page/chess_pawn_blue-1.png';
        applyWinnerView('The winner is', 'BLUE PLAYER', 'blue', img, true);
    } else if (scores.orange > scores.blue) {
        const img = isProjects ? 'assets/game-over-page/Player-orange2.png' : 'assets/game-over-page/chess_pawn_orange-2.png';
        applyWinnerView('The winner is', 'ORANGE PLAYER', 'orange', img, true);
    } else {
        applyWinnerView("It's a", 'DRAW', 'draw', 'assets/game-over-page/Scale_Icon-3.png', false);
    }
}

/** Updates the winner screen elements with the result details. */
function applyWinnerView(sub: string, head: string, colorClass: string, imgSrc: string, showConfetti: boolean): void {
    const subtitle = document.getElementById('winner-subtitle');
    const title = document.getElementById('winner-title');
    const icon = document.getElementById('winner-icon') as HTMLImageElement;
    document.getElementById('confetti-img')?.classList.toggle('hidden', !showConfetti);
    if (subtitle) subtitle.textContent = sub;
    if (title) {
        title.textContent = head;
        title.className = `winner-title ${colorClass}`;
    }
    if (icon) icon.src = imgSrc;
}

/** Enables live theme preview updates when hovering over option labels. */
function themeSwitcher(): void {
    const themeLabels = document.querySelectorAll('.radio-options label');
    themeLabels.forEach(label => {
        label.addEventListener('mouseenter', () => {
            const input = label.querySelector('input') as HTMLInputElement;
            if (input) {
                input.checked = true;
                updateLiveDisplays(); updateStartButtonState();
            }
        });
    });
}
