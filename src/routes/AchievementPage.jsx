import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

const AchievementPage = ({
  entries = [],
  physicalEntries = [],
  mentalEntries = [],
  sessionLimit = 4,     // <-- dw - defal tlimit to 4  
  setSessionLimit,  // <-- dw - limit to 4 or 16 sessions - Add here
}) => {
  const [timeframe, setTimeframe] = useState("week"); // week, month, year
  const [achievementData, setAchievementData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("coding"); // coding, physical, mental
  const [refreshTrigger, setRefreshTrigger] = useState(0);

// dw Immediate debug logging
  console.log("AchievementPage Props:", {
    entriesLength: entries.length,
    physicalEntriesLength: physicalEntries.length,
    mentalEntriesLength: mentalEntries.length,
    entries: entries,
    physicalEntries: physicalEntries,
    mentalEntries: mentalEntries,
  });

// dw - to limit the choices to 4 or 16 sessions: 
//  const [sessionLimit, setSessionLimit] = useState(4); // 4 or 16

  // Immediate debug logging
  console.log("AchievementPage Props:", {
    entriesLength: entries.length,
    physicalEntriesLength: physicalEntries.length,
    mentalEntriesLength: mentalEntries.length,
    entries: entries,
    physicalEntries: physicalEntries,
    mentalEntries: mentalEntries,
  });

  // Calculate achievement data based on timeframe
  useEffect(() => {
    const calculateAchievements = () => {
      const now = new Date();
      let startDate = new Date();
//
//  dw Find this section inside the calculateAchievements function in AchievementPage.jsx:
//   dw  Filter entries within the timeframe
//
//  dw moved switch here per AI recommendeation
//      
    switch (timeframe) {
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 7);
      } 

// Get the appropriate entries based on selected category
      let currentEntries = [];
      switch (selectedCategory) {
        case "coding":
          currentEntries = entries;
          break;
        case "physical":
          currentEntries = physicalEntries;
          break;
        case "mental":
          currentEntries = mentalEntries;
          break;
        default:
          currentEntries = entries;
      }

      console.log(`Achievement Page Debug - ${selectedCategory}:`, {
        totalEntries: currentEntries.length,
        entries: currentEntries,
        selectedCategory,
        timeframe,
        startDate: startDate.toDateString(),
        endDate: now.toDateString(),
      });

      //
      //  dw trying to fix blank page 10 PM 
      //
      const unfilteredTimeframeEntries = currentEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= now;
      });

      // dw -Fix: new place add 9 PM - Slice the timeframe entries array down to the user-selected session limit
      // did not solve the blank page problem!
      const filteredEntries = unfilteredTimeframeEntries.slice(0, sessionLimit);

      console.log(`Filtered entries for ${selectedCategory}:`, filteredEntries);

    // dw - 5. Safely declare variables and compute math statistics
      const totalHours = filteredEntries.reduce((sum, entry) => sum + (entry.value || 0), 0); 
      const rawSessions = filteredEntries.length;
      const totalSessions = Math.min(rawSessions, sessionLimit);  

           //
      // between 4 and 16 inclusiveMath.max(4, Math.min(16, rawSessions));
      // dw commented out:  totalSessions = filteredEntries.length;
      //end of dw added code
      //   
      const averageHours =
        totalSessions > 0 ? (totalHours / totalSessions).toFixed(1) : 0;

      // dw  Calculate statistics
      //let totalHours, totalSessions, averageHours;
      //let totalSessions,averageHours; 
      // dw -All trackers now use 'value' field (coding, physical, mental)
      //totalHours = filteredEntries.reduce((sum, entry) => sum + entry.value, 0); 
      // - dw  You can now clean this up safely since filteredEntries length is 
      //        already restricted:
      //totalSessions = filteredEntries.length;

      // Group by day for chart data
      const dailyData = {};
      filteredEntries.forEach((entry) => {
        const day = new Date(entry.date).toLocaleDateString();
        if (!dailyData[day]) {
          dailyData[day] = { hours: 0, sessions: 0 };
        }
        dailyData[day].hours += entry.value; // Use value field for all categories
        dailyData[day].sessions += 1; // Sessions are always whole numbers
      });

      const chartData = Object.entries(dailyData).map(([day, data]) => ({
        day,
        hours: data.hours,
        sessions: data.sessions,
      }));

      // Calculate achievements and goals
      const goals = {
        week: { hours: 40, sessions: 7 },
        month: { hours: 160, sessions: 30 },
        year: { hours: 1920, sessions: 365 },
      };
 
const currentGoal = goals[timeframe];
      const hoursProgress = Math.min(
        (totalHours / currentGoal.hours) * 100,
        100
      );
      const sessionsProgress = Math.min(
        (totalSessions / currentGoal.sessions) * 100,
        100
      );
      

// Achievement badges
      const achievements = [];
      if (totalHours >= currentGoal.hours * 0.5) achievements.push("Halfway Hero");
      if (totalHours >= currentGoal.hours) achievements.push("Goal Crusher");
      if (totalSessions >= currentGoal.sessions * 0.8) achievements.push("Consistency King");
      if (Number(averageHours) >= 2) achievements.push("Deep Diver");
      if (filteredEntries.length > 0) achievements.push("Getting Started");

      setAchievementData({
        totalHours,
        totalSessions,
        averageHours,
        chartData,
        hoursProgress,
        sessionsProgress,
        achievements,
        goal: currentGoal,
      });
    };

    calculateAchievements();
  }, [
    entries,
    physicalEntries,
    mentalEntries,
    timeframe,
    selectedCategory,
    refreshTrigger,
    sessionLimit    
  ]);

  // Listen for data updates from trackers
  useEffect(() => {
    const handleDataUpdate = () => {
      console.log("Achievement page received data update event");
      setRefreshTrigger((prev) => prev + 1);
    };

    window.addEventListener("habitDataUpdated", handleDataUpdate);

    return () => {
      window.removeEventListener("habitDataUpdated", handleDataUpdate);
    };
  }, []);

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#fbbf24",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#fbbf24",
        },
        grid: {
          color: "#374151",
        },
      },
      y: {
        ticks: {
          color: "#fbbf24",
          stepSize: 1, 
        },
        grid: {
          color: "#374151",
        },
      },
    },
  };

  const hoursChartData = {
    labels: achievementData.chartData?.map((item) => item.day) || [],
    datasets: [
      {
        label: selectedCategory === "coding" ? "Hours" : "Duration",
        data: achievementData.chartData?.map((item) => item.hours) || [],
        backgroundColor: "#fbbf24",
        borderColor: "#f59e0b",
        borderWidth: 1,
      },
    ],
  };

  const sessionsChartData = {
    labels: achievementData.chartData?.map((item) => item.day) || [],
    datasets: [
      {
        label: selectedCategory === "coding" ? "Sessions" : "Activities",
        data: achievementData.chartData?.map((item) => Math.round(item.sessions)) || [], 
        borderColor: "#fbbf24",
        backgroundColor: "rgba(251, 191, 36, 0.1)",
        borderWidth: 3,
        fill: {
          target: "origin",
          above: "rgba(251, 191, 36, 0.1)",
        },
        tension: 0.4,
      },
    ],
  };

  const sessionsChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        stepSize: 1,
        ticks: {
          ...chartOptions.scales.y.ticks,
          callback: function (value) {
            return Math.round(value); 
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen text-yellow-400 font-montserrat p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🏆 Achievement Center</h1>
          <p className="text-white text-lg">
            Track your progress and celebrate your wins!
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setRefreshTrigger((prev) => prev + 1)}
              className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors duration-200"
            >
              🔄 Refresh Data
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to clear all data? This will start fresh with no previous session data."
                  )
                ) {
                  localStorage.removeItem("habit-hive-coding-entries");
                  localStorage.removeItem("habit-hive-physical-entries");
                  localStorage.removeItem("habit-hive-mental-health-entries");
                  window.location.reload();
                }
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              🗑️ Clear All Data
            </button>
          </div>
        </div>

        {/* Category and Timeframe Selectors */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-1 border border-yellow-400">
            {[
              { key: "coding", name: "Coding", icon: "💻" },
              { key: "physical", name: "Physical", icon: "💪" },
              { key: "mental", name: "Mental", icon: "🧠" },
            ].map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
                  selectedCategory === category.key
                    ? "bg-yellow-400 text-black"
                    : "text-yellow-400 hover:bg-yellow-900"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          <div className="bg-gray-900 rounded-lg p-1 border border-yellow-400">
            {["week", "month", "year"].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${
                  timeframe === period
                    ? "bg-yellow-400 text-black"
                    : "text-yellow-400 hover:bg-yellow-900"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Session Limit Selector */}
        <div className="flex justify-center items-center gap-3 mb-8">
          <span className="text-white font-semibold">Target Sessions:</span>
          <div className="bg-gray-900 rounded-lg p-1 border border-yellow-400 inline-flex">
            {[4, 16].map((limit) => (
              <button
                key={limit}
                onClick={() => setSessionLimit && setSessionLimit(limit)}
                className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${
                  sessionLimit === limit
                    ? "bg-yellow-400 text-black"
                    : "text-yellow-400 hover:bg-yellow-900"
                }`}
              >
                {limit} Sessions
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {achievementData.totalHours || 0}
              </div>
              <div className="text-white">
                {selectedCategory === "coding" ? "Total Hours" : "Total Duration"}
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {achievementData.totalSessions || 0}
              </div>
              <div className="text-white">
                {selectedCategory === "coding" ? "Sessions" : "Activities"}
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {achievementData.averageHours || 0}
              </div>
              <div className="text-white">
                {selectedCategory === "coding"
                  ? "Avg Hours/Session"
                  : "Avg Duration/Activity"}
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {achievementData.achievements?.length || 0}
              </div>
              <div className="text-white">Achievements</div>
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <h3 className="text-xl font-bold mb-4">
              {selectedCategory === "coding" ? "Hours Progress" : "Duration Progress"}
            </h3>
            <div className="mb-2 flex justify-between text-sm">
              <span>
                {achievementData.totalHours || 0} / {achievementData.goal?.hours || 0} hours
              </span>
              <span>{Math.round(achievementData.hoursProgress || 0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div
                className="bg-yellow-400 h-4 rounded-full transition-all duration-500"
                style={{ width: `${achievementData.hoursProgress || 0}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <h3 className="text-xl font-bold mb-4">
              {selectedCategory === "coding" ? "Sessions Progress" : "Activities Progress"}
            </h3>
            <div className="mb-2 flex justify-between text-sm">
              <span>
                {achievementData.totalSessions || 0} / {achievementData.goal?.sessions || 0}{" "}
                {selectedCategory === "coding" ? "sessions" : "activities"}
              </span>
              <span>{Math.round(achievementData.sessionsProgress || 0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div
                className="bg-yellow-400 h-4 rounded-full transition-all duration-500"
                style={{ width: `${achievementData.sessionsProgress || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <h3 className="text-xl font-bold mb-4">
              {selectedCategory === "coding" ? "Daily Hours" : "Daily Duration"}
            </h3>
            <div className="h-80">
              <Bar data={hoursChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <h3 className="text-xl font-bold mb-4">
              {selectedCategory === "coding" ? "Daily Sessions" : "Daily Activities"}
            </h3>
            <div className="h-80">
              <Line data={sessionsChartData} options={sessionsChartOptions} />
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
          <h3 className="text-xl font-bold mb-4">🏆 Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievementData.achievements?.map((achievement, index) => (
              <div
                key={index}
                className="bg-yellow-400/10 rounded-lg p-4 border border-yellow-400/30"
              >
                <div className="text-yellow-400 font-semibold">{achievement}</div>
                <div className="text-white text-sm mt-1">Keep up the great work!</div>
              </div>
            ))}
            {(!achievementData.achievements || achievementData.achievements.length === 0) && (
              <div className="col-span-full text-center text-white py-8">
                <div className="text-4xl mb-2">🎯</div>
                <div>Start tracking your progress to earn achievements!</div>
              </div>
            )}
          </div>
        </div>

        {/* Motivation Section */}
        <div className="mt-8 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 rounded-lg p-6 border border-yellow-400/30">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">💪 Keep Going!</h3>
            <p className="text-white text-lg">
              Every coding session brings you closer to your goals. Consistency is the key to mastery!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementPage;      
