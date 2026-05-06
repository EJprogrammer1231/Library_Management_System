import books1 from "./assets/books1.png";
import books2 from "./assets/books2.png";
import books3 from "./assets/books3.png";
import books4 from "./assets/books4.png";

const STORAGE_KEY = "scas-library-books";

export const initialBooks = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    image: books1,
    status: "Available",
    description:
      "A practical guide to building better habits through small, consistent changes.",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    image: books2,
    status: "Borrowed",
    description:
      "A handbook for writing cleaner, more maintainable code in everyday development.",
  },
  {
    id: 3,
    title: "The Alchemist",
    author: "Paulo Coelho",
    image: books3,
    status: "Reserved",
    description:
      "A story about following your purpose and learning from the journey itself.",
  },
  {
    id: 4,
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    image: books4,
    status: "Available",
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
  const nextBooks = [
    ...currentBooks,
    {
      id: Date.now(),
      status: "Available",
      description:
        book.description ||
        `${book.title} by ${book.author} is available in the library collection.`,
      ...book,
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
    book.id === bookId ? { ...book, ...updates } : book,
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

export function getBookCounts(books = getStoredBooks()) {
  return {
    total: books.length,
    borrowed: books.filter((book) => book.status === "Borrowed").length,
    reserved: books.filter((book) => book.status === "Reserved").length,
    available: books.filter((book) => book.status === "Available").length,
  };
}
