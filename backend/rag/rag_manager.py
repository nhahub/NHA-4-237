from backend.rag.upload import RAGPipeline


# ===================================================
# Singleton RAG Pipeline
# ===================================================

_pipeline = RAGPipeline()


def get_pipeline():
    """
    Returns the single RAG pipeline used
    across the whole application.
    """
    return _pipeline