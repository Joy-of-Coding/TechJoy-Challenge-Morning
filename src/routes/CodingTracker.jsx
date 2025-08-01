import { useState } from "react";
import MosaicReveal from "../components/MosaicReveal";
import codingImage from "../assets/codingImage.jpg";

const CodingTracker = ({ entries, setEntries, achievementsData }) => {
  const [hours, setHours] = useState("");
  const [showMosaic, setShowMosaic] = useState(false);

  // Check if user has already logged an entry today
  const hasLoggedToday = () => {
    const today = new Date().toDateString();
    return entries.some((entry) => entry.date === today);
  };

  // Get today's entries count
  const getTodayEntriesCount = () => {
    const today = new Date().toDateString();
    return entries.filter((entry) => entry.date === today).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hours) return;

    const newEntry = {
      hours: parseFloat(hours),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toDateString(),
    };

    setEntries([...entries, newEntry]);
    setHours("");
    setShowMosaic(true);

    // Check for achievements after adding the new entry
    if (achievementsData) {
      const updatedEntries = [...entries, newEntry];
      achievementsData.checkCodingAchievements(updatedEntries);
    }

    // Hide mosaic after 12 seconds
    setTimeout(() => setShowMosaic(false), 12000);
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all your coding data? This cannot be undone.",
      )
    ) {
      setEntries([]);
    }
  };

  // Calculate progress metrics
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalSessions = entries.length;
  const averageHours =
    totalSessions > 0 ? (totalHours / totalSessions).toFixed(1) : 0;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-yellow-400">
          🐝 Coding Tracker
        </h1>
        <p className="text-yellow-200">
          Track your coding sessions and build your hive!
        </p>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-black border-2 border-yellow-400 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{totalHours}</div>
          <div className="text-yellow-200">Total Hours</div>
        </div>
        <div className="bg-black border-2 border-yellow-400 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{totalSessions}</div>
          <div className="text-yellow-200">Total Sessions</div>
        </div>
        <div className="bg-black border-2 border-yellow-400 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{averageHours}</div>
          <div className="text-yellow-200">Avg Hours/Session</div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-black border-2 border-yellow-400 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-yellow-400">
          Log Your Coding Session
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="hours"
              className="block text-yellow-400 text-sm font-semibold mb-2"
            >
              Hours Coded Today
            </label>
            <input
              type="number"
              id="hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              min="0.1"
              step="0.1"
              placeholder="e.g., 2.5"
              className="w-full p-3 rounded-lg border-2 border-yellow-400 bg-gray-800 text-yellow-400 placeholder-yellow-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-300 transition-colors"
          >
            🐝 Log Session
          </button>
        </form>

        {/* Today's Status */}
        {hasLoggedToday() && (
          <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-400 rounded-lg">
            <p className="text-yellow-400 text-sm">
              ✅ You've logged {getTodayEntriesCount()} session(s) today
            </p>
          </div>
        )}
      </div>

      {/* Recent Entries */}
      <div className="bg-black border-2 border-yellow-400 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-yellow-400">Recent Entries</h2>
          {entries.length > 0 && (
            <button
              onClick={handleClearData}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Clear All Data
            </button>
          )}
        </div>
        {entries.length === 0 ? (
          <p className="text-yellow-500 text-center py-8">
            No coding sessions logged yet. Start building your hive!
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {entries
              .slice()
              .reverse()
              .map((entry, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-yellow-400/30"
                >
                  <div>
                    <span className="text-yellow-400 font-semibold">
                      {entry.hours} hours
                    </span>
                    <span className="text-gray-400 ml-2">on {entry.date}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{entry.time}</span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Mosaic Reveal */}
      {showMosaic && <MosaicReveal />}
    </div>
  );
};

export default CodingTracker;
