function ResultViewer({

  loading,

  result,

  currentAgent,

  children

}) {

  if (loading) return children;

  if (!result) {

    return (

      <div className="bg-white rounded-3xl shadow-lg p-16 text-center">

        <div className="text-6xl mb-6">

          📚

        </div>

        <h2 className="text-3xl font-bold text-slate-800">

          Ready to Study

        </h2>

        <p className="text-slate-500 mt-4 text-lg">

          Choose any AI study tool above to get started.

        </p>

      </div>

    );

  }

  return (

    <div className="bg-white rounded-3xl shadow-lg p-8">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-3xl font-bold text-slate-900">

            {

              currentAgent==="summary"

              ? "📄 Summary"

              : currentAgent==="planner"

              ? "🗺 Learning Path"

              : currentAgent==="tutor"

              ? "👨‍🏫 AI Tutor"

              : currentAgent==="interview"

              ? "🎤 Interview"

              : "📖 Result"

            }

          </h2>

        </div>

        <button

          onClick={() => {
    navigator.clipboard.writeText(result);
    alert("✅ Copied Successfully");
}}

          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"

        >

          📋 Copy

        </button>

      </div>

      <div className="whitespace-pre-wrap leading-8 text-slate-700 text-lg">
        {result}

      </div>

    </div>

  );

}

export default ResultViewer;