import styles from "./MainGame.module.scss";
import React, { useState, useRef, useEffect, SetStateAction } from "react";
import sound from "../../Assets/laser.mp3";
import axios from "axios";
import PlayerImg from "../../Assets/DurrrSpaceShip.png";
import enemyImg1 from "../../Assets/enemies/shipBlue_manned.png";
import enemyImg2 from "../../Assets/enemies/shipBeige_manned.png";
import enemyImg3 from "../../Assets/enemies/shipGreen_manned.png";
import enemyImg4 from "../../Assets/enemies/shipPink_manned.png";
import enemyImg5 from "../../Assets/enemies/shipYellow_manned.png";
import { HighScoreForm } from "./components/HighScoreForm";
import { GameNav } from "./components/GameNav";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../components/Spinner";

const LASER_AUDIO = new Audio(sound);
const ENEMY_IMAGES = [enemyImg1, enemyImg2, enemyImg3, enemyImg4, enemyImg5];

function MainGame() {
  const [enemies, setEnemies] = useState<JSX.Element[]>([]);
  const [round, setRound] = useState(1);
  const [enemiesLeft, setEnemiesLeft] = useState(10 * round);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showForm, setShowForm] = useState<JSX.Element | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const laserClick = () => {
    if (sessionStorage.getItem("volumeOn") == "true") {
      LASER_AUDIO.play();
    }
  };

  const createEnemies = async () => {
    setEnemies([]);
    for (let i = 0; i < 10 * round; i++) {
      const imgIndex = Math.floor(Math.random() * 5);
      const image = ENEMY_IMAGES[imgIndex];
      setEnemies((prevState) => {
        return [
          ...prevState,
          <Enemy
            setScore={setScore}
            key={i}
            index={i}
            speed={imgIndex}
            setEnemies={setEnemies}
            setEnemiesLeft={setEnemiesLeft}
            setLives={setLives}
            imageSrc={image}
          />,
        ];
      });
      await new Promise((res) => setTimeout(res, 500));
    }
  };

  const checkHighScore = async () => {
    try {
      const scores = (
        await axios.get(
          process.env.REACT_APP_LEADERBOARDAPI || "http://localhost:3000"
        )
      ).data;
      for (let i = 0; i < scores.length; i++) {
        if (score > scores[i].score) {
          setShowForm(
            <HighScoreForm index={i} scores={scores} score={score} />
          );
        }
      }
      if (!showForm && scores.length !== 10) {
        setShowForm(
          <HighScoreForm
            index={scores.legnth - 1}
            scores={scores}
            score={score}
          />
        );
      }
    } catch (e) {}
  };

  useEffect(() => {
    // Check if enemies are all dead
    if (lives == -1) {
      setGameOver(true);
      setEnemies([]);
      checkHighScore();
    } else if (enemiesLeft === 0) {
      setRound((prevState) => {
        setEnemiesLeft(10 * (prevState + 1));
        return prevState + 1;
      });
    }
    // Check If Out Of Lives
  }, [enemiesLeft, lives]);

  useEffect(() => {
    createEnemies();
  }, [round]);

  return (
    <div className={styles.gameWrapper} onClick={laserClick}>
      <GameNav score={score} lives={lives} />
      <Player />
      <button onClick={() => navigate("/")}>home</button>
      {showForm}
      {gameOver ? (
        <h1 className={`${styles.gameOver} ${!showForm ? styles.active : ""}`}>
          {isLoading ? <Spinner /> : "Game Over"}
        </h1>
      ) : (
        enemies.map((e) => {
          return e;
        })
      )}
    </div>
  );
}

const Player = () => {
  const PlayerRef = useRef<HTMLImageElement>(null);

  window.onmouseup = (e) => {
    if (PlayerRef.current == null) return;
    const Player = PlayerRef.current.getBoundingClientRect();
    const angle =
      -Math.atan2((Player.left - e.clientX) * 1.0, Player.top - e.clientY) *
      (180 / Math.PI);
    PlayerRef.current.style.rotate = angle.toString() + "deg";
  };

  return <img ref={PlayerRef} src={PlayerImg} className={styles.player}></img>;
};

type EnemyProps = {
  setEnemiesLeft: React.Dispatch<SetStateAction<number>>;
  setLives: React.Dispatch<SetStateAction<number>>;
  setScore: React.Dispatch<SetStateAction<number>>;
  index: number;
  setEnemies: React.Dispatch<SetStateAction<JSX.Element[]>>;
  imageSrc: string;
  speed: number;
};

const Enemy = ({
  setEnemiesLeft,
  setLives,
  setScore,
  index,
  setEnemies,
  imageSrc,
  speed,
}: EnemyProps) => {
  const [leftPosition, setLeftPosition] = useState(0);
  const enemyRef = useRef<HTMLImageElement>(null);
  let timer = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();
  const speedTimes = [6000, 5500, 5000, 4500, 4000];

  const handleClick = (e: any) => {
    clearTimeout(timer.current);
    setEnemiesLeft((prevState) => prevState - 1);
    setScore((prevState) => prevState + 100);
    setEnemies((prevState) => {
      return prevState.filter((enemy) => {
        return enemy.props.index !== index;
      });
    });
  };

  const generateRandomPosition = () => {
    let positionx = Math.floor(Math.random() * 95);
    setLeftPosition(positionx);
  };

  useEffect(() => {
    console.log(speedTimes[speed]);
    generateRandomPosition();
    timer.current = setTimeout(() => {
      setLives((prevState) => prevState - 1);
      setEnemiesLeft((prevState) => prevState - 1);
      setEnemies((prevState) => {
        return prevState.filter((enemy) => {
          return enemy.props.index !== index;
        });
      });
    }, speedTimes[speed]);
    if (sessionStorage.getItem("volumeOn") == null) {
      navigate("/");
    }
  }, []);

  return (
    <div
      ref={enemyRef}
      onClick={handleClick}
      className={`${styles.enemy} ${styles["enemy" + speed]}`}
      style={{ left: leftPosition + `%`, backgroundImage: `URL(${imageSrc})` }}
    ></div>
  );
};

export default MainGame;
