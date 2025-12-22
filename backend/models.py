from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))  # ✅ NOT user object
    food = Column(String)
    calories = Column(Integer)
    confidence = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


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


