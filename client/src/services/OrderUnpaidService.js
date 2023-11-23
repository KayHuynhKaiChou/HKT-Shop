import axios from 'axios';
import { config } from '.';
const API_URL = import.meta.env.VITE_API_URL

export const addOrderUnpaid = async (data) => {
    const res = await axios.post(`${API_URL}/orderUnpaid/add-order-unpaid`,data , config);
    return res.data
}

export const getOrderUnpaidByUser = async (token) => {
    const res = await axios.get(`${API_URL}/orderUnpaid/get-order-unpaid` , {
        headers : {
            authorization : `Bearer ${token}`
        },
        withCredentials : true
    });
    return res.data
}

export const updateOrderUnpaid = async (data) => {
    const res = await axios.put(`${API_URL}/orderUnpaid/update-order-unpaid`,data , config);
    return res.data
}


