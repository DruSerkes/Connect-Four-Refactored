/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(HEIGHT, WIDTH, p1, p2){
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.board = [];  //array of row arrays, each row is array of cells (board[y][x])
    this.p1 = p1;
    this.p2 = p2;
    this.currPlayer = this.p1; // active player: 1 or 2
    this.makeHtmlBoard();
    this.makeBoard();
  }

    /** makeBoard: create in-JS board structure:
    *   board = array of rows, each row is array of cells (board[y][x])
    */
  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {            
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');
    this.handleGameClick = this.handleClick.bind(this);

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleGameClick);
    
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  // piece.classList.add(`${this.currPlayer.color}`);
  piece.style.backgroundColor = this.currPlayer.color;
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
  }

  /** endGame: announce game end and remove event listener */
  endGame(msg) {
  const top = document.getElementById('column-top');
  top.removeEventListener('click', this.handleGameClick);
  alert(msg);
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`${this.currPlayer.color} player wins!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
}
  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    const win = _win.bind(this)
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (win(horiz) || win(vert) || win(diagDR) || win(diagDL)) {
          return true;
        }
      }
    }
  }

}

class Player {
  constructor(color){
    this.color = color;
  }
}

// Start button that starts/restarts the game 
const button = document.querySelector('button');
button.addEventListener('click', evt => {
  evt.preventDefault();

  //Create player 1
  const p1Color = document.getElementById('player1');
  const p1 = new Player(p1Color.value);
  p1.id = 'p1';
  //Create player 2
  const p2Color = document.getElementById('player2');
  const p2 = new Player(p2Color.value);
  p2.id = 'p2';

  //Clear text fields 
  p1Color.value = '';
  p2Color.value = '';

  //Create game object 
  const board = document.getElementById('board');
  if (board.children){
    board.innerHTML = '';
  }
  new Game(6, 7, p1, p2);
})



//This assignment took me longer than projected, so I didn't go ahead with further study 
//I styled my other Connect 4 game quite a bit, so I feel good on that for now. 
//Would love to revisit this when I'm more confident 