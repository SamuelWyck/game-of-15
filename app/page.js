import styles from "./page.module.css";
import Link from "next/link";



export default function Home() {
	return (
		<main className={styles["homepage-main"]}>
			<Link href={"/game"} className={styles["game-card-link"]}>
			<div className={styles["game-card"]}>
				<div className={styles["img-wrapper"]}>
					<img src="/paper.jpg" alt="paper" />
				</div>
				<div className={styles["game-card-title-wrapper"]}>
					<p className={styles["game-card-title"]}>Play Game of 15</p>
				</div>
			</div>
			</Link>
		</main>
	);
};