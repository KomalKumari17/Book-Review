from sqlalchemy.orm import Session
import database
import schemas
from typing import List

def get_books(db: Session, skip: int = 0, limit: int = 100) -> List[database.Book]:
    return db.query(database.Book).offset(skip).limit(limit).all()

def get_book(db: Session, book_id: int) -> database.Book:
    return db.query(database.Book).filter(database.Book.id == book_id).first()

def create_book(db: Session, book: schemas.BookCreate) -> database.Book:
    db_book = database.Book(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def get_book_reviews(db: Session, book_id: int, skip: int = 0, limit: int = 100) -> List[database.Review]:
    return db.query(database.Review).filter(database.Review.book_id == book_id).offset(skip).limit(limit).all()

def create_review(db: Session, review: schemas.ReviewCreate, book_id: int) -> database.Review:
    db_review = database.Review(**review.model_dump(), book_id=book_id)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review
