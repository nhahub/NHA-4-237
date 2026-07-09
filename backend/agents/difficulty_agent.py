def difficulty_agent(profile):

    history = profile["history"]

    if not history:
        return "Beginner", "Easy"

    avg_accuracy = (
        sum(item["accuracy"] for item in history)
        / len(history)
    )

    weak_topics = profile["weak_topics"]

    avg_weakness = (
        sum(weak_topics.values()) / len(weak_topics)
        if weak_topics else 0
    )

    score = (
        0.7 * avg_accuracy
        + 0.3 * (1 - avg_weakness)
    )

    if score < 0.4:
        return "Beginner", "Easy"

    elif score < 0.75:
        return "Intermediate", "Medium"

    else:
        return "Advanced", "Hard"