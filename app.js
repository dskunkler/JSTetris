document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  const width = 10;
  const height = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = ['orange', 'red', 'purple', 'green', 'turquoise', 'brown'];

  // Tetrominoes
  // Tutorial used width here, but I find it to be confusing as it actually is setting the column depth aka the height of the tetromino piece. I actually don't think it makes things any more clear, so I stopped using it. May clean up later, or revert to height if it comes up later.

  // L Tetromino
  const lTetromino = [
    [1, height + 1, height * 2 + 1, 2],
    [height, height + 1, height + 2, height * 2 + 2],
    [1, height + 1, height * 2 + 1, height * 2],
    [height, height * 2, height * 2 + 1, height * 2 + 2],
  ];

  // Reverse L
  const rlTetromino = [
    [0, 1, 11, 21],
    [20, 10, 11, 12],
    [1, 11, 21, 22],
    [10, 11, 12, 2],
  ];

  // Z Tetromino
  const zTetromino = [
    [height * 2, height * 1 + 1, height * 2 + 1, height * 1 + 2],
    [0, 10, 11, 21],
    [20, 21, 11, 12],
    [0, 10, 11, 21],
  ];

  // T Tetromino
  const tTetromino = [
    [1, 10, 11, 12],
    [1, 11, 12, 21],
    [10, 11, 12, 21],
    [1, 10, 11, 21],
  ];

  // Block Tetromino
  const oTetromino = [
    [0, 1, 10, 11],
    [0, 1, 10, 11],
    [0, 1, 10, 11],
    [0, 1, 10, 11],
  ];

  // I tetromino
  const iTetromino = [
    [1, 11, 21, 31],
    [10, 11, 12, 13],
    [1, 11, 21, 31],
    [10, 11, 12, 13],
  ];

  const theTetrominoes = [
    lTetromino,
    rlTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  // Randomly select a Tetromino and its first rotation.
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  // Draw the first rotation of a random Tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add('tetromino');
      // console.log(currentPosition, index);
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  // Undraw Tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove('tetromino');
      squares[currentPosition + index].style.backgroundColor = '';
    });
  }

  // Keycode Events
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 40) {
      movePieceDown();
    }
  }
  document.addEventListener('keydown', control);

  // Move down function
  function moveDown() {
    undraw();
    currentPosition += height;
    draw();
    freeze();
  }
  // Freeze function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains('taken')
      )
    ) {
      // console.log(index);
      current.forEach((index) =>
        squares[currentPosition + index].classList.add('taken')
      );
      // Start a new Tetromino falling
      random = nextRandom;
      console.log('random :', random);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      console.log('next random: ', nextRandom);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  // Assign left boundary of the grid and movement
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  // Assign the right boundary of the grid and movement
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    if (!isAtRightEdge) currentPosition += 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }
  // Downarrow moves piece down
  function movePieceDown() {
    // console.log("Moving down");
    undraw();
    currentPosition += height;
    draw();
    freeze();
  }

  // Tetromino Rotation
  function rotate() {
    undraw();
    currentRotation = (currentRotation + 1) % current.length;
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // Show up-next Tetromino in mini-grid
  const displaySquares = document.querySelectorAll('.mini-grid div');
  // console.log(displaySquares);
  const displayWidth = 4;
  let displayIndex = 0;

  // The tetrominos without Rotations (first position)
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
    [0, 1, displayWidth + 1, 2 * displayWidth + 1], // Reverse L
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
  ];

  // Display the shape in the mini-grid display
  function displayShape() {
    // remove tetromino from the grid
    displaySquares.forEach((square) => {
      square.classList.remove('tetromino');
      square.style.backgroundColor = '';
    });
    console.log('Upnext:', upNextTetrominoes[nextRandom]);
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add('tetromino');
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }
  // Add Functionality to start/pause
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });
  // Add Score function
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      if (row.every((index) => squares[index].classList.contains('taken'))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
          squares[index].style.backgroundColor = '';
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  // Game over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      scoreDisplay.innerHTML = 'end';
      clearInterval(timerId);
    }
  }
});
