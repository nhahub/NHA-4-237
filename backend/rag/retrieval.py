from backend.rag.search import semantic_search


def get_context(
    question,
    vector_store,
    top_k=3
):
    """
    Retrieve relevant chunks.

    Returns:
        context (str)
        citations (list)
        retrieved_chunks (list)
    """

    results = semantic_search(
        query=question,
        vector_store=vector_store,
        top_k=top_k
    )

    if not results:
        return "", [], []

    context = "\n\n".join(
        chunk["text"]
        for chunk in results
    )

    citations = [
        {
            "source": chunk["source"],
            "page": chunk["page"],
            "chapter": chunk["chapter"]
        }
        for chunk in results
    ]

    return context, citations, results