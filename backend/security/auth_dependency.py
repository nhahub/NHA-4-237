from fastapi import Header, HTTPException
from jose import jwt

from backend.security.jwt_handler import (
    SECRET_KEY,
    ALGORITHM
)


def get_current_user(
    authorization: str = Header(...)
):

    try:

        token = authorization.replace(
            "Bearer ",
            ""
        )

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload["sub"]

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )