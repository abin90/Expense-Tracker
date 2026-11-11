
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


const Navbar = () => {

    const { logout } = useAuth();

    const navigate = useNavigate();


    const handleLogout = () => {

        logout();

        navigate("/login");

    };


    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">

            <a className="navbar-brand fw-bold" href="/dashboard">

                Expense Tracker

            </a>


            <div className="ms-auto">

                <button
                    className="btn btn-outline-light"
                    onClick={handleLogout}
                >

                    <i className="bi bi-box-arrow-right me-2"></i>

                    Logout

                </button>

            </div>

        </nav>

    );

};


export default Navbar;
