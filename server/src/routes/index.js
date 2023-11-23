import userRouter from "./userRouter.js";
import productRouter from "./productRouter.js";
import orderRouter from "./orderRouter.js";
import orderUnpaidRouter from "./orderUnpaidRouter.js";
import paymentRouter from "./paymentRouter.js";
import voucherRouter from "./voucherRouter.js";
import addressShipRouter from "./addressShipRouter.js";
import dashboardRouter from "./dashboardRouter.js";

export const routes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/order', orderRouter)
    app.use('/api/orderUnpaid', orderUnpaidRouter)
    app.use('/api/payment', paymentRouter)
    app.use('/api/voucher', voucherRouter)
    app.use('/api/addressShip', addressShipRouter)
    app.use('/api/dashboard', dashboardRouter)
}