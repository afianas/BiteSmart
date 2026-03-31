import pandas as pd
from .database import SessionLocal, engine
from .models import FoodCalories, Base

# Create table
Base.metadata.create_all(bind=engine)

# Load CSV
df = pd.read_csv("data/food_data.csv")

db = SessionLocal()

for _, row in df.iterrows():
    food = row["Descrip"].lower()
    calories = int(row["Energy_kcal"])

    exists = db.query(FoodCalories).filter(
        FoodCalories.food_name == food
    ).first()

    if not exists:
        db.add(FoodCalories(
            food_name=food,
            calories=calories
        ))

db.commit()
db.close()

print("✅ Calories data seeded successfully")
