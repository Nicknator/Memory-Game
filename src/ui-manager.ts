import { MemoryCard, cardTemplate } from './template';

/** Renders a screen template into #app with a smooth CSS transition. */
export function renderScreen(html: string, onRendered?: () => void): void {
  const app = document.getElementById('app');
  if (!app) return;

  app.classList.add('is-transitioning');

  setTimeout(() => {
    app.innerHTML = html;
    if (onRendered) onRendered();
    requestAnimationFrame(() => {
      app.classList.remove('is-transitioning');
    });
  }, 180);
}

/** Shows or hides a modal dialog based on the visibility flag. */
export function toggleModal(modalId: string, isVisible: boolean): void {
  const modal = document.getElementById(modalId);
  modal?.classList.toggle('hidden', !isVisible);
}

/** Renders all memory cards onto the board and attaches the click listener. */
export function renderGameBoard(
  memoryCards: MemoryCard[],
  backfaceImagePath: string,
  onCardClick: (e: MouseEvent) => void
): void {
  const board = document.getElementById('game-bord');
  if (!board) return;
  board.innerHTML = memoryCards.map((card) => cardTemplate(card, backfaceImagePath)).join('');
  board.onclick = (e: MouseEvent): void => onCardClick(e);
}
