import { createProduct, deleteProduct, getAllProduct, getAllTypeProduct, getDetailsProduct, updateProduct } from "../services/productService.js"

class productController {

    getAllProduct = async (req,res) => {
        const { limit, page, sort, filter } = req.query
        const response = await getAllProduct(Number(limit) || null, Number(page) || 0, sort, filter);
        return res.status(200).json(response);
    }

    getDetailsProduct = async (req,res) => {
        const response = await getDetailsProduct(req.params.id);
        return res.status(200).json(response)
    }

    getAllTypeProduct = async ( req, res) => {
        const response = await getAllTypeProduct();
        return res.status(200).json(response)
    }

    createProduct = async (req,res) => {
        try {
            const response = await createProduct(req.body);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(401).json(error);
        }
    }

    updateProduct = async (req,res) => {
        try {
            const response = await updateProduct(req.params.id , req.body);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(401).json(error);
        }
    }

    deleteProduct = async (req,res) => {
        try{
            const response = await deleteProduct(req.params.id);
            return res.status(200).json(response);
        }catch(error){
            return res.status(400).json(error);
        }
    }
}

export default new productController