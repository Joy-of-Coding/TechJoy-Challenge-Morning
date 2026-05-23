import React from "react";
import MosaicReveal from "../components/MosaicReveal";
import PizzaReveal from "../components/PizzaReveal";
import VoronoiReveal from "../components/VoronoiReveal";
import WelcomeLanding from "../components/WelcomeLanding";
import programmingBee from "../assets/programmingBee.jpg";
import flashdanceBee from "../assets/flashdanceBee.jpg";
import meditatingBee from "../assets/meditatingBee.jpg";
import { loadAllEntries, loadGoals, saveGoals, loadRevealStyle, saveRevealStyle } from "../utils/localStorage";

const STYLE_OPTIONS = [
  { id: "grid",    label: "Grid"   },
  { id: "pizza",   label: "Pizza"  },
  { id: "voronoi", label: "Puzzle" },
];

const HABIT_CATEGORIES = [
  { name: "Coding", key: "coding", image: programmingBee },
  { name: "Physical Health", key: "physical", image: flashdanceBee },
  { name: "Mental Health", key: "mental", image: meditatingBee },
];

// FIXED: Regular function (React.memo is for components, not functions)
const getHabitData = () => {
  try {
    const allEntries = loadAllEntries();
    return {
      coding: allEntries.coding.map((entry) => entry.date),
      physical: allEntries.physical.map((entry) => entry.date),
      mental: allEntries.mentalHealth.map((entry) => entry.date),
    };
  } catch (e) {
    console.error("Error loading habit data:", e);
    return {
      coding: [],
      physical: [],
      mental: [],
    };
  }
};

const getSevenDayTotal = (timestamps) => {
  if (!Array.isArray(timestamps)) return 0;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return timestamps.filter((timestamp) => {
    const entryDate = new Date(timestamp);
    return entryDate >= sevenDaysAgo;
  }).length;
};

const getRecentActivity = () => {
  try {
    const allEntries = loadAllEntries();
    const activities = [];

    // Add activities from all categories
    allEntries.coding.forEach((entry) => {
      activities.push({
        category: "Coding",
        details: `${entry.value || entry.hours || 0}h session`,
        date: entry.date,
        timestamp: new Date(entry.date).getTime(),
      });
    });

    allEntries.physical.forEach((entry) => {
      activities.push({
        category: "Physical Health",
        details: `${entry.value || 0}h activity`,
        date: entry.date,
        timestamp: new Date(entry.date).getTime(),
      });
    });

    allEntries.mentalHealth.forEach((entry) => {
      activities.push({
        category: "Mental Health",
        details: `${entry.value || 0}h session`,
        date: entry.date,
        timestamp: new Date(entry.date).getTime(),
      });
    });

    const result = activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
    return result;
  } catch (error) {
    console.error("Error getting recent activity:", error);
    return [];
  }
};

const Dashboard = ({
  entries = [],
  physicalEntries = [],
  mentalEntries = [],
}) => {
  const [habitData, setHabitData] = React.useState(() => getHabitData());
  const [recentActivity, setRecentActivity] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [goals, setGoals] = React.useState(() => loadGoals());
  const [revealStyle, setRevealStyle] = React.useState(() => loadRevealStyle());

  const handleGoalChange = React.useCallback((key, newGoal) => {
    setGoals((prev) => {
      const updated = { ...prev, [key]: newGoal };
      saveGoals(updated);
      return updated;
    });
  }, []);

  const handleStyleChange = React.useCallback((style) => {
    setRevealStyle(style);
    saveRevealStyle(style);
  }, []);

  // OPTIMIZED: Memoized update function to prevent unnecessary re-creations
  const updateHabitData = React.useCallback(() => {
    if (isLoading) return; // Prevent multiple simultaneous updates

    setIsLoading(true);
    try {
      const newData = getHabitData();
      const activity = getRecentActivity();

      setHabitData(newData);
      setRecentActivity(activity);
    } catch (error) {
      console.error("Error updating habit data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // OPTIMIZED: Manual refresh only - removed aggressive polling
  const handleManualRefresh = React.useCallback(() => {
    updateHabitData();
  }, [updateHabitData]);

  // Listen for storage events from other tabs
  React.useEffect(() => {
    const onStorage = () => updateHabitData();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [updateHabitData]);

  // Listen for custom habit update events
  React.useEffect(() => {
    const onCustomStorage = () => updateHabitData();
    window.addEventListener("habitDataUpdated", onCustomStorage);
    return () =>
      window.removeEventListener("habitDataUpdated", onCustomStorage);
  }, [updateHabitData]);

  // OPTIMIZED: Only update when props actually change, with deep comparison
  const propsDataString = React.useMemo(() => {
    return JSON.stringify({
      entries: entries.map((e) => ({
        date: e.date,
        value: e.value || e.hours,
      })),
      physical: physicalEntries.map((e) => ({ date: e.date, value: e.value })),
      mental: mentalEntries.map((e) => ({ date: e.date, value: e.value })),
    });
  }, [entries, physicalEntries, mentalEntries]);

  React.useEffect(() => {
    const updatedData = {
      coding: entries.map((entry) => entry.date),
      physical: physicalEntries.map((entry) => entry.date),
      mental: mentalEntries.map((entry) => entry.date),
    };

    const activities = [];

    entries.forEach((entry) => {
      activities.push({
        category: "Coding",
        details: `${entry.value || entry.hours || 0}h session`,
        date: entry.date,
        timestamp: new Date(entry.date).getTime(),
      });
    });

    physicalEntries.forEach((entry) => {
      activities.push({
        category: "Physical Health",
        details: `${entry.value || 0}h activity`,
        date: entry.date,
        timestamp: new Date(entry.date).getTime(),
      });
    });

    mentalEntries.forEach((entry) => {
      activities.push({
        category: "Mental Health",
        details: `${entry.value || 0}h session`,
        date: entry.date,
        timestamp: new Date(entry.date).getTime(),
      });
    });

    const sortedActivities = activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    setHabitData(updatedData);
    setRecentActivity(sortedActivities);
  }, [propsDataString]); // OPTIMIZED: Only re-run when stringified props actually change

  // OPTIMIZED: Initial load only, no polling
  React.useEffect(() => {
    updateHabitData();
  }, []); // Empty dependency array - only run once on mount

  // OPTIMIZED: Memoized calculations to prevent unnecessary re-renders
  const sevenDayTotals = React.useMemo(() => {
    return HABIT_CATEGORIES.map((cat) => {
      const total = getSevenDayTotal(habitData[cat.key]);
      return {
        ...cat,
        total,
        goal: goals[cat.key],
      };
    });
  }, [habitData, goals]);

  const totalActions = React.useMemo(() => {
    const total = sevenDayTotals.reduce((sum, cat) => sum + cat.total, 0);
    return total;
  }, [sevenDayTotals]);

  // Show welcome landing page if no progress
  if (totalActions === 0) {
    return <WelcomeLanding />;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-400">
          Your Habit Dashboard
        </h1>
        <button
          onClick={handleManualRefresh}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isLoading
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-yellow-400 text-black hover:bg-yellow-300"
          }`}
        >
          {isLoading ? "🔄 Loading..." : "🔄 Refresh"}
        </button>
      </div>

      {/* Reveal style selector */}
      <div className="flex justify-center gap-3 mb-6">
        {STYLE_OPTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => handleStyleChange(s.id)}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-colors ${
              revealStyle === s.id
                ? "bg-yellow-400 text-black"
                : "border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Category Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {sevenDayTotals.map((cat) => {
          const progress = Math.min(cat.total, cat.goal);
          const percentage = Math.round((progress / cat.goal) * 100);

          return (
            <div
              key={cat.key}
              className="bg-black border-2 border-yellow-400 rounded-lg p-6 shadow-lg"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-yellow-400 mb-2">
                  {cat.name}
                </h2>
                <div className="flex justify-between items-center text-sm text-yellow-200">
                  <span>Progress: {cat.total}/{cat.goal}</span>
                  <span>{percentage}%</span>
                </div>
              </div>

              <div className="mb-4">
                {revealStyle === "grid" && (
                  <MosaicReveal
                    imageSrc={cat.image}
                    filledSquares={progress}
                    goal={cat.goal}
                  />
                )}
                {revealStyle === "pizza" && (
                  <PizzaReveal
                    imageSrc={cat.image}
                    filledSquares={progress}
                    goal={cat.goal}
                  />
                )}
                {revealStyle === "voronoi" && (
                  <VoronoiReveal
                    imageSrc={cat.image}
                    filledSquares={progress}
                    goal={cat.goal}
                  />
                )}
              </div>

              <div className="text-center">
                <div className="w-full bg-yellow-950 rounded-full h-2 mb-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-yellow-200 text-sm">
                  {cat.total >= cat.goal
                    ? "Goal achieved! 🎉"
                    : `${cat.goal - cat.total} more to reach your goal`}
                </p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-yellow-400 mb-1">
                  <span>Session blocks</span>
                  <span className="font-bold">{cat.goal}</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={16}
                  value={cat.goal}
                  onChange={(e) => handleGoalChange(cat.key, Number(e.target.value))}
                  className="w-full accent-yellow-400"
                />
                <div className="flex justify-between text-xs text-yellow-700 mt-1">
                  <span>4</span>
                  <span>16</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-black border-2 border-yellow-400 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-yellow-300 text-center">
          Weekly Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {totalActions}
            </div>
            <div className="text-yellow-200">Total Actions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {Math.round(
                (totalActions /
                  sevenDayTotals.reduce((sum, cat) => sum + cat.goal, 0)) *
                  100,
              )}
              %
            </div>
            <div className="text-yellow-200">Overall Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {sevenDayTotals.filter((cat) => cat.total >= cat.goal).length}
            </div>
            <div className="text-yellow-200">Goals Completed</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-black border-2 border-yellow-400 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-yellow-300">
          Recent Activity
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 text-left border-b border-yellow-400 text-yellow-300">
                  Category
                </th>
                <th className="p-2 text-left border-b border-yellow-400 text-yellow-300">
                  Details
                </th>
                <th className="p-2 text-left border-b border-yellow-400 text-yellow-300">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity, idx) => (
                <tr
                  key={`activity-${idx}`}
                  className="border-b border-yellow-900"
                >
                  <td className="p-2 text-yellow-200">{activity.category}</td>
                  <td className="p-2 text-white">{activity.details}</td>
                  <td className="p-2 text-white">
                    {new Date(activity.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {recentActivity.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-yellow-500">
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
