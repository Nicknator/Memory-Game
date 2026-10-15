import './styles/main.scss';

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

    btnStartGame?.addEventListener('click', () => {
        settingsScreen?.classList.replace('screen-visible', 'screen-hidden');
        gameScreen?.classList.replace('screen-hidden', 'screen-visible');

    });






    interface Memory {
        id: number;
        memory_image: string;
    }

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
    
        <button id="${card.id}" class="card" type="button">
            <div class="card__inner">
                <img src="${card.memory_image}" class="card__face">
                <img src="src/assets/game-page/card-backface.png" alt="backface-card" class="card__face card__face--back" >

            </div>

        </button>
   
        `;
        });


        showCards.addEventListener("click", e => {
            const card = (e.target as HTMLElement).closest(".card") as HTMLButtonElement
            if (card) {
                card.classList.toggle("is-flipped")
            }
        })


    }



}











