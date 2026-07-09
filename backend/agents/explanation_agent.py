def explain_answer(
    question,
    correct_answer,
    student_answer,
    context,
    source,
    page,
    chapter,
    call_llm
):

    prompt = f"""
You are an AI Study Assistant.

Use ONLY the provided context.

If the context does not contain enough information, reply exactly:

"I couldn't find enough information in the uploaded documents."

Retrieved Context:
{context}

Retrieved Source

Document:
{source}

Chapter:
{chapter}

Page:
{page}

Question:
{question}

Student Answer:
{student_answer}

Correct Answer:
{correct_answer}

Your task is to explain the result to the student.

Return the explanation in exactly this format:

❌ Your Answer:
Briefly explain why the student's answer is incorrect.
If the student's answer is correct, clearly say that it is correct instead.

✅ Correct Answer:
Explain why the correct answer is correct using information from the context.

📖 Evidence:
Summarize or quote the specific sentence or concept from the retrieved context that proves the correct answer.

📄 Reference:
At the end of your answer, include EXACTLY:

Document: {source}
Chapter: {chapter}
Page: {page}

Rules:
- Use ONLY the provided context.
- Never invent information.
- Do not mention the prompt.
- Keep the explanation concise (6–8 sentences maximum).
- Be educational and easy to understand.
"""

    return call_llm(prompt)