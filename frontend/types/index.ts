export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  publication_date?: string;
  genre?: string;
  image_url?: string;
  created_at: string;
}

export interface BookCreate {
  title: string;
  author: string;
  description?: string;
  publication_date?: string;
  genre?: string;
  image_url?: string;
}

export interface Review {
  id: number;
  book_id: number;
  reviewer_name: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface ReviewCreate {
  reviewer_name: string;
  rating: number;
  comment?: string;
}

export interface BookWithReviews extends Book {
  reviews: Review[];
}
