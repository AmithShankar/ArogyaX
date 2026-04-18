from fastapi.encoders import jsonable_encoder
from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class DataResponse(BaseModel, Generic[T]):
    data: T


class ErrorDetail(BaseModel):
    message: str
    field: str | None = None


class ErrorResponse(BaseModel):
    errors: list[ErrorDetail]




def ok(data: Any) -> dict:
    return {"data": jsonable_encoder(data)}
