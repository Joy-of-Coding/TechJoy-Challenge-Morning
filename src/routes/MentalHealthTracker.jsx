import HabitTracker from "../components/HabitTracker";
import { useLocalStorage } from "../hooks/useLocalStorage";
import meditatingBee from "../assets/meditatingBee.jpg";

const mentalConfig = {
  title: "Your Mental Health Hive",
  imageSrc: meditatingBee,
  entryLabel: "How many hours did you meditate or reflect?",
  placeholder: "e.g. 0.5",
  unit: "h",
  mosaicGridSize: 4,
  clearWarning:
    "Are you sure you want to clear all your mental health data? This cannot be undone.",
  inspoQuote: "Bee Kind to Your Mind!",
};

const MentalHealthTracker = ({ entries, setEntries }) => {
  const [categoryGoals] = useLocalStorage("habit-hive-category-goals", {
    coding: 16,
    physical: 16,
    mental: 16,
  });

  return (
    <HabitTracker
      entries={entries}
      setEntries={setEntries}
      weeklyGoal={categoryGoals.mental}
      {...mentalConfig}
    />
  );
};

export default MentalHealthTracker;
