
import api from "./api";


// Get all expenses
export const getExpenses = async (year, month) => {

    try {

        const response = await api.get("/expenses/", {

            params: {
                year,
                month
            }

        });

        return response.data;

    } catch (error) {

        console.error("Unable to fetch expenses:", error);

        throw error;

    }

};


// Get single expense
export const getExpenseById = async (expenseId) => {

    try {

        const response = await api.get(
            `/expenses/${expenseId}`
        );

        return response.data;

    } catch (error) {

        console.error("Unable to fetch expense:", error);

        throw error;

    }

};


// Add expense
export const createExpense = async (expenseData) => {

    try {

        const response = await api.post(
            "/expenses/",
            expenseData
        );

        return response.data;

    } catch (error) {

        console.error("Unable to create expense:", error);

        throw error;

    }

};


// Update expense
export const updateExpense = async (expenseId, expenseData) => {

    try {

        const response = await api.put(
            `/expenses/${expenseId}`,
            expenseData
        );

        return response.data;

    } catch (error) {

        console.error("Unable to update expense:", error);

        throw error;

    }

};


// Delete expense
export const deleteExpense = async (expenseId) => {

    try {

        const response = await api.delete(
            `/expenses/${expenseId}`
        );

        return response.data;

    } catch (error) {

        console.error("Unable to delete expense:", error);

        throw error;

    }

};


// Get monthly expense summary
export const getMonthlySummary = async (year, month) => {

    try {

        const response = await api.get(
            "/expenses/summary/monthly",
            {
                params: {
                    year,
                    month
                }
            }
        );

        return response.data;

    } catch (error) {

        console.error("Unable to fetch monthly summary:", error);

        throw error;

    }

};
