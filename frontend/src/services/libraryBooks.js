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

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function canUseApi() {
  return Boolean(API_BASE_URL);
}

async function fetchJson(path, options = {}) {
  if (!canUseApi()) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

async function saveRemoteBooks(books) {
  if (!canUseApi()) {
    return null;
  }

  return fetchJson("/api/books-state", {
    method: "POST",
    body: JSON.stringify(books),
  });
}


export async function syncRemoteBooks(force = true) {
  const remoteBooks = await fetchJson("/api/books");
  if (Array.isArray(remoteBooks)) {
    if (force) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteBooks));
      dispatchUpdate("scas-library-books-updated");
    }
    return remoteBooks;
  }
  return null;
}



async function saveRemoteReports(reports) {
  if (!canUseApi()) {
    return null;
  }

  return fetchJson("/api/reports-state", {
    method: "POST",
    body: JSON.stringify(reports),
  });
}


export async function syncRemoteReports() {
  const remoteReports = await fetchJson("/api/reports");
  if (Array.isArray(remoteReports)) {
    window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(remoteReports));
    dispatchUpdate("scas-library-reports-updated");
  }
}

/**
 * Fire a synthetic storage notification for tabs on the same origin.
 * This keeps admin and student frontends in sync when they share localStorage.
 */
function notifyStorageSync() {
  if (!canUseStorage()) {
    return;
  }

  const key = "__scas_storage_sync__";
  const value = Date.now().toString();

  window.localStorage.setItem(key, value);
  window.localStorage.removeItem(key);
}

function dispatchUpdate(eventName) {
  if (!canUseStorage()) {
    return;
  }

  window.dispatchEvent(new Event(eventName));
  notifyStorageSync();
}

async function seedBooksIfEmpty(remoteBooks) {
  if (!Array.isArray(remoteBooks) || remoteBooks.length > 0) {
    return remoteBooks;
  }

  const seeded = initialBooks.map((b) => ({
    ...b,
    // ensure ids align with schema expectations
    id: b.id ?? undefined,
  }));

  // persist to backend
  const result = await fetchJson("/api/books-state", {
    method: "POST",
    body: JSON.stringify(seeded),
  });

  if (Array.isArray(result) && result.length > 0) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    dispatchUpdate("scas-library-books-updated");
    return result;
  }

  return seeded;
}

export async function getBooks() {
  // backend-first: try backend, seed if empty, then fallback to localStorage.
  const remoteBooks = await syncRemoteBooks(true);
  if (Array.isArray(remoteBooks) && remoteBooks.length > 0) {
    return remoteBooks;
  }

  // if backend returned empty, seed
  const seeded = await seedBooksIfEmpty(remoteBooks);
  return Array.isArray(seeded) ? seeded : getStoredBooks();
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

async function saveBooksToBackend(books) {
  const result = await saveRemoteBooks(books);
  return Array.isArray(result) ? result : null;
}

export async function saveBooks(books) {
  if (!canUseStorage()) {
    return saveBooksToBackend(books);
  }

  // Backend-first for correctness; localStorage becomes cache.
  const saved = await saveBooksToBackend(books);
  const nextCache = saved || books;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCache));
  dispatchUpdate("scas-library-books-updated");
  return nextCache;
}







export async function addBook(book) {
  const currentBooks = await getBooks();

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

  await saveBooks(nextBooks);
  return nextBooks;
}

export async function removeBook(bookId) {
  const currentBooks = getStoredBooks();
  const nextBooks = currentBooks.filter((book) => book.id !== bookId);

  await saveBooks(nextBooks);
  return nextBooks;
}

export async function updateBook(bookId, updates) {
  const currentBooks = getStoredBooks();
  const nextBooks = currentBooks.map((book) =>
    book.id === bookId ? applyBookUpdates(book, updates) : book,
  );

  await saveBooks(nextBooks);
  return nextBooks;
}

export async function updateBookStatus(bookId, status) {
  const currentBooks = getStoredBooks();
  const nextBooks = currentBooks.map((book) =>
    book.id === bookId ? { ...book, status } : book,
  );

  await saveBooks(nextBooks);
  return nextBooks;
}

export async function borrowOrReserveBook(bookId, status, student = null) {
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

  await saveBooks(nextBooks);

  if (canUseStorage()) {
    if (reportRecord) {
      await saveBorrowReserveReport(reportRecord);
    }
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

async function saveBorrowReserveReport(report) {
  const reports = getStoredReportRecords();
  const nextReports = [report, ...reports];
  window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(nextReports));
  dispatchUpdate("scas-library-reports-updated");
  await saveRemoteReports(nextReports);
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
