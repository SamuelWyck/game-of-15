"use client";


class StorageManager {
    #storage = null;
    #gameOf15Key = "game-of-15";


    initStorage() {
        if (this.#storage !== null) {
            return;
        }

        this.#storage = localStorage;
    };


    saveGame(board) {
        if (this.#storage === null) {
            return;
        }

        const strBoard = JSON.stringify(board);
        this.#storage.setItem(this.#gameOf15Key, strBoard);
    };


    getGame() {
        if (this.#storage === null) {
            return null;
        }

        const strBoard = this.#storage.getItem(this.#gameOf15Key);
        if (!strBoard) {
            return null;
        }
        const board = JSON.parse(strBoard);
        return board;
    };
};



export default new StorageManager();