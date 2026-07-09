import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Hero Section */}

      <section className="text-center py-24 px-4">

        <h1 className="text-6xl font-bold mb-4">
          AI Study Assistant
        </h1>

        <p className="text-2xl text-slate-300 mb-8">
          Learn Smarter with AI
        </p>

        <p className="text-slate-400 mb-10">
          Chat • Exams • Flashcards • Analytics
        </p>

        <div className="flex justify-center gap-4">

          <button
            onClick={() => navigate("/study")}
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-semibold"
          >
            Start Learning
          </button>

          <button
            onClick={() => navigate("/chat")}
            className="bg-slate-700 hover:bg-slate-600 transition px-6 py-3 rounded-lg font-semibold"
          >
            AI Chat
          </button>

        </div>

      </section>

      {/* Features */}

      <section className="max-w-6xl mx-auto px-6 pb-20">

        <div className="grid md:grid-cols-4 gap-6">

          {/* Quiz */}

          <div
            onClick={() => navigate("/study")}
            className="bg-slate-900 p-6 rounded-xl cursor-pointer hover:bg-slate-800 hover:scale-105 transition duration-300"
          >

            <h3 className="text-xl font-bold mb-2">
              📝 Quiz System
            </h3>

            <p className="text-slate-300">
              Generate AI quizzes and interactive MCQs.
            </p>

          </div>

          {/* Flashcards */}

          <div
            onClick={() => navigate("/flashcards")}
            className="bg-slate-900 p-6 rounded-xl cursor-pointer hover:bg-slate-800 hover:scale-105 transition duration-300"
          >

            <h3 className="text-xl font-bold mb-2">
              📚 Flashcards
            </h3>

            <p className="text-slate-300">
              Review important concepts using AI-generated flashcards.
            </p>

          </div>

          {/* Exams */}

          <div
            onClick={() => navigate("/exams")}
            className="bg-slate-900 p-6 rounded-xl cursor-pointer hover:bg-slate-800 hover:scale-105 transition duration-300"
          >

            <h3 className="text-xl font-bold mb-2">
              🧠 Exams
            </h3>

            <p className="text-slate-300">
              Practice with realistic AI-generated exams.
            </p>

          </div>

          {/* Dashboard */}

          <div
            onClick={() => navigate("/dashboard")}
            className="bg-slate-900 p-6 rounded-xl cursor-pointer hover:bg-slate-800 hover:scale-105 transition duration-300"
          >

            <h3 className="text-xl font-bold mb-2">
              📊 Analytics
            </h3>

            <p className="text-slate-300">
              View your learning progress and study analytics.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;