# Lab: Welcome to France Game

This is a lab for a Web Development course.
This lab gives an opportunity to practice grid movement and collision detection ideas, and to build a small game.

Your goal is to create a game where the hero has to collect
all of the required _papiers_ before time runs out.

The images and audio have been provided for you,
as has a starting page.

## Iteration 1: Populate the Grid

There is already a `<div class="grid">` in `index.html`.

In `js/main.js`, get a reference to this element.
Add to it as many cells as required to make a 10 by 10 grid.

Each cell should have the class `'cell'`. Styling has been provided in `styles/main.css`.

## Iteration 2: Display the collectibles

When the game starts, display the collectibles in randomly chosen positions.

In order to avoid two collectibles in the same box, you can use an algorithm which chooses multiple options randomly.

```js
function getRandomSelection(n, array) {
  const cloned = Array.from(array)
  const shuffled = cloned.sort(() => 0.5 - Math.random())
  const selected = shuffled.slice(0, n)
  return selected
}
```

## Iteration 3: Display the player

Show the player in the starting position.

When the user presses an arrow , move the player in the corresponding direction.

The player cannot leave the boundaries of the board,
and can only move up, down, left, or right.

Before the game has started, the player should not be able to move.
Control this by having a conditional which checks that the game has started.

## Iteration 4: Collect the items

When the player enters a cell where there is an item,
that item should be collected.

Once the player has collected all of the items, the player has won and the game is over.

## Iteration 5: Play _La Marseillaise_ on winning

When the user wins, play _La Marseillaise_ to congratulate them.

## Iteration 6: Impose a time limit

Add a clock which counts down.
When the clock reaches zero, the player has lost.
If the player wins before the clock hits zero, stop the clock.
