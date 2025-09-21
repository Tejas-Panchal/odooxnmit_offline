import axios from "axios";

export const CreateTax = async (name, computation, taxFor, value) => {
    console.log(name)
    console.log(computation)
    console.log(taxFor)
    console.log(value)
    try {
        const response = await axios.post("http://localhost:5000/api/create_tax", { name, computation, taxFor, value },{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        return response.data;
    }   catch (error) {
        console.error("Error creating tax:", error);
        throw error;
    }
};

export const GetTaxes = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/get_taxes", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }); 
        return response.data;
    } catch (error) {
        throw error;
    }
};

