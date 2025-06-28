import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Inventory = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const searchBooks = async (query = '') => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/book/search-books?search=${query}`
      );
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/book/get-books`);
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchBooks(value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/v1/book/delete-book/${id}`);
      fetchBooks(); // Refresh the book list after deletion
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">Book Inventory</h1>

      <input
        type="text"
        placeholder="Search by title or author..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full border p-2 rounded mb-6"
      />

      {books.length === 0 ? (
        <p className="text-gray-600 text-center">No books found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{book.title}</h2>
                  <p className="text-sm text-gray-700">by {book.author}</p>
                  <p className="text-sm text-gray-500">Grade: {book.grade || '—'}</p>
                  <p className="text-sm text-gray-500">Category: {book.category || '—'}</p>
                  <p className="text-sm text-gray-500 italic">
                    Publisher: {book.publisher || '—'}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    Year: {book.publishedYear || '—'}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    Edition: {book.edition || '—'}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="mt-4 w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventory;
