import uuid

from pydantic import BaseModel, ConfigDict

class TypyPtakuOut(BaseModel):
    model_config=ConfigDict(from_attributes=True)

    id: uuid.UUID
    nazev:str

class PtakyOut(BaseModel):
    model_config=ConfigDict(from_attributes=True)

    id: uuid.UUID
    nazev_cz:str