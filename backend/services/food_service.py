from fuzzywuzzy import process
from sqlalchemy.orm import Session
from ..models import FoodCalories
def fuzzy_match_food(predicted_food, db_food_names, threshold=70):
    match, score = process.extractOne(predicted_food.lower(), db_food_names)
    if score >= threshold:
        return match, score
    return predicted_food.lower(), score
def get_calories(predicted_food: str, db: Session):
    all_foods = db.query(FoodCalories.food_name).all()
    food_names = [f[0].lower() for f in all_foods]

    matched_food, score = fuzzy_match_food(predicted_food, food_names)

    calorie_row = db.query(FoodCalories).filter(
        FoodCalories.food_name.ilike(matched_food)
    ).first()

    calories = calorie_row.calories if calorie_row else 250

    return {
        "predicted_food": predicted_food,
        "mapped_food": matched_food,
        "match_score": score,
        "calories": calories
    }
