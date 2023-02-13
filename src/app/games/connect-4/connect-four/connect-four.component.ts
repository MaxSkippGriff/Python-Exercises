import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import io from "socket.io-client";
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { DataService } from 'src/app/_services/data.service';
@Component({
  selector: 'app-connect-four',
  templateUrl: './connect-four.component.html',
  styleUrls: ['./connect-four.component.css']
})

@Injectable({
  providedIn: "root"
})

export class ConnectFourComponent implements OnInit {
  isFriend: boolean = false
  isGameOver: boolean = false;
  socket: any;
  squares: any;
  result: any;
  displayCurrentPlayer: any;
  infoDisplay: any;
  connectToGameButton: any;
  readyForGameButton: any;
  playerName: any;
  playAgainWindow: any;
  currentPlayerType: string = 'user';
  playerNumber: number = 0;
  ready: boolean = false;
  opponentReady: boolean = false;
  slotTaken: number = -1;
  connected: boolean = false;
  username: string;
  player = { username: "", result: "" };
  opponent = { username: "", result: "" };
  playerData = [] as any;
  winningArrays = [] as any;
  gameStarted: boolean = false;

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private dataService: DataService) {
    this.username = tokenStorageService.getUser();
  }

  ngOnInit(): void {
  }

  addFriend(e: { preventDefault: () => void; }) {
    e.preventDefault()
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

  ngAfterViewInit() {
    this.squares = document.querySelectorAll('.grid div')
    this.result = document.querySelector('#result')
    this.displayCurrentPlayer = document.querySelector('#current-player')
    this.infoDisplay = document.querySelector('#space');
    this.connectToGameButton = document.querySelector('#connectButton');
    this.readyForGameButton = document.querySelector('#readyButton')
    this.playerName = document.querySelector('#test') as HTMLElement;
    this.playAgainWindow = document.querySelector('#finish') as HTMLElement;

    this.connectToGameButton.addEventListener('click', this.connectToGame());

    // All possible winning combinations
    this.winningArrays = [
      [0, 1, 2, 3],
      [41, 40, 39, 38],
      [7, 8, 9, 10],
      [34, 33, 32, 31],
      [14, 15, 16, 17],
      [27, 26, 25, 24],
      [21, 22, 23, 24],
      [20, 19, 18, 17],
      [28, 29, 30, 31],
      [13, 12, 11, 10],
      [35, 36, 37, 38],
      [6, 5, 4, 3],
      [0, 7, 14, 21],
      [41, 34, 27, 20],
      [1, 8, 15, 22],
      [40, 33, 26, 19],
      [2, 9, 16, 23],
      [39, 32, 25, 18],
      [3, 10, 17, 24],
      [38, 31, 24, 17],
      [4, 11, 18, 25],
      [37, 30, 23, 16],
      [5, 12, 19, 26],
      [36, 29, 22, 15],
      [6, 13, 20, 27],
      [35, 28, 21, 14],
      [0, 8, 16, 24],
      [41, 33, 25, 17],
      [7, 15, 23, 31],
      [34, 26, 18, 10],
      [14, 22, 30, 38],
      [27, 19, 11, 3],
      [35, 29, 23, 17],
      [6, 12, 18, 24],
      [28, 22, 16, 10],
      [13, 19, 25, 31],
      [21, 15, 9, 3],
      [20, 26, 32, 38],
      [36, 30, 24, 18],
      [5, 11, 17, 23],
      [37, 31, 25, 19],
      [4, 10, 16, 22],
      [2, 10, 18, 26],
      [39, 31, 23, 15],
      [1, 9, 17, 25],
      [40, 32, 24, 16],
      [9, 17, 25, 33],
      [8, 16, 24, 32],
      [11, 17, 23, 29],
      [12, 18, 24, 30],
      [1, 2, 3, 4],
      [5, 4, 3, 2],
      [8, 9, 10, 11],
      [12, 11, 10, 9],
      [15, 16, 17, 18],
      [19, 18, 17, 16],
      [22, 23, 24, 25],
      [26, 25, 24, 23],
      [29, 30, 31, 32],
      [33, 32, 31, 30],
      [36, 37, 38, 39],
      [40, 39, 38, 37],
      [7, 14, 21, 28],
      [8, 15, 22, 29],
      [9, 16, 23, 30],
      [10, 17, 24, 31],
      [11, 18, 25, 32],
      [12, 19, 26, 33],
      [13, 20, 27, 34],
    ]
  }

  // Start game
  connectToGame() {
    // Creates socket to use for the game
    if (this.connected) return;
    this.socket = io("http://localhost:3080");
    // Emits user to other player
    this.connected = true;
    // Gets your player number
    this.socket.on('player-number', num => {
      if (num === -1) {
        this.infoDisplay.innerHTML = "Sorry, the server is full.";
      } else {
        this.playerNumber = parseInt(num);
        if (this.playerNumber === 1) {
          this.currentPlayerType = "enemy";
        }
        // Get other player status
        this.socket.emit('check-players');
      }
    })

    // Another player has connected or disconnected
    this.socket.on('player-connection', num => {
      console.log(`Player number ${num} has connected or disconnected`);
      this.playerConnectedOrDisconnected(num);
    })

    // On enemy ready
    this.socket.on('opponent-ready', num => {
      this.opponentReady = true;
      if (this.ready) {
        this.playGame(this.socket);
      }
    })

    // Check player status
    this.socket.on('check-players', players => {
      players.forEach((p, i) => {
        if (p.connected) {
          this.playerConnectedOrDisconnected(i);
        }
        if (p.ready) {
          if (i !== this.playerNumber) {
            this.opponentReady = true;
          }
        }
      })
    })

    // Ready button click
    this.readyForGameButton.addEventListener('click', () => {
      this.playGame(this.socket);
    })

    // On turn received
    this.socket.on('takeSlot', id => {
      this.opponentTurn(id);
      this.playGame(this.socket);
    })

    // Gets opponent information
    this.socket.on('opponent-information', username => {
      this.opponent.username = username.replace(/['"]+/g, '');
      this.username = this.username.replace(/['"]+/g, '');
      this.player.username = this.username;
    })
    this.setupGameSlots();
  }

  setupGameSlots(){
    // Adds game functionality to each slot on the board - emits to second player and swaps whose turn it is
    for (let i = 0; i < this.squares.length; i++) {
      (this.squares[i] as HTMLElement).dataset.id = String(i);
      this.squares[i].addEventListener("click", () => {
        //if the square below your current square is taken, you can go ontop of it
        if (this.currentPlayerType === 'user' && this.ready && this.opponentReady && !this.isGameOver) {
          if (this.squares[i + 7].classList.contains('taken') && !this.squares[i].classList.contains('taken') || this.squares[i + 7].classList.contains('bottom') && !this.squares[i].classList.contains('taken')) {
            if (this.playerNumber == 0) {
              this.squares[i].classList.add('taken')
              this.squares[i].classList.add('player-one')
              let sq = (this.squares[i] as HTMLElement).dataset.id;
              this.slotTaken = parseInt(sq)
              this.socket.emit('takeSlot', this.slotTaken);
              this.checkBoard()
              this.currentPlayerType = 'enemy'
              this.playGame(this.socket);
            } else if (this.playerNumber == 1) {
              this.squares[i].classList.add('taken')
              this.squares[i].classList.add('player-two')
              let sq = (this.squares[i] as HTMLElement).dataset.id;
              this.slotTaken = parseInt(sq)
              this.socket.emit('takeSlot', this.slotTaken);
              this.checkBoard()
              this.currentPlayerType = 'enemy'
              this.playGame(this.socket);
            }
          } else alert('You can\'t go here!')
        }
      })
    }
  }

  // Makes player name bold on connection
  playerConnectedOrDisconnected(num) {
    let player = `.p${parseInt(num) + 1}`;
    if (parseInt(num) === this.playerNumber) {
      let myElement = <HTMLElement><any>document.querySelector(player);
      myElement.style.fontWeight = 'bold';
      var textToChange = myElement.childNodes[0];
      textToChange.nodeValue = this.playerName.innerText + "   ";
    }
    if (this.playerNumber === 0) {
      let p2 = <HTMLElement><any>document.querySelector(`.p2`);
      p2.style.display = 'none';
    }
    if (this.playerNumber === 1) {
      let p1 = <HTMLElement><any>document.querySelector(`.p1`);
      p1.style.display = 'none';
    }
  }

  // Takes the opponent's based on the slot received 
  opponentTurn(id) {
    if (this.playerNumber == 0) {
      this.playerNumber = 1;
    }
    else {
      this.playerNumber = 0;
    }
    if (this.squares[id + 7].classList.contains('taken') && !this.squares[id].classList.contains('taken') || this.squares[id + 7].classList.contains('bottom') && !this.squares[id].classList.contains('taken')) {
      if (this.playerNumber == 0) {
        this.squares[id].classList.add('taken')
        this.squares[id].classList.add('player-one')
        this.playerNumber = 1;
      } else if (this.playerNumber == 1) {
        this.squares[id].classList.add('taken')
        this.squares[id].classList.add('player-two')
        this.playerNumber = 0;
      }
    } else alert('You can\'t go here!')
    this.checkBoard()
    this.currentPlayerType = 'user';
  }

  // Checks if any of the winning combinations are on the board
  checkBoard() {
    for (let y = 0; y < this.winningArrays.length; y++) {
      const square1 = this.squares[this.winningArrays[y][0]]
      const square2 = this.squares[this.winningArrays[y][1]]
      const square3 = this.squares[this.winningArrays[y][2]]
      const square4 = this.squares[this.winningArrays[y][3]]

      //check those squares to see if they all have the class of player-one
      if (
        square1.classList.contains('player-one') &&
        square2.classList.contains('player-one') &&
        square3.classList.contains('player-one') &&
        square4.classList.contains('player-one')
      ) {
        this.isGameOver = true;
        this.socket.emit('game-over');
        this.displayCurrentPlayer.innerHTML = '';
        if(this.currentPlayerType === 'user'){
          this.result.innerHTML = 'You win!';
        }
        else{
          this.result.innerHTML = 'Opponent wins!';
        }
        this.playAgainWindow.style.visibility = 'visible';
        this.playAgainWindow.style.opacity = '1';
      }
      //check those squares to see if they all have the class of player-two
      if (
        square1.classList.contains('player-two') &&
        square2.classList.contains('player-two') &&
        square3.classList.contains('player-two') &&
        square4.classList.contains('player-two')
      ) {
        this.isGameOver = true;
        this.socket.emit('game-over');
        this.displayCurrentPlayer.innerHTML = '';
        if(this.currentPlayerType === 'user'){
          this.result.innerHTML = 'You win!';
        }
        else{
          this.result.innerHTML = 'Opponent wins!';
        }
        this.playAgainWindow.style.visibility = 'visible';
        this.playAgainWindow.style.opacity = '1';
      }
    }
  }

  // Emits ready signal and checks if game is over
  playGame(socket) {
    if(this.ready && this.opponentReady && !this.gameStarted){
      this.socket.emit('player-name', this.username);
      this.gameStarted = true;
    }
    socket.on('game-over', over => {
      this.isGameOver = over;
    })
    if (this.isGameOver) {
      console.log(this.player.username);
      console.log(this.opponent.username);
      this.setGameResult();
      return;
    }
    if (!this.ready) {
      socket.emit('player-ready');
      this.ready = true;
    }
    if (this.opponentReady) {
      if (this.currentPlayerType === 'user') {
        this.displayCurrentPlayer.innerHTML = 'Your turn!';
      }
      if (this.currentPlayerType === 'enemy') {
        this.displayCurrentPlayer.innerHTML = 'Opponent\'s turn';
      }
    }
  }
  
  playAgain() {
    this.router.navigate(['connect4start']).then(() => {
      window.location.reload();
    });
  }

  setGameResult() {
    if (this.currentPlayerType === 'user') {
      this.player.result = "LOSS";
      this.opponent.result = "WIN";
    }
    else {
      this.opponent.result = "LOSS";
      this.player.result = "WIN";
    }
    this.playerData.push(this.player);
    this.playerData.push(this.opponent);
    console.log(this.playerData);
    if(this.playerNumber === 0){
      this.addGameInstance(this.playerData)
    }
  }

  get gameResult() {
    return this.playerData;
  }

  //make the call to api to store the gameinstance data
  addGameInstance(playerData: any) {
    let gameInfo = { "players": playerData }
    this.dataService.addGameInstance("connect4", gameInfo).subscribe(
      (data: any) => {
        console.log(data.result)
      },
      error => {
        console.log(error.error);
      }
    )
  }
}