import express from 'express'
import voucherController from '../controllers/voucherController.js';

const voucherRouter = express.Router();

voucherRouter.post('/create-voucher', voucherController.createVoucher);
voucherRouter.put('/update-voucher/:id', voucherController.updateVoucher);
voucherRouter.get('/get-all-voucher', voucherController.getAllVoucher);
voucherRouter.get('/get-voucher-by-user/:id', voucherController.getVoucherByUser);
voucherRouter.get('/get-voucher/:id', voucherController.getVoucherById); // lấy thông tin voucher by Id của nó , nhằm phục vụ cho update voucher ở admin
voucherRouter.put('/decrease-quantity-voucher/:id', voucherController.decreaseQuantityVoucher);



export default voucherRouter