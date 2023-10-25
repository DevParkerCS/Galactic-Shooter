import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import styles from "./Spinner.module.scss";

export const Spinner = () => {
  return (
    <FontAwesomeIcon
      className={styles.spinner}
      icon={faSpinner}
      style={{ color: "#ffffff" }}
    />
  );
};
