'use client';

import React from 'react';
import { Book } from '@/types';
import Link from 'next/link';

interface BookListProps {
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No books found</div>
        <div className="text-gray-400 text-sm mt-2">Add your first book to get started!</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          {book.image_url && (
            <div className="h-48 bg-gray-200">
              <img 
                src={book.image_url} 
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
            <p className="text-gray-600 mb-3">by {book.author}</p>
            
            {book.genre && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                {book.genre}
              </span>
            )}
            
            {book.description && (
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{book.description}</p>
            )}
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {book.publication_date && `Published: ${book.publication_date}`}
              </div>
              <Link 
                href={`/books/${book.id}`}
                className="bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700 transition-colors"
              >
                View Reviews
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookList;
