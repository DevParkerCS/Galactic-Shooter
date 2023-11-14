import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import styles from "./FullscreenBtn.module.scss";
import { useState } from "react";

export const FullscreenBtn = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleClick = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      document.body.requestFullscreen();
    } else {
      setIsFullscreen(false);
      document.exitFullscreen();
    }
  };
  return (
    <FontAwesomeIcon
      className={styles.icon}
      icon={faExpand}
      onClick={handleClick}
    />
  );
};