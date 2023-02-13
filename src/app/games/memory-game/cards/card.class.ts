
export class Card {
  id: string;
  visible: boolean = false;
  image: { name: string; path: string };
  shuffledId: number = 0;

  constructor(id, image) {
    this.id = id;
    this.image = image;
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}
