class GameBoard {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.element = null
    this.cells = this._createCells()
  }
  _createCells() {
    // iteration 1
    this.element = document.querySelector(`.grid`);

    const cells = [];

    for (let i = 0; i < this.width * this.height; i++) {
      const cell = document.createElement(`div`);

      cell.classList.add(`cell`);
      cell.dataset.index = i

      cells.push(cell);

      cell.textContent = i; // ! to remove later
      this.element.appendChild(cell);
    }

    return cells;
  }
}

const board = new GameBoard(10, 10)

function fisherYatesShuffle(arr) {
  for (let i = arr.length; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = arr[j]
    arr[j] = arr[i - 1]
    arr[i - 1] = temp
  }
}

function getRandomSelection(n, array) {
  const cloned = Array.from(array)
  fisherYatesShuffle(cloned)
  const selected = cloned.slice(0, n)
  return selected
}

const inventory = {
  element: null,
  add() {
    // iteration 3
    if (!this.element) {
      this.element = document.querySelector(`.inventory`);
    }

    let collected = 0;
    this.clear();
    collectibles.forEach(collectible => {
      if (collectible.isCollected) {
        collected++;

        const collectibleDiv = document.createElement(`div`);

        collectibleDiv.classList.add(collectible.className);
        collectibleDiv.classList.add(`inventory`);
        collectibleDiv.classList.add(`item`);

        this.element.appendChild(collectibleDiv);
      }
    });

    if (collected === collectibles.length) {
      game.win();
    }
  },
  clear() {
    // iteration 3 (reset behaviour)
    if (!this.element) {
      this.element = document.querySelector(`.inventory`);
    }
    this.element.innerHTML = ``;
  },
}

class Collectible {
  constructor(className) {
    this.className = className
    this.cell = null
    this.isCollected = false
  }
  hide() {
    // reset behaviour
    this.cell.classList.remove(this.className);
  }
  collect() {
    // iteration 4
    this.isCollected = true;

    this.hide();
    inventory.add();
  }
  display() {
    // iteration 2
    this.cell.classList.add(this.className);
  }
}

const collectibles = [
  'carte-vitale',
  'titre-de-sejour',
  'sim-card',
  'compte-bancaire',
  'apartment',
  'job',
].map((c) => new Collectible(c))

function distributeCollectibles() {
  // iteration 2
  const randomlySelectedCells = getRandomSelection(collectibles.length, board.cells);

  collectibles.forEach((collectible, index) => {
    const cell = randomlySelectedCells[index];

    collectible.cell = cell;
    collectible.display();
  });
}

function getRandomUnoccupiedCell() {
  // iteration 3
  const unoccupiedCells = board.cells.filter(cell => cell.className === `cell`);

  return getRandomSelection(1, unoccupiedCells)[0];
}

const player = {
  className: 'player',
  cell: getRandomUnoccupiedCell(),
  show() {
    // iteration 3
    this.cell.classList.add(this.className);
  },
  hide() {
    // iteration 3
    this.cell.classList.remove(this.className);
  },
  move(direction) {
    // iteration 3
    if (!this.canMove(direction)) {
      return;
    }

    this.hide();
    const cellIndex = parseInt(this.cell.dataset.index);
    switch (direction) {
      case `up`:
        this.cell = board.cells[cellIndex - board.width];
        break;
      case `down`:
        this.cell = board.cells[cellIndex + board.width];
        break;
      case `left`:
        this.cell = board.cells[cellIndex - 1];
        break;
      case `right`:
        this.cell = board.cells[cellIndex + 1];
        break;
    }

    this.show();
    this._detectCollisions();
  },
  canMove(direction) {
    // hint for iteration 3: make move behaviour conditional
    const cellIndex = parseInt(this.cell.dataset.index);
    switch (direction) {
      case `up`:
        return cellIndex - board.width >= 0;
      case `down`:
        return cellIndex + board.width < board.width * board.height;
      case `left`:
        return cellIndex % board.width !== 0;
      case `right`:
        return (cellIndex + 1) % board.width !== 0;
    }
  },
  _detectCollisions() {
    // iteration 4
    // how do we detect collisions with items
    // when do we call this?
    if (this.cell.className !== `cell player`) {
      for (let i = 0; i < collectibles.length; i++) {
        if (
          collectibles[i].cell.dataset.index === this.cell.dataset.index
          &&
          !collectibles[i].isCollected
        ) {
          collectibles[i].collect();
          return;
        }
      }
    }
  },
}

const game = {
  isStarted: false,
  isWon: false,
  isLost: false,
  // iteration 5
  winAudio: null,
  win() {
    // iteration 4
    document.getElementById(`anthem`).play();

    startButton.addEventListener('click', () => {
      // iteration 2
      // start the game
      game.start();
    }, { once: true })
  },
  start() {
    // iteration 2
    // distribute the items
    distributeCollectibles();
    // iteration 3
    // show the player
    player.show();
    // iteration 4
    // reset the inventory
    inventory.clear();
    collectibles.forEach(c => { c.isCollected = false });
    // iteration 5
    // reset the music
    document.getElementById(`anthem`).pause();
    document.getElementById(`anthem`).currentTime = 0;

    this.isStarted = true;
  },
}

const startButton = document.querySelector('button#start')
startButton.addEventListener('click', () => {
  // iteration 2
  // start the game
  game.start();
}, { once: true })

document.addEventListener('keydown', (event) => {
  if (!game.isStarted) {
    return
  }

  switch (event.code) {
    case 'ArrowUp':
      player.move('up')
      break
    case 'ArrowDown':
      player.move('down')
      break
    case 'ArrowLeft':
      player.move('left')
      break
    case 'ArrowRight':
      player.move('right')
      break
  }
})
