import { MemoryCard, cardTemplate } from './template';

/** Switches visibility between two screen elements by toggling CSS classes. */
export function changeScreen(hideId: string, showId: string): void {
  document.getElementById(hideId)?.classList.replace('screen-visible', 'screen-hidden');
  document.getElementById(showId)?.classList.replace('screen-hidden', 'screen-visible');
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
