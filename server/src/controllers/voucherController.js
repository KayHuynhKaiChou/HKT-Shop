import { createVoucher, decreaseQuantityVoucher, getAllVoucher , getVoucherById, getVoucherByUser, updateVoucher} from "../services/voucherService.js"

class VoucherController {

    createVoucher = async(req,res) => {
        try {
            const response = await createVoucher(req.body);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json(error)
        }
    }

    updateVoucher = async(req,res) => {
        try {
            const response = await updateVoucher(req.params.id , req.body);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json(error)
        }
    }

    getAllVoucher = async(req,res) => {
        try {
            const response = await getAllVoucher();
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json(error)
        }
    }

    getVoucherByUser = async(req,res) => {
        try {
            const response = await getVoucherByUser(req.params.id);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json(error)
        }
    }

    getVoucherById = async(req,res) => {
        try {
            const response = await getVoucherById(req.params.id);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json(error)
        }
    }

    decreaseQuantityVoucher = async(req,res) => {
        try {
            const response = await decreaseQuantityVoucher(req.params.id);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}

export default new VoucherController