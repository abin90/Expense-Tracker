
import { useEffect, useState } from "react";

import {
    getMonthlySummary,
    getExpenses
} from "../services/expenseService";

import { toast } from "react-toastify";


const Dashboard = () => {

    const [summary, setSummary] = useState(null);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const monthName = currentDate.toLocaleString(
        "default",
        { month: "long" }
    );


    // Fetch dashboard data
    const fetchDashboardData = async () => {

        try {

            setLoading(true);

            const [summaryData, expenseData] = await Promise.all([
                getMonthlySummary(year, month),
                getExpenses(year, month)
            ]);

            setSummary(summaryData);

            setRecentExpenses(expenseData.slice(0, 5));

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Unable to load dashboard"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchDashboardData();

    }, []);


    // Loading screen
    if (loading) {

        return (

            <div className="dashboard-loading">

                <div className="spinner-border text-primary"></div>

                <p>Loading your dashboard...</p>

            </div>

        );

    }


    return (

        <div className="dashboard-page">

            {/* Page Header */}

            <div className="dashboard-header">

                <div>

                    <h3>Dashboard</h3>

                    <p>
                        Here's an overview of your expenses for {monthName}.
                    </p>

                </div>

                <div className="dashboard-date">

                    <i className="bi bi-calendar3"></i>

                    {monthName} {year}

                </div>

            </div>


            {/* Summary Cards */}

            <div className="dashboard-summary">


                {/* Total Expenses */}

                <div className="summary-card">

                    <div className="summary-card-top">

                        <div className="summary-icon expense-icon">

                            <i className="bi bi-wallet2"></i>

                        </div>

                        <span className="summary-label">
                            Total Expenses
                        </span>

                    </div>

                    <h2>
                        ₹{Number(
                            summary?.total_expenses || 0
                        ).toFixed(2)}
                    </h2>

                    <p>
                        Total spending in {monthName}
                    </p>

                </div>


                {/* Expense Count */}

                <div className="summary-card">

                    <div className="summary-card-top">

                        <div className="summary-icon count-icon">

                            <i className="bi bi-receipt"></i>

                        </div>

                        <span className="summary-label">
                            Number of Expenses
                        </span>

                    </div>

                    <h2>
                        {summary?.expense_count || 0}
                    </h2>

                    <p>
                        Transactions recorded this month
                    </p>

                </div>


            </div>


            {/* Recent Expenses */}

            <div className="recent-expenses-card">

                <div className="recent-expenses-header">

                    <div>

                        <h5>Recent Expenses</h5>

                        <p>
                            Your latest transactions
                        </p>

                    </div>

                    <span className="expense-count-badge">

                        {recentExpenses.length} Records

                    </span>

                </div>


                <div className="table-responsive">

                    <table className="table dashboard-table">

                        <thead>

                            <tr>

                                <th>Date</th>

                                <th>Category</th>

                                <th>Description</th>

                                <th className="text-end">Amount</th>

                            </tr>

                        </thead>


                        <tbody>

                            {recentExpenses.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="empty-expenses"
                                    >

                                        <i className="bi bi-receipt"></i>

                                        <p>No expenses recorded this month.</p>

                                    </td>

                                </tr>

                            ) : (

                                recentExpenses.map((expense) => (

                                    <tr key={expense.id}>

                                        <td>
                                            {expense.expense_date}
                                        </td>

                                        <td>

                                            <span className="category-badge">

                                                {expense.category}

                                            </span>

                                        </td>

                                        <td>
                                            {expense.description || "-"}
                                        </td>

                                        <td className="text-end expense-amount">

                                            ₹{Number(
                                                expense.amount
                                            ).toFixed(2)}

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

};


export default Dashboard;
