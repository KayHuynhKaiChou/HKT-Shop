import { OrderUnpaidModel } from '../models/OrderUnpaidModel.js';


const getOrderUnpaidByUser = async (idUser) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                const orderUnpaid = await OrderUnpaidModel.findOne({userId : idUser});
                resolve({
                    status : "OK",
                    msg : "get order unpaid by user",
                    data : orderUnpaid
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

const addOrderUnpaid = async (newOrder) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                const orderUnpaid = new OrderUnpaidModel(
                    {...newOrder}
                )
                await orderUnpaid.save();
                resolve({
                    status : "OK",
                    msg : "add new order unpaid",
                    data : orderUnpaid
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

const updateOrderUnpaid = async (idUser , updatedOrder) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                const orderUnpaid = await OrderUnpaidModel.findOneAndUpdate(
                    { userId : idUser},
                    { $set : updatedOrder},
                    { new : true}
                )
                resolve({
                    status : "OK",
                    msg : "update order unpaid",
                    data : orderUnpaid
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

export {getOrderUnpaidByUser , addOrderUnpaid , updateOrderUnpaid}