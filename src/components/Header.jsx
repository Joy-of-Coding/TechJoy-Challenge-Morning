import NavBar from "./NavBar";

const Header = () => {
  return (
    <header className="text-center py-8 pb-4 bg-black border-b-5 border-yellow-400">
      <div className="flex items-center justify-center gap-3">
        <h1 className="text-5xl tracking-wider m-0">🐝 Habit Hive</h1>
        <span
          className="text-xs font-bold px-2 py-1 rounded-full border border-yellow-400 text-yellow-400 tracking-widest"
          title="Professionally tested on at least two computers"
        >
          v1.0.2
        </span>
      </div>
      <p className="text-white mt-2">
        Track your coding hours and build your hive!
      </p>
      <NavBar />
    </header>
  );
};

export default Header;
