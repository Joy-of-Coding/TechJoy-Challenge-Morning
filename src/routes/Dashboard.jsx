import React from "react";
import MosaicReveal from "../components/MosaicReveal";
import WelcomeLanding from "../components/WelcomeLanding";
import programmingBee from "../assets/programmingBee.jpg";
import flashdanceBee from "../assets/flashdanceBee.jpg";
import meditatingBee from "../assets/meditatingBee.jpg";
import { loadAllEntries } from "../utils/localStorage";

// Kept as base configuration without the static goal
const INITIAL_CATEGORIES = [
  {
    name: "Coding",
    key: "coding",
    image: programmingBee,
  },
  {
    name: "Physical Health",
    key: "physical",
    image: flashdanceBee,
  },
  {
    name: "Mental Health",
    key: "mental",
    image: meditatingBee,
  },
];

// Helper array to generate the allowed goals [4, 6, 8, 10, 12, 14, 16]
const ALLOWED_GOALS = [4, 6, 8, 10, 12, 14, 16];

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
    return { coding: [], physical: [], mental: [] };
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

    return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  } catch (error) {
    console.error("Error getting recent activity:", error);
    return [];
  }
};

const Dashboard = ({
  entries = [],
  physicalEntries = [],
  mentalEntries = [],
  sessionLimit = 4, // <-- dw -- Add here with a fallback default
}) => {
  const [habitData, setHabitData] = React.useState(() => getHabitData());
  const [recentActivity, setRecentActivity] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
// dw - Initialize goals state dynamically using the passed prop 4 or 16 sessions
  const [categoryGoals, setCategoryGoals] = React.useState({
    coding: sessionLimit,
    physical: sessionLimit,
    mental: sessionLimit,
  });

  // dw must comment out of going to have selectable goals of 4 or 16
  // Dynamic goals state initialized to 16 for each category mapping
  //const [categoryGoals, setCategoryGoals] = React.useState({
  //  coding: 16,
  //  physical: 16,
  //  mental: 16,
  //});

  const updateHabitData = React.useCallback(() => {
    if (isLoading) return;
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

  const handleManualRefresh = React.useCallback(() => {
    updateHabitData();
  }, [updateHabitData]);

  // Handler to safely update a category goal when selected
  const handleGoalChange = (categoryKey, newGoal) => {
    setCategoryGoals((prev) => ({
      ...prev,
      [categoryKey]: parseInt(newGoal, 10),
    }));
  };

  React.useEffect(() => {
    const onStorage = () => updateHabitData();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [updateHabitData]);

  React.useEffect(() => {
    const onCustomStorage = () => updateHabitData();
    window.addEventListener("habitDataUpdated", onCustomStorage);
    return () => window.removeEventListener("habitDataUpdated", onCustomStorage);
  }, [updateHabitData]);

  // dw Keep the state updated if the prop changes while Dashboard is mounted
  React.useEffect(() => {
    setCategoryGoals({
      coding: sessionLimit,
      physical: sessionLimit,
      mental: sessionLimit,
    });
  }, [sessionLimit]);

  const propsDataString = React.useMemo(() => {
    return JSON.stringify({
      entries: entries.map((e) => ({ date: e.date, value: e.value || e.hours })),
      physical: physicalEntries.map((e) => ({ date: e.date, value: e.value })),
      mental: mentalEntries.map((e) => ({ date: e.date, value: e.value })),
    });
  }, [entries, physicalEntries, mentalEntries]);

  React.useEffect(() => {
    const updatedData = {
   // dw these are commented out to allow all trackers, you need to 
   //   apply .slice(0, sessionLimit) to the entries inside your 
   //   useEffect blocks before they get grouped or sent to the state.
   //
   //   coding: entries.map((entry) => entry.date),
   //   physical: physicalEntries.map((entry) => entry.date),
   //   mental: mentalEntries.map((entry) => entry.date),
    //  dw -Fix: Limit the raw dates mapped into habitData
    coding: entries.slice(0, sessionLimit).map((entry) => entry.date),
    physical: physicalEntries.slice(0, sessionLimit).map((entry) => entry.date),
    mental: mentalEntries.slice(0, sessionLimit).map((entry) => entry.date),
    };

    const activities = [];
  //
  // dw deprecated - this code is for a fixed value of 16 sessions
  //  entries.forEach((entry) => {
  //    activities.push({
  //      category: "Coding",
  //      details: `${entry.value || entry.hours || 0}h session`,
  //      date: entry.date,
  //      timestamp: new Date(entry.date).getTime(),
  ///    });
  //  });
  //

  //
  // dw Fix: Limit the tracking history for the recent activities log table
  entries.slice(0, sessionLimit).forEach((entry) => {
    activities.push({
      category: "Coding",
      details: `${entry.value || entry.hours || 0}h session`,
      date: entry.date,
      timestamp: new Date(entry.date).getTime(),
    });
  });

  physicalEntries.slice(0, sessionLimit).forEach((entry) => {
    activities.push({
      category: "Physical Health",
      details: `${entry.value || 0}h activity`,
      date: entry.date,
      timestamp: new Date(entry.date).getTime(),
    });
  });

  mentalEntries.slice(0, sessionLimit).forEach((entry) => {
    activities.push({
      category: "Mental Health",
      details: `${entry.value || 0}h session`,
      date: entry.date,
      timestamp: new Date(entry.date).getTime(),
    });
  });

  setHabitData(updatedData);
  setRecentActivity(activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10));
}, [propsDataString, sessionLimit]); // Added sessionLimit to dependency array

  //
  //  dw end of varlable session fix
  // 
  
  
  React.useEffect(() => {
    updateHabitData();
  }, []);

  // Recalculates totals using state-driven `categoryGoals` instead of static constants
  const sevenDayTotals = React.useMemo(() => {
    return INITIAL_CATEGORIES.map((cat) => {
      const total = getSevenDayTotal(habitData[cat.key]);
      return {
        ...cat,
        goal: categoryGoals[cat.key],
        total: total,
      };
    });
  }, [habitData, categoryGoals]);

  const totalActions = React.useMemo(() => {
    return sevenDayTotals.reduce((sum, cat) => sum + cat.total, 0);
  }, [sevenDayTotals]);

  const totalPossibleGoal = React.useMemo(() => {
    return sevenDayTotals.reduce((sum, cat) => sum + cat.goal, 0);
  }, [sevenDayTotals]);

  if (totalActions === 0) {
    return <WelcomeLanding />;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-400">Your Habit Dashboard</h1>
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
          const progress = Math.min(cat.total, cat.goal);
          const percentage = Math.round((progress / cat.goal) * 100);
          
          // Dynamically compute grid size. E.g., a goal of 16 yields a 4x4 grid layout.
          // Fallback dynamically adjusts if MosaicReveal depends purely on strict dimensions.
          const computedGridSize = Math.ceil(Math.sqrt(cat.goal));

          return (
            <div
              key={cat.key}
              className="bg-black border-2 border-yellow-400 rounded-lg p-6 shadow-lg flex flex-col justify-between"
            >
              <div className="text-center mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-yellow-400">{cat.name}</h2>
                  
                  {/* Goal Dropdown Selector */}
                  <div className="flex flex-col items-end">
                    <label htmlFor={`goal-${cat.key}`} className="text-xs text-yellow-500 mb-1">
                      Target
                    </label>
                    <select
                      id={`goal-${cat.key}`}
                      value={cat.goal}
                      onChange={(e) => handleGoalChange(cat.key, e.target.value)}
                      className="bg-zinc-900 border border-yellow-400 text-yellow-400 text-xs rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                    >
                      {ALLOWED_GOALS.map((num) => (
                        <option key={num} value={num}>
                          {num} Days
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-yellow-200 mt-4">
                  <span>Progress: {cat.total}/{cat.goal}</span>
                  <span>{percentage}%</span>
                </div>
              </div>

              <div className="mb-4">
                <MosaicReveal
                  imageSrc={cat.image}
                  filledSquares={progress}
                  gridSize={computedGridSize}
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
                  {cat.total >= cat.goal
                    ? "Goal achieved! 🎉"
                    : `${cat.goal - cat.total} more to reach your goal`}
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
            <div className="text-3xl font-bold text-yellow-400">{totalActions}</div>
            <div className="text-yellow-200">Total Actions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {totalPossibleGoal > 0 ? Math.round((totalActions / totalPossibleGoal) * 100) : 0}%
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
        <h2 className="text-xl font-semibold mb-4 text-yellow-300">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 text-left border-b border-yellow-400 text-yellow-300">Category</th>
                <th className="p-2 text-left border-b border-yellow-400 text-yellow-300">Details</th>
                <th className="p-2 text-left border-b border-yellow-400 text-yellow-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity, idx) => (
                <tr key={`activity-${idx}`} className="border-b border-yellow-900">
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