
import { useEffect, useState } from "react";

import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";

import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense
} from "../services/expenseService";

import { toast } from "react-toastify";


const Expenses = () => {

    const [expenses, setExpenses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [loading, setLoading] = useState(true);


    // Fetch expenses
    const fetchExpenses = async () => {

        try {

            setLoading(true);

            const data = await getExpenses();

            setExpenses(data);

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Unable to fetch expenses"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchExpenses();

    }, []);


    // Add or update expense
    const handleSaveExpense = async (expenseData) => {

        try {

            if (editingExpense) {

                await updateExpense(
                    editingExpense.id,
                    expenseData
                );

                toast.success("Expense updated successfully");

            } else {

                await createExpense(expenseData);

                toast.success("Expense added successfully");

            }

            setShowForm(false);
            setEditingExpense(null);

            await fetchExpenses();

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Unable to save expense"
            );

            throw error;

        }

    };


    // Edit expense
    const handleEdit = (expense) => {

        setEditingExpense(expense);
        setShowForm(true);

    };


    // Delete expense
    const handleDelete = async (expenseId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this expense?"
        );

        if (!confirmed) return;


        try {

            await deleteExpense(expenseId);

            toast.success("Expense deleted successfully");

            await fetchExpenses();

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Unable to delete expense"
            );

        }

    };


    // Open add expense form
    const handleAddNew = () => {

        setEditingExpense(null);
        setShowForm(true);

    };


    // Close form
    const handleCancel = () => {

        setShowForm(false);
        setEditingExpense(null);

    };


    return (

        <div className="expenses-page">


            {/* Page Header */}

            <div className="expenses-header">

                <div>

                    <h3>Expenses</h3>

                    <p>
                        Manage and track your daily expenses.
                    </p>

                </div>


                {!showForm && (

                    <button
                        className="add-expense-button"
                        onClick={handleAddNew}
                    >

                        <i className="bi bi-plus-lg"></i>

                        <span>Add Expense</span>

                    </button>

                )}

            </div>


            {/* Expense Form */}

            {showForm && (

                <div className="expense-form-card">

                    <div className="expense-form-header">

                        <div>

                            <h5>
                                {editingExpense
                                    ? "Edit Expense"
                                    : "Add New Expense"}
                            </h5>

                            <p>
                                Enter the details of your transaction.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="close-form-button"
                            onClick={handleCancel}
                            aria-label="Close expense form"
                        >

                            <i className="bi bi-x-lg"></i>

                        </button>

                    </div>


                    <ExpenseForm
                        initialData={editingExpense}
                        onSubmit={handleSaveExpense}
                        onCancel={handleCancel}
                    />

                </div>

            )}


            {/* Expense List */}

            <div className="expenses-list-card">

                <div className="expenses-list-header">

                    <div>

                        <h5>All Expenses</h5>

                        <p>
                            View and manage your transactions.
                        </p>

                    </div>


                    <span className="expense-total-badge">

                        {expenses.length} Records

                    </span>

                </div>


                {loading ? (

                    <div className="expenses-loading">

                        <div className="spinner-border text-primary"></div>

                        <p>Loading expenses...</p>

                    </div>

                ) : (

                    <div className="expenses-table-container">

                        <ExpenseTable
                            expenses={expenses}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />

                    </div>

                )}

            </div>


        </div>

    );

};


export default Expenses;
