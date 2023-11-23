import {ProductModel} from '../models/ProductModel.js';
import {OrderModel} from '../models/OrderModel.js'
import {UserModel} from '../models/UserModel.js'
import {AddressShipModel} from '../models/AddressShipModel.js'
import * as emailServices from './emailServices.js';


const createOrder = async (userId , order) => {
    return new Promise(
        async(resolve,reject) => {           
            const { orderItems , deliveryMethod ,paymentMethod, addressShipId ,itemsPrice ,shippingPrice ,totalPrice} = order
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
                            codeOrder : Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000,
                            orderItems,
                            deliveryMethod,
                            paymentMethod,
                            addressShipId,
                            itemsPrice,
                            shippingPrice,
                            totalPrice,
                            user : userId,
                            isPaid : paymentMethod !== 'LATER_MONEY',
                            status : 'PENDING'
                        }
                    )
                    await newOrder.save();
                    const user = await UserModel.findById(userId);
                    if(user.email){
                        await emailServices.sendEmailCreateOrder(user.email,newOrder);
                    }
                    resolve({
                        status : "OK",
                        msg : "Create order success",
                        data: newOrder
                    })
                }
            } catch (error) {
                console.log(error)
                reject(error)
            }
        }
    )
}

const getAllOrders = async () => {
    return new Promise(
        async (resolve, reject) => {
            try {
                const orders = await OrderModel.find();
                const arrPromises = orders.map(async (order) => ({
                    _id : order._id,
                    codeOrder : order.codeOrder,
                    orderItems : order.orderItems,
                    shippingAddress : await AddressShipModel.findById(order.addressShipId),
                    deliveryMethod : order.deliveryMethod,
                    paymentMethod : order.paymentMethod,
                    isPaid : order.isPaid,
                    itemsPrice : order.itemsPrice,
                    shippingPrice : order.shippingPrice,
                    totalPrice : order.totalPrice,
                    status : order.status,
                    createdAt : order.createdAt
                }))
                const ordersMap = await Promise.all(arrPromises)
                resolve({
                    status : 200,
                    success : true,
                    message : "get all orders success",
                    data : ordersMap
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

const cancelOrder = async (idOrder) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                const orderCancel = await OrderModel.findByIdAndUpdate(idOrder, {
                    $set : {
                        status : 'CANCELLED'
                    }
                } ,{new: true})
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
                    msg : `cancel order with id ${idOrder} success`,
                })

            } catch (error) {
                reject(error)
            }
        }
    )
}

const changeStatusOrder = async (status , orderId) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                await OrderModel.findByIdAndUpdate(orderId, {
                    $set : {
                        status,
                    }
                })

                if(status === 'COMPLETED'){
                    await OrderModel.findByIdAndUpdate(orderId, {
                        $set : {
                            isPaid : true
                        }
                    })
                }

                // const promises = listOrder?.map(async (order) => {
                //     return await OrderModel.findByIdAndUpdate(order?._id,order,{new: true})
                // })

                // const orderApprove = await Promise.all(promises);

                resolve({
                    status : "OK",
                    msg : "change status order success",
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
                const orderDetail = await OrderModel.findById(idOrder);
                const shippingAddress = await AddressShipModel.findById(orderDetail.addressShipId)
                resolve({
                    status : "OK",
                    msg : "get order detail success",
                    data : {
                        _id : idOrder,
                        codeOrder : orderDetail.codeOrder,
                        orderItems : orderDetail.orderItems,
                        shippingAddress,
                        deliveryMethod : orderDetail.deliveryMethod,
                        paymentMethod : orderDetail.paymentMethod,
                        isPaid : orderDetail.isPaid,
                        itemsPrice : orderDetail.itemsPrice,
                        shippingPrice : orderDetail.shippingPrice,
                        totalPrice : orderDetail.totalPrice,
                        status : orderDetail.status,
                        createdAt : orderDetail.createdAt
                    }
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

export {createOrder, getAllOrders , getAllOrderByUser ,getOrderDetails ,cancelOrder , changeStatusOrder}