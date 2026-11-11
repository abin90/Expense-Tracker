import { Link } from "react-router-dom";

function AuthLayout({ title, subtitle, children, footerText, footerLink, footerLinkText }) {
  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Left branding section */}
        <div className="auth-banner">
          <div className="brand">
            <div className="brand-icon">₹</div>
            <span>ExpenseTracker</span>
          </div>

          <div className="banner-content">
            <h1>Take control of your money.</h1>
            <p>
              Track your expenses, understand your spending habits,
              and make smarter financial decisions.
            </p>
          </div>

          <div className="banner-footer">
            Simple. Smart. Secure.
          </div>
        </div>

        {/* Right form section */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <h2>{title}</h2>
            <p className="auth-subtitle">{subtitle}</p>

            {children}

            <div className="auth-footer">
              {footerText}{" "}
              <Link to={footerLink}>{footerLinkText}</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthLayout;