import { approveOrder, cancelOrder, createOrder, getAllOrderByUser, getAllOrders, getOrderDetails } from "../services/orderService.js"


class orderController {
    createOrder = async (req,res) => {
        try {
            const response = await createOrder(req.body);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(401).json({
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

    getAllOrderByUser = async ( req, res) => {
        try {
            const response = await getAllOrderByUser(req.params.id);
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

    cancelOrder = async( req, res) => {
        try {
            const response = await cancelOrder(req.body , req.params.id);
            return res.status(200).json(response)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    approveOrder = async (req, res) => {
        try {
            const response = await approveOrder(req.body);
            return res.status(200).json(response)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

export default new orderController