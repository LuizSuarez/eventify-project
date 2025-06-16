import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minCapacity, setMinCapacity] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/venues');
        setVenues(res.data);
        setFilteredVenues(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch venues. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  useEffect(() => {
    let result = venues;

    if (searchTerm) {
      result = result.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (location) {
      result = result.filter(v =>
        v.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (maxPrice) {
      result = result.filter(v => v.price <= parseInt(maxPrice));
    }

    if (minCapacity) {
      result = result.filter(v => v.capacity >= parseInt(minCapacity));
    }

    setFilteredVenues(result);
  }, [searchTerm, location, maxPrice, minCapacity, venues]);

  if (loading) return <div className="text-center mt-4">Loading venues...</div>;
  if (error) return <div className="text-danger text-center mt-4">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center" style={{ color: "#a259ff" }}>Browse Venues</h2>

      {/* Search & Filters */}
      <div className="row mb-4">
        <div className="col-md-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Min Capacity"
            value={minCapacity}
            onChange={(e) => setMinCapacity(e.target.value)}
          />
        </div>
      </div>

      {/* Venue Cards */}
      <div className="row">
        {filteredVenues.map(venue => (
          <div className="col-md-4 mb-4" key={venue._id}>
            <div className="card h-100 shadow-sm">
              <img
                src={venue.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                className="card-img-top"
                alt={venue.name}
                style={{
                  height: '200px',
                  objectFit: 'cover',
                  borderTopLeftRadius: '5px',
                  borderTopRightRadius: '5px',
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{venue.name.trim()}</h5>
                <p className="card-text"><strong>Location:</strong> {venue.location}</p>
                <p className="card-text"><strong>Capacity:</strong> {venue.capacity}</p>
                <p className="card-text"><strong>Price:</strong> Rs. {venue.price}</p>
                <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
                  {venue.description?.length > 100
                    ? venue.description.slice(0, 100) + '...'
                    : venue.description}
                </p>
                <div className="mt-auto">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => navigate(`/venue/${venue._id}`)}
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

export default VenuesPage;
