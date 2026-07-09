def reflection_agent(
        profile,
        call_llm
):

    history = profile["history"]
    weak_topics = profile["weak_topics"]
    level = profile["level"]

    prompt = f"""
You are a learning coach.

Student Level:
{level}

Weak Topics:
{weak_topics}

History:
{history}

Analyze:

1. Weak topics.

2. Learning progress.

3. Mistakes.

4. Create a 3-day study plan.

Return:

Weak Topics:
...

Learning Progress:
...

Study Plan:

Day 1:
...

Day 2:
...

Day 3:
...
"""

    return call_llm(prompt)