def critic_agent(
        question,
        answer,
        call_llm
):

    prompt = f"""
You are a strict reviewer.

Question:
{question}

Answer:
{answer}

Check:

- correctness
- hallucination
- missing details
- clarity

Return:

Improved Answer:

...
"""

    improved = call_llm(prompt)

    return improved