print("🔥 RUNNING THIS MAIN.PY FILE 🔥")

from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import SessionLocal, Base,engine
from .models import User, Meal, PredictionHistory
from .schemas import UserCreate, UserLogin
from .auth import hash_password, verify_password, create_token, get_current_user
from .ml import predict_food
from .services.food_service import get_calories



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5501",
        "http://localhost:5501",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# models.Base.metadata.create_all(bind=engine)
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(400, "User exists")

    db_user = User(
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    return {"message": "Registered"}


@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(401, "Invalid credentials")

    access_token = create_token({"sub": db_user.email})
    return {
    "access_token": access_token,
    "token_type": "bearer"
}


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
    db=Depends(get_db)
):
    image_bytes = await file.read()
    result = predict_food(image_bytes)

    if result["status"] == "uncertain":
        return result

    calories = get_calories(result["food"], db)

    history = PredictionHistory(
    user_id=user.id,   # ✅ FIX
    food=result["food"],
    calories=calories,
    confidence=int(result["confidence"] * 100)
)

    db.add(history)
    db.commit()
    
    

    return {
        "food": result["food"],
        "confidence": result["confidence"],
        "calories": calories,
        "top_5": result["top_5"]
    }
    