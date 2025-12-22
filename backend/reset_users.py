from backend.database import SessionLocal
from backend.models import User

db = SessionLocal()
db.query(User).delete()
db.commit()
db.close()

print("✅ Users table cleared")
