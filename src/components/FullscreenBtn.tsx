import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import styles from "./FullscreenBtn.module.scss";
import { useState } from "react";

export const FullscreenBtn = () => {
  const handleClick = () => {
    if (!document.fullscreenElement) {
      try {
        document.body.requestFullscreen();
      } catch (err) {
        console.log("Error entering fullscreen", err);
      }
    } else {
      try {
        document.exitFullscreen();
      } catch (err) {
        console.log(err);
      }
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
