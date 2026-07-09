from fastapi import APIRouter
from passlib.context import CryptContext
from fastapi import Header
from backend.security.auth_helper import get_current_email

from backend.models.user_model import (
    UserRegister,
    UserLogin,
    UpdateProfile,
    ChangePassword,
    UserSettings
)

from backend.data.mongodb import (
    users_collection,
    settings_collection,
    progress_collection
)

from backend.security.jwt_handler import create_access_token


router = APIRouter()

# Password Hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)





@router.post("/register")
def register(user: UserRegister):

    # Check if email already exists
    existing = users_collection.find_one(
        {"email": user.email}
    )

    if existing:
        return {
            "success": False,
            "message": "Email already exists"
        }

    # Hash password
    hashed_password = pwd_context.hash(user.password)

    # Save user
    users_collection.insert_one(
        {
            "name": user.name,
            "email": user.email,
            "password": hashed_password
        }
    )

    return {
        "success": True,
        "message": "User registered successfully"
    }
    
    

@router.post("/login")
def login(user: UserLogin):

    existing = users_collection.find_one(
        {"email": user.email}
    )

    if not existing:
        return {
            "success": False,
            "message": "Email not found"
        }

    if not pwd_context.verify(user.password, existing["password"]):
        return {
            "success": False,
            "message": "Invalid password"
        }
        
    
    progress = progress_collection.find_one(
        {
            "email": existing["email"]
        }
    )

    if not progress:
        progress_collection.insert_one(
            {
                "email": existing["email"],
                "study_hours": 0,
                "questions": 0,
                "correct_answers": 0,
                "accuracy": 0,
                "weak_topics": []
            }
        )

    token = create_access_token(
    {
        "sub": existing["email"]
    }
)

    return {
    "success": True,
    "message": "Login successful",
    "access_token": token,
    "token_type": "bearer",
    "user": {
        "name": existing["name"],
        "email": existing["email"]
    }
}    
    

# ==========================
# Get Profile
# ==========================

@router.get("/profile")
def get_profile(authorization: str = Header(...)):

    email = get_current_email(authorization)

    user = users_collection.find_one(
        {
            "email": email
        },
        {
            "_id": 0,
            "password": 0
        }
    )

    if not user:
        return {
            "success": False,
            "message": "User not found"
        }

    return {
        "success": True,
        "user": user
    }
    
# ==========================
# Update Profile
# ==========================

@router.put("/profile")
def update_profile(
    profile: UpdateProfile,
    authorization: str = Header(...)
):

    email = get_current_email(authorization)

    

    if profile.email != email:

       existing = users_collection.find_one(
        {
            "email": profile.email
        }
    )

       if existing:

         return {
            "success": False,
            "message": "Email already exists"
         }

    users_collection.update_one(
        {
            "email": email
        },
        {
            "$set": {
                "name": profile.name,
                "email": profile.email
            }
        }
    )

    return {
    "success": True,
    "message": "Profile updated successfully. Please login again."
    }
    
    
    # ==========================
# Change Password
# ==========================

@router.put("/change-password")
def change_password(
    req: ChangePassword,
    authorization: str = Header(...)
):

    email = get_current_email(authorization)


    user = users_collection.find_one(
        {
            "email": email
        }
    )

    if not user:
        return {
            "success": False,
            "message": "User not found"
        }

    if not pwd_context.verify(
        req.current_password,
        user["password"]
    ):
        return {
            "success": False,
            "message": "Current password is incorrect"
        }

    hashed_password = pwd_context.hash(
        req.new_password
    )

    users_collection.update_one(
        {
            "email": email
        },
        {
            "$set": {
                "password": hashed_password
            }
        }
    )

    return {
        "success": True,
        "message": "Password changed successfully"
    }
    
    
# ==========================
# Get Settings
# ==========================

@router.get("/settings")
def get_settings(
    authorization: str = Header(...)
):

    email = get_current_email(authorization)

    

    settings = settings_collection.find_one(
        {
            "email": email
        },
        {
            "_id": 0,
            "email": 0
        }
    )

    if not settings:

        settings = {
            "dark_mode": False,
            "notifications": True,
            "ai_model": "Mistral"
        }

    return {
        "success": True,
        "settings": settings
    }


# ==========================
# Save Settings
# ==========================

@router.put("/settings")
def save_settings(
    data: UserSettings,
    authorization: str = Header(...)
):

    email = get_current_email(authorization)

   

    settings_collection.update_one(
        {
            "email": email
        },
        {
            "$set": {
                "email": email,
                "dark_mode": data.dark_mode,
                "notifications": data.notifications,
                "ai_model": data.ai_model
            }
        },
        upsert=True
    )

    return {
        "success": True,
        "message": "Settings saved successfully"
    }