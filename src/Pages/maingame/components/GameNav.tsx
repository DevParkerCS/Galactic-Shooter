import styles from "./GameNav.module.scss";
import Life0 from "../../../Assets/lives/Life0.png";
import Life1 from "../../../Assets/lives/Life1.png";
import Life2 from "../../../Assets/lives/Life2.png";
import Life3 from "../../../Assets/lives/Life3.png";
import { useEffect, useState } from "react";
import { GameStateType } from "../../../@types/gamestate";
import { socket } from "../../../socket";

type GameNavProps = {
  score: number;
  lives: number;
  gameState: GameStateType;
};

export const GameNav = ({ score, lives, gameState }: GameNavProps) => {
  const [livesImg, setlivesImg] = useState<string>(Life3);
  const [enemyLives, setEnemyLives] = useState<string>(Life3);
  const liveImgs = [Life0, Life1, Life2, Life3];

  socket.on("enemyLostLife", (enemyLives) => {
    setEnemyLives(liveImgs[enemyLives]);
  });

  useEffect(() => {
    socket.emit("lifeLost", lives);
    if (lives > 0) {
      setlivesImg(liveImgs[lives]);
    } else {
      setlivesImg(liveImgs[0]);
    }
  }, [lives]);

  if (sessionStorage.getItem("isMultiplayer") !== null) {
    return (
      <div className={styles.GUINav}>
        <div className={styles.livesWrapper}>
          <h2 className={styles.lives}>Enemy Lives: </h2>
          <img className={styles.livesImg} src={enemyLives}></img>
        </div>

        <h2>Enemies Left: {gameState.enemiesLeft}</h2>

        <div className={styles.livesWrapper}>
          <h2 className={styles.lives}>Your Lives: </h2>
          <img className={styles.livesImg} src={livesImg}></img>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.GUINav}>
      <h2>Score: {gameState.score}</h2>
      <h2>Enemies Left: {gameState.enemiesLeft}</h2>
      <div className={styles.livesWrapper}>
        <h2 className={styles.lives}>Lives: </h2>
        <img className={styles.livesImg} src={livesImg}></img>
      </div>
    </div>
  );
};
