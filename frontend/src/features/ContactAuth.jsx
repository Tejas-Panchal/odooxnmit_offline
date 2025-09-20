import axios from "axios";

export const CreateContact = async (name, email, phone, address, type) => {
    console.log(type)
    console.log(name)
    try {
        const response = await axios.post("http://localhost:5000/contact/contacts", { name, email, phone, address, type },{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        return response.data;
    } catch (error) {
        throw error;
    } 
};

export const GetContacts = async () => {
    try {
        const response = await axios.get("http://localhost:5000/contact/contacts", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        return response.data;
    } catch (error) {
        throw error;
    }
};
