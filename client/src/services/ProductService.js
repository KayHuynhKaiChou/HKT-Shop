import axios from "axios"
import { config } from "."
const API_URL = import.meta.env.VITE_API_URL


export const getAllProduct = async (search,limit) => {
    let res = {}
    if (search) {
        res = await axios.get(`${API_URL}/product/all-products?filter=name&filter=${search}&limit=${limit}`)
    } else {
        res = await axios.get(`${API_URL}/product/all-products?limit=${limit}`)
    }
    return res.data
}

export const getDetailsProduct = async (idProduct) => {
    const res = await axios.get(`${API_URL}/product/details-product/${idProduct}`);
    return res.data
}

export const getAllTypeProduct = async () => {
    const res = await axios.get(`${API_URL}/product/all-type-product`);
    return res.data
}

export const getProductsByType = async (type, page, limit) => {
    console.log("type: ",`${type}`)
    if (type) {
        const res = await axios.get(`${API_URL}/product/all-products?filter=type&filter=${type}&page=${page}&limit=${limit}`);
        return res.data
    } 
}

export const createProduct = async (data) => {
    const res = await axios.post(`${API_URL}/product/create-product`,data , config)
    return res.data
}

export const updateProduct = async (idProduct , data) => {
    const res = await axios.put(`${API_URL}/product/update-product/${idProduct}`,data , config)
    return res.data
}

export const deleteProduct = async (idProduct) => {
    const res = await axios.delete(`${API_URL}/product/delete-product/${idProduct}` , config)
    return res.data
}