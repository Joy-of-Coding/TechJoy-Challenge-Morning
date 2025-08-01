import { NavLink } from "react-router-dom";

// Define menu items and routes
const habitPages = [
  // { name: "Home", path: "/" },
  { name: "Dashboard", path: "/" },
  { name: "Coding", path: "/coding" },
  { name: "Physical", path: "/physical" },
  { name: "Mental Health", path: "/mental" },
  { name: "Achievements", path: "/achievements" },
  // Add more habits as needed
];

const NavBar = () => {
  return (
    <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 px-1 py-2 bg-black border-b-2 border-yellow-40">
      {habitPages.map((page) => (
        <NavLink
          key={page.path}
          to={page.path}
          className={({ isActive }) =>
            [
              "px-4 py-2 rounded-lg font-semibold transition-colors duration-200",
              isActive
                ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/40"
                : "text-yellow-400 hover:bg-yellow-900  hover:shadow-md hover:shadow-yellow-400/30",
            ].join(" ")
          }
          end={page.path === "/"}
        >
          {/* <span className="text-lg">{page.icon}</span> */}
          <span className="hidden sm:inline">{page.name}</span>
          <span className="sm:hidden text-xs">{page.name}</span>
          {/* {page.name} */}
        </NavLink>
      ))}
    </nav>
  );
};

export default NavBar;
