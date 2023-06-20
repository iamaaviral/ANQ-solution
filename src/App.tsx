import { useEffect, useState } from "react";

import { playersData } from "./constants/playersData";

import styles from "./App.module.css";
import getRandomRuns from "./utilities/getRandomRuns";
import displayOvers from "./utilities/displayOvers";

const RUNS_TO_WIN = 40;
const BALLS_TO_WIN = 24;
const TOTAL_WICKETS = Object.keys(playersData).length - 1;

function App() {
  const [totalScore, setTotalScore] = useState<number>(0);
  const [totalWicket, setTotalWicket] = useState<number>(0);
  const [totalBalls, setTotalBalls] = useState<number>(0);
  const [runScored, setRunScored] = useState<number | "Out">(0);
  const [result, setResult] = useState<string>("");

  const [currentPlayers, setCurrentPlayers] = useState<{
    [key: string]: {
      playerIndex: number;
      playerScore: number;
    };
  }>({
    striker: {
      playerIndex: 0,
      playerScore: 0,
    },
    nonStriker: {
      playerIndex: 1,
      playerScore: 0,
    },
  });

  useEffect(() => {
    if (totalBalls === BALLS_TO_WIN && totalScore < RUNS_TO_WIN) {
      setResult(`Bengaluru lost by  ${RUNS_TO_WIN - totalScore} runs`);
      return;
    }

    if (totalScore >= RUNS_TO_WIN) {
      setResult(
        `Bengaluru won by ${TOTAL_WICKETS - totalWicket} wickets with ${
          BALLS_TO_WIN - totalBalls
        } balls remaining`
      );
      return;
    }
  }, [totalBalls, totalScore, totalWicket]);

  const throwBall = () => {
    setTotalBalls((prev) => prev + 1);
    const runsGenerated =
      getRandomRuns(
        playersData[currentPlayers.striker.playerIndex].probability
      ) || 0;

    //Condition if player is out
    if (runsGenerated === 7) {
      const newPlayerIndex =
        Math.max(
          currentPlayers.striker.playerIndex,
          currentPlayers.nonStriker.playerIndex
        ) + 1;
      setTotalWicket((prev) => prev + 1);
      setRunScored("Out");
      if (newPlayerIndex > 3) {
        setResult(`Bengaluru Lost by ${RUNS_TO_WIN - totalScore} runs`);
      } else {
        setCurrentPlayers({
          striker: {
            playerIndex: newPlayerIndex,
            playerScore: 0,
          },
          nonStriker: currentPlayers.nonStriker,
        });
      }
      return;
    }

    //UPDATE STRIKER SCORE OF HE IS NOT OUT
    const newStrikerScoreData = currentPlayers.striker;
    newStrikerScoreData.playerScore =
      newStrikerScoreData.playerScore + runsGenerated;

    setCurrentPlayers({
      striker: newStrikerScoreData,
      nonStriker: currentPlayers.nonStriker,
    });

    if (
      totalBalls % 6 === 0 ||
      runsGenerated === 1 ||
      runsGenerated === 3 ||
      runsGenerated === 5
    ) {
      const newStriker = currentPlayers.nonStriker;
      const newNonStriker = currentPlayers.striker;
      setCurrentPlayers({
        striker: newStriker,
        nonStriker: newNonStriker,
      });
    }

    setRunScored(runsGenerated);
    setTotalScore((prev) => prev + runsGenerated);
  };

  return (
    <div className={styles.divContainer}>
      <div className={styles.scoreContainer}>
        <div>
          Bengaluru -
          <span className={styles.totalScore}>
            {totalScore}/{totalWicket} ({displayOvers(totalBalls)})
          </span>
        </div>
        <div className={styles.eachBallScore}>
          {runScored} {runScored !== "Out" && "Runs"}
        </div>
      </div>

      <div className={styles.playerContainer}>
        <div>
          <span className={styles.playerName}>{playersData[currentPlayers.striker.playerIndex].name}*</span>
          <span className={styles.playerScore}>({currentPlayers.striker.playerScore})</span>
        </div>
        <div>
          <span className={styles.playerName}> {playersData[currentPlayers.nonStriker.playerIndex].name}</span>
          <span className={styles.playerScore}>({currentPlayers.nonStriker.playerScore})</span>
        </div>
      </div>

      <div className={styles.result}>{ result || `Bengaluru need ${RUNS_TO_WIN - totalScore} runs in ${BALLS_TO_WIN - totalBalls} balls`}</div>
      <button onClick={throwBall} disabled={!!result}>
        Bowl
      </button>
    </div>
  );
}

export default App;
