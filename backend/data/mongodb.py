from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client["ai_study_assistant"]

# Collections
users_collection = db["users"]

history_collection = db["history"]

documents_collection = db["documents"]

progress_collection = db["progress"]

chat_sessions_collection = db["chat_sessions"]

chat_messages_collection = db["chat_messages"]

settings_collection = db["settings"]

print(" MongoDB Connected Successfully")