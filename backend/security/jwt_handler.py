from datetime import datetime, timedelta
from jose import jwt
from jose import JWTError


# IMPORTANT:
# غيري الـ SECRET_KEY دي بعدين في ملف .env
SECRET_KEY = "DEPI_AI_PROJECT_SECRET_KEY_2026"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 120


def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update(
        {
            "exp": expire
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt

# ==========================
# Decode JWT
# ==========================

def decode_access_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError as e:

      print("JWT ERROR:", e)

      return None