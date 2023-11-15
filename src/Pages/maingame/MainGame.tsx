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
import bombImg from "../../Assets/bomb64.png";
import { GameNav } from "./components/GameNav";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../components/Spinner";
import { GameStateType } from "../../@types/gamestate";
import { RotateModal } from "../../components/modals/RotateModal";
import { FullscreenBtn } from "../../components/FullscreenBtn";
import { EnemyClass } from "../../classes/EnemyClass";
import { Enemy } from "./components/EnemyComponent/Enemy";
import { MovementUtils } from "../../utils/MovementUtils";
import { v4 as uuid } from "uuid";
import { socket } from "../../socket";
import { checkHighScore } from "../../utils/APIFetcher";

const LASER_AUDIO = new Audio(sound);
const ENEMY_IMAGES = [enemyImg1, enemyImg2, enemyImg3, enemyImg4, enemyImg5];

function MainGame() {
  // Initializes game start variables
  const initialGameState = {
    round: 1,
    lives: 3,
    score: 0,
    gameOver: false,
    enemiesLeft: 5,
    enemyTimers: [],
    timeStamp: Date.now(),
  };
  const [gameState, setGameState] = useState<GameStateType>({
    ...initialGameState,
  });
  const [enemies, setEnemies] = useState<JSX.Element[]>([]);
  const [spawnables, setSpawnables] = useState<JSX.Element[]>([]);
  const gameOverRef = useRef(false);
  const [showForm, setShowForm] = useState<JSX.Element | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roundChanged, setRoundChanged] = useState(false);
  const [playerJoined, setPlayerJoined] = useState(false);
  const [wonGame, setWonGame] = useState(false);
  const gameObj = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  socket.on("playerJoined", () => {
    setPlayerJoined(true);
  });

  socket.on("gameOver", () => {
    setWonGame(true);
    setGameState((prevState) => {
      return { ...prevState, gameOver: true };
    });
  });

  socket.on("arrChange", (arr) => {
    console.log(arr);
  });

  const laserClick = () => {
    if (sessionStorage.getItem("volumeOn") == "true") {
      LASER_AUDIO.play();
    }
  };

  const createEnemies = async () => {
    setGameState((prevState) => {
      return {
        ...prevState,
        enemiesLeft: prevState.round % 5 == 0 ? 1 : 5 * prevState.round,
      };
    });

    if (gameState.round % 5 == 0) {
      const imgIndex = Math.floor(Math.random() * 5);
      const image = ENEMY_IMAGES[imgIndex];
      setGameState((prevState) => {
        return { ...prevState, enemiesLeft: 1 };
      });
      const enemyObj = new EnemyClass(image, 0, 150, 6, 10000, true);
      setEnemies((prevState) => [
        ...prevState,
        <Enemy
          setGameState={setGameState}
          setEnemies={setEnemies}
          gameState={gameState}
          key={0}
          EnemyObj={enemyObj}
        />,
      ]);
    } else {
      for (let i = 0; i < 5 * gameState.round; i++) {
        // If game is over stop creating enemies
        if (gameOverRef.current) {
          break;
        }
        const spawnBomb = Math.floor(Math.random() * 8) == 4;
        if (spawnBomb) {
          const uniqueId = uuid();
          setSpawnables((prevState) => {
            return [
              ...prevState,
              <Bomb
                setSpawnables={setSpawnables}
                index={uniqueId}
                setGameState={setGameState}
                key={uniqueId}
              />,
            ];
          });
        }
        const speedTimes = [6000, 5500, 5000, 4500, 4000];
        const imgIndex = Math.floor(Math.random() * 5);
        const image = ENEMY_IMAGES[imgIndex];
        const EnemyObj = new EnemyClass(
          image,
          i,
          10,
          imgIndex,
          speedTimes[imgIndex],
          false
        );
        // Create new enemy
        setEnemies((prevState) => [
          ...prevState,
          <Enemy
            setGameState={setGameState}
            setEnemies={setEnemies}
            gameState={gameState}
            key={i}
            EnemyObj={EnemyObj}
          />,
        ]);
        await new Promise((res) => setTimeout(res, 500));
      }
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("volumeOn") == null) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    // Check if Player is dead
    if (gameState.lives < 0) {
      socket.emit("gameOver");
      setWonGame(false);
      setGameState((prevState) => {
        return { ...prevState, gameOver: true, enemies: [] };
      });
      for (let timer of gameState.enemyTimers) {
        clearTimeout(timer);
      }
      // Check if all enemies are dead
    } else if (gameState.enemiesLeft === 0) {
      setGameState((prevState) => {
        return {
          ...prevState,
          round: prevState.round + 1,
        };
      });
      for (let timer of gameState.enemyTimers) {
        clearTimeout(timer);
      }
      setSpawnables([]);
    }
  }, [gameState.enemiesLeft, gameState.lives]);

  useEffect(() => {
    gameOverRef.current = gameState.gameOver;
    if (gameState.gameOver) {
      if (sessionStorage.getItem("isMultiplayer") !== null) {
        checkHighScore({ setIsLoading, gameState, setShowForm, showForm });
      }
    } else if (!gameState.gameOver) {
      if (sessionStorage.getItem("isMultiplayer") == null || playerJoined) {
        setRoundChanged(true);
        setTimeout(() => {
          setRoundChanged(false);
          createEnemies();
        }, 2000);
      }
    }
  }, [gameState.round, gameState.gameOver, playerJoined]);

  if (sessionStorage.getItem("isMultiplayer") !== null && !playerJoined) {
    return <Spinner />;
  }

  return (
    <div ref={gameObj} className={styles.gameWrapper} onClick={laserClick}>
      <GameNav
        score={gameState.score}
        lives={gameState.lives}
        gameState={gameState}
      />
      <RotateModal />
      <FullscreenBtn />
      <h1 className={`${styles.round} ${roundChanged ? styles.showRound : ""}`}>
        Round {gameState.round}
      </h1>
      <Player />
      {showForm}
      {gameState.gameOver ? (
        <h1 className={`${styles.gameOver} ${!showForm ? styles.active : ""}`}>
          {isLoading ? (
            <Spinner />
          ) : (
            <GameOver
              setPlayerJoined={setPlayerJoined}
              setGameState={setGameState}
              initialGameState={initialGameState}
              wonGame={wonGame}
            />
          )}
        </h1>
      ) : (
        enemies.map((e) => {
          return e;
        })
      )}
      {!gameState.gameOver
        ? spawnables.map((e) => {
            return e;
          })
        : ""}
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

type BombProps = {
  setSpawnables: React.Dispatch<SetStateAction<JSX.Element[]>>;
  setGameState: React.Dispatch<SetStateAction<GameStateType>>;
  index: string;
};

const Bomb = ({ setSpawnables, index, setGameState }: BombProps) => {
  const movementUtils = new MovementUtils();
  const timerId = useRef<NodeJS.Timeout>();
  const [leftPosition, setLeftPosition] = useState(0);

  useEffect(() => {
    setLeftPosition(movementUtils.generateRandPosition());
    timerId.current = setTimeout(() => {
      setSpawnables((prevState) => {
        return prevState.filter((e) => {
          return e.props.index !== index;
        });
      });

      setGameState((prevState) => {
        return {
          ...prevState,
          enemyTimers: prevState.enemyTimers.filter((e) => {
            return e !== timerId.current;
          }),
        };
      });
    }, 5000);
    setGameState((prevState) => {
      return {
        ...prevState,
        enemyTimers: [...prevState.enemyTimers, timerId.current],
      };
    });
  }, []);

  const handleClick = () => {
    clearTimeout(timerId.current);

    setGameState((prevState) => {
      return {
        ...prevState,
        lives: prevState.lives - 1,
        enemyTimers: prevState.enemyTimers.filter((e) => {
          return e !== timerId.current;
        }),
      };
    });
    setSpawnables((prevState) => {
      return prevState.filter((e) => {
        return e.props.index !== index;
      });
    });
  };

  return (
    <div
      className={styles.bombWrapper}
      style={{ left: leftPosition + "%" }}
      onClick={handleClick}
    >
      <img src={bombImg} />
    </div>
  );
};

type GameOverProps = {
  setGameState: React.Dispatch<SetStateAction<GameStateType>>;
  initialGameState: GameStateType;
  setPlayerJoined: React.Dispatch<SetStateAction<boolean>>;
  wonGame: boolean;
};

const GameOver = ({
  setGameState,
  initialGameState,
  setPlayerJoined,
  wonGame,
}: GameOverProps) => {
  const navigate = useNavigate();

  const handleRestartGame = () => {
    setGameState({ ...initialGameState, timeStamp: Date.now() });
    if (sessionStorage.getItem("isMultiplayer") !== null) {
      setPlayerJoined(false);
      socket.emit("findRoom");
    }
  };

  return (
    <div>
      <h1>{wonGame ? "YOU WIN!" : "GAME OVER"}</h1>
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
