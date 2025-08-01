let currentPlayer = 1;
let gameOver = false;
const currentPlayerDisplay = document.getElementById("playerMessage");

const wins = [
  ['topContainer1','topContainer2','topContainer3'],
  ['midContainer1','midContainer2','midContainer3'],
  ['bottomContainer1','bottomContainer2','bottomContainer3'],
  ['topContainer1','midContainer1','bottomContainer1'],
  ['topContainer2','midContainer2','bottomContainer2'],
  ['topContainer3','midContainer3','bottomContainer3'],
  ['topContainer1','midContainer2','bottomContainer3'],
  ['topContainer3','midContainer2','bottomContainer1'],
];

const allIds = [
  'topContainer1','topContainer2','topContainer3',
  'midContainer1','midContainer2','midContainer3',
  'bottomContainer1','bottomContainer2','bottomContainer3'
];

function hasValue(target) {
  return target.textContent !== "";
}

function boardFull() {
  return allIds.every(id => {
    const el = document.getElementById(id);
    return el && el.textContent !== "";
  });
}

function putValue(e) {
  if (gameOver) return;

  const chosenContainer = e.currentTarget;
  if (hasValue(chosenContainer)) return;

  if (currentPlayer === 1) {
    chosenContainer.textContent = "X";
    currentPlayerDisplay.textContent = "It's Player 2's turn! (O)";
    currentPlayer = 2;
  } else {
    chosenContainer.textContent = "O";
    currentPlayerDisplay.textContent = "It's Player 1's turn! (X)";
    currentPlayer = 1;
  }

  const winnerCombo = checkWin();
  if (winnerCombo) {
    const lastSymbol = chosenContainer.textContent;
    currentPlayerDisplay.textContent = `Player ${lastSymbol === 'X' ? 1 : 2} wins!`;
    endGameCleanup();
    return;
  }

  if (boardFull()) {
    currentPlayerDisplay.textContent = "No one wins, cleaning the board in 3s";
    endGameCleanup();
  }
}

function checkWin() {
  const state = {};
  wins.flat().forEach(id => {
    const el = document.getElementById(id);
    state[id] = el ? el.textContent : "";
  });

  return wins.find(combo => {
    const a = state[combo[0]];
    if (!a) return false;
    return combo.every(id => state[id] === a);
  });
}

function endGameCleanup() {
  gameOver = true;
  allIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('locked');
  });

  let timer = 3;
  currentPlayerDisplay.textContent = `No one wins, cleaning the board in ${timer}s`;
  
  const countdown = setInterval(() => {
    timer--;
    if (timer > 0) {
      currentPlayerDisplay.textContent = `No one wins, cleaning the board in ${timer}s`;
    } else {
      clearInterval(countdown);
      resetBoard();
    }
  }, 1000);
}

function resetBoard() {
  allIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = "";
      el.classList.remove('locked');
    }
  });
  currentPlayer = 1;
  gameOver = false;
  currentPlayerDisplay.textContent = "It's Player 1's turn! (X)";
}

// attach listeners
allIds.forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', putValue);
});
