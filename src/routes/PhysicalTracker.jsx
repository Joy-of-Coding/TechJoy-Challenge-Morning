import HabitTracker from "../components/HabitTracker";
import flashdanceBee from "../assets/flashdanceBee.jpg";

const physicalConfig = {
  title: "Your Physical Hive",
  imageSrc: flashdanceBee,
  entryLabel: "How many hours did you exercise?",
  placeholder: "e.g. 1.5",
  unit: "h",
  mosaicGridSize: 4,
  gridStorageKey: "habit-hive-physical-grid-size",
  clearWarning:
    "Are you sure you want to clear all your physical activity data? This cannot be undone.",
  inspoQuote: "You're Hive-ly Active!",
};

const PhysicalTracker = ({ entries, setEntries }) => (
  <HabitTracker entries={entries} setEntries={setEntries} {...physicalConfig} />
);

export default PhysicalTracker;
