require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Book = require("./models/Book");
const StudentAccount = require("./models/StudentAccount");
const BorrowReserveReport = require("./models/BorrowReserveReport");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const dbName = mongoose.connection.db?.databaseName;
    const count = await Book.countDocuments({});

    console.log("MongoDB connected");
    console.log("Connected DB:", dbName);
    console.log("Book count at startup:", count);
  })
  .catch((err) => console.error("MongoDB connection error:", err));


function isPlainObject(v) {
  return Boolean(v) && typeof v === "object" && (v.constructor === Object || v.constructor === undefined);
}

function validateArrayOfPlainObjects(value) {
  return Array.isArray(value) && value.every((x) => isPlainObject(x));
}

async function replaceCollection(Model, items) {
  const nextItems = Array.isArray(items) ? items : [];

  // Replace-all semantics to remain compatible with frontend which posts the full array.
  await Model.deleteMany({});
  if (!nextItems.length) return [];

  // Allow mixed schemas from the existing frontend payloads.
  const created = await Model.insertMany(nextItems, { ordered: false });
  // Mongoose insertMany returns an array of Mongoose documents.
  return Array.isArray(created) ? created.map((d) => (typeof d.toObject === "function" ? d.toObject() : d)) : [];
}

function validationError(res, message) {
  return res.status(400).json({ error: message });
}

function normalizeBookPayload(book) {
  return {
    ...book,
    title: typeof book.title === "string" ? book.title.trim() : book.title,
    author: typeof book.author === "string" ? book.author.trim() : book.author,
    category: typeof book.category === "string" ? book.category : "General",
    image: typeof book.image === "string" ? book.image : "",
    status:
      ["Available", "Borrowed", "Reserved", "Not Available"].includes(book.status)
        ? book.status
        : "Available",
    copies: Number.isFinite(Number(book.copies)) ? Number(book.copies) : 0,
    borrowedCopies: Number.isFinite(Number(book.borrowedCopies)) ? Number(book.borrowedCopies) : 0,
    reservedCopies: Number.isFinite(Number(book.reservedCopies)) ? Number(book.reservedCopies) : 0,
    id: book.id !== undefined ? Number(book.id) : undefined,
  };
}

function normalizeReportPayload(r) {
  const status = ["Borrowed", "Reserved"].includes(r.status) ? r.status : null;
  return {
    ...r,
    status,
    quantity: Number.isFinite(Number(r.quantity)) ? Number(r.quantity) : 1,
    bookId: r.bookId !== undefined ? Number(r.bookId) : undefined,
    date: typeof r.date === "string" ? r.date : new Date().toISOString(),
  };
}

function normalizeStudentPayload(s) {
  return {
    ...s,
    id: typeof s.id === "string" ? s.id : s.id,
    fullName: typeof s.fullName === "string" ? s.fullName : "Student",
    email: typeof s.email === "string" ? s.email : "No email",
    course: typeof s.course === "string" ? s.course : "Not specified",
    yearLevel: typeof s.yearLevel === "string" ? s.yearLevel : "Not specified",
    section: typeof s.section === "string" ? s.section : "Not specified",
    avatar: typeof s.avatar === "string" ? s.avatar : "",
    status: typeof s.status === "string" ? s.status : "Active",
    joinedAt: typeof s.joinedAt === "string" ? s.joinedAt : new Date().toISOString(),
  };
}


app.get("/", (req, res) => {
  res.send("Server running");
});

app.get("/api/books", async (req, res) => {
  try {
    const docs = await Book.find({}).limit(1).lean();
    console.log("GET /api/books sample:", docs?.[0]?.title);
    const books = await Book.find({}).lean();
    res.json(books);
  } catch (err) {
    console.error("GET /api/books error:", err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});


app.post("/api/books-state", async (req, res) => {
  try {
    if (!validateArrayOfPlainObjects(req.body)) {
      return validationError(res, "books-state payload must be an array of objects");
    }

    const normalized = req.body.map(normalizeBookPayload);
    const books = await replaceCollection(Book, normalized);
    res.json(books);
  } catch (err) {
    console.error("POST /api/books-state error:", err);
    res.status(500).json({ error: "Failed to update books" });
  }
});

app.get("/api/reports", async (req, res) => {

  try {
    const reports = await BorrowReserveReport.find({})
      .sort({ date: -1 })
      .lean();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

app.post("/api/reports-state", async (req, res) => {
  try {
    if (!validateArrayOfPlainObjects(req.body)) {
      return validationError(res, "reports-state payload must be an array of objects");
    }

    const normalized = req.body.map(normalizeReportPayload).filter((r) => r && r.status);
    const reports = await replaceCollection(BorrowReserveReport, normalized);
    res.json(reports);
  } catch (err) {
    console.error("POST /api/reports-state error:", err);
    res.status(500).json({ error: "Failed to update reports" });
  }
});

app.get("/api/students", async (req, res) => {
  try {
    const students = await StudentAccount.find({}).sort({ joinedAt: -1 }).lean();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

app.post("/api/students-state", async (req, res) => {
  try {
    if (!validateArrayOfPlainObjects(req.body)) {
      return validationError(res, "students-state payload must be an array of objects");
    }

    const normalized = req.body.map(normalizeStudentPayload);
    const students = await replaceCollection(StudentAccount, normalized);
    res.json(students);
  } catch (err) {
    console.error("POST /api/students-state error:", err);
    res.status(500).json({ error: "Failed to update students" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

