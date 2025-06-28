import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_books():
    response = client.get("/books")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_book():
    book_data = {
        "title": "Test Book",
        "author": "Test Author",
        "description": "A test book.",
        "publication_date": "2024-01-01",
        "genre": "Fiction",
        "image_url": "http://example.com/image.jpg"
    }
    response = client.post("/books", json=book_data)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == book_data["title"]
    assert data["author"] == book_data["author"]
