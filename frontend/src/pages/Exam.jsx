import { useState } from "react";

function Exam() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [citations, setCitations] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const [examMode, setExamMode] = useState("normal");
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState(5);

  const generateExam = async () => {
    if (!topic.trim()) return;

    setLoading(true);

    // Reset previous exam
    setQuestions([]);
    setCitations([]);
    setAnswers({});
    setSubmitted(false);
    setScore(0);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic,
          mode: examMode,
          difficulty,
          num_questions: numQuestions,
        }),
      });

      const data = await response.json();

      // Backend returned an error
      if (data.error) {
        alert(data.error);
        setQuestions([]);
        setCitations([]);
        return;
      }

      // Store questions safely
      setQuestions(data.questions || []);
      setCitations(data.citations || []);

      // No questions generated
      if (!data.questions || data.questions.length === 0) {
        alert("No questions could be generated from the uploaded documents.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate exam.");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const submitExam = async () => {
    let correct = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        correct++;
      }
    });

    setScore(correct);
    setSubmitted(true);

    const token = localStorage.getItem("token");

    await fetch("http://127.0.0.1:8000/exam-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        topic,
        score: correct,
        total: questions.length,
      }),
    });
  };

  const percentage =
    questions.length === 0
      ? 0
      : Math.round((score / questions.length) * 100);

  return (
    <div className="p-10 text-white">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">
        📝 AI Exam Generator
      </h1>

      <input
        type="text"
        placeholder="Enter topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
      />

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block mb-2 font-bold text-slate-900">Exam Mode</label>
          <select
            value={examMode}
            onChange={(e) => setExamMode(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-800"
          >
            <option value="normal">Normal Mode</option>
            <option value="study">Study Mode</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-bold text-slate-900">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-800"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-bold text-slate-900">Questions</label>
          <select
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-800"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
      </div>

      <button
        onClick={generateExam}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold mb-10 disabled:opacity-50"
      >
        {loading ? "🤖 Generating AI Exam..." : "Generate Exam"}
      </button>

      {questions.length > 0 && (
        <div className="space-y-8">
          {questions.map((question, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Question {index + 1}</h2>

              <p className="text-lg mb-6">{question.question}</p>

              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-300
                      ${
                        submitted
                          ? option === question.answer
                            ? "bg-green-600 border-2 border-green-400"
                            : answers[index] === option
                            ? "bg-red-600 border-2 border-red-400"
                            : "bg-slate-700"
                          : answers[index] === option
                          ? "bg-blue-600 border-2 border-blue-400"
                          : "bg-slate-700 hover:bg-slate-600"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      disabled={submitted}
                      onChange={() => selectAnswer(index, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={submitExam}
            disabled={submitted}
            className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl text-lg font-bold disabled:opacity-50"
          >
            Submit Exam
          </button>

          {citations.length > 0 && (
            <div className="bg-slate-800 p-6 rounded-xl mt-8">
              <h2 className="text-2xl font-bold mb-4">📚 Sources Used</h2>

              {citations.map((citation, index) => (
                <div key={index} className="border-b border-slate-600 py-2">
                  <p>
                    <strong>Document:</strong> {citation.source}
                  </p>
                  <p>
                    <strong>Page:</strong> {citation.page}
                  </p>
                  <p>
                    <strong>Chapter:</strong> {citation.chapter}
                  </p>
                </div>
              ))}
            </div>
          )}

          {submitted && (
            <div className="bg-slate-800 p-8 rounded-xl">
              <h2 className="text-3xl font-bold mb-4">🎉 Final Score</h2>

              <div className="w-full bg-slate-300 rounded-full h-4 my-6">
                <div
                  className="bg-green-600 h-4 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <p className="text-2xl mb-2">
                {score} / {questions.length}
              </p>

              <p className="text-xl text-green-400 mb-6">{percentage}%</p>

              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      answers[index] === question.answer
                        ? "bg-green-700"
                        : "bg-red-700"
                    }`}
                  >
                    <p className="font-bold">Question {index + 1}</p>
                    <p>Your Answer: {answers[index] || "No Answer"}</p>
                    <p>Correct Answer: {question.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Exam;