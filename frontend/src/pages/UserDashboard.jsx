

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';


const purpleColor = '#a259ff';
const darkPurpleColor = '#8c4ad0';


function PaymentButton({ booking }) {
  const handlePayment = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/payments/checkout',
        { bookingId: booking._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error(err);
      alert('Payment failed');
    }
  };

  if (booking.status !== 'Approved' || booking.paymentStatus === 'Paid') return null;

  return (
    <button
      className="btn mt-2 w-100" 
      style={{ backgroundColor: purpleColor, borderColor: purpleColor, color: 'white' }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkPurpleColor}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = purpleColor}
      onClick={handlePayment}
    >
      Pay Now
    </button>
  );
}


function UserBookingCard({ booking }) {
  
  const purpleColor = '#a259ff';

  const getStatusBadge = (status) => {
    let backgroundColor = "bg-secondary"; 
    let textColor = "text-white";

    if (status === "Pending") {
      backgroundColor = "bg-warning";
      textColor = "text-dark";
    } else if (status === "Approved") {
      backgroundColor = ""; 
      return <span className={`badge`} style={{ backgroundColor: purpleColor, color: 'white' }}>{status}</span>;
    } else if (status === "Rejected") {
      backgroundColor = "bg-danger";
      textColor = "text-white";
    } else if (status === "Confirmed") {
      backgroundColor = ""; 
      return <span className={`badge`} style={{ backgroundColor: purpleColor, color: 'white' }}>{status}</span>;
    } else if (status === "Cancelled") {
      backgroundColor = "bg-secondary";
      textColor = "text-white";
    }
    return <span className={`badge ${backgroundColor} ${textColor}`}>{status}</span>;
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    let backgroundColor = "bg-warning";
    let textColor = "text-dark";
    if (paymentStatus === "Paid") {
      backgroundColor = "bg-success";
      textColor = "text-white";
    } else if (paymentStatus === "Refunded") {
      backgroundColor = "bg-info"; 
      textColor = "text-white";
    }
    return <span className={`badge ${backgroundColor} ${textColor} ms-2`}>{paymentStatus}</span>;
  };

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-header d-flex justify-content-between align-items-center bg-light">
        <div>
          <strong>{booking.venue?.name || booking.service?.name || 'Booking Details'}</strong>
          <div className="text-muted small">
            {booking.venue ? `Venue - ${booking.venue.location}` : `Service - ${booking.service?.category}`}
          </div>
        </div>
        <div>{getStatusBadge(booking.status || 'Pending')}</div>
      </div>
      <div className="card-body d-flex flex-column">
        <div className="mb-3">
          <div>
            <strong>Type:</strong> {booking.venue ? 'Venue Booking' : 'Service Booking'}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6">
            <div>
              <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
            </div>
            <div>
              <strong>Guests:</strong> {booking.numberOfGuests || 'N/A'}
            </div>
          </div>
          <div className="col-6">
            <div>
              <strong>Booked On:</strong> {new Date(booking.createdAt).toLocaleDateString()}
            </div>
            <div>
              <strong>Payment:</strong>
              {getPaymentStatusBadge(booking.paymentStatus || 'Unpaid')}
            </div>
          </div>
        </div>
        
        
        {booking.status === 'Approved' && booking.paymentStatus !== 'Paid' && (
          <div className="mt-auto pt-2 border-top">
            <PaymentButton booking={booking} />
          </div>
        )}
      </div>
    </div>
  );
}



export default function UserDashboard() {
  const [venues, setVenues] = useState([]);
  const [services, setServices] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [tab, setTab] = useState('venues');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  
  const purpleColor = '#a259ff';
  const darkPurpleColor = '#8c4ad0'; 

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const [venuesRes, servicesRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/venues', config),
        axios.get('http://localhost:5000/api/services', config),
        axios.get('http://localhost:5000/api/bookings/my', config)
      ]);
      
      setVenues(venuesRes.data);
      setServices(servicesRes.data);
      setMyBookings(bookingsRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const queryParams = new URLSearchParams(location.search);
    const paymentStatus = queryParams.get('payment');
    const bookingId = queryParams.get('bookingId');

    if (paymentStatus === 'success' && bookingId) {
      alert(`Payment for booking ${bookingId} was successful! Your booking status will be updated shortly.`);
      navigate('/dashboard/user', { replace: true });
    } else if (paymentStatus === 'cancelled') {
      alert('Payment was cancelled.');
      navigate('/dashboard/user', { replace: true });
    }
  }, [location.search, navigate]);

  const handleBookNow = async (venueId, serviceId) => {
    const date = window.prompt('Enter booking date (YYYY-MM-DD):');
    if (!date) return;

    const guests = window.prompt('Number of guests (optional):');

    try {
      await axios.post(
        'http://localhost:5000/api/bookings',
        {
          venue: venueId,
          service: serviceId,
          date,
          numberOfGuests: guests || null
        },
        config
      );
      alert('Booking request submitted!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Booking failed');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" style={{ color: purpleColor }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center" style={{ color: purpleColor }}>User Dashboard</h1>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className="nav-link" 
            style={tab === 'venues' ? { color: purpleColor, borderColor: `${purpleColor} ${purpleColor} #fff`, background: '#fff' } : {}}
            onMouseEnter={(e) => { if (tab !== 'venues') e.currentTarget.style.color = darkPurpleColor; }}
            onMouseLeave={(e) => { if (tab !== 'venues') e.currentTarget.style.color = darkPurpleColor;  }}
            onClick={() => setTab('venues')}
          >
            Venues
          </button>
        </li>
        <li className="nav-item">
          <button 
            className="nav-link" 
            style={tab === 'services' ? { color: purpleColor, borderColor: `${purpleColor} ${purpleColor} #fff`, background: '#fff' } : {}}
            onMouseEnter={(e) => { if (tab !== 'services') e.currentTarget.style.color = darkPurpleColor; }}
            onMouseLeave={(e) => { if (tab !== 'services') e.currentTarget.style.color = darkPurpleColor;  }}
            onClick={() => setTab('services')}
          >
            Services
          </button>
        </li>
        <li className="nav-item">
          <button 
            className="nav-link" 
            style={tab === 'bookings' ? { color: purpleColor, borderColor: `${purpleColor} ${purpleColor} #fff`, background: '#fff' } : {}}
            onMouseEnter={(e) => { if (tab !== 'bookings') e.currentTarget.style.color = darkPurpleColor; }}
            onMouseLeave={(e) => { if (tab !== 'bookings') e.currentTarget.style.color = darkPurpleColor; }}
            onClick={() => setTab('bookings')}
          >
            My Bookings ({myBookings.length})
          </button>
        </li>
      </ul>

      {tab === 'venues' && (
        <div className="row">
          {venues.length > 0 ? (
            venues.map(venue => (
              <div className="col-md-4 mb-4" key={venue._id}>
                <div className="card h-100">
                  <div className="card-img-top" style={{ 
                    height: '180px', 
                    background: '#f5f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {venue.images?.length > 0 ? (
                      <img 
                        src={venue.images[0]} 
                        alt={venue.name}
                        style={{ 
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '40px', color: '#ccc' }}>🏛️</span>
                    )}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{venue.name}</h5>
                    <p className="card-text text-muted">{venue.location}</p>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="badge bg-light text-dark">
                        Capacity: {venue.capacity}
                      </span>
                      <span className="badge bg-light text-dark">
                        Price: Rs. {venue.price}
                      </span>
                    </div>
                    <p className="card-text">{venue.description}</p>
                    <button 
                      className="btn w-100"
                      style={{ backgroundColor: purpleColor, borderColor: purpleColor, color: 'white' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkPurpleColor}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = purpleColor}
                      onClick={() => handleBookNow(venue._id, null)}
                    >
                      Book Venue
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <h4>No venues available</h4>
              <p className="text-muted">Check back later for new venues</p>
            </div>
          )}
        </div>
      )}

      {tab === 'services' && (
        <div className="row">
          {services.length > 0 ? (
            services.map(service => (
              <div className="col-md-4 mb-4" key={service._id}>
                <div className="card h-100">
                  <div className="card-img-top" style={{ 
                    height: '180px', 
                    background: '#f5f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {service.images?.length > 0 ? (
                      <img 
                        src={service.images[0]} 
                        alt={service.name}
                        style={{ 
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '40px', color: '#ccc' }}>🛎️</span>
                    )}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{service.name}</h5>
                    <p className="card-text text-muted">{service.category}</p>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="badge bg-light text-dark">
                        Type: {service.type}
                      </span>
                      <span className="badge bg-light text-dark">
                        Price: Rs. {service.price}
                      </span>
                    </div>
                    <p className="card-text">{service.description}</p>
                    <button 
                      className="btn w-100"
                      style={{ backgroundColor: purpleColor, borderColor: purpleColor, color: 'white' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkPurpleColor}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = purpleColor}
                      onClick={() => handleBookNow(null, service._id)}
                    >
                      Book Service
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <h4>No services available</h4>
              <p className="text-muted">Check back later for new services</p>
            </div>
          )}
        </div>
      )}

      {tab === 'bookings' && (
        <div className="py-3">
          {myBookings.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {myBookings.map(booking => (
                <div className="col" key={booking._id}>
                  <UserBookingCard booking={booking} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 border rounded-lg bg-light text-muted">
              <i className="bi bi-inbox-fill display-4 mb-3" style={{ color: purpleColor }}></i>
              <h4 className="mb-2">No Bookings Found</h4>
              <p className="lead">You haven't made any bookings yet. Book a venue or service to see them here!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}