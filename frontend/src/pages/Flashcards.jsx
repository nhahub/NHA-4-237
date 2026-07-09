import { useState } from "react";

function Flashcards() {
  const [topic, setTopic] = useState("");
  const [cards, setCards] = useState([]);

  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const generateCards = async () => {
    if (!topic.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:8000/flashcards",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            topic,
          }),
        }
      );

      const data = await response.json();

      const parsed = data.answer
        .split("===CARD===")
        .map((card) => {
          const question =
            card.match(/Q:\s*([\s\S]*?)(?=\nA:)/)?.[1]?.trim() || "";

          const answer =
            card.match(/A:\s*([\s\S]*)/)?.[1]?.trim() || "";

          return {
            question,
            answer,
          };
        })
        .filter(
          (card) =>
            card.question.length > 0 &&
            card.answer.length > 0
        );

      setCards(parsed);
      
      setCurrentCard(0);
      setFlipped(false);
    } catch (error) {
      console.error(error);
      alert("Failed to generate flashcards.");
    }
  };

  return (
    <div className="p-10 text-white">

      <h1 className="text-4xl font-bold text-slate-900 mb-8">
        🧠 Flashcards
      </h1>

      <input
        type="text"
        placeholder="Enter topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
      />

      <button
        onClick={generateCards}
        className="bg-blue-600 px-5 py-3 rounded-xl mb-8 transition hover:bg-blue-700"
      >
        Generate Flashcards
      </button>

      {cards.length > 0 && (
        <div className="max-w-3xl mx-auto">

          <div
            onClick={() => setFlipped(!flipped)}
            className="bg-white rounded-3xl shadow-xl p-10 min-h-[300px] cursor-pointer flex flex-col justify-center transition hover:scale-[1.02]"
          >

            <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-6 text-center">
              {flipped ? "Answer" : "Question"}
            </h2>

            <div className="text-3xl font-bold text-slate-800 text-center whitespace-pre-wrap">
              {flipped
                ? cards[currentCard].answer
                : cards[currentCard].question}
            </div>

            <p className="text-center text-slate-400 mt-10">
              Click the card to flip
            </p>

          </div>

          <div className="flex justify-between items-center mt-8">

            <button
              disabled={currentCard === 0}
              onClick={() => {
                if (currentCard > 0) {
                  setCurrentCard(currentCard - 1);
                  setFlipped(false);
                }
              }}
              className={`px-6 py-3 rounded-xl transition-colors ${
                currentCard === 0
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-slate-700 text-white hover:bg-slate-800"
              }`}
            >
              ⬅ Previous
            </button>

            <div className="text-slate-800 font-bold text-lg">
              {currentCard + 1} / {cards.length}
            </div>

            <button
              disabled={currentCard === cards.length - 1}
              onClick={() => {
                if (currentCard < cards.length - 1) {
                  setCurrentCard(currentCard + 1);
                  setFlipped(false);
                }
              }}
              className={`px-6 py-3 rounded-xl transition-colors ${
                currentCard === cards.length - 1
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next ➜
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Flashcards;