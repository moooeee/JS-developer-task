import { createContext, useContext, useState } from "react";
import Portal from "./portal.js";
import { AnimatePresence, motion } from "framer-motion";
import "./styles/devtools.css";

/**
 * This is a component to control things related to data fetching like delays and max/min response time.
 * It is DEV only, so it's not going to render anything in production and we won't ship any extra bytrs along the wire unnecessarily, and the app will smoothly fallback to a normal state.
 * It can control whether or not to show the correct answer to the user as well.
 *
 * We are using Portal to help with styling and to avoid stacking and z-index problems, it is designed for such scenarios.
 *
 * We are using `framer-motion` AnimatePresence to help with unmount animations.
 *
 * NOTE:
 * We're not breaking the laws of hooks when we use `eslint-disable-next-line`, because the code will run in just one environment (dev or prod), and the hook will or will not be called for the entire lifetime of the app, and this pattern is used by many open source component libraries to show dev only things like warnings.
 */

const __DEV__ = process.env.NODE_ENV === "development";

export const devtoolsContext = createContext({ devtoolsState: null });

function DevtoolsProvider({ children }) {
  if (!__DEV__) {
    return children;
  }

  // eslint-disable-next-line
  const [devtoolsState, setDevtoolsState] = useState({
    enableDevtools: false,
    minResTime: 1000,
    maxResTime: 3000,
    errorRate: 0.2,
    showCorrectAnswer: false,
  });

  return (
    <devtoolsContext.Provider value={{ devtoolsState, setDevtoolsState }}>
      {children}
    </devtoolsContext.Provider>
  );
}

function Devtools() {
  if (!__DEV__) {
    return null;
  }

  // eslint-disable-next-line
  const [showDevtools, setShowDevtools] = useState(false);
  // eslint-disable-next-line
  const { devtoolsState, setDevtoolsState } = useContext(devtoolsContext);
  const {
    enableDevtools,
    minResTime,
    maxResTime,
    errorRate,
    showCorrectAnswer,
  } = devtoolsState;

  return (
    <Portal>
      <div className="devtools-container">
        <button
          className="devtools-btn"
          onClick={() => setShowDevtools(!showDevtools)}
          aria-label="devtools button"
        />
        <AnimatePresence>
          {showDevtools && (
            <motion.div
              className="devtools"
              initial={{ opacity: 0.5, x: 30, y: 30, scale: 0.8 }}
              animate={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                transition: { ease: "easeOut", duration: 0.2 },
              }}
              exit={{
                opacity: 0.5,
                scale: 0.7,
                x: 30,
                y: 30,
                transition: { ease: "easeOut", duration: 0.1 },
              }}
            >
              <div className="form-field">
                <input
                  type="checkbox"
                  name="enable-devtools"
                  id="enable"
                  checked={enableDevtools}
                  onChange={(e) =>
                    setDevtoolsState((state) => ({
                      ...state,
                      enableDevtools: e.target.checked,
                    }))
                  }
                />
                <label htmlFor="enable">enable devtools</label>
              </div>
              <div
                className="form-field"
                data-disabled={!enableDevtools ? true : false} // using data attributes in this situation is more convenient than classes
              >
                <input
                  type="checkbox"
                  name="correct-answer"
                  id="correct-answer"
                  checked={showCorrectAnswer}
                  onChange={(e) =>
                    setDevtoolsState((state) => ({
                      ...state,
                      showCorrectAnswer: e.target.checked,
                    }))
                  }
                  disabled={!enableDevtools}
                />
                <label htmlFor="correct-answer">show correct answer</label>
              </div>
              <div
                className="form-field"
                data-disabled={!enableDevtools ? true : false}
              >
                <input
                  type="number"
                  min="0"
                  max={maxResTime - 10}
                  step="100"
                  id="min-response-time"
                  value={minResTime}
                  onChange={(e) =>
                    setDevtoolsState((state) => ({
                      ...state,
                      minResTime: Number(e.target.value),
                    }))
                  }
                  disabled={!enableDevtools}
                />
                <label htmlFor="min-response-time">min response time</label>
              </div>
              <div
                className="form-field"
                data-disabled={!enableDevtools ? true : false}
              >
                <input
                  type="number"
                  min={minResTime + 10} // making sure the max isn't lower than the min
                  max={60000}
                  step="100"
                  id="max-response-time"
                  value={maxResTime}
                  onChange={(e) => {
                    setDevtoolsState((state) => ({
                      ...state,
                      maxResTime: Number(e.target.value),
                    }));
                  }}
                  disabled={!enableDevtools}
                />
                <label htmlFor="max-response-time">max response time</label>
              </div>
              <div
                className="form-field"
                data-disabled={!enableDevtools ? true : false}
              >
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  id="error-rate"
                  value={errorRate}
                  onChange={(e) =>
                    setDevtoolsState((state) => ({
                      ...state,
                      errorRate: Number(e.target.value),
                    }))
                  }
                  disabled={!enableDevtools}
                />
                <label htmlFor="error-rate">error rate</label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Portal>
  );
}

export { DevtoolsProvider, Devtools };
