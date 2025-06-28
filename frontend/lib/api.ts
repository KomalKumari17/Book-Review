import axios from 'axios';
import { Book, BookCreate, Review, ReviewCreate } from '@/types';

const API_BASE_URL = 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookAPI = {
  // Get all books
  getBooks: async (): Promise<Book[]> => {
    const response = await api.get('/books');
    return response.data;
  },

  // Create a new book
  createBook: async (book: BookCreate): Promise<Book> => {
    const response = await api.post('/books', book);
    return response.data;
  },

  // Get a specific book
  getBook: async (id: number): Promise<Book> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Get reviews for a book
  getBookReviews: async (bookId: number): Promise<Review[]> => {
    const response = await api.get(`/books/${bookId}/reviews`);
    return response.data;
  },

  // Create a review for a book
  createReview: async (bookId: number, review: ReviewCreate): Promise<Review> => {
    const response = await api.post(`/books/${bookId}/reviews`, review);
    return response.data;
  },
};
