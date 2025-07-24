const express = require("express");
const Book = require("../models/book.model");
const route = express.Router();

route.post("/", async (req, res) => {
  try {
    const { name, price, author } = req.body;
    if (!name || !price || !author) {
      return res
        .status(400)
        .send({ error: "Barcha maydonlar to'ldirilishi kerak" });
    }
    const book = new Book({ name, price, author });
    await book.save();
    res.status(201).send({ message: "Kitob qo'shildi", book });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

route.get("/", async (req, res) => {
  try {
    let { author, page = 1, take = 10 } = req.query;
    page = +page;
    take = +take;

    const filter = {};
    if (author) {
      filter.author = author;
    }

    const books = await Book.find(filter)
      .populate("author", "name", "price")
      .skip((page - 1) * take)
      .limit(take);

    res.status(200).send(books);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

route.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id).populate("author", "name");

    if (!book) {
      return res.status(404).send({ message: "Kitob topilmadi!" });
    }
    res.status(200).send(book);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

route.patch("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) {
      return res.status(404).send({ error: "Kitob topilmadi" });
    }
    res.status(200).send({ message: "Kitob yangilandi", book });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

route.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).send({ error: "Kitob topilmadi" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = route;
