import { useContext } from "react";
import { devtoolsContext } from "../components/devtools.js";

function useDevtools() {
  const { devtoolsState } = useContext(devtoolsContext);

  // if there is no devtools state, it means we are in production, and we sould fall back to a normal function call
  // and shouldShowCorrectAnswer should be false
  if (!devtoolsState) {
    return {
      showCorrectAnswer: false,
      fetcherWrapper: (fn) => {
        return () => fn();
      },
    };
  }

  const {
    enableDevtools,
    showCorrectAnswer,
    minResTime,
    maxResTime,
    errorRate,
  } = devtoolsState;

  function fetcherWrapper(fn) {
    return () => {
      // fallback to a normal function call if devtools disabled
      if (!enableDevtools) {
        return fn();
      }

      // return a promise that resolves after a randomly selected time, based on min/max response input values
      return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
          if (Math.random() < errorRate) {
            reject("Ooops! something wrong happened.");
          }
          const result = await fn();
          resolve(result);
        }, Math.floor(Math.random() * (maxResTime - minResTime + 1) + minResTime)); // generate a value between min and max
      });
    };
  }

  return {
    showCorrectAnswer: enableDevtools ? showCorrectAnswer : false,
    fetcherWrapper,
  };
}

export default useDevtools;
