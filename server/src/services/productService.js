import { ProductModel } from "../models/ProductModel.js"

const createProduct = async (newProduct) => {
    return new Promise(
        async(resolve,reject) => {
            const { name, image, type, countInStock, price, rating, description,discount } = newProduct
            try {
                const newProduct = new ProductModel({
                    name,
                    image, 
                    type, 
                    price, 
                    countInStock: Number(countInStock), 
                    rating, 
                    description,
                    discount: Number(discount),
                    selled : 0
                })
                await newProduct.save();
                resolve({
                    status: 'OK',
                    msg: 'SUCCESS',
                    data: newProduct
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

const getAllProduct = async (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            //'$regex': filter[1]
            //new RegExp(`^${filter[1]}`, "i")
            const totalProduct = await ProductModel.count(filter ? { [filter[0]] : { '$regex': new RegExp(`^${filter[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, "i") }} : {})
            let allProduct = []
            if (filter) { //filter là 1 {} và filter[0] là field và filter[1] là textInput ví dụ { name : pro } , tìm những product có name chứa 'pro' nhập từ ô input
                const label = filter[0];
                const allObjectFilter = await ProductModel.find({ [label]: { '$regex': new RegExp(`^${filter[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, "i") } }).limit(limit).skip(page * limit).sort({createdAt: -1, updatedAt: -1}) // createdAt: -1 => sort giảm dần theo createdAt
                resolve({                                           // '$regex': filter[1] nghĩa là [label].contain(filter[1])
                    status: 'OK',
                    message: 'Success',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0] // sort[1] : field , sort[0] : asc hoặc desc , ex : {price : asc}
                const allProductSort = await ProductModel.find().limit(limit).skip(page * limit).sort(objectSort).sort({createdAt: -1, updatedAt: -1})
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if(!limit) {
                allProduct = await ProductModel.find().sort({createdAt: -1, updatedAt: -1})
            }else {
                allProduct = await ProductModel.find().limit(limit).skip(page * limit).sort({createdAt: -1, updatedAt: -1})
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit) // giả sử có total 20 products và mỗi page chỉ show 6 pro , thì ta cần totalPage chứa hết 20 pro là ceil.(20/6) , ceil là làm tròn lên
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsProduct = async (idProduct) => {
    return new Promise(
        async (resolve,reject) => {
            const product = await ProductModel.findById(idProduct);
            resolve({
                status : "OK",
                msg : "SUCCESS",
                data : product
            })
        }
    )
}

const getAllTypeProduct = async () => {
    return new Promise(
        async (resolve,reject) => {
            const allType = await ProductModel.distinct('type');
            resolve({
                status : "OK",
                msg : "SUCCESS",
                data : allType
            })
        }
    )
}

const updateProduct = async (idProduct , changedProduct) => {
    return new Promise(
        async(resolve,reject) => {
            try {
                const updatedProduct = await ProductModel.findByIdAndUpdate(idProduct , changedProduct , {new:true})
                resolve({
                    status : "OK",
                    msg : "SUCCESS",
                    data : updatedProduct 
                })
            } catch (error) {
                reject(error)
            }
        }
    )
}

const deleteProduct = async (idProduct) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                await ProductModel.findByIdAndDelete(idProduct)
                resolve({
                    status: 'OK',
                    message: 'Delete product success',
                })
            } catch (error) {
                reject(error)
            }
        }
    )
} 

export {createProduct , getDetailsProduct , getAllTypeProduct , getAllProduct , updateProduct , deleteProduct} 