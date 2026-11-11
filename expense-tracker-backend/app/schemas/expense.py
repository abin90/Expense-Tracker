
from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field, ConfigDict


class ExpenseCreate(BaseModel):

    amount: Decimal = Field(
        gt=0,
        max_digits=10,
        decimal_places=2
    )

    category: str = Field(
        min_length=2,
        max_length=100
    )

    description: str | None = Field(
        default=None,
        max_length=255
    )

    expense_date: date


class ExpenseUpdate(ExpenseCreate):
    pass


class ExpenseResponse(BaseModel):

    id: int
    amount: Decimal
    category: str
    description: str | None
    expense_date: date

    model_config = ConfigDict(from_attributes=True)


class MonthlySummary(BaseModel):

    year: int
    month: int
    total_expenses: Decimal
    expense_count: int
