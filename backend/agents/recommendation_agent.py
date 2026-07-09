def recommendation_agent(profile, call_llm):

    weak_topics = profile["weak_topics"]

    prompt = f"""
You are a study coach.

Weak Topics:

{weak_topics}

Create recommendations.

Return:

Review:
...

Then solve:
...

Then practice:
...

Priority Topics:
...
"""

    return call_llm(prompt)