import styles from "./MainGame.module.scss";
import React, { useState, useRef, useEffect, SetStateAction } from "react";
import sound from "../../Assets/laser.mp3";
import axios from "axios";
import PlayerImg from "../../Assets/DurrrSpaceShip.png";
import enemyImg1 from "../../Assets/shipBlue_manned.png";
import enemyImg2 from "../../Assets/shipBeige_manned.png";
import enemyImg3 from "../../Assets/shipGreen_manned.png";
import enemyImg4 from "../../Assets/shipPink_manned.png";
import enemyImg5 from "../../Assets/shipYellow_manned.png";
import { HighScoreForm } from "./components/HighScoreForm";

import { useNavigate } from "react-router-dom";

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
      {showForm}
      <button onClick={() => navigate("/")}>home</button>
      {gameOver ? (
        <h1 className={styles.gameOver}>Game Over</h1>
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
  const PlayerRef = useRef<HTMLImageElement>(null);

  window.onmouseup = (e) => {
    if (PlayerRef.current == null) return;
    const Player = PlayerRef.current.getBoundingClientRect();
    setRotation(
      // Calculate angle between Player ship and mouse to have ship point at cursor
      -Math.atan2((Player.left - e.clientX) * 1.0, Player.top - e.clientY) *
        (180 / Math.PI)
    );
  };

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
  index: number;
  setEnemies: React.Dispatch<SetStateAction<JSX.Element[]>>;
  imageSrc: string;
};

const Enemy = ({
  setEnemiesLeft,
  setLives,
  setScore,
  index,
  setEnemies,
  imageSrc,
}: EnemyProps) => {
  const [leftPosition, setLeftPosition] = useState(0);
  const enemyRef = useRef<HTMLImageElement>(null);
  let timer = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

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
    generateRandomPosition();
    timer.current = setTimeout(() => {
      setLives((prevState) => prevState - 1);
      setEnemiesLeft((prevState) => prevState - 1);
      setEnemies((prevState) => {
        return prevState.filter((enemy) => {
          return enemy.props.index !== index;
        });
      });
    }, 6000);
    if (sessionStorage.getItem("volumeOn") == null) {
      navigate("/");
    }
  }, []);

  return (
    <div
      ref={enemyRef}
      onClick={handleClick}
      className={styles.enemy}
      style={{ left: leftPosition + `%`, backgroundImage: `URL(${imageSrc})` }}
    ></div>
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
