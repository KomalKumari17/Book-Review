'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/types';
import { bookAPI } from '@/lib/api';
import BookList from '@/components/BookList';
import AddBookForm from '@/components/AddBookForm';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const booksData = await bookAPI.getBooks();
      setBooks(booksData);
    } catch (err) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAdded = (newBook: Book) => {
    setBooks([...books, newBook]);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Books Collection</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-teal-600 text-white px-4 py-2 mt-3 rounded-lg hover:bg-teal-700 transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add New Book'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <AddBookForm onBookAdded={handleBookAdded} />
        </div>
      )}

      <BookList books={books} />
    </div>
  );
}
