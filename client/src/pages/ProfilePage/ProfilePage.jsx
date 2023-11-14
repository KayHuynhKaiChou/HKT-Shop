import { Button,DatePicker,Empty,Image,Input, Radio} from "antd";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { FormProfile, WrapperAvatar, WrapperButton, WrapperContentProfile, WrapperHeader, WrapperItem, WrapperLabel, WrapperProfile, WrapperTextInform, WrapperUpload } from "./style";
import * as userService from '../../services/UserService'
import { updateUser } from "../../redux/slices/userSlice";
import * as message from '../../components/MessageComponent/MessageComponent'
import { UploadOutlined } from "@ant-design/icons";
import { getBase64} from '../../utils/utils'
import dayjs from "dayjs";

export default function ProfilePage() {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const [userProfile , setUserProfile] = useState({
        name : user?.name,
        email : user?.email,
        avatar : user?.avatar,
        gender : user?.gender,
        birthdate : user?.birthdate
    })
    console.log(userProfile);
  
    const mutation = useMutationHooks(
        async (data) => {
            const { accessToken, ...rests } = data
            await userService.updateUser(rests, accessToken);
        }
    )

    const { data, isLoading, isSuccess, isError } = mutation

    useEffect(() => {
        if (isSuccess) {
            message.success('Cập nhập thông tin thành công');
            handleGetDetailsUser(user?.accessToken)
        } else if (isError) {
            message.error('Lỗi cập nhật thông tin')
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

    return (
        <WrapperProfile>
            <LoadingComponent isloading={isLoading}>
                {userProfile?.email ? (
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
                                    <Input name="email" disabled value={userProfile.email} onChange={handleOnchangeField}/>
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
                                        defaultValue={dayjs(userProfile.birthdate,'DD/MM/YYYY')}
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
        </WrapperProfile>
    )
}
