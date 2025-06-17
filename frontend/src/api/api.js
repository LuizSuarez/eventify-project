import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = (data) => API.post('/api/auth/signup', data);
export const loginUser = (credentials) => API.post('/api/auth/login', credentials);

export const fetchVenues = () => API.get('/api/venues');
