import json
import re


def generate_mcq(
    context,
    num_questions,
    difficulty,
    call_ollama_func
):

    if difficulty == "Easy":
        instruction = "Focus on direct facts and definitions."

    elif difficulty == "Medium":
        instruction = "Require understanding."

    else:
        instruction = "Require analysis and inference."

    prompt = f"""
Generate EXACTLY {num_questions} multiple-choice questions.

Difficulty:
{difficulty}

Instructions:
{instruction}

Return ONLY valid JSON.

Format:

[
  {{
    "question":"Question text",

    "options":[
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],

    "answer":"The COMPLETE correct option"
  }}
]

IMPORTANT:

- Return ONLY JSON.
- No markdown.
- No explanation.
- No ```json.
- answer MUST be exactly one of the options.

Context:

{context}
"""

    response = call_ollama_func(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    return json.loads(response)


def generate_written_questions(
    context,
    call_ollama_func
):

    prompt = f"""
Generate EXACTLY 2 short-answer questions.

Format exactly like this:

Q1: What is ...?

Q2: Explain ...

Do not include answers.

Context:
{context}
"""

    response = call_ollama_func(prompt)

    questions = re.findall(
        r"Q\d+:\s*(.*)",
        response
    )

    return questions


def generate_study_quiz(
    retrieved_chunks,
    difficulty,
    call_ollama_func
):
    """
    Generate ONE MCQ from EACH retrieved chunk.
    """

    questions = []

    for chunk in retrieved_chunks:

        prompt = f"""
You are an experienced university professor.

Generate EXACTLY ONE multiple-choice question.

Difficulty:
{difficulty}

Context:
{chunk["text"]}

Rules:

- Use ONLY this context.
- Test ONLY ONE concept.
- The correct answer MUST appear explicitly in the context.
- Do NOT invent information.
- Do NOT combine ideas.
- Exactly 4 options.
- Exactly ONE correct answer.
- Never use:
  - None of the above
  - All of the above
  - Both A and B
- Distractors must be realistic.
- Return ONLY JSON.

Format:

{{
    "question":"...",
    "options":[
        "...",
        "...",
        "...",
        "..."
    ],
    "answer":"..."
}}
"""

        try:

            response = call_ollama_func(prompt)

            response = response.replace("```json", "")
            response = response.replace("```", "")
            response = response.strip()

            q = json.loads(response)

            q["source"] = chunk["source"]
            q["page"] = chunk["page"]
            q["chapter"] = chunk["chapter"]

            if verify_mcq(
                question=q,
                context=chunk["text"],
                call_ollama_func=call_ollama_func
            ):
                questions.append(q)

        except Exception:
            continue

    return questions


def verify_mcq(
    question,
    context,
    call_ollama_func
):

    prompt = f"""
You are checking the quality of a multiple-choice question.

Context:
{context}

Question:
{question}

Check ALL of the following:

1. Exactly ONE option is correct.
2. The correct answer is explicitly supported by the context.
3. The distractors are incorrect according to the context.
4. The question tests ONLY ONE concept.
5. No hallucinated information exists.
6. No "All of the above".
7. No "None of the above".

Reply ONLY with one word:

VALID

or

INVALID
"""

    result = call_ollama_func(prompt)

    return "VALID" in result.upper()