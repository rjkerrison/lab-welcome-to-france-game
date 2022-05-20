class GameBoard {
  constructor(width, height) {
    // "this" refers to the current board
    this.width = width
    this.height = height
    this.element = document.querySelector('.grid')
    this.cells = this._createCells()
  }
  _createCells() {
    const cells = []
    for (let i = 0; i < this.width * this.height; i++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      cell.dataset.index = i
      this.element.appendChild(cell)
      cells.push(cell)
    }
    return cells
  }
}

// here, we create a board based on the class
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
  constructor(className, dependencies = []) {
    this.className = className
    this.cell = null
    this.isCollected = false
    this.dependencies = dependencies
  }
  hide() {
    if (!this.cell) {
      return
    }
    this.cell.classList.remove(this.className)
  }
  collect() {
    const unmatchedDependencies = this.dependencies.filter(
      (x) => !x.isCollected
    )
    if (unmatchedDependencies.length) {
      const message = unmatchedDependencies.map((x) => x.className).join(', ')
      alert(`You must collect ${message} first!`)
      return
    }

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

collectibles[0].dependencies = [collectibles[4], collectibles[5]]
collectibles[1].dependencies = [collectibles[4]]
collectibles[3].dependencies = [collectibles[2]]
collectibles[5].dependencies = [collectibles[1]]

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

class Timer {
  constructor(endCallback, countdownSeconds = 120) {
    this.startTime = null
    this.isStarted = false
    this.element = document.querySelector('#timer')
    this.countdownSeconds = countdownSeconds
    this.endCallback = endCallback
  }
  start() {
    this.startTime = Date.now()
    this.isStarted = true
    this.display()
  }
  stop() {
    this.isStarted = false
  }
  getRemaining() {
    const elapsedMilliseconds = Date.now() - this.startTime
    const remainingMilliseconds =
      this.countdownSeconds * 1000 - elapsedMilliseconds

    if (remainingMilliseconds < 0) {
      this.stop()
      this.endCallback()
    }

    return new Date(remainingMilliseconds)
  }
  display() {
    if (!this.isStarted) {
      return
    }

    const remaining = this.getRemaining()
    const paddedMinutes = remaining.getMinutes().toString().padStart(2, '0')
    const paddedSeconds = remaining.getSeconds().toString().padStart(2, '0')
    this.element.textContent = `${paddedMinutes}:${paddedSeconds}`

    requestAnimationFrame(() => this.display())
  }
}

const game = {
  isStarted: false,
  isWon: false,
  isLost: false,
  winAudio: document.querySelector('audio#anthem'),
  timer: new Timer(() => game.lose()),
  lose() {
    this.isLost = true
    this.isStarted = false
    this.timer.stop()
    alert('You lost!')
  },
  win() {
    this.isWon = true
    this.isStarted = false
    this.winAudio.play()
    this.timer.stop()
    alert('You won!')
  },
  start() {
    collectibles.forEach((collectible) => collectible.hide())
    distributeCollectibles()
    inventory.clear()
    player.show()
    this.isStarted = true
    this.winAudio.currentTime = 0
    this.winAudio.pause()
    this.timer.start()
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
