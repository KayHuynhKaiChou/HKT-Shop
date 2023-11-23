import mongoose from "mongoose";
const orderUnpaidSchema = new mongoose.Schema({
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            amount: {type: Number , required : true},
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