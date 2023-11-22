import { FullscreenBtn } from "../../components/FullscreenBtn";
import { RotateModal } from "../../components/modals/RotateModal";
import styles from "./ObjectivePage.module.scss";
import { useNavigate } from "react-router-dom";

export const ObjectivePage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.objectiveWrapper}>
      <RotateModal />
      <FullscreenBtn />
      <h1 className={styles.title}>Objective</h1>
      <h3 className={styles.descriptionTxt}>
        Embark on an adrenaline-fueled cosmic journey in our action-packed 2D
        space shooter! As a fearless pilot, you'll face a relentless onslaught
        of alien spaceships descending from the starry abyss above. With
        lightning-fast reflexes and an arsenal of powerful weapons at your
        command, your mission is clear: Shoot down the invaders before they
        breach the atmosphere. But be prepared for the ultimate challenge – epic
        boss battles that test your mettle and strategic prowess. Can you defend
        the galaxy and secure your place in the stars as the ultimate space
        hero?
      </h3>
      <div className={styles.txtWrapper}>
        <div className={styles.leftTxt}>
          <div className={styles.txtSection}>
            <h2 className={styles.txtTitle}>Enemies</h2>
            <h3 className={styles.txt}>
              Every Round There Is An Increase Of 10 Enemies. Round 1 Starts
              With 10 Enemies.
            </h3>
            <h3 className={styles.txt}>
              Shoot Enemies By Clicking Or Tapping On Them Before They Hit The
              Bottom Of The Screen!
            </h3>
          </div>
          <div className={styles.txtSection}>
            <h2 className={styles.txtTitle}>Boss Fights</h2>
            <h3 className={styles.txt}>
              Every 5 Rounds There Is A Boss Fight.
            </h3>
            <h3 className={styles.txt}>
              All Bosses Have A Health Of 500 And Each Click Removes 10 Health.
            </h3>
            <h3 className={styles.txt}>
              Bosses Will Randomly Spawn Enemies To Help Attack So Be Sure To
              Stay Alert At All Times.
            </h3>
          </div>
        </div>
        <div className={styles.rightTxt}>
          <div className={styles.txtSection}>
            <h2 className={styles.txtTitle}>Lives</h2>
            <h3 className={styles.txt}>
              You Are Granted Three Lives For The Game. Each Enemy Deals One
              Life Damage!
            </h3>
            <h3 className={styles.txt}>
              You Must Kill The Enemies Before They Hit The Bottom Of The Screen
              To Not Lose A Life!
            </h3>
          </div>
          <div className={styles.txtSection}>
            <h2 className={styles.txtTitle}>Leaderboard</h2>
            <h3 className={styles.txt}>
              Want To Show Off Your Skills? Compete With Everyone Across The
              World In The Top 10 Leaderboard!
            </h3>
            <h3 className={styles.txt}>
              If You Beat One Of The Scores In The Leaderboard, You Will Be
              Asked To Enter Your Initials To Show Your Score!
            </h3>
          </div>
        </div>
      </div>
      <button className={styles.homeBtn} onClick={() => navigate("/")}>
        Home
      </button>
    </div>
  );
};
