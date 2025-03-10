import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import Home from "@/pages/home";
import KS3 from "@/pages/ks3";
import GCSE from "@/pages/gcse";
import AS from "@/pages/as";
import ArticlePage from "@/pages/article";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/ks3" component={KS3} />
          <Route path="/gcse" component={GCSE} />
          <Route path="/as" component={AS} />
          <Route path="/ks3/article" component={ArticlePage} />
          <Route path="/gcse/article" component={ArticlePage} />
          <Route path="/as/article" component={ArticlePage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;