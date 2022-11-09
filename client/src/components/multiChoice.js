import "./styles/multiChoice.css";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ActivityResults from "./activityResults.js";
import Choice from "./choice.js";
import Progress from "./progress.js";
import { motion, AnimatePresence } from "framer-motion";
import { capitalizeFirstLetter } from "../utils/utils.js";
import Button from "./button.js";
import Loading from "./loading";
import useDevtools from "../hooks/useDevtools.js";
import Error from "./error";

function MultiChoice() {
  const [currentIndex, setCurrentIndex] = useState(0); // currently active index
  const [results, setResults] = useState([]); // keeping track of user's current game results
  const [selectedAnswer, setSelectedAnswer] = useState(""); // currently selected answer
  const [showQResult, setShowQResult] = useState(false); // to give feedback on the user's answer
  const [progress, setProgress] = useState(currentIndex * 10);
  const [enableRankFetch, setEnableRankFetch] = useState(false); // enable the query just after the user answers the last question
  const [disableNextBtn, setDisableNextBtn] = useState(true); // disable the nextQuestion button if the user didn't provide an answer

  // this is kind of a hack to force useQuery to update the closure to a fresh version
  const [updaterValue1, updateWordsQuery] = useState([]);
  const [updaterValue2, updateRankQuery] = useState([]);

  const { showCorrectAnswer, fetcherWrapper } = useDevtools(); // custom hook to get devtools data

  // we use this to invalidate the cached wordsList after we return back to the main view
  const queryClient = useQueryClient();

  const wordsFetcher = async ({ queryKey }) => {
    // this is just a wrapper function to add the dealys if devtools enabled
    // if devtools disabled, it is ignored
    return fetcherWrapper(async () => {
      // we proxied our requests to http://localhost:8080, see package.json
      const wordsListRes = await fetch("/words");
      const words = await wordsListRes.json();
      return words;
    })();
  };

  const rankFetcher = async ({ queryKey }) => {
    // eslint-disable-next-line no-unused-vars
    const [_, { results }] = queryKey;
    return fetcherWrapper(async () => {
      const score = results.filter((result) => result).length * 10;
      // we proxied our requests to http://localhost:8080, see package.json
      const wordsListRes = await fetch("/rank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score,
        }),
      });
      const perc = await wordsListRes.json();
      return perc;
    })();
  };

  // difference between isLoading and isFetching is that isLoading is just enabled for the first time we are getting the data
  // whereas isFetching is enabled for subsequent background fetching to update the data
  const {
    isLoading,
    isError: isWordsListErrored,
    isFetching,
    data,
    refetch: refetchWordsList,
  } = useQuery(["wordsList", { updaterValue1 }], wordsFetcher);

  const {
    isLoading: isRankDataLoading,
    isError: isRankErrored,
    data: rankData,
    refetch: refetchRankData,
  } = useQuery(["rank", { results, updaterValue2 }], rankFetcher, {
    enabled: enableRankFetch,
  });

  const shouldShowActivityResults = rankData && enableRankFetch;

  if (isLoading || isFetching) {
    return <Loading />;
  }

  if (isWordsListErrored) {
    return (
      <Error
        msg="Ooops! something wrong happened while trying to fetch test words."
        retry={() => {
          refetchWordsList();
          updateWordsQuery(updaterValue1 === 2 ? new Array(1) : new Array(2));
        }}
      />
    );
  }

  const resetActivity = () => {
    setCurrentIndex(0);
    setResults([]);
    setSelectedAnswer("");
    setShowQResult(false);
    setProgress(0);
    setEnableRankFetch(false);
    updateWordsQuery(updaterValue1.length === 2 ? new Array(1) : new Array(2));
    queryClient.invalidateQueries({ queryKey: ["wordsList"] }); // invalidate the cache when we return to words view
  };

  if (shouldShowActivityResults) {
    return (
      <AnimatePresence>
        <ActivityResults results={rankData} tryAgainHandler={resetActivity} />
      </AnimatePresence>
    );
  }

  // the right answer
  const answer = data.words[currentIndex].pos;

  const handleShowRank = () => {
    setShowQResult(true);
    const result = selectedAnswer.toLocaleLowerCase() === answer;
    setResults([...results, result]);
    setProgress((currentIndex + 1) * 10);
    setDisableNextBtn(true);

    setTimeout(() => {
      if (currentIndex + 1 < 10) {
        setCurrentIndex(currentIndex + 1);
      }
      setShowQResult(false); // reset the answer and showQResult after the timeout
      setSelectedAnswer("");
      if (currentIndex + 1 === 10) {
        // enable the query after answering the last question
        setEnableRankFetch(true);
      }
    }, 350); // we wait 350ms to give the user some feedback on their answer
  };

  const choiceClickHandler = (answer) => {
    setSelectedAnswer(answer);
    setDisableNextBtn(false);
  };

  return (
    <AnimatePresence initial={false}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="wrapper"
      >
        <div
          className="container"
          style={{
            opacity:
              (isRankDataLoading && progress === 100 && enableRankFetch) ||
              isRankErrored
                ? 0.5
                : 1,
          }}
        >
          <h1 className="current-word">
            {capitalizeFirstLetter(data.words[currentIndex].word)}
          </h1>
          <form
            className="mcq-form"
            onSubmit={(e) => {
              e.preventDefault(); // to prevent any refreshes
              handleShowRank();
            }}
          >
            <ul className="choices-list">
              {["Noun", "Verb", "Adjective", "Adverb"].map((choice, index) => {
                const isAnswer = answer === choice.toLowerCase(); // checking if the currently visible word's
                return (
                  <Choice
                    showResult={showQResult}
                    value={choice}
                    onClick={choiceClickHandler}
                    key={choice}
                    isSelected={selectedAnswer === choice}
                    isAnswer={isAnswer}
                    shouldShowCorrectAnswer={showCorrectAnswer}
                  />
                );
              })}
            </ul>
            <Button disabled={disableNextBtn}>Next Question</Button>
            <Progress progressValue={progress} />
          </form>
        </div>
        {isRankDataLoading && progress === 100 && enableRankFetch && (
          <Loading />
        )}
        {isRankErrored && (
          <Error
            msg="Ooops! something wrong happened when trying to calculate the results."
            retry={() => {
              refetchRankData();
              updateRankQuery(
                updaterValue2.length === 2 ? new Array(1) : new Array(2)
              );
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default MultiChoice;
