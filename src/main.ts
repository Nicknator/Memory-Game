import './styles/main.scss';

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

    function updateLiveDisplays() {
        if (!settingsForm) return;
        const data = new FormData(settingsForm);

        const selectedTheme = data.get('theme-choice') as string;
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

        const selectedSize = data.get('size-choice') as string;
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


            const memorycards: Memory[] = [
                {
                    id: 1,
                    memory_image: "src/assets/code-vibes-themes/code-vibes1.png",

                },
                {
                    id: 2,
                    memory_image: "src/assets/code-vibes-themes/code-vibes1.png",

                },

                {
                    id: 3,
                    memory_image: "src/assets/code-vibes-themes/code-vibes2.png",

                },

                {
                    id: 4,
                    memory_image: "src/assets/code-vibes-themes/code-vibes2.png",

                },
                {
                    id: 5,
                    memory_image: "src/assets/code-vibes-themes/code-vibes3.png",

                },
                {
                    id: 6,
                    memory_image: "src/assets/code-vibes-themes/code-vibes3.png",

                },
                {
                    id: 7,
                    memory_image: "src/assets/code-vibes-themes/code-vibes4.png",

                },
                {
                    id: 8,
                    memory_image: "src/assets/code-vibes-themes/code-vibes4.png",

                },
                {
                    id: 9,
                    memory_image: "src/assets/code-vibes-themes/code-vibes5.png",

                },
                {
                    id: 10,
                    memory_image: "src/assets/code-vibes-themes/code-vibes5.png",

                },
                {
                    id: 11,
                    memory_image: "src/assets/code-vibes-themes/code-vibes6.png",

                },
                {
                    id: 12,
                    memory_image: "src/assets/code-vibes-themes/code-vibes6.png",

                },
                {
                    id: 13,
                    memory_image: "src/assets/code-vibes-themes/code-vibes7.png",

                },
                {
                    id: 14,
                    memory_image: "src/assets/code-vibes-themes/code-vibes7.png",

                },
                {
                    id: 15,
                    memory_image: "src/assets/code-vibes-themes/code-vibes8.png",

                },
                {
                    id: 16,
                    memory_image: "src/assets/code-vibes-themes/code-vibes8.png",

                },

            ];

            for (let i = memorycards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [memorycards[i], memorycards[j]] = [memorycards[j], memorycards[i]];
            }

            const showCards = document.getElementById('game-bord');


            if (showCards) {
                memorycards.forEach(card => {

                    showCards.innerHTML += `
    
                <button id="card-${card.id}" data-image="${card.memory_image}" class="card" type="button">
                     <div class="card__inner">
                         <img src="${card.memory_image}" class="card__face">
                         <img src="src/assets/game-page/card-backface.png" alt="backface-card" class="card__face card__face--back">
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
}
