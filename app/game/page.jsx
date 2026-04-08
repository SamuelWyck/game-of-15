import styles from "./page.module.css";
import GameOf15 from "@/components/gameOf15.jsx";



export const metadata = {
    title: "Game of 15 | Game"
};



function GamePage() {
    return (
        <main className={styles["gamepage-main"]}>
            <GameOf15/>
        </main>
    );
};



export default GamePage;