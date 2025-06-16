import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <nav className="d-flex align-items-center justify-content-between px-4 py-3" style={{ background: "#fff", borderBottom: "1px solid #eee" }}>
        <div className="d-flex align-items-center" style={{ gap: 8 }}>
     
          <span style={{ fontWeight: 700, fontSize: "1.3rem", letterSpacing: 1 }}>Eventify</span>
        </div>
        <div>
          <Link to="/venues" className="mx-3 fw-semibold nav-link-home">Venues</Link>
          <Link to="/services" className="mx-3 fw-semibold nav-link-home">Services</Link>
         
        </div>
        <div>
          <Link to="/login" className="btn btn-outline-dark me-2" style={{ minWidth: 80 }}>Log In</Link>
          <Link to="/signup" className="btn btn-dark" style={{ minWidth: 80 }}>Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container" style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "100px 0 0 0",
        flexWrap: "wrap"
      }}>
        <div style={{ maxWidth: 600, flex: 1 }}>
          <h1 style={{
            fontWeight: 700,
            fontSize: "3.2rem",
            lineHeight: 1.1,
            letterSpacing: "-1px"
          }}>
            Book Venues & Hire Services<br />
            <span style={{ color: "#a259ff" }}>All in One Place</span>
          </h1>
          <p className="mt-3" style={{ color: "#6c757d", fontSize: "1.2rem" }}>
            Find and book the perfect venue, hire professional photographers, and get premium catering services for your special occasions.
          </p>
          <div className="mt-4 d-flex flex-wrap gap-3">
            <Link to="/venues" className="btn btn-dark btn-lg px-4" style={{ minWidth: 160 }}>Browse Venues</Link>
            <Link to="/services" className="btn btn-outline-dark btn-lg px-4" style={{ minWidth: 160 }}>Find Services</Link>
          </div>
        </div>
        <div className="card shadow p-4" style={{
          minWidth: 320,
          maxWidth: 350,
          marginLeft: 40,
          borderRadius: 18,
          border: "none",
          background: "#fff"
        }}>
          <h4 className="fw-bold mb-2 text-center" style={{ color: "#a259ff" }}>Quick Booking</h4>
          <p className="text-center text-muted mb-3" style={{ fontSize: "1rem" }}>What are you looking for?</p>
          <div>
            <Link
              to="/venues"
              className="d-flex align-items-center border rounded mb-2 px-3 py-2 quick-booking-option"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span style={{ fontSize: 22, marginRight: 12 }}>📍</span> Book a Venue
            </Link>
            <Link
              to="/services"
              className="d-flex align-items-center border rounded mb-2 px-3 py-2 quick-booking-option"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span style={{ fontSize: 22, marginRight: 12 }}>🍽️</span> Hire Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container text-center" style={{ marginTop: 80, marginBottom: 40 }}>
        <div style={{
          display: "inline-block",
          borderRadius: 12,
          padding: "2px 18px",
          fontWeight: 700,
          fontSize: "2.5rem",
          marginBottom: 16,
          color: "#a259ff"
        }}>
          Services
        </div>
        <h2 style={{ fontWeight: 600, fontSize: "2.7rem", marginBottom: 10 }}>Everything You Need</h2>
        <p style={{ color: "#a259ff", fontSize: "1.2rem", marginBottom: 40 }}>
          Book venues and hire professional services for your special occasions.
        </p>
        <div className="row justify-content-center">
          <div className="col-md-3 mb-4">
            <div className="border rounded p-4 h-100 service-card">
              <div style={{ fontSize: 32, marginBottom: 12 }}>📍</div>
              <h5 className="fw-bold mb-2" style={{ color: "#a259ff" }}>Venue Booking</h5>
              <p className="text-muted mb-0">Browse venues based on location, capacity, and price. Submit booking requests in minutes.</p>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="border rounded p-4 h-100 service-card">
              <div style={{ fontSize: 32, marginBottom: 12 }}>🍽️</div>
              <h5 className="fw-bold mb-2" style={{ color: "#a259ff" }}>Catering Services</h5>
              <p className="text-muted mb-0">Find and hire professional caterers for your events with various cuisine options.</p>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="border rounded p-4 h-100 service-card">
              <div style={{ fontSize: 32, marginBottom: 12 }}>📷</div>
              <h5 className="fw-bold mb-2" style={{ color: "#a259ff" }}>Photography</h5>
              <p className="text-muted mb-0">Hire professional photographers to capture your special moments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container text-center" style={{ marginBottom: 60 }}>
        <h2 style={{ fontWeight: 600, fontSize: "2.5rem", marginBottom: 10 }}>How Eventify Works</h2>
        <p style={{ color: "#a259ff", fontSize: "1.2rem", marginBottom: 40 }}>
          Simple steps to book what you need
        </p>
        <div className="row justify-content-center">
          <div className="col-md-3 mb-4">
            <div>
              <div style={{
                background: "#ede6fd",
                color: "#a259ff",
                fontWeight: 700,
                fontSize: 28,
                borderRadius: "50%",
                width: 64,
                height: 64,
                margin: "0 auto 16px auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>1</div>
              <h5 className="fw-bold mb-2" style={{ color: "#a259ff" }}>Browse & Search</h5>
              <p className="text-muted mb-0">Find venues and services that match your requirements</p>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div>
              <div style={{
                background: "#e6f0fd",
                color: "#2563eb",
                fontWeight: 700,
                fontSize: 28,
                borderRadius: "50%",
                width: 64,
                height: 64,
                margin: "0 auto 16px auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>2</div>
              <h5 className="fw-bold mb-2" style={{ color: "#a259ff" }}>Book & Request</h5>
              <p className="text-muted mb-0">Submit booking requests and communicate with providers</p>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div>
              <div style={{
                background: "#e6fdea",
                color: "#27ae60",
                fontWeight: 700,
                fontSize: 28,
                borderRadius: "50%",
                width: 64,
                height: 64,
                margin: "0 auto 16px auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>3</div>
              <h5 className="fw-bold mb-2"  style={{ color: "#a259ff" }}>Get Confirmed</h5>
              <p className="text-muted mb-0">Receive confirmations and manage your bookings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#fff", borderTop: "1px solid #eee", padding: "32px 0 0 0", marginTop: "auto" }}>
        <div className="container">
          <div className="row pb-3">
            <div className="col-md-4 mb-3">
              <div className="d-flex align-items-center mb-2" style={{ gap: 8 }}>

                <span style={{ fontWeight: 700, fontSize: "1.1rem" , color: "#a259ff"}}>Eventify</span>
              </div>
              <div style={{ color: "#6c757d" }}>
                Book venues and hire professional services for your special occasions.
              </div>
            </div>
            <div className="col-md-2 mb-3">
              <div className="fw-semibold mb-2">Services</div>
              <div style={{ color: "#6c757d" }}>Venues</div>
              <div style={{ color: "#6c757d" }}>Catering</div>
              <div style={{ color: "#6c757d" }}>Photography</div>
            </div>
            <div className="col-md-2 mb-3">
              <div className="fw-semibold mb-2">Company</div>
              <div style={{ color: "#6c757d" }}>About</div>
              <div style={{ color: "#6c757d" }}>Contact</div>
            </div>
            <div className="col-md-2 mb-3">
              <div className="fw-semibold mb-2">Legal</div>
              <div style={{ color: "#6c757d" }}>Privacy</div>
              <div style={{ color: "#6c757d" }}>Terms</div>
            </div>
          </div>
          <div className="text-center mt-3 mb-2" style={{ color: "#a259ff", fontSize: 18 , fontWeight: 600 }}>
            © 2025 Eventify. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Custom CSS for hover effects */}
      <style>{`
        .nav-link-home {
          color: #222 !important;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-link-home:hover {
          color: #a259ff !important;
        }
        .btn-dark, .btn-outline-dark {
          transition: background 0.2s, color 0.2s, border 0.2s;
        }
        .btn-dark:hover {
          background: #222 !important;
          color: #fff !important;
        }
        .btn-outline-dark:hover {
          background: #222 !important;
          color: #fff !important;
          border-color: #222 !important;
        }
        .service-card {
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .service-card:hover {
          box-shadow: 0 4px 24px rgba(162,89,255,0.08);
          border-color: #a259ff;
        }
        .quick-booking-option {
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .quick-booking-option:hover {
          background: #f3f0fa;
          border-color: #a259ff;
        }
      `}</style>
    </div>
  );
}

export default HomePage;