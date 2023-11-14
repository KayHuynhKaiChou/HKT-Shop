import axios from "axios";
import { config } from ".";
const API_URL = import.meta.env.VITE_API_URL

export const getConfig = async () => {
    const res = await axios.get(`${API_URL}/payment/config` , config);
    return res.data;
}