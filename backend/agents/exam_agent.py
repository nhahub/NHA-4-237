import json


def generate_exam(
    retrieved_chunks,
    difficulty,
    num_questions,
    mode,
    call_llm
):

    if mode == "study":

        extra_instruction = """
The exam is for STUDY MODE.

Rules:

- Questions should help students learn.
- Cover different concepts.
- Include conceptual questions.
- Avoid repeating ideas.
"""

    else:

        extra_instruction = """
The exam is for NORMAL MODE.

Rules:

- Behave like a real university exam.
- Keep the questions challenging.
- Cover different concepts.
"""

    questions = []

    for chunk in retrieved_chunks:

        prompt = f"""
You are an experienced university professor.

Create EXACTLY ONE multiple-choice question ONLY from the provided context.

Difficulty:
{difficulty}

{extra_instruction}

IMPORTANT RULES:

1. Use ONLY the provided context.
2. Never invent information.
3. Ignore page numbers.
4. Ignore headers and footers.
5. Ignore document formatting.
6. Ignore incomplete words.
7. Ignore abbreviations such as:
   - thm
   - fig
   - ex
   - etc
8. The question must test ONE concept only.
9. Never combine information from multiple concepts into one question.
10. The question must have EXACTLY 4 options.
11. Exactly ONE option must be correct.
12. The other 3 options must come ONLY from concepts that appear in the provided context.
13. Never invent distractors.
14. Do NOT use:
    - None of the above
    - All of the above
    - Both A and B
    - All answers are correct
15. The correct answer must exactly match one option.
16. The correct answer MUST be explicitly stated in the context.
17. Every option must be supported by the context.
18. If you cannot generate a valid question from the context, skip it.
19. Never guess missing information.
20. Never create an answer that does not appear in the context.
21. The question must be answerable using only the provided context.
22. Do NOT ask about page numbers.
23. Do NOT copy sentences directly from the document.
24. Return ONLY valid JSON.

Retrieved Context:

{chunk["text"]}

Generate the question ONLY from the retrieved context above.
Do not use outside knowledge.

Return ONLY this format:

{{
  "question": "...",
  "options": [
    "...",
    "...",
    "...",
    "..."
  ],
  "answer": "...",
  "evidence": "Exact sentence or short phrase from the context that proves the answer."
}}

Before returning the JSON, verify the question:

✓ The answer appears exactly in the options.
✓ Only ONE option is correct.
✓ The evidence supports the correct answer.
✓ No option contradicts the context.
✓ No invented information.

If the question fails verification, regenerate it before returning the final JSON.
"""

        try:

            response = call_llm(prompt)

            response = response.replace("```json", "")
            response = response.replace("```", "")
            response = response.strip()

            question = json.loads(response)

            question["source"] = chunk["source"]
            question["page"] = chunk["page"]
            question["chapter"] = chunk["chapter"]

            questions.append(question)

            if len(questions) >= num_questions:
                break

        except Exception:
            continue

    return questions[:num_questions]