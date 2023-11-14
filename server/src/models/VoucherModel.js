import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
    content : {type : String , required : true},
    discount : {type : String , required : true},
    isNewUser : {type : Boolean , required : true},
    remainQuantity : {type : Number},
    usedQuantity : {type : Number , default : 0},
    condition : {type : String , required : true},
    expiredDate : {type : Date},
    expiredTime : {type : Number , default : 0}
},{
    timestamps: true,
})

export const VoucherModel = mongoose.model('Voucher',voucherSchema)