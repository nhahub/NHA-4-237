def router_agent(question):

    q = question.lower()

    if any(word in q for word in ["summary", "summarize"]):
        return "summary"

    elif any(word in q for word in ["quiz", "mcq", "question"]):
        return "quiz"

    elif any(word in q for word in ["plan", "roadmap", "study path"]):
        return "planner"

    elif any(word in q for word in ["compare", "difference"]):
        return "compare"

    else:
        return "qa"