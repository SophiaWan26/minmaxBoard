const columnMax = 7;
const rowMax = 6;
const INF = 1.7976931348623157e10308;
var totalMoveCount = 0;
var depth = 5;

function Board() {
    //   0 = empty
    //   1 = red
    //   2 = yellow
    this.boardState = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ];
    this.boardHtmlDots = [[], [], [], [], [], []];
    this.turn = 1; //First turn is red
    this.endState = "play";
    that = this;
    that.createBoard();
}

//Method of object board that will run everytime a new Board is instantiated
Board.prototype.createBoard = function () {
    document.querySelectorAll(".col").forEach((col) => {
        col.addEventListener("click", handleClickComputer);
        col.querySelectorAll(".cell").forEach((cell, cellIdx) => {
            this.boardHtmlDots[cellIdx].push(cell);
        });
    });
};

//Method of object Board used to check draw state
Board.prototype.checkDraw = function () {
    temp = this.boardState.flat();
    result = !temp.includes(0);
    return result;
};

//Method of object Board used to check win state
Board.prototype.checkWin = function (turn) {
    //Check for horizontal win
    for (let r = 0; r < rowMax; r++) {
        for (let c = 0; c < columnMax - 3; c++) {
            if (
                turn == this.boardState[r][c] &&
                this.boardState[r][c] == this.boardState[r][c + 1] &&
                this.boardState[r][c + 1] == this.boardState[r][c + 2] &&
                this.boardState[r][c + 2] == this.boardState[r][c + 3]
            ) {
                return true;
            }
        }
    }
    //Check for Vertical win
    for (let r = 0; r < rowMax - 3; r++) {
        for (let c = 0; c < columnMax; c++) {
            if (
                turn == this.boardState[r][c] &&
                this.boardState[r][c] == this.boardState[r + 1][c] &&
                this.boardState[r + 1][c] == this.boardState[r + 2][c] &&
                this.boardState[r + 2][c] == this.boardState[r + 3][c]
            ) {
                return true;
            }
        }
    }
    //Check for negative diagonal
    for (let r = 0; r < rowMax - 3; r++) {
        for (let c = 0; c < columnMax - 3; c++) {
            if (
                turn == this.boardState[r][c] &&
                this.boardState[r][c] == this.boardState[r + 1][c + 1] &&
                this.boardState[r + 1][c + 1] ==
                    this.boardState[r + 2][c + 2] &&
                this.boardState[r + 2][c + 2] == this.boardState[r + 3][c + 3]
            ) {
                return true;
            }
        }
    }
    //Check for positive diagonal
    for (let r = 3; r < rowMax; r++) {
        for (let c = 0; c < columnMax - 3; c++) {
            if (
                turn == this.boardState[r][c] &&
                this.boardState[r][c] == this.boardState[r - 1][c + 1] &&
                this.boardState[r - 1][c + 1] ==
                    this.boardState[r - 2][c + 2] &&
                this.boardState[r - 2][c + 2] == this.boardState[r - 3][c + 3]
            ) {
                return true;
            }
        }
    }
    return false;
};

//Method of object Board used to get Lowest on a column
Board.prototype.getLowestOnCol = function (col) {
    for (let i = 0; i < this.boardState.length; i++) {
        if (this.boardState[i][col] !== 0) {
            return i - 1;
        }
    }
    return 5;
};

//Method of object Board used to place Dot
Board.prototype.placeDot = function (col) {
    var row = this.getLowestOnCol(col);
    if (row !== -1) {
        this.boardState[row][col] = this.turn;
        this.boardHtmlDots[row][col].classList.toggle(
            this.turn === 1 ? "is-red" : "is-yellow"
        );

        if (this.checkWin(this.turn)) {
            win(this.turn);
            this.endState = this.turn;
        } else {
            if (this.checkDraw()) {
                draw();
                this.endState = this.turn;
            }
        }
        this.turn = this.turn === 1 ? 2 : 1;
    }
};

// Method projectDot used to place dot in boardState
Board.prototype.projectDot = function (col) {
    var row = this.getLowestOnCol(col);
    if (row !== -1) {
        this.boardState[row][col] = this.turn;
    }
};

// Method for deep copy object
Board.prototype.copy = function (turn) {
    boardCopy = new Board();
    boardCopy.boardState = this.boardState.map(function (arr) {
        return arr.slice();
    });
    boardCopy.endState = this.endState;
    boardCopy.turn = turn;
    boardCopy.boardHtmlDots = null;

    return boardCopy;
};

//Method of object Board that implements computers move
Board.prototype.moveComputer = function () {
    // 1: Maximizer
    // 2: Minimizer

    var resMinMax = this.minimax(depth, INF * -1, INF, 2);
    // console.warn(`${totalMoveCount} :::::::`)
    console.log(resMinMax);
    this.placeDot(resMinMax[0]);
};

// Method to get all possible location to move
Board.prototype.getValidLocation = function () {
    var valLoc = [];
    for (var i = 0; i < columnMax; i++) {
        if (this.getLowestOnCol(i) !== -1) {
            valLoc.push(i);
        }
    }
    return valLoc;
};

// Method to check final state either win or draw
Board.prototype.isTerminalNode = function (turn) {
    return this.checkWin(turn) || this.checkDraw();
};

// Method that implement minimax algorithm with alpha-beta pruning
Board.prototype.minimax = function (recurseDepth, alpha, beta, turn) {
    // Tambah parameter board untuk rekursif??
    // 1: Maximizer
    // 2: Minimizer

    // Get all valid location
    var valLocation = this.getValidLocation();

    // Check if turn is terminal state
    var isTerminal = this.isTerminalNode(turn);

    if (recurseDepth === 0 || isTerminal) {
        if (isTerminal) {
            if (turn === 1) {
                return [null, 1000];
            } else if (turn === 2) {
                return [null, -1000];
            } else {
                return [null, 0];
            }
        } else {
            var evalRes = this.evaluation(this, turn);
            return [null, turn === 1 ? evalRes : evalRes * -1];
        }
    }

    if (turn === 1) {
        var column = valLocation[0];
        var value = INF * -1;
        for (var i = 0; i < valLocation.length; i++) {
            var col = valLocation[i];
            var boardCopy = this.copy(turn);
            boardCopy.projectDot(col);
            var newScore = boardCopy.minimax(
                recurseDepth - 1,
                alpha,
                beta,
                2
            )[1];
            if (newScore > value) {
                value = newScore;
                column = col;
            }
            alpha = Math.max(alpha, value);
            if (beta <= alpha) {
                break;
            }
        }
        return [column, value];
    } else {
        var value = INF;
        var column = valLocation[0];
        for (var i = 0; i < valLocation.length; i++) {
            var col = valLocation[i];
            var boardCopy = this.copy(turn);
            boardCopy.projectDot(col);
            var newScore = boardCopy.minimax(
                recurseDepth - 1,
                alpha,
                beta,
                1
            )[1];
            if (newScore < value) {
                value = newScore;
                column = col;
            }
            beta = Math.min(beta, value);
            if (beta <= alpha) {
                break;
            }
        }
        return [column, value];
    }
};

//Calculation of four holes
Board.prototype.calculate = function (arr, turn) {
    oppTurn = turn === 1 ? 2 : 1;

    if (count(arr, turn) === 4) {
        return 100;
    } else if (count(arr, turn) === 2 && count(arr, 0) === 2) {
        return 5;
    } else if (count(arr, turn) === 3 && count(arr, 0) === 1) {
        return 10;
    } else if (count(arr, 0) === 1 && count(arr, oppTurn) === 3) {
        return -9;
    } else {
        return 0;
    }
};

//Evaluation
Board.prototype.evaluation = function (evalBoard, turn) {
    score = 0;
    //row evaluation
    for (let r = 0; r < rowMax; r++) {
        for (let c = 0; c < columnMax - 3; c++) {
            temp = evalBoard.boardState[r].slice(c, c + 4);
            score += this.calculate(temp, turn);
        }
    }

    //column evaluation
    for (let c = 0; c < columnMax; c++) {
        for (let r = 0; r < rowMax - 3; r++) {
            temp = [];
            for (let i = 0; i < 4; i++) {
                temp.push(evalBoard.boardState[r + i][c]);
            }
            score += this.calculate(temp, turn);
        }
    }

    //negative diagonal evaluation
    for (let r = 0; r < rowMax - 3; r++) {
        for (let c = 0; c < columnMax - 3; c++) {
            temp = [];
            for (let i = 0; i < 4; i++) {
                temp.push(evalBoard.boardState[r + i][c + i]);
            }
            score += this.calculate(temp, turn);
        }
    }

    //positive diagonal evaluation
    for (let r = 3; r < rowMax; r++) {
        for (let c = 0; c < columnMax - 3; c++) {
            temp = [];
            for (let i = 0; i < 4; i++) {
                temp.push(evalBoard.boardState[r - i][c + i]);
            }
            score += this.calculate(temp, turn);
        }
    }

    return score;
};

function handleClickComputer(e) {
    if (window.board.endState === "play") {
        var col = e.path.filter((el) => {
            try {
                return !!el.dataset.colId;
            } catch (error) {
                return false;
            }
        })[0];
        var colId = col.dataset.colId;
        window.board.placeDot(colId);
    }
    if (window.board.endState === "play") {
        window.board.moveComputer();
    }
    totalMoveCount++;
}

function start() {
    window.board = new Board();
}

function draw() {
    var win = document.getElementById("win-alert");
    win.style.display = "block";
    win.innerHTML = `<h1>DRAW<h1>`;
}

function win(turn) {
    var win = document.getElementById("win-alert");
    win.style.display = "block";
    turnColor = turn === 1 ? "Red" : "Yellow";
    win.innerHTML = `<h1>${turnColor} WINS<h1>`;
}

function count(arr, e) {
    var count = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == e) count++;
    }
    return count;
}
