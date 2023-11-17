import styles from "./ErrorPage.module.scss";
import { useNavigate } from "react-router-dom";

type ErrorPageProps = {
  error: number;
  errorMsg: string;
};

export const ErrorPage = ({ error, errorMsg }: ErrorPageProps) => {
  const navigate = useNavigate();
  return (
    <div className={styles.errorPage}>
      <h1>Uh Oh!</h1>
      <h1>{error}</h1>
      <h2>{errorMsg}</h2>
      <button onClick={() => navigate("/")}>HOME</button>
    </div>
  );
};
