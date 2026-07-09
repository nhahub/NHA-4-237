def revision_agent(profile):

    mastery = {}

    for topic, weakness in profile["weak_topics"].items():

        mastery[topic] = (1 - weakness) * 100

    weak_topics = sorted(
        mastery.items(),
        key=lambda x: x[1]
    )

    tasks = []

    for topic, score in weak_topics[:3]:

        tasks.append(
            {
                "topic": topic,
                "task":
                f"Review {topic} + Solve 5 MCQs"
            }
        )

    return tasks