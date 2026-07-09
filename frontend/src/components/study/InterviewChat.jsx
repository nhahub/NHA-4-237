function InterviewChat({
  currentAgent,
  interviewConversation,
  interviewAnswer,
  setInterviewAnswer,
  sendInterviewMessage,
  sendingInterview
}) {
  if (currentAgent !== "interview") {
    return null;
  }

  // دالة مساعدة لرسم شريط التقدم للدرجة
  const renderScoreBar = (score) => {
    const total = 10;
    const filled = Math.round(score);
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-4">
        <div className="text-sm font-bold text-slate-500 mb-2">Score</div>
        <div className="text-2xl font-black text-slate-900 mb-2">
          {score} / {total}
        </div>
        <div className="flex gap-1">
          {[...Array(total)].map((_, i) => (
            <div
              key={i}
              className={`h-3 flex-1 rounded-full ${i < filled ? "bg-blue-600" : "bg-slate-200"}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg mt-8 p-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">
        🎤 AI Interview
      </h2>

      <div className="space-y-5 max-h-[500px] overflow-y-auto mb-6 pr-2">
        {interviewConversation.length === 0 && (
          <div className="text-center text-slate-400 py-10">
            Practice your interview with AI.
          </div>
        )}

        {interviewConversation.map((chat, index) => (
          <div key={index} className="space-y-3">
            {/* رسالة الطالب */}
            {chat.student && (
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-2xl px-5 py-3 max-w-2xl">
                  <div className="text-xs font-bold opacity-80 mb-1">👤 You</div>
                  {chat.student}
                </div>
              </div>
            )}

            {/* رسالة الـ AI */}
            {chat.interviewer && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl px-5 py-3 max-w-2xl whitespace-pre-wrap">
                  <div className="text-xs font-bold text-slate-500 mb-1">🤖 AI Interviewer</div>
                  <div>{chat.interviewer}</div>

                  {/* عرض التقييم إذا وجد */}
                  {chat.score && renderScoreBar(chat.score)}

                  {/* عرض Better Answer */}
                  {chat.betterAnswer && (
                    <div className="mt-3 p-4 bg-green-100 border-l-4 border-green-500 text-green-800 rounded-r-xl text-sm">
                      <strong>💡 Better Answer:</strong> {chat.betterAnswer}
                    </div>
                  )}

                  {/* عرض النقاط */}
                  {(chat.strengths || chat.areasForImprovement) && (
                    <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                      {chat.strengths && (
                        <div className="text-green-700">🟢 <strong>Strengths:</strong> {chat.strengths}</div>
                      )}
                      {chat.areasForImprovement && (
                        <div className="text-red-700">🔴 <strong>Areas for Improvement:</strong> {chat.areasForImprovement}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={interviewAnswer}
          onChange={(e) => setInterviewAnswer(e.target.value)}
          placeholder="Answer the interviewer..."
          className="flex-1 border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendInterviewMessage();
            }
          }}
        />
        <button
          onClick={sendInterviewMessage}
          disabled={sendingInterview}
          className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-8 font-semibold transition"
        >
          {sendingInterview ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default InterviewChat;