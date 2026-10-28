import './styles/main.scss';
import { CODE_VIBES_CARDS, DA_PROJECTS_CARDS, FOOD_CARDS } from './cards-data';

type GameTheme = 'code' | 'gaming' | 'projects' | 'foods';
type PlayerColor = 'blue' | 'orange';
type BoardSize = '16' | '24' | '36';

interface GameSettings {
    theme: GameTheme;
    player: PlayerColor;
    size: BoardSize;
}

interface Memory {
    id: number;
    memory_image: string;
}

let currentSettings: GameSettings;
let activePlayer: PlayerColor;

const scores = {
    blue: 0,
    orange: 0
};

let lockBoard = false;
let flippedCards: HTMLButtonElement[] = [];

let selectedSize: string = "16";

init();

function init() {

    const playBtnToSettings = document.getElementById('btn-to-settings');
    const homeScreen = document.getElementById('homescreen');
    const settingsScreen = document.getElementById('settings-screen');

    playBtnToSettings?.addEventListener('click', () => {
        homeScreen?.classList.replace('screen-visible', 'screen-hidden');
        settingsScreen?.classList.replace('screen-hidden', 'screen-visible');
    });

    const btnStartGame = document.getElementById('btnStartGame');
    const gameScreen = document.getElementById('game-screen');
    const settingsForm = document.getElementById('settings-form') as HTMLFormElement | null;
    const livePlayerDisplay = document.getElementById('player-color');
    const liveThemeDisplay = document.getElementById('theme-display');
    const liveSizeDisplay = document.getElementById('size-display');
    const previewContainer = document.getElementById('theme-preview-container');
    const btnExitGame = document.getElementById('btn-exit-game');


    function updateLiveDisplays() {
        if (!settingsForm) return;
        const data = new FormData(settingsForm);
        const selectedTheme = data.get('theme-choice') as string;

        // let memorycards: Memory[] = [];

        if (liveThemeDisplay && selectedTheme) {
            liveThemeDisplay.textContent = selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1);
        }

        if (previewContainer && selectedTheme) {

            if (selectedTheme === "Code vibes theme") {
                previewContainer.innerHTML = `<img src="src/assets/setting-page/1.themes/Theme Visual.png" alt="Code Theme" class="theme-preview-img">`;
            }
            else if (selectedTheme === "Gaming theme") {
                previewContainer.innerHTML = `<img src="src/assets/setting-page/1.themes/Property 1=gameing.png" alt="Gaming Theme" class="theme-preview-img">`;
            }
            else if (selectedTheme === "DA Projects theme") {
                previewContainer.innerHTML = `<img src="src/assets/setting-page/1.themes/Property 1=DA projects.png" alt="Projects Theme" class="theme-preview-img">`;
            }
            else if (selectedTheme === "Foods theme") {
                previewContainer.innerHTML = `<img src="src/assets/setting-page/1.themes/Property 1=foods.png" alt="Foods Theme" class="theme-preview-img">`;
            }
        }

        const selectedPlayer = data.get('player-choice') as string;
        if (livePlayerDisplay && selectedPlayer) {
            livePlayerDisplay.textContent = selectedPlayer.charAt(0).toUpperCase() + selectedPlayer.slice(1);
        }

        selectedSize = data.get('size-choice') as string;
        if (liveSizeDisplay && selectedSize) {
            liveSizeDisplay.textContent = `${selectedSize} Cards`;
        }

    }

    updateLiveDisplays();
    settingsForm?.addEventListener('change', updateLiveDisplays);
    startGameBtn();

    function startGameBtn() {

        btnStartGame?.addEventListener('click', () => {
            if (settingsForm) {
                const data = new FormData(settingsForm);
                setupGameFromSettings(data);
            }

            settingsScreen?.classList.replace('screen-visible', 'screen-hidden');
            gameScreen?.classList.replace('screen-hidden', 'screen-visible');


            const exitModal = document.getElementById('exit-modal');
            const backToGameBtn = document.getElementById('btn-back-to-game');
            const confirmExitBtn = document.getElementById('btn-confirm-exit');

            btnExitGame?.addEventListener('click', () => {
                exitModal?.classList.remove('hidden');
            });

            backToGameBtn?.addEventListener('click', () => {
                exitModal?.classList.add('hidden');
            });

            confirmExitBtn?.addEventListener('click', () => {
                exitModal?.classList.add('hidden');

                gameScreen?.classList.replace('screen-visible', 'screen-hidden');
                settingsScreen?.classList.replace('screen-hidden', 'screen-visible');

                if (showCards) showCards.innerHTML = '';
            });

            const data = new FormData(settingsForm as HTMLFormElement);
            const selectedTheme = data.get('theme-choice') as string;

            // So sieht dieser Bereich in deiner Hauptdatei danach aus:

            let memorycards: Memory[] = [];
            let backfaceImagePath: string = "src/assets/game-page/card-backface1.png";

            if (selectedTheme === "Code vibes theme") {
                backfaceImagePath = "src/assets/game-page/card-backface1.png";
                memorycards = [...CODE_VIBES_CARDS]; // Blitzschnell & sauber!
            }
            else if (selectedTheme === "DA Projects theme") {
                backfaceImagePath = "src/assets/game-page/card-backface2.png";
                memorycards = [...DA_PROJECTS_CARDS];
            }
            else if (selectedTheme === "Foods theme") {
                backfaceImagePath = "src/assets/game-page/card-backface3.png";
                memorycards = [...FOOD_CARDS];
            }


            if (selectedSize === "16") {
                memorycards = memorycards.slice(0, 16);
            }
            else if (selectedSize === "24") {
                memorycards = memorycards.slice(0, 24);
            }


            for (let i = memorycards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [memorycards[i], memorycards[j]] = [memorycards[j], memorycards[i]];
            }

            const showCards = document.getElementById('game-bord');

            if (showCards) {
                showCards.innerHTML = '';
                memorycards.forEach(card => {
                    showCards.innerHTML += `
                <button id="card-${card.id}" data-image="${card.memory_image}" class="card" type="button">
                     <div class="card__inner">
                         <img src="${card.memory_image}" class="card__face">
                         <img src="${backfaceImagePath}" alt="backface-card" class="card__face card__face--back">
                     </div>
                </button>
                `;
                });

                showCards.addEventListener("click", e => {
                    updateHUD();
                    const card = (e.target as HTMLElement).closest(".card") as HTMLButtonElement;

                    if (!card || lockBoard || card.classList.contains("is-flipped") || flippedCards.includes(card)) {
                        return;
                    }

                    flipCard(card);

                    if (flippedCards.length === 2) {
                        checkCardsMatch();
                    }
                });
            }
        });
    }


    function flipCard(card: HTMLButtonElement) {
        card.classList.add('is-flipped');
        flippedCards.push(card);
    }

    function checkCardsMatch() {

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
                card1.classList.remove("is-flipped");
                card2.classList.remove("is-flipped");
                flippedCards = [];
                if (activePlayer === "blue") {
                    activePlayer = "orange";
                } else {
                    activePlayer = "blue";
                }
                lockBoard = false;
                updateHUD();
                checkGameOver();
            }, 2000);
        }
    }

    function updateHUD() {
        const scoreBlueDisplay = document.getElementById('score-blue-val');
        const scoreOrangeDisplay = document.getElementById('score-orange-val');
        const playerDisplay = document.getElementById('current-player-display');

        if (scoreBlueDisplay) {
            scoreBlueDisplay.textContent = scores.blue.toString();
        }

        if (scoreOrangeDisplay) {
            scoreOrangeDisplay.textContent = scores.orange.toString();
        }

        if (playerDisplay) {
            playerDisplay.textContent = activePlayer.charAt(0).toUpperCase() + activePlayer.slice(1);
        }
    }




    function setupGameFromSettings(data: FormData): void {


        currentSettings = {
            theme: data.get('theme-choice') as GameTheme,
            player: (data.get('player-choice') as string).toLowerCase() as PlayerColor,
            size: data.get('size-choice') as BoardSize
        };

        activePlayer = currentSettings.player;

        scores.blue = 0;
        scores.orange = 0;

        const playerDisplay = document.getElementById('current-player-display');
        const scoreBlueDisplay = document.getElementById('score-blue-val');
        const scoreOrangeDisplay = document.getElementById('score-orange-val');

        if (playerDisplay) {

            playerDisplay.textContent = activePlayer.charAt(0).toUpperCase() + activePlayer.slice(1);
        }

        if (scoreBlueDisplay) scoreBlueDisplay.textContent = '0';
        if (scoreOrangeDisplay) scoreOrangeDisplay.textContent = '0';
        updateHUD();

    }


    function checkGameOver() {
        const totalpaare = 8;
        const foundPaare = scores.blue + scores.orange;

        if (foundPaare === totalpaare) {

            const gameOverScreen = document.getElementById('game-over-screen');
            const winnerText = document.getElementById('game-over-text');
            const gameScreen = document.getElementById('game-screen');
            if (gameOverScreen && winnerText && gameScreen) {

                if (scores.blue > scores.orange) {
                    winnerText.textContent = "Blau gewinnt das Spiel!";
                    gameOverScreen.classList.add('blue');
                }
                else if (scores.orange > scores.blue) {
                    winnerText.textContent = "Orange gewinnt das Spiel!";
                    gameOverScreen.classList.add('orange');
                }

                else {
                    winnerText.textContent = "Unentschieden!";
                }
            }
            gameScreen?.classList.replace('screen-visible', 'screen-hidden');
            gameOverScreen?.classList.replace('screen-hidden', 'screen-visible');

        }
    }

    setupEventListeners();

    function setupEventListeners() {
        const playBtnToSettings = document.getElementById('btn-to-settings');
        // const btnStartGame = document.getElementById('btnStartGame');
        // const btnExitGame = document.getElementById('btn-exit-game');
        // const backToGameBtn = document.getElementById('btn-back-to-game');
        // const confirmExitBtn = document.getElementById('btn-confirm-exit');

        const showCards = document.getElementById('game-bord');
        const gameOverScreen = document.getElementById('game-over-screen');
        const btnBackToSettings = document.getElementById('btn-back-to-settings');

        // Navigation: Home -> Settings
        playBtnToSettings?.addEventListener('click', () => {
            homeScreen?.classList.replace('screen-visible', 'screen-hidden');
            settingsScreen?.classList.replace('screen-hidden', 'screen-visible');
        });

        // ... restlicher Code bleibt genau gleich ...

        // --- GAME OVER BUTTON ("Nochmal spielen") ---
        btnBackToSettings?.addEventListener('click', () => {
            gameOverScreen?.classList.replace('screen-visible', 'screen-hidden');
            settingsScreen?.classList.replace('screen-hidden', 'screen-visible');

            if (showCards) showCards.innerHTML = '';

            scores.blue = 0;
            scores.orange = 0;
            flippedCards = [];
            lockBoard = false;
        });

        // Karten-Klicks
        showCards?.addEventListener("click", (e) => {
            const card = (e.target as HTMLElement).closest(".card") as HTMLButtonElement;
            if (!card || lockBoard || card.classList.contains("is-flipped")) return;
        });
    }


}