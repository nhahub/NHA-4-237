def chunk_text(text, chunk_size=400, overlap=80):

    chunks = []

    start = 0

    while start < len(text):

        end = start + chunk_size

        chunk = text[start:end]

        if chunk.strip():

            chunks.append(chunk)

        start += chunk_size - overlap

    return chunks


def chunk_pages(parsed_pages):

    all_chunks = []

    for page in parsed_pages:

        chunks = chunk_text(page["text"])

        for chunk in chunks:

            all_chunks.append({

                "page": page["page"],

                "text": chunk

            })

    return all_chunks