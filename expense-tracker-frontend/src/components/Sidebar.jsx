import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar-content">

      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">₹</div>
        <span>ExpenseTracker</span>
      </div>

      <div className="sidebar-menu">
        <p className="sidebar-heading">MENU</p>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <i className="bi bi-grid"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <i className="bi bi-wallet2"></i>
          <span>Expenses</span>
        </NavLink>

      </div>

      <div className="sidebar-bottom">
        <p>Manage your money smartly.</p>
      </div>

    </div>
  );
}

export default Sidebar;