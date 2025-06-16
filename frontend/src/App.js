import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './App.css';

// Layout Components
import PrivateRoute from './components/PrivateRoute';
import PrivateLayout from './components/PrivateLayout';


// Public Pages
import HomePage from './pages/HomePage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from './pages/Unauthorized';
import VenuesPage from './pages/VenuesPage';
import VenueDetails from './pages/VenueDetails';
import ServicesPage from './pages/ServicesPage';
import ServiceDetails from './pages/ServiceDetails';

// Protected Pages
import UserDashboard from './pages/UserDashboard';
import ProviderDashboard from './pages/ServiceDashboard';
import VenueDashboard from './pages/VenueDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <Routes>

  
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/venues" element={<VenuesPage />} />
          <Route path="/venue/:id" element={<VenueDetails />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/service/:id" element={<ServiceDetails />} />

        {/* Protected routes - uses PrivateLayout (with navbar) */}
        <Route element={<PrivateLayout />}>
          {/* User Dashboard */}
          <Route
            path="/dashboard/user"
            element={
              <PrivateRoute allowedRoles={['user']}>
                <UserDashboard />
              </PrivateRoute>
            }
          />

          {/* Provider Dashboard */}
          <Route
            path="/dashboard/provider"
            element={
              <PrivateRoute allowedRoles={['provider']}>
                <ProviderDashboard />
              </PrivateRoute>
            }
          />

          {/* Venue Dashboard */}
          <Route
            path="/dashboard/venue"
            element={
              <PrivateRoute allowedRoles={['venue']}>
                <VenueDashboard />
              </PrivateRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/dashboard/admin"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* User Profile (accessible to all authenticated users) */}
          <Route
            path="/profile"
            element={
              <PrivateRoute allowedRoles={['user', 'provider', 'venue', 'admin']}>
                <UserProfile />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Catch-all route for 404 errors */}
        <Route path="*" element={
        
            <div className="container text-center py-5">
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
            </div>
   
        } />
      </Routes>
    </Router>
  );
}

export default App;