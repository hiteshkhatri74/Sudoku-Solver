let N , subGridSize;

function initializeGrid() {
    const container = document.getElementById("container1");
    container.innerHTML = "";    //clear any existing grid

    N = parseInt(document.getElementById('size').value);
    subGridSize = Math.sqrt(N);

    // validate that N is a perfect square
    if(!Number.isInteger(subGridSize)){
        alert("Please enter a perfect square (e.g. , 4, 9, 16).");
        return;
    }

    // set up the grid syle dynamically based on N
    container.style.gridTemplateColumns = `repeat(${N}, 0.2fr)`;

    for(let i = 0;i < N * N; i++){
        const input = document.createElement("input");
        input.type = "number";
        input.min = 1;
        input.max = N;
        input.value = "";
        input.id = `cell-${Math.floor(i/N)}-${i % N}`;

        // Add event listener to enforce min and max values
        input.addEventListener("input",()=>{
            if(input.value > N) input.value = N;
            if(input.value < 1) input.value = "";
        });
        container.appendChild(input);
    }
}


function getBoard() {
    const board = [];

    for(let i = 0;i < N; i++){
        const row = [];

        for(let j = 0; j < N; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`).value;
            row.push(cell ? parseInt(cell) : 0);
        }
        board.push(row);
    }
    return board;
}

function setBoard(board) {
    for(let i = 0; i < N; i++) {
        for(let j = 0; j < N; j++) {
            document.getElementById(`cell-${i}-${j}`).value = board[i][j] || '';
        }
    }
}


function isValid(board, row, col, num) {
    // check row and column
    for(let x = 0; x < N; x++) {
        if(board[row][x] === num || board[x][col] === num)
            return false;
    }

    // check sub-grid
    const startRow = Math.floor(row / subGridSize) * subGridSize;
    const startCol = Math.floor(col / subGridSize) * subGridSize;

    for(let i = 0; i < subGridSize; i++) {
        for(let j = 0; j < subGridSize; j++){
           if(board[startRow + i][startCol + j] === num)
              return false; 
        }
    }
    return true;
}

function solve(board) {
    for(let row = 0; row < N ;row++){
        for(let col = 0;col < N;col++){

            if(board[row][col] == 0){    // Find empty cell
                for(let num = 1; num <= N ;num++){  // Try numbers 1 to N

                    if(isValid(board, row, col, num)) {
                        board[row][col] = num;  // Place number

                        if(solve(board))   // Recursively solve
                            return true;
                        board[row][col] = 0;   // Backtrack
                    }
                }
                return false;  // Trigger backtracking
            }

        }
    }
    return true;  // Solved
}
function solveSudoku() {
    const board = getBoard();

    if(solve(board)) {
        setBoard(board);
        alert("Sudoku Solved!");
    }
    else{
        alert("No solution exists for the given Sudoku");
    }
}