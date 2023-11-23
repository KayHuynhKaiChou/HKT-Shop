import {ProductModel} from '../models/ProductModel.js';
import {OrderModel} from '../models/OrderModel.js'
import {UserModel} from '../models/UserModel.js'


const getReports = async () => {
    return new Promise(
        async (resolve, reject) => {
            try {
                const reportUsers = await UserModel.aggregate([
                    {
                        $match : {
                            isAdmin : { $ne : true} // hiểu nôn na là isAdmin !== true
                        }
                    },
                    {
                        $group:{
                            _id : null,
                            totalUsers : {$sum : 1} // 1 ở đây là số đếm , tức là +1 
                        }
                    },
                    {
                        $project:{
                            _id : 0,
                            totalUsers : 1
                        }
                    }
                ])

                const reportSoldProducts = await ProductModel.aggregate([
                    {
                        $group:{
                            _id : null,
                            totalSoldProducts : {$sum : "$selled"}
                        }
                    },
                    {
                        $project:{
                            _id : 0,
                            totalSoldProducts : 1
                        }
                    }
                ])

                const reportOrder = await OrderModel.count();
                
                const reportRevenue = await OrderModel.aggregate([
                    {
                        $match:{
                            status : 'COMPLETED' // điều kiện : status === 'COMPLETED'
                        }
                    },
                    {
                        $group:{
                            _id : null,
                            totalRevenue : {$sum : "$totalPrice"}
                        }
                    },
                    {
                        $project:{
                            _id : 0,
                            totalRevenue : 1
                        }
                    }
                ])

                resolve({
                    status : 200,
                    success : true,
                    message : "Make reports success",
                    data : {
                        totalUsers : reportUsers[0].totalUsers,
                        totalSoldProducts : reportSoldProducts[0].totalSoldProducts,
                        totalOrder : reportOrder,
                        totalRevenue : reportRevenue[0].totalRevenue
                    }
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

const getStatistic = async () => {
    return new Promise(
        async (resolve, reject) => {
            try {
                const dataStatistic = await ProductModel.aggregate([
                    {
                        $group:{
                            _id : "$type", // nhóm field "type"
                            totalSoldNum : {$sum : "$selled"},
                            totalInStockNum : {$sum : "$countInStock"}
                        }
                    },
                    {
                        $project: {
                            _id : 0,
                            type: "$_id", // Đặt tên mới cho trường _id là type
                            totalSoldNum: 1,
                            totalInStockNum: 1
                        }
                    }
                ])
                
                resolve({
                    status : 200,
                    success : true,
                    message : "Make data statistic about type product success",
                    data : dataStatistic
                })
            } catch (error) {
                console.log(error)
                reject(error)
            }
        }
    )
}

export {getReports , getStatistic}