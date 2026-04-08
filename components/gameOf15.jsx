"use client";
import { useRef, useEffect } from "react";
import styles from "../styles/gameOF15.module.css";
import Board from "../utils/board.js";



function GameOf15() {
    const cells = useRef(createCells());
    const tiles = useRef(createTiles());
    const game = useRef(new Board());
    const board = useRef(null);


    useEffect(function() {
        setTiles();

        document.addEventListener("keyup", handleKeypress);

        return function() {
            document.removeEventListener("keyup", handleKeypress);
        };
    }, []);


    function setTiles() {
        const gameBoard = game.current.getBoard();

        for (let row = 0; row < gameBoard.length; row += 1) {
            for (let col = 0; col < gameBoard[0].length; col += 1) {
                const tileNum = gameBoard[row][col];
                if (tileNum == 0) {
                    continue;
                }

                const tile = board.current.querySelector(`.${styles["board-tile"]}.${styles[`tile${tileNum}`]}`);
                tile.dataset.row = row;
                tile.dataset.col = col;
            }
        }
    };

    
    function handleKeypress(event) {
        const key = event.key;
        if (key === "w") {
            moveTile(game.current.moveUp);
        } else if (key === "s") {
            moveTile(game.current.moveDown);
        } else if (key === "a") {
            moveTile(game.current.moveLeft);
        } else if (key === "d") {
            moveTile(game.current.moveRight);
        }
    };


    function moveTile(direction) {
        const tileMoveInfo = game.current.moveTile(direction);
        if (tileMoveInfo === null) {
            return;
        }

        const tileCls = styles[`board-tile`];
        const tile = board.current.querySelector(
            `.${tileCls}[data-row="${tileMoveInfo.oldRow}"][data-col="${tileMoveInfo.oldCol}"]`
        );
        
        tile.dataset.row = tileMoveInfo.newRow;
        tile.dataset.col = tileMoveInfo.newCol;
    };


    function createCells() {
        const boardWidth = 4;
        const boardHeight = 4;
        const cells = [];

        for (let row = 0; row < boardHeight; row += 1) {
            for (let col = 0; col < boardWidth; col += 1) {
                cells.push(
                    <div 
                        className={styles["board-cell"]} 
                        data-row={row} data-col={col}
                        key={`${row},${col}`}
                    ></div>
                );
            }
        }

        return cells;
    };


    function createTiles() {
        const boardWidth = 4;
        const boardHeight = 4;
        let tileNum = 1;

        const tiles = [];

        for (let row = 0; row < boardHeight; row += 1) {
            for (let col = 0; col < boardWidth; col += 1) {
                if (tileNum >= 16) {
                    break;
                }
                tiles.push(
                    <div 
                        className={`${styles[`board-tile`]} ${styles[`tile${tileNum}`]}`}
                        data-row={row} data-col={col}
                        key={`${row},${col}`}
                    ></div>
                );

                tileNum += 1;
            }
        }

        return tiles;
    };



    return (
    <section className={styles["game-section"]}>
        <div className={styles["game-board"]} ref={board}>
            <div className={styles["tiles-wrapper"]}>
                {tiles.current}
            </div>
            {cells.current}
        </div>
    </section>
    );
};



export default GameOf15;