"use strict";

const boardElement = document.querySelector("#board");
const statusElement = document.querySelector("#status");
const resetElement = document.querySelector("#reset");
const cells = Array.from(boardElement.querySelectorAll("[data-index]"));

let state = window.TTTGame.createGame();

function render(nextState) {
  const isPlaying = nextState.status === "playing";

  statusElement.textContent = nextState.status === "playing"
    ? `Ход: ${nextState.current}`
    : nextState.status === "draw"
      ? "Ничья"
      : `Победил: ${nextState.status === "winX" ? "X" : "O"}`;

  cells.forEach((cell) => {
    const index = Number(cell.dataset.index);
    const mark = nextState.board[index];

    cell.textContent = mark || "";
    cell.disabled = !isPlaying || Boolean(mark);
    cell.setAttribute("aria-label", mark ? `Клетка ${index + 1}: ${mark}` : `Клетка ${index + 1}`);
  });
}

boardElement.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLButtonElement)) return;

  state = window.TTTGame.move(state, Number(event.target.dataset.index));
  render(state);
});

resetElement.addEventListener("click", () => {
  state = window.TTTGame.reset();
  render(state);
});

render(state);
