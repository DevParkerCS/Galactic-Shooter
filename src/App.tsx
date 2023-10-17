import styles from "./App.module.scss";
import { useState, useRef, useEffect } from "react";
import sound from "./Assets/laser.mp3";
import PlayerImg from "./Assets/DurrrSpaceShip.png";

const laserAudio = new Audio(sound);

function App() {
  const [position, setPosition] = useState({ left: 50, top: 50 });
  const [round, setRound] = useState(1);

  const handleMouseMove = (e: any) => {
    setPosition({ left: e.clientX, top: e.clientY });
  };

  const laserClick = async () => {
    laserAudio.play();
  };

  let ufos: JSX.Element[] = [<enemy />];

  window.addEventListener("mousemove", handleMouseMove);

  return (
    <div className={styles.gameWrapper} onClick={laserClick}>
      <div
        style={{ left: position.left, top: position.top }}
        className={styles.box}
      ></div>
      <Player position={position} />
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

export default App;
