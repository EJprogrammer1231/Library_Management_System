const Book = require("./models/Book");
const books = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    status: "Available",
    category: "General",
    copies: 3,
    borrowedCopies: 0,
    reservedCopies: 0,
    description:
      "A practical guide to building better habits through small, consistent changes.",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    status: "Borrowed",
    category: "BSIT",
    copies: 2,
    borrowedCopies: 1,
    reservedCopies: 0,
    description:
      "A handbook for writing cleaner, more maintainable code in everyday development.",
  },
  {
    id: 3,
    title: "The Alchemist",
    author: "Paulo Coelho",
    status: "Reserved",
    category: "General",
    copies: 1,
    borrowedCopies: 0,
    reservedCopies: 1,
    description:
      "A story about following your purpose and learning from the journey itself.",
  },
  {
    id: 4,
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    status: "Available",
    category: "BSBA",
    copies: 4,
    borrowedCopies: 0,
    reservedCopies: 0,
    description:
      "A personal finance book that compares two perspectives on money and investing.",
  },
];

async function main() {
  const mongoose = require("mongoose");
  await mongoose.connect("mongodb://localhost:27017/libraryDB");

  const count = await Book.countDocuments({});
  if (count > 0) {
    console.log("Books already seeded:", count);
    await mongoose.connection.close();
    return;
  }

  await Book.insertMany(books, { ordered: false });
  console.log("Seeded books.");
  await mongoose.connection.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

