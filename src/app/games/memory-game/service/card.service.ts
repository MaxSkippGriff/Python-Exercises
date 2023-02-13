// Contains logic for getting
// cards and shuffling them

import { Injectable } from "@angular/core";
import { Card } from "../cards/card.class";
import { CARDS_IMAGES_PATHS } from "../card-path/images.config";

@Injectable({
  providedIn: "root"
})

export class CardService {
  constructor() {}

  // Get cards and place them on memory game board
  getCards(): Card[] {
    const cards = [];

    for (let i = 0; i < CARDS_IMAGES_PATHS.length; i++) {
      cards.push(new Card(i, CARDS_IMAGES_PATHS[i]));
      cards.push(new Card(i, CARDS_IMAGES_PATHS[i]));
    }

    this.shuffleArray(cards);

    return cards;
  }

  // Shuffle array of cards using random function
  private shuffleArray(elements: any[]): void {
    for (let i = elements.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [elements[i], elements[j]] = [elements[j], elements[i]];
      elements[i].shuffledId = i;
      elements[j].shuffledId = j;
    }
  }
}
