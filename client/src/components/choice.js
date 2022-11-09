import "./styles/choice.css";

function Choice({
  value,
  showResult,
  onClick,
  isSelected,
  isAnswer,
  shouldShowCorrectAnswer,
}) {
  // we want to give feedback to the user based on his choice, and we check if we have a value for `shouldShowCorrectAnswer` coming from the devtools in order to show the correct answer
  let className = "";
  if (showResult && isSelected) {
    if (isAnswer) {
      className = "choice-right-answer";
    } else {
      className = "choice-wrong-answer";
    }
  } else if (showResult && isAnswer && shouldShowCorrectAnswer) {
    className = "choice-right-answer";
  }

  return (
    <div className="choice-wrapper">
      <input
        className="choice-input"
        name="multi-choice"
        type="radio"
        id={value}
        onChange={(e) => {
          onClick(value);
        }}
        checked={isSelected}
      />
      <label htmlFor={value} className={`choice-label ${className}`}>
        {value}
      </label>
    </div>
  );
}

export default Choice;
