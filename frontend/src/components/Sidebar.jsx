import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };

  const menu = [
    { path: "/", icon: "🏠", title: "Home" },
    { path: "/upload", icon: "📁", title: "Upload Center" },
    { path: "/chat", icon: "🤖", title: "AI Chat" },
    { path: "/study", icon: "📚", title: "Study Mode" },
    { path: "/flashcards", icon: "🧠", title: "Flashcards" },
    { path: "/exams", icon: "📝", title: "Exams" },
    { path: "/dashboard", icon: "📊", title: "Dashboard" },
    { path: "/project-builder", icon: "🚀", title: "Project Builder" },
    { path: "/code-generator", icon: "💻", title: "Code Generator" },
    { path: "/settings", icon: "⚙️", title: "Settings" },
  ];

  return (

    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col overflow-y-auto">

      {/* Logo */}

      <div className="p-8 border-b border-slate-800">

        <h1 className="text-2xl font-bold text-white">

          📚 StudyMind

        </h1>

        <p className="text-slate-400 mt-2">

          Learn Smarter with AI

        </p>

      </div>

      {/* Menu */}

      <div className="flex-1 px-3 py-4 space-y-1">

        {menu.map((item) => (

          <NavLink

            key={item.path}

            to={item.path}

            className={({ isActive }) =>

              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300

              ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`

            }

          >

            <span className="text-xl">{item.icon}</span>

            <span className="font-medium">{item.title}</span>

          </NavLink>

        ))}

      </div>

      {/* User */}

      <div className="border-t border-slate-800 p-6">

        <div className="mb-4">

          <p className="text-white font-semibold">

            {user?.name || "Guest"}

          </p>

          <p className="text-slate-400 text-sm">

            {user?.email || "Not Logged In"}

          </p>

        </div>

        <button

          onClick={logout}

          className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 transition"

        >

          Logout

        </button>

      </div>

    </aside>

  );

}

export default Sidebar;