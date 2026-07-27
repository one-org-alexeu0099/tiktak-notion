"use strict";

const boardElement = document.querySelector("#board");
const statusElement = document.querySelector("#status");
const resetElement = document.querySelector("#reset");
const scoreResetElement = document.querySelector("#score-reset");
const scoreElements = {
  X: document.querySelector("#score-x"),
  O: document.querySelector("#score-o"),
  draw: document.querySelector("#score-draws")
};
const cells = Array.from(boardElement.querySelectorAll("[data-index]"));

let state = window.TTTGame.createGame();
let sessionScore = {X: 0, O: 0, draw: 0};

function isTerminal(status) {
  return status === "winX" || status === "winO" || status === "draw";
}

function recordCompletedGame(previousState, nextState) {
  if (previousState.status !== "playing" || !isTerminal(nextState.status)) return;

  if (nextState.status === "winX") sessionScore.X += 1;
  if (nextState.status === "winO") sessionScore.O += 1;
  if (nextState.status === "draw") sessionScore.draw += 1;
}

function render(nextState) {
  const isPlaying = nextState.status === "playing";
  const winningCells = new Set(nextState.winLine || []);

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
    cell.classList.toggle("cell--winner", winningCells.has(index));
    cell.setAttribute("aria-label", mark ? `Клетка ${index + 1}: ${mark}` : `Клетка ${index + 1}`);
  });

  scoreElements.X.textContent = String(sessionScore.X);
  scoreElements.O.textContent = String(sessionScore.O);
  scoreElements.draw.textContent = String(sessionScore.draw);
}

boardElement.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLButtonElement)) return;

  const previousState = state;
  state = window.TTTGame.move(state, Number(event.target.dataset.index));
  recordCompletedGame(previousState, state);
  render(state);
});

resetElement.addEventListener("click", () => {
  state = window.TTTGame.reset();
  render(state);
});

scoreResetElement.addEventListener("click", () => {
  sessionScore = {X: 0, O: 0, draw: 0};
  render(state);
});

render(state);
