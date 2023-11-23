import { cancelOrder, changeStatusOrder, createOrder, getAllOrderByUser, getAllOrders, getOrderDetails } from "../services/orderService.js"


class orderController {
    createOrder = async (req,res) => {
        try {
            const response = await createOrder(req.userId , req.body);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                status : "ERR",
                msg : error
            })
        }
    }

    getAllOrders = async ( req, res) => {
        try {
            const response = await getAllOrders();
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    getAllOrderByUser = async (req, res) => {
        try {
            const response = await getAllOrderByUser(req.userId);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    getOrderDetails = async ( req, res) => {
        try {
            const response = await getOrderDetails(req.params.id);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    changeStatusOrder = async( req, res) => {
        const {status} = req.query
        try {
            const response = await changeStatusOrder(status , req.params.id);
            return res.status(200).json(response)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    cancelOrder = async( req, res) => {
        try {
            const response = await cancelOrder(req.params.id);
            return res.status(200).json(response)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

export default new orderController