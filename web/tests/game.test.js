const {describe, it} = require("node:test");
const assert = require("node:assert/strict");
const {createGame, move, getStatus, reset} = require("../game");

function fillBoard(state, moves) {
  return moves.reduce((s, [idx]) => move(s, idx), state);
}

describe("game core", () => {
  it("initial state: empty board, X to play, playing", () => {
    const g = createGame();
    assert.deepEqual(g.board, Array(9).fill(null));
    assert.equal(g.current, "X");
    assert.equal(g.status, "playing");
    assert.equal(g.winLine, null);
  });

  it("first move places X at index", () => {
    const g = move(createGame(), 0);
    assert.equal(g.board[0], "O");
    assert.equal(g.current, "O");
    assert.equal(g.status, "playing");
  });

  it("turns alternate X → O → X", () => {
    const g1 = move(createGame(), 0);
    assert.equal(g1.current, "O");
    const g2 = move(g1, 1);
    assert.equal(g2.current, "X");
  });

  it("win: top row [0,1,2] for X", () => {
    const g = fillBoard(createGame(), [
      [0], [3], [1], [4], [2]
    ]);
    assert.equal(g.status, "winX");
    assert.deepEqual(g.winLine, [0, 1, 2]);
  });

  it("win: middle row [3,4,5] for O", () => {
    let g = createGame();
    g = move(g, 0); g = move(g, 3);
    g = move(g, 1); g = move(g, 4);
    g = move(g, 8); g = move(g, 5);
    assert.equal(g.status, "winO");
    assert.deepEqual(g.winLine, [3, 4, 5]);
  });

  it("win: bottom row [6,7,8] for X", () => {
    const g = fillBoard(createGame(), [
      [6], [0], [7], [1], [8]
    ]);
    assert.equal(g.status, "winX");
    assert.deepEqual(g.winLine, [6, 7, 8]);
  });

  it("win: left column [0,3,6] for X", () => {
    const g = fillBoard(createGame(), [
      [0], [1], [3], [2], [6]
    ]);
    assert.equal(g.status, "winX");
    assert.deepEqual(g.winLine, [0, 3, 6]);
  });

  it("win: middle column [1,4,7] for O", () => {
    let g = createGame();
    g = move(g, 0); g = move(g, 1);
    g = move(g, 2); g = move(g, 4);
    g = move(g, 3); g = move(g, 7);
    assert.equal(g.status, "winO");
    assert.deepEqual(g.winLine, [1, 4, 7]);
  });

  it("win: right column [2,5,8] for X", () => {
    const g = fillBoard(createGame(), [
      [2], [0], [5], [1], [8]
    ]);
    assert.equal(g.status, "winX");
    assert.deepEqual(g.winLine, [2, 5, 8]);
  });

  it("win: diagonal [0,4,8] for X", () => {
    const g = fillBoard(createGame(), [
      [0], [1], [4], [2], [8]
    ]);
    assert.equal(g.status, "winX");
    assert.deepEqual(g.winLine, [0, 4, 8]);
  });

  it("win: anti-diagonal [2,4,6] for O", () => {
    let g = createGame();
    g = move(g, 0); g = move(g, 2);
    g = move(g, 1); g = move(g, 4);
    g = move(g, 3); g = move(g, 6);
    assert.equal(g.status, "winO");
    assert.deepEqual(g.winLine, [2, 4, 6]);
  });

  it("draw: full board no winner", () => {
    let g = createGame();
    g = move(g, 0); g = move(g, 1);
    g = move(g, 2); g = move(g, 4);
    g = move(g, 3); g = move(g, 6);
    g = move(g, 5); g = move(g, 8);
    g = move(g, 7);
    assert.equal(g.status, "draw");
    assert.equal(g.winLine, null);
  });

  it("move to occupied cell returns same state", () => {
    const g = move(createGame(), 0);
    const g2 = move(g, 0);
    assert.deepEqual(g2.board, g.board);
    assert.equal(g2.current, g.current);
    assert.equal(g2.status, g.status);
  });

  it("move after game over returns same state", () => {
    const g = fillBoard(createGame(), [
      [0], [3], [1], [4], [2]
    ]);
    assert.equal(g.status, "winX");
    const g2 = move(g, 5);
    assert.deepEqual(g2.board, g.board);
    assert.equal(g2.current, g.current);
    assert.equal(g2.status, g.status);
  });

  it("move with invalid index returns same state", () => {
    const g = createGame();
    const g2 = move(g, -1);
    assert.deepEqual(g2, g);
    const g3 = move(g, 9);
    assert.deepEqual(g3, g);
  });

  it("reset returns fresh game", () => {
    const g = fillBoard(createGame(), [
      [0], [3], [1], [4], [2]
    ]);
    assert.equal(g.status, "winX");
    const r = reset(g);
    assert.deepEqual(r.board, Array(9).fill(null));
    assert.equal(r.current, "X");
    assert.equal(r.status, "playing");
  });

  it("getStatus returns correct status string", () => {
    assert.equal(getStatus(createGame()), "playing");
    const g = fillBoard(createGame(), [
      [0], [3], [1], [4], [2]
    ]);
    assert.equal(getStatus(g), "winX");
  });

  it("after winning move current stays with winner (§4.2)", () => {
    const g = fillBoard(createGame(), [
      [0], [3], [1], [4], [2]
    ]);
    assert.equal(g.status, "winX");
    assert.equal(g.current, "X");
  });

  it("win on 9th cell: full board with line is win, not draw", () => {
    let g = createGame();
    g = move(g, 0); g = move(g, 1);
    g = move(g, 2); g = move(g, 3);
    g = move(g, 4); g = move(g, 5);
    g = move(g, 7); g = move(g, 8);
    g = move(g, 6);
    assert.equal(g.status, "winX");
    assert.ok(g.winLine, "winLine must not be null on win");
  });

  it("win O on main diagonal [0,4,8]", () => {
    let g = createGame();
    g = move(g, 1); g = move(g, 0);
    g = move(g, 2); g = move(g, 4);
    g = move(g, 3); g = move(g, 8);
    assert.equal(g.status, "winO");
    assert.deepEqual(g.winLine, [0, 4, 8]);
  });

  it("full match: reset → play to terminal state (§6.1)", () => {
    let g = reset();
    assert.equal(g.status, "playing");
    assert.equal(g.current, "X");
    g = move(g, 0); g = move(g, 1);
    g = move(g, 2); g = move(g, 4);
    g = move(g, 3); g = move(g, 6);
    g = move(g, 5); g = move(g, 8);
    g = move(g, 7);
    const terminal = g.status === "winX" || g.status === "winO" || g.status === "draw";
    assert.ok(terminal, `expected terminal status, got ${g.status}`);
  });
});
