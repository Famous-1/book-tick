import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { MusicProvider } from "./context/MusicContext";
import { ReadingProvider } from "./context/ReadingContext";
import { HistoryPage } from "./pages/HistoryPage";
import { HomePage } from "./pages/HomePage";
import { TimerPage } from "./pages/TimerPage";

export default function App() {
  return (
    <MusicProvider>
      <ReadingProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              <Route path="timer" element={<TimerPage />} />
              <Route path="history" element={<HistoryPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ReadingProvider>
    </MusicProvider>
  );
}
