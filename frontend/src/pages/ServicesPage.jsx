import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setServices(res.data);
        setFilteredServices(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch services. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    let result = services;

    if (searchTerm) {
      result = result.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (type) {
      result = result.filter(s =>
        s.type.toLowerCase().includes(type.toLowerCase())
      );
    }

    if (maxPrice) {
      result = result.filter(s => s.price <= parseInt(maxPrice));
    }

    setFilteredServices(result);
  }, [searchTerm, type, maxPrice, services]);

  if (loading) return <div className="text-center mt-4">Loading services...</div>;
  if (error) return <div className="text-danger text-center mt-4">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center" style={{ color: "#a259ff" }}>Browse Services</h2>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by type (e.g., catering)"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Service Cards */}
      <div className="row">
        {filteredServices.map(service => (
          <div className="col-md-4 mb-4" key={service._id}>
            <div className="card h-100">
              <img
                src={service.images?.[0] || 'https://via.placeholder.com/300x200'}
                className="card-img-top"
                alt={service.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{service.name.trim()}</h5>
                <p className="card-text"><strong>Type:</strong> {service.type}</p>
                <p className="card-text"><strong>Price:</strong> Rs. {service.price}</p>
                <p className="card-text">{service.description}</p>
                <div className="mt-auto">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => navigate(`/service/${service._id}`)}
                    style={{ background: "#a259ff", color: "#fff" }}
                  >
                    View & Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
