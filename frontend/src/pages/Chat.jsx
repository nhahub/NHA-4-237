import { useState, useRef, useEffect } from "react";
import ChatSidebar from "../components/chat/ChatSidebar";

function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [refreshChats, setRefreshChats] = useState(false);
  
  // التعديل 3: إضافة الـ Flag الخاص بالـ Rename
  const [chatRenamed, setChatRenamed] = useState(false);

  // التعديل 3: الحصول على اسم المستخدم ورسالة الترحيب الافتراضية
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.name || "Student";

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `👋 Hello ${username}!

I'm your AI Study Assistant.

Ask me anything about your uploaded documents.`,
      citations: [],
    },
  ]);

  // التعديل 2: دالة لإعادة تعيين الشات ومسح الرسائل القديمة
  const resetChat = () => {
    setMessages([
      {
        sender: "ai",
        text: `👋 Hello ${username}!

I'm your AI Study Assistant.

Ask me anything about your uploaded documents.`,
        citations: [],
      },
    ]);
  };

  // التعديل 12 & 2 & 6: دالة تحميل الرسائل مع إضافة الـ Authorization والتحقق من الشات الفاضي
  const loadMessages = async (sessionId) => {
    if (!sessionId) {
      resetChat();
      setChatRenamed(false); // التعديل 3: عند عمل New Chat
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/chat-messages/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      // التعديل 6: التحقق إذا كان الشات فاضي
      if (data.messages.length === 0) {
        resetChat();
        setChatRenamed(false);
      } else {
        setMessages(data.messages);
        setChatRenamed(true); // إذا كان به رسائل مسبقاً فلا يحتاج لإعادة تسمية فورية
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadMessages(currentSession);
  }, [currentSession]);

  // التعديل 9: دالة للتعامل مع حذف الشات إذا كان هو الشات الحالي مفتوحاً
  const handleDeleteChat = (sessionId) => {
    if (sessionId === currentSession) {
      setCurrentSession(null);
      resetChat();
      setChatRenamed(false);
    }
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    // التعديل 10: تشغيل زر الإرسال مرة واحدة فقط والتحقق في البداية
    if (!message.trim() || loading) return;
    setLoading(true);

    const userMessage = message.trim();
    const token = localStorage.getItem("token");

    // تحديث الواجهة برسالة المستخدم فوراً
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setMessage("");

    try {
      // 1. طلب save-message لرسالة المستخدم أولاً
      if (currentSession) {
        await fetch("http://127.0.0.1:8000/save-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            session_id: currentSession,
            sender: "user",
            message: userMessage,
          }),
        });
      }

      // التعديل 8 & 4 & 11: التسمية (Rename) تحدث بعد حفظ الرسالة وبناءً على الـ Flag والـ Logs المؤقتة
      if (currentSession && !chatRenamed) {
        console.log("Rename Start");
        await fetch("http://127.0.0.1:8000/rename-chat", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            session_id: currentSession,
            title: userMessage.substring(0, 35),
          }),
        });
        console.log("Rename Done");
        setChatRenamed(true);
        setRefreshChats((prev) => !prev);
      }

      // 3. إرسال طلب الـ Chat للحصول على رد الذكاء الاصطناعي
      console.log("Chat Start");
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // التعديل 7 & 12: إضافة Authorization للـ chat
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();
      console.log("Chat Done");

      // تحديث الواجهة برد الـ AI
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.answer,
          citations: data.citations || [],
        },
      ]);

      // 4. طلب save-message لرد الـ AI
      if (currentSession) {
        console.log("Save AI");
        await fetch("http://127.0.0.1:8000/save-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            session_id: currentSession,
            sender: "ai",
            message: data.answer,
          }),
        });
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "❌ Backend connection error.",
          citations: [],
        },
      ]);
    } finally {
      // التعديل 1: إصلاح مشكلة الـ Thinking في الـ finally block مباشرة
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex">
      {/* التعديل 5 & 9: تمرير loadMessages والـ handleDeleteChat المحدث للـ Sidebar */}
      <ChatSidebar
        currentSession={currentSession}
        setCurrentSession={setCurrentSession}
        refreshMessages={loadMessages}
        refresh={refreshChats}
        onDeleteChat={handleDeleteChat}
      />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b shadow-sm px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">🤖 AI Study Chat</h1>
            <p className="text-slate-500 mt-1">Ask questions about your uploaded documents</p>
          </div>
          <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl">
            🤖
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-10 py-8 bg-slate-100">
          <div className="max-w-5xl mx-auto space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-3xl rounded-3xl px-6 py-4 shadow-md ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-7">{msg.text}</p>
                  {msg.sender === "ai" && msg.citations?.length > 0 && (
                    <div className="mt-5 border-t pt-4">
                      <h3 className="font-bold mb-2">📚 Sources</h3>
                      {msg.citations.map((citation, i) => (
                        <div key={i} className="text-sm text-slate-500">
                          📄 {citation.source}
                          {" — Page "}
                          {citation.page}
                        </div>
                      ))}
                    </div>
                    )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-3xl px-6 py-4 shadow">🤖 Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t p-6">
          <div className="max-w-5xl mx-auto flex gap-4">
            <input
              type="text"
              value={message}
              disabled={loading}
              placeholder="Ask anything about your documents..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              className="flex-1 rounded-2xl border p-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-2xl font-bold transition disabled:opacity-50"
            >
              {loading ? "Thinking..." : "➤"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;