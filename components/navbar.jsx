import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">

        <Link to="/" className="logo">
          Lost & Found
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login" className="login-btn">
            Sign In
          </Link>
          <Link to="/signup" className="signup-btn">
            Sign Up
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;