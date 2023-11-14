
import { createUser , deleteUser, getAllUser, getDetailsUser, loginUser, updateUser } from "../services/userService.js"
import * as JwtService from '../services/JWTservice.js'

class UserController {

    createUser = async (req,res) => {
        try {
            const { email, password, confirmPassword } = req.body;
            const regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            const isCheckEmail = regex.test(email);
            
            if(!password || !confirmPassword || !email){
                return res.status(200).json({
                    status : "ERR",
                    msg : "The input is required"
                })
            }else if(!isCheckEmail){
                return res.status(200).json({
                    status : "ERR",
                    msg : "email không đúng định dạng"
                })
            }else if(password !== confirmPassword){
                return res.status(200).json({
                    status : "ERR",
                    msg : "Mật khẩu xác thực ko trùng khớp"
                })
            }
            //console.log("request: ",req.body);
            const response = await createUser(req.body);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(404).json({error});
        }
    }

    loginUser = async (req,res) => {
        try {
            const { email, password} = req.body;
            const regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            const isCheckEmail = regex.test(email);
            
            if(!password || !email){
                return res.status(200).json({
                    status : "ERR",
                    msg : "The input is required"
                })
            }else if(!isCheckEmail){
                return res.status(200).json({
                    status : "ERR",
                    msg : "email không đúng định dạng"
                })
            }
            const response = await loginUser(req.body);
            if(response?.status === "ERR"){
                return res.status(200).json(response);
            }
            const {refreshToken, ...restResponse} = response;
            res.cookie('refreshToken',refreshToken,{
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/'
            })
            return res.status(200).json(restResponse)
        } catch (error) {
            return res.status(404).json({error});
        }
    }

    logoutUser = async (req,res) => {
        localStorage.clear('accessToken');
        return res.status(200).json({
            status : "OK",
            msg : "Log out success"
        })
    }

    refreshToken = async (req, res) => {
        console.log(req.cookies.refreshToken)
        try {
            let refreshToken = req.cookies.refreshToken;
            console.log('cookie: ', refreshToken);
            if (refreshToken) {
                const response = await JwtService.refreshTokenJwtService(refreshToken)
                return res.status(200).json(response)
            }else{
                return res.status(401).json({
                    status: 'ERR',
                    message: 'The token is required'
                })
            }
        } catch (e) {
            return res.status(500).json({
                message: e
            })
        }
    }

    getAllUser = async ( req, res) => {
        const response = await getAllUser(); 
        return res.status(200).json(response);
    }

    getDetailsUser = async (req, res) => {
        try{
            console.log(req.userId)
            const response = await getDetailsUser(req.userId);
            return res.status(200).json(response);
        }catch(error){
            return res.status(500).json({error});
        }
    }

    updateUser = async (req,res) => {
        try {
            const response = await updateUser(req.userId , req.body);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({error});
        }
    }

    deleteUser = async (req,res) => {
        try {
            const response = await deleteUser(req.userId);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(404).json({error});
        }
    }
}

export default new UserController
