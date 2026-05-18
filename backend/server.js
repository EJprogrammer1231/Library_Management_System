const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, "state.json");

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/libraryDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

function readState() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initialState = { books: [], students: [], reports: [] };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialState, null, 2));
      return initialState;
    }

    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return {
      books: Array.isArray(parsed.books) ? parsed.books : [],
      students: Array.isArray(parsed.students) ? parsed.students : [],
      reports: Array.isArray(parsed.reports) ? parsed.reports : [],
    };
  } catch (error) {
    console.error("Error reading state file:", error);
    return { books: [], students: [], reports: [] };
  }
}

function writeState(state) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error("Error writing state file:", error);
  }
}

app.get("/", (req, res) => {
  res.send("Server running");
});

app.get("/api/books", (req, res) => {
  const state = readState();
  res.json(state.books);
});

app.post("/api/books-state", (req, res) => {
  const state = readState();
  state.books = Array.isArray(req.body) ? req.body : state.books;
  writeState(state);
  res.json(state.books);
});

app.get("/api/reports", (req, res) => {
  const state = readState();
  res.json(state.reports);
});

app.post("/api/reports-state", (req, res) => {
  const state = readState();
  state.reports = Array.isArray(req.body) ? req.body : state.reports;
  writeState(state);
  res.json(state.reports);
});

app.get("/api/students", (req, res) => {
  const state = readState();
  res.json(state.students);
});

app.post("/api/students-state", (req, res) => {
  const state = readState();
  state.students = Array.isArray(req.body) ? req.body : state.students;
  writeState(state);
  res.json(state.students);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
