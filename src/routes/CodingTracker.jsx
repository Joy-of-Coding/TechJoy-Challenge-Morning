import HabitTracker from "../components/HabitTracker";
import { useLocalStorage } from "../hooks/useLocalStorage";
import programmingBee from "../assets/programmingBee.jpg";

const codingConfig = {
  title: "Your Coding Hive",
  imageSrc: programmingBee,
  entryLabel: "How many hours did you code?",
  placeholder: "e.g. 2.5",
  unit: "h",
  mosaicGridSize: 4,
  clearWarning:
    "Are you sure you want to clear all your coding data? This cannot be undone.",
  inspoQuote: "You've been a busy coding bee!",
};

const CodingTracker = ({ entries, setEntries }) => {
  const [categoryGoals] = useLocalStorage("habit-hive-category-goals", {
    coding: 16,
    physical: 16,
    mental: 16,
  });

  return (
    <HabitTracker
      entries={entries}
      setEntries={setEntries}
      weeklyGoal={categoryGoals.coding}
      {...codingConfig}
    />
  );
};

export default CodingTracker;
