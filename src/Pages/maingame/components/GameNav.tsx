import styles from "./GameNav.module.scss";
import Life0 from "../../../Assets/lives/Life0.png";
import Life1 from "../../../Assets/lives/Life1.png";
import Life2 from "../../../Assets/lives/Life2.png";
import Life3 from "../../../Assets/lives/Life3.png";
import { useEffect, useState } from "react";
import { GameStateType } from "../../../@types/gamestate";

type GameNavProps = {
  score: number;
  lives: number;
  gameState: GameStateType;
};

export const GameNav = ({ score, lives, gameState }: GameNavProps) => {
  const [shownImg, setShownImg] = useState<string>(Life3);
  const liveImgs = [Life0, Life1, Life2, Life3];
  useEffect(() => {
    if (lives > 0) {
      setShownImg(liveImgs[lives]);
    } else {
      setShownImg(liveImgs[0]);
    }
  }, [lives]);
  return (
    <div className={styles.GUINav}>
      <h2>Score: {gameState.score}</h2>
      <h2>Enemies Left: {gameState.enemiesLeft}</h2>
      <div className={styles.livesWrapper}>
        <h2 className={styles.lives}>Lives: </h2>
        <img className={styles.livesImg} src={shownImg}></img>
      </div>
    </div>
  );
};
