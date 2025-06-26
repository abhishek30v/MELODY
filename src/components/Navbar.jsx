import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : 'not-scrolled'}`}>
      <div className="logo-container">
        <h2 className="navbar-logo">
          <span className="logo-icon">🎵</span>
          <span className="gradient-text">MELODY</span>
        </h2>
      </div>

      <ul className="nav-links">
        <li>
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            <span className="link-icon">🏠</span>
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/songs"
            className={`nav-link ${location.pathname === "/songs" ? "active" : ""}`}
          >
            <span className="link-icon">🎧</span>
            Songs
          </Link>
        </li>
        <li>
          <Link
            to="/discover"
            className={`nav-link ${location.pathname === "/discover" ? "active" : ""}`}
          >
            <span className="link-icon">🔥</span>
            Discover
          </Link>
        </li>
        <li>
          <Link
            to="/favorites"
            className={`nav-link ${location.pathname === "/favorites" ? "active" : ""}`}
          >
            <span className="link-icon">❤️</span>
            Favorites
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
