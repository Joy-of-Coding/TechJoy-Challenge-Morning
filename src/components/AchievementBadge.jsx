import { useState, useEffect } from "react";

const AchievementBadge = ({ achievement, onMarkAsRead, isNew = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isNew) {
      setIsVisible(true);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const getAchievementIcon = (type) => {
    const icons = {
      first_session: "🌟",
      coding_master: "💻",
      session_streak: "🔥",
      physical_champion: "🏃‍♂️",
      mental_warrior: "🧠"
    };
    return icons[type] || "🎯";
  };

  const getAchievementColor = (type) => {
    const colors = {
      first_session: "border-blue-500 bg-blue-900/20",
      coding_master: "border-yellow-500 bg-yellow-900/20",
      session_streak: "border-orange-500 bg-orange-900/20",
      physical_champion: "border-green-500 bg-green-900/20",
      mental_warrior: "border-purple-500 bg-purple-900/20"
    };
    return colors[type] || "border-yellow-400 bg-yellow-900/20";
  };

  const handleClick = () => {
    if (!achievement.read) {
      onMarkAsRead(achievement.id);
    }
  };

  return (
    <div
      className={`relative transition-all duration-500 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div
        onClick={handleClick}
        className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 hover:scale-105 ${
          getAchievementColor(achievement.type)
        } ${achievement.read ? "opacity-75" : "opacity-100"}`}
      >
        {/* New Achievement Animation */}
        {isNew && isAnimating && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-black text-xs font-bold">NEW</span>
          </div>
        )}

        {/* Unread Indicator */}
        {!achievement.read && !isNew && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse" />
        )}

        <div className="flex items-center gap-3">
          <div className="text-3xl">
            {getAchievementIcon(achievement.type)}
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${
              achievement.read ? "text-gray-400" : "text-yellow-400"
            }`}>
              {achievement.title}
            </h3>
            <p className={`text-sm ${
              achievement.read ? "text-gray-500" : "text-gray-300"
            }`}>
              {achievement.description}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(achievement.earnedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Category Badge */}
        {achievement.category && (
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-gray-800 text-yellow-400 text-xs rounded-full">
              {achievement.category}
            </span>
          </div>
        )}
      </div>

      {isNew && isAnimating && (
        <div className="absolute inset-0 bg-yellow-400/20 rounded-xl animate-ping pointer-events-none" />
      )}
    </div>
  );
};

export default AchievementBadge; 