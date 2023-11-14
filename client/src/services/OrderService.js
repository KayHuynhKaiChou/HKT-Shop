import axios from 'axios';
import { config } from '.';
const API_URL = import.meta.env.VITE_API_URL

export const createOrder = async (data) => {
    const res = await axios.post(`${API_URL}/order/create-order`,data , config);
    return res.data
}

export const getAllOrder = async () => {
    const res = await axios.get(`${API_URL}/order/get-all-order` , config);
    return res.data
}

export const getAllOrderByUser = async (idUser) => {
    const res = await axios.get(`${API_URL}/order/get-all-order/${idUser}` , config);
    return res.data
}

export const getOrderDetails = async (idOrder) => {
    const res = await axios.get(`${API_URL}/order/get-order-details/${idOrder}` , config);
    return res.data
}

export const cancelOrder = async (data ,idOrder) => {
    const res = await axios.put(`${API_URL}/order/cancel-order/${idOrder}`,data , config);
    return res.data
}

export const approveOrder = async (data ) => {
    const res = await axios.put(`${API_URL}/order/approve-order`,data , config);
    return res.data
}

