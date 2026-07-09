import { useNavigate } from "react-router-dom";

function QuickActionsCard() {

  const navigate = useNavigate();

  return (

    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-xl font-bold mb-6">

        ⚡ Quick Actions

      </h2>

      <div className="grid grid-cols-2 gap-4">

        <button
          onClick={() => navigate("/upload")}
          className="bg-blue-600 text-white rounded-xl p-4 hover:bg-blue-700 transition"
        >
          📁 Upload PDF
        </button>

        <button
          onClick={() => navigate("/chat")}
          className="bg-emerald-600 text-white rounded-xl p-4 hover:bg-emerald-700 transition"
        >
          🤖 AI Chat
        </button>

        <button
          onClick={() => navigate("/study")}
          className="bg-orange-500 text-white rounded-xl p-4 hover:bg-orange-600 transition"
        >
          📚 Study Mode
        </button>

        <button
          onClick={() => navigate("/exams")}
          className="bg-purple-600 text-white rounded-xl p-4 hover:bg-purple-700 transition"
        >
          📝 Exams
        </button>

      </div>

    </div>

  );

}

export default QuickActionsCard;