import mongoose from "mongoose";

const addressShipSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        fullName: {type: String , required : true},
        phone: {type: String , required : true},
        province: {type: String , required : true},
        district: {type: String , required : true},
        ward: {type: String , required : true},
        addressDetail: {type: String },
        type: {
            type: String,
            enum: ['HOME', 'WORK', 'OTHER'], // Các giá trị hợp lệ cho giới tính
        },
        default : {type: Boolean , required : true}
    },
    {
        timestamps : true
    }
)

export const AddressShipModel = mongoose.model('AddressShip',addressShipSchema)