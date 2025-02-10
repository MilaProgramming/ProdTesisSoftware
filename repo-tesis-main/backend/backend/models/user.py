from pydantic import BaseModel
from typing import Optional


class User(BaseModel):
    username: str
    password: str


class NewUser(BaseModel):
    id: Optional[int] = None
    username: str
    password: str
    role: Optional[str] = None
    name: str
    lastname: str
    email: str
    DNI: str
    DNIType: str
