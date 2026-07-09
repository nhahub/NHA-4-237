import { useAuth } from "../context/AuthContext";

function Navbar() {

  const { user } = useAuth();

  return (

    <div className="bg-white h-20 shadow-sm flex items-center justify-between px-8">

      <div>

        <h2 className="text-2xl font-bold text-slate-800">

          Dashboard

        </h2>

      </div>

      <div className="flex items-center gap-6">

        <input

          placeholder="🔍 Search..."

          className="border rounded-xl px-4 py-2 w-72 outline-none focus:border-blue-500"

        />

        <button className="text-2xl">

          🔔

        </button>

        <button className="text-2xl">

          🌙

        </button>

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">

            {user?.name?.charAt(0).toUpperCase() || "G"}

          </div>

          <div>

            <p className="font-semibold">

              {user?.name || "Guest"}

            </p>

            <p className="text-sm text-slate-500">

              {user?.email || ""}

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Navbar;