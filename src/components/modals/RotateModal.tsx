import styles from "./RotateModal.module.scss";
import phoneRot from "../../Assets/phonerotate.png";

export const RotateModal = () => {
  return (
    <div className={styles.modalWrapper}>
      <h1 className={styles.modalTitle}>
        Please Rotate Your Phone To Continue Using This Web Application
      </h1>
      <img
        className={styles.phoneImg}
        src={phoneRot}
        alt="image of phone rotating"
      />
    </div>
  );
};
