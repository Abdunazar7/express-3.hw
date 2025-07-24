const express = require("express");
const mongoose = require("mongoose");

const authorRoutes = require("./routes/author");
const bookRoutes = require("./routes/book");

const server = express();
server.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/BookShop")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

server.use("/authors", authorRoutes);
server.use("/books", bookRoutes);

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
