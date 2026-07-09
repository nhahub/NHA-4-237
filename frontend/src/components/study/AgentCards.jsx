function AgentCards({ loading, callAgent }) {

  const agents = [
    {
      id: "summary",
      icon: "📄",
      title: "Summary",
      description: "Generate a concise AI summary",
      color: "bg-blue-500",
    },
    {
      id: "planner",
      icon: "🗺️",
      title: "Learning Path",
      description: "Create a personalized study plan",
      color: "bg-green-500",
    },
    {
      id: "quiz",
      icon: "🧠",
      title: "Quiz",
      description: "Generate MCQs & Written Questions",
      color: "bg-purple-500",
    },
    {
      id: "tutor",
      icon: "👨‍🏫",
      title: "AI Tutor",
      description: "Chat with your personal tutor",
      color: "bg-orange-500",
    },
    {
      id: "interview",
      icon: "🎤",
      title: "Interview",
      description: "Practice interview questions",
      color: "bg-red-500",
    },
  ];

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">

      {agents.map((agent) => (

        <div
          key={agent.id}
          onClick={() => !loading && callAgent(agent.id)}
          className="bg-white rounded-3xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-2 p-6"
        >

          <div
            className={`${agent.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5`}
          >
            {agent.icon}
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">

            {agent.title}

          </h2>

          <p className="text-slate-500 text-sm">

            {agent.description}

          </p>

        </div>

      ))}

    </div>

  );

}

export default AgentCards;