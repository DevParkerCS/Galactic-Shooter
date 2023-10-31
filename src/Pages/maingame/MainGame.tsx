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
import { GameStateType } from "../../@types/gamestate";

const LASER_AUDIO = new Audio(sound);
const ENEMY_IMAGES = [enemyImg1, enemyImg2, enemyImg3, enemyImg4, enemyImg5];

function MainGame() {
  // Initializes game start variables
  const initialGameState = {
    round: 1,
    lives: 3,
    score: 0,
    gameOver: false,
    enemiesLeft: 10,
    enemyTimers: [],
    timeStamp: Date.now(),
    enemies: [],
  };
  const [gameState, setGameState] = useState<GameStateType>({
    ...initialGameState,
  });
  const gameOverRef = useRef(false);
  const [showForm, setShowForm] = useState<JSX.Element | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const laserClick = () => {
    if (sessionStorage.getItem("volumeOn") == "true") {
      LASER_AUDIO.play();
    }
  };

  const createEnemies = async () => {
    setGameState((prevState) => {
      return { ...prevState, enemies: [] };
    });
    for (let i = 0; i < 10 * gameState.round; i++) {
      // If game is over stop creating enemies
      if (gameOverRef.current) {
        break;
      }
      const imgIndex = Math.floor(Math.random() * 5);
      const image = ENEMY_IMAGES[imgIndex];
      // Create new enemy in gameState
      setGameState((prevState) => {
        return {
          ...prevState,
          enemies: [
            ...prevState.enemies,
            <Enemy
              setGameState={setGameState}
              gameState={gameState}
              key={i}
              index={i}
              speed={imgIndex}
              imageSrc={image}
            />,
          ],
        };
      });
      await new Promise((res) => setTimeout(res, 500));
    }
  };

  const checkHighScore = async () => {
    try {
      setIsLoading(true);
      // Gets scores from database
      const scores = (
        await axios.get(
          process.env.REACT_APP_LEADERBOARDAPI || "http://localhost:3000"
        )
      ).data;
      for (let i = 0; i < scores.length; i++) {
        // Check if the players score is greater than the score at nth place
        if (gameState.score > scores[i].score) {
          setShowForm(
            <HighScoreForm index={i} scores={scores} score={gameState.score} />
          );
        }
      }
      // If the length of the scores isn't 10 then place the score at the end.
      if (!showForm && scores.length !== 10) {
        setShowForm(
          <HighScoreForm
            index={scores.legnth - 1}
            scores={scores}
            score={gameState.score}
          />
        );
      }
      setIsLoading(false);
    } catch (e) {}
  };

  useEffect(() => {
    // Check if Player is dead
    if (gameState.lives < 0) {
      setGameState((prevState) => {
        return { ...prevState, gameOver: true, enemies: [] };
      });
      // Check if all enemies are dead
    } else if (gameState.enemiesLeft === 0) {
      setGameState((prevState) => {
        return {
          ...prevState,
          round: prevState.round + 1,
          enemiesLeft: 10 * (prevState.round + 1),
        };
      });
    }
  }, [gameState.enemiesLeft, gameState.lives]);

  useEffect(() => {
    gameOverRef.current = gameState.gameOver;
    if (!gameState.gameOver) {
      createEnemies();
    } else if (gameState.gameOver) {
      checkHighScore();
    }
  }, [gameState.round, gameState.gameOver]);

  return (
    <div className={styles.gameWrapper} onClick={laserClick}>
      <GameNav
        score={gameState.score}
        lives={gameState.lives}
        gameState={gameState}
      />
      <Player />
      {showForm}
      {gameState.gameOver ? (
        <h1 className={`${styles.gameOver} ${!showForm ? styles.active : ""}`}>
          {isLoading ? (
            <Spinner />
          ) : (
            <GameOver
              gameState={gameState}
              setGameState={setGameState}
              initialGameState={initialGameState}
            />
          )}
        </h1>
      ) : (
        gameState.enemies.map((e) => {
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
  setGameState: React.Dispatch<SetStateAction<GameStateType>>;
  index: number;
  imageSrc: string;
  speed: number;
  gameState: GameStateType;
};

const Enemy = ({
  setGameState,
  gameState,
  index,
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
    setGameState((prevState) => {
      return {
        ...prevState,
        score: prevState.score + 100,
        enemiesLeft: prevState.enemiesLeft - 1,
      };
    });
    setGameState((prevState) => {
      return {
        ...prevState,
        enemies: prevState.enemies.filter((enemy) => {
          return enemy.props.index !== index;
        }),
      };
    });
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
            return enemy.props.index !== index;
          }),
        };
      });
    }, speedTimes[speed]);
    gameState.enemyTimers.push(timer.current);
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

type GameOverProps = {
  setGameState: React.Dispatch<SetStateAction<GameStateType>>;
  initialGameState: GameStateType;
  gameState: GameStateType;
};

const GameOver = ({
  setGameState,
  initialGameState,
  gameState,
}: GameOverProps) => {
  const navigate = useNavigate();

  const handleRestartGame = () => {
    for (let timer of gameState.enemyTimers) {
      clearTimeout(timer);
    }
    setGameState({ ...initialGameState, enemies: [], timeStamp: Date.now() });
  };

  return (
    <div>
      <h1>GAME OVER</h1>
      <button className={styles.homeBtn}>
        <div className={styles.txt} onClick={() => navigate("/")}>
          Home
        </div>
        <div className={styles.btnCover}></div>
      </button>
      <button className={styles.playBtn}>
        <div className={styles.txt} onClick={handleRestartGame}>
          Play Again
        </div>
        <div className={styles.btnCover}></div>
      </button>
    </div>
  );
};

export default MainGame;
