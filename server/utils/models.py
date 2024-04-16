from pydantic import BaseModel, Field
from typing import Optional
import time


class Account(BaseModel):
    email: str = Field(min_length=5, max_length=100)
    password: str
    name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    created_at: float = Field(default_factory=time.time)
