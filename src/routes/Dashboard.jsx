import React from "react";

// This Dashboard page summarizes the user's habit data collected from other pages.
// For this example, we'll use localStorage to simulate collected data from other pages.
// In a real app, you might fetch this from a backend or a global state.

const HABIT_CATEGORIES = [
  { name: "Coding", key: "coding" },
  { name: "Physical", key: "physical" },
  { name: "Mental Health", key: "mental" },
];

// Helper to get habit data from localStorage (or mock data if not present)
function getHabitData() {
  // Example structure: { coding: [timestamp, ...], physical: [...], mental: [...] }
  let data = {};
  try {
    const stored = localStorage.getItem("habitData");
    if (stored) {
      data = JSON.parse(stored);
    }
  } catch (e) {
    // fallback to empty
    data = {};
  }
  // Ensure all categories exist
  HABIT_CATEGORIES.forEach((cat) => {
    if (!Array.isArray(data[cat.key])) data[cat.key] = [];
  });
  return data;
}

// Helper to calculate 7-day totals for a category
function getSevenDayTotal(timestamps) {
  if (!Array.isArray(timestamps)) return 0;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return timestamps.filter((timestamp) => {
    const entryDate = new Date(timestamp);
    return entryDate >= sevenDaysAgo;
  }).length;
}

const Dashboard = ({ entries, achievementsData }) => {
  const [habitData, setHabitData] = React.useState(getHabitData());

  // Listen for changes in localStorage (e.g., from other tabs/pages)
  React.useEffect(() => {
    const onStorage = () => setHabitData(getHabitData());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Calculate 7-day totals for each category
  const sevenDayTotals = HABIT_CATEGORIES.map((cat) => ({
    ...cat,
    total: getSevenDayTotal(habitData[cat.key]),
  }));

  // Calculate summary stats
  const totalActions = sevenDayTotals.reduce((sum, cat) => sum + cat.total, 0);

  // Prepare data for a simple bar chart (no chart library, just a visual)
  const maxCount = Math.max(...sevenDayTotals.map((cat) => cat.total), 1);

  // Achievements data
  const recentAchievements = achievementsData?.achievements?.slice(-3) || [];
  const unreadAchievements = achievementsData?.getUnreadAchievements?.() || [];

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">
        Your Habit Dashboard
      </h1>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {sevenDayTotals.map((cat) => (
          <div
            key={cat.key}
            className="bg-black border-2 border-yellow-400 rounded-lg p-4 flex flex-col items-center shadow-lg"
          >
            <span className="text-lg font-semibold text-yellow-400">
              {cat.name}
            </span>
            <span className="text-4xl font-bold text-white mt-2">
              {cat.total}
            </span>
            <span className="text-sm text-yellow-200 mt-1">actions logged</span>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-yellow-300">
          Habit Activity (Bar Chart)
        </h2>
        <div className="flex items-end justify-between h-48 bg-yellow-950 rounded-lg p-4">
          {sevenDayTotals.map((cat) => {
            const count = cat.total;
            const barHeight = `${(count / maxCount) * 100}%`;
            return (
              <div
                key={cat.key}
                className="flex flex-col items-center flex-1 mx-1"
              >
                <div
                  className="w-full bg-yellow-400 rounded-t"
                  style={{
                    height: barHeight,
                    minHeight: "8px",
                    transition: "height 0.3s",
                  }}
                  title={`${count} actions`}
                ></div>
                <span className="mt-2 text-yellow-200 text-sm text-center">
                  {cat.name}
                </span>
                <span className="text-white text-xs">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Section */}
      {achievementsData && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-yellow-300">
            🏆 Recent Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900 rounded-lg p-4 border border-yellow-400 text-center">
              <div className="text-2xl font-bold text-yellow-400">{achievementsData.achievements?.length || 0}</div>
              <div className="text-gray-300">Total Achievements</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-green-500 text-center">
              <div className="text-2xl font-bold text-green-400">
                {achievementsData.achievements?.filter(a => a.read).length || 0}
              </div>
              <div className="text-gray-300">Viewed</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-purple-500 text-center">
              <div className="text-2xl font-bold text-purple-400">{unreadAchievements.length}</div>
              <div className="text-gray-300">Unread</div>
            </div>
          </div>

          {/* Recent Achievements */}
          {recentAchievements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-yellow-300">Latest Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {recentAchievements.map(achievement => (
                  <div key={achievement.id} className="bg-gray-900 rounded-lg p-3 border border-yellow-400">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🏆</span>
                      <span className="font-semibold text-yellow-400 text-sm">{achievement.title}</span>
                    </div>
                    <p className="text-gray-300 text-xs">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Action */}
          <div className="flex justify-center">
            <a
              href="/achievements"
              className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              View All Achievements
            </a>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2 text-yellow-300">
          Recent Activity
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-yellow-400 bg-black rounded-lg">
            <thead>
              <tr>
                <th className="p-2 text-left border-b border-yellow-400 text-yellow-300">
                  Category
                </th>
                <th className="p-2 text-left border-b border-yellow-400 text-yellow-300">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {HABIT_CATEGORIES.flatMap((cat) =>
                (habitData[cat.key] || []).map((ts, idx) => ({
                  category: cat.name,
                  timestamp: ts,
                  key: `${cat.key}-${idx}-${ts}`,
                })),
              )
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 10)
                .map((row) => (
                  <tr key={row.key} className="border-b border-yellow-900">
                    <td className="p-2 text-yellow-200">{row.category}</td>
                    <td className="p-2 text-white">
                      {new Date(row.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              {totalActions === 0 && (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-yellow-500">
                    No activity logged yet. Start tracking your habits!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
