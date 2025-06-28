from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import crud
import schemas
from database import get_db, engine, Base
from redis_cache import get_cache, set_cache, delete_cache

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Book Review API",
    description="""
    ## Book Review Service API
    
    A comprehensive book review service that allows users to:
    
    * **Manage Books**: Add new books with details like title, author, genre, publication date, and cover images
    * **Browse Books**: Get a list of all books or specific book details
    * **Add Reviews**: Write reviews with ratings (1-5 stars) and comments for any book
    * **View Reviews**: Get all reviews for a specific book
    
    ### API Endpoints
    
    * `GET /books` - Get all books
    * `POST /books` - Add a new book
    * `GET /books/{book_id}` - Get a specific book with its reviews
    * `GET /books/{book_id}/reviews` - Get all reviews for a specific book
    * `POST /books/{book_id}/reviews` - Add a new review for a specific book
    
    ### Technologies Used
    
    * **FastAPI** - Modern Python web framework
    * **SQLAlchemy** - SQL toolkit and ORM
    * **SQLite** - Database
    * **Pydantic** - Data validation
    """,
    version="1.0.0",
    contact={
        "name": "Book Review API",
        "email": "contact@bookreview.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc",  # ReDoc
)

# CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Book Review API"}

@app.get("/books", 
         response_model=List[schemas.Book],
         tags=["Books"],
         summary="Get all books",
         description="Retrieve a paginated list of all books in the database",
         response_description="List of books with their details")
def get_books(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all books with pagination support.
    
    - **skip**: Number of books to skip (for pagination)
    - **limit**: Maximum number of books to return (max 100)
    """
    cache_key = f"books:skip={skip}:limit={limit}"
    cached_books = get_cache(cache_key)
    if cached_books is not None:
        return [schemas.Book(**book) for book in cached_books]
    books = crud.get_books(db, skip=skip, limit=limit)
    serializable_books = [schemas.Book.from_orm(book).model_dump(mode="json") for book in books]
    set_cache(cache_key, serializable_books, ex=60)
    return books

@app.post("/books", 
          response_model=schemas.Book, 
          status_code=status.HTTP_201_CREATED,
          tags=["Books"],
          summary="Add a new book",
          description="Create a new book entry in the database",
          response_description="The created book with generated ID")
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    """
    Create a new book with the following information:
    
    - **title**: Book title (required)
    - **author**: Book author (required)
    - **description**: Book description (optional)
    - **publication_date**: Publication date in YYYY-MM-DD format (optional)
    - **genre**: Book genre (optional)
    - **image_url**: URL to book cover image (optional)
    """
    new_book = crud.create_book(db=db, book=book)
    # Invalidate all book list caches (simple approach: delete all keys starting with 'books:')
    # If using redis-py >= 4.2.0, use redis_client.scan and delete
    from redis_cache import redis_client
    for key in redis_client.scan_iter("books:*"):
        redis_client.delete(key)
    return new_book

@app.get("/books/{book_id}", 
         response_model=schemas.BookWithReviews,
         tags=["Books"],
         summary="Get a specific book",
         description="Retrieve a specific book by its ID along with all its reviews",
         response_description="Book details with associated reviews")
def get_book(book_id: int, db: Session = Depends(get_db)):
    """
    Get a specific book by ID including all its reviews.
    
    - **book_id**: The ID of the book to retrieve
    
    Returns the book details along with all reviews (rating, reviewer name, comments, etc.)
    """
    db_book = crud.get_book(db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book

@app.get("/books/{book_id}/reviews", 
         response_model=List[schemas.Review],
         tags=["Reviews"],
         summary="Get all reviews for a book",
         description="Retrieve all reviews for a specific book with pagination",
         response_description="List of reviews for the specified book")
def get_book_reviews(book_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all reviews for a specific book.
    
    - **book_id**: The ID of the book to get reviews for
    - **skip**: Number of reviews to skip (for pagination)
    - **limit**: Maximum number of reviews to return (max 100)
    """
    # Check if book exists
    db_book = crud.get_book(db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    
    reviews = crud.get_book_reviews(db, book_id=book_id, skip=skip, limit=limit)
    return reviews

@app.post("/books/{book_id}/reviews", 
          response_model=schemas.Review, 
          status_code=status.HTTP_201_CREATED,
          tags=["Reviews"],
          summary="Add a new review",
          description="Create a new review for a specific book",
          response_description="The created review with generated ID")
def create_review(book_id: int, review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    """
    Add a new review for a specific book.
    
    - **book_id**: The ID of the book to review
    - **reviewer_name**: Name of the person writing the review (required)
    - **rating**: Rating from 1 to 5 stars (required)
    - **comment**: Review comment/text (optional)
    
    The rating must be between 1 and 5 (inclusive).
    """
    # Check if book exists
    db_book = crud.get_book(db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Validate rating is between 1-5
    if review.rating < 1 or review.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    return crud.create_review(db=db, review=review, book_id=book_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
