def evaluate_answer(
    question,
    answer,
    context,
    call_ollama_func
):

    prompt = f"""
You are an AI Study Assistant.

Grade the student's answer ONLY using the retrieved context.

If the context does not contain enough information, reply exactly:

"I couldn't find enough information in the uploaded documents."

Retrieved Context:
{context}

Question:
{question}

Student Answer:
{answer}

Your task:

1. Give a score out of 10.
2. Explain the mistakes.
3. Give a better answer.
4. Use ONLY the retrieved context.

Return exactly like this:

Score: X/10

Mistakes:
- ...

Better Answer:
...

Evidence:
Summarize the evidence from the retrieved context.

Rules:
- Use ONLY the retrieved context.
- Every statement in your answer must be supported by the context.
- Never use outside knowledge.
- If the context does not explicitly support something, say so.
- Do NOT use words like "might", "could", "probably", "generally", or "typically".
- Quote or summarize only information found in the retrieved context.
- Do not assume facts that are not written in the context.
"""

    return call_ollama_func(prompt)