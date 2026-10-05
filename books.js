// Vercel serverless REST API for the Book Management Task.
// Data is intentionally kept in memory because the assignment requires no database.
// Note: serverless instances can reset this data after inactivity/redeployment.

let books = globalThis.__bookStore || [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho" },
  { id: 2, title: "Atomic Habits", author: "James Clear" }
];

globalThis.__bookStore = books;

function sendJson(res, status, data) {
  res.status(status).json(data);
}

export default async function handler(req, res) {
  const id = req.query.id ? Number(req.query.id) : null;

  if (req.method === "GET") {
    return sendJson(res, 200, books);
  }

  if (req.method === "POST") {
    const { title, author } = req.body || {};

    if (!title || !author) {
      return sendJson(res, 400, { message: "Title and author are required" });
    }

    const newBook = {
      id: books.length ? Math.max(...books.map(book => book.id)) + 1 : 1,
      title,
      author
    };

    books.push(newBook);
    return sendJson(res, 201, {
      message: "Book added successfully",
      book: newBook
    });
  }

  if (!id) {
    return sendJson(res, 400, { message: "Book ID is required" });
  }

  if (req.method === "PUT") {
    const book = books.find(item => item.id === id);

    if (!book) {
      return sendJson(res, 404, { message: "Book not found" });
    }

    const { title, author } = req.body || {};

    if (!title || !author) {
      return sendJson(res, 400, { message: "Title and author are required" });
    }

    book.title = title;
    book.author = author;

    return sendJson(res, 200, {
      message: "Book updated successfully",
      book
    });
  }

  if (req.method === "DELETE") {
    const index = books.findIndex(item => item.id === id);

    if (index === -1) {
      return sendJson(res, 404, { message: "Book not found" });
    }

    const deletedBook = books.splice(index, 1)[0];

    return sendJson(res, 200, {
      message: "Book deleted successfully",
      book: deletedBook
    });
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  return sendJson(res, 405, { message: "Method not allowed" });
}
