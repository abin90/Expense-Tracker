
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.core.logging_config import setup_logging

from app.database.connection import Base, engine

# Import models so SQLAlchemy can register the tables
from app.models.user import User
from app.models.expense import Expense

from app.routers import auth, expenses


# Configure logging
setup_logging()

logger = logging.getLogger(__name__)


# Create database tables
Base.metadata.create_all(bind=engine)


# Initialize FastAPI
app = FastAPI(
    title="Personal Expense Tracker API",
    description="API for managing personal expenses",
    version="1.0.0"
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Register routers
app.include_router(
    auth.router,
    prefix="/api/v1"
)

app.include_router(
    expenses.router,
    prefix="/api/v1"
)


# Global database error handler
@app.exception_handler(SQLAlchemyError)
async def database_exception_handler(
    request: Request,
    exc: SQLAlchemyError
):

    logger.exception("Database error occurred")

    return JSONResponse(
        status_code=500,
        content={
            "detail": "A database error occurred"
        }
    )


# Global unexpected error handler
@app.exception_handler(Exception)
async def general_exception_handler(
    request: Request,
    exc: Exception
):

    logger.exception("Unexpected application error")

    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error"
        }
    )


# Health check API
@app.get("/")
def home():

    return {
        "message": "Personal Expense Tracker API is running"
    }


@app.get("/health")
def health_check():

    return {
        "status": "healthy"
    }
