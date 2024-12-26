const express = require("express");
const Note = require("../modules/Note");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all notes for a user
router.get("/", protect, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Create a new note
router.post("/", protect, async (req, res) => {
  const { title, content, color } = req.body;

  try {
    const note = await Note.create({
      title,
      content,
      color,
      user: req.user.id,
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Update a note
router.put("/:id", protect, async (req, res) => {
  const { title, content, color } = req.body;

  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.color = color || note.color;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a note
router.delete("/:id", protect, async (req, res) => {
  try {
    console.log("Delete request received for ID:", req.params.id);

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await note.deleteOne();
    res.json({ message: "Note removed" });
  } catch (error) {
    console.error("Error while deleting the note:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Get a single note by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
