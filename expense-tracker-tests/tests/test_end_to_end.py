import logging

from playwright.sync_api import expect

logger = logging.getLogger(__name__)


def test_complete_expense_tracker_flow(
    page,
    app_url,
    test_user,
    expense_data
):

    try:

        # ------------------------------------------------
        # STEP 1: OPEN REGISTRATION PAGE
        # ------------------------------------------------

        logger.info("Opening registration page")

        page.goto(f"{app_url}/register")

        expect(
            page.get_by_text("Create your account")
        ).to_be_visible()


        # ------------------------------------------------
        # STEP 2: REGISTER USER
        # ------------------------------------------------

        logger.info("Registering new user")

        page.locator("#fullName").fill(
            test_user["full_name"]
        )

        page.locator("#registerEmail").fill(
            test_user["email"]
        )

        page.locator("#registerPassword").fill(
            test_user["password"]
        )

        page.get_by_role(
            "button",
            name="Create Account"
        ).click()

        expect(page).to_have_url(
            f"{app_url}/login"
        )

        logger.info("Registration successful")


        # ------------------------------------------------
        # STEP 3: LOGIN
        # ------------------------------------------------

        logger.info("Logging in")

        page.locator("#email").fill(
            test_user["email"]
        )

        page.locator("#password").fill(
            test_user["password"]
        )

        page.get_by_role(
            "button",
            name="Sign In"
        ).click()

        expect(page).to_have_url(
            f"{app_url}/dashboard"
        )

        expect(
            page.get_by_role("heading", name="Dashboard")
        ).to_be_visible()

        logger.info("Login successful")


        # ------------------------------------------------
        # STEP 4: OPEN EXPENSES PAGE
        # ------------------------------------------------

        logger.info("Opening expenses page")

        page.goto(f"{app_url}/expenses")



        # ------------------------------------------------
        # STEP 5: ADD NEW EXPENSE
        # ------------------------------------------------

        logger.info("Adding a new expense")

        page.get_by_role(
            "button",
            name="Add Expense"
        ).click()

        # Fill expense details
        page.locator(
            'input[name="amount"]'
        ).fill(expense_data["amount"])

        page.locator(
            'select[name="category"]'
        ).select_option(expense_data["category"])

        page.locator(
            'input[name="description"]'
        ).fill(expense_data["description"])

        # Submit expense
        page.get_by_role(
            "button",
            name="Add Expense"
        ).click()

        # Verify expense is displayed
        expense_row = page.locator("tr").filter(
            has_text=expense_data["description"]
        )

        expect(expense_row).to_be_visible()

        logger.info("Expense added successfully")


        # ------------------------------------------------
        # STEP 6: EDIT EXPENSE
        # ------------------------------------------------

        logger.info("Editing expense")

        # Find the row containing our test expense
        expense_row = page.locator("tr").filter(
            has_text=expense_data["description"]
        )

        # Click edit button in that row
        expense_row.locator(
            "button"
        ).nth(0).click()

        # Update description
        updated_description = "Updated Playwright Expense"

        page.locator(
            'input[name="description"]'
        ).fill(updated_description)

        # Save changes
        page.get_by_role(
            "button",
            name="Update Expense"
        ).click()

        # Verify updated expense
        updated_row = page.locator("tr").filter(
            has_text=updated_description
        )

        expect(updated_row).to_be_visible()

        logger.info("Expense updated successfully")


        # ------------------------------------------------
        # STEP 7: DELETE EXPENSE
        # ------------------------------------------------

        logger.info("Deleting expense")

        updated_row = page.locator("tr").filter(
            has_text=updated_description
        )

        # Accept browser confirmation dialog
        page.once(
            "dialog",
            lambda dialog: dialog.accept()
        )

        # Click delete button
        updated_row.locator(
            "button"
        ).nth(1).click()

        # Verify expense is removed
        expect(
            page.locator("tr").filter(
                has_text=updated_description
            )
        ).to_have_count(0)

        logger.info("Expense deleted successfully")


        # ------------------------------------------------
        # STEP 8: VERIFY DASHBOARD
        # ------------------------------------------------

        logger.info("Checking dashboard")

        page.goto(f"{app_url}/dashboard")

        expect(
            page.get_by_role("heading", name="Dashboard")
        ).to_be_visible()

        logger.info("Dashboard loaded successfully")


    except Exception:

        logger.exception(
            "End-to-end expense tracker test failed"
        )

        raise