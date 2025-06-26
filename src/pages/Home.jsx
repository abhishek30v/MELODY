import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="home-container">
      <div className="main-content">
        {/* Hero Section */}
        <section className={`hero ${isVisible ? "visible" : ""}`}>
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">Welcome to</span>
              <br />
              <span className="brand-name">MELODY</span>
              <span className="music-note">🎵</span>
            </h1>
            <p className="hero-subtitle">
              Discover, play, and enjoy your favorite music with an experience
              that goes beyond ordinary. Your personal soundtrack awaits.
            </p>
            <div className="hero-buttons">
              <button
                className="primary-button hover-lift"
                onClick={() => navigate("/songs")}
              >
                <span>🎧</span> Start Listening
              </button>
              <button
                className="secondary-button hover-lift"
                onClick={() => navigate("/discover")}
              >
                <span>🔍</span> Explore Music
              </button>
            </div>
          </div>

          {/* Floating Music Elements */}
          <div className="floating-elements">
            <div className="floating-note note1">🎵</div>
            <div className="floating-note note2">🎶</div>
            <div className="floating-note note3">🎧</div>
            <div className="floating-note note4">🎸</div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <h2 className="section-title gradient-text">Why Choose Melody?</h2>
          <div className="feature-grid">
            <div className="feature-card glass-effect hover-lift">
              <div className="feature-icon">🌍</div>
              <h3 className="feature-title">Global Library</h3>
              <p className="feature-text">
                Access millions of songs from around the world, all in one
                place.
              </p>
            </div>
            <div className="feature-card glass-effect hover-lift">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Lightning Fast</h3>
              <p className="feature-text">
                Instant playback with zero buffering. Your music, instantly.
              </p>
            </div>
            <div className="feature-card glass-effect hover-lift">
              <div className="feature-icon">🎨</div>
              <h3 className="feature-title">Beautiful Design</h3>
              <p className="feature-text">
                Stunning visuals that make listening to music a visual
                experience.
              </p>
            </div>
          </div>
        </section>
      </div>
      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-logo">
              <span className="logo-icon">🎵</span>
              <span className="gradient-text">MELODY</span>
            </h3>
            <p className="footer-tagline">
              Your personal soundtrack for every moment
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-section" id="about">
              <h4>About Us</h4>
              <ul>
                <li>
                  <strong>Abhishek Verma</strong>
                </li>
                <li>
                  Email:{" "}
                  <a href="mailto:abhishekvermatechie@gmail.com">
                    abhishekvermatechie@gmail.com
                  </a>
                </li>
                <li>
                  Contact: <a href="tel:9027401559">9027401559</a>
                </li>
              </ul>
            </div>

            <div className="footer-section" id="contact">
              <h4>Connect</h4>
              <div className="social-links">
                <a
                  href="https://www.instagram.com/abhishek_30v"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>📷</span> Instagram
                </a>
                <a
                  href="https://github.com/abhishek30v"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>💻</span> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/abhishekverma45/"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>🔗</span> LinkedIn
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="#terms">Terms of Service</a>
                </li>
                <li>
                  <a href="#privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="#cookies">Cookie Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Melody. All rights reserved.</p>
          <p>Made with ❤️ by Abhishek Verma for music lovers</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
