import pytest
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


@pytest.fixture(scope="session")
def base_url():

    return "http://localhost:5173"


@pytest.fixture
def app_url(base_url):

    return base_url


@pytest.fixture
def test_user():

    import uuid

    unique_id = uuid.uuid4().hex[:8]

    return {
        "full_name": "Playwright Test User",
        "email": f"playwright_{unique_id}@example.com",
        "password": "TestPassword@123"
    }


@pytest.fixture
def expense_data():

    return {
        "amount": "500",
        "category": "Food",
        "description": "Playwright Test Expense"
    }