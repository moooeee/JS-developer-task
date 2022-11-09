import { useLayoutEffect } from "react";
import Portal from "./portal.js";
import useLocalStorage from "../hooks/useLocalStorage.js";
import "./styles/darkMode.css";
import { ReactComponent as LightIcon } from "../images/light-icon.svg";
import { ReactComponent as DarkIcon } from "../images/dark-icon.svg";

/**
 * I'm using a handy hook `useLocalStorage` to help with both updating our app state as well as localStorage.
 */

function DarkMode() {
  const [mode, setMode] = useLocalStorage("$$activity-scheme$$", null); // it's important to make it unique to avoid any naming collisions

  const setActivityColorMode = (mode) => {
    setMode(mode);
    document.body.classList = mode;
  };

  useLayoutEffect(() => {
    if (!mode) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches // first we check if the user has a preference for color schemes
      ) {
        setActivityColorMode("dark");
      } else {
        setActivityColorMode("light");
      }
    } else {
      document.body.classList = mode;
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        const newColorScheme = event.matches ? "dark" : "light";
        setActivityColorMode(newColorScheme); // it's important to update the the color scheme if the user changed that from their OS preferences
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMode = () => {
    if (mode === "dark") {
      setActivityColorMode("light");
    } else {
      setActivityColorMode("dark");
    }
  };

  return (
    <Portal>
      <button className="dark-mode-btn" onClick={() => toggleMode()}>
        {mode === "light" ? (
          <LightIcon className="color-mode-icon" />
        ) : (
          <DarkIcon className="color-mode-icon" />
        )}
      </button>
    </Portal>
  );
}

export default DarkMode;
