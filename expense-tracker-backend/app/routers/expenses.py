
import logging

from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from app.database.connection import get_db

from app.models.expense import Expense
from app.models.user import User

from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseResponse,
    MonthlySummary
)

from app.dependencies.auth import get_current_user


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)


# Add Expense
@router.post(
    "/",
    response_model=ExpenseResponse,
    status_code=status.HTTP_201_CREATED
)
def create_expense(
    expense_data: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        new_expense = Expense(
            amount=expense_data.amount,
            category=expense_data.category,
            description=expense_data.description,
            expense_date=expense_data.expense_date,
            user_id=current_user.id
        )

        db.add(new_expense)
        db.commit()
        db.refresh(new_expense)

        logger.info(
            "Expense created: user=%s expense=%s",
            current_user.id,
            new_expense.id
        )

        return new_expense

    except Exception:

        db.rollback()

        logger.exception("Expense creation failed")

        raise HTTPException(
            status_code=500,
            detail="Unable to create expense"
        )



# Monthly Expense Summary
@router.get(
    "/summary/monthly",
    response_model=MonthlySummary
)
def get_monthly_summary(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        if month < 1 or month > 12:
            raise HTTPException(
                status_code=400,
                detail="Month must be between 1 and 12"
            )

        result = db.query(
            func.coalesce(
                func.sum(Expense.amount),
                0
            ).label("total_expenses"),

            func.count(Expense.id).label("expense_count")

        ).filter(
            Expense.user_id == current_user.id,
            extract("year", Expense.expense_date) == year,
            extract("month", Expense.expense_date) == month
        ).first()

        return {
            "year": year,
            "month": month,
            "total_expenses": Decimal(result.total_expenses),
            "expense_count": result.expense_count
        }

    except HTTPException:
        raise

    except Exception:

        logger.exception("Monthly summary calculation failed")

        raise HTTPException(
            status_code=500,
            detail="Unable to calculate monthly expenses"
        )


# View All Expenses
@router.get(
    "/",
    response_model=list[ExpenseResponse]
)
def get_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    year: int | None = None,
    month: int | None = None
):

    try:

        query = db.query(Expense).filter(
            Expense.user_id == current_user.id
        )

        if year is not None:
            query = query.filter(
                extract("year", Expense.expense_date) == year
            )

        if month is not None:

            if month < 1 or month > 12:
                raise HTTPException(
                    status_code=400,
                    detail="Month must be between 1 and 12"
                )

            query = query.filter(
                extract("month", Expense.expense_date) == month
            )

        expenses = query.order_by(
            Expense.expense_date.desc(),
            Expense.id.desc()
        ).all()

        return expenses

    except HTTPException:
        raise

    except Exception:

        logger.exception("Unable to fetch expenses")

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve expenses"
        )


# View Single Expense
@router.get(
    "/{expense_id}",
    response_model=ExpenseResponse
)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        expense = db.query(Expense).filter(
            Expense.id == expense_id,
            Expense.user_id == current_user.id
        ).first()

        if not expense:

            raise HTTPException(
                status_code=404,
                detail="Expense not found"
            )

        return expense

    except HTTPException:
        raise

    except Exception:

        logger.exception("Unable to retrieve expense")

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve expense"
        )


# Update Expense
@router.put(
    "/{expense_id}",
    response_model=ExpenseResponse
)
def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        expense = db.query(Expense).filter(
            Expense.id == expense_id,
            Expense.user_id == current_user.id
        ).first()

        if not expense:

            raise HTTPException(
                status_code=404,
                detail="Expense not found"
            )

        expense.amount = expense_data.amount
        expense.category = expense_data.category
        expense.description = expense_data.description
        expense.expense_date = expense_data.expense_date

        db.commit()
        db.refresh(expense)

        logger.info(
            "Expense updated: user=%s expense=%s",
            current_user.id,
            expense.id
        )

        return expense

    except HTTPException:
        raise

    except Exception:

        db.rollback()

        logger.exception("Expense update failed")

        raise HTTPException(
            status_code=500,
            detail="Unable to update expense"
        )


# Delete Expense
@router.delete(
    "/{expense_id}"
)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        expense = db.query(Expense).filter(
            Expense.id == expense_id,
            Expense.user_id == current_user.id
        ).first()

        if not expense:

            raise HTTPException(
                status_code=404,
                detail="Expense not found"
            )

        db.delete(expense)
        db.commit()

        logger.info(
            "Expense deleted: user=%s expense=%s",
            current_user.id,
            expense_id
        )

        return {
            "message": "Expense deleted successfully"
        }

    except HTTPException:
        raise

    except Exception:

        db.rollback()

        logger.exception("Expense deletion failed")

        raise HTTPException(
            status_code=500,
            detail="Unable to delete expense"
        )
