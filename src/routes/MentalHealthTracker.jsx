import { useState } from "react";

const MentalHealthTracker = ({ entries = [], setEntries }) => {
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [mood, setMood] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activity || !duration || !mood) return;

    const newEntry = {
      activity: activity,
      duration: parseFloat(duration),
      mood: mood,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toDateString(),
    };

    setEntries([...entries, newEntry]);
    setActivity("");
    setDuration("");
    setMood("");

    // Dispatch custom event to notify dashboard of data update
    window.dispatchEvent(new CustomEvent("habitDataUpdated"));
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all your mental health data? This cannot be undone.",
      )
    ) {
      setEntries([]);
    }
  };

  // Calculate progress metrics
  const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
  const totalActivities = entries.length;
  const averageDuration =
    totalActivities > 0 ? (totalDuration / totalActivities).toFixed(1) : 0;

  // Calculate average mood
  const moodScores = {
    "Very Happy": 5,
    "Happy": 4,
    "Neutral": 3,
    "Sad": 2,
    "Very Sad": 1
  };
  
  const averageMoodScore = totalActivities > 0 
    ? (entries.reduce((sum, entry) => sum + moodScores[entry.mood], 0) / totalActivities).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen text-yellow-400 font-montserrat p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🧠 Mental Health Tracker</h1>
          <p className="text-white text-lg">Track your mental wellness activities and mood!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{totalDuration}</div>
              <div className="text-white">Total Hours</div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{totalActivities}</div>
              <div className="text-white">Activities</div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{averageDuration}</div>
              <div className="text-white">Avg Hours/Activity</div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{averageMoodScore}</div>
              <div className="text-white">Avg Mood (1-5)</div>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400 mb-8">
          <h2 className="text-2xl font-bold mb-4">Log Mental Health Activity</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="activity" className="block text-white mb-2">
                Activity Type
              </label>
              <input
                type="text"
                id="activity"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="e.g., Meditation, Reading, Therapy, Journaling"
                className="w-full p-3 rounded-lg bg-gray-800 border border-yellow-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            <div>
              <label htmlFor="duration" className="block text-white mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 0.5"
                step="0.1"
                min="0"
                className="w-full p-3 rounded-lg bg-gray-800 border border-yellow-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            <div>
              <label htmlFor="mood" className="block text-white mb-2">
                Mood After Activity
              </label>
              <select
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-yellow-400 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              >
                <option value="">Select your mood</option>
                <option value="Very Happy">😊 Very Happy</option>
                <option value="Happy">🙂 Happy</option>
                <option value="Neutral">😐 Neutral</option>
                <option value="Sad">😔 Sad</option>
                <option value="Very Sad">😢 Very Sad</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-300 transition-colors duration-200"
            >
              Log Activity
            </button>
          </form>
        </div>

        {/* Recent Entries */}
        <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Activities</h2>
            <button
              onClick={handleClearData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Clear All Data
            </button>
          </div>
          {entries.length === 0 ? (
            <p className="text-white text-center py-8">No activities logged yet. Start tracking your mental health!</p>
          ) : (
            <div className="space-y-3">
              {entries.slice(-10).reverse().map((entry, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4 border border-yellow-400/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-yellow-400 font-semibold">{entry.activity}</div>
                      <div className="text-white text-sm">{entry.date} at {entry.time}</div>
                      <div className="text-white text-sm">Mood: {entry.mood}</div>
                    </div>
                    <div className="text-yellow-400 font-bold">{entry.duration}h</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentalHealthTracker;
