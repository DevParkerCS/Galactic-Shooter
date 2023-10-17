import styles from "./App.module.scss";
import { useState, useRef, useEffect } from "react";
import sound from "./Assets/laser.mp3";
import PlayerImg from "./Assets/DurrrSpaceShip.png";
import enemyImg from "./Assets/shipBlue_manned.png";

const laserAudio = new Audio(sound);

function App() {
  const [position, setPosition] = useState({ left: 50, top: 50 });
  const [enemies, setEnemies] = useState<JSX.Element[]>([<Enemy />]);
  const [round, setRound] = useState(1);

  const handleMouseMove = (e: any) => {
    setPosition({ left: e.clientX, top: e.clientY });
  };

  const laserClick = async () => {
    laserAudio.play();
  };

  useEffect(() => {
    createEnemies();
  }, [round]);

  const createEnemies = () => {
    for (let i = 0; i < 10 * round; i++) {
      setEnemies([...enemies, <Enemy />]);
    }
  };

  window.addEventListener("mousemove", handleMouseMove);

  return (
    <div className={styles.gameWrapper} onClick={laserClick}>
      <Player position={position} />
      {enemies.map((e) => {
        return e;
      })}
    </div>
  );
}

const Player = ({ position }: { position: { left: number; top: number } }) => {
  const [rotation, setRotation] = useState(0);
  const PlayerRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (PlayerRef.current == null) return;
    const Player = PlayerRef.current.getBoundingClientRect();
    setRotation(
      -Math.atan2(
        (Player.left - position.left) * 1.0,
        Player.top - position.top
      ) *
        (180 / Math.PI)
    );
  }, [position]);

  const handleClick = (e: any) => {
    e.target.style.display = "none";
  };
  return (
    <img
      ref={PlayerRef}
      src={PlayerImg}
      className={styles.player}
      onClick={handleClick}
      style={{ rotate: rotation + "deg" }}
    ></img>
  );
};

const Enemy = () => {
  const handleClick = (e: any) => {
    setTimeout(() => {
      e.target.style.display = "none";
    }, 500);
  };
  return (
    <div className={styles.enemyWrapper}>
      <img onClick={handleClick} src={enemyImg} className={styles.enemy}></img>
    </div>
  );
};

export default App;
