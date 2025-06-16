// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { getUserFromStorage } from '../utils/auth';

// export default function Navbar() {
//   const navigate = useNavigate();
//   const { token, user } = getUserFromStorage() || {};

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   // If not logged in, don't render navbar
//   if (!token || !user) return null;

//   // Determine dashboard path by role
//   let dashboardPath = '/';
//   if (user.role === 'user') dashboardPath = '/dashboard/user';
//   else if (user.role === 'provider') dashboardPath = '/dashboard/provider';
//   else if (user.role === 'venue') dashboardPath = '/dashboard/venue';
//   else if (user.role === 'admin') dashboardPath = '/dashboard/admin';

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
//       <div className="container">
//         {/* Brand on the left */}
//         <Link className="navbar-brand fw-bold" to="/">Eventify</Link>

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNavCentered"
//           aria-controls="navbarNavCentered"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon" />
//         </button>

//         <div className="collapse navbar-collapse" id="navbarNavCentered">
//           {/* Centered nav links */}
//           <ul className="navbar-nav mx-auto">
//             <li className="nav-item">
//               <Link className="nav-link" to={dashboardPath}>Dashboard</Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/profile">Profile</Link>
//             </li>
//           </ul>
//           {/* Right-aligned logout */}
//           <ul className="navbar-nav">
//             <li className="nav-item">
//               <button className="btn btn-outline-secondary" onClick={handleLogout}>
//                 Logout
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserFromStorage } from '../utils/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const { token, user } = getUserFromStorage() || {};

  // Only render when logged in
  if (!token || !user) return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Determine dashboard path by role
  let dashboardPath = '/';
  if (user.role === 'user') dashboardPath = '/dashboard/user';
  else if (user.role === 'provider') dashboardPath = '/dashboard/provider';
  else if (user.role === 'venue') dashboardPath = '/dashboard/venue';
  else if (user.role === 'admin') dashboardPath = '/dashboard/admin';

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container">
        {/* Brand always left */}
        <Link className="navbar-brand fw-bold" to="/">Eventify</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavCentered"
          aria-controls="navbarNavCentered"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNavCentered">
          {/* Centered links */}
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link" to={dashboardPath}>Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
          </ul>
          
        </div>
      </div>
    </nav>
  );
}
