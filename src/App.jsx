import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Header from "./components/Header";
import Dashboard from "./routes/Dashboard";
import CodingTracker from "./routes/CodingTracker";
import PhysicalTracker from "./routes/PhysicalTracker";
import MentalHealthTracker from "./routes/MentalHealthTracker";
import AchievementPage from "./routes/AchievementPage";

function App() {
  const [entries, setEntries] = useLocalStorage("habit-hive-entries", []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-yellow-400 text-yellow-400 font-montserrat">
        <Header />

        <div className="flex justify-center">
          <main className="w-full max-w-4xl mx-auto p-4">
            <Routes>
              <Route path="/" element={<Dashboard entries={entries} />} />
              <Route
                path="/coding"
                element={
                  <CodingTracker entries={entries} setEntries={setEntries} />
                }
              />
              <Route path="/physical" element={<PhysicalTracker />} />
              <Route path="/mental" element={<MentalHealthTracker />} />
              <Route path="/achievements" element={<AchievementPage entries={entries} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
