// distance: number of pixels a puzzle piece will move
const distance = 100;

const puzzlePieces = [
  { name: ".box1", x: 0, y: 0, order: 0 },
  { name: ".box2", x: 100, y: 0, order: 1 },
  { name: ".box3", x: 200, y: 0, order: 2 },
  { name: ".box4", x: 300, y: 0, order: 3 },
  { name: ".box5", x: 0, y: 100, order: 4 },
  { name: ".box6", x: 100, y: 100, order: 5 },
  { name: ".box7", x: 200, y: 100, order: 6 },
  { name: ".box8", x: 300, y: 100, order: 7 },
  { name: ".box9", x: 0, y: 200, order: 8 },
  { name: ".box10", x: 100, y: 200, order: 9 },
  { name: ".box11", x: 200, y: 200, order: 10 },
  { name: ".box12", x: 300, y: 200, order: 11 },
  { name: ".box13", x: 0, y: 300, order: 12 },
  { name: ".box14", x: 100, y: 300, order: 13 },
  { name: ".box15", x: 200, y: 300, order: 14 },
];

// blankSpace: initialize blank square as last piece so as to remember where it is.
// Will eventually use it to ask direction of clicked puzzle piece(s).
// Once pieces move, must remember to update x,y values to new blank space coords
// order means nth element in sorted array.  Will be used inside checkWinner()
const blankSpace = { x: 300, y: 300, order: 16 };

// I'm structuring my program sort of like how Vue does it - all in my puzzle object below.
const puzzle = {
  pieces: puzzlePieces,
  distance,
  blankSpace,
  currentPiece: null,
  directionToMove: "",
  movablePieces: [],
  getRandomInt,
  initialize: function () {
    // attach click event handlers for each piece
    const boxes = [...document.querySelectorAll('[class^="box"]')];
    boxes.map((box) => {
      box.addEventListener("click", () => {
        this.currentPiece = box;
        this.slide();
      });
    });

    // shuffle board
    this.shuffle();

    // show puzzle pieces
    this.display();
  },
  display: function () {
    // initialize pieces to their proper order
    this.pieces.forEach((piece) => {
      const pieceDOM = document.querySelector(piece.name);
      TweenLite.set(pieceDOM, { x: piece.x, y: piece.y });
    });
  },
  slide: function () {
    // determine if puzzle piece(s) can slide and if so, move.
    // Is the clicked piece movable?
    this.directionToMove = this.isMoveable();

    if (this.directionToMove) {
      // If direction exists, are there any other pieces then can also move?
      this.findMovablePieces(); // this.moveablePieces should now contain all slideable pieces
      // Update each movable puzzle piece's x,y coords to desired destination before it actually moves
      this.preMovePieces();
      // Move all movable pieces appropriately by 1 tile
      // pass in moveablePieces array of all piece(s) that can move,
      // Animate pieces based on previously updated x,y coords
      this.slidePieces();

      // clear moveable pieces array
      this.movablePieces = [];

      // Check if game won
      // this.checkWinner();
    }
  },
  isMoveable: function () {
    // Is the clicked piece movable? If puzzlePiece's x or y coords match blankSpace's, then YES.
    // If yes, then return a direction to one of: "up", "down", "left", "right"
    // If no, then return a direction of ""
    const index = this.currentPiece.dataset.idx;
    if (
      this.pieces[index].x === this.blankSpace.x &&
      this.pieces[index].y < this.blankSpace.y
    ) {
      return "down";
    } else if (
      this.pieces[index].x === this.blankSpace.x &&
      this.pieces[index].y > this.blankSpace.y
    ) {
      return "up";
    } else if (
      this.pieces[index].y === this.blankSpace.y &&
      this.pieces[index].x < this.blankSpace.x
    ) {
      return "right";
    } else if (
      this.pieces[index].y === this.blankSpace.y &&
      this.pieces[index].x > this.blankSpace.x
    ) {
      return "left";
    } else {
      return "";
    }
  },
  findMovablePieces: function () {
    // Filter if x,y matches blankSpace's which includes currentPiece that was
    // clicked on which will be added to cumulative array of all movable pieces.

    const index = this.currentPiece.dataset.idx;

    switch (this.directionToMove) {
      case "up":
        this.movablePieces = this.pieces.filter(
          (piece) =>
            piece.x === this.blankSpace.x &&
            piece.y >= this.blankSpace.y &&
            piece.y <= this.pieces[index].y
        );
        break;
      case "down":
        this.movablePieces = this.pieces.filter(
          (piece) =>
            piece.x === this.blankSpace.x &&
            piece.y <= this.blankSpace.y &&
            piece.y >= this.pieces[index].y
        );
        break;
      case "left":
        this.movablePieces = this.pieces.filter(
          (piece) =>
            piece.y === this.blankSpace.y &&
            piece.x >= this.blankSpace.x &&
            piece.x <= this.pieces[index].x
        );
        break;
      case "right":
        this.movablePieces = this.pieces.filter(
          (piece) =>
            piece.y === this.blankSpace.y &&
            piece.x <= this.blankSpace.x &&
            piece.x >= this.pieces[index].x
        );
        break;
      default:
        console.log("Stayed");
    }

    // must sort arrays so bugs don't eventually come up when you start moving pieces around
    this.sortMoveablePieces();
  },
  preMovePieces: function () {
    // Update each movable puzzle piece's x,y coords to desired destination before it actually moves
    // Loop over each element in array, look at x, y coords, swap it appropriately

    if (this.directionToMove === "down" || this.directionToMove === "right") {
      this.preMovePiecesDR();
    } else if (this.directionToMove == "up" || this.directionToMove == "left") {
      this.preMovePiecesUL();
    }
  },
  preMovePiecesDR: function () {
    // remember 1st element's x,y coords which will be used to replace blankSpace's x,y coords
    const [rememberX, rememberY, rememberOrder] = [
      this.movablePieces[0].x,
      this.movablePieces[0].y,
      this.movablePieces[0].order,
    ];

    const length = this.movablePieces.length;

    // swap values, including 'order' which will be used for checkWinner()
    if (length > 1) {
      for (let i = 0; i < length - 1; i++) {
        this.movablePieces[i].x = this.movablePieces[i + 1].x;
        this.movablePieces[i].y = this.movablePieces[i + 1].y;
        this.movablePieces[i].order = this.movablePieces[i + 1].order;
      }
    }

    // swap x,y coords for last/only piece
    this.movablePieces[length - 1].x = this.blankSpace.x;
    this.movablePieces[length - 1].y = this.blankSpace.y;
    this.movablePieces[length - 1].order = this.blankSpace.order;
    this.blankSpace.x = rememberX;
    this.blankSpace.y = rememberY;
    this.blankSpace.order = rememberOrder;
  },
  preMovePiecesUL: function () {
    const length = this.movablePieces.length;

    // remember last element's x,y coords which will be used to replace blankSpace's x,y coords
    const [rememberX, rememberY, rememberOrder] = [
      this.movablePieces[length - 1].x,
      this.movablePieces[length - 1].y,
      this.movablePieces[length - 1].order,
    ];

    // swap values, including 'order' which will be used for checkWinner()
    if (length > 1) {
      for (let i = length - 1; i > 0; i--) {
        this.movablePieces[i].x = this.movablePieces[i - 1].x;
        this.movablePieces[i].y = this.movablePieces[i - 1].y;
        this.movablePieces[i].order = this.movablePieces[i - 1].order;
      }
    }

    // swap x,y coords for last/only piece
    this.movablePieces[0].x = this.blankSpace.x;
    this.movablePieces[0].y = this.blankSpace.y;
    this.movablePieces[0].order = this.blankSpace.order;
    this.blankSpace.x = rememberX;
    this.blankSpace.y = rememberY;
    this.blankSpace.order = rememberOrder;
  },
  slidePieces: function () {
    this.movablePieces.forEach((piece) => {
      const box = document.querySelector(piece.name);
      TweenMax.to(box, 0.17, {
        x: piece.x,
        y: piece.y,
        ease: Power0.easeNone,
        onComplete: () => {
          this.checkWinner();
        },
      });
    });
  },
  sortMoveablePieces: function () {
    if (this.directionToMove === "up" || this.directionToMove === "down") {
      this.movablePieces.sort((a, b) => {
        return a.y - b.y;
      });
    } else if (
      this.directionToMove === "left" ||
      this.directionToMove === "right"
    ) {
      this.movablePieces.sort((a, b) => {
        return a.x - b.x;
      });
    }
  },
  shuffle: function () {
    // loop below steps multiple times to shuffle sufficiently
    for (let i = 0; i < 100; i++) {
      // get all 6 moveable pieces based on blankspace's position
      const sixPieces = this.pieces.filter(
        (piece) =>
          piece.x === this.blankSpace.x || piece.y === this.blankSpace.y
      );

      // randomly click on 1 of the 6 pieces
      const randomNumber = getRandomInt();
      const squareToClick = document.querySelector(
        sixPieces[randomNumber].name
      );
      squareToClick.click();
    }
  },
  checkWinner: function () {
    console.log("entered");
    const boxes = [...document.querySelectorAll('[class^="box"]')];
    let isOrdered = true;
    for (let i = 0; i < boxes.length; i++) {
      console.log(this.pieces[i].order, i);
      if (this.pieces[i].order != i) {
        isOrdered = false;
      }
    }

    if (isOrdered) {
      alert("winner");
    }
  },
};

puzzle.initialize();

function getRandomInt(max = 6) {
  // will return 0, 1, 2, 3, 4 or 5
  return Math.floor(Math.random() * Math.floor(max));
}
