from fastapi import APIRouter, Header
from backend.security.auth_helper import get_current_email

from backend.data.mongodb import (
    documents_collection,
    history_collection,
    progress_collection
)


router = APIRouter()





@router.get("/dashboard")
def dashboard(authorization: str = Header(...)):

    email = get_current_email(authorization)


    documents = documents_collection.count_documents(
        {
            "email": email
        }
    )

    history = history_collection.count_documents(
        {
            "email": email
        }
    )

    progress = progress_collection.find_one(
        {
            "email": email
        }
    )

    accuracy = 0
    study_hours = 0
    weak_topics = []

    if progress:

        accuracy = progress.get("accuracy", 0)

        study_hours = progress.get("study_hours", 0)

        weak_topics = progress.get("weak_topics", [])

    return {

        "documents": documents,

        "history": history,

        "accuracy": accuracy,

        "study_hours": study_hours,

        "weak_topics": weak_topics

    }