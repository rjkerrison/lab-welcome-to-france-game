class GameBoard {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.element = null
    this.cells = this._createCells()
  }
  _createCells() {
    // iteration 1
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
  },
  clear() {
    // iteration 3 (reset behaviour)
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
  }
  collect() {
    // iteration 4
  }
  display() {
    // iteration 2
  }
}

const collectibles = [
  'carte-vitale',
  'titre-de-sejour',
  'sim-card',
  'compte-bancaire',
].map((c) => new Collectible(c))

function distributeCollectibles() {
  // iteration 2
}

function getRandomUnoccupiedCell() {
  // iteration 3
}

const player = {
  className: 'player',
  cell: getRandomUnoccupiedCell(),
  show() {
    // iteration 3
  },
  hide() {
    // iteration 3
  },
  move(direction) {
    // iteration 3
  },
  canMove(direction) {
    // hint for iteration 3: make move behaviour conditional
  },
  _detectCollisions() {
    // iteration 4
    // how do we detect collisions with items
    // when do we call this?
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
  },
  start() {
    // iteration 2
    // distribute the items
    // iteration 3
    // show the player
    // iteration 4
    // reset the inventory
    // iteration 5
    // reset the music
  },
}

const startButton = document.querySelector('button#start')
startButton.addEventListener('click', () => {
  // iteration 2
  // start the game
})

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
