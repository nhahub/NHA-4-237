def summarizer_agent(context, call_ollama_func):

    prompt = f"""
You are an expert academic study assistant.

Using ONLY the retrieved context, generate a well-structured study summary.

Requirements:

- Start with a title.
- Write a short overview (3–5 sentences).
- Create a "Key Concepts" section.
- Create an "Important Notes" section.
- Finish with a short conclusion.
- Use clear bullet points.
- Do NOT invent information.
- Do NOT use markdown tables.
- Keep the summary concise and suitable for revision.

Context:

{context}
"""

    return call_ollama_func(prompt)