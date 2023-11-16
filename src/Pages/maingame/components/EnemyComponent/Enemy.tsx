import { SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./Enemy.module.scss";
import { GameStateType } from "../../../../@types/gamestate";
import { EnemyClass } from "../../../../classes/EnemyClass";
import { MovementUtils } from "../../../../utils/MovementUtils";

type EnemyProps = {
  setGameState: React.Dispatch<SetStateAction<GameStateType>>;
  setEnemies: React.Dispatch<SetStateAction<JSX.Element[]>>;
  EnemyObj: EnemyClass;
  gameState: GameStateType;
};

export const Enemy = ({
  setGameState,
  gameState,
  EnemyObj,
  setEnemies,
}: EnemyProps) => {
  const [leftPosition, setLeftPosition] = useState(0);
  const enemyRef = useRef<HTMLImageElement>(null);
  const [enemyHealth, setEnemyHealth] = useState<number>(EnemyObj.getHealth);
  const healthRef = useRef<HTMLDivElement>(null);
  let timer = useRef<NodeJS.Timeout>();
  let speedMultiplier = 1;
  const movementUtils = new MovementUtils();

  const calcSpeed = () => {
    if (window.innerHeight <= 480) {
      speedMultiplier = 1.5;
    }
  };

  const handleClick = () => {
    EnemyObj.removeHealth = 10;
    setEnemyHealth(enemyHealth - 10);
    if (EnemyObj.getIsBoss && EnemyObj.getHealth % 30 == 0) {
      setLeftPosition(movementUtils.generateRandPosition);
    }
    if (EnemyObj.getHealth <= 0) {
      clearTimeout(timer.current);
      setEnemies((prevState) => {
        return prevState.filter(
          (enemy) =>
            enemy.props.EnemyObj.getEnemyIndex != EnemyObj.getEnemyIndex
        );
      });
      setGameState((prevState) => {
        return {
          ...prevState,
          score: prevState.score + 100,
          enemiesLeft: prevState.enemiesLeft - 1,
          timeStamp: Date.now(),
          enemyTimers: prevState.enemyTimers.filter((e) => {
            return e != timer.current;
          }),
        };
      });
    }
  };

  useEffect(() => {
    setLeftPosition(movementUtils.generateRandPosition);
    calcSpeed();
    timer.current = setTimeout(() => {
      setGameState((prevState) => {
        return {
          ...prevState,
          lives: prevState.lives - 1,
          enemiesLeft: prevState.enemiesLeft - 1,
          timeStamp: Date.now(),
        };
      });
      setEnemies((prevState) => {
        return prevState.filter(
          (enemy) =>
            enemy.props.EnemyObj.getEnemyIndex != EnemyObj.getEnemyIndex
        );
      });
    }, EnemyObj.getSpeed / speedMultiplier);
    setGameState((prevState) => {
      return {
        ...prevState,
        enemyTimers: [...prevState.enemyTimers, timer.current],
      };
    });
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
