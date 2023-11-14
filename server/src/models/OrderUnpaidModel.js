import mongoose from "mongoose";
const orderUnpaidSchema = new mongoose.Schema({
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
            isSelected: {type: Boolean}
        },
    ],
    totalQuantity: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
    {
        timestamps: true,
    }
);
export const OrderUnpaidModel = mongoose.model('OrderUnpaid', orderUnpaidSchema);