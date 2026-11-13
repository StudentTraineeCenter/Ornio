from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import TypyPtaku
from app.schemas import TypyPtakuOut

router = APIRouter(prefix="/typy-ptaku", tags=["Typy ptáků"])


@router.get("", response_model=list[TypyPtakuOut])
def seznam_typu(db: Session = Depends(get_db)):
    return db.scalars(select(TypyPtaku).order_by(TypyPtaku.nazev)).all()