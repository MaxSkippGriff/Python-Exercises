import { Injectable } from "@angular/core";
import { Card } from "../cards/card.class";
import { CardService } from "./card.service";
import { RankingService } from "./ranking.service";
import { Router } from "@angular/router";
import io from "socket.io-client";
import { TokenStorageService } from "src/app/_services/token-storage.service";
import { DataService } from 'src/app/_services/data.service';

// request dependencies from external source
@Injectable({
  providedIn: "root"
})
export class GameService {
  cards: Card[] = [];
  activeCards: Card[] = [];
  isBoardLocked: boolean = false;
  isCheatActivated: boolean = false;
  rounds: number = 0;
  playerName: string;
  gameSocket: any;
  isConnected: boolean = false;
  playerNumber: number = 0;
  currentPlayerType: string = "user";
  opponentReady: boolean = false;
  ready: boolean = false;
  playersReady: boolean = false;
  start: boolean = false;
  gameFinished: boolean = false;
  opponentPlayAgain: boolean = false;
  infoDisplay: any;
  yourTurn: any;
  opponentTurn: any;
  serverNotFull: boolean = true;
  playerData = [] as any;
  username: string;
  player = {username: "", result: "", rounds: this.rounds};
  opponent = {username: "", result: "", rounds: this.rounds};
  gameStarted: boolean = false;
  isFriend:boolean = false;

  constructor(
    private cardService: CardService,
    private leaderboardService: RankingService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private dataService: DataService
  ) {
    this.cards = this.cardService.getCards();
    this.username = this.tokenStorageService.getUser();
  }

  //determines when game has finished
  get isGameOver(): boolean {
    return this.gameFinished;
  }

  get isGameFinished(): boolean {
    return this.cards.every(cards => cards.visible === true);
  }

  //when card clicked, flips 180
  //revealing the other side
  showCard(card: Card): void {
    if (!this.playersReady) return;

    if (!(this.currentPlayerType === "user")) return;

    if (!this.isMoveValid()) return;
    // If the move is valid, emit to the server
    if (this.isCardValid(card)) {
      this.emitMove(card);
      this.activeCards.push(card);
      card.show();
      // Adjusts current player information
      this.currentPlayerType = "enemy";
      this.infoDisplay.style.display = 'none';
      this.yourTurn.style.display = 'none';
      this.opponentTurn.style.display = 'inline';
    }

    if (this.activeCards.length === 2) {
      this.runRound();
    }

    if (this.isGameFinished) {
      console.log(this.player.username);
      console.log(this.opponent.username);
      this.gameFinished = true;
      this.infoDisplay.innerHTML = "You won!";
      this.infoDisplay.style.display = 'inline';
      this.yourTurn.style.display = 'none';
      this.opponentTurn.style.display = 'none';
      this.setGameResult();
      // this.addPlayerInRanking();
    }
  }

  // On receiving opponent's turn from the server, flip the specified card
  showOpponentsCard(id) {
    if (!this.playersReady) {
      return;
    }
    if (this.isCardValid(this.cards[id])) {
      this.activeCards.push(this.cards[id]);
      this.cards[id].show();
      // Adjusts current player information
      this.currentPlayerType = "user";
      this.infoDisplay.style.display = 'none';
      this.opponentTurn.style.display = 'none';
      this.yourTurn.style.display = 'inline';
    }

    if (this.activeCards.length === 2) {
      this.runRound();
    }

    if (this.isGameFinished) {
      this.gameFinished = true;
      console.log(this.player.username);
      console.log(this.opponent.username);
      this.infoDisplay.innerHTML = "You won!";
      this.infoDisplay.style.display = 'inline';
      this.yourTurn.style.display = 'none';
      this.opponentTurn.style.display = 'none';
      this.setGameResult();
      // this.addPlayerInRanking();
    }
  }

  // once gameplay complete,
  // start again
  // Clears the deck and shares between players again
  playAgain(): void {
    this.gameFinished = false;
    if (!this.opponentPlayAgain) {
      this.gameSocket.emit('play-again');
      this.gameSocket.emit('clear-deck');
      this.cards = this.cardService.getCards();
      this.playAgainDeckSend();
    }
    else {
      this.cards = [];
      this.gameSocket.emit('card-request-again');
      this.gameSocket.emit('clear-deck');
    }
    this.opponentPlayAgain = false;
    this.activeCards = [];
    this.rounds = 0;
    this.isBoardLocked = false;
    if (this.currentPlayerType === 'user') {
      this.infoDisplay.style.display = 'none';
      this.yourTurn.style.display = 'inline';
    }
    else {
      this.infoDisplay.style.display = 'none';
      this.opponentTurn.style.display = 'inline';
    }
  }

  toggleCheat(): void {
    this.isCheatActivated = !this.isCheatActivated;
  }

  // check whether move is valid
  // i.e. unlocked and not gameover
  private isMoveValid(): boolean {
    return !this.isGameFinished && !this.isBoardLocked;
  }

  private runRound() {
    this.lockBoard();

    if (this.isMatch()) {
      this.activeCards = [];
      this.unlockBoard();
    }
    else {
      setTimeout(() => {
        this.hideSelectedCards();
        this.unlockBoard();
      }, 500);
    }

    this.rounds++;
  }

  //check whether card is valid
  private isCardValid(card: Card): boolean {
    return this.activeCards.length < 2 && !card.visible;
  }

  // locks board
  private lockBoard(): void {
    this.isBoardLocked = true;
  }

  // unlocks board
  private unlockBoard(): void {
    this.isBoardLocked = false;
  }

  // determines whether cards match
  private isMatch(): boolean {
    return this.activeCards[0].id === this.activeCards[1].id;
  }

  private hideSelectedCards(): void {
    this.activeCards[0].hide();
    this.activeCards[1].hide();
    this.activeCards = [];
  }

  // private addPlayerInRanking(): void {
  //   this.leaderboardService.addPlayer({
  //     name: this.playerName,
  //     rounds: this.rounds
  //   });
  // }

  // Multiplayer functionality
  public connectToGame(): void {
    const title = document.querySelector("#title") as HTMLElement;
    title.style.display = 'none';
    this.infoDisplay = document.querySelector("#info") as HTMLElement;
    this.yourTurn = document.querySelector('#your_turn') as HTMLElement;
    this.opponentTurn = document.querySelector('#opponent_turn') as HTMLElement;

    if (this.isConnected) return;

    // Opens socket connection
    this.gameSocket = io("http://localhost:3050");
    this.isConnected = true;
    this.infoDisplay.style.display = 'inline';

    // Gets your player number
    this.gameSocket.on('player-number', num => {
      if (num === -1) {
        this.infoDisplay.style.marginLeft = "450px";
        this.infoDisplay.innerHTML = "Sorry, the server is full.";
        this.serverNotFull = false;
      } else {
        this.playerNumber = parseInt(num);
        if (this.playerNumber === 0) {
          if (this.playerNumber === 0) {
            this.start = true;
            // If this is the first player to connect, send cards to be stored on the server
            for (let i = 0; i < this.cards.length; i++) {
              this.gameSocket.emit('send-card', JSON.stringify(this.cards[i]));
            }
          }
        }
        if (this.playerNumber === 1) {
          this.currentPlayerType = "enemy";
        }
        // Get other player status
        this.gameSocket.emit('check-players');
      }
    })

    // Another player has connected or disconnected
    this.gameSocket.on('player-connection', num => {
      console.log(`Player number ${num} has connected or disconnected`);
    })

    // On enemy ready
    this.gameSocket.on('opponent-ready', num => {
      this.opponentReady = true;
      if (this.ready) {
        if (this.currentPlayerType === "user") {
          this.infoDisplay.style.display = 'none';
          this.opponentTurn.style.display = 'none'
          this.yourTurn.style.display = 'inline';
        }
        else {
          this.infoDisplay.style.display = 'none';
          this.yourTurn.style.display = 'none';
          this.opponentTurn.style.display = 'inline';
        }
        this.playersReady = true;
        if(!this.gameStarted){
          this.gameSocket.emit('player-name', this.username);
          this.gameStarted = true;
        }
      }
    })

    // Check player status
    this.gameSocket.on('check-players', players => {
      players.forEach((p, i) => {
        if (p.ready) {
          if (i !== this.playerNumber) {
            this.opponentReady = true;
          }
        }
      })
    })

    // On turn received
    this.gameSocket.on('card-flipped', card => {
      this.showOpponentsCard(card);
    })

    // Gets opponent information
    this.gameSocket.on('opponent-information', username => {
      this.opponent.username = username.replace(/['"]+/g, '');
      this.username = this.username.replace(/['"]+/g, '');
      this.player.username = this.username;
    })

  }

  // Ready button functionality
  public readyToPlay(): void {
    if (!this.isConnected) return;
    if (this.ready) return;
    if (!this.ready) {
      this.gameSocket.emit('player-ready');
      this.ready = true;
    }

    if (this.playerNumber === 1) {
      if (this.opponentReady) {
        this.cards = [];
      }
      this.cards = [];
      this.start = true;
      // If second player to join, request the cards from the server
      this.gameSocket.emit('card-request');
      this.gameSocket.on('card-sent', value => {
        let cardToPush = JSON.parse(value);
        let card = new Card(cardToPush.id, cardToPush.image);
        card.shuffledId = cardToPush.shuffledId;
        this.cards.push(card);
      })
    }

    if (this.opponentReady) {
      this.playersReady = true;
      if(!this.gameStarted){
        this.gameSocket.emit('player-name', this.username);
        this.gameStarted = true;
      }
      if (this.currentPlayerType === 'user') {
        this.infoDisplay.style.display = 'none';
        this.opponentTurn.style.display = 'none';
        this.yourTurn.style.display = 'inline';
      }
      if (this.currentPlayerType === 'enemy') {
        this.infoDisplay.style.display = 'none';
        this.yourTurn.style.display = 'none';
        this.opponentTurn.style.display = 'inline';
      }
    }
    this.gameSocket.on('play-again', value => {
      this.opponentPlayAgain = value;
    })

    // Handles receiving cards for a rematch
    this.gameSocket.on('card-sent-again', value => {
      let cardToPush = JSON.parse(value);
      let card = new Card(cardToPush.id, cardToPush.image);
      card.shuffledId = cardToPush.shuffledId;
      this.cards.push(card);
    })
  }

  private emitMove(cardVal): void {
    this.gameSocket.emit('card-flipped', cardVal.shuffledId);
  }

  private playAgainDeckSend(): void {
    for (let i = 0; i < this.cards.length; i++) {
      this.gameSocket.emit('send-card', JSON.stringify(this.cards[i]));
    }
  }
  
  private setGameResult(){
    this.player.result = "WIN";
    this.opponent.result = "WIN";
    this.player.rounds = this.rounds;
    this.opponent.rounds = this.rounds;
    this.playerData.push(this.player);
    this.playerData.push(this.opponent);
    console.log(this.playerData);
    if(this.playerNumber === 0){
      let gameInfo = {"players": this.playerData}
      this.dataService.addGameInstance("memorygame", gameInfo).subscribe(
        (data:any)=>{
          console.log(data.result)
        },
        error=>{
          console.log(error.error);
        }
      )
    }
  }
  get gameResult(){
    return this.playerData
  }

  addFriend() {
    console.log("player opponent " + this.opponent.username)
    this.dataService.addAFriend(this.opponent.username, this.username).subscribe(
      (data: any) => {
        console.log(data.result)
        this.isFriend = true;
      },
      error => {
        console.log(error.error);
      }
    )
  }
}


