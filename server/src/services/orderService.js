import {ProductModel} from '../models/ProductModel.js';
import {OrderModel} from '../models/OrderModel.js'


const createOrder = async (order) => {
    return new Promise(
        async(resolve,reject) => {           
            const { codeOrder, orderItems , fullName ,address ,phone ,city ,deliveryMethod ,paymentMethod ,itemsPrice ,shippingPrice ,totalPrice ,user ,isPaid , paidAt ,email } = order
            try {
                const arrPromises = orderItems?.map(async (item) => {
                    return await ProductModel.findByIdAndUpdate(item.product,{
                        $inc:{
                            countInStock : -item.amount,
                            selled: +item.amount
                        }
                    },{new : true})
                })
                const updatedProducts = await Promise.all(arrPromises);
                if(updatedProducts?.length){
                    const newOrder = new OrderModel(
                        {
                            codeOrder,
                            orderItems,
                            shippingAddress: {
                                fullName,
                                address,
                                city, phone
                            },
                            deliveryMethod,
                            paymentMethod,
                            itemsPrice,
                            shippingPrice,
                            totalPrice,
                            user,
                            isPaid,
                            paidAt
                        }
                    )
                    await newOrder.save();
                    resolve({
                        status : "OK",
                        msg : "Create order success",
                        data: newOrder
                    })
                }
            } catch (error) {
                reject(error)
            }
        }
    )
}

const getAllOrders = async (idUser) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                const orders = await OrderModel.find();
                resolve({
                    status : "OK",
                    msg : "get all order",
                    data : orders
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

const getAllOrderByUser = async (idUser) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                const orders = await OrderModel.find({user : idUser});
                resolve({
                    status : "OK",
                    msg : "get all order by user",
                    data : orders
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

const cancelOrder = async (order , idOrder) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                //const orderCancel = await OrderModel.findById(idOrder);
                const orderCancel = await OrderModel.findByIdAndUpdate(idOrder, order ,{new: true})
                //const order = await OrderModel.findById(idOrder);
                const promises = orderCancel?.orderItems?.map(async (item) => {
                    return await ProductModel.findByIdAndUpdate(item?.product,{
                        $inc:{
                            countInStock : +item.amount,
                            selled: -item.amount
                        },
                    },{new: true})
                })

                await Promise.all(promises);

                resolve({
                    status : "OK",
                    msg : "cancel order success",
                })

            } catch (error) {
                reject(error)
            }
        }
    )
}

const approveOrder = async (listOrder) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                const promises = listOrder?.map(async (order) => {
                    return await OrderModel.findByIdAndUpdate(order?._id,order,{new: true})
                })

                const orderApprove = await Promise.all(promises);

                resolve({
                    status : "OK",
                    msg : "approve orders success",
                    data : orderApprove
                })

            } catch (error) {
                reject(error)
            }
        }
    )
}

const getOrderDetails = async (idOrder) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                const order = await OrderModel.findById(idOrder);
                resolve({
                    status : "OK",
                    msg : "get all order by user",
                    data : order
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

export {createOrder, getAllOrders , getAllOrderByUser ,getOrderDetails ,cancelOrder , approveOrder}