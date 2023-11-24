import { Button,DatePicker,Empty,Image,Input, Modal, Radio} from "antd";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { FormProfile, WrapperAvatar, WrapperButton, WrapperContentProfile, WrapperHeader, WrapperItem, WrapperLabel, WrapperProfile, WrapperTextInform, WrapperUpload } from "./style";
import * as userService from '../../services/UserService'
import { updateUser } from "../../redux/slices/userSlice";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64, toastMSGObject} from '../../utils/utils'
import dayjs from "dayjs";
import OTPInput from 'react-otp-input'
import { toast } from "react-toastify";

export default function ProfilePage() {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const [userProfile , setUserProfile] = useState({
        name : user?.name,
        email : user?.email,
        isVerifiedEmail : user?.isVerifiedEmail,
        avatar : user?.avatar,
        gender : user?.gender,
        birthdate : user?.birthdate
    })
    const [otp, setOtp] = useState('');
    const [isOpenModal , setIsOpenModal] = useState(false);
  
    const mutation = useMutationHooks(
        async (data) => {
            const { accessToken, ...rests } = data
            await userService.updateUser(rests, accessToken);
        }
    )

    const { data, isLoading, isSuccess, isError } = mutation

    useEffect(() => {
        if (isSuccess) {
            toast.success('Cập nhập thông tin thành công' , toastMSGObject({}));
            handleGetDetailsUser(user?.accessToken)
        } else if (isError) {
            toast.error('Lỗi cập nhật thông tin')
        }
    }, [isSuccess, isError])

    const handleUpdate = () => {
        mutation.mutate({ ...userProfile , accessToken: user?.accessToken })
    }

    const handleGetDetailsUser = async (token) => {
        const res = await userService.getDetailsUser(token)
        dispatch(updateUser({ ...res?.data, accessToken: token }))
    }

    const handleOnchangeField = (e) => {
        setUserProfile({
            ...userProfile,
            [e.target.name] : e.target.value
        })
    }

    const handleOnchangeAvatar = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj );
        }
        setUserProfile({...userProfile, avatar : file.preview})
    }

    const handleSendOTPviaEmail = () => {
        if(userProfile?.email){
            userService.verifyEmail({
                email : userProfile.email,
                codeOTP : null
            })
                .then(res => {
                    toast.success(res.message , toastMSGObject({}));
                    setIsOpenModal(true);
                })
                .catch(error => {
                    toast.info(error.response.data.message , toastMSGObject({theme : "colored"}));
                })
        }else{
            toast.error('Vui lòng nhập email để xác thực' , toastMSGObject({}))
        }
    }

    const handleVerifyEmail = () => {
        userService.verifyEmail({
            email : userProfile.email,
            codeOTP : otp
        })
            .then(res => {
                toast.success(res.message , toastMSGObject({}));
                setIsOpenModal(false);
                dispatch(updateUser({...user, isVerifiedEmail : true}))
            })
            .catch(error => {
                toast.info(error.response.data.message , toastMSGObject({theme : "colored"}));
            })
    }

    const handleCloseOTPForm = () => {
        setIsOpenModal(false);
        setOtp('')
    }

    return (
        <WrapperProfile>
            <LoadingComponent isloading={isLoading}>
                {user.email ? (
                    <FormProfile>
                        <WrapperHeader>Thông tin người dùng</WrapperHeader>
                        <WrapperContentProfile>
                            <WrapperAvatar>
                                <WrapperLabel>Avatar</WrapperLabel>
                                <Image src={userProfile.avatar} preview={false}/>
                                <WrapperUpload onChange={handleOnchangeAvatar} maxCount={1}>
                                    <Button icon={<UploadOutlined/>}>Image</Button>
                                </WrapperUpload>
                            </WrapperAvatar>
                            <WrapperTextInform>
                                <WrapperItem>
                                    <WrapperLabel>Tên đầy đủ</WrapperLabel>
                                    <Input name="name" value={userProfile.name} onChange={handleOnchangeField}/>
                                </WrapperItem>
                                <WrapperItem>
                                    <WrapperLabel>Email</WrapperLabel>
                                    <Input name="email" disabled={userProfile.isVerifiedEmail} value={userProfile.email} onChange={handleOnchangeField}/>
                                    {user?.isVerifiedEmail ? (
                                        <Button disabled>Đã xác thực</Button>
                                    ) : (
                                        <Button type="primary" onClick={handleSendOTPviaEmail}>Xác thực</Button>
                                    )}
                                </WrapperItem>
                                <WrapperItem>
                                    <WrapperLabel>Giới tính</WrapperLabel>
                                    <Radio.Group
                                        name="gender"
                                        onChange={handleOnchangeField}
                                        defaultValue={userProfile.gender}
                                    >
                                        <Radio value={'male'}>Nam</Radio>
                                        <Radio value={'female'}>Nữ</Radio>
                                        <Radio value={'other'}>Khác</Radio>
                                    </Radio.Group>
                                </WrapperItem>
                                <WrapperItem>
                                    <WrapperLabel>Ngày sinh</WrapperLabel>
                                    <DatePicker 
                                        defaultValue={userProfile?.birthdate ? dayjs(userProfile.birthdate,'DD/MM/YYYY') : null}
                                        format={'DD/MM/YYYY'}
                                        onChange={(_,dateString) => setUserProfile({...userProfile, birthdate : dateString})} 
                                    />
                                </WrapperItem>
                            </WrapperTextInform>                   
                        </WrapperContentProfile>
                        <WrapperButton>
                            <Button onClick={handleUpdate}>Cập nhật</Button>
                        </WrapperButton>
                    </FormProfile>
                ) : (
                    <Empty/>
                )}
            </LoadingComponent>

            <Modal
                open={isOpenModal}
                onCancel={handleCloseOTPForm}
                footer={null}
            >
                <h2>{`Vui lòng nhập OTP email`}</h2>
                <div>
                    <p>
                        {
                        `Để xác thực email này là của bạn, 
                        vui lòng nhập 1 mã code OTP gồm 6 chữ số đã được gửi qua email  
                        `
                        }
                        <b>{userProfile.email}</b>
                    </p>
                    <OTPInput
                        containerStyle={{ justifyContent: "center" }}
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span>-</span>}
                        renderInput={(props) => <input {...props} />}
                        inputType='number'
                        inputStyle={{
                            width: '3rem',
                            height: '3rem',
                            margin: '0 5px',
                            fontSize: '2rem',
                            borderRadius: '4px',
                            border: '1px solid rgba(0,0,0,.3)'
                        }}
                    />
                </div>
                <div>
                    <Button style={{ width: "100%" , marginTop:15}} type="primary" danger onClick={handleVerifyEmail}>
                        Xác nhận
                    </Button>
                </div>
            </Modal>
        </WrapperProfile>
    )
}
