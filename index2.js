// distance: number of pixels a puzzle piece will move
const distance = 100;

// below is a 4x4 double array to emulate the gameboard
const puzzlePieces = [
  [
    { name: ".box1", x: 0, y: 0 },
    { name: ".box5", x: 0, y: 1 },
    { name: ".box9", x: 0, y: 2 },
    { name: ".box13", x: 0, y: 3 }
  ],
  [
    { name: ".box2", x: 1, y: 0 },
    { name: ".box6", x: 1, y: 1 },
    { name: ".box10", x: 1, y: 2 },
    { name: ".box14", x: 1, y: 3 }
  ],
  [
    { name: ".box3", x: 2, y: 0 },
    { name: ".box7", x: 2, y: 1 },
    { name: ".box11", x: 2, y: 2 },
    { name: ".box15", x: 2, y: 3 }
  ],
  [
    { name: ".box4", x: 3, y: 0 },
    { name: ".box8", x: 3, y: 1 },
    { name: ".box12", x: 3, y: 2 },
    { name: ".blank", x: 3, y: 3 }
  ]
];

const puzzle = {
  pieces: puzzlePieces,
  currentPiece: null,
  initialize: function() {
    // attach click event handlers for each piece
    const boxes = [...document.querySelectorAll('[class^="box"]')];
    boxes.forEach(box => {
      box.addEventListener("click", () => {
        this.currentPiece = box;
        this.slide();
      });
    });

    // shuffle board
    // this.shuffle();

    // show puzzle pieces
    this.display();
  },
  display: function() {
    // initialize pieces to their proper order
    for (let i = 0; i <= 3; i++) {
      for (let j = 0; j <= 3; j++) {
        const pieceDOM = document.querySelector(puzzlePieces[i][j].name);
        TweenLite.set(pieceDOM, { x: i * 100, y: j * 100 });
      }
    }
  },
  slide: function() {
    // is there a blank square immediately above, left, below, or right of clicked square? Return direction.
    const direction = this.findDirection();
    // if so, move direction
    this.move(direction);

    // check if arranged in order.  If so, "winner!"
    this.checkWinner();
  },
  findDirection: function() {
    // check for blank square above, left, below, or right of clicked square,
    // then return a direction "up", "down", "left", or "right"
     

    // move direction
    // check if winner
  },
  move: function() {},
  checkWinner: function() {}
};

puzzle.initialize();
