import axios from 'axios';
import { config } from '.';
const API_URL = import.meta.env.VITE_API_URL

export const getReports = async () => {
    const res = await axios.get(`${API_URL}/dashboard/reports`, config);
    return res.data
}

export const getStatistic = async () => {
    const res = await axios.get(`${API_URL}/dashboard/statistic`, config);
    return res.data
}