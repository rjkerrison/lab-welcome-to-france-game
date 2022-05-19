class GameBoard {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.element = document.querySelector('.grid')
    this.cells = this._createCells()
  }
  _createCells() {
    const cells = []
    for (let i = 0; i < 100; i++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      cell.dataset.index = i
      this.element.appendChild(cell)
      cells.push(cell)
    }
    return cells
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
  add() {
    const div = document.createElement('div')
    div.classList.add('item')
    this.element.appendChild(div)
    return div
  },
  clear() {
    this.element.innerHTML = ''
  },
}

class Collectible {
  constructor(className) {
    this.className = className
    this.cell = null
    this.isCollected = false
  }
  hide() {
    if (!this.cell) {
      return
    }
    this.cell.classList.remove(this.className)
  }
  collect() {
    this.hide()
    this.cell = inventory.add()
    this.isCollected = true
    this.display()
  }
  display() {
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
  const cells = getRandomSelection(collectibles.length, board.cells)
  collectibles.forEach((collectible, i) => {
    collectible.cell = cells[i]
    collectible.display()
    collectible.isCollected = false
  })
}

function getRandomUnoccupiedCell() {
  const occupiedCells = collectibles.map((x) => x.cell)
  const unoccupiedCells = board.cells.filter((x) => !occupiedCells.includes(x))
  const cells = getRandomSelection(1, unoccupiedCells)
  console.log('selected', cells, occupiedCells)
  return cells[0]
}

const player = {
  className: 'player',
  cell: getRandomUnoccupiedCell(),
  show() {
    this.cell.classList.add(this.className)
  },
  hide() {
    this.cell.classList.remove(this.className)
  },
  move(direction) {
    this.hide()
    this._move(direction)
    this._detectCollisions()
    this.show()
  },
  _move(direction) {
    if (this.canMove(direction)) {
      const nextIndex = this._newCellIndex(direction)
      const nextCell = board.cells[nextIndex]
      this.cell = nextCell
    }
  },
  _newCellIndex(direction) {
    const currentIndex = parseInt(this.cell.dataset.index)
    switch (direction) {
      case 'left':
        return currentIndex - 1
      case 'right':
        return currentIndex + 1
      case 'up':
        return currentIndex - board.width
      case 'down':
        return currentIndex + board.width
    }
  },
  canMove(direction) {
    switch (direction) {
      case 'left':
        return this.cell.dataset.index % board.width !== 0
      case 'right':
        return this.cell.dataset.index % board.width !== board.width - 1
      case 'up':
        return Math.floor(this.cell.dataset.index / board.width) !== 0
      case 'down':
        return (
          Math.floor(this.cell.dataset.index / board.width) !== board.height - 1
        )
    }
  },
  _detectCollisions() {
    const foundCollectible = collectibles.find((x) => x.cell === this.cell)
    if (foundCollectible) {
      console.log('FOUND IT', foundCollectible)
      foundCollectible.collect()
      if (collectibles.every((x) => x.isCollected)) {
        game.win()
      }
    }
  },
}

const game = {
  isStarted: false,
  isWon: false,
  isLost: false,
  winAudio: document.querySelector('audio#anthem'),
  win() {
    this.isWon = true
    this.isStarted = false
    this.winAudio.play()
    inventory.clear()
    alert('You won!')
  },
  start() {
    collectibles.forEach((collectible) => collectible.hide())
    distributeCollectibles()
    player.show()
    this.isStarted = true
    this.winAudio.currentTime = 0
    this.winAudio.pause()
  },
}

const startButton = document.querySelector('button#start')
startButton.addEventListener('click', () => {
  if (game.isStarted) {
    return
  }
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
