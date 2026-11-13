from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Ptaky
from app.schemas import PtakyOut

router = APIRouter(prefix="/ptaky", tags=["Ptaky"])


@router.get("", response_model=list[PtakyOut])
def seznam_ptaku(db: Session = Depends(get_db)):
    return db.scalars(select(Ptaky).order_by(Ptaky.nazev_cz)).all()

