from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class BookBase(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    publication_date: Optional[str] = None
    genre: Optional[str] = None
    image_url: Optional[str] = None

class BookCreate(BookBase):
    pass

class Book(BookBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class BookWithReviews(Book):
    reviews: List['Review'] = []

class ReviewBase(BaseModel):
    reviewer_name: str
    rating: int  # 1-5 stars
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int
    book_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Update forward references
BookWithReviews.model_rebuild()
