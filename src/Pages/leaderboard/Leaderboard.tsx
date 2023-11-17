import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import styles from "./Leaderboard.module.scss";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../components/Spinner";
import { RotateModal } from "../../components/modals/RotateModal";
import { FullscreenBtn } from "../../components/FullscreenBtn";
import { ErrorPage } from "../../components/ErrorPage/ErrorPage";

type ResponseType = {
  data: [LeaderboardType];
};

type LeaderboardType = {
  name: string;
  score: number;
};

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardType[]>();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_LEADERBOARDAPI || "http://localhost:3000")
      .then((res: ResponseType) => setLeaderboard(res.data))
      .catch(() => {
        setError(true);
      });
  }, []);

  if (error) {
    return (
      <ErrorPage
        error={500}
        errorMsg="There Was An Error Loading The Leaderboard.  Please Check Your Wifi Or Try Again Later"
      />
    );
  }

  if (!leaderboard) {
    return <Spinner />;
  }

  return (
    <div className={styles.leaderboardWrapper}>
      <RotateModal />
      <FullscreenBtn />
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>LEADERBOARD</h1>
        <div className={styles.entriesWrapper}>
          <div className={styles.leftHalf}>
            {leaderboard?.slice(0, 5).map((p, i) => {
              return (
                <div key={i} className={styles.leaderboardEntry}>
                  <h1>
                    {i + 1}){p.name.toUpperCase()}:{" "}
                  </h1>
                  <h1>{p.score}</h1>
                </div>
              );
            })}
          </div>
          <div>
            {leaderboard?.slice(5, 10).map((p, i) => {
              return (
                <div key={i} className={styles.leaderboardEntry}>
                  <h1>
                    {i + 6}){p.name.toUpperCase()}:{" "}
                  </h1>
                  <h1>{p.score}</h1>
                </div>
              );
            })}
          </div>
        </div>
        <button onClick={() => navigate("/")} className={styles.homeBtn}>
          Home
        </button>
      </div>
    </div>
  );
};
