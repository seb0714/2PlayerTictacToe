let playerSymbol;
let aiSymbol;
let turn;
let countdownTimer = null;

const winCombos = [
  ["top1", "top2", "top3"],
  ["mid1", "mid2", "mid3"],
  ["bot1", "bot2", "bot3"],
  ["top1", "mid1", "bot1"],
  ["top2", "mid2", "bot2"],
  ["top3", "mid3", "bot3"],
  ["top1", "mid2", "bot3"],
  ["top3", "mid2", "bot1"],
];

function start(e) {
  clearCountdown();
  resetBoard();
  hideMessage();

  const choicesContainer = document.getElementById("choicesContainer");
  const h1 = document.getElementById("playerText");
  const table = document.getElementById("table");

  playerSymbol = e.target.textContent.trim();
  aiSymbol = playerSymbol === "X" ? "O" : "X";
  turn = "player";

  choicesContainer.style.display = "none";
  h1.style.display = "none";
  table.style.display = "grid";
}

function addValue(e) {
  const cell = e.target;
  if (cell.textContent.trim() !== "" || turn !== "player") return;

  cell.textContent = playerSymbol;
  turn = "ai";
  if (checkEnd()) return;
  setTimeout(() => {
    aiMove();
    if (checkEnd()) return;
    turn = "player";
  }, 300);
}

function getBoardState() {
  const state = {};
  document.querySelectorAll(".cell").forEach(c => {
    state[c.id] = c.textContent.trim();
  });
  return state;
}

function checkWinner(state) {
  for (const combo of winCombos) {
    const [a, b, c] = combo;
    if (
      state[a] &&
      state[a] === state[b] &&
      state[a] === state[c]
    ) {
      return state[a];
    }
  }
  return null;
}

function isFull(state) {
  return Object.values(state).every(v => v !== "");
}

function checkEnd() {
  const state = getBoardState();
  const winner = checkWinner(state);
  if (winner) {
    const playerNum = winner === playerSymbol ? 1 : 2;
    showMessage(
      `Player number ${playerNum} won! Clearing the table in 5 seconds`
    );
    startCountdown(5, winner);
    return true;
  }
  if (isFull(state)) {
    showMessage(
      `No one wins, clearing the table in 5 seconds`
    );
    startCountdown(5, null);
    return true;
  }
  return false;
}

function startCountdown(seconds, winner) {
  let remaining = seconds;
  clearCountdown();
  countdownTimer = setInterval(() => {
    remaining--;
    if (winner) {
      const playerNum = winner === playerSymbol ? 1 : 2;
      showMessage(
        `Player number ${playerNum} won! Clearing the table in ${remaining} seconds`
      );
    } else {
      showMessage(
        `No one wins, clearing the table in ${remaining} seconds`
      );
    }
    if (remaining <= 0) {
      clearCountdown();
      resetBoard();
      hideMessage();
      turn = "player";
      restoreChoices();
    }
  }, 1000);
}

function clearCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

function resetBoard() {
  document.querySelectorAll(".cell").forEach(c => {
    c.textContent = "";
  });
}

function showMessage(text) {
  let msg = document.getElementById("statusMessage");
  if (!msg) {
    msg = document.createElement("div");
    msg.id = "statusMessage";
    Object.assign(msg.style, {
      position: "fixed",
      bottom: "10px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(255,255,255,0.08)",
      padding: "14px 24px",
      borderRadius: "10px",
      fontFamily: "system-ui, sans-serif",
      fontSize: "1.4rem",
      fontWeight: "600",
      color: "#fff",
      backdropFilter: "blur(6px)",
      zIndex: "999",
      maxWidth: "90%",
      textAlign: "center",
    });
    document.body.appendChild(msg);
  }
  msg.textContent = text;
  msg.style.display = "block";
}

function hideMessage() {
  const msg = document.getElementById("statusMessage");
  if (msg) msg.style.display = "none";
}

function restoreChoices() {
  const choicesContainer = document.getElementById("choicesContainer");
  const h1 = document.getElementById("playerText");
  const table = document.getElementById("table");

  choicesContainer.style.display = "flex";
  h1.style.display = "block";
  table.style.display = "none";
}

// AI using minimax
function aiMove() {
  const state = getBoardState();
  const best = minimax(state, aiSymbol);
  if (best.move) {
    document.getElementById(best.move).textContent = aiSymbol;
  }
}

function minimax(state, current) {
  const winner = checkWinner(state);
  if (winner === aiSymbol) return { score: 10 };
  if (winner === playerSymbol) return { score: -10 };
  if (isFull(state)) return { score: 0 };

  const moves = [];

  for (const cellId in state) {
    if (state[cellId] === "") {
      const copy = { ...state };
      copy[cellId] = current;
      const result = minimax(
        copy,
        current === aiSymbol ? playerSymbol : aiSymbol
      );
      moves.push({
        move: cellId,
        score: result.score,
      });
    }
  }

  let bestMove;
  if (current === aiSymbol) {
    let max = -Infinity;
    for (const m of moves) {
      if (m.score > max) {
        max = m.score;
        bestMove = m;
      }
    }
  } else {
    let min = Infinity;
    for (const m of moves) {
      if (m.score < min) {
        min = m.score;
        bestMove = m;
      }
    }
  }

  return bestMove || { score: 0 };
}

// listeners
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".cell").forEach(c => c.addEventListener("click", addValue));
});