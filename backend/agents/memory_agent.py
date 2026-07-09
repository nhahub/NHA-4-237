def memory_agent(conversation_memory, profile):

    memory = ""

    memory += f"Student Level: {profile['level']}\n"

    if profile["weak_topics"]:
        memory += "Weak Topics:\n"

        for topic, score in profile["weak_topics"].items():
            memory += f"{topic} -> weakness={score}\n"

    memory += "\nRecent Conversation:\n"

    for m in conversation_memory[-5:]:

        memory += f"""
User: {m['question']}

Assistant:
{m['answer']}
"""

    return memory