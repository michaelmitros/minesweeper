const size = 10; // Increase board size to 10x10
const numMines = 20; // Increase the number of mines

let board = [];
let revealed = Array(size).fill(null).map(() => Array(size).fill(false));
let mines = new Set();
let flaggedCells = new Set();

// Initialize game
function initGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gameBoard.innerHTML = '';
    board = createBoard();
    revealed = Array(size).fill(null).map(() => Array(size).fill(false));
    flaggedCells.clear();
    createUI(gameBoard);
}

// Create board and place mines
function createBoard() {
    const board = Array(size).fill(null).map(() => Array(size).fill(0));
    mines.clear();
    while (mines.size < numMines) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        if (!mines.has(`${row},${col}`)) {
            mines.add(`${row},${col}`);
            board[row][col] = 'M';
            updateNeighbors(board, row, col);
        }
    }
    return board;
}

// Update neighboring cells around a mine
function updateNeighbors(board, row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const r = row + i;
            const c = col + j;
            if (r >= 0 && r < size && c >= 0 && c < size && board[r][c] !== 'M') {
                board[r][c]++;
            }
        }
    }
}

// Create UI grid
function createUI(gameBoard) {
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cell = document.createElement('button');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => revealCell(row, col));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleFlag(cell, row, col);
            });
            gameBoard.appendChild(cell);
        }
    }
}

// Reveal a cell
function revealCell(row, col) {
    if (revealed[row][col] || flaggedCells.has(`${row},${col}`)) return;

    const cell = document.querySelector(`button[data-row="${row}"][data-col="${col}"]`);
    revealed[row][col] = true;

    if (board[row][col] === 'M') {
        cell.textContent = '💣';
        cell.classList.add('revealed');
        gameOver();
        return;
    }

    cell.textContent = board[row][col] > 0 ? board[row][col] : '';
    cell.classList.add('revealed');

    // If no adjacent mines, reveal neighbors
    if (board[row][col] === 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const r = row + i;
                const c = col + j;
                if (r >= 0 && r < size && c >= 0 && c < size) {
                    revealCell(r, c);
                }
            }
        }
    }

    checkWin();
}

// Toggle a flag on right-click
function toggleFlag(cell, row, col) {
    const cellKey = `${row},${col}`;
    if (cell.classList.contains('revealed')) return;

    if (flaggedCells.has(cellKey)) {
        flaggedCells.delete(cellKey);
        cell.classList.remove('flagged');
        cell.textContent = '';
    } else {
        flaggedCells.add(cellKey);
        cell.classList.add('flagged');
        cell.textContent = '🚩';
    }
}

// Check if the player has won
function checkWin() {
    let cellsRevealed = 0;
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (revealed[row][col]) cellsRevealed++;
        }
    }

    // Total cells - mine cells == revealed cells => Win condition
    if (cellsRevealed === size * size - numMines) {
        alert('Congratulations! You cleared the board!');
        setTimeout(initGame, 2000); // Reset game
    }
}

// End game
function gameOver() {
    alert('Game Over! You hit a mine!');
    // Reveal all mines
    mines.forEach(mine => {
        const [r, c] = mine.split(',').map(Number);
        const cell = document.querySelector(`button[data-row="${r}"][data-col="${c}"]`);
        cell.textContent = '💣';
        cell.classList.add('revealed');
    });
    setTimeout(initGame, 2000);
}

// Initialize the game on load
window.onload = initGame;
