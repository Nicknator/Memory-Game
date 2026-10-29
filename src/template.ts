export interface MemoryCard{
    id: number|string;
    memory_image: string;

}


export function cardTemplate(card: MemoryCard, backfaceImagePath: string): string {
    return `
    <button id="card-${card.id}" data-image="${card.memory_image}" class="card" type="button">
             <div class="card__inner">
                 <img src="${card.memory_image}" class="card__face">
                 <img src="${backfaceImagePath}" alt="backface-card" class="card__face card__face--back">
             </div>
        </button>
  `;
}
