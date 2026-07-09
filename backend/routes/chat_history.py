from fastapi import APIRouter, Header
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel
from backend.security.auth_helper import get_current_email

from backend.data.mongodb import (
    chat_sessions_collection,
    chat_messages_collection,
    progress_collection
)

router = APIRouter()



# ==========================
# Create New Chat
# ==========================

@router.post("/new-chat")
def new_chat(
    authorization: str = Header(...)
):
    email = get_current_email(authorization)

    

    session = {
        "email": email,
        "title": "New Chat",
        "created_at": datetime.utcnow()
    }
    result = chat_sessions_collection.insert_one(session)
    return {
        "session_id": str(result.inserted_id),
        "title": "New Chat"
    }
    
# ==========================
# Get All Chats
# ==========================

@router.get("/chat-sessions")
def get_chat_sessions(
    authorization: str = Header(...)
):
    email = get_current_email(authorization)

    
    sessions = []
    cursor = chat_sessions_collection.find(
        {
            "email": email
        }
    ).sort(
        "created_at",
        -1
    )
    for session in cursor:
        sessions.append({
            "id": str(session["_id"]),
            "title": session["title"]
        })
    return {
        "sessions": sessions
    }
    
# ==========================
# Requests Models
# ==========================

class MessageRequest(BaseModel):
    session_id: str
    sender: str
    message: str

class RenameChatRequest(BaseModel):
    session_id: str
    title: str

# ==========================
# Save Message
# ==========================

@router.post("/save-message")
def save_message(
    req: MessageRequest,
    authorization: str = Header(...)
):
    email = get_current_email(authorization)
    
    

    # تم إضافة الـ email هنا لتسجيل الرسالة باسم المستخدم
    chat_messages_collection.insert_one(
        {
            "email": email,
            "session_id": req.session_id,
            "sender": req.sender,
            "message": req.message,
            "created_at": datetime.utcnow()
        }
    )

    # كل رسالة من المستخدم تعتبر سؤال
    if req.sender == "user":
        progress_collection.update_one(
            {
                "email": email
            },
            {
                "$inc": {
                    "questions": 1
                }
            }
        )

    return {
        "success": True
    }

# ==========================
# Rename Chat
# ==========================

@router.put("/rename-chat")
def rename_chat(
    req: RenameChatRequest,
    authorization: str = Header(...)
):
    email = get_current_email(authorization)

    

    # تم إضافة شرط الـ email هنا لحماية الجلسة من التعديل بواسطة مستخدم آخر
    chat_sessions_collection.update_one(
        {
            "_id": ObjectId(req.session_id),
            "email": email
        },
        {
            "$set": {
                "title": req.title
            }
        }
    )
    return {
        "success": True
    }
    
# ==========================
# Get Messages
# ==========================

@router.get("/chat-messages/{session_id}")
def get_messages(
    session_id: str,
    authorization: str = Header(...)
):
    email = get_current_email(authorization)

   

    messages = []
    # تم إضافة شرط الـ email هنا لضمان استرجاع رسائل المستخدم الحالي فقط
    cursor = chat_messages_collection.find(
        {
            "session_id": session_id,
            "email": email
        }
    ).sort(
        "created_at",
        1
    )
    for msg in cursor:
        messages.append(
            {
                "sender": msg["sender"],
                "text": msg["message"]
            }
        )
    return {
        "messages": messages
    }
    
# ==========================
# Search Chats
# ==========================

@router.get("/search-chat")
def search_chat(
    q: str,
    authorization: str = Header(...)
):
    email = get_current_email(authorization)

   

    sessions = []
    # تم إضافة شرط الـ email هنا للبحث في محادثات المستخدم الحالي فقط
    cursor = chat_sessions_collection.find(
        {
            "email": email,
            "title": {
                "$regex": q,
                "$options": "i"
            }
        }
    ).sort(
        "created_at",
        -1
    )
    for session in cursor:
        sessions.append(
            {
                "id": str(session["_id"]),
                "title": session["title"]
            }
        )
    return {
        "sessions": sessions
    }