from sentence_transformers import SentenceTransformer

_embedding_model = None


def load_embedding_model():
    """
    Load the embedding model only once.
    """

    global _embedding_model

    if _embedding_model is None:

        _embedding_model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

    return _embedding_model


def create_embeddings(chunks):
    """
    Convert text chunks into embeddings.
    """

    model = load_embedding_model()

    embeddings = model.encode(
    chunks,
    convert_to_numpy=True,
    normalize_embeddings=True,
    show_progress_bar=True
)

    return embeddings