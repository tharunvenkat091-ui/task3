const form = document.getElementById("bookForm");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const bookIdInput = document.getElementById("bookId");
const booksList = document.getElementById("booksList");
const bookCount = document.getElementById("bookCount");
const message = document.getElementById("message");
const requestPreview = document.getElementById("requestPreview");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const refreshBtn = document.getElementById("refreshBtn");

function updatePreview() {
  requestPreview.textContent = JSON.stringify({
    title: titleInput.value || "...",
    author: authorInput.value || "..."
  }, null, 2);
}

titleInput.addEventListener("input", updatePreview);
authorInput.addEventListener("input", updatePreview);

function showMessage(text, error = false) {
  message.textContent = text;
  message.classList.remove("hidden");
  message.style.background = error ? "#ffebeb" : "#e9f8f0";
  message.style.color = error ? "#c53d3d" : "#27734f";
  setTimeout(() => message.classList.add("hidden"), 2800);
}

async function loadBooks() {
  try {
    const response = await fetch("/api/books");
    const books = await response.json();

    bookCount.textContent = books.length;
    booksList.innerHTML = "";

    if (!books.length) {
      booksList.innerHTML = `<div class="book-card"><div></div><div><h4>No books available</h4><p>Add your first book using the form.</p></div></div>`;
      return;
    }

    books.forEach((book, index) => {
      const card = document.createElement("div");
      card.className = "book-card";
      card.innerHTML = `
        <div class="book-number">${String(index + 1).padStart(2, "0")}</div>
        <div>
          <h4>${escapeHtml(book.title)}</h4>
          <p>by ${escapeHtml(book.author)} • ID ${book.id}</p>
        </div>
        <div class="actions">
          <button class="edit" onclick="editBook(${book.id})">Edit</button>
          <button class="remove" onclick="deleteBook(${book.id})">Delete</button>
        </div>
      `;
      booksList.appendChild(card);
    });
  } catch (error) {
    showMessage("Cannot connect to the API server.", true);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const id = bookIdInput.value;

  if (!title || !author) return;

  const method = id ? "PUT" : "POST";
  const url = id ? `/api/books?id=${id}` : "/api/books";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Request failed", true);
      return;
    }

    showMessage(data.message);
    resetForm();
    loadBooks();
  } catch (error) {
    showMessage("Cannot connect to the API server.", true);
  }
});

async function editBook(id) {
  const response = await fetch("/api/books");
  const books = await response.json();
  const book = books.find(item => item.id === id);

  if (!book) return;

  bookIdInput.value = book.id;
  titleInput.value = book.title;
  authorInput.value = book.author;
  formTitle.textContent = "Update Book";
  submitBtn.textContent = "✓ Update Book";
  cancelBtn.classList.remove("hidden");
  updatePreview();
  titleInput.focus();
}

async function deleteBook(id) {
  if (!confirm("Delete this book?")) return;

  try {
    const response = await fetch(`/api/books?id=${id}`, { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Delete failed", true);
      return;
    }

    showMessage(data.message);
    loadBooks();
  } catch (error) {
    showMessage("Cannot connect to the API server.", true);
  }
}

function resetForm() {
  form.reset();
  bookIdInput.value = "";
  formTitle.textContent = "Add New Book";
  submitBtn.textContent = "＋ Add Book";
  cancelBtn.classList.add("hidden");
  updatePreview();
}

cancelBtn.addEventListener("click", resetForm);
refreshBtn.addEventListener("click", loadBooks);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadBooks();
updatePreview();
