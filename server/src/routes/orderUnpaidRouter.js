import express from 'express';
import orderUnpaidController from '../controllers/orderUnpaidController.js';

const orderUnpaidRouter = express.Router();

orderUnpaidRouter.get('/get-order-unpaid-user/:id', orderUnpaidController.getOrderUnpaidByUser);
orderUnpaidRouter.post('/add-order-unpaid', orderUnpaidController.addOrderUnpaid);
orderUnpaidRouter.put('/update-order-unpaid/:id', orderUnpaidController.updateOrderUnpaid);

export default orderUnpaidRouter