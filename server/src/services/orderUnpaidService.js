import { OrderUnpaidModel } from '../models/OrderUnpaidModel.js';
import { ProductModel } from '../models/ProductModel.js';

const checkCountInStock = async (cart) => {
    console.log(cart)
    let response = {};
    if(cart.totalQuantity === 0) return response;
    const arrPromise = cart.orderItems.map(async (item) => {
        const product = await ProductModel.findById(item.product);
        if(product.countInStock === 0 || product.countInStock < item.amount){
            const updatedCart = await OrderUnpaidModel.findByIdAndUpdate(cart._id , {
                $set : {
                    orderItems : [...cart.orderItems].filter(item => JSON.stringify(item.product) !== JSON.stringify(product._id)),
                },
                $inc : {
                    totalQuantity : -item.amount
                }
            },{new : true})
            response = {
                timestamp : new Date(),
                status : 400,
                error : "Bad Request",
                message : "Có sản phẩm đã rời khỏi giỏ hàng vì hết hàng",
                data : {
                    userId : updatedCart.userId,
                    orderItems : await mappingItemsCart(updatedCart),
                    totalQuantity : updatedCart.totalQuantity
        
                }
            }
        }
        return product
    })

    await Promise.all(arrPromise);
    return response
}

const mappingItemsCart = async (cart) => {
    const cartsPromise = cart.orderItems.map(async (item) => {
        const product = await ProductModel.findById(item.product)
        return {
            product : product._id,
            name: product.name,
            type: product.type,
            amount: item.amount,
            image: product.image,
            price: product.price,
            discount: product.discount,
            countInStock: product.countInStock,
            isSelected : item.isSelected
        }
    })

    const cartsDetail = await Promise.all(cartsPromise)
    return cartsDetail
}

const getOrderUnpaidByUser = async (idUser) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                const orderUnpaid = await OrderUnpaidModel.findOne({userId : idUser});
                if(!orderUnpaid){
                    resolve({
                        status : 200,
                        success : true,
                        message : "Your cart is empty",
                    })
                }
                const response = await checkCountInStock(orderUnpaid);
                const cartsDetail = await mappingItemsCart(orderUnpaid);
                if(JSON.stringify(response) === '{}'){
                    resolve({
                        status : 200,
                        success : true,
                        message : "get order unpaid by user",
                        data : {
                            userId : idUser,
                            orderItems : cartsDetail,
                            totalQuantity : orderUnpaid.totalQuantity
                        }
                    })
                }else{
                    resolve({
                        ...response
                    })
                }
            } catch (error) {
                console.log(error)
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
                console.log(idUser , updatedOrder)
                const response = await checkCountInStock(orderUnpaid);
                if(JSON.stringify(response) === '{}'){
                    resolve({
                        status : "OK",
                        msg : "update order unpaid",
                        data : {
                            orderItems : orderUnpaid.orderItems,
                            totalQuantity : orderUnpaid.totalQuantity
                        }
                    })
                }else{
                    resolve({
                        ...response
                    })
                }

            } catch (error) {
                console.log(error)
                reject(error)
            }
        }
    )
}

export {getOrderUnpaidByUser , addOrderUnpaid , updateOrderUnpaid}