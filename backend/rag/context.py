from backend.rag.rag_manager import get_pipeline


def get_rag_context(question):
    """
    Retrieve relevant context from uploaded documents.

    Returns:
        context (str)
        citations (list)
    """

    pipeline = get_pipeline()

    context, citations, _ = pipeline.search(
        question=question,
        top_k=5
    )

    # No relevant results found
    if not context or not context.strip():
        return "", []

    return context, citations