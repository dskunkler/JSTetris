document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  const height = 10;

  // Tetrominoes
  // Tutorial used width here, but I find it to be confusing as it actually is setting the column depth aka the height of the tetromino piece. I actually don't think it makes things nay more clear, so I stopped using it. May clean up later, or revert to height if it comes up later.

  //TODO(Kunkler) :  Do we want to keep height?

  // L Tetromino
  const lTetromino = [
    [1, height + 1, height * 2 + 1, 2],
    [height, height + 1, height + 2, height * 2 + 2],
    [1, height + 1, height * 2 + 1, height * 2],
    [height, height * 2, height * 2 + 1, height * 2 + 2],
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
    current.forEach(index => {
      squares[currentPosition + index].classList.add("tetromino");
      // console.log(currentPosition, index);
    });
  }

  // Undraw Tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove("tetromino");
    });
  }

  // Make the teromino move down every second
  timerId = setInterval(moveDown, 1000);

  // Keycode Events
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    }
  }
  document.addEventListener("keyup", control);

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
      current.some(index =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      // console.log(index);
      current.forEach(index =>
        squares[currentPosition + index].classList.add("taken")
      );
      // Start a new Tetromino falling
      random = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
    }
  }

  // Assign left boundary of the grid
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      index => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;

    if (
      current.some(index =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }
});
