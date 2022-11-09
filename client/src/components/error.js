import "./styles/error.css";
import Portal from "./portal";

function Error({ msg, retry }) {
  // we use role="alert" for a11y
  // I tried my best to follow best practices regarding a11y
  return (
    <Portal>
      <div className="error-wrapper">
        <div className="error">
          <div className="error-msg" role="alert">
            {msg}
          </div>
          <button
            className="retry-btn"
            onClick={() => {
              retry();
            }}
          >
            retry
          </button>
        </div>
      </div>
    </Portal>
  );
}

export default Error;
