import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [cards, setCards] = useState([]);
  const [dueCards, setDueCards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [showDue, setShowDue] = useState(true);
  const [showAnswers, setShowAnswers] = useState({});

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
    try {
      const response = await axios.get("http://localhost:5000/api/flashcards");
      setCards(response.data);
      const today = new Date();
      const dueOnes = response.data.filter(card => new Date(card.nextReviewDate) <= today);
      setDueCards(dueOnes);
    } catch (error) {
      console.log("Error loading cards:", error);
    }
  }

  async function addCard(e) {
    e.preventDefault();
    try {
      if (!question.trim() || !answer.trim()) {
        alert("Please fill in both question and answer");
        return;
      }

      const newCard = {
        question: question,
        answer: answer,
        box: 1,
        nextReviewDate: new Date()
      };
      
      const response = await axios.post("http://localhost:5000/api/flashcards", newCard);
      
      if (response.data) {
        setCards(prevCards => [...prevCards, response.data]);
        setDueCards(prevDue => [...prevDue, response.data]);
        setQuestion("");
        setAnswer("");
      }
    } catch (error) {
      console.log("Error adding card:", error);
      alert("Failed to add card. Please try again.");
    }
  }

  async function answerCard(id, isCorrect) {
    try {
      const response = await axios.put(`http://localhost:5000/api/flashcards/${id}`, { correct: isCorrect });
      setCards(cards.map(card => card._id === id ? response.data : card));
      setDueCards(dueCards.filter(card => card._id !== id));
    } catch (error) {
      console.log("Error updating card:", error);
    }
  }

  async function deleteCard(id) {
    try {
      await axios.delete(`http://localhost:5000/api/flashcards/${id}`);
      setCards(cards.filter(card => card._id !== id));
      setDueCards(dueCards.filter(card => card._id !== id));
    } catch (error) {
      console.log("Error deleting card:", error);
    }
  }

  function toggleAnswer(id) {
    setShowAnswers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl mb-4">Flashcards</h1>
      
      <div className="bg-blue-100 p-4 mb-4 rounded">
        <p>{dueCards.length} cards due today</p>
      </div>

      <form onSubmit={addCard} className="bg-gray-50 p-4 mb-4 rounded">
        <input
          placeholder="Question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          placeholder="Answer"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Card
        </button>
      </form>

      <div className="mb-4">
        <button 
          onClick={() => setShowDue(true)}
          className={showDue ? "bg-blue-500 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
        >
          Due Cards
        </button>
        <button 
          onClick={() => setShowDue(false)}
          className={!showDue ? "bg-blue-500 text-white px-4 py-2 rounded ml-2" : "bg-gray-200 px-4 py-2 rounded ml-2"}
        >
          All Cards
        </button>
      </div>

      <div className="space-y-4">
        {(showDue ? dueCards : cards).map(card => (
          <div key={card._id} className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col space-y-4">
              {/* Question */}
              <p className="font-bold text-lg">{card.question}</p>
              
              {/* Show/Hide Answer Button */}
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleAnswer(card._id)}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded transition-colors font-medium"
                >
                  {showAnswers[card._id] ? "Hide Answer" : "Show Answer"}
                </button>
                <button 
                  onClick={() => deleteCard(card._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition-colors font-medium"
                >
                  Delete
                </button>
              </div>

              {/* Answer Section */}
              {showAnswers[card._id] && (
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-700">{card.answer}</p>
                </div>
              )}
              
              {/* Review Buttons */}
              {showDue && showAnswers[card._id] && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => answerCard(card._id, true)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition-colors font-medium"
                  >
                    Correct
                  </button>
                  <button 
                    onClick={() => answerCard(card._id, false)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition-colors font-medium"
                  >
                    Wrong
                  </button>
                </div>
              )}

              {/* Box Info */}
              {!showDue && (
                <p className="text-sm text-gray-500">
                  Box: {card.box} | Next Review: {new Date(card.nextReviewDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

      