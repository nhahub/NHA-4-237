import faiss
import numpy as np



class VectorStore:

    def __init__(self):

        self.index = None

        self.chunks = []

        self.sources = []

        self.pages = []

        self.chapters = []

    # ==========================================
    # Build FAISS Index
    # ==========================================

    def build(
        self,
        embeddings,
        chunks,
        sources,
        pages,
        chapters
    ):

        # Normalize embeddings
        faiss.normalize_L2(embeddings)

        dimension = embeddings.shape[1]

        self.index = faiss.IndexFlatIP(dimension)

        self.index.add(
            embeddings.astype("float32")
        )

        self.chunks = chunks

        self.sources = sources

        self.pages = pages

        self.chapters = chapters

    # ==========================================
    # Semantic Search
    # ==========================================

    def search(
        self,
        query_embedding,
        k=5,
        threshold=0.0
    ):

        if self.index is None:
            return []

        query_embedding = np.array(
            [query_embedding],
            dtype="float32"
        )

        # Normalize query
        faiss.normalize_L2(query_embedding)

        distances, indices = self.index.search(

            query_embedding,

            k

        )
        print("=" * 50)
        print("Distances:", distances)
        print("Indices:", indices)
        print("=" * 50)

        results = []

        for distance, idx in zip(
            distances[0],
            indices[0]
        ):

            if idx == -1:
                continue

            # Ignore weak matches
            if float(distance) < threshold:
                continue

            results.append({

                "text": self.chunks[idx],

                "source": self.sources[idx],

                "page": self.pages[idx],

                "chapter": self.chapters[idx],

                "distance": float(distance)

            })

        print(f"Retrieved {len(results)} chunks")
        for r in results:
            print(r["page"], r["distance"])

        return results