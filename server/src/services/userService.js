import { UserModel } from "../models/UserModel.js";
import { default as bcrypt } from 'bcryptjs'
import { generalAccessToken, generalRefreshToken } from "./JWTservice.js";
import { VoucherModel } from "../models/VoucherModel.js";

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
            const allUser = await UserModel.find();
            resolve({
                status : "OK",
                msg: "get all users",
                data: allUser
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

export {createUser,loginUser,getAllUser,updateUser,deleteUser,getDetailsUser}