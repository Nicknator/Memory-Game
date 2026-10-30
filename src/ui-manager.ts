import { MemoryCard, cardTemplate } from './template';

export function changeScreen(hideId: string, showId: string): void {
  document.getElementById(hideId)?.classList.replace('screen-visible', 'screen-hidden');
  document.getElementById(showId)?.classList.replace('screen-hidden', 'screen-visible');
}

export function toggleModal(modalId: string, isVisible: boolean): void {
  const modal = document.getElementById(modalId);
  if (isVisible) {
    modal?.classList.remove('hidden');
  } else {
    modal?.classList.add('hidden');
  }
}

export function renderGameBoard(
  memoryCards: MemoryCard[],
  backfaceImagePath: string,
  onCardClick: (e: MouseEvent) => void
): void {
  const showCards = document.getElementById('game-bord');
  if (!showCards) return;

  showCards.innerHTML = memoryCards
    .map((card) => cardTemplate(card, backfaceImagePath))
    .join('');

  showCards.onclick = (e: MouseEvent): void => onCardClick(e);
}
