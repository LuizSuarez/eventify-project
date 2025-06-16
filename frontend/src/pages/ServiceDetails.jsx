import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/services/${id}`);
        setService(res.data);
      } catch (err) {
        console.error("Failed to fetch service:", err);
        setError('Service not found or an error occurred.');
      }
    };
    fetchService();
  }, [id]);

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in as a user to book this service.');
        navigate('/login');
        return;
      }

      if (!window.confirm('Are you sure you want to request a booking for this service?')) {
        return; // User cancelled
      }

      await axios.post(
        'http://localhost:5000/api/bookings',
        { service: id, date: new Date().toISOString().split('T')[0] }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Booking request submitted successfully! The service provider will review it.');
    } catch (err) {
      console.error('Booking error:', err.response ? err.response.data : err.message);
      let errorMessage = 'Failed to submit booking. Please try again.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      alert(errorMessage);
    }
  };

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center" role="alert">
          <h4 className="alert-heading">Service Not Found!</h4>
          <p>We couldn't find the service you are looking for. It might have been removed or the link is incorrect.</p>
          <hr />
          <button className="btn btn-primary" onClick={() => navigate('/services')}>Go to Services</button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading service details...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
        <div className="row g-0">
          <div className="col-md-7">
            {service.images && service.images.length > 0 ? (
              <img
                src={service.images[0]}
                alt={service.name}
                className="img-fluid h-100 object-fit-cover w-100 rounded-start-4"
                style={{ minHeight: '350px' }}
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center bg-light h-100 w-100 rounded-start-4" style={{ minHeight: '350px' }}>
                <span className="text-muted display-4">🖼️</span>
              </div>
            )}
          </div>
          <div className="col-md-5">
            <div className="card-body p-4 p-md-5 d-flex flex-column h-100">
              <h1 className="card-title fw-bold  mb-3 display-5">{service.name}</h1>
              <p className="card-text lead text-muted mb-4"><strong>Type:</strong> {service.type}</p>

              <div className="mb-4">
                <p className="mb-0"><strong className="text-dark">Price:</strong> Rs. {service.price.toLocaleString()}</p>
              </div>

              <div className="flex-grow-1 overflow-auto pe-3 mb-4" style={{ maxHeight: '200px' }}>
                <h5 className="text-dark mb-2">Description:</h5>
                <p className="text-secondary small">{service.description || 'No detailed description provided for this service.'}</p>
              </div>

              <button
                className="btn btn-primary btn-lg mt-auto w-100" style={{ backgroundColor: '#a259ff' , borderColor: '#a259ff' }}
                onClick={handleBooking}
              >
                <i className="bi bi-calendar-plus me-2" ></i>
                Book This Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;