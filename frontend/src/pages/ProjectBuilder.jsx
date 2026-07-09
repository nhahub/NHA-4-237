import { useState } from "react";

function ProjectBuilder() {
  const [topic, setTopic] = useState("");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateProject = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setProject(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:8000/project-builder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            topic,
          }),
        }
      );
      
      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      console.log(data);
      setProject(data.project || data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 text-white">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">
        🚀 Project Builder
      </h1>

      <input
        type="text"
        placeholder="Enter project idea..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
      />

      <button
        onClick={generateProject}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold disabled:opacity-50"
      >
        {loading ? "🤖 AI is Designing Your Project..." : "🚀 Generate Project"}
      </button>

      {project && (
        <div className="space-y-6 mt-10">
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition text-slate-800">
            <h2 className="text-2xl font-bold mb-3">📌 Project Title</h2>
            <p className="whitespace-pre-wrap">{project.title}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition text-slate-800">
            <h2 className="text-2xl font-bold mb-3">🎯 Objective</h2>
            <p className="whitespace-pre-wrap">{project.objective}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition text-slate-800">
            <h2 className="text-2xl font-bold mb-3">🛠 Technologies</h2>
            <p className="whitespace-pre-wrap">{project.technologies}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition text-slate-800">
            <h2 className="text-2xl font-bold mb-3">🏛 Architecture</h2>
            <p className="whitespace-pre-wrap">{project.architecture}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition text-slate-800">
            <h2 className="text-2xl font-bold mb-3">📂 File Structure</h2>
            <p className="whitespace-pre-wrap">{project.file_structure}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition text-slate-800">
            <h2 className="text-2xl font-bold mb-3">🧠 Main Algorithms</h2>
            <p className="whitespace-pre-wrap">{project.algorithms}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition text-slate-800">
            <h2 className="text-2xl font-bold mb-3">🧪 Testing Plan</h2>
            <p className="whitespace-pre-wrap">{project.testing}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition text-slate-800">
            <h2 className="text-2xl font-bold mb-3">🚀 Future Improvements</h2>
            <p className="whitespace-pre-wrap">{project.future_improvements}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectBuilder;