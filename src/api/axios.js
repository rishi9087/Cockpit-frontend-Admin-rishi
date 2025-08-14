import axios from 'axios';
const url = import.meta.env.VITE_API_URL;

const getTokenAndBaseUrl = () => {
  const instituteId = localStorage.getItem("instituteId");
  const adminToken = localStorage.getItem("adminToken");
  const instituteToken = localStorage.getItem("instituteToken");

  const token = instituteId ? instituteToken : adminToken;
  const BASE_URL = instituteId ? `${url}/institute` : url;

  return { token, BASE_URL };
};




// const BASE_URL = 'http://13.235.91.167:8000/cockpit';

// GET

export const apiGet = async (endpoint) => {
  const { token, BASE_URL } = getTokenAndBaseUrl();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    // 'User-Type': userType
  };
  return await axios.get(`${BASE_URL}${endpoint}`, { headers });
};


export const apiPost = async (endpoint, data) => {
  const { token, BASE_URL } = getTokenAndBaseUrl();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    // 'User-Type': userType
  };

  if (!(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return await axios.post(`${BASE_URL}${endpoint}`, data, { headers });
};

export const apiPostNoToken = async (endpoint, data) => {
  const { BASE_URL } = getTokenAndBaseUrl();

  const headers = {
    'Content-Type': 'application/json',
  };

  if (!(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return await axios.post(`${BASE_URL}${endpoint}`, data, { headers });
};


export const apiPostUpload = async (endpoint, data) => {
  const { token, BASE_URL } = getTokenAndBaseUrl();

  const headers = {
    'Content-Type': 'multipart/form-data',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  return await axios.post(`${BASE_URL}${endpoint}`, data, { headers });
};




// PUT
export const apiPut = async (endpoint, data) => {
  const { token, BASE_URL } = getTokenAndBaseUrl();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  return await axios.put(`${BASE_URL}${endpoint}`, data, { headers });
};
// DELETE

export const apiDelete = async (endpoint, body) => {
  const { token, BASE_URL } = getTokenAndBaseUrl();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  return await axios.delete(`${BASE_URL}${endpoint}`, { headers, data: body, });
};
