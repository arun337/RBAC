import React, { useState, useEffect } from "react";

const BookManagement = ({ user }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/books")
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error("Error fetching books:", error));
  }, []);

  const checkOutBook = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (book.checkedOutBy) {
      alert("This book is already checked out.");
      return;
    }

    fetch(`http://localhost:3001/books/${bookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...book, checkedOutBy: user.id })
    })
    .then(response => response.json())
    .then(updatedBook => {
      setBooks(books.map(b => (b.id === updatedBook.id ? updatedBook : b)));
      alert("Book checked out successfully!");
    })
    .catch(error => console.error("Error checking out book:", error));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Available Books</h2>
      <ul className="list-disc pl-5">
        {books.map(book => (
          <li key={book.id} className="py-2 flex justify-between items-center">
            <div>
              <span className="font-bold">{book.title}</span> by {book.author}
            </div>
            <button
              onClick={() => checkOutBook(book.id)}
              className={`bg-blue-500 text-white p-2 rounded ${book.checkedOutBy ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!!book.checkedOutBy}
            >
              {book.checkedOutBy ? "Checked Out" : "Check Out"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookManagement; 