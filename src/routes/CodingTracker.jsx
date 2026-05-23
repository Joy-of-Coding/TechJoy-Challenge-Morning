import HabitTracker from "../components/HabitTracker";
import programmingBee from "../assets/programmingBee.jpg";

const codingConfig = {
  title: "Your Coding Hive",
  imageSrc: programmingBee,
  entryLabel: "How many hours did you code?",
  placeholder: "e.g. 2.5",
  unit: "h",
  mosaicGridSize: 4,
  gridStorageKey: "habit-hive-coding-grid-size",
  clearWarning:
    "Are you sure you want to clear all your coding data? This cannot be undone.",
  inspoQuote: "You've been a busy coding bee!",
};

const CodingTracker = ({ entries, setEntries }) => (
  <HabitTracker entries={entries} setEntries={setEntries} {...codingConfig} />
);

export default CodingTracker;
