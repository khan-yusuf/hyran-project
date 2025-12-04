from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Hyran API")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Example data model
class Item(BaseModel):
    id: int
    name: str
    description: str

# In-memory data store (replace with DB later)
items: List[Item] = [
    Item(id=1, name="Example Item 1", description="This is a sample item"),
    Item(id=2, name="Example Item 2", description="Another sample item"),
]

@app.get("/")
def read_root():
    return {"message": "Welcome to Hyran API"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/items", response_model=List[Item])
def get_items():
    return items

@app.get("/api/items/{item_id}", response_model=Item)
def get_item(item_id: int):
    item = next((item for item in items if item.id == item_id), None)
    if item is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@app.post("/api/items", response_model=Item)
def create_item(item: Item):
    items.append(item)
    return item
