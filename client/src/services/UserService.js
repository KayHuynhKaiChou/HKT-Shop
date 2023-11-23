import axios from "axios"
import { config } from "."
const API_URL = import.meta.env.VITE_API_URL

export const loginUser = async (data) => {
    const res = await axios.post(`${API_URL}/user/sign-in`, data , {withCredentials:true})
    return res.data
}

export const signupUser = async (data) => {
    const res = await axios.post(`${API_URL}/user/sign-up`, data)
    return res.data
}

export const logout = async () => {
    const res = await axios.post(`${API_URL}/user/log-out`, {} , config);
    return res
}

export const refreshToken = async () => {
    const res = await axios.get(`${API_URL}/user/refresh-token` , {
        withCredentials : true
    })
    return res.data
}

export const getDetailsUser = async (token) => {
    const res = await axios.get(`${API_URL}/user/detail-user`, {
        headers : {
            authorization : `Bearer ${token}`
        },
        withCredentials : true
    })

    return res.data
}

export const getAllUsers = async () => {
    const res = await axios.get(`${API_URL}/user/all-users` , config)
    return res.data
}

export const updateUser = async (data) => {
    const res = await axios.put(`${API_URL}/user/update-user`, data, config)
    return res.data
}

export const changePassword = async (data) => {
    const res = await axios.put(`${API_URL}/user/change-password`, data, config)
    return res.data
}

export const verifyEmail = async (data) => {
    const res = await axios.post(`${API_URL}/user/verify-email`, data, config)
    return res.data
}

export const getVoucherByUser = async (id, data) => {
    const res = await axios.put(`${API_URL}/user/get-voucher-by-user/${id}`, data , config)
    return res.data
}

export const getAddressShipsByUser = async () => {
    const res = await axios.get(`${API_URL}/addressShip/get-address-ship`, config)
    return res.data
}

export const createAddressShip= async (data) => {
    const res = await axios.post(`${API_URL}/addressShip/create-address-ship`, data , config)
    return res.data
}

export const updateAddressShip= async (data) => {
    const res = await axios.put(`${API_URL}/addressShip/update-address-ship`, data , config)
    return res.data
}

export const deleteAddressShip= async (id) => {
    const res = await axios.delete(`${API_URL}/addressShip/delete-address-ship/${id}`, config)
    return res.data
}
