import { AddressShipModel } from "../models/AddressShipModel.js"

const getAllAddressShip = async (userId) => {
    return new Promise(
        async (resolve , reject) => {
            try {
                const listAddressShip = await AddressShipModel.find({userId})
                resolve(listAddressShip ? listAddressShip : [])
            } catch (error) {
                reject(error)
            }
        }
    )
}

const createAddressShip = async (userId, addressShip) => {
    return new Promise(
        async (resolve , reject) => {
            try {
                let newAddressShip = {}
                const listAddressShip = await AddressShipModel.find({userId})
                if(listAddressShip.length === 0){ // tạo địa chỉ đầu tiên cho account nên sẽ là default address ship
                    newAddressShip = new AddressShipModel({
                        ...addressShip,
                        default : true,
                        userId
                    })
                }else{
                    if(addressShip.default){
                        await AddressShipModel.findOneAndUpdate({default : true},{
                            $set: {
                                default : false
                            }
                        })    
                    }
                    newAddressShip = new AddressShipModel({
                        ...addressShip,
                        userId
                    })
                }
                await newAddressShip.save();
                resolve({
                    message : "Tạo mới địa chỉ ship thành công",
                    success : true,
                    data : newAddressShip
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

const updateAddressShip = async (userId, addressShip) => {
    return new Promise(
        async (resolve , reject) => {
            try {        
                if(addressShip.default){    
                    const foundOriginalAddressShip = await AddressShipModel.findById(addressShip.id)
                    if(!foundOriginalAddressShip.default){ // update 1 địa chỉ KO default => default
                        // Tìm địa chỉ default ban đầu và update lại thành KO default
                        await AddressShipModel.findOneAndUpdate( 
                            {
                                userId ,
                                default : true
                            } , 
                            {
                                $set: { default : false}
                            }
                        )
                    }
                }
                const updatedAddressShip = await AddressShipModel.findByIdAndUpdate(
                    addressShip.id, 
                    addressShip,
                    {new : true}
                )
                resolve({
                    message : "Cập nhật địa chỉ ship thành công",
                    success : true,
                    updatedAddressShip 
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

const deleteAddressShip = async (addressShipId) => {
    return new Promise(
        async (resolve , reject) => {
            try {
                const addressShipFind = await AddressShipModel.findById(addressShipId);
                if(addressShipFind.default){
                    resolve({
                        timestamp : new Date(), 
                        status : 400,
                        error : "Bad request",
                        message : "Không thể xóa địa chỉ mặc định"
                    })
                }else{
                    await AddressShipModel.findByIdAndDelete(addressShipId);
                    resolve({
                        status : 200,
                        success : true,
                        message : "Xóa địa chỉ thành công"
                    })
                }
            } catch (error) {
                reject(error)
            }
        }
    )
}

export {getAllAddressShip , createAddressShip , updateAddressShip , deleteAddressShip}
