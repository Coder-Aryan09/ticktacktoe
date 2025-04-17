const cells = document.querySelectorAll('[data-cell]');
const gameStatus = document.querySelector('.game-status');
const restartButton = document.getElementById('restart-btn');

let currentPlayer = 'X'; // X always starts
let gameState = ['', '', '', '', '', '', '', '', '']; // Represents the grid state

const winningCombinations = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal (top-left to bottom-right)
  [2, 4, 6], // Diagonal (top-right to bottom-left)
];


let isTwoPlayerMode = false; 
const modeToggleButton = document.getElementById("mode-toggle");
const scoreboard = document.querySelector(".scoreboard");

if (!isTwoPlayerMode) {
  scoreboard.style.display = "none"; // Hide the scoreboard in 2-player mode
  modeToggleButton.textContent = "Switch to AI Mode"; // Change button text
}
modeToggleButton.addEventListener("click", () => {
  isTwoPlayerMode = !isTwoPlayerMode; // Toggle the game mode
  
  if (!isTwoPlayerMode) {
    scoreboard.style.display = "none"; // Hide the scoreboard in 2-player mode
    modeToggleButton.textContent = "Switch to AI Mode"; // Change button text
  } else {
    scoreboard.style.display = "flex"; // Show the scoreboard in AI mode
    modeToggleButton.textContent = "Switch to 2 Player Mode"; // Change button text
  }
});

// Handle cell click
function handleCellClick(event) {
  const cell = event.target;
  const cellIndex = Array.from(cells).indexOf(cell);

  if (gameState[cellIndex] !== '' || checkWin() || checkDraw()) {
    return;
  }

  gameState[cellIndex] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('taken');

  if (checkWin()) {
    gameStatus.textContent = `Player ${currentPlayer} wins! 🎉`;
    disableBoard();
  } else if (checkDraw()) {
    gameStatus.textContent = 'It\'s a draw! 🤝';
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
  }
}



// Check for a draw
function checkDraw() {
  return gameState.every(cell => cell !== '');
}

// Disable the board after a win or draw
function disableBoard() {
  cells.forEach(cell => cell.classList.add('taken'));
}

// Restart the game
restartButton.addEventListener('click', () => {
  currentPlayer = 'X';
  gameState = ['', '', '', '', '', '', '', '', ''];
  gameStatus.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
});

// Add event listeners to cells
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Initial game status
gameStatus.textContent = `Player ${currentPlayer}'s turn`;

let isAI = false; // Flag to indicate if AI is playing
let aiPlayer = 'O'; // AI plays as 'O'
let humanPlayer = 'X'; // Human plays as 'X'

// Toggle between AI mode and Two-Player mode
function toggleMode() {
  isAI = !isAI;
  document.getElementById('mode-toggle').textContent = isAI
    ? 'Switch to Two-Player Mode'
    : 'Switch to AI Mode';
  restartGame();
}


// AI makes a random move

function aiMove() {
  setTimeout(() => {
    let bestMove;

    // Use Minimax only if scores are equal or at the start of the game
    if (playerScore >= aiScore || (playerScore === 0 && aiScore === 0) ) {
      let bestVal = -Infinity;

      for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
          gameState[i] = aiPlayer;
          let moveVal = minimax(gameState, 0, false);
          gameState[i] = '';

          if (moveVal > bestVal) {
            bestMove = i;
            bestVal = moveVal;
          }
        }
      }
    } else {
      // Make a random move if AI's score is greater than the player's score
      const availableMoves = gameState
        .map((cell, index) => (cell === '' ? index : null))
        .filter(index => index !== null);
      bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    gameState[bestMove] = aiPlayer;
    cells[bestMove].textContent = aiPlayer;
    cells[bestMove].classList.add('taken');

    if (checkWin()) {
      gameStatus.textContent = `AI (Player ${aiPlayer}) wins! 🎉`;
      disableBoard();
    } else if (checkDraw()) {
      gameStatus.textContent = 'It\'s a draw! 🤝';
    } else {
      currentPlayer = humanPlayer;
      gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    }
  }, 500); // Add a delay for better visual effect
}


// Minimax algorithm for AI
function minimax(board, depth, isMaximizing) {
    const winner = checkWinner(board);
    function checkWinner(board) {
      for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
          return board[a]; // Returns the winner ('X' or 'O')
        }
      }
      return board.every(cell => cell !== '') ? null : undefined; // Draw if all cells are filled, otherwise undefined
    }
    if (winner === aiPlayer) return 10 - depth; // AI wins
    if (winner === humanPlayer) return depth - 10; // Human wins
    if (checkDraw(board)) return 0; // Draw
  
    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = aiPlayer;
          best = Math.max(best, minimax(board, depth + 1, false));
          board[i] = '';
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = humanPlayer;
          best = Math.min(best, minimax(board, depth + 1, true));
          board[i] = '';
        }
      }
      return best;
    }
  }

// Handle cell click
function handleCellClick(event) {
  if (isAI && currentPlayer === aiPlayer) return; // Prevent clicking when it's AI's turn
  
  const cell = event.target;
  const cellIndex = Array.from(cells).indexOf(cell);

  if (gameState[cellIndex] !== '' || checkWin() || checkDraw()) return;

  gameState[cellIndex] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('taken');

  if (checkWin()) {
    gameStatus.textContent = `Player ${currentPlayer} wins! 🎉`;
    disableBoard();
  } else if (checkDraw()) {
    gameStatus.textContent = 'It\'s a draw! 🤝';
  } else {
    currentPlayer = currentPlayer === humanPlayer ? aiPlayer : humanPlayer;
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;

    if (isAI && currentPlayer === aiPlayer) {
      setTimeout(aiMove, 500); // AI moves after a slight delay for better UX
    }
  }
}


// Restart the game
function restartGame() {
  currentPlayer = humanPlayer;
  gameState = ['', '', '', '', '', '', '', '', ''];
  gameStatus.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
  if (isAI && currentPlayer === aiPlayer) {
    aiMove(); // AI starts if it's AI mode
  }
}

// Toggle mode between AI and Two-Player
document.getElementById('mode-toggle').addEventListener('click', toggleMode);

//scoring
let playerScore = 0;
let aiScore = 0;

// Update the score after a win
function updateScore(winner) {
  if (winner === humanPlayer) {
    playerScore++;
  } else if (winner === aiPlayer) {
    aiScore++;
  }
  document.getElementById('player-score').textContent = `Player (X): ${playerScore}`;
  document.getElementById('ai-score').textContent = `AI (O): ${aiScore}`;
}

// Handle win check
function checkWin() {
  const winner = winningCombinations.find(combination => {
    const [a, b, c] = combination;
    return gameState[a] !== '' && gameState[a] === gameState[b] && gameState[a] === gameState[c];
  });

  if (winner) {
    updateScore(currentPlayer);
    return true;
  } 
  return false;
}
