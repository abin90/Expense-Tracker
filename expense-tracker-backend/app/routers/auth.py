
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse
)

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# User Registration
@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register_user(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):

    try:

        existing_user = db.query(User).filter(
            User.email == user_data.email
        ).first()

        if existing_user:

            raise HTTPException(
                status_code=409,
                detail="Email already registered"
            )

        new_user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            hashed_password=hash_password(
                user_data.password
            )
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        logger.info(
            "User registered successfully: %s",
            new_user.id
        )

        return new_user

    except HTTPException:
        raise

    except Exception:

        db.rollback()

        logger.exception("User registration failed")

        raise HTTPException(
            status_code=500,
            detail="Unable to register user"
        )


# User Login
@router.post(
    "/login",
    response_model=TokenResponse
)
def login_user(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):

    try:

        user = db.query(User).filter(
            User.email == login_data.email
        ).first()

        if not user or not verify_password(
            login_data.password,
            user.hashed_password
        ):

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        access_token = create_access_token(user.id)

        logger.info(
            "User logged in successfully: %s",
            user.id
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    except HTTPException:
        raise

    except Exception:

        logger.exception("User login failed")

        raise HTTPException(
            status_code=500,
            detail="Unable to login"
        )
