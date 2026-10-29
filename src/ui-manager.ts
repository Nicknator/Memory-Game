import { MemoryCard, cardTemplate } from './template';


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
