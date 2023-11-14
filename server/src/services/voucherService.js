import { UserModel } from "../models/UserModel.js";
import { VoucherModel } from "../models/VoucherModel.js"

const createVoucher = async (voucher) => {
    return new Promise(
        async (resolve,reject) => {
            try {
                const newVoucher = new VoucherModel(voucher)
                await newVoucher.save();
                resolve({
                    status: 'OK',
                    msg: 'add voucher success',
                    data: newVoucher
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

const updateVoucher = async (idVou , updatedVoucher) => {
    return new Promise(
        async (resolve,reject) => {
            try {
                const voucherUpdated = await VoucherModel.findByIdAndUpdate(idVou , updatedVoucher , {
                    new : true
                })
                resolve({
                    status: 'OK',
                    msg: 'update voucher success',
                    data: voucherUpdated
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

const getAllVoucher = async () => {
    return new Promise(
        async (resolve,reject) => {
            try {
                const listVouchers = await VoucherModel.find();
                resolve({
                    status: 'OK',
                    msg: 'SUCCESS',
                    data: listVouchers
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

const getVoucherByUser = async (idUser) => {
    return new Promise(
        async (resolve,reject) => {
            try {
                const user = await UserModel.findById(idUser);
                const arrPromise = user?.listVouchers.map(async (vouId) => {
                    return await VoucherModel.findById(vouId);
                })

                const vouchersByUser = await Promise.all(arrPromise);
                
                resolve({
                    status: 'OK',
                    msg: 'SUCCESS',
                    data: vouchersByUser
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

const getVoucherById = async (idVoucher) => {
    return new Promise(
        async (resolve,reject) => {
            try {
                const voucher = await VoucherModel.findById(idVoucher)

                resolve({
                    status: 'OK',
                    msg: 'SUCCESS',
                    data: voucher
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

const decreaseQuantityVoucher = async (idVoucher) => {
    return new Promise(
        async (resolve,reject) => {
            try {
                await VoucherModel.findByIdAndUpdate(idVoucher,{
                    $inc:{
                        remainQuantity: -1
                    },
                })

                resolve({
                    status: 'OK',
                    msg: 'SUCCESS',
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

export {createVoucher , getAllVoucher , getVoucherByUser , getVoucherById , updateVoucher , decreaseQuantityVoucher}