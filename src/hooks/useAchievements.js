import { useState, useEffect } from "react";

export const useAchievements = () => {
  const [achievements, setAchievements] = useState(() => {
    try {
      const stored = localStorage.getItem("habit-hive-achievements");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading achievements from localStorage:", error);
      return [];
    }
  });

  // Save achievements to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("habit-hive-achievements", JSON.stringify(achievements));
    } catch (error) {
      console.error("Error saving achievements to localStorage:", error);
    }
  }, [achievements]);

  const addAchievement = (achievement) => {
    // Check if achievement already exists
    const exists = achievements.some(a => a.type === achievement.type && a.value === achievement.value);
    if (exists) return;

    const newAchievement = {
      id: Date.now().toString(),
      ...achievement,
      earnedAt: new Date().toISOString(),
      read: false
    };
    setAchievements(prev => [...prev, newAchievement]);
  };

  const markAchievementAsRead = (achievementId) => {
    setAchievements(prev => prev.map(achievement =>
      achievement.id === achievementId
        ? { ...achievement, read: true }
        : achievement
    ));
  };

  const getUnreadAchievements = () => {
    return achievements.filter(achievement => !achievement.read);
  };

  const getAchievementsByCategory = (category) => {
    return achievements.filter(achievement => achievement.category === category);
  };

  const checkCodingAchievements = (entries) => {
    const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
    const totalSessions = entries.length;

    // First session achievement
    if (totalSessions === 1) {
      addAchievement({
        type: 'first_session',
        value: 1,
        title: 'First Coding Session! 🎉',
        description: 'You logged your first coding session. Welcome to the hive!',
        category: 'coding'
      });
    }

    // Hour milestones
    const hourMilestones = [10, 25, 50, 100, 250, 500];
    hourMilestones.forEach(milestone => {
      if (totalHours >= milestone) {
        addAchievement({
          type: 'coding_master',
          value: milestone,
          title: `${milestone} Hours Milestone! 🚀`,
          description: `You've coded for ${milestone} hours total!`,
          category: 'coding'
        });
      }
    });

    // Session milestones
    const sessionMilestones = [5, 10, 25, 50, 100];
    sessionMilestones.forEach(milestone => {
      if (totalSessions >= milestone) {
        addAchievement({
          type: 'session_streak',
          value: milestone,
          title: `${milestone} Sessions Completed! 🔥`,
          description: `You've completed ${milestone} coding sessions!`,
          category: 'coding'
        });
      }
    });
  };

  return {
    achievements,
    addAchievement,
    markAchievementAsRead,
    getUnreadAchievements,
    getAchievementsByCategory,
    checkCodingAchievements
  };
}; 