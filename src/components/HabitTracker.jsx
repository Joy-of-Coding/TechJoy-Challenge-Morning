import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import MosaicReveal from "./MosaicReveal";

const HabitTracker = ({
  entries,
  setEntries,
  title,
  imageSrc,
  entryLabel,
  placeholder,
  unit,
  mosaicGridSize = 4,
  gridStorageKey,
  inspoQuote,
  clearWarning = "Are you sure you want to clear all your data? This cannot be undone.",
}) => {
  const [value, setValue] = useState("");
  const [showMosaic, setShowMosaic] = useState(false);
  const [savedGridSize, setSavedGridSize] = useLocalStorage(
    gridStorageKey,
    null,
  );
  const [gridSize, setGridSize] = useState(savedGridSize ?? mosaicGridSize);
  const [showGridSizePrompt, setShowGridSizePrompt] = useState(
    savedGridSize === null,
  );
  const mosaicTimerRef = useRef(null);

  useEffect(() => {
    if (savedGridSize !== null) {
      setGridSize(savedGridSize);
      setShowGridSizePrompt(false);
    }
  }, [savedGridSize]);

  const handleChooseGridSize = (size) => {
    setGridSize(size);
    setSavedGridSize(size);
    setShowGridSizePrompt(false);
  };

  const todayString = new Date().toDateString();

  const normalizeDate = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? "" : date.toDateString();
  };

  const hasLoggedToday = () =>
    entries.some((entry) => normalizeDate(entry.date) === todayString);

  const getTodayEntriesCount = () =>
    entries.filter((entry) => normalizeDate(entry.date) === todayString).length;

  const generateEntryId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedValue = value.toString().trim();
    if (trimmedValue === "") return;

    const parsedValue = parseFloat(trimmedValue);
    if (Number.isNaN(parsedValue)) return;

    const now = new Date();
    const newEntry = {
      id: generateEntryId(),
      value: parsedValue,
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: now.toISOString(),
    };

    setEntries([...entries, newEntry]);
    setValue("");
    setShowMosaic(true);

    window.dispatchEvent(new CustomEvent("habitDataUpdated"));
  };

  useEffect(() => {
    if (!showMosaic) return undefined;

    mosaicTimerRef.current = window.setTimeout(() => {
      setShowMosaic(false);
    }, 12000);

    return () => {
      if (mosaicTimerRef.current) {
        window.clearTimeout(mosaicTimerRef.current);
        mosaicTimerRef.current = null;
      }
    };
  }, [showMosaic]);

  const handleClearData = () => {
    if (window.confirm(clearWarning)) {
      setEntries([]);
    }
  };

  const totalValue = entries.reduce((sum, entry) => sum + Number(entry.value), 0);
  const totalSessions = entries.length;
  const averageValue =
    totalSessions > 0 ? (totalValue / totalSessions).toFixed(1) : 0;

  return (
    <div className="min-h-screen text-yellow-400 font-montserrat">
      {showGridSizePrompt && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 px-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-md text-center border-3 border-yellow-400 shadow-2xl shadow-yellow-400/30">
            <h2 className="text-yellow-400 mb-4 text-2xl">
              Choose Your Starting Hive
            </h2>
            <p className="text-white mb-6">
              Pick how many blocks you want to start with for this tracker.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[4, 6, 9, 16].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleChooseGridSize(size)}
                  className="rounded-xl border border-yellow-400 py-3 text-yellow-400 font-bold hover:bg-yellow-400 hover:text-black transition"
                >
                  {size} Blocks
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleChooseGridSize(mosaicGridSize)}
              className="text-sm text-yellow-400 underline"
            >
              Use default ({mosaicGridSize} blocks)
            </button>
          </div>
        </div>
      )}

      {showMosaic && (
        <div className="fixed inset-0 bg-black flex justify-center items-center animate-fadeIn z-50">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-md text-center border-3 border-yellow-400 shadow-2xl shadow-yellow-400/30">
            <h2 className="text-yellow-400 mb-4 text-2xl">
              🐝 Bee-autiful Work! 🐝
            </h2>
            <div className="mb-6">
              <div className="text-4xl mb-2">🌻</div>
              <div className="text-white text-xl mb-1">
                Total: {" "}
                <span className="text-yellow-400 font-bold">
                  {totalValue}
                  {unit}
                </span>
              </div>
              <div className="text-white text-lg mb-1">
                Sessions: {" "}
                <span className="text-yellow-400 font-bold">
                  {totalSessions}
                </span>
              </div>
              <div className="text-white text-lg">
                Average: {" "}
                <span className="text-yellow-400 font-bold">
                  {averageValue}
                  {unit}
                </span>
              </div>
            </div>
            <MosaicReveal
              imageSrc={imageSrc}
              filledSquares={entries.length}
              onComplete={() => window.setTimeout(() => setShowMosaic(false), 3000)}
              gridSize={gridSize}
            />
            <div className="text-yellow-400 text-sm">Keep building your hive! 🐝</div>
            <button
              onClick={() => setShowMosaic(false)}
              aria-label="Close mosaic popup"
              className="mt-2 px-4 py-2 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition"
            >
              Close
            </button>
          </div>
          <br />
        </div>
      )}

      <div className="flex justify-center">
        <main className="justify-center items-center text-center max-w-lg mx-auto my-8 bg-gray-900 rounded-2xl p-6 shadow-2xl shadow-black/50">
          <h1 className="text-2xl font-bold mb-6 text-yellow-400">{inspoQuote}</h1>
          <div className="mb-4 p-3 rounded-lg bg-gray-800 border border-yellow-400">
            <div className="text-yellow-400 font-semibold">Today's Progress</div>
            <div className="text-white text-sm">
              {hasLoggedToday() ? (
                <span className="text-green-400">
                  {getTodayEntriesCount()} session
                  {getTodayEntriesCount() !== 1 ? "s" : ""} logged today
                </span>
              ) : (
                <span className="text-yellow-400">
                  📝 Ready to log your progress
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label htmlFor="habitValue">
              <span className="text-yellow-400">{entryLabel}</span>
              <input
                id="habitValue"
                type="number"
                min="0"
                step="0.25"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                aria-label={entryLabel}
                className="w-full p-2 mt-1 rounded-lg border-2 border-yellow-400 bg-gray-800 text-yellow-400 text-base"
                required
              />
            </label>
            <button
              type="submit"
              disabled={value.toString().trim() === ""}
              className="font-bold border-none rounded-lg py-3 text-lg cursor-pointer shadow-lg transition-shadow bg-gradient-to-r from-yellow-400 via-yellow-400 to-black text-black shadow-yellow-400/50 hover:shadow-yellow-400/70 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Hive
            </button>
          </form>

          <section className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-yellow-400 text-center text-2xl">{title}</h2>
              {entries.length > 0 && (
                <button
                  onClick={handleClearData}
                  className="text-red-400 hover:text-red-300 text-sm underline"
                  title="Clear all data"
                >
                  Clear Data
                </button>
              )}
            </div>
            <div
              className="grid gap-2 sm:gap-4 mt-4"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(64px, 1fr))",
              }}
            >
              {entries.map((entry, idx) => (
                <div
                  key={entry.id ?? idx}
                  className={`hexagon p-2 sm:p-4 text-center shadow-lg font-bold text-xs sm:text-sm md:text-lg ${
                    idx % 2 === 0
                      ? "bg-yellow-400 text-black"
                      : "bg-black text-yellow-400"
                  }`}
                  style={{
                    clipPath:
                      "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    width: "64px",
                    height: "74px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                  }}
                >
                  <div className="text-xs font-bold leading-tight">
                    {entry.value}
                    {unit} 🐝
                  </div>
                  {entry.date && (
                    <div className="text-xs opacity-75 mt-1 leading-tight">
                      {normalizeDate(entry.date)}
                    </div>
                  )}
                </div>
              ))}
              {entries.length === 0 && (
                <div className="text-yellow-400 text-opacity-60 text-center col-span-full py-8">
                  No entries yet. Add your first session!
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default HabitTracker;
