import React from "react";
import MosaicReveal from "../components/MosaicReveal";
import WelcomeLanding from "../components/WelcomeLanding";
import programmingBee from "../assets/programmingBee.jpg";
import flashdanceBee from "../assets/flashdanceBee.jpg";
import meditatingBee from "../assets/meditatingBee.jpg";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { loadAllEntries } from "../utils/localStorage";
import { countWeeklyItems } from "../utils/dateCounts";
import {
  DEFAULT_SESSION_GOALS,
  HABIT_CATEGORY_CONFIGS,
  SESSION_GOAL_ERROR_MESSAGES,
  SESSION_GOALS_STORAGE_KEY,
  SESSION_MAX,
  SESSION_MIN,
  getSessionGoalErrorMessage,
} from "../utils/habitConfig";

const HABIT_CATEGORIES = HABIT_CATEGORY_CONFIGS.map((category) => ({
  key: category.key,
  name: category.dashboardName,
  image:
    category.key === "coding"
      ? programmingBee
      : category.key === "physical"
        ? flashdanceBee
        : meditatingBee,
  goal: SESSION_MAX,
}));

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
  const isUpdatingRef = React.useRef(false);

  const [sessionGoals, setSessionGoals] = useLocalStorage(
    SESSION_GOALS_STORAGE_KEY,
    DEFAULT_SESSION_GOALS,
  );
  const [sessionErrors, setSessionErrors] = React.useState(() =>
    Object.fromEntries(HABIT_CATEGORIES.map((c) => [c.key, ""])),
  );

  const handleSessionGoalChange = React.useCallback(
    (key, value) => {
      const num = Number(value);
      const currentGoal = sessionGoals[key] ?? SESSION_MAX;
      const weeklyTotal = countWeeklyItems(habitData[key]);
      const isGoalAchieved = weeklyTotal >= currentGoal;

      if (isGoalAchieved && num < currentGoal) {
        setSessionErrors((prev) => ({
          ...prev,
          [key]: SESSION_GOAL_ERROR_MESSAGES.achievedLock,
        }));
        return;
      }

      const errorMessage = getSessionGoalErrorMessage(num);

      if (errorMessage) {
        setSessionErrors((prev) => ({
          ...prev,
          [key]: errorMessage,
        }));
      } else {
        setSessionErrors((prev) => ({ ...prev, [key]: "" }));
        setSessionGoals((prev) => ({ ...prev, [key]: num }));
      }
    },
    [habitData, sessionGoals, setSessionErrors, setSessionGoals],
  );

  // OPTIMIZED: Memoized update function to prevent unnecessary re-creations
  const updateHabitData = React.useCallback(() => {
    // Replaced: if (isLoading) return;
    if (isUpdatingRef.current) return; // Prevent multiple simultaneous updates

    isUpdatingRef.current = true;
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
      isUpdatingRef.current = false;
    }
  }, []);
  // Replaced dependency list: [isLoading]

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
  }, [entries, physicalEntries, mentalEntries]);
  // Replaced dependency list: [propsDataString]

  // Replaced memo block:
  // const propsDataString = React.useMemo(() => {
  //   return JSON.stringify({
  //     entries: entries.map((e) => ({
  //       date: e.date,
  //       value: e.value || e.hours,
  //     })),
  //     physical: physicalEntries.map((e) => ({ date: e.date, value: e.value })),
  //     mental: mentalEntries.map((e) => ({ date: e.date, value: e.value })),
  //   });
  // }, [entries, physicalEntries, mentalEntries]);

  // OPTIMIZED: Initial load only, no polling
  React.useEffect(() => {
    updateHabitData();
  }, [updateHabitData]);
  // Replaced dependency list: []

  // OPTIMIZED: Memoized calculations to prevent unnecessary re-renders
  const sevenDayTotals = React.useMemo(() => {
    return HABIT_CATEGORIES.map((cat) => {
      const total = countWeeklyItems(habitData[cat.key]);
      return {
        ...cat,
        total: total,
      };
    });
  }, [habitData]);

  const totalActions = React.useMemo(() => {
    const total = sevenDayTotals.reduce((sum, cat) => sum + cat.total, 0);
    return total;
  }, [sevenDayTotals]);

  // Show welcome landing page only when no entries exist at all (any category, any time)
  const hasAnyEntries =
    entries.length > 0 ||
    physicalEntries.length > 0 ||
    mentalEntries.length > 0;

  if (!hasAnyEntries) {
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

      {/* Category Sections with MosaicReveal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {sevenDayTotals.map((cat) => {
          const goal = sessionGoals[cat.key];
          const progress = Math.min(cat.total, goal);
          const percentage = Math.round((progress / goal) * 100);

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
                  <span>
                    Progress: {cat.total}/{goal}
                  </span>
                  <span>{percentage}%</span>
                </div>
                <div className="mt-3 text-left">
                  {cat.total >= goal && (
                    <p className="text-green-400 text-xs mb-1">
                      Weekly goal achieved. You can only increase this goal.
                    </p>
                  )}
                  <label
                    htmlFor={`session-goal-${cat.key}`}
                    className="block text-xs text-yellow-300 mb-1"
                  >
                    Sessions to unlock ({SESSION_MIN}–{SESSION_MAX})
                  </label>
                  <input
                    id={`session-goal-${cat.key}`}
                    type="number"
                    min={cat.total >= goal ? goal : SESSION_MIN}
                    max={SESSION_MAX}
                    value={goal}
                    onChange={(e) =>
                      handleSessionGoalChange(cat.key, e.target.value)
                    }
                    className="w-full bg-black border border-yellow-400 text-yellow-200 rounded px-2 py-1 text-sm"
                  />
                  {sessionErrors[cat.key] && (
                    <p className="text-red-400 text-xs mt-1">
                      {sessionErrors[cat.key]}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <MosaicReveal
                  imageSrc={cat.image}
                  filledSquares={progress}
                  totalSquares={sessionGoals[cat.key]}
                />
              </div>

              <div className="text-center">
                <div className="w-full bg-yellow-950 rounded-full h-2 mb-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-yellow-200 text-sm">
                  {cat.total >= goal
                    ? "Goal achieved! 🎉"
                    : `${goal - cat.total} more to reach your goal`}
                </p>
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
                  HABIT_CATEGORIES.reduce(
                    (sum, cat) => sum + (sessionGoals[cat.key] ?? cat.goal),
                    0,
                  )) *
                  100,
              )}
              %
            </div>
            <div className="text-yellow-200">Overall Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {
                sevenDayTotals.filter(
                  (cat) => cat.total >= (sessionGoals[cat.key] ?? cat.goal),
                ).length
              }
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
