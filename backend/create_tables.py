# backend/create_tables.py
from .database import engine, Base
from .models import FoodCalories

Base.metadata.create_all(bind=engine)
print("✅ Tables created")
