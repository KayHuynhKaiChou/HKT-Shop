import { getReports, getStatistic } from "../services/dashboardServices.js";


class dashboardController {
    getReports = async ( req, res) => {
        try {
            const response = await getReports();
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    getStatistic = async ( req, res) => {
        try {
            const response = await getStatistic();
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

}

export default new dashboardController