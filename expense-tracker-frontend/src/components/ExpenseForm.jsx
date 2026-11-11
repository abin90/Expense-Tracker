
import { useEffect, useState } from "react";


const ExpenseForm = ({
    initialData,
    onSubmit,
    onCancel
}) => {

    const [formData, setFormData] = useState({

        amount: "",

        category: "Food",

        description: "",

        expense_date: new Date().toLocaleDateString("en-CA")

    });


    const [loading, setLoading] = useState(false);


    // Load existing expense when editing
    useEffect(() => {

        if (initialData) {

            setFormData({

                amount: initialData.amount,

                category: initialData.category,

                description: initialData.description || "",

                expense_date: initialData.expense_date

            });

        }

    }, [initialData]);


    const handleChange = (event) => {

        setFormData({

            ...formData,

            [event.target.name]: event.target.value

        });

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setLoading(true);

        try {

            await onSubmit({

                ...formData,

                amount: Number(formData.amount)

            });

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="card shadow-sm mb-4">

            <div className="card-body">

                <h5 className="mb-3">

                    {initialData ? "Edit Expense" : "Add New Expense"}

                </h5>


                <form onSubmit={handleSubmit}>

                    <div className="row">


                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                Amount (₹)
                            </label>

                            <input
                                type="number"
                                name="amount"
                                className="form-control"
                                value={formData.amount}
                                onChange={handleChange}
                                min="0.01"
                                step="0.01"
                                required
                            />

                        </div>


                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                Category
                            </label>

                            <select
                                name="category"
                                className="form-select"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >

                                <option value="Food">Food</option>

                                <option value="Travel">Travel</option>

                                <option value="Shopping">Shopping</option>

                                <option value="Bills">Bills</option>

                                <option value="Health">Health</option>

                                <option value="Education">Education</option>

                                <option value="Entertainment">Entertainment</option>

                                <option value="Other">Other</option>

                            </select>

                        </div>


                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                Expense Date
                            </label>

                            <input
                                type="date"
                                name="expense_date"
                                className="form-control"
                                value={formData.expense_date}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                Description
                            </label>

                            <input
                                type="text"
                                name="description"
                                className="form-control"
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="btn btn-primary me-2"
                        disabled={loading}
                    >

                        {loading
                            ? "Saving..."
                            : initialData
                                ? "Update Expense"
                                : "Add Expense"
                        }

                    </button>


                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                    >

                        Cancel

                    </button>

                </form>

            </div>

        </div>

    );

};


export default ExpenseForm;
