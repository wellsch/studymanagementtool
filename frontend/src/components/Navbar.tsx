import { Link } from "react-router-dom";
import "./navbar.css";

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <section className="home linkSection">
        <Link to="/">Home</Link>
      </section>
      <section className="notes linkSection">
        <Link to="/notes">Notes</Link>
      </section>
      <section className="study linkSection">
        <Link to="/study">Study</Link>
      </section>
      <section className="schedule linkSection">
        <Link to="/schedule">Schedule</Link>
      </section>
    </nav>
  );
};
