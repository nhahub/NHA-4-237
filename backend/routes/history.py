from fastapi import APIRouter
from backend.data.mongodb import history_collection
from fastapi import Header
from backend.security.auth_helper import get_current_email
router = APIRouter()

    


@router.get("/history")
def get_history(
    authorization: str = Header(...)
):

    email = get_current_email(authorization)

    

    history = list(
        history_collection.find(
            {
                "email": email
            },
            {
                "_id": 0
            }
        ).sort(
            "time",
            -1
        ).limit(10)
    )

    return {
        "history": history
    }
    