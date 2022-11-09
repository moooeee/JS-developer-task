import { ErrorBoundary } from "react-error-boundary";

// we want to gracefully handle any errors that can occur during rendering

function ErrorBoundaryComp({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={
        <div>Ooops!, something wrong happend, refresh the page.</div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundaryComp;
