import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (payload) => {
  const response = await axios.post(`${API_URL}/api/auth/signup`, payload);
  return response.data;
};


export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
  return response.data;
};

export const fetchVenues = async () => {
  const response = await axios.get(`${API_URL}/api/venues`);
  return response.data;
};


