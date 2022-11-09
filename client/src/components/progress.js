import "./styles/progress.css"

function Progress({ progressValue }) {
  return (
    <div className="progress">
      <div className="progress-bar-wrapper">
        <div className="progress-bar" style={{ width: `${progressValue}%` }} />
      </div>
      <div className="progress-value">{progressValue}%</div>
    </div>
  )
}

export default Progress
