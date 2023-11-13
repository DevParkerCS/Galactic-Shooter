import { SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./Enemy.module.scss";
import { GameStateType } from "../../../../@types/gamestate";
import { EnemyClass } from "../../../../classes/EnemyClass";

type EnemyProps = {
  setGameState: React.Dispatch<SetStateAction<GameStateType>>;
  EnemyObj: EnemyClass;
  gameState: GameStateType;
};

export const Enemy = ({ setGameState, gameState, EnemyObj }: EnemyProps) => {
  const [leftPosition, setLeftPosition] = useState(0);
  const enemyRef = useRef<HTMLImageElement>(null);
  const [enemyHealth, setEnemyHealth] = useState<number>(EnemyObj.getHealth);
  const healthRef = useRef<HTMLDivElement>(null);
  let timer = useRef<NodeJS.Timeout>();
  let speedMultiplier = 1;

  const calcSpeed = () => {
    if (window.innerWidth <= 850) {
      speedMultiplier = 1.5;
    }
  };

  const handleClick = () => {
    EnemyObj.removeHealth = 10;
    setEnemyHealth(enemyHealth - 10);
    if (EnemyObj.getHealth <= 0) {
      clearTimeout(timer.current);
      setGameState((prevState) => {
        return {
          ...prevState,
          score: prevState.score + 100,
          enemiesLeft: prevState.enemiesLeft - 1,
          enemies: prevState.enemies.filter((enemy) => {
            return (
              enemy.props.EnemyObj.getEnemyIndex !== EnemyObj.getEnemyIndex
            );
          }),
        };
      });
    }
  };

  const generateRandomPosition = () => {
    let positionx = Math.floor(Math.random() * 95);
    setLeftPosition(positionx);
  };

  useEffect(() => {
    clearTimeout(timer.current);
  }, [gameState.gameOver]);

  useEffect(() => {
    generateRandomPosition();
    calcSpeed();
    timer.current = setTimeout(() => {
      setGameState((prevState) => {
        return {
          ...prevState,
          lives: prevState.lives - 1,
          enemiesLeft: prevState.enemiesLeft - 1,
        };
      });
      setGameState((prevState) => {
        return {
          ...prevState,
          enemies: prevState.enemies.filter((enemy) => {
            return (
              enemy.props.EnemyObj.getEnemyIndex !== EnemyObj.getEnemyIndex
            );
          }),
        };
      });
    }, EnemyObj.getSpeed / speedMultiplier);
    gameState.enemyTimers.push(timer.current);
  }, []);

  return (
    <div>
      {EnemyObj.getIsBoss ? (
        <div className={styles.healthWrapper}>
          <div
            className={styles.healthBar}
            ref={healthRef}
            style={{ width: (enemyHealth / EnemyObj.getMaxHealth) * 100 + "%" }}
          ></div>
        </div>
      ) : (
        ""
      )}
      <div
        ref={enemyRef}
        onClick={handleClick}
        className={`${styles.enemy} ${styles["enemy" + EnemyObj.getImgIndex]}`}
        style={{
          left: leftPosition + `%`,
          backgroundImage: `URL(${EnemyObj.getImgLink})`,
        }}
      ></div>
    </div>
  );
};
