import { addOrderUnpaid, getOrderUnpaidByUser, updateOrderUnpaid } from "../services/orderUnpaidService.js";


class orderUnpaidController {

    getOrderUnpaidByUser = async ( req, res) => {
        try {
            const response = await getOrderUnpaidByUser(req.params.id);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    addOrderUnpaid = async ( req, res) => {
        try {
            const response = await addOrderUnpaid(req.body);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    updateOrderUnpaid = async ( req, res) => {
        try {
            console.log("reqUserId: ",req.userId);
            const response = await updateOrderUnpaid(req.params.id , req.body);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

export default new orderUnpaidController