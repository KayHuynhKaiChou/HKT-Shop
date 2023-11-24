import { default as jwt } from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

export const generalAccessToken = (payload) => {
    const accessToken = jwt.sign({ payload },process.env.ACCESS_TOKEN, {expiresIn: '1d'})
    return accessToken
}

export const generalRefreshToken = (payload) => {
    const refreshToken = jwt.sign({ payload },process.env.REFRESH_TOKEN, {expiresIn: '365d'})
    return refreshToken
}

// nếu refreshToken hết hạn thì trả về lỗi để bên client dựa vào đó cho user tự reset và login lại
// nếu refreshToken chưa hết hạn thì trả về accessToken mới
export const refreshTokenJwtService = (refreshToken) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, decoded) => {
                if (err) {
                    resolve({
                        status: 400,
                        error: err.name,
                        message: ''
                    })
                }else{
                    /* decoded:  {
                        payload: { _id: '650b10931266ce2610841a80' },
                        iat: 1698675467,
                        exp: 1730211467
                    } */
                    const accessToken = generalAccessToken(decoded.payload)
                    resolve({
                        status: 200,
                        success: true,
                        message: 'new accessToken has been provided via refreshToken',
                        accessToken
                    })
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}
