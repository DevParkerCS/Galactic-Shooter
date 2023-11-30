import { useState, useEffect, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../../socket";
import styles from "../LandingPage.module.scss";
import { FullscreenBtn } from "../../../components/FullscreenBtn/FullscreenBtn";
import { RotateModal } from "../../../components/modals/RotateModal/RotateModal";

type ChooseGameProps = {
  setClickedPlay: React.Dispatch<SetStateAction<boolean>>;
};

export const ChooseGame = ({ setClickedPlay }: ChooseGameProps) => {
  const navigate = useNavigate();

  const handleMultiClick = () => {
    sessionStorage.setItem("isMultiplayer", "true");
    socket.connect();
    socket.emit("findRoom");
    navigate("/play");
  };

  const handleHomeClick = () => {
    socket.disconnect();
    setClickedPlay(false);
  };

  return (
    <div className={styles.pageWrapper}>
      <FullscreenBtn />
      <RotateModal />
      <button className={styles.btn} onClick={() => navigate("/play")}>
        Single Player
      </button>
      <button className={styles.btn} onClick={handleMultiClick}>
        Multiplayer
      </button>
      <button className={styles.btn} onClick={handleHomeClick}>
        Home
      </button>
    </div>
  );
};
