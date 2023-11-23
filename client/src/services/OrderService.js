import axios from 'axios';
import { config } from '.';
const API_URL = import.meta.env.VITE_API_URL

export const createOrder = async (data) => {
    const res = await axios.post(`${API_URL}/order/create-order`,data , config);
    return res.data
}

export const getAllOrder = async () => {
    const res = await axios.get(`${API_URL}/order/get-order` , config);
    return res.data
}

export const getAllOrderByUser = async () => {
    const res = await axios.get(`${API_URL}/order/get-all-order` , config);
    return res.data
}

export const getOrderDetails = async (idOrder) => {
    const res = await axios.get(`${API_URL}/order/get-order-details/${idOrder}` , config);
    return res.data
}

export const changeStatusOrder = async (data ,idOrder) => {
    const res = await axios.put(`${API_URL}/order/status-order/${idOrder}?status=${data}` , {} ,config);
    return res.data
}

export const cancelOrder = async (idOrder) => {
    const res = await axios.delete(`${API_URL}/order/cancel-order/${idOrder}` , config);
    return res.data
}

