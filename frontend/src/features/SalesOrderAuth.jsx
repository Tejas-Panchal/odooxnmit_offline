import axios from "axios";

export const GetSalesOrders = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/sales-orders", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        return response.data;
    } catch (error) {
        console.error("Error fetching sales orders:", error);
        throw error;
    }
};


export const CreateSalesOrder = async (customerId, order_Date, status) => {
    try {
        const response = await axios.post("http://localhost:5000/api/sales-orders", { customerId, order_Date, status }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        return response.data;
    } catch (error) {
        console.error("Error creating sales order:", error);
        throw error;
    }   
};
