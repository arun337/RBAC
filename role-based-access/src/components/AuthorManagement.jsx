import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthorManagement = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    publishedDate: '',
    image: '',
  });
  const [books, setBooks] = useState([]);
  const [expandedDescriptionId, setExpandedDescriptionId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchBooks = async () => {
      const response = await fetch('http://localhost:3001/books');
      const data = await response.json();
      setBooks(data);
    };

    fetchBooks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setBook({ ...book, image: reader.result });
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setBook({ ...book, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3001/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });

    if (response.ok) {
      alert('Book created successfully!');
      setBook({
        title: '',
        author: '',
        description: '',
        genre: '',
        publishedDate: '',
        image: '',
      });
      // Refresh the list of books
      const updatedBooks = await response.json();
      setBooks([...books, updatedBooks]);
    } else {
      alert('Failed to create book.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userDetails');
    navigate('/');
  };

  const handleDescriptionClick = (id) => {
    setExpandedDescriptionId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">Author Management</h1>
        <button
          onClick={handleLogout}
          className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </nav>

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Create a New Book</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={book.title}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={book.author}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={book.description}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={book.genre}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="date"
            name="publishedDate"
            value={book.publishedDate}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            className="w-full py-3 text-white bg-purple-500 font-semibold rounded-lg shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Create Book
          </button>
        </form>

        <h3 className="text-2xl font-bold mt-10 text-center text-purple-700">Existing Books</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {books.map((b) => (
            <div key={b.id} className="bg-white p-6 rounded-lg shadow-lg relative">
              <img src={b.image} alt={b.title} className="w-full h-48 object-cover rounded-t-lg" />
              <h4 className="text-xl font-bold text-purple-700">{b.title}</h4>
              <p className="text-sm text-gray-600">by {b.author}</p>
              <div
                className={`mt-2 text-gray-700 cursor-pointer transition-all duration-300 ${expandedDescriptionId === b.id ? 'max-h-96' : 'max-h-12 overflow-hidden'}`}
                onClick={() => handleDescriptionClick(b.id)}
                
              >
                {b.description}
              </div>
              <p className="text-sm text-gray-500 mt-2">Genre: {b.genre}</p>``
              <p className="text-sm text-gray-500">Published: {b.publishedDate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorManagement; 