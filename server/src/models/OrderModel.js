import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    codeOrder : {type: Number , required: true},
    orderItems: [
        {
            name: { type: String, required: true },
            type: { type: String },
            amount: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            discount: { type: Number },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],
    addressShipId: { type: mongoose.Schema.Types.ObjectId, ref: 'AddressShip', required: true },
    deliveryMethod: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'DELIVERING', 'COMPLETED', 'CANCELLED'],
    },
},
    {
        timestamps: true,
    }
);
export const OrderModel = mongoose.model('Order', orderSchema);