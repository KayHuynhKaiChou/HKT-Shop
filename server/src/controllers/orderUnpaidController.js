import { addOrderUnpaid, getOrderUnpaidByUser, updateOrderUnpaid } from "../services/orderUnpaidService.js";


class orderUnpaidController {

    getOrderUnpaidByUser = async ( req, res) => {
        try {
            const response = await getOrderUnpaidByUser(req.userId);
            if(response.status === 400){
                return res.status(400).json(response) 
            }else{
                return res.status(200).json(response)
            }
        } catch (error) {
            return res.status(500).json({
                timestamp : new Date(),
                status : 500,
                error : "Internal Server Error",
                message : error
            })
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
            const response = await updateOrderUnpaid(req.userId , req.body);
            if(response.status === 400){
                return res.status(400).json(response) 
            }else{
                return res.status(200).json(response)
            }        
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

export default new orderUnpaidController