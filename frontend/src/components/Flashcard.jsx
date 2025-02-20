import { useState } from "react";

const Flashcard = ({ flashcard, onUpdate, onDelete }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="p-4 border rounded shadow-md bg-white">
      <h3 className="text-lg font-semibold">{flashcard.question}</h3>
      {showAnswer && <p className="text-green-600">{flashcard.answer}</p>}
      <button onClick={() => setShowAnswer(!showAnswer)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Show Answer
      </button>
      <div className="mt-2 flex gap-2">
        <button onClick={() => onUpdate(flashcard._id, true)} className="px-4 py-2 bg-green-500 text-white rounded">
          Got it Right
        </button>
        <button onClick={() => onUpdate(flashcard._id, false)} className="px-4 py-2 bg-red-500 text-white rounded">
          Got it Wrong
        </button>
        <button onClick={() => onDelete(flashcard._id)} className="px-4 py-2 bg-gray-500 text-white rounded">
          Delete
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
