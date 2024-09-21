import { Link } from "react-router-dom";
import "./navbar.css";

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/notes">Classes</Link>
      <Link to="/schedule">Schedule</Link>
    </nav>
  );
};
