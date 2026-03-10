let size = 4;
let solvedBoard = createSolvedBoard(size);
let board = [...solvedBoard];
let moves = 0;
let timerSeconds = 0;
let timerId = null;
let gameFinished = false;

const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const timerEl = document.getElementById("timer");
const messageEl = document.getElementById("message");
const shuffleBtn = document.getElementById("shuffle");
const resetBtn = document.getElementById("reset");
const sizeSelect = document.getElementById("size");

function createSolvedBoard(currentSize) {
  const total = currentSize * currentSize;
  return [...Array(total - 1).keys()].map((n) => n + 1).concat(0);
}

function startTimer() {
  if (timerId) return;
  timerId = setInterval(() => {
    timerSeconds += 1;
    timerEl.textContent = formatTime(timerSeconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function renderBoard() {
  boardEl.innerHTML = "";
  boardEl.style.setProperty("--size", String(size));

  board.forEach((value, index) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";
    tile.setAttribute("role", "gridcell");

    if (value === 0) {
      tile.classList.add("tile--empty");
      tile.disabled = true;
      tile.setAttribute("aria-label", "空きマス");
    } else {
      tile.textContent = value;
      tile.setAttribute("aria-label", `${value}番タイル`);
      tile.addEventListener("click", () => onTileClick(index));
    }

    boardEl.appendChild(tile);
  });

  movesEl.textContent = moves;
}

function getAdjacentIndexes(emptyIndex) {
  const adjacent = [];
  const row = Math.floor(emptyIndex / size);
  const col = emptyIndex % size;

  if (row > 0) adjacent.push(emptyIndex - size);
  if (row < size - 1) adjacent.push(emptyIndex + size);
  if (col > 0) adjacent.push(emptyIndex - 1);
  if (col < size - 1) adjacent.push(emptyIndex + 1);

  return adjacent;
}

function onTileClick(index) {
  if (gameFinished) return;

  const emptyIndex = board.indexOf(0);
  const movable = getAdjacentIndexes(emptyIndex);

  if (!movable.includes(index)) return;

  if (moves === 0) {
    startTimer();
  }

  [board[index], board[emptyIndex]] = [board[emptyIndex], board[index]];
  moves += 1;
  renderBoard();

  if (isSolved(board)) {
    gameFinished = true;
    stopTimer();
    messageEl.textContent = `クリア！ 手数: ${moves} / 時間: ${formatTime(timerSeconds)}`;
  }
}

function isSolved(currentBoard) {
  return currentBoard.every((value, index) => value === solvedBoard[index]);
}

function countInversions(arr) {
  const nums = arr.filter((n) => n !== 0);
  let count = 0;

  for (let i = 0; i < nums.length; i += 1) {
    for (let j = i + 1; j < nums.length; j += 1) {
      if (nums[i] > nums[j]) {
        count += 1;
      }
    }
  }

  return count;
}

function isSolvable(arr) {
  const inversions = countInversions(arr);

  if (size % 2 !== 0) {
    return inversions % 2 === 0;
  }

  const emptyIndex = arr.indexOf(0);
  const emptyRowFromBottom = size - Math.floor(emptyIndex / size);

  if (emptyRowFromBottom % 2 === 0) {
    return inversions % 2 !== 0;
  }

  return inversions % 2 === 0;
}

function createShuffledBoard() {
  const shuffled = [...solvedBoard];

  do {
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } while (!isSolvable(shuffled) || isSolved(shuffled));

  return shuffled;
}

function startNewGame() {
  board = createShuffledBoard();
  moves = 0;
  timerSeconds = 0;
  gameFinished = false;
  timerEl.textContent = "00:00";
  messageEl.textContent = "";
  stopTimer();
  renderBoard();
}

function resetGame() {
  board = [...solvedBoard];
  moves = 0;
  timerSeconds = 0;
  gameFinished = false;
  timerEl.textContent = "00:00";
  messageEl.textContent = "初期状態に戻しました";
  stopTimer();
  renderBoard();
}

function changeBoardSize() {
  size = Number(sizeSelect.value);
  solvedBoard = createSolvedBoard(size);
  board = [...solvedBoard];
  moves = 0;
  timerSeconds = 0;
  gameFinished = false;
  timerEl.textContent = "00:00";
  messageEl.textContent = `${size}×${size}盤に切り替えました`;
  stopTimer();
  renderBoard();
}

shuffleBtn.addEventListener("click", startNewGame);
resetBtn.addEventListener("click", resetGame);
sizeSelect.addEventListener("change", changeBoardSize);

resetGame();
