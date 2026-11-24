import { Switch, Route, Router as WouterRouter } from "wouter";
import { ThemeProvider } from "@/components/ThemeProvider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Stats from "@/pages/stats";

const base = import.meta.env.VITE_BASE_URL || "/";

function Router() {
  return (
    <WouterRouter base={base}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/stats" component={Stats} />
        <Route path="/stats/" component={Stats} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
