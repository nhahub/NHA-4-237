from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from datetime import datetime

from fastapi import Header
from ai_service import call_ollama

from backend.agents.summarizer_agent import summarizer_agent
from backend.agents.quiz_agent import generate_mcq
from backend.agents.tutor_agent import tutor_agent
from backend.agents.planner_agent import planner_agent
from backend.agents.interview_agent import interview_agent
from backend.agents.quiz_agent import (
    generate_written_questions,
    generate_study_quiz
)
from backend.agents.exam_agent import generate_exam
from backend.agents.explanation_agent import explain_answer
from backend.agents.evaluator_agent import evaluate_answer
from fastapi import UploadFile, File
from typing import List
import os
import shutil

from backend.rag.rag_manager import get_pipeline
from backend.rag.context import get_rag_context
from backend.agents.code_generator_agent import code_generator_agent
from backend.agents.project_builder_agent import project_builder_agent
from backend.security.auth_helper import get_current_email

from backend.routes.auth import router as auth_router
from backend.routes.dashboard import router as dashboard_router
from backend.data.mongodb import (
    documents_collection,
    history_collection,
    chat_sessions_collection,
    chat_messages_collection,
    progress_collection
)

from backend.routes.history import router as history_router
from backend.routes.chat_history import router as chat_history_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(history_router)
app.include_router(chat_history_router)

UPLOAD_FOLDER = "temp_pdfs"
uploaded_files = []
uploaded_paths = []

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Request Models
# =========================

class ChatRequest(BaseModel):
    message: str

class TopicRequest(BaseModel):
    topic: str
    mode: str = "normal"
    difficulty: str = "Medium"
    num_questions: int = 5

class ExplanationRequest(BaseModel):
    question: str
    student_answer: str
    correct_answer: str

class WrittenEvaluationRequest(BaseModel):
    question: str
    answer: str

class RAGRequest(BaseModel):
    question: str

class ConversationRequest(BaseModel):
    topic: str
    message: str
    history: list = []
    
class CodeRequest(BaseModel):
    topic: str
    language: str
    
class ProjectRequest(BaseModel):
    topic: str

class ResultRequest(BaseModel):
    topic: str
    score: float
    total: float

# =========================
# Chat Endpoint
# =========================

@app.post("/chat")
def chat(req: ChatRequest):

    context, citations = get_rag_context(req.message)

    if not context:
        prompt = f"""
You are an expert AI Study Assistant.

Answer this question using your own knowledge.

Question:
{req.message}
"""
        answer = call_ollama(prompt)
        return {
            "answer": answer,
            "citations": [],
            "source": "general"
        }

    prompt = f"""
You are an AI Study Assistant.

You MUST answer ONLY using the retrieved context.

CRITICAL RULES

1. If the answer is explicitly supported by the context,
answer normally.

2. If the answer is NOT explicitly stated in the context,
DO NOT infer.
DO NOT assume.
DO NOT use background knowledge.
DO NOT partially answer.

Instead reply with EXACTLY this single phrase:

NOT_ENOUGH_CONTEXT

Do not write anything else.

Retrieved Context:

{context}

Question:

{req.message}
"""

    answer = call_ollama(prompt)

    if "NOT_ENOUGH_CONTEXT" in answer:
        prompt = f"""
You are an expert AI Study Assistant.

The uploaded documents do not contain enough information.

Answer the following question using your own knowledge.

Question:
{req.message}
"""
        general_answer = call_ollama(prompt)
        return {
            "answer": general_answer,
            "citations": [],
            "source": "general"
        }

    return {
        "answer": answer,
        "citations": citations,
        "source": "documents"
    }
    
# =========================
# project builder
# =========================
    
@app.post("/project-builder")
def build_project(req: ProjectRequest):

    answer = project_builder_agent(
        topic=req.topic,
        call_llm=call_ollama
    )

    print("=" * 50)
    print(answer)
    print(type(answer))
    print("=" * 50)

    return answer

# =========================
# Summary Agent
# =========================

@app.post("/summary")
def summary(
    req: TopicRequest,
    authorization: str = Header(...)
):
    email = get_current_email(authorization)
    
    context, citations = get_rag_context(req.topic)

    if not context:
        return {
            "answer": "I couldn't find enough information in the uploaded documents.",
            "citations": []
        }

    answer = summarizer_agent(
        context,
        call_ollama
    )

    return {
        "answer": answer,
        "citations": citations
    }

# =========================
# Learning Path Agent
# =========================

@app.post("/planner")
def planner(
    req: TopicRequest,
    authorization: str = Header(...)
):
    email = get_current_email(authorization)

    context, citations = get_rag_context(req.topic)

    if not context:
        return {
            "answer": "I couldn't find enough information in the uploaded documents.",
            "citations": []
        }

    answer = planner_agent(
        context=context,
        weak_topics={},
        level="Beginner",
        history=[],
        call_ollama_func=call_ollama
    )

    return {
        "answer": answer,
        "citations": citations
    }


# =========================
# Tutor Agent
# =========================

@app.post("/tutor")
def tutor(
    req: TopicRequest,
    authorization: str = Header(...)
):
    email = get_current_email(authorization)

    context, citations = get_rag_context(req.topic)

    if not context:
        return {
            "answer": "I couldn't find enough information in the uploaded documents.",
            "citations": []
        }

    answer = tutor_agent(
        context=context,
        history=[],
        call_llm=call_ollama
    )

    return {
        "answer": answer,
        "citations": citations
    }


# =========================
# Tutor Chat
# =========================

@app.post("/tutor-chat")
def tutor_chat(
    req: ConversationRequest,
    authorization: str = Header(...)
):
    email = get_current_email(authorization)

    context, citations = get_rag_context(req.topic)

    if not context:
        return {
            "answer": "I couldn't find enough information in the uploaded documents."
        }

    answer = tutor_agent(
        context=context,
        history=req.history,
        call_llm=call_ollama
    )

    return {
        "answer": answer
    }

# =========================
# Interview Chat
# =========================

@app.post("/interview-chat")
def interview_chat(
    req: ConversationRequest,
    authorization: str = Header(...)
):
    email = get_current_email(authorization)

    context, citations = get_rag_context(req.topic)

    if not context:
        return {
            "answer": "I couldn't find enough information in the uploaded documents."
        }

    # التقييم وباقي المحادثة يحصل من هنا مباشرة بعد أول إجابة من الطالب
    answer = interview_agent(
        context=context,
        history=req.history,
        call_llm=call_ollama
    )

    return {
        "answer": answer
    }

# =========================
# Quiz Agent
# =========================

@app.post("/quiz")
def quiz(
    req: TopicRequest,
    authorization: str = Header(...)
):
    email = get_current_email(authorization)

    pipeline = get_pipeline()

    context, citations, retrieved_chunks = pipeline.search(
        req.topic,
        top_k=5
    )

    if not context:
        return {
            "questions": [],
            "citations": [],
            "error": "I couldn't find enough information in the uploaded documents."
        }

    questions = generate_study_quiz(
        retrieved_chunks=retrieved_chunks,
        difficulty="Medium",
        call_ollama_func=call_ollama
    )

    written_questions = generate_written_questions(
        context=context,
        call_ollama_func=call_ollama
    )

    return {
        "questions": questions,
        "written_questions": written_questions,
        "citations": citations
    }

# =========================
# Quiz Result & Progress
# =========================

@app.post("/quiz-result")
def quiz_result(
    req: ResultRequest,
    authorization: str = Header(...)
):
    email = get_current_email(authorization)
    
    accuracy = 0
    if req.total > 0:
        accuracy = round((req.score / req.total) * 100)

    progress_collection.update_one(
        {"email": email},
        {
            "$set": {
                "accuracy": accuracy
            },
            "$inc": {
                "questions": int(req.total),
                "correct_answers": int(req.score)
            }
        },
        upsert=True
    )
    
    if accuracy < 50:
        progress_collection.update_one(
            {"email": email},
            {
                "$addToSet": {
                    "weak_topics": req.topic
                }
            }
        )
    
    return {"success": True, "accuracy": accuracy}


# =========================
# Interview Agent (Initial Prompt Only)
# =========================

@app.post("/interview")
def interview(
    req: TopicRequest,
    authorization: str = Header(...)
):
    email = get_current_email(authorization)

    context, citations = get_rag_context(req.topic)

    if not context:
        return {
            "answer": "I couldn't find enough information in the uploaded documents.",
            "citations": []
        }

    prompt = f"""
You are a professional university interviewer.

Retrieved Context:
{context}

The candidate has just started the interview on the topic: {req.topic}.

Introduce yourself briefly.

Ask ONLY ONE interview question.

Do NOT evaluate anything.
Do NOT assign a score.
Do NOT mention strengths.
Do NOT mention weaknesses.
Do NOT provide a better answer.

Return ONLY the interviewer message.
"""

    answer = call_ollama(prompt)

    return {
        "answer": answer,
        "citations": citations
    }

# =========================
# Flashcards
# =========================

@app.post("/flashcards")
def flashcards(
    req: TopicRequest,
    authorization: str = Header(...)
):
    email = get_current_email(authorization)

    context, citations = get_rag_context(req.topic)

    if not context:
        return {
            "answer": "I couldn't find enough information in the uploaded documents.",
            "citations": []
        }

    prompt = f"""
Generate EXACTLY 5 flashcards.

IMPORTANT:

Separate every flashcard using exactly this line:

===CARD===

FORMAT:

===CARD===
Q: ...
A: ...

===CARD===
Q: ...
A: ...

Do NOT use:
- Flashcard 1
- Flashcard 2
- Numbers
- Markdown
- **
- Bullet points

Generate the flashcards ONLY from the following context.

Context:
{context}
"""

    answer = call_ollama(prompt)

    return {
        "answer": answer,
        "citations": citations
    }


# =========================
# Exam
# =========================

@app.post("/exam")
def exam(
    req: TopicRequest,
    authorization: str = Header(...)
):
    email = get_current_email(authorization)

    pipeline = get_pipeline()

    context, citations, retrieved_chunks = pipeline.search(
        req.topic,
        top_k=req.num_questions * 3
    )

    if not context:
        return {
            "questions": [],
            "citations": [],
            "error": "I couldn't find enough information in the uploaded documents."
        }

    questions = generate_exam(
        retrieved_chunks=retrieved_chunks,
        difficulty=req.difficulty,
        num_questions=req.num_questions,
        mode=req.mode,
        call_llm=call_ollama
    )

    return {
        "questions": questions,
        "citations": citations
    }


# =========================
# Exam Result & Progress
# =========================

@app.post("/exam-result")
def exam_result(
    req: ResultRequest,
    authorization: str = Header(...)
):
    email = get_current_email(authorization)
    
    accuracy = 0
    if req.total > 0:
        accuracy = round((req.score / req.total) * 100)

    progress_collection.update_one(
        {"email": email},
        {
            "$set": {
                "accuracy": accuracy
            },
            "$inc": {
                "questions": int(req.total),
                "correct_answers": int(req.score)
            }
        },
        upsert=True
    )
    
    if accuracy < 50:
        progress_collection.update_one(
            {"email": email},
            {
                "$addToSet": {
                    "weak_topics": req.topic
                }
            }
        )
    
    return {"success": True, "accuracy": accuracy}


# =========================
# Study Mode Tracking
# =========================

@app.post("/study-mode")
def study_mode(authorization: str = Header(...)):
    email = get_current_email(authorization)
    
    progress_collection.update_one(
        {"email": email},
        {
            "$inc": {
                "study_hours": 1
            }
        },
        upsert=True
    )
    return {"success": True, "message": "Study time updated successfully"}


# =========================
# Explanation Agent
# =========================

@app.post("/explanation")
def explanation(req: ExplanationRequest):

    context, citations = get_rag_context(req.question)

    if not context:
        return {
            "answer": "I couldn't find enough information in the uploaded documents.",
            "citations": []
        }

    source = citations[0]["source"] if citations else "Unknown"
    page = citations[0]["page"] if citations else "Unknown"
    chapter = citations[0]["chapter"] if citations else "Unknown"

    answer = explain_answer(
        question=req.question,
        student_answer=req.student_answer,
        correct_answer=req.correct_answer,
        context=context,
        source=source,
        page=page,
        chapter=chapter,
        call_llm=call_ollama
    )

    return {
        "answer": answer,
        "citations": citations
    }

# =========================
# Evaluate Written Answer
# =========================

@app.post("/evaluate-written")
def evaluate_written(req: WrittenEvaluationRequest):

    context, citations = get_rag_context(req.question)

    if not context:
        return {
            "feedback": "I couldn't find enough information in the uploaded documents."
        }

    feedback = evaluate_answer(
        question=req.question,
        answer=req.answer,
        context=context,
        call_ollama_func=call_ollama
    )

    return {
        "feedback": feedback
    }


# =========================
# Code Generator
# =========================

@app.post("/code-generator")
def generate_code(req: CodeRequest):

    answer = code_generator_agent(
        topic=req.topic,
        language=req.language,
        call_llm=call_ollama
    )

    return answer

# =====================================
# Upload Documents (RAG)
# =====================================
@app.post("/upload")
async def upload_documents(
    files: List[UploadFile] = File(...),
    authorization: str = Header(...)
):
    email = get_current_email(authorization)
    
    global uploaded_files
    global uploaded_paths

    pipeline = get_pipeline()

    saved_files = []

    # ==========================
    # Save uploaded files
    # ==========================

    for file in files:

        file_path = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )

        saved_files.append(file_path)
        documents_collection.insert_one(
    {
         "email": email,
        "filename": file.filename,
        "path": file_path,
        "upload_date": datetime.utcnow(),
        "status": "processed"
    }
)
        history_collection.insert_one(
    {
        "email": email,
        "type": "Upload",
        "title": file.filename,
        "description": "Document uploaded successfully",
        "time": datetime.utcnow()
    }
)

    # ==========================
    # Keep all uploaded files
    # ==========================

    for path in saved_files:
        filename = os.path.basename(path)

        if filename not in uploaded_files:
            uploaded_files.append(filename)

        if path not in uploaded_paths:
            uploaded_paths.append(path)

    # ==========================
    # Build RAG from ALL files
    # ==========================

    success = pipeline.upload_files(
        uploaded_paths
    )

    if not success:
        return {
            "success": False,
            "message": "No readable documents."
        }

    return {
        "success": True,
        "message": f"{len(saved_files)} files uploaded successfully.",
        "files": uploaded_files
    }


# =====================================
# Get Uploaded Files
# =====================================

@app.get("/uploaded-files")
def get_uploaded_files(
    authorization: str = Header(...)
):
    email = get_current_email(authorization)

    documents = list(
        documents_collection.find(
            {
                "email": email
            },
            {
                "_id": 0,
                "filename": 1,
                "upload_date": 1,
                "status": 1
            }
        )
    )

    return {
        "files": documents
    }

#================================
# RAG Test
# =====================================

@app.post("/rag-test")
def rag_test(req: RAGRequest):
    context, citations = get_rag_context(req.question)

    if not context:

        return {
            "question": req.question,
            "answer": "I couldn't find this information in the uploaded documents.",
            "citations": []
        }

    prompt = f"""
You are an AI study assistant.

Answer ONLY using the provided context.

Context:
{context}

Question:
{req.question}

Answer:
"""

    answer = call_ollama(prompt)

    return {
        "question": req.question,
        "answer": answer,
        "citations": citations
    }


@app.delete("/delete-chat/{session_id}")
def delete_chat(
    session_id: str,
    authorization: str = Header(...)
):

    email = get_current_email(authorization)

    result = chat_sessions_collection.delete_one(
        {
            "_id": ObjectId(session_id),
            "email": email
        }
    )

    chat_messages_collection.delete_many(
        {
            "session_id": session_id,
            "email": email
        }
    )

    return {
        "success": True,
        "deleted": result.deleted_count
    }