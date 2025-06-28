'use client';

import React, { useState } from 'react';
import { ReviewCreate, Review } from '@/types';
import { bookAPI } from '@/lib/api';

interface AddReviewFormProps {
  bookId: number;
  onReviewAdded: (review: Review) => void;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ bookId, onReviewAdded }) => {
  const [formData, setFormData] = useState<ReviewCreate>({
    reviewer_name: '',
    rating: 5,
    comment: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reviewer_name.trim()) {
      setError('Reviewer name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const newReview = await bookAPI.createReview(bookId, formData);
      onReviewAdded(newReview);
      
      // Reset form
      setFormData({
        reviewer_name: '',
        rating: 5,
        comment: '',
      });
    } catch (err) {
      setError('Failed to add review. Please try again.');
      console.error('Error adding review:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Your Review</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="reviewer_name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name *
          </label>
          <input
            type="text"
            id="reviewer_name"
            name="reviewer_name"
            value={formData.reviewer_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
            Rating *
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value={5}>5 - Excellent ★★★★★</option>
            <option value={4}>4 - Good ★★★★☆</option>
            <option value={3}>3 - Average ★★★☆☆</option>
            <option value={2}>2 - Poor ★★☆☆☆</option>
            <option value={1}>1 - Terrible ★☆☆☆☆</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Your Review
        </label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          rows={4}
          placeholder="Share your thoughts about this book..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 disabled:bg-teal-400 transition-colors"
        >
          {loading ? 'Adding...' : 'Add Review'}
        </button>
      </div>
    </form>
  );
};

export default AddReviewForm;
