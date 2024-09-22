import { Link } from "react-router-dom";
import "./navbar.css";

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <Link to="/">
        <img src="/public/ss_logo.png" />
      </Link>
      <Link to="/" className="name">
        StudySync
      </Link>
      <section className="links">
        <Link to="/" className="link">
          Home
        </Link>
        <Link to="/notes" className="link">
          Classes
        </Link>
        <Link to="/schedule" className="link">
          Schedule
        </Link>
      </section>
    </nav>
  );
};
