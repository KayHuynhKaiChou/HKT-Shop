import axios from 'axios';
import { config } from '.';
const API_URL = import.meta.env.VITE_API_URL

export const createVoucher = async (data) => {
    const res = await axios.post(`${API_URL}/voucher/create-voucher`,data, config);
    return res.data
}

export const updateVoucher = async (idVou , data) => {
    const res = await axios.put(`${API_URL}/voucher/update-voucher/${idVou}`,data , config);
    return res.data
}

export const getAllVoucher = async () => {
    const res = await axios.get(`${API_URL}/voucher/get-all-voucher`);
    return res.data
}

export const getVoucherByUser = async (idUser) => {
    const res = await axios.get(`${API_URL}/voucher/get-voucher-by-user/${idUser}` , config);
    return res.data
}

export const getVoucherById = async (idVou) => {
    const res = await axios.get(`${API_URL}/voucher/get-voucher/${idVou}`);
    return res.data
}

export const decreaseQuantityVoucher = async (idVou) => {
    const res = await axios.put(`${API_URL}/voucher/decrease-quantity-voucher/${idVou}` , config);
    return res.data
}


