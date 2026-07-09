function QuizSection({
  questions,
  answers,
  submitted,
  score,
  selectAnswer,
  submitQuiz,
  explainQuestion,
  explanations,
  loadingExplanation,
}) {
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          🧠 AI Quiz
        </h2>
        {submitted && (
          <div className="mb-6">
            <div className="text-2xl font-bold text-blue-600">
              🎉 Your Score: {score} / {questions.length}
            </div>
          </div>
        )}
      </div>

      <div className="w-full bg-slate-200 rounded-full h-3 mb-6">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all"
          style={{
            width: `${(Object.keys(answers).length / questions.length) * 100}%`,
          }}
        />
      </div>

      <div className="space-y-8">
        {questions.map((question, index) => (
          <div
            key={index}
            className="border rounded-2xl p-6"
          >
            <h3 className="font-bold text-xl mb-5">
              Question {index + 1}
            </h3>
            <p className="mb-5">
              {question.question}
            </p>
            {question.options.map((option, i) => (
              <label
                key={i}
                className={`block rounded-xl p-4 mb-3 cursor-pointer transition
                    ${
                      submitted
                        ? option === question.answer
                          ? "bg-green-500 text-white"
                          : answers[index] === option
                          ? "bg-red-500 text-white"
                          : "bg-slate-100"
                        : answers[index] === option
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100"
                    }
                    `}
              >
                <input
                  type="radio"
                  className="mr-3"
                  disabled={submitted}
                  checked={answers[index] === option}
                  onChange={() => selectAnswer(index, option)}
                />
                {option}
              </label>
            ))}
            {submitted && (
              <div className="mt-5">
                <button
                  onClick={() => explainQuestion(question, index)}
                  disabled={loadingExplanation[index]}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2"
                >
                  {loadingExplanation[index] ? "Loading..." : "Explain"}
                </button>
                {explanations[index] && (
                  <div className="bg-slate-100 rounded-xl mt-4 p-5 whitespace-pre-wrap">
                    {explanations[index]}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {!submitted && (
        <button
          onClick={submitQuiz}
          className="mt-8 bg-green-600 hover:bg-green-700 text-white rounded-xl px-8 py-3 font-bold"
        >
          Submit Quiz
        </button>
      )}
    </div>
  );
}

export default QuizSection;