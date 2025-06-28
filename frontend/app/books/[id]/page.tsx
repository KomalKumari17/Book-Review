'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Book, Review } from '@/types';
import { bookAPI } from '@/lib/api';
import ReviewList from '@/components/ReviewList';
import AddReviewForm from '@/components/AddReviewForm';

export default function BookPage() {
  const params = useParams();
  const bookId = parseInt(params.id as string);
  
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddReview, setShowAddReview] = useState(false);

  useEffect(() => {
    if (bookId) {
      fetchBookAndReviews();
    }
  }, [bookId]);

  const fetchBookAndReviews = async () => {
    try {
      setLoading(true);
      const [bookData, reviewsData] = await Promise.all([
        bookAPI.getBook(bookId),
        bookAPI.getBookReviews(bookId)
      ]);
      setBook(bookData);
      setReviews(reviewsData);
    } catch (err) {
      setError('Failed to fetch book details');
      console.error('Error fetching book details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = (newReview: Review) => {
    setReviews([...reviews, newReview]);
    setShowAddReview(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading book details...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error || 'Book not found'}</div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Book Details */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {book.image_url && (
            <div className="md:w-64 flex-shrink-0">
              <img 
                src={book.image_url} 
                alt={`Cover of ${book.title}`}
                className="w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            
            {book.genre && (
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4">
                {book.genre}
              </span>
            )}
            
            {book.description && (
              <p className="text-gray-700 mb-6">{book.description}</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              {book.publication_date && (
                <div>
                  <span className="font-medium">Published:</span> {book.publication_date}
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-64 text-center">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="text-yellow-400 text-xl mb-2">
                {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
              </div>
              <div className="text-sm text-gray-600">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          <button
            onClick={() => setShowAddReview(!showAddReview)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showAddReview ? 'Cancel' : 'Add Review'}
          </button>
        </div>

        {showAddReview && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <AddReviewForm bookId={bookId} onReviewAdded={handleReviewAdded} />
          </div>
        )}

        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}
