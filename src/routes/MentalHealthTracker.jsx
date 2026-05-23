import HabitTracker from "../components/HabitTracker";
import meditatingBee from "../assets/meditatingBee.jpg";
import { loadGoals } from "../utils/localStorage";

const mentalConfig = {
  title: "Your Mental Health Hive",
  imageSrc: meditatingBee,
  entryLabel: "How many hours did you meditate or reflect?",
  placeholder: "e.g. 0.5",
  unit: "h",
  clearWarning:
    "Are you sure you want to clear all your mental health data? This cannot be undone.",
  inspoQuote: "Bee Kind to Your Mind!",
};

const MentalHealthTracker = ({ entries, setEntries }) => {
  const goal = loadGoals().mental;
  return (
    <HabitTracker
      entries={entries}
      setEntries={setEntries}
      goal={goal}
      {...mentalConfig}
    />
  );
};

export default MentalHealthTracker;
