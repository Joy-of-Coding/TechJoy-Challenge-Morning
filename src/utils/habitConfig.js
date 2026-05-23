export const SESSION_MIN = 4;
export const SESSION_MAX = 16;
export const SESSION_GOALS_STORAGE_KEY = "habit-hive-session-goals";

export const HABIT_CATEGORY_CONFIGS = [
  {
    key: "coding",
    dashboardName: "Coding",
    achievementName: "Coding",
    categoryButtonName: "Coding",
    totalLabel: "Total Hours",
    averageLabel: "Avg Hours/Session",
    progressHoursLabel: "Hours Progress",
    progressSessionsLabel: "Sessions Progress",
    dailyHoursLabel: "Daily Hours",
    dailySessionsLabel: "Daily Sessions",
    datasetHoursLabel: "Hours",
    datasetSessionsLabel: "Sessions",
    sessionsUnit: "sessions",
  },
  {
    key: "physical",
    dashboardName: "Physical Health",
    achievementName: "Physical",
    categoryButtonName: "Physical",
    totalLabel: "Total Duration",
    averageLabel: "Avg Duration/Activity",
    progressHoursLabel: "Duration Progress",
    progressSessionsLabel: "Activities Progress",
    dailyHoursLabel: "Daily Duration",
    dailySessionsLabel: "Daily Activities",
    datasetHoursLabel: "Duration",
    datasetSessionsLabel: "Activities",
    sessionsUnit: "activities",
  },
  {
    key: "mental",
    dashboardName: "Mental Health",
    achievementName: "Mental",
    categoryButtonName: "Mental",
    totalLabel: "Total Duration",
    averageLabel: "Avg Duration/Activity",
    progressHoursLabel: "Duration Progress",
    progressSessionsLabel: "Activities Progress",
    dailyHoursLabel: "Daily Duration",
    dailySessionsLabel: "Daily Activities",
    datasetHoursLabel: "Duration",
    datasetSessionsLabel: "Activities",
    sessionsUnit: "activities",
  },
];

export const HABIT_CATEGORY_MAP = Object.fromEntries(
  HABIT_CATEGORY_CONFIGS.map((category) => [category.key, category]),
);

export const DEFAULT_SESSION_GOALS = Object.fromEntries(
  HABIT_CATEGORY_CONFIGS.map((category) => [category.key, SESSION_MAX]),
);

export const SESSION_GOAL_ERROR_MESSAGES = {
  belowMin: `Minimum ${SESSION_MIN} sessions must be selected.`,
  aboveMax: `No more than ${SESSION_MAX} sessions can be selected.`,
  achievedLock:
    "Goal already achieved for this week. You can only increase your session goal.",
};

export const getSessionGoalErrorMessage = (value) => {
  if (value < SESSION_MIN) return SESSION_GOAL_ERROR_MESSAGES.belowMin;
  if (value > SESSION_MAX) return SESSION_GOAL_ERROR_MESSAGES.aboveMax;
  return "";
};
