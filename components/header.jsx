import styles from "../styles/header.module.css";
import Link from "next/link";



function Header() {
    return (
    <header className={styles["header"]}>
        <Link href={"/"}>
        <div className={styles["banner"]}>
            <div className={styles["logo-wrapper"]}>
                <img src="/logo.png" alt="logo" />
            </div>
            <p>Game of 15</p>
        </div>
        </Link>
        <nav>
            <Link href={"/game"}>Game</Link>
        </nav>
    </header>
    );
};



export default Header;