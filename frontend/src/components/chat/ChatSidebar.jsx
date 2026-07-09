import { useEffect, useState } from "react";

function ChatSidebar({
  currentSession,
  setCurrentSession,
  refreshMessages,
  refresh,
}) {
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");

  // ==========================
  // Load Chats
  // ==========================

  const loadChats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/chat-sessions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setSessions(data.sessions);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // Search Chats
  // ==========================

  const searchChats = async (text) => {
    setSearch(text);

    if (text.trim() === "") {
      loadChats();
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://127.0.0.1:8000/search-chat?q=${encodeURIComponent(text)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      setSessions(data.sessions);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // Delete Chat
  // ==========================

  const deleteChat = async (sessionId) => {
    console.log("DELETE CLICKED", sessionId);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://127.0.0.1:8000/delete-chat/${sessionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(await response.text());

      await loadChats();
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // Create New Chat
  // ==========================

  const newChat = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/new-chat",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      await loadChats();

      setCurrentSession(data.session_id);

      if (refreshMessages) {
        refreshMessages();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadChats();
  }, [refresh]);

  return (
    <div className="w-72 bg-slate-900 text-white flex flex-col h-screen">
      <div className="p-5 border-b border-slate-700">
        <button
          onClick={newChat}
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-3 font-bold"
        >
          + New Chat
        </button>

        <input
          type="text"
          placeholder="🔍 Search chats..."
          value={search}
          onChange={(e) => searchChats(e.target.value)}
          className="w-full mt-4 rounded-xl p-3 text-black"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sessions.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center justify-between rounded-xl p-3 transition-all duration-200 ${
              currentSession === chat.id
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`}
          >
            <div
              onClick={() => {
                setCurrentSession(chat.id);

                if (refreshMessages) {
                  refreshMessages();
                }
              }}
              className="flex-1 cursor-pointer"
            >
              💬 {chat.title}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
              className="ml-2 text-red-300 hover:text-red-500"
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatSidebar;