import axios from "axios";

// Base URL for backend APIs
const API_URL = "http://127.0.0.1:5000";

// --- Authentication APIs ---
export const Register = async (name, email, password, loginId) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, loginId });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const Login = async (loginId, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { loginId, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const VerifyOtp = async (email, otp) => {
    try {
        const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const CreateUser = async (name, role, loginId, password, email, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/auth/create_user`, 
            { name, role, loginId, password, email },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

// --- Contact Management APIs ---
export const CreateContact = async (name, email, phone, address, type, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/master/contacts`, 
            { name, email, phone, address, type },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        throw error;
    } 
};

export const GetContacts = async (token) => {
    try {
        const response = await axios.get(
            `${API_URL}/master/contacts`, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};