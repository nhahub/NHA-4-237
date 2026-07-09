function TutorChat({
  currentAgent,
  tutorConversation,
  tutorAnswer,
  setTutorAnswer,
  sendTutorMessage,
  sendingTutor
}) {
  if (currentAgent !== "tutor") {
    return null;
  }
  return (
    <div className="bg-white rounded-3xl shadow-lg mt-8 p-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">
        👨‍🏫 AI Tutor
      </h2>
      <div className="space-y-5 max-h-[500px] overflow-y-auto mb-6">
        {
          tutorConversation.length === 0 && (
            <div className="text-center text-slate-400 py-10">
              Ask the tutor anything about this topic.
            </div>
          )
        }
        {
          tutorConversation.map((chat, index) => (
            <div key={index}>
              <div className="flex justify-end mb-3">
                <div className="bg-blue-600 text-white rounded-2xl px-5 py-3 max-w-2xl">
                  <div className="text-xs font-bold opacity-80 mb-1">
                    👤 You
                  </div>
                  {chat.student}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl px-5 py-3 max-w-2xl whitespace-pre-wrap">
                  <div className="text-xs font-bold text-slate-500 mb-1">
                    🤖 AI Tutor
                  </div>
                  {chat.tutor}
                </div>
              </div>
            </div>
          ))
        }
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          value={tutorAnswer}
          onChange={(e) => setTutorAnswer(e.target.value)}
          placeholder="Ask the tutor..."
          className="flex-1 border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendTutorMessage();
            }
          }}
        />
        <button
          onClick={sendTutorMessage}
          disabled={sendingTutor}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8"
        >
          {
            sendingTutor
              ?
              "Thinking..."
              :
              "Send"
          }
        </button>
      </div>
    </div>
  );
}

export default TutorChat;