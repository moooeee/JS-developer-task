import "./styles/activityResults.css";
import { motion } from "framer-motion";
import Button from "./button.js";
import useLocalStorage from "../hooks/useLocalStorage.js";
import { useLayoutEffect, useState } from "react";

function ActivityResults({ results, tryAgainHandler }) {
  const [highScore, setHighScore] = useLocalStorage(
    "$$activity-high-score$$",
    0
  );
  const [isHighScore, setIsHighScore] = useState(false);

  // We use layoutEffect here because we don't want to yield to the browser
  // and by yielding I mean giving the browser a chance to paint.
  // because if that happened there is a chance that the user sees a wrong message about their score.
  // and this is the main difference between useEffect and useLayoutEffect
  useLayoutEffect(() => {
    const perc = Math.round((results.perc + Number.EPSILON) * 100) / 100;
    if (perc > Number(highScore)) {
      setIsHighScore(true);
      setHighScore(perc);
    }
  }, [results, highScore, setHighScore]);

  const perc = Math.round((results.perc + Number.EPSILON) * 100) / 100; // round to 2 decimal numbers

  return (
    <motion.div
      className="activity-results"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h1 className="rank">Your rank is {perc === 0 ? 0 : perc}%</h1>
      <div className="rank-desc">
        {`It means that you did better than ${perc === 0 ? 0 : perc}% of the
        participants.`}
      </div>
      <div className="high-score-msg">
        {isHighScore
          ? "This is a new high score!"
          : `Your high score is ${highScore}%`}
      </div>
      <Button onClick={() => tryAgainHandler()} autoFocus>
        Try Again!
      </Button>
    </motion.div>
  );
}

export default ActivityResults;
