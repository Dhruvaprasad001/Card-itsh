const express = require("express");
const {
  createFlashcard,
  getFlashcards,
  updateFlashcard,
  deleteFlashcard
} = require("../controllers/flashcardController");

const router = express.Router();

router.post("/", createFlashcard);
router.get("/", getFlashcards);
router.put("/:id", updateFlashcard);
router.delete("/:id", deleteFlashcard);

module.exports = router;
