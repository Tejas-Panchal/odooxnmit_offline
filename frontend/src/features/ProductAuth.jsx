import axios from "axios";

export const CreateProduct = async (name, type, salesPrice, category, purchasePrice, hsn, salesTax, purchaseTax) => {
    try {
        const response = await axios.post("http://localhost:5000/api/create_product", { name, type, hsn,  category,salesPrice,salesTax,  purchasePrice, purchaseTax },{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        return response.data;
    } catch (error) {
        throw error;
    }   
};

export const GetHSNs = async (name) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/get_hsn_code?inputText=${name}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetProducts = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/get_products", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });      
        return response.data;
    } catch (error) {
        throw error;
    }
};
