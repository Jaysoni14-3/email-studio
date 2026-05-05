import { useState } from "react";
import Landing from "./components/Landing";
import Builder from "./components/Builder";
import VisualBuilderStudio from "./components/VisualBuilderStudio";

export default function App() {
  const [view, setView] = useState("landing");

  if (view === "landing") {
    return <Landing onStart={() => setView("builder")} onOpenVisualBuilder={() => setView("visual-builder")} />;
  }

  if (view === "builder") {
    return <Builder onBack={() => setView("landing")} />;
  }

  if (view === "visual-builder") {
    return <VisualBuilderStudio onBack={() => setView("landing")} />;
  }
}