import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      <section className="hero">

        <div className="hero-content">

          <h1>
            Lost Something?
            <br />
            <span>Let's Help You Find It.</span>
          </h1>

          <p>
            Welcome to the Lost & Found Management Portal.
            Report lost items, find misplaced belongings, and
            help return items to their rightful owners.
          </p>

          <div className="hero-buttons">
            <Link to="/dashboard" className="primary-btn">
              Find an Item
            </Link>

            <Link to="/dashboard" className="secondary-btn">
              Report an Item
            </Link>
          </div>

        </div>

      </section>

      <section className="features">

        <h2>How It Works</h2>

        <div className="feature-container">

          <div className="feature-card">
            <div className="feature-icon">📢</div>
            <h3>Report</h3>
            <p>
              Report a lost or found item with its details
              and an optional image.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Search</h3>
            <p>
              Search through reported items using keywords
              and item categories.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Reconnect</h3>
            <p>
              Use the provided contact information to help
              return lost belongings.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;