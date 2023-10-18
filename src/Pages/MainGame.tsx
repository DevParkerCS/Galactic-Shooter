import styles from "./MainGame.module.scss";
import { useState, useRef, useEffect, SetStateAction } from "react";
import sound from "../Assets/laser.mp3";
import PlayerImg from "../Assets/DurrrSpaceShip.png";
import enemyImg from "../Assets/shipBlue_manned.png";

const laserAudio = new Audio(sound);

function MainGame() {
  const [enemies, setEnemies] = useState<JSX.Element[]>([]);
  const [round, setRound] = useState(1);
  const [enemiesLeft, setEnemiesLeft] = useState(10 * round);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const laserClick = async () => {
    laserAudio.play();
  };

  useEffect(() => {
    createEnemies();
  }, [round]);

  const createEnemies = async () => {
    setEnemies([]);
    for (let i = 0; i <= 10 * round; i++) {
      setEnemies((prevState) => {
        return [
          ...prevState,
          <Enemy
            setScore={setScore}
            key={i}
            setEnemiesLeft={setEnemiesLeft}
            setLives={setLives}
          />,
        ];
      });
      await new Promise((res) => setTimeout(res, 500));
    }
  };

  useEffect(() => {
    // Check if enemies are all dead
    if (lives <= 0) {
      setGameOver(true);
    } else if (enemiesLeft === 0) {
      setRound((prevState) => {
        setEnemiesLeft(10 * (prevState + 1));
        return prevState + 1;
      });
    }
    // Check If Out Of Lives
  }, [enemiesLeft, lives]);

  return (
    <div className={styles.gameWrapper} onClick={laserClick}>
      <GameNav score={score} lives={lives} />
      <Player />
      {gameOver ? (
        <h1>Game Over</h1>
      ) : (
        enemies.map((e) => {
          return e;
        })
      )}
    </div>
  );
}

const Player = () => {
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ left: 50, top: 50 });
  const PlayerRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: any) => {
    setPosition({ left: e.clientX, top: e.clientY });
  };

  window.addEventListener("mousemove", handleMouseMove);

  useEffect(() => {
    if (PlayerRef.current == null) return;
    const Player = PlayerRef.current.getBoundingClientRect();
    setRotation(
      // Calculate angle between Player ship and mouse to have ship point at cursor
      -Math.atan2(
        (Player.left - position.left) * 1.0,
        Player.top - position.top
      ) *
        (180 / Math.PI)
    );
  }, [position]);

  return (
    <img
      ref={PlayerRef}
      src={PlayerImg}
      className={styles.player}
      style={{ rotate: rotation + "deg" }}
    ></img>
  );
};

type EnemyProps = {
  setEnemiesLeft: React.Dispatch<SetStateAction<number>>;
  setLives: React.Dispatch<SetStateAction<number>>;
  setScore: React.Dispatch<SetStateAction<number>>;
};

const Enemy = ({ setEnemiesLeft, setLives, setScore }: EnemyProps) => {
  const [position, setPosition] = useState({ left: 0, top: -10 });
  const [isAlive, setIsAlive] = useState(true);

  const handleClick = (e: any) => {
    setIsAlive(false);
    e.target.style.display = "none";
    setEnemiesLeft((prevState) => prevState - 1);
    setScore((prevState) => prevState + 100);
  };

  const generateRandomPosition = () => {
    let positionx = Math.floor(Math.random() * 100);
    setPosition({ left: positionx, top: 0 });
  };

  const moveDown = () => {
    if (position.top < 100 && isAlive) {
      setTimeout(() => {
        setPosition((prevState) => {
          return { left: prevState.left, top: prevState.top + 2 };
        });
      }, 100);
    } else if (position.top >= 100 && isAlive) {
      setLives((prevState) => prevState - 1);
      setIsAlive(false);
      setEnemiesLeft((prevState) => prevState - 1);
    }
  };

  useEffect(() => {
    generateRandomPosition();
  }, []);

  useEffect(() => {
    moveDown();
  }, [position]);

  return (
    <img
      onClick={handleClick}
      src={enemyImg}
      className={styles.enemy}
      style={{ left: position.left + `%`, top: position.top + `%` }}
    ></img>
  );
};

type GameNavProps = {
  score: number;
  lives: number;
};

const GameNav = ({ score, lives }: GameNavProps) => {
  return (
    <div className={styles.GUINav}>
      <h2>Score: {score}</h2>
      <h2>Lives: {lives}</h2>
    </div>
  );
};

export default MainGame;
