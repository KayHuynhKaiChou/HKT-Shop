
import express from 'express';
import UserController from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/sign-up', UserController.createUser);
userRouter.post('/sign-in', UserController.loginUser);
userRouter.post('/log-out', UserController.logoutUser);
userRouter.get('/refresh-token', UserController.refreshToken)
userRouter.get('/all-users', UserController.getAllUser);
userRouter.get('/detail-user', UserController.getDetailsUser);
userRouter.put('/update-user', UserController.updateUser);
userRouter.put('/change-password', UserController.changePassword);
userRouter.post('/verify-email', UserController.verifyEmail);
userRouter.post('/delete-user/:id', UserController.deleteUser);



export default userRouter;