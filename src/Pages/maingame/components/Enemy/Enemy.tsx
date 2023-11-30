import { SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./Enemy.module.scss";
import { GameStateType } from "../../../../@types/gamestate";
import { EnemyClass } from "../../../../classes/EnemyClass";
import { MovementUtils } from "../../../../utils/MovementUtils";
import bossNames from "../../../../bossnames.json";

type EnemyProps = {
  setGameState: React.Dispatch<SetStateAction<GameStateType>>;
  setEnemies: React.Dispatch<SetStateAction<JSX.Element[]>>;
  EnemyObj: EnemyClass;
};

export const Enemy = ({ setGameState, EnemyObj, setEnemies }: EnemyProps) => {
  const [leftPosition, setLeftPosition] = useState(0);
  const enemyRef = useRef<HTMLImageElement>(null);
  const [enemyHealth, setEnemyHealth] = useState<number>(EnemyObj.getHealth);
  const healthRef = useRef<HTMLDivElement>(null);
  const [bossName, setBossName] = useState("");
  let timer = useRef<NodeJS.Timeout>();
  const movementUtils = new MovementUtils();

  const calcSpeed = () => {
    if (window.innerHeight <= 576) {
      return 1.5;
    } else if (window.innerHeight <= 768) {
      return 1.4;
    } else {
      return 1;
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
          score: EnemyObj.getIsBoss
            ? prevState.score + EnemyObj.getHealth * 10
            : prevState.score + 100,
          enemiesLeft: prevState.enemiesLeft - 1,
          timeStamp: Date.now(),
          enemyTimers: prevState.enemyTimers.filter((e) => {
            return e != timer.current;
          }),
        };
      });
    }
  };

  const createBossName = () => {
    if (EnemyObj.getIsBoss) {
      const bossIndex = Math.floor(Math.random() * bossNames.length - 1);
      setBossName(bossNames[bossIndex]);
    }
  };

  useEffect(() => {
    setLeftPosition(movementUtils.generateRandPosition);
    createBossName();
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
    }, EnemyObj.getSpeed / calcSpeed());
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
        <div>
          <h1 className={styles.bossName}>{bossName}</h1>
          <div className={styles.healthWrapper}>
            <div
              className={styles.healthBar}
              ref={healthRef}
              style={{
                width: (enemyHealth / EnemyObj.getMaxHealth) * 100 + "%",
              }}
            ></div>
          </div>
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
