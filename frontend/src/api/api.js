import axios from 'axios';

let apiUrl = 'https://eventify-project-production.up.railway.app';

// Use VITE_API_URL only if defined (typically during development or build time)
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
  apiUrl = import.meta.env.VITE_API_URL;
} else {
  console.warn('VITE_API_URL not found. Falling back to default production URL.');
}

const API = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = (data) => API.post('/api/auth/signup', data);
export const loginUser = (credentials) => API.post('/api/auth/login', credentials);
export const fetchVenues = () => API.get('/api/venues');
export const fetchVenueById = (id) => API.get(`/api/venues/${id}`);
export const fetchUserProfile = (userId) => API.get(`/api/users/${userId}`);
export const updateUserProfile = (userId, data) => API.put(`/api/users/${userId}`, data, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}); 