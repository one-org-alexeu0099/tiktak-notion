"use strict";

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function createGame() {
  return {
    board: Array(9).fill(null),
    current: "X",
    status: "playing",
    winLine: null
  };
}

function isEmpty(cell) {
  return cell === null || cell === "";
}

function getOutcome(board) {
  for (const line of WINNING_LINES) {
    const [first, second, third] = line;
    const mark = board[first];

    if (!isEmpty(mark) && mark === board[second] && mark === board[third]) {
      return {
        status: mark === "X" ? "winX" : "winO",
        winLine: line.slice()
      };
    }
  }

  if (board.every((cell) => !isEmpty(cell))) {
    return {status: "draw", winLine: null};
  }

  return {status: "playing", winLine: null};
}

function getStatus(state) {
  return getOutcome(state.board).status;
}

function move(state, index) {
  const board = state.board.slice();
  const isValidIndex = Number.isInteger(index) && index >= 0 && index < board.length;

  if (!isValidIndex || state.status !== "playing" || !isEmpty(board[index])) {
    return {
      ...state,
      board
    };
  }

  board[index] = state.current;
  const outcome = getOutcome(board);

  return {
    board,
    current: outcome.status === "playing" ? (state.current === "X" ? "O" : "X") : state.current,
    status: outcome.status,
    winLine: outcome.winLine
  };
}

function reset() {
  return createGame();
}

const gameApi = {createGame, move, getStatus, reset};

if (typeof module !== "undefined" && module.exports) {
  module.exports = gameApi;
}
