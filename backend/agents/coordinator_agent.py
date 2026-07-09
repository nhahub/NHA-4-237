def coordinator_agent(
        question,
        selected_chapter,
        conversation_memory,
        profile,
        get_context,
        router_agent,
        retrieval_agent,
        memory_agent,
        critic_agent,
        reflection_agent,
        recommendation_agent,
        call_llm
):

    retrieval_result = retrieval_agent(
        question,
        selected_chapter,
        get_context
    )

    context = retrieval_result["context"]
    docs = retrieval_result["docs"]

    memory = memory_agent(
        conversation_memory,
        profile
    )

    prompt = f"""
Conversation:

{memory}

Context:

{context}

Question:

{question}

Answer:
"""

    answer = call_llm(prompt)

    answer = critic_agent(
        question,
        answer,
        call_llm
    )

    reflection = reflection_agent(
        profile,
        call_llm
    )

    recommendation = recommendation_agent(
        profile,
        call_llm
    )

    return {
        "answer": answer,
        "docs": docs,
        "context": context,
        "reflection": reflection,
        "recommendation": recommendation
    }
    