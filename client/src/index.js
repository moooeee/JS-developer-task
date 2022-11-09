import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Devtools, DevtoolsProvider } from "./components/devtools";
import DarkMode from "./components/darkMode";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // we don't want to re-fetch wordsList on tab change or tab refocus
      networkMode: "always", // because we're not deploying it, we don't care about the network condition, we are using localhost
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <DevtoolsProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <Devtools />
        <DarkMode />
      </QueryClientProvider>
    </DevtoolsProvider>
  </ErrorBoundary>
);
