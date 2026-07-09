import { useAuth } from "../../context/AuthContext";

function WelcomeCard() {

    const { user } = useAuth();

    return (

        <div className="bg-white rounded-3xl shadow-lg p-8">

            <h1 className="text-4xl font-bold text-slate-800">

                Welcome Back 👋

            </h1>

            <p className="text-2xl mt-3 font-semibold text-blue-600">

                {user ? user.name : "Guest"}

            </p>

            <p className="mt-4 text-slate-500">

                Ready to continue your AI learning journey?

            </p>

        </div>

    );

}

export default WelcomeCard;