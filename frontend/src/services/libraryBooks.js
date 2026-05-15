import books1 from "../assets/books1.png";
import books2 from "../assets/books2.png";
import books3 from "../assets/books3.png";
import books4 from "../assets/books4.png";

const STORAGE_KEY = "scas-library-books";
const REPORTS_STORAGE_KEY = "scas-library-reports";

export const initialBooks = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    image: books1,
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
    image: books2,
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
    image: books3,
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
    image: books4,
    status: "Available",
    category: "BSBA",
    copies: 4,
    borrowedCopies: 0,
    reservedCopies: 0,
    description:
      "A personal finance book that compares two perspectives on money and investing.",
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getStoredBooks() {
  if (!canUseStorage()) {
    return initialBooks;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return initialBooks;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return initialBooks;
    }

    return parsed;
  } catch {
    return initialBooks;
  }
}

export function saveBooks(books) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function addBook(book) {
  const currentBooks = getStoredBooks();
  const nextCopies = parseCopies(book.copies, 1);
  const nextBooks = [
    ...currentBooks,
    {
      id: Date.now(),
      status: nextCopies > 0 ? "Available" : "Not Available",
      borrowedCopies: 0,
      reservedCopies: 0,
      category: book.category || "General",
      description:
        book.description ||
        `${book.title} by ${book.author} is available in the library collection.`,
      ...book,
      copies: nextCopies,
    },
  ];

  saveBooks(nextBooks);

  if (canUseStorage()) {
    window.dispatchEvent(new Event("scas-library-books-updated"));
  }

  return nextBooks;
}

export function removeBook(bookId) {
  const currentBooks = getStoredBooks();
  const nextBooks = currentBooks.filter((book) => book.id !== bookId);

  saveBooks(nextBooks);

  if (canUseStorage()) {
    window.dispatchEvent(new Event("scas-library-books-updated"));
  }

  return nextBooks;
}

export function updateBook(bookId, updates) {
  const currentBooks = getStoredBooks();
  const nextBooks = currentBooks.map((book) =>
    book.id === bookId ? applyBookUpdates(book, updates) : book,
  );

  saveBooks(nextBooks);

  if (canUseStorage()) {
    window.dispatchEvent(new Event("scas-library-books-updated"));
  }

  return nextBooks;
}

export function updateBookStatus(bookId, status) {
  const currentBooks = getStoredBooks();
  const nextBooks = currentBooks.map((book) =>
    book.id === bookId ? { ...book, status } : book,
  );

  saveBooks(nextBooks);

  if (canUseStorage()) {
    window.dispatchEvent(new Event("scas-library-books-updated"));
  }

  return nextBooks;
}

export function borrowOrReserveBook(bookId, status, student = null) {
  const currentBooks = getStoredBooks();
  let reportRecord = null;
  const nextBooks = currentBooks.map((book) => {
    if (book.id !== bookId) {
      return book;
    }

    const nextCopies = Math.max(0, getBookCopies(book) - 1);
    reportRecord = createBorrowReserveReport(book, status, student);

    return {
      ...book,
      copies: nextCopies,
      borrowedCopies:
        status === "Borrowed"
          ? (Number(book.borrowedCopies) || 0) + 1
          : Number(book.borrowedCopies) || 0,
      reservedCopies:
        status === "Reserved"
          ? (Number(book.reservedCopies) || 0) + 1
          : Number(book.reservedCopies) || 0,
      status: nextCopies === 0 ? "Not Available" : status,
    };
  });

  saveBooks(nextBooks);

  if (canUseStorage()) {
    if (reportRecord) {
      saveBorrowReserveReport(reportRecord);
    }

    window.dispatchEvent(new Event("scas-library-books-updated"));
  }

  return nextBooks;
}

export function getBorrowReserveReports() {
  return getStoredReportRecords().sort(
    (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime(),
  );
}

export function getBookCounts(books = getStoredBooks()) {
  return {
    total: books.length,
    borrowed: sumField(books, "borrowedCopies"),
    reserved: sumField(books, "reservedCopies"),
    notAvailable: books.filter((book) => getBookCopies(book) === 0 || book.status === "Not Available").length,
    available: books.reduce((total, book) => total + getBookCopies(book), 0),
  };
}

export function getBookCopies(book) {
  return parseCopies(book?.copies, 1);
}

function applyBookUpdates(book, updates) {
  const nextCopies =
    updates.copies === undefined
      ? getBookCopies(book)
      : parseCopies(updates.copies, 0);
  const nextStatus =
    updates.status === "Not Available"
      ? "Not Available"
      : nextCopies === 0
        ? "Not Available"
        : updates.status || book.status || "Available";

  return {
    ...book,
    ...updates,
    category: updates.category || book.category || "General",
    copies: nextCopies,
    status: nextStatus,
  };
}

function parseCopies(value, fallback) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function sumField(books, field) {
  return books.reduce((total, book) => total + (Number(book[field]) || 0), 0);
}

function getStoredReportRecords() {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBorrowReserveReport(report) {
  const reports = getStoredReportRecords();
  window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify([report, ...reports]));
  window.dispatchEvent(new Event("scas-library-reports-updated"));
}

function createBorrowReserveReport(book, status, student) {
  const studentName = student?.fullName || student?.name || student?.email || "Unknown Student";
  const studentCourse = student?.course || student?.section || student?.yearLevel || "Not specified";

  return {
    id: `${Date.now()}-${book.id}-${status}`,
    bookId: book.id,
    bookTitle: book.title,
    bookAuthor: book.author,
    studentName,
    studentCourse,
    status,
    quantity: 1,
    date: new Date().toISOString(),
  };
}
