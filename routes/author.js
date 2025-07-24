const express = require("express");
const Author = require("../models/author.model");
const route = express.Router();

route.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ error: "Muallif ismi kiritilishi kerak" });
    }
    const author = new Author({ name });
    await author.save();
    res.status(201).send({ message: "Muallif qo'shildi", author });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

route.get("/", async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).send(authors);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

route.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const author = await Author.findById(id);

    if (!author) {
      return res.status(404).send({ message: "Kitob topilmadi!" });
    }

    res.status(200).send(author);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).send({ message: "Noto'g'ri ID formati." });
    }
    res.status(500).send({ message: err.message });
  }
});

route.patch("/:id", async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!author) {
      return res.status(404).send({ error: "Muallif topilmadi" });
    }
    res.status(200).send({ message: "Muallif yangilandi", author });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

route.delete("/:id", async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) {
      return res.status(404).send({ error: "Muallif topilmadi" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = route;
