
const ExpenseTable = ({
    expenses,
    onEdit,
    onDelete
}) => {

    return (

        <div className="card shadow-sm">

            <div className="card-body">

                <h5 className="mb-3">
                    Expense History
                </h5>


                <div className="table-responsive">

                    <table className="table table-hover align-middle">

                        <thead className="table-light">

                            <tr>

                                <th>Date</th>

                                <th>Category</th>

                                <th>Description</th>

                                <th>Amount</th>

                                <th>Actions</th>

                            </tr>

                        </thead>


                        <tbody>

                            {expenses.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="text-center text-muted py-4"
                                    >

                                        No expenses found.

                                    </td>

                                </tr>

                            ) : (

                                expenses.map((expense) => (

                                    <tr key={expense.id}>

                                        <td>
                                            {expense.expense_date}
                                        </td>

                                        <td>
                                            {expense.category}
                                        </td>

                                        <td>
                                            {expense.description || "-"}
                                        </td>

                                        <td className="fw-bold">

                                            ₹{Number(expense.amount).toFixed(2)}

                                        </td>

                                        <td>

                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => onEdit(expense)}
                                            >

                                                <i className="bi bi-pencil"></i>

                                            </button>


                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => onDelete(expense.id)}
                                            >

                                                <i className="bi bi-trash"></i>

                                            </button>

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


export default ExpenseTable;
