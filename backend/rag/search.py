from backend.rag.embeddings import load_embedding_model


def semantic_search(
    query,
    vector_store,
    top_k=5
):
    """
    Perform semantic search using normalized embeddings.
    """

    model = load_embedding_model()

    query_embedding = model.encode(
        query,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    results = vector_store.search(
        query_embedding,
        k=top_k
    )

    return results