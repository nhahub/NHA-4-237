def planner_agent(
    context,
    weak_topics,
    level,
    history,
    call_ollama_func
):

   prompt = f"""
You are an expert AI study planner.

Using ONLY the retrieved context, create a personalized learning roadmap.

Requirements:

- Add a title.
- Divide the roadmap into phases.
- Label every phase as:
  Beginner
  Intermediate
  Advanced
- Mention estimated study time for every phase.
- Order the topics from easy to difficult.
- Mention prerequisites first.
- Keep the roadmap practical.
- Use bullet points.
- Do NOT invent information outside the context.

Context:

{context}
"""

   return call_ollama_func(prompt)