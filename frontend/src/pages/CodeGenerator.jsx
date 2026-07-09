import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeGenerator() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("");
  const [spaceComplexity, setSpaceComplexity] = useState("");
  const [bestPractices, setBestPractices] = useState("");
  const [commonMistakes, setCommonMistakes] = useState("");
  const [loading, setLoading] = useState(false);

  const generateCode = async () => {
    if (!topic.trim()) return;
    setLoading(true);

    setCode("");
    setExplanation("");
    setTimeComplexity("");
    setSpaceComplexity("");
    setBestPractices("");
    setCommonMistakes("");
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:8000/code-generator",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            topic,
            language,
          }),
        }
      );
      
      const data = await response.json();
      console.log(data);

      if (data.error) {
        alert(data.error);
        return;
      }

      setCode(data.code || "");

      if (!data.code) {
        alert("No code could be generated.");
        return;
      }

      setExplanation(data.explanation || "");
      setTimeComplexity(data.time_complexity || "");
      setSpaceComplexity(data.space_complexity || "");
      setBestPractices(data.best_practices || "");
      setCommonMistakes(data.common_mistakes || "");
    } catch (error) {
      console.error(error);
      alert("Failed to generate code.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCode = () => {
    if (!code) return;

    const extensions = {
      Python: "py",
      Java: "java",
      "C++": "cpp",
      JavaScript: "js",
      "C#": "cs",
    };

    const extension = extensions[language] || "txt";

    const blob = new Blob([code], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `generated_code.${extension}`;

    link.click();
    
    alert("Code Downloaded Successfully ✅");

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">
        💻 Code Generator
      </h1>

      <input
        type="text"
        placeholder="Enter algorithm, data structure, or programming problem..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
      />

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
      >
        <option>Python</option>
        <option>C++</option>
        <option>Java</option>
        <option>JavaScript</option>
        <option>C#</option>
      </select>

      <button
        onClick={generateCode}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50"
      >
        {loading ? "🤖 AI is Writing Your Code..." : "Generate Code"}
      </button>

      {code && (
        <>
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">💻 Code</h2>

            <div className="flex gap-4 mb-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  alert("Copied Successfully ✅");
                }}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
              >
                📋 Copy Code
              </button>

              <button
                onClick={downloadCode}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white"
              >
                💾 Download Code
              </button>
            </div>

            <SyntaxHighlighter
              language={language.toLowerCase()}
              style={oneDark}
              showLineNumbers
              wrapLongLines
            >
              {code}
            </SyntaxHighlighter>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 mt-6 text-slate-800">
            <h2 className="text-2xl font-bold mb-4">📖 Explanation</h2>
            <p>{explanation}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 text-slate-800">
              <h2 className="text-xl font-bold mb-3">⏱ Time Complexity</h2>
              <p>{timeComplexity}</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 text-slate-800">
              <h2 className="text-xl font-bold mb-3">💾 Space Complexity</h2>
              <p>{spaceComplexity}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 mt-6 text-slate-800">
            <h2 className="text-2xl font-bold mb-4">✅ Best Practices</h2>
            <p>{bestPractices}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 mt-6 text-slate-800">
            <h2 className="text-2xl font-bold mb-4">⚠ Common Mistakes</h2>
            <p>{commonMistakes}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default CodeGenerator;