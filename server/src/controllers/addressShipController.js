import { createAddressShip, deleteAddressShip, getAllAddressShip, updateAddressShip } from "../services/addressShipServices.js";

class addressShipController {
    getAllAddressShip = async (req, res) => {
        try {
            const response = await getAllAddressShip(req.userId);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                timestamp : new Date(),
                status : 500,
                error : "Internal Server Error",
                message : error
            })
        }
    }

    createAddressShip = async (req, res) => {
        try {
            const response = await createAddressShip(req.userId , req.body);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                timestamp : new Date(),
                status : 500,
                error : "Internal Server Error",
                message : error
            })
        }
    }

    updateAddressShip = async (req, res) => {
        try {
            const response = await updateAddressShip(req.body);
            if(response.status === 400){
                return res.status(400).json(response)
            }
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                timestamp : new Date(),
                status : 500,
                error : "Internal Server Error",
                message : error
            })
        }
    }

    deleteAddressShip = async (req, res) => {
        try {
            const response = await deleteAddressShip(req.params.id);
            if(response.status === 400){
                return res.status(400).json(response)
            }
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                timestamp : new Date(),
                status : 500,
                error : "Internal Server Error",
                message : error
            })
        }
    }
}

export default new addressShipController