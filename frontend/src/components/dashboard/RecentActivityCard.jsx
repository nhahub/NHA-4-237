import { useEffect, useState } from "react";

function RecentActivityCard() {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://127.0.0.1:8000/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // إضافة التحقق من حالة الاستجابة هنا
      if (!response.ok) {
        console.log(await response.text());
        return;
      }

      const data = await response.json();
      setHistory(data.history);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 h-full">
      <h2 className="text-xl font-bold mb-6">
        🕒 Recent Activity
      </h2>

      {history.length === 0 ? (
        <p className="text-slate-500">
          No activity yet.
        </p>
      ) : (
        <div className="space-y-4 pl-2">
          {history.map((item, index) => (
            <div
              key={index}
              className="relative pl-8 pb-6 border-l-2 border-blue-300"
            >
              <div className="absolute -left-2 top-2 w-4 h-4 bg-blue-600 rounded-full"></div>
              <p className="font-semibold">
                📁 {item.title}
              </p>
              <p className="text-sm text-slate-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentActivityCard;