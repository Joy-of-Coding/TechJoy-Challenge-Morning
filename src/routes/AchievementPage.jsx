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
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AchievementPage = ({ entries = [], physicalEntries = [], mentalEntries = [] }) => {
  const [timeframe, setTimeframe] = useState("week"); // week, month, year
  const [achievementData, setAchievementData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("coding"); // coding, physical, mental

  // Calculate achievement data based on timeframe
  useEffect(() => {
    const calculateAchievements = () => {
      const now = new Date();
      let startDate = new Date();
      
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

      // Filter entries within the timeframe
      const filteredEntries = currentEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= now;
      });

      // Calculate statistics based on category
      let totalHours, totalSessions, averageHours;
      
      if (selectedCategory === "coding") {
        totalHours = filteredEntries.reduce((sum, entry) => sum + entry.hours, 0);
        totalSessions = filteredEntries.length;
        averageHours = totalSessions > 0 ? (totalHours / totalSessions).toFixed(1) : 0;
      } else {
        // For physical and mental health, use duration instead of hours
        totalHours = filteredEntries.reduce((sum, entry) => sum + entry.duration, 0);
        totalSessions = filteredEntries.length;
        averageHours = totalSessions > 0 ? (totalHours / totalSessions).toFixed(1) : 0;
      }
      
      // Group by day for chart data
      const dailyData = {};
      filteredEntries.forEach(entry => {
        const day = new Date(entry.date).toLocaleDateString();
        if (!dailyData[day]) {
          dailyData[day] = { hours: 0, sessions: 0 };
        }
        if (selectedCategory === "coding") {
          dailyData[day].hours += entry.hours;
        } else {
          dailyData[day].hours += entry.duration;
        }
        dailyData[day].sessions += 1; // Sessions are always whole numbers
      });

      const chartData = Object.entries(dailyData).map(([day, data]) => ({
        day,
        hours: data.hours,
        sessions: data.sessions
      }));

      // Calculate achievements and goals
      const goals = {
        week: { hours: 40, sessions: 7 },
        month: { hours: 160, sessions: 30 },
        year: { hours: 1920, sessions: 365 }
      };

      const currentGoal = goals[timeframe];
      const hoursProgress = Math.min((totalHours / currentGoal.hours) * 100, 100);
      const sessionsProgress = Math.min((totalSessions / currentGoal.sessions) * 100, 100);

      // Achievement badges
      const achievements = [];
      if (totalHours >= currentGoal.hours * 0.5) achievements.push("Halfway Hero");
      if (totalHours >= currentGoal.hours) achievements.push("Goal Crusher");
      if (totalSessions >= currentGoal.sessions * 0.8) achievements.push("Consistency King");
      if (averageHours >= 2) achievements.push("Deep Diver");
      if (filteredEntries.length > 0) achievements.push("Getting Started");

      setAchievementData({
        totalHours,
        totalSessions,
        averageHours,
        chartData,
        hoursProgress,
        sessionsProgress,
        achievements,
        goal: currentGoal
      });
    };

    calculateAchievements();
  }, [entries, physicalEntries, mentalEntries, timeframe, selectedCategory]);

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#fbbf24'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#fbbf24'
        },
        grid: {
          color: '#374151'
        }
      },
      y: {
        ticks: {
          color: '#fbbf24',
          stepSize: 1 // Ensure whole number steps for sessions
        },
        grid: {
          color: '#374151'
        }
      }
    }
  };

  const hoursChartData = {
    labels: achievementData.chartData?.map(item => item.day) || [],
    datasets: [
      {
        label: selectedCategory === "coding" ? 'Hours' : 'Duration',
        data: achievementData.chartData?.map(item => item.hours) || [],
        backgroundColor: '#fbbf24',
        borderColor: '#f59e0b',
        borderWidth: 1,
      },
    ],
  };

  const sessionsChartData = {
    labels: achievementData.chartData?.map(item => item.day) || [],
    datasets: [
      {
        label: selectedCategory === "coding" ? 'Sessions' : 'Activities',
        data: achievementData.chartData?.map(item => Math.round(item.sessions)) || [], // Ensure sessions are whole numbers
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        borderWidth: 3,
        fill: {
          target: 'origin',
          above: 'rgba(251, 191, 36, 0.1)'
        },
        tension: 0.4,
      },
    ],
  };

  // Separate options for sessions chart to ensure whole numbers
  const sessionsChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        stepSize: 1,
        ticks: {
          ...chartOptions.scales.y.ticks,
          callback: function(value) {
            return Math.round(value); // Ensure only whole numbers are displayed
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen text-yellow-400 font-montserrat p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🏆 Achievement Center</h1>
          <p className="text-white text-lg">Track your progress and celebrate your wins!</p>
        </div>

        {/* Category and Timeframe Selectors */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          {/* Category Selector */}
          <div className="bg-gray-900 rounded-lg p-1 border border-yellow-400">
            {[
              { key: "coding", name: "Coding", icon: "💻" },
              { key: "physical", name: "Physical", icon: "💪" },
              { key: "mental", name: "Mental", icon: "🧠" }
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

          {/* Timeframe Selector */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{achievementData.totalHours || 0}</div>
              <div className="text-white">{selectedCategory === "coding" ? "Total Hours" : "Total Duration"}</div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{achievementData.totalSessions || 0}</div>
              <div className="text-white">{selectedCategory === "coding" ? "Sessions" : "Activities"}</div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{achievementData.averageHours || 0}</div>
              <div className="text-white">{selectedCategory === "coding" ? "Avg Hours/Session" : "Avg Duration/Activity"}</div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{achievementData.achievements?.length || 0}</div>
              <div className="text-white">Achievements</div>
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <h3 className="text-xl font-bold mb-4">{selectedCategory === "coding" ? "Hours Progress" : "Duration Progress"}</h3>
            <div className="mb-2 flex justify-between text-sm">
              <span>{achievementData.totalHours || 0} / {achievementData.goal?.hours || 0} {selectedCategory === "coding" ? "hours" : "hours"}</span>
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
            <h3 className="text-xl font-bold mb-4">{selectedCategory === "coding" ? "Sessions Progress" : "Activities Progress"}</h3>
            <div className="mb-2 flex justify-between text-sm">
              <span>{achievementData.totalSessions || 0} / {achievementData.goal?.sessions || 0} {selectedCategory === "coding" ? "sessions" : "activities"}</span>
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
          {/* Hours Chart */}
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <h3 className="text-xl font-bold mb-4">{selectedCategory === "coding" ? "Daily Hours" : "Daily Duration"}</h3>
            <div className="h-80">
              <Bar data={hoursChartData} options={chartOptions} />
            </div>
          </div>

          {/* Sessions Chart */}
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
            <h3 className="text-xl font-bold mb-4">{selectedCategory === "coding" ? "Daily Sessions" : "Daily Activities"}</h3>
            <div className="h-80">
              <Line data={sessionsChartData} options={sessionsChartOptions} />
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gray-900 rounded-lg p-6 border border-yellow-400">
          <h3 className="text-xl font-bold mb-4">🏆 Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievementData.achievements?.map((achievement, index) => (
              <div key={index} className="bg-yellow-400/10 rounded-lg p-4 border border-yellow-400/30">
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
              Every coding session brings you closer to your goals. 
              Consistency is the key to mastery!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementPage; 