let currentPlayer = 1; // 1 = X, 2 = O
let gameOver = false;

const display = document.getElementById("playerMessage");
const cells = Array.from(document.querySelectorAll(
  "#topContainer1,#topContainer2,#topContainer3," +
  "#midContainer1,#midContainer2,#midContainer3," +
  "#bottomContainer1,#bottomContainer2,#bottomContainer3"
));
const wins = [
  ["topContainer1","topContainer2","topContainer3"],
  ["midContainer1","midContainer2","midContainer3"],
  ["bottomContainer1","bottomContainer2","bottomContainer3"],
  ["topContainer1","midContainer1","bottomContainer1"],
  ["topContainer2","midContainer2","bottomContainer2"],
  ["topContainer3","midContainer3","bottomContainer3"],
  ["topContainer1","midContainer2","bottomContainer3"],
  ["topContainer3","midContainer2","bottomContainer1"],
];

const symbol = () => (currentPlayer === 1 ? "X" : "O");
const nextPlayer = () => (currentPlayer === 1 ? 2 : 1);

function updateDisplay(text) {
  if (display) display.textContent = text;
}

function checkWin() {
  const state = Object.fromEntries(
    cells.map(c => [c.id, c.textContent || ""])
  );
  return wins.find(combo => {
    const first = state[combo[0]];
    if (!first) return false;
    return combo.every(id => state[id] === first);
  });
}

function boardFull() {
  return cells.every(c => c.textContent);
}

function lockBoard() {
  cells.forEach(c => c.classList.add("locked"));
}

function unlockBoard() {
  cells.forEach(c => c.classList.remove("locked"));
}

function resetBoard() {
  cells.forEach(c => {
    c.textContent = "";
    c.classList.remove("locked");
  });
  currentPlayer = 1;
  gameOver = false;
  updateDisplay("It's Player 1's turn! (X)");
}

function endGame(winnerSymbol) {
  gameOver = true;
  lockBoard();
  const winnerText = winnerSymbol
    ? `Player ${winnerSymbol === "X" ? 1 : 2} wins!`
    : "No one wins";
  updateDisplay(winnerText + (winnerSymbol ? "" : ", cleaning the board in 3s"));
  if (!winnerSymbol) {
    let timer = 3;
    const countdown = setInterval(() => {
      timer--;
      if (timer > 0) {
        updateDisplay(`No one wins, cleaning the board in ${timer}s`);
      } else {
        clearInterval(countdown);
        resetBoard();
      }
    }, 1000);
  }
}

function handleClick(e) {
  if (gameOver) return;
  const cell = e.currentTarget;
  if (cell.textContent) return;

  cell.textContent = symbol();
  const winCombo = checkWin();
  if (winCombo) {
    endGame(symbol());
    return;
  }

  if (boardFull()) {
    endGame(null);
    return;
  }

  currentPlayer = nextPlayer();
  updateDisplay(`It's Player ${currentPlayer}'s turn! (${currentPlayer === 1 ? "X" : "O"})`);
}

// init
cells.forEach(c => c.addEventListener("click", handleClick));
updateDisplay("It's Player 1's turn! (X)");