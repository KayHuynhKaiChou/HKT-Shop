import { Button, Form, Input } from "antd";
import { useState } from "react";
import { WrapperChangePassword } from "./style";
import * as userService from "../../services/UserService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { toastMSGObject } from "../../utils/utils";
import { useDispatch } from "react-redux";
import { resetUser } from "../../redux/slices/userSlice";
import { resetOrder } from "../../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
    
    const [msgError , setMsgError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const mutationChangePass = useMutation(
        (data) => userService.changePassword(data),{
            onSuccess :async () => {
                toast.success('Thay đổi mật khẩu thành công , vui lòng đăng nhập lại' , toastMSGObject({}))
                navigate('/');
                await userService.logout();
                localStorage.removeItem('accessToken');
                dispatch(resetUser());
                dispatch(resetOrder());
            },
            onError : (error) => {
                setMsgError(error.response.data.message)
            }
        }
    )

    const handleChangePassword = async (inputValues) => {
        const {currentPassword , newPassword , confirmNewPassword} = inputValues
        if(newPassword !== confirmNewPassword){
            setMsgError('Xác nhận mật khẩu không khớp')
        }else{
            mutationChangePass.mutate({
                currentPassword,
                newPassword
            })
        }
    }

    return (
        <WrapperChangePassword>
            <div className="message-note">
                Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
            </div>
            <Form
                style={{
                    width: 500,
                }}
                layout="vertical"
                onFinish={handleChangePassword}
                autoComplete="off"
            >
                <Form.Item
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu hiện tại',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu mới',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Xác nhận Mật khẩu mới"
                    name="confirmNewPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng xác nhận mật khẩu mới',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                {msgError && <span className="msg-error">{msgError}</span>}

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Xác nhận
                    </Button>
                </Form.Item>
            </Form>
        </WrapperChangePassword>
    )
}
