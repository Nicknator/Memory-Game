import './styles/main.scss';

const playBtnToSettings = document.getElementById('btn-to-settings');
const homeScreen = document.getElementById('homescreen');
const settingsScreen = document.getElementById('settings-screen');


playBtnToSettings?.addEventListener('click', () => {
    homeScreen?.classList.replace('screen-visible', 'screen-hidden');
    settingsScreen?.classList.replace('screen-hidden', 'screen-visible');
})

