import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    codeOTP: { type: String},
    isVerifiedEmail: {type : Boolean , default : false},
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    avatar: { type: String },
    birthdate: {type: String },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'], // Các giá trị hợp lệ cho giới tính
    },
    listVouchers : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Voucher', required : true }],
    listVouRegister : [
        {
            idVoucher : {type: mongoose.Schema.Types.ObjectId, ref: 'Voucher', required : true},
            content : {type : String , required : true},
            discount : {type : String , required : true},
            isNewUser : {type : Boolean , default : true},
            condition : {type : String , required : true},
            expiredDate : {type: Date}
        },
    ]
},{timeseries:true})

export const UserModel = mongoose.model('User',userSchema);