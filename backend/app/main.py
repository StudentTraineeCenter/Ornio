from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from .config import settings
from .database import get_db
from app.routers import typy_ptaku, ptaky

app = FastAPI(title="Ornio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def default_health():
    return{"status" : "up - ok"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/health/db")
def health_db(db: Session = Depends(get_db)):
    return {"database": db.execute(text("SELECT current_database()")).scalar()}

app.include_router(typy_ptaku.router)

app.include_router(ptaky.router)