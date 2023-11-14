import express from 'express';
import orderController from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/create-order', orderController.createOrder);
orderRouter.get('/get-all-order/:id', orderController.getAllOrderByUser);
orderRouter.get('/get-all-order', orderController.getAllOrders);
orderRouter.get('/get-order-details/:id', orderController.getOrderDetails);
orderRouter.put('/cancel-order/:id', orderController.cancelOrder);
orderRouter.put('/approve-order', orderController.approveOrder);



export default orderRouter