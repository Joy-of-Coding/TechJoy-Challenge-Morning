import HabitTracker from "../components/HabitTracker";
import flashdanceBee from "../assets/flashdanceBee.jpg";
import { loadGoals } from "../utils/localStorage";

const physicalConfig = {
  title: "Your Physical Hive",
  imageSrc: flashdanceBee,
  entryLabel: "How many hours did you exercise?",
  placeholder: "e.g. 1.5",
  unit: "h",
  clearWarning:
    "Are you sure you want to clear all your physical activity data? This cannot be undone.",
  inspoQuote: "You're Hive-ly Active!",
};

const PhysicalTracker = ({ entries, setEntries }) => {
  const goal = loadGoals().physical;
  return (
    <HabitTracker
      entries={entries}
      setEntries={setEntries}
      goal={goal}
      {...physicalConfig}
    />
  );
};

export default PhysicalTracker;
