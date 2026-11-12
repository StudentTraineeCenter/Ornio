import uuid

from sqlalchemy import String, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class TypyPtaku(Base):
    __tablename__ = "typy_ptaku"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    nazev: Mapped[str] = mapped_column(String(100), unique=True)

class Ptaky(Base):
    __tablename__ = "Ptaky"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()")
    )
    nazev: Mapped[str] = mapped_column(String(100), unique=True)

class Lokality(Base):
    __tablename__ = "Lokality"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("get_random_uuid()")
    )
    nazev: Mapped[str] = mapped_column(String(100), unique=True)