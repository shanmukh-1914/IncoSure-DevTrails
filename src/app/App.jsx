import { RouterProvider } from "react-router";
import { router } from "./routes";
import { DarkModeProvider } from "./hooks/useDarkMode.jsx";
import { ThemeToggle } from "./components/ThemeToggle";
import { SessionLockChip } from "./components/SessionLockChip";

function App() {
  return (
    <DarkModeProvider>
      <SessionLockChip />
      <ThemeToggle />
      <RouterProvider router={router} />
    </DarkModeProvider>
  );
}

export default App;
