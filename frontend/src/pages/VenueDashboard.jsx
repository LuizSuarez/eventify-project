
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const BookingApprovalCard = ({ booking, onStatusUpdate, token }) => {
//     const [isUpdating, setIsUpdating] = useState(false);
//     const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//     const [selectedAction, setSelectedAction] = useState(null);

//     if (!booking) {
//         return (
//             <div className="card mb-4">
//                 <div className="card-body text-center text-muted">Loading booking details...</div>
//             </div>
//         );
//     }

//     const handleStatusUpdate = (action) => {
//         setSelectedAction(action);
//         setShowConfirmDialog(true);
//     };

//     const confirmStatusUpdate = async () => {
//         if (!selectedAction) return;
//         setIsUpdating(true);
//         setShowConfirmDialog(false);

//         try {
//             const response = await fetch(
//                 `http://localhost:5000/api/bookings/${booking._id}/status`,
//                 {
//                     method: 'PUT',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${token}`
//                     },
//                     body: JSON.stringify({ action: selectedAction })
//                 }
//             );

//             if (response.ok) {
//                 if (onStatusUpdate) {
//                     onStatusUpdate(
//                         booking._id,
//                         selectedAction === 'approve'
//                             ? 'Approved'
//                             : selectedAction === 'reject'
//                             ? 'Rejected'
//                             : 'Cancelled'
//                     );
//                 }
//             } else {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Failed to update booking status');
//             }
//         } catch (error) {
//             alert(error.message);
//         } finally {
//             setIsUpdating(false);
//             setSelectedAction(null);
//         }
//     };

//     const cancelConfirmation = () => {
//         setShowConfirmDialog(false);
//         setSelectedAction(null);
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
//     };

//     const getStatusBadge = (status) => {
//         let color = "secondary";
//         if (status === "Pending") color = "warning";
//         else if (status === "Approved") color = "success";
//         else if (status === "Rejected") color = "danger";
//         else if (status === "Confirmed") color = "primary";
//         else if (status === "Cancelled") color = "secondary";
//         return <span className={`badge bg-${color}`}>{status}</span>;
//     };

//     const getPaymentStatusBadge = (paymentStatus) => {
//         let color = "warning";
//         if (paymentStatus === "Paid") color = "success";
//         else if (paymentStatus === "Refunded") color = "info";
//         return <span className={`badge bg-${color} ms-2`}>{paymentStatus}</span>;
//     };

//     const isPending = booking?.status === 'Pending';
//     const isApprovedAndUnpaid = booking?.status === 'Approved' && booking?.paymentStatus === 'Unpaid';
//     const isConfirmed = booking?.status === 'Confirmed';

//     return (
//         <>
//             <div className="card mb-4 shadow-sm border-0">
//                 <div className="card-header d-flex justify-content-between align-items-center bg-light">
//                     <div>
//                         <strong>{booking?.venue?.name || 'Unknown Venue'}</strong>
//                         <div className="text-muted small">{booking?.venue?.type}</div>
//                     </div>
//                     <div>{getStatusBadge(booking?.status || 'Pending')}</div>
//                 </div>
//                 <div className="card-body">
//                     <div className="mb-3">
//                         <div><strong>Customer:</strong> {booking?.user?.name || 'Unknown'}</div>
//                         <div><strong>Email:</strong> {booking?.user?.email || 'N/A'}</div>
//                     </div>
//                     <div className="row mb-3">
//                         <div className="col-6">
//                             <div><strong>Date:</strong> {booking?.date ? formatDate(booking.date) : 'N/A'}</div>
//                             <div><strong>Guests:</strong> {booking?.numberOfGuests || 1}</div>
//                         </div>
//                         <div className="col-6">
//                             <div><strong>Requested:</strong> {booking?.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}</div>
//                             <div>
//                                 <strong>Payment:</strong>
//                                 {getPaymentStatusBadge(booking?.paymentStatus || 'Unpaid')}
//                             </div>
//                         </div>
//                     </div>
//                     {(isPending || isApprovedAndUnpaid || isConfirmed) && (
//                         <div className="d-flex gap-2 pt-2 border-top">
//                             {isPending && (
//                                 <>
//                                     <button
//                                         className="btn btn-success flex-fill"
//                                         disabled={isUpdating}
//                                         onClick={() => handleStatusUpdate('approve')}
//                                     >
//                                         {isUpdating && selectedAction === 'approve' ? 'Approving...' : 'Approve'}
//                                     </button>
//                                     <button
//                                         className="btn btn-danger flex-fill"
//                                         disabled={isUpdating}
//                                         onClick={() => handleStatusUpdate('reject')}
//                                     >
//                                         {isUpdating && selectedAction === 'reject' ? 'Rejecting...' : 'Reject'}
//                                     </button>
//                                 </>
//                             )}
//                             {(isApprovedAndUnpaid || isConfirmed) && (
//                                 <button
//                                     className="btn btn-secondary flex-fill"
//                                     disabled={isUpdating}
//                                     onClick={() => handleStatusUpdate('cancel')}
//                                 >
//                                     {isUpdating && selectedAction === 'cancel' ? 'Cancelling...' : 'Cancel Booking'}
//                                 </button>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>
//             {showConfirmDialog && (
//                 <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.4)" }}>
//                     <div className="modal-dialog modal-dialog-centered">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">
//                                     Confirm {selectedAction === 'approve' ? 'Approval' : selectedAction === 'reject' ? 'Rejection' : 'Cancellation'}
//                                 </h5>
//                             </div>
//                             <div className="modal-body">
//                                 Are you sure you want to <b>{selectedAction}</b> this booking request from <b>{booking?.user?.name || 'this customer'}</b>?
//                             </div>
//                             <div className="modal-footer">
//                                 <button className={`btn btn-${selectedAction === 'approve' ? 'success' : selectedAction === 'reject' ? 'danger' : 'secondary'}`} onClick={confirmStatusUpdate}>
//                                     Yes, {selectedAction === 'approve' ? 'Approve' : selectedAction === 'reject' ? 'Reject' : 'Cancel'}
//                                 </button>
//                                 <button className="btn btn-outline-secondary" onClick={cancelConfirmation}>Cancel</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };


// export default function VenueDashboard() {
//   const [venues, setVenues] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [newVenue, setNewVenue] = useState({
//     name: '',
//     location: '',
//     capacity: '',
//     price: '',
//     description: '',
//     images: ''
//   });
//   const [tab, setTab] = useState('venues');
//   const [editMode, setEditMode] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const token = localStorage.getItem('token');

//   const API_BASE = 'http://localhost:5000';

//   const fetchVenues = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/api/venues/my-venues`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       setVenues(data.data || data);
//     } catch (err) {
//       console.error('Error fetching venues:', err);
//       alert('Failed to load venues');
//     }
//   };

//   const fetchBookings = async () => {
//     try {
//       if (venues.length > 0) {
//         const venueIds = venues.map(venue => venue._id);
//         const response = await fetch(
//           `${API_BASE}/api/bookings?venues=${JSON.stringify(venueIds)}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         setBookings(data.data || data);
//       }
//     } catch (err) {
//       console.error('Error fetching bookings:', err);
//       alert('Failed to load bookings');
//     }
//   };

//   useEffect(() => {
//     fetchVenues();
//   }, []);

//   useEffect(() => {
//     if (venues.length > 0) {
//       fetchBookings();
//     }
//   }, [venues]);

//   const handleChange = e => setNewVenue({ ...newVenue, [e.target.name]: e.target.value });

//   const submitVenue = async e => {
//     e.preventDefault();
//     try {
//       const payload = {
//         ...newVenue,
//         capacity: Number(newVenue.capacity),
//         price: Number(newVenue.price),
//         images: newVenue.images ? newVenue.images.split(',').map(img => img.trim()) : []
//       };

//       const url = editMode
//         ? `${API_BASE}/api/venues/${editingId}`
//         : `${API_BASE}/api/venues`;

//       const response = await fetch(url, {
//         method: editMode ? 'PUT' : 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       if (response.ok) {
//         fetchVenues();
//         resetForm();
//         setTab('venues');
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to save venue');
//       }
//     } catch (err) {
//       console.error('Error saving venue:', err);
//       alert(err.message);
//     }
//   };

//   const deleteVenue = async id => {
//     if (!window.confirm('Are you sure you want to delete this venue?')) return;
//     try {
//       const response = await fetch(`${API_BASE}/api/venues/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.ok) {
//         fetchVenues();
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Cannot delete venue');
//       }
//     } catch (err) {
//       console.error('Error deleting venue:', err);
//       alert(err.message);
//     }
//   };

//   const editVenue = venue => {
//     setEditMode(true);
//     setEditingId(venue._id);
//     setNewVenue({
//       name: venue.name,
//       location: venue.location,
//       capacity: venue.capacity,
//       price: venue.price,
//       description: venue.description,
//       images: venue.images?.join(', ') || ''
//     });
//     setTab('add');
//   };

//   const resetForm = () => {
//     setNewVenue({
//       name: '',
//       location: '',
//       capacity: '',
//       price: '',
//       description: '',
//       images: ''
//     });
//     setEditMode(false);
//     setEditingId(null);
//   };

//   const handleBookingStatusUpdate = (bookingId, newStatus) => {
//     setBookings(prev =>
//       prev.map(booking =>
//         booking._id === bookingId
//           ? { ...booking, status: newStatus }
//           : booking
//       )
//     );
//   };

//   return (
//     <div className="container py-4">
//       <h1 className="mb-4 text-primary fw-bold text-center" style={{ color: "#a259ff" }}>Venue Owner Dashboard</h1>

//       <ul className="nav nav-tabs mb-4">
//         <li className="nav-item">
//           <button
//             className={`nav-link ${tab === 'venues' ? 'active' : ''}`}
//             onClick={() => setTab('venues')}
//           >
//             Your Venues
//           </button>
//         </li>
//         <li className="nav-item">
//           <button
//             className={`nav-link ${tab === 'bookings' ? 'active' : ''}`}
//             onClick={() => setTab('bookings')}
//           >
//             Bookings <span className="badge bg-secondary ms-1">{bookings.length}</span>
//           </button>
//         </li>
//         <li className="nav-item">
//           <button
//             className={`nav-link ${tab === 'add' ? 'active' : ''}`}
//             onClick={() => {
//               resetForm();
//               setTab('add');
//             }}
//           >
//             {editMode ? 'Edit Venue' : 'Add Venue'}
//           </button>
//         </li>
//       </ul>

//      {tab === 'venues' && (
//   <div className="row">
//     {venues.length === 0 ? (
//       <div className="col-12 text-center py-5">
//         <h4 className="text-muted mb-3">No venues added yet.</h4>
//         <p className="text-secondary">Start by adding your first venue to expand your offerings!</p>
//         <button className="btn btn-primary mt-3" onClick={() => { resetForm(); setTab('add'); }}>
//           <i className="bi bi-plus-circle me-2"></i> Add New Venue
//         </button>
//       </div>
//     ) : (
//       venues.map(venue => (
//         <div className="col-md-4 mb-4" key={venue._id}>
//           <div className="card h-100 shadow-sm border-0">
//             <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '180px', overflow: 'hidden' }}>

//               {venue.images && venue.images.length > 0 && venue.images[0] ? (
//                 <img
//                   src={venue.images[0]}
//                   alt={venue.name}
//                   className="img-fluid"
//                   style={{ objectFit: 'cover', height: '100%', width: '100%' }}
//                 />
//               ) : (
//                 <span className="text-muted" style={{ fontSize: '4rem' }}>🏛️</span>
//               )}
//             </div>
//             <div className="card-body d-flex flex-column">
//               <h5 className="card-title text-truncate">{venue.name}</h5>
//               <p className="card-text text-muted mb-2"><i className="bi bi-geo-alt-fill me-1"></i> {venue.location}</p>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <span className="badge bg-info text-dark py-2 px-3 rounded-pill">
//                   <i className="bi bi-people-fill me-1"></i> Capacity: {venue.capacity}
//                 </span>
//                 <span className="badge bg-success py-2 px-3 rounded-pill">
//                   <i className="bi bi-currency-dollar me-1"></i> Price: Rs. {venue.price}
//                 </span>
//               </div>
//               <p className="card-text text-truncate-3-lines mb-3" style={{ fontSize: '0.9rem' }}>{venue.description || 'No description provided.'}</p>
//               <div className="mt-auto d-grid gap-2">
//                 <button
//                   className="btn btn-outline-primary"
//                   onClick={() => editVenue(venue)}
//                 >
//                   <i className="bi bi-pencil-fill me-2"></i> Edit
//                 </button>
//                 <button
//                   className="btn btn-outline-danger"
//                   onClick={() => deleteVenue(venue._id)}
//                 >
//                   <i className="bi bi-trash-fill me-2"></i> Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))
//     )}
//   </div>
// )}

//       {tab === 'bookings' && (
//         <div className="py-3"> 
//           <h2 className="mb-4 text-secondary fw-bold">Venue Booking Requests</h2>
//           {bookings.length === 0 ? (
//             <div className="text-center py-5 border rounded-lg bg-light text-muted">
//               <i className="bi bi-inbox-fill display-4 mb-3 text-info"></i>
//               <h4 className="mb-2">No Booking Requests Found</h4>
//               <p className="lead">Customers haven't booked any of your venues yet. Check back soon!</p>
//             </div>
//           ) : (
//             <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"> {/* Bootstrap grid for cards */}
//               {bookings.map(booking => (
//                 <div className="col" key={booking._id}>
//                   <BookingApprovalCard
//                     booking={booking}
//                     onStatusUpdate={handleBookingStatusUpdate}
//                     token={token}
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {tab === 'add' && (
//         <form onSubmit={submitVenue} className="p-4 border rounded-lg shadow-sm bg-white">
//           <h2 className="mb-4 text-primary">{editMode ? 'Edit Venue Details' : 'Add a New Venue'}</h2>
//           <div className="row g-3">
//             <div className="col-md-6">
//               <label htmlFor="name" className="form-label">Venue Name</label>
//               <input
//                 name="name"
//                 id="name"
//                 className="form-control"
//                 placeholder="e.g., Grand Ballroom"
//                 value={newVenue.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="col-md-6">
//               <label htmlFor="location" className="form-label">Location</label>
//               <input
//                 name="location"
//                 id="location"
//                 className="form-control"
//                 placeholder="e.g., Islamabad, Pakistan"
//                 value={newVenue.location}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="col-md-6">
//               <label htmlFor="capacity" className="form-label">Capacity</label>
//               <input
//                 name="capacity"
//                 id="capacity"
//                 type="number"
//                 className="form-control"
//                 placeholder="e.g., 500"
//                 value={newVenue.capacity}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="col-md-6">
//               <label htmlFor="price" className="form-label">Price (Rs.)</label>
//               <input
//                 name="price"
//                 id="price"
//                 type="number"
//                 className="form-control"
//                 placeholder="e.g., 50000"
//                 value={newVenue.price}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="col-12">
//               <label htmlFor="description" className="form-label">Description</label>
//               <textarea
//                 name="description"
//                 id="description"
//                 className="form-control"
//                 placeholder="Describe your venue, its features, and ideal events."
//                 rows="4"
//                 value={newVenue.description}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="col-12">
//               <label htmlFor="images" className="form-label">Image URLs (comma separated)</label>
//               <input
//                 name="images"
//                 id="images"
//                 className="form-control"
//                 placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
//                 value={newVenue.images}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="col-12 text-end">
//               <button type="button" className="btn btn-secondary me-2" onClick={resetForm}>
//                 {editMode ? 'Cancel Edit' : 'Clear Form'}
//               </button>
//               <button type="submit" className="btn btn-success">
//                 {editMode ? <><i className="bi bi-save me-2"></i> Update Venue</> : <><i className="bi bi-plus-circle me-2"></i> Add Venue</>}
//               </button>
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }




import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingApprovalCard = ({ booking, onStatusUpdate, token }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);

    // Define colors for consistency
    const purpleColor = '#a259ff';
    const darkPurpleColor = '#8c4ad0'; // Slightly darker for hover
    const blackColor = '#000000';
    const darkBlackColor = '#333333'; // Slightly lighter black for hover

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
        let backgroundColor = "secondary"; // Default Bootstrap secondary
        let textColor = "white";

        if (status === "Pending") {
            backgroundColor = "warning";
            textColor = "dark";
        }
        else if (status === "Approved") {
            backgroundColor = "success";
            textColor = "white";
        }
        else if (status === "Rejected") {
            backgroundColor = "danger";
            textColor = "white";
        }
        else if (status === "Confirmed") {
            backgroundColor = purpleColor; // Inline style
            textColor = "white";
            return <span className="badge" style={{backgroundColor: purpleColor, color: textColor}}>{status}</span>;
        }
        else if (status === "Cancelled") {
            backgroundColor = "secondary";
            textColor = "white";
        }
        return <span className={`badge bg-${backgroundColor} text-${textColor}`}>{status}</span>;
    };

    const getPaymentStatusBadge = (paymentStatus) => {
        let backgroundColor = "warning";
        let textColor = "dark";
        if (paymentStatus === "Paid") {
            backgroundColor = "success";
            textColor = "white";
        }
        else if (paymentStatus === "Refunded") {
            backgroundColor = "info";
            textColor = "white";
        }
        return <span className={`badge bg-${backgroundColor} text-${textColor} ms-2`}>{paymentStatus}</span>;
    };

    const isPending = booking?.status === 'Pending';
    const isApprovedAndUnpaid = booking?.status === 'Approved' && booking?.paymentStatus === 'Unpaid';
    const isConfirmed = booking?.status === 'Confirmed';

    return (
        <>
            <div className="card mb-4 shadow-sm border-0">
                <div className="card-header d-flex justify-content-between align-items-center bg-light">
                    <div>
                        <strong>{booking?.venue?.name || 'Unknown Venue'}</strong>
                        <div className="text-muted small">{booking?.venue?.type}</div>
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
                            <div>
                                <strong>Requested:</strong> {booking?.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}</div>
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
                                        className="btn btn-success flex-fill"
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
                                <h5 className="modal-title">
                                    Confirm {selectedAction === 'approve' ? 'Approval' : selectedAction === 'reject' ? 'Rejection' : 'Cancellation'}
                                </h5>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to <b>{selectedAction}</b> this booking request from <b>{booking?.user?.name || 'this customer'}</b>?
                            </div>
                            <div className="modal-footer">
                                <button className={`btn btn-${selectedAction === 'approve' ? 'success' : selectedAction === 'reject' ? 'danger' : 'secondary'}`} onClick={confirmStatusUpdate}>
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


export default function VenueDashboard() {
    const [venues, setVenues] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [newVenue, setNewVenue] = useState({
        name: '',
        location: '',
        capacity: '',
        price: '',
        description: '',
        images: ''
    });
    const [tab, setTab] = useState('venues');
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Define colors for consistency
    const purpleColor = '#a259ff';
    const darkPurpleColor = '#8c4ad0'; // Slightly darker for hover
    const blackColor = '#000000';
    const darkBlackColor = '#333333'; // Slightly lighter black for hover

    const token = localStorage.getItem('token');

    const API_BASE = 'http://localhost:5000';

    const fetchVenues = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/venues/my-venues`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setVenues(data.data || data);
        } catch (err) {
            console.error('Error fetching venues:', err);
            alert('Failed to load venues');
        }
    };

    const fetchBookings = async () => {
        try {
            if (venues.length > 0) {
                const venueIds = venues.map(venue => venue._id);
                const response = await fetch(
                    `${API_BASE}/api/bookings?venues=${JSON.stringify(venueIds)}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBookings(data.data || data);
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
            alert('Failed to load bookings');
        }
    };

    useEffect(() => {
        fetchVenues();
    }, []);

    useEffect(() => {
        if (venues.length > 0) {
            fetchBookings();
        }
    }, [venues]);

    const handleChange = e => setNewVenue({ ...newVenue, [e.target.name]: e.target.value });

    const submitVenue = async e => {
        e.preventDefault();
        try {
            const payload = {
                ...newVenue,
                capacity: Number(newVenue.capacity),
                price: Number(newVenue.price),
                images: newVenue.images ? newVenue.images.split(',').map(img => img.trim()) : []
            };

            const url = editMode
                ? `${API_BASE}/api/venues/${editingId}`
                : `${API_BASE}/api/venues`;

            const response = await fetch(url, {
                method: editMode ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                fetchVenues();
                resetForm();
                setTab('venues');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save venue');
            }
        } catch (err) {
            console.error('Error saving venue:', err);
            alert(err.message);
        }
    };

    const deleteVenue = async id => {
        if (!window.confirm('Are you sure you want to delete this venue?')) return;
        try {
            const response = await fetch(`${API_BASE}/api/venues/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                fetchVenues();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Cannot delete venue');
            }
        } catch (err) {
            console.error('Error deleting venue:', err);
            alert(err.message);
        }
    };

    const editVenue = venue => {
        setEditMode(true);
        setEditingId(venue._id);
        setNewVenue({
            name: venue.name,
            location: venue.location,
            capacity: venue.capacity,
            price: venue.price,
            description: venue.description,
            images: venue.images?.join(', ') || ''
        });
        setTab('add');
    };

    const resetForm = () => {
        setNewVenue({
            name: '',
            location: '',
            capacity: '',
            price: '',
            description: '',
            images: ''
        });
        setEditMode(false);
        setEditingId(null);
    };

    const handleBookingStatusUpdate = (bookingId, newStatus) => {
        setBookings(prev =>
            prev.map(booking =>
                booking._id === bookingId
                    ? { ...booking, status: newStatus }
                    : booking
            )
        );
    };

    return (
        <div className="container py-4">
            <h1 className="mb-4 text-center fw-bold" style={{ color: purpleColor }}>Venue Owner Dashboard</h1>

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className="nav-link"
                        style={tab === 'venues' ? { color: purpleColor, borderColor: `${purpleColor} ${purpleColor} #fff`, background: '#fff' } : {}}
                        onClick={() => setTab('venues')}
                    >
                        Your Venues
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className="nav-link"
                        style={tab === 'bookings' ? { color: purpleColor, borderColor: `${purpleColor} ${purpleColor} #fff`, background: '#fff' } : {}}
                        onClick={() => setTab('bookings')}
                    >
                        Bookings <span className="badge bg-secondary ms-1">{bookings.length}</span>
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className="nav-link"
                        style={tab === 'add' ? { color: purpleColor, borderColor: `${purpleColor} ${purpleColor} #fff`, background: '#fff' } : {}}
                        onClick={() => {
                            resetForm();
                            setTab('add');
                        }}
                    >
                        {editMode ? 'Edit Venue' : 'Add Venue'}
                    </button>
                </li>
            </ul>

           {tab === 'venues' && (
                <div className="row">
                    {venues.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <h4 className="text-muted mb-3">No venues added yet.</h4>
                            <p className="text-secondary">Start by adding your first venue to expand your offerings!</p>
                            <button
                                className="btn mt-3"
                                style={{ backgroundColor: purpleColor, borderColor: purpleColor, color: 'white' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkPurpleColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = purpleColor}
                                onClick={() => { resetForm(); setTab('add'); }}
                            >
                                <i className="bi bi-plus-circle me-2"></i> Add New Venue
                            </button>
                        </div>
                    ) : (
                        venues.map(venue => (
                            <div className="col-md-4 mb-4" key={venue._id}>
                                <div className="card h-100 shadow-sm border-0">
                                    <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '180px', overflow: 'hidden' }}>

                                        {venue.images && venue.images.length > 0 && venue.images[0] ? (
                                            <img
                                                src={venue.images[0]}
                                                alt={venue.name}
                                                className="img-fluid"
                                                style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                            />
                                        ) : (
                                            <span className="text-muted" style={{ fontSize: '4rem' }}>🏛️</span>
                                        )}
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title text-truncate">{venue.name}</h5>
                                        <p className="card-text text-muted mb-2"><i className="bi bi-geo-alt-fill me-1"></i> {venue.location}</p>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="badge  text-dark py-2 px-3 rounded-pill" style={{ backgroundColor: '#a259ff' }}>
                                                <i className="bi bi-people-fill me-1"></i> Capacity: {venue.capacity}
                                            </span>
                                            <span className="badge bg-success py-2 px-3 rounded-pill">
                                                <i className="bi bi-currency-dollar me-1"></i> Price: Rs. {venue.price}
                                            </span>
                                        </div>
                                        <p className="card-text text-truncate-3-lines mb-3" style={{ fontSize: '0.9rem' }}>{venue.description || 'No description provided.'}</p>
                                        <div className="mt-auto d-grid gap-2">
                                            <button
                                                className="btn"
                                                style={{ color: purpleColor, borderColor: purpleColor, background: 'transparent' }}
                                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = purpleColor; e.currentTarget.style.color = 'white'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = purpleColor; }}
                                                onClick={() => editVenue(venue)}
                                            >
                                                <i className="bi bi-pencil-fill me-2"></i> Edit
                                            </button>
                                            <button
                                                className="btn"
                                                style={{ color: blackColor, borderColor: blackColor, background: 'transparent' }}
                                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = blackColor; e.currentTarget.style.color = 'white'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = blackColor; }}
                                                onClick={() => deleteVenue(venue._id)}
                                            >
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
                    <h2 className="mb-4 text-secondary fw-bold">Venue Booking Requests</h2>
                    {bookings.length === 0 ? (
                        <div className="text-center py-5 border rounded-lg bg-light text-muted">
                            <i className="bi bi-inbox-fill display-4 mb-3" style={{ color: purpleColor }}></i>
                            <h4 className="mb-2">No Booking Requests Found</h4>
                            <p className="lead">Customers haven't booked any of your venues yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {bookings.map(booking => (
                                <div className="col" key={booking._id}>
                                    <BookingApprovalCard
                                        booking={booking}
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
                <form onSubmit={submitVenue} className="p-4 border rounded-lg shadow-sm bg-white">
                    <h2 className="mb-4" style={{ color: purpleColor }}>{editMode ? 'Edit Venue Details' : 'Add a New Venue'}</h2>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="name" className="form-label">Venue Name</label>
                            <input
                                name="name"
                                id="name"
                                className="form-control"
                                placeholder="e.g., Grand Ballroom"
                                value={newVenue.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="location" className="form-label">Location</label>
                            <input
                                name="location"
                                id="location"
                                className="form-control"
                                placeholder="e.g., Islamabad, Pakistan"
                                value={newVenue.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="capacity" className="form-label">Capacity</label>
                            <input
                                name="capacity"
                                id="capacity"
                                type="number"
                                className="form-control"
                                placeholder="e.g., 500"
                                value={newVenue.capacity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="price" className="form-label">Price (Rs.)</label>
                            <input
                                name="price"
                                id="price"
                                type="number"
                                className="form-control"
                                placeholder="e.g., 50000"
                                value={newVenue.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-12">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                name="description"
                                id="description"
                                className="form-control"
                                placeholder="Describe your venue, its features, and ideal events."
                                rows="4"
                                value={newVenue.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-12">
                            <label htmlFor="images" className="form-label">Image URLs (comma separated)</label>
                            <input
                                name="images"
                                id="images"
                                className="form-control"
                                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                                value={newVenue.images}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-12 text-end">
                            <button type="button" className="btn btn-secondary me-2" onClick={resetForm}>
                                {editMode ? 'Cancel Edit' : 'Clear Form'}
                            </button>
                            <button
                                type="submit"
                                className="btn"
                                style={{ backgroundColor: purpleColor, borderColor: purpleColor, color: 'white' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkPurpleColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = purpleColor}
                            >
                                {editMode ? <><i className="bi bi-save me-2"></i> Update Venue</> : <><i className="bi bi-plus-circle me-2"></i> Add Venue</>}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}