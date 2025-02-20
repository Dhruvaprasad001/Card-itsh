const Flashcard = require("../models/Flashcard");

exports.createFlashcard = async (req, res) => {
  try {
    const { question, answer } = req.body;
    
    const flashcard = new Flashcard({
      question,
      answer,
      box: 1, 
      nextReviewDate: new Date() 
    });

    await flashcard.save();
    res.status(201).json(flashcard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find().sort({ nextReviewDate: 1 })
    res.json(flashcards)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
};


exports.updateFlashcard = async (req, res) => {
  try {
    const { id } = req.params
    const { correct } = req.body

    const flashcard = await Flashcard.findById(id)
    if (!flashcard) return res.status(404).json({ error: "Flashcard not found" })

    if (correct) {
      flashcard.box = Math.min(flashcard.box + 1, 5)
    } else {
      flashcard.box = 1
    }

    const intervals = [1, 2, 5, 10, 30]
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + intervals[flashcard.box - 1])
    flashcard.nextReviewDate = nextReview

    await flashcard.save()
    res.json(flashcard)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
};

exports.deleteFlashcard = async (req, res) => {
  try {
    await Flashcard.findByIdAndDelete(req.params.id)
    res.json({ message: "Flashcard deleted" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
