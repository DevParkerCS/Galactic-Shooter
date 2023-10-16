import styles from "./App.module.scss";
import { useState, useRef, useEffect } from "react";
import sound from "./Assets/laser.mp3";

const laserAudio = new Audio(sound);

function App() {
  const [position, setPosition] = useState({ left: 50, top: 50 });

  const handleMouseMove = (e: any) => {
    setPosition({ left: e.clientX, top: e.clientY });
  };

  const laserClick = async () => {
    laserAudio.play();
  };

  window.addEventListener("mousemove", handleMouseMove);

  return (
    <div className={styles.gameWrapper} onClick={laserClick}>
      <div
        style={{ left: position.left, top: position.top }}
        className={styles.box}
      ></div>
      <UFO position={position} />
    </div>
  );
}

const UFO = ({ position }: { position: { left: number; top: number } }) => {
  const [rotation, setRotation] = useState(0);
  const ufoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ufoRef.current == null) return;
    const ufo = ufoRef.current.getBoundingClientRect();
    setRotation(
      -Math.atan2((ufo.left - position.left) * 1.0, ufo.top - position.top) *
        (180 / Math.PI)
    );
  }, [position]);

  const handleClick = (e: any) => {
    e.target.style.display = "none";
  };
  return (
    <div
      ref={ufoRef}
      className={styles.ufo}
      onClick={handleClick}
      style={{ rotate: rotation + "deg" }}
    ></div>
  );
};

export default App;
