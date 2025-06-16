

import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the primary color for consistency
const primaryPurple = '#a259ff';
const darkPurple = '#8c4ad0'; // A slightly darker shade for hover/active states
const lightPurple = '#e8dfff'; // A very light shade for backgrounds or subtle elements

const BookingApprovalCard = ({ booking, onStatusUpdate, token }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);

    if (!booking) {
        return (
            <div className="card mb-4">
                <div className="card-body text-center text-muted">Loading booking details...</div>
            </div>
        );
    }

    const handleStatusUpdate = (action) => {
        setSelectedAction(action);
        setShowConfirmDialog(true);
    };

    const confirmStatusUpdate = async () => {
        if (!selectedAction) return;
        setIsUpdating(true);
        setShowConfirmDialog(false);

        try {
            const response = await fetch(
                `http://localhost:5000/api/bookings/${booking._id}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ action: selectedAction })
                }
            );

            if (response.ok) {
                if (onStatusUpdate) {
                    onStatusUpdate(
                        booking._id,
                        selectedAction === 'approve'
                            ? 'Approved'
                            : selectedAction === 'reject'
                            ? 'Rejected'
                            : 'Cancelled'
                    );
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update booking status');
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setIsUpdating(false);
            setSelectedAction(null);
        }
    };

    const cancelConfirmation = () => {
        setShowConfirmDialog(false);
        setSelectedAction(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        let backgroundColor = "bg-secondary"; // Default
        let textColor = "text-white";

        if (status === "Pending") {
            backgroundColor = "bg-warning";
            textColor = "text-dark";
        } else if (status === "Approved") {
            // Apply custom purple for Approved
            return <span className={`badge`} style={{ backgroundColor: primaryPurple, color: 'white' }}>{status}</span>;
        } else if (status === "Rejected") {
            backgroundColor = "bg-danger";
            textColor = "text-white";
        } else if (status === "Confirmed") {
             // Apply custom purple for Confirmed
            return <span className={`badge`} style={{ backgroundColor: primaryPurple, color: 'white' }}>{status}</span>;
        } else if (status === "Cancelled") {
            backgroundColor = "bg-secondary";
            textColor = "text-white";
        }
        return <span className={`badge ${backgroundColor} ${textColor}`}>{status}</span>;
    };

    const getPaymentStatusBadge = (paymentStatus) => {
        let color = "warning";
        if (paymentStatus === "Paid") color = "success";
        else if (paymentStatus === "Refunded") color = "info"; // Keep info for refunded
        return <span className={`badge bg-${color} ms-2`}>{paymentStatus}</span>;
    };

    const isPending = booking?.status === 'Pending';
    const isApprovedAndUnpaid = booking?.status === 'Approved' && booking?.paymentStatus === 'Unpaid';
    const isConfirmed = booking?.status === 'Confirmed';

    return (
        <>
            <div className="card mb-4 shadow-sm border-0">
                <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: lightPurple }}>
                    <div>
                        <strong>{booking?.service?.name || 'Unknown Service'}</strong>
                        <div className="text-muted small">{booking?.service?.type}</div>
                    </div>
                    <div>{getStatusBadge(booking?.status || 'Pending')}</div>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <div><strong>Customer:</strong> {booking?.user?.name || 'Unknown'}</div>
                        <div><strong>Email:</strong> {booking?.user?.email || 'N/A'}</div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-6">
                            <div><strong>Date:</strong> {booking?.date ? formatDate(booking.date) : 'N/A'}</div>
                            <div><strong>Guests:</strong> {booking?.numberOfGuests || 1}</div>
                        </div>
                        <div className="col-6">
                            <div><strong>Requested:</strong> {booking?.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}</div>
                            <div>
                                <strong>Payment:</strong>
                                {getPaymentStatusBadge(booking?.paymentStatus || 'Unpaid')}
                            </div>
                        </div>
                    </div>
                    {(isPending || isApprovedAndUnpaid || isConfirmed) && (
                        <div className="d-flex gap-2 pt-2 border-top">
                            {isPending && (
                                <>
                                    <button
                                        className="btn flex-fill"
                                        style={{ backgroundColor: primaryPurple, color: 'white' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkPurple}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryPurple}
                                        disabled={isUpdating}
                                        onClick={() => handleStatusUpdate('approve')}
                                    >
                                        {isUpdating && selectedAction === 'approve' ? 'Approving...' : 'Approve'}
                                    </button>
                                    <button
                                        className="btn btn-danger flex-fill"
                                        disabled={isUpdating}
                                        onClick={() => handleStatusUpdate('reject')}
                                    >
                                        {isUpdating && selectedAction === 'reject' ? 'Rejecting...' : 'Reject'}
                                    </button>
                                </>
                            )}
                            {(isApprovedAndUnpaid || isConfirmed) && (
                                <button
                                    className="btn btn-secondary flex-fill"
                                    disabled={isUpdating}
                                    onClick={() => handleStatusUpdate('cancel')}
                                >
                                    {isUpdating && selectedAction === 'cancel' ? 'Cancelling...' : 'Cancel Booking'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {showConfirmDialog && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.4)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" style={{ color: primaryPurple }}>
                                    Confirm {selectedAction === 'approve' ? 'Approval' : selectedAction === 'reject' ? 'Rejection' : 'Cancellation'}
                                </h5>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to <b>{selectedAction}</b> this booking request from <b>{booking?.user?.name || 'this customer'}</b>?
                            </div>
                            <div className="modal-footer">
                                <button 
                                    className={`btn ${selectedAction === 'approve' ? '' : selectedAction === 'reject' ? 'btn-danger' : 'btn-secondary'}`} 
                                    style={selectedAction === 'approve' ? { backgroundColor: primaryPurple, color: 'white' } : {}}
                                    onMouseEnter={(e) => { if (selectedAction === 'approve') e.currentTarget.style.backgroundColor = darkPurple; }}
                                    onMouseLeave={(e) => { if (selectedAction === 'approve') e.currentTarget.style.backgroundColor = primaryPurple; }}
                                    onClick={confirmStatusUpdate}
                                >
                                    Yes, {selectedAction === 'approve' ? 'Approve' : selectedAction === 'reject' ? 'Reject' : 'Cancel'}
                                </button>
                                <button className="btn btn-outline-secondary" onClick={cancelConfirmation}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default function ServiceDashboard() {
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [newService, setNewService] = useState({
        name: '',
        type: '',
        description: '',
        price: '',
        images: ''
    });
    const [tab, setTab] = useState('services');
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const API_BASE = 'http://localhost:5000';

    const fetchServices = async () => {
        console.log('fetchServices called'); // Debugging log
        try {
            const { data } = await axios.get(`${API_BASE}/api/services/my-services`, config);
            setServices(data);
            console.log('Services fetched and set:', data); // Debugging log
        } catch (e) {
            console.error('Error fetching services:', e);
            alert('Failed to load services');
        }
    };

    const fetchBookings = async () => {
        console.log('fetchBookings called'); // Debugging log
        try {
            const { data } = await axios.get(`${API_BASE}/api/services/my-bookings`, config);
            setBookings(data);
            console.log('Bookings fetched and set:', data); // Debugging log
        } catch (e) {
            console.error('Error fetching bookings:', e);
            alert('Failed to load bookings');
        }
    };

    useEffect(() => {
        fetchServices();
        fetchBookings();
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment');
        const bookingId = urlParams.get('bookingId');

        if (paymentStatus && bookingId) {
            if (paymentStatus === 'success') {
                alert('Payment successful! Your booking is now confirmed.');
                fetchBookings();
            } else if (paymentStatus === 'cancelled') {
                alert('Payment cancelled. Please try again.');
            }
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleChange = e => setNewService({ ...newService, [e.target.name]: e.target.value });

    const submitService = async e => {
        e.preventDefault();
        try {
            const payload = {
                name: newService.name,
                type: newService.type,
                description: newService.description,
                price: Number(newService.price),
                images: newService.images ? newService.images.split(',').map(img => img.trim()) : []
            };

            if (editMode) {
                console.log('Updating service:', editingId, payload); // Debugging log
                await axios.put(`${API_BASE}/api/services/${editingId}`, payload, config);
            } else {
                console.log('Adding new service:', payload); // Debugging log
                await axios.post(`${API_BASE}/api/services/add`, payload, config);
            }
            fetchServices(); // Re-fetch services to update UI
            setNewService({ name: '', type: '', description: '', price: '', images: '' });
            setEditMode(false);
            setEditingId(null);
            setTab('services');
        } catch (err) {
            console.error('Error saving service:', err.response?.data || err);
            alert(err.response?.data?.msg || 'Error saving service');
        }
    };

    const deleteService = async id => {
        if (!window.confirm('Delete this service?')) return;
        try {
            await axios.delete(`${API_BASE}/api/services/${id}`, config);
            fetchServices();
        } catch (err) {
            console.error('Error deleting service:', err);
            alert(err.response?.data?.msg || 'Cannot delete');
        }
    };

    const editService = s => {
        setEditMode(true);
        setEditingId(s._id);
        setNewService({
            name: s.name,
            type: s.type,
            description: s.description,
            price: s.price,
            images: s.images?.join(',') || ''
        });
        setTab('add');
    };

    const handleBookingStatusUpdate = (bookingId, newStatus) => {
        setBookings(prev =>
            prev.map(booking =>
                booking._id === bookingId
                    ? { ...booking, status: newStatus }
                    : booking
            )
        );
        // Re-fetch bookings only if status changes to something that might affect the list view (e.g., Confirmed, Rejected, Cancelled)
        // Or simply refetch all to ensure data consistency
        fetchBookings();
    };

    return (
        <div className="container py-4">
            <h1 className="mb-4 fw-bold text-center" style={{ color: primaryPurple }}>Service Provider Dashboard</h1>
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button 
                        className={`nav-link ${tab === 'services' ? 'active' : ''}`} 
                        style={tab === 'services' ? { color: primaryPurple, borderColor: `${primaryPurple} ${primaryPurple} #fff`, background: '#fff' } : {}}
                        onMouseEnter={(e) => { if (tab !== 'services') e.currentTarget.style.color = darkPurple; }}
                        onMouseLeave={(e) => { if (tab !== 'services') e.currentTarget.style.color = '#0d6efd'; /* Default Bootstrap blue if not active */ }}
                        onClick={() => setTab('services')}
                    >
                        Your Services
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${tab === 'bookings' ? 'active' : ''}`} 
                        style={tab === 'bookings' ? { color: primaryPurple, borderColor: `${primaryPurple} ${primaryPurple} #fff`, background: '#fff' } : {}}
                        onMouseEnter={(e) => { if (tab !== 'bookings') e.currentTarget.style.color = darkPurple; }}
                        onMouseLeave={(e) => { if (tab !== 'bookings') e.currentTarget.style.color = '#0d6efd'; /* Default Bootstrap blue if not active */ }}
                        onClick={() => setTab('bookings')}
                    >
                        Bookings <span className="badge bg-secondary ms-1">{bookings.length}</span>
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${tab === 'add' ? 'active' : ''}`} 
                        style={tab === 'add' ? { color: primaryPurple, borderColor: `${primaryPurple} ${primaryPurple} #fff`, background: '#fff' } : {}}
                        onMouseEnter={(e) => { if (tab !== 'add') e.currentTarget.style.color = darkPurple; }}
                        onMouseLeave={(e) => { if (tab !== 'add') e.currentTarget.style.color = '#0d6efd'; /* Default Bootstrap blue if not active */ }}
                        onClick={() => {
                            setTab('add'); 
                            setEditMode(false);
                            setNewService({ name: '', type: '', description: '', price: '', images: '' });
                        }}
                    >
                        {editMode ? 'Edit Service' : 'Add Service'}
                    </button>
                </li>
            </ul>

            {tab === 'services' && (
                <div className="row">
                    {services.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <h4 className="text-muted mb-3">No services added yet.</h4>
                            <p className="text-secondary">Start by adding your first service to expand your offerings!</p>
                            <button className="btn mt-3" style={{ backgroundColor: primaryPurple, color: 'white' }} 
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkPurple}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryPurple}
                                onClick={() => { setNewService({ name: '', type: '', description: '', price: '', images: '' }); setTab('add'); }}>
                                <i className="bi bi-plus-circle me-2"></i> Add New Service
                            </button>
                        </div>
                    ) : (
                        services.map(s => (
                            <div className="col-md-4 mb-4" key={s._id}>
                                <div className="card h-100 shadow-sm border-0">
                                    <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '180px', overflow: 'hidden' }}>

                                        {console.log(`Rendering image for service ${s._id}:`, s.images && s.images.length > 0 ? `${s.images[0]}?t=${new Date().getTime()}` : 'No image')}
                                        {s.images && s.images.length > 0
                                            ? <img
                                                src={`${s.images[0]}?t=${new Date().getTime()}`} // Cache-busting: append timestamp
                                                alt={s.name}
                                                className="img-fluid"
                                                style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                            />
                                            : <span className="text-muted" style={{ fontSize: '4rem' }}>🖼️</span>
                                        }
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title text-truncate">{s.name}</h5>
                                        <span className="badge  text-dark mb-2 py-2 px-3 rounded-pill" style= {{ background:primaryPurple}}>{s.type}</span>
                                        <p className="card-text text-muted mb-2 text-truncate-3-lines" style={{ fontSize: '0.9rem' }}>{s.description || 'No description provided.'}</p>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="badge bg-success py-2 px-3 rounded-pill">
                                                <i className="bi bi-currency-dollar me-1"></i> Price: Rs. {s.price}
                                            </span>
                                        </div>
                                        <div className="mt-auto d-grid gap-2">
                                            <button 
                                                className="btn" 
                                                style={{ backgroundColor: primaryPurple, color: 'white' }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkPurple}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryPurple}
                                                onClick={() => editService(s)}
                                            >
                                                <i className="bi bi-pencil-fill me-2"></i> Edit
                                            </button>
                                            <button className="btn btn-outline-danger" onClick={() => deleteService(s._id)}>
                                                <i className="bi bi-trash-fill me-2"></i> Delete
                                            </button>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {tab === 'bookings' && (
                <div className="py-3">
                    <h2 className="mb-4 fw-bold" style={{ color: primaryPurple }}>Service Booking Requests</h2>
                    {bookings.length === 0 ? (
                        <div className="text-center py-5 border rounded-lg bg-light text-muted">
                            <i className="bi bi-inbox-fill display-4 mb-3" style={{ color: primaryPurple }}></i>
                            <h4 className="mb-2">No Service Booking Requests Found</h4>
                            <p className="lead">Customers haven't booked any of your services yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {bookings.map(b => (
                                <div className="col" key={b._id}>
                                    <BookingApprovalCard
                                        booking={b}
                                        onStatusUpdate={handleBookingStatusUpdate}
                                        token={token}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {tab === 'add' && (
                <form onSubmit={submitService} className="p-4 border rounded-lg shadow-sm bg-white">
                    <h2 className="mb-4" style={{ color: primaryPurple }}>{editMode ? 'Edit Service Details' : 'Add a New Service'}</h2>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="name" className="form-label">Service Name</label>
                            <input name="name" id="name" className="form-control" placeholder="e.g., Wedding Photography" value={newService.name} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="type" className="form-label">Type</label>
                            <input name="type" id="type" className="form-control" placeholder="e.g., Photography, Catering" value={newService.type} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="price" className="form-label">Price (Rs.)</label>
                            <input name="price" id="price" type="number" className="form-control" placeholder="e.g., 25000" value={newService.price} onChange={handleChange} required />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea name="description" id="description" className="form-control" placeholder="Detailed description of your service." rows="3" value={newService.description} onChange={handleChange} />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="images" className="form-label">Image URLs (comma separated)</label>
                            <input name="images" id="images" className="form-control" placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" value={newService.images} onChange={handleChange} />
                        </div>
                        <div className="col-md-12 text-end">
                            <button type="button" className="btn btn-secondary me-2" onClick={() => {
                                setNewService({ name: '', type: '', description: '', price: '', images: '' });
                                setEditMode(false);
                                setEditingId(null);
                            }}>
                                {editMode ? 'Cancel Edit' : 'Clear Form'}
                            </button>
                            <button 
                                type="submit" 
                                className="btn" 
                                style={{ backgroundColor: primaryPurple, color: 'white' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkPurple}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryPurple}
                            >
                                {editMode ? <><i className="bi bi-save me-2"></i> Update Service</> : <><i className="bi bi-plus-circle me-2"></i> Add Service</>}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}