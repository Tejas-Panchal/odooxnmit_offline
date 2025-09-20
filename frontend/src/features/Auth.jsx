import axios from "axios";


export const Register = async (name, email, password, loginId) => {
    try {
        const response = await axios.post("http://127.0.0.1:5000/auth/register", { name, email, password, loginId });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const Login = async (email, password) => {
    try {
        const response = await axios.post("http://127.0.0.1:5000/auth/login", { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const VerifyOtp = async (email, otp) => {
    try {
        const response = await axios.post("http://127.0.0.1:5000/auth/verify-otp", { email, otp });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const CreateUser = async (name, role, loginId, password, email) => {
    try {
        const response = await axios.post("http://127.0.0.1:5000/auth/create_user", { name, role, loginId, password, email });
        return response.data;
    } catch (error) {
        throw error;
    }
};
