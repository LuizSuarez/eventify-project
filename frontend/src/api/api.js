import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'https://eventify-project-production.up.railway.app';
if (!apiUrl) {
  console.error('VITE_API_URL is not defined. Falling back to default URL.');
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