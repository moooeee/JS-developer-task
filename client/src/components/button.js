import "./styles/button.css";

function Button({ children, ...rest }) {
  return (
    <button className="primary-btn" {...rest}>
      {children}
    </button>
  );
}

export default Button;
