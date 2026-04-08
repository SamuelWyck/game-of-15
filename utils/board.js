


class Board {
    #board = [];
    #boardWidth = 4;
    #boardHeight = 4;

    #emptySymbol = 0;
    #emptyRow = 0;
    #emptyCol = 0;

    #moveUp = 0;
    #moveDown = 1;
    #moveLeft = 2;
    #moveRight = 3;

    #tileSwapDeltas = {};

    constructor() {
        for (let i = 0; i < this.#boardHeight; i += 1) {
            this.#board.push([]);
        }

        this.#tileSwapDeltas[this.#moveUp] = [1, 0];
        this.#tileSwapDeltas[this.#moveDown] = [-1, 0];
        this.#tileSwapDeltas[this.#moveLeft] = [0, 1];
        this.#tileSwapDeltas[this.#moveRight] = [0, -1];

        this.#fillBoard();
        this.#randomizeBoard();
    };


    getBoard() {
        return this.#board;
    };

    
    isSolved() {
        let nextExpectedNum = 1;

        for (let row = 0; row < this.#board.length; row += 1) {
            for (let col = 0; col < this.#board[0].length; col += 1) {
                let tileNum = (this.#board[row][col] == this.#emptySymbol) ? 16 : this.#board[row][col];
                if (tileNum != nextExpectedNum) {
                    return false;
                }
                nextExpectedNum += 1;
            }
        }

        return true;
    };


    get moveUp() {
        return this.#moveUp;
    };

    get moveDown() {
        return this.#moveDown;
    };

    get moveLeft() {
        return this.#moveLeft;
    };

    get moveRight() {
        return this.#moveRight;
    };
    
    
    moveTile(direction) {
        if (!(direction in this.#tileSwapDeltas)) {
            return null;
        }
        
        const [rowDelta, colDelta] = this.#tileSwapDeltas[direction];
        const tileRow = this.#emptyRow + rowDelta;
        const tileCol = this.#emptyCol + colDelta;
        return this.#swapTile(tileRow, tileCol);
    };


    reset() {
        this.#fillBoard();
        this.#randomizeBoard();
    };



    #swapTile(tileRow, tileCol) {
        const rowValid = 0 <= tileRow && tileRow < this.#board.length;
        const colValid = 0 <= tileCol && tileCol < this.#board[0].length;
        if (!rowValid || !colValid) {
            return null;
        }

        const tileNum = this.#board[tileRow][tileCol];
        this.#board[tileRow][tileCol] = this.#emptySymbol;
        this.#board[this.#emptyRow][this.#emptyCol] = tileNum;

        const newRow = this.#emptyRow;
        const newCol = this.#emptyCol;
        this.#emptyRow = tileRow;
        this.#emptyCol = tileCol;

        return {newRow, newCol, oldRow: tileRow, oldCol: tileCol};
    };


    #fillBoard() {
        let nextTileNum = 1;
        for (let row = 0; row < this.#boardHeight; row += 1) {
            for (let col = 0; col < this.#boardWidth; col += 1) {
                const num = (nextTileNum < 16) ? nextTileNum : this.#emptySymbol;
                this.#board[row][col] = num;
                nextTileNum += 1;
            }
        }

        this.#emptyRow = this.#boardHeight - 1;
        this.#emptyCol = this.#boardWidth - 1;
    };


    #randomizeBoard() {
        const directions = [
            this.#moveUp, this.#moveDown, 
            this.#moveLeft, this.#moveRight
        ];

        for (let numTileMoves = this.#randInt(75, 150); numTileMoves > 0; numTileMoves -= 1) {
            const randIdx = this.#randInt(0, directions.length - 1);
            this.moveTile(directions[randIdx]);
        }
    };


    #randInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
};



export default Board;