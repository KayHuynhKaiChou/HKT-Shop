import express from 'express';
import orderController from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/create-order', orderController.createOrder);
orderRouter.get('/get-order', orderController.getAllOrders);
orderRouter.get('/get-all-order', orderController.getAllOrderByUser);
orderRouter.get('/get-order-details/:id', orderController.getOrderDetails);
orderRouter.put('/status-order/:id', orderController.changeStatusOrder);
orderRouter.delete('/cancel-order/:id', orderController.cancelOrder);



export default orderRouter