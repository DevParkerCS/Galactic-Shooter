import { SetStateAction, useEffect, useState } from "react";
import styles from "./LandingPage.module.scss";
import { useNavigate } from "react-router-dom";
import bgMusic from "../../Assets/bgmusic.mp3";
import axios from "axios";

const bgAudio = new Audio(bgMusic);

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isChosen, setIsChosen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("volumeOn") == "true") {
      bgAudio.volume = 0.1;
      bgAudio.loop = true;
      bgAudio.play();
    }
  }, [isChosen]);

  window.onbeforeunload = () => {
    sessionStorage.removeItem("volumeOn");
  };

  return (
    <div className={styles.pageWrapper}>
      {!sessionStorage.getItem("volumeOn") ? (
        <VolumeModal setIsChosen={setIsChosen} />
      ) : (
        ""
      )}
      <h1 className={styles.title}>Galactic Shooter</h1>
      <button className={styles.btn} onClick={() => navigate("/play")}>
        Play
      </button>
      <button className={styles.btn} onClick={() => navigate("/objective")}>
        Objective
      </button>
      <button
        onClick={() => {
          navigate("/leaderboard");
        }}
        className={styles.btn}
      >
        Leaderboard
      </button>
    </div>
  );
};

type VolumeModalProps = {
  setIsChosen: React.Dispatch<SetStateAction<boolean>>;
};

const VolumeModal = ({ setIsChosen }: VolumeModalProps) => {
  const handleYesClick = () => {
    sessionStorage.setItem("volumeOn", "true");
    setIsChosen(true);
  };

  const handleNoClick = () => {
    sessionStorage.setItem("volumeOn", "false");
    setIsChosen(true);
  };
  return (
    <div className={styles.volumeModal}>
      <h1 className={styles.modalTitle}>This Web Application Uses Sound.</h1>
      <h2 className={styles.modalSubTitle}>
        Do You Allow Sound To Play On Your Computer?
      </h2>
      <button
        className={`${styles.btn} ${styles.yesBtn}`}
        onClick={handleYesClick}
      >
        Yes
      </button>
      <button
        className={`${styles.btn} ${styles.noBtn}`}
        onClick={handleNoClick}
      >
        No
      </button>
    </div>
  );
};
