"use client";
import { useRef, useEffect } from "react";
import styles from "../styles/gameOf15.module.css";
import Board from "../utils/board.js";
import Popup from "./popup.jsx";
import storage from "../utils/storageManager.js";



function GameOf15() {
    const cells = useRef(createCells());
    const tiles = useRef(createTiles());
    const game = useRef(new Board());
    const board = useRef(null);
    const popupRef = useRef(null);
    const gameOver = useRef(false);

    const touchStart = useRef({});
    const touchEnd = useRef({});
    const maxNeededTouches = 5;


    useEffect(function() {
        storage.initStorage();
        const savedBoard = storage.getGame();
        if (savedBoard !== null) {
            game.current.setBoard(savedBoard);
        }
        setTiles();
        if (game.current.isSolved()) {
            gameOver.current = true;
        }

        const mainEle = document.querySelector("main");

        mainEle.addEventListener("touchstart", handleTouchStart);
        mainEle.addEventListener("touchmove", handleTouchMove);
        mainEle.addEventListener("touchend", handleTouchEnd);

        document.addEventListener("keyup", handleKeypress);
        document.addEventListener("click", handleMoveBtnPress);

        return function() {
            mainEle.removeEventListener("touchstart", handleTouchStart);
            mainEle.removeEventListener("touchmove", handleTouchMove);
            mainEle.removeEventListener("touchend", handleTouchEnd);

            document.removeEventListener("keyup", handleKeypress);
            document.removeEventListener("click", handleMoveBtnPress);
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


    function handleReset() {
        popupRef.current.showMessage("Game reset", true);
        game.current.reset();
        setTiles();
        gameOver.current = false;
        storage.saveGame(game.current.getBoard());
    };


    function handleTouchStart(event) {
        if (gameOver.current) {
            return;
        }

        const touch = event.touches[0];
        touchStart.current = {x: touch.clientX, y: touch.clientY};
    };


    function handleTouchMove(event) {
        if (gameOver.current || touchStart.current.x === undefined) {
            return;
        }

        const touch = event.targetTouches[0];
        const lastTouchNum = touchEnd.current.num ? touchEnd.current.num : 0;

        if (lastTouchNum === maxNeededTouches) {
            const direction = getSwipeDirection();
            handleMove(direction);
            touchStart.current = {};
            touchEnd.current = {};
        } else {
            touchEnd.current = {x: touch.clientX, y: touch.clientY, num: lastTouchNum + 1};
        }
    };


    function handleTouchEnd() {
        const numTouches = touchEnd.current.num ? touchEnd.current.num : 0;
        if (gameOver.current || numTouches < maxNeededTouches) {
            return;
        }

        const direction = getSwipeDirection();
        handleMove(direction);

        touchStart.current = {};
        touchEnd.current = {};
    };


    function getSwipeDirection() {
        const xDiff = touchEnd.current.x - touchStart.current.x;
        const yDiff = touchEnd.current.y - touchStart.current.y;

        if (Math.abs(xDiff) >= Math.abs(yDiff)) {
            return (xDiff > 0) ? game.current.moveRight : game.current.moveLeft;
        } else {
            return (yDiff > 0) ? game.current.moveDown : game.current.moveUp;
        }
    };

    
    function handleKeypress(event) {
        if (gameOver.current) {
            return;
        }

        const key = event.key;

        let direction = null;
        if (key === "w") {
            direction = game.current.moveUp;
        } else if (key === "s") {
            direction = game.current.moveDown;
        } else if (key === "a") {
            direction = game.current.moveLeft;
        } else if (key === "d") {
            direction = game.current.moveRight;
        }

        if (direction !== null) {
            handleMove(direction);
        }
    };


    function handleMoveBtnPress(event) {
        const target = event.target;
        if (!target.matches(`.${styles["move-button"]}`) || gameOver.current) {
            return;
        }

        let direction = null;
        if (target.matches(`.${styles["move-up"]}`)) {
            direction = game.current.moveUp;
        } else if (target.matches(`.${styles["move-down"]}`)) {
            direction = game.current.moveDown;
        } else if (target.matches(`.${styles["move-left"]}`)) {
            direction = game.current.moveLeft;
        } else if (target.matches(`.${styles["move-right"]}`)) {
            direction = game.current.moveRight;
        }

        handleMove(direction);
    };


    function handleMove(direction) {
        let gameWon = false;
        if (moveTile(direction)) {
            gameWon = game.current.isSolved();
            storage.saveGame(game.current.getBoard());
        }

        if (gameWon) {
            popupRef.current.showMessage("Good job! You won!");
            gameOver.current = true;
        }
    };


    function moveTile(direction) {
        const tileMoveInfo = game.current.moveTile(direction);
        if (tileMoveInfo === null) {
            return false ;
        }

        const tileCls = styles[`board-tile`];
        const tile = board.current.querySelector(
            `.${tileCls}[data-row="${tileMoveInfo.oldRow}"][data-col="${tileMoveInfo.oldCol}"]`
        );
        
        tile.dataset.row = tileMoveInfo.newRow;
        tile.dataset.col = tileMoveInfo.newCol;
        return true;
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
        <Popup ref={popupRef} top={-50} centered={true} />
        <button className={styles["reset-btn"]} onClick={handleReset}>
            <img src="/reset.svg" alt="reset" />
        </button>
        <button className={`${styles["move-button"]} ${styles["move-up"]}`}>
            <img src="/arrow.svg" alt="arrow" />
        </button>
        <div className={styles["board-wrapper"]}>
            <button className={`${styles["move-button"]} ${styles["move-left"]}`}>
                <img src="/arrow.svg" alt="arrow" />
            </button>
            <div className={styles["game-board"]} ref={board}>
                <div className={styles["tiles-wrapper"]}>{tiles.current}</div>
                {cells.current}
            </div>
            <button className={`${styles["move-button"]} ${styles["move-right"]}`}>
                <img src="/arrow.svg" alt="arrow" />
            </button>
        </div>
        <button className={`${styles["move-button"]} ${styles["move-down"]}`}>
            <img src="/arrow.svg" alt="arrow" />
        </button>
    </section>
    );
};



export default GameOf15;