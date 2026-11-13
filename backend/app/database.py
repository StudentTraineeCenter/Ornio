from sqlalchemy import URL, create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from .config import settings

database_url = URL.create(
    "postgresql+psycopg",
    username=settings.pguser,
    password=settings.pgpassword,
    host=settings.pghost,
    port=settings.pgport,
    database=settings.pgdatabase,
    query={"sslmode": settings.pgsslmode},
)

engine = create_engine(database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
