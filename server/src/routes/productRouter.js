import express from 'express'
import productController from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/create-product', productController.createProduct);
productRouter.put('/update-product/:id', productController.updateProduct);
productRouter.delete('/delete-product/:id', productController.deleteProduct)
productRouter.get('/all-products', productController.getAllProduct);
productRouter.get('/details-product/:id', productController.getDetailsProduct);
productRouter.get('/all-type-product',  productController.getAllTypeProduct);



export default productRouter