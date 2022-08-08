class GameBoard {
  constructor(width, height) {
    this.width = width
    this.height = height
    // iteration 1
    this.element = document.querySelector('.grid')
    this.cells = this._createCells()
  }
  _createCells() {
    // iteration 1
    const createdCells = []

    const cellCount = this.width * this.height

    for (let i = 0; i < cellCount; i++) {
      // create a new cell
      const cell = document.createElement('div')
      cell.classList.add('cell')
      cell.dataset.index = i

      // put it in the DOM inside the grid element
      this.element.append(cell)
      // store it in our createdCells array
      createdCells.push(cell)
    }
    // return array of created cells
    return createdCells
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
  element: document.querySelector('.inventory'),
  collectedItems: [],
  add(item) {
    // iteration 3
    this.collectedItems.push(item)
    this.display()
  },
  clear() {
    // iteration 3 (reset behaviour)
    this.collectedItems = []
    this.display()
  },
  display() {
    this.element.innerHTML = ''

    for (const item of this.collectedItems) {
      const inventoryItemElement = document.createElement('div')
      inventoryItemElement.classList.add(item, 'item')
      this.element.append(inventoryItemElement)
    }
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
    this.cell.classList.remove(this.className)
  }
  collect() {
    // iteration 4
    this.hide()
    this.isCollected = true
    // prevent accidental matches
    this.cell = null
    inventory.add(this.className)
  }
  display() {
    // iteration 2
    this.cell.classList.add(this.className)
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
  const randomCells = getRandomSelection(collectibles.length, board.cells)

  for (let i = 0; i < collectibles.length; i++) {
    // assign one cell to each collectible
    collectibles[i].cell = randomCells[i]
    collectibles[i].display()
  }
}

function getRandomUnoccupiedCell() {
  // iteration 3
  const unoccupiedCells = board.cells.filter((cell) => {
    // occupied means that one of the collectibles is there
    const isOccupied = collectibles.some(
      (collectible) => collectible.cell === cell
    )
    // return true if unoccupied
    // return false if occupied
    // we want to return true if not occupied
    return !isOccupied
  })

  return getRandomSelection(1, unoccupiedCells)[0]
}

const player = {
  className: 'player',
  cell: getRandomUnoccupiedCell(),
  show() {
    // iteration 3
    this.cell.classList.add(this.className)
  },
  hide() {
    // iteration 3
    this.cell.classList.remove(this.className)
  },
  move(direction) {
    // iteration 3
    if (!this.canMove(direction)) {
      return
    }

    this.hide()

    const currentIndex = parseInt(this.cell.dataset.index)
    let newIndex

    switch (direction) {
      case 'up':
        newIndex = currentIndex - board.width
        break
      case 'down':
        newIndex = currentIndex + board.width
        break
      case 'right':
        newIndex = currentIndex + 1
        break
      case 'left':
        newIndex = currentIndex - 1
        break
    }
    this.cell = board.cells[newIndex]
    this.show()

    // after moving, check for collisions
    this._detectCollisions()
  },
  canMove(direction) {
    // hint for iteration 3: make move behaviour conditional
    const currentIndex = parseInt(this.cell.dataset.index)
    const column = currentIndex % board.width

    switch (direction) {
      case 'up':
        return currentIndex >= board.width
      case 'down':
        const boardSize = board.width * board.height
        return currentIndex <= boardSize - board.width
      case 'right':
        return column < board.width - 1
      case 'left':
        return column > 0
    }
  },
  _detectCollisions() {
    // iteration 4
    // how do we detect collisions with items
    const foundCollectible = collectibles.find(
      (collectible) => collectible.cell === this.cell
    )
    if (foundCollectible) {
      foundCollectible.collect()
    }
    // when do we call this?
    // answer: at the end of this.move()
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
    // Can't start two games at once
    if (game.isStarted) {
      return
    }
    // iteration 2
    // start the game
    game.isStarted = true
    // iteration 2
    // distribute the items
    // call my distribute collectibles function
    distributeCollectibles()
    // iteration 3
    // show the player
    player.show()
    // iteration 4
    // reset the inventory
    // iteration 5
    // reset the music
  },
}

const startButton = document.querySelector('button#start')
startButton.addEventListener('click', () => {
  game.start()
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
