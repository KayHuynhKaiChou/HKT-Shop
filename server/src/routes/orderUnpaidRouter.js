import express from 'express';
import orderUnpaidController from '../controllers/orderUnpaidController.js';

const orderUnpaidRouter = express.Router();

orderUnpaidRouter.get('/get-order-unpaid', orderUnpaidController.getOrderUnpaidByUser);
orderUnpaidRouter.post('/add-order-unpaid', orderUnpaidController.addOrderUnpaid);
orderUnpaidRouter.put('/update-order-unpaid', orderUnpaidController.updateOrderUnpaid);

export default orderUnpaidRouter