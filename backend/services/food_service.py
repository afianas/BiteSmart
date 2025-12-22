# backend/services/food_service.py

from rapidfuzz import process
from sqlalchemy.orm import Session
from ..models import FoodCalories

DEFAULT_CALORIES = 250
FUZZY_THRESHOLD = 80

def get_calories(food: str, db: Session):
    foods = db.query(FoodCalories.food_name, FoodCalories.calories).all()
    if not foods:
        return DEFAULT_CALORIES

    food_names = [f[0] for f in foods]
    match, score, idx = process.extractOne(food, food_names)

    if score >= FUZZY_THRESHOLD:
        return foods[idx][1]

    return DEFAULT_CALORIES

