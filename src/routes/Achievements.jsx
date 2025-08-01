import { useState, useEffect } from "react";
import { useAchievements } from "../hooks/useAchievements";
import AchievementBadge from "../components/AchievementBadge";

const Achievements = () => {
  const {
    achievements,
    markAchievementAsRead,
    getUnreadAchievements
  } = useAchievements();

  const [filterCategory, setFilterCategory] = useState("all");
  const [newAchievements, setNewAchievements] = useState([]);

  useEffect(() => {
    const unreadAchievements = getUnreadAchievements();
    if (unreadAchievements.length > 0) {
      setNewAchievements(unreadAchievements);
    }
  }, [achievements, getUnreadAchievements]);

  const categories = [
    { value: "all", label: "All", icon: "🏆" },
    { value: "coding", label: "Coding", icon: "💻" },
    { value: "physical", label: "Physical", icon: "🏃‍♂️" },
    { value: "mental", label: "Mental Health", icon: "🧠" }
  ];

  const filteredAchievements = achievements.filter(achievement => 
    filterCategory === "all" || achievement.category === filterCategory
  );

  const handleAchievementClick = (achievementId) => {
    markAchievementAsRead(achievementId);
    setNewAchievements(prev => prev.filter(id => id !== achievementId));
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-yellow-400">🏆 Achievements</h1>
        <p className="text-yellow-200">Celebrate your milestones and progress!</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-lg p-4 border border-yellow-400 text-center">
          <div className="text-2xl font-bold text-yellow-400">{achievements.length}</div>
          <div className="text-gray-300">Total Achievements</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 border border-green-500 text-center">
          <div className="text-2xl font-bold text-green-400">
            {achievements.filter(a => a.read).length}
          </div>
          <div className="text-gray-300">Viewed</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 border border-purple-500 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {achievements.filter(a => !a.read).length}
          </div>
          <div className="text-gray-300">Unread</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-900 rounded-lg p-1 border border-yellow-400">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`px-4 py-2 rounded-md transition-colors ${
                filterCategory === cat.value
                  ? "bg-yellow-400 text-black font-bold"
                  : "text-yellow-400 hover:bg-yellow-900"
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map(achievement => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              onMarkAsRead={handleAchievementClick}
              isNew={newAchievements.some(a => a.id === achievement.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">No achievements yet</h3>
            <p className="text-gray-400">Start tracking your habits to earn achievements!</p>
          </div>
        )}
      </div>

      {/* Achievement Types Info */}
      <div className="mt-12 bg-gray-900 rounded-lg p-6 border border-yellow-400">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Achievement Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">🌟 First Session</h3>
            <p className="text-gray-300 text-sm">Earned when you log your first coding session</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">💻 Coding Master</h3>
            <p className="text-gray-300 text-sm">Earned at hour milestones: 10, 25, 50, 100, 250, 500 hours</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">🔥 Session Streak</h3>
            <p className="text-gray-300 text-sm">Earned at session milestones: 5, 10, 25, 50, 100 sessions</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">🏃‍♂️ Physical Champion</h3>
            <p className="text-gray-300 text-sm">Coming soon for physical activity milestones</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements; 