import { UserModel } from "../models/UserModel.js";
import { default as bcrypt } from 'bcryptjs'
import { generalAccessToken, generalRefreshToken } from "./JWTservice.js";
import { VoucherModel } from "../models/VoucherModel.js";
import { sendEmailToVerify } from "./emailServices.js";

const createUser = async (newUser) => {
    return new Promise (
        async (resolve,reject) => {
            try {
                const { email, password } = newUser;
                const isExistEmail = await UserModel.findOne({email});
                if(isExistEmail){
                    resolve({
                        status : "ERR",
                        msg : "email đã tồn tại"
                    })
                }
                const hash = await bcrypt.hash(password, 10);

                // handle get voucher for new user and add it to listVouRegister field
                const vouchersRegister =  await VoucherModel.find({isNewUser : true});
                const customeVousRegister = vouchersRegister?.map(vou => {
                    const expiredDate = new Date();
                    expiredDate.setDate(expiredDate.getDate() + vou.expiredTime)
                    return {
                        idVoucher : vou._id,
                        content : vou.content,
                        discount : vou.discount,
                        isNewUser : true,
                        condition : vou.condition,
                        expiredDate
                    }
                })
                const newAccount = new UserModel({
                    name: email.split("@")[0],
                    email,
                    password : hash,
                    avatar: "https://cdn-icons-png.flaticon.com/512/3607/3607444.png",
                    listVouRegister: customeVousRegister
                })
                await newAccount.save();
                resolve({
                    status : "OK",
                    msg : "SUCCESS",
                    data : newUser
                });                
            } catch (error) {
                console.log(error)
                reject(error);
            }
        }
    )
}

const loginUser = async (account) => {
    return new Promise (
        async (resolve,reject) => {
            try {
                const { email, password } = account;
                //check email
                const userChecked = await UserModel.findOne({email});
                if(!userChecked){
                    resolve({
                        status : "ERR",
                        msg : "email không hợp lệ"
                    })
                }

                //check password
                const isMatched = await bcrypt.compare(password, userChecked?.password);
                if(!isMatched){
                    resolve({
                        status : "ERR",
                        msg : "mật khẩu ko hợp lệ"
                    });
                }
                //When login success , we create access and refreshToken
                
                const accessToken = generalAccessToken({
                    _id: userChecked._id
                });
                const refreshToken = generalRefreshToken({
                    _id: userChecked._id
                });
                console.log(accessToken)
                resolve({
                    status : "OK",
                    msg : "SUCCESS",
                    accessToken,
                    refreshToken
                });                
            } catch (error) {
                reject(error);
            }
        }
    )
}

const getAllUser = async() => {
    return new Promise(
        async(resolve) => {
            const listUsers = await UserModel.aggregate([
                {
                    $lookup: {
                        from: 'orders',
                        localField: '_id',
                        foreignField: 'user',
                        as: 'orders'
                    }
                },
                {
                    $match:{
                        isAdmin : false
                    }
                },
                {
                    $unwind: {
                        path: '$orders',
                        preserveNullAndEmptyArrays: true // Giữ lại các documents mà không có mảng orders hoặc có mảng rỗng
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        name: { $first: '$name' },
                        email: { $first: '$email' },
                        birthdate: { $first: '$birthdate'},
                        gender: { $first : '$gender'},
                        avatar: { $first : '$avatar'},
                        totalOrders: {
                            $sum: {
                                $cond: {
                                    if: { $ifNull: ['$orders.codeOrder', null] }, // Sử dụng $ifNull để kiểm tra xem orders có tồn tại không
                                    then: 1,
                                    else: 0
                                }
                            }
                        },                            
                        totalSpentMoney: { $sum: '$orders.totalPrice' },
                        orders: { $push: '$orders' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: 1,
                        email: 1,
                        birthdate: 1,
                        gender: 1,
                        avatar: 1,
                        totalOrders: 1,
                        totalSpentMoney: 1,
                        orders : 1
                    }
                }
            ])
            resolve({
                status : 200,
                success : true,
                message: "get all users success",
                data: listUsers
            })
        }
    )
}

const getDetailsUser = async (userId) => {
    return new Promise (
        async (resolve,reject) => {
            try {
                const user = await UserModel.findById(userId);
                resolve({
                    status: 'OK',
                    msg: 'SUCCESS',
                    data: user
                })                
            } catch (error) {
                reject(error)
            }
        }
    )
}

const updateUser = async(userId,changedUser) => {
    return new Promise(
        async(resolve,reject) => {
            try {
                const updatedUser = await UserModel.findByIdAndUpdate(userId,changedUser , {new:true});
                //Ko có {new:true} thì updatedUser sẽ là user trước khi update
                resolve({
                    status : "OK",
                    msg : "Update success",
                    data : updatedUser
                })
            } catch (error) {
                reject(error)
            }           
        }
    )
}

const changePassword = async (userId, oldPass , newPass) => {
    return new Promise(
        async(resolve,reject) => {
            try {
                const userChecked = await UserModel.findById(userId);
                if(userChecked){
                    const isMatched = await bcrypt.compare(oldPass, userChecked?.password);
                    if(isMatched){
                        if(oldPass === newPass){
                            resolve({
                                timestamp : new Date(), 
                                status : 400,
                                error : "Bad request",
                                message : "Mật khẩu mới không được trùng khớp mật khẩu cũ"
                            })
                        }else{
                            const hashNewPassword = await bcrypt.hash(newPass, 10);
                            await UserModel.findByIdAndUpdate(userId , {
                                $set : {
                                    password : hashNewPassword
                                }
                            })
                            resolve({
                                status : 200,
                                success : true,
                                message : "Thay đổi mật khẩu thành công",
                            })
                        }
                    }else{
                        resolve({
                            timestamp : new Date(), 
                            status : 400,
                            error : "Bad request",
                            message : "Mật khẩu cũ không đúng"
                        })
                    }
                }
            } catch (error) {
                console.log(error)
                reject(error)
            }           
        }
    )
}

const verifyEmail = async(userId , email , codeOTPInput) => {
    return new Promise(
        async(resolve) => {
            const user = await UserModel.findOne({email : email})
            if(user.isVerifiedEmail){
                resolve({
                    timestamp : new Date(), 
                    status : 400,
                    error : "Bad request",
                    message : "Email này đã được xác thực bởi tài khoản khác"
                })
            }else{
                if(codeOTPInput){
                    if(codeOTPInput == user.codeOTP){
                        await UserModel.findByIdAndUpdate(userId, {
                            $set : {
                                isVerifiedEmail : true,
                            }
                        })
                        resolve({
                            status : 200,
                            success : true,
                            message : "Xác thực email thành công"
                        })
                    }else{
                        resolve({
                            timestamp : new Date(), 
                            status : 400,
                            error : "Bad request",
                            message : "OTP không đúng"
                        })
                    }
                }else{
                    const emailOTP = await sendEmailToVerify(email);
                    await UserModel.findByIdAndUpdate(userId, {
                        $set : {
                            codeOTP : emailOTP
                        }
                    })
                    resolve({
                        status : 200,
                        success : true,
                        message : "Đã gửi OTP tới email thành công"
                    })
                }
            }
        }
    )
}

const deleteUser = async(userId) => {
    return new Promise(
        async(resolve) => {
            await UserModel.findByIdAndDelete(userId);
            resolve({
                status : "OK",
                msg : "delete success",
            })
        }
    )
}

export {createUser,loginUser,getAllUser,updateUser,deleteUser,getDetailsUser , changePassword , verifyEmail}