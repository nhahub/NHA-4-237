from fastapi import Header, HTTPException

from backend.security.jwt_handler import decode_access_token


def get_current_email(
    authorization: str = Header(...)
):

    token = authorization.replace("Bearer ", "")

    payload = decode_access_token(token)

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid or Expired Token"
        )

    return payload["sub"]