from sqlalchemy import Column, Integer, String, ForeignKey
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Meal(Base):
    __tablename__ = "meals"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    food = Column(String)
    calories = Column(Integer)

class FoodCalories(Base):
    __tablename__ = "food_calories"

    id = Column(Integer, primary_key=True)
    food_name = Column(String, unique=True, index=True)
    calories = Column(Integer)
