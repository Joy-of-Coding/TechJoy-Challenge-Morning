import HabitTracker from "../components/HabitTracker";
import { useLocalStorage } from "../hooks/useLocalStorage";
import flashdanceBee from "../assets/flashdanceBee.jpg";

const physicalConfig = {
  title: "Your Physical Hive",
  imageSrc: flashdanceBee,
  entryLabel: "How many hours did you exercise?",
  placeholder: "e.g. 1.5",
  unit: "h",
  mosaicGridSize: 4,
  clearWarning:
    "Are you sure you want to clear all your physical activity data? This cannot be undone.",
  inspoQuote: "You're Hive-ly Active!",
};

const PhysicalTracker = ({ entries, setEntries }) => {
  const [categoryGoals] = useLocalStorage("habit-hive-category-goals", {
    coding: 16,
    physical: 16,
    mental: 16,
  });

  return (
    <HabitTracker
      entries={entries}
      setEntries={setEntries}
      weeklyGoal={categoryGoals.physical}
      {...physicalConfig}
    />
  );
};

export default PhysicalTracker;
