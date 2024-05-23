import jwt_decode from 'jwt-decode'

export const authUser = async (req,res,next) => {
    if(req.url == '/api/user/sign-in' || 
       req.url == '/api/user/sign-up' ||
    //    req.url == '/api/user/verify-email' ||
    //    req.url == '/api/dashboard/statistic' ||
       req.url == '/api/user/refresh-token' ||
       req.url.includes('/api/product/all-products') ||
       req.url == '/api/product/all-type-product' ||
       req.url.includes('/api/product/details-product') ||
       req.url == '/api/voucher/get-all-voucher' ||
       req.url.includes('/api/voucher/get-voucher') ||
       req.url == '/api/product/products-end-number'
    ){ 
        next();
    }else{
        const accessToken = req.headers.authorization?.split(' ')[1];
        console.log('ass: ',accessToken)
        if(accessToken){
            const decoded = jwt_decode(accessToken);
            const {payload} = decoded
            req.userId = payload._id;
            next();
        }else{
            res.status(401).json({
                status : 401,
                error : "unauthorized",
                message : ""
            })
        }
    }

    // if(!req?.headers?.authorization){
    //     next();
    //     return
    // }

    // const accessToken = req.headers.authorization.split(' ')[1];
    // //console.log('accessToken',accessToken);
    // const decoded = jwt_decode(accessToken);
    // const currentTime = new Date();
    // if (decoded?.exp < currentTime.getTime() / 1000) {
    //     const accessToken = generalAccessToken(decoded?.payload);
    //     req.headers.authorization = `Bearer ${accessToken}`
    // }
    //next(); 
}