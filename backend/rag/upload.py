import os

from backend.rag.parser import parse_document
from backend.rag.chunker import chunk_pages
from backend.rag.embeddings import create_embeddings
from backend.rag.vector_store import VectorStore


class RAGPipeline:

    def __init__(self):

        self.vector_store = VectorStore()

    def upload_files(self, file_paths):

        all_chunks = []
        all_sources = []
        all_pages = []
        all_chapters = []

        for file_path in file_paths:

            parsed_pages = parse_document(file_path)

            chunks = chunk_pages(parsed_pages)

            filename = os.path.basename(file_path)

            for chunk in chunks:

                all_chunks.append(chunk["text"])

                all_sources.append(filename)

                all_pages.append(chunk["page"])

                all_chapters.append(
                    f"Page {chunk['page']}"
                )

        if not all_chunks:

            return False

        embeddings = create_embeddings(
            all_chunks
        )
        print("Chunks:", len(all_chunks))
        print("Embeddings shape:", embeddings.shape)

        self.vector_store.build(

            embeddings=embeddings,

            chunks=all_chunks,

            sources=all_sources,

            pages=all_pages,

            chapters=all_chapters

        )

        return True

    def search(
        self,
        question,
        top_k=5
    ):

        from backend.rag.retrieval import get_context

        return get_context(

            question=question,

            vector_store=self.vector_store,

            top_k=top_k

        )