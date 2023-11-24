import { Button, Form, Image, Input } from "antd";
import { HeaderForm, WrapperFormLeft, WrapperFormLogin, WrapperImageRight } from "./style";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as userService from '../../services/UserService'
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useEffect} from "react";
import jwt_decode from 'jwt-decode'
import {useNavigate, useParams} from 'react-router-dom'
import { useDispatch} from 'react-redux'
import { updateUser } from "../../redux/slices/userSlice";
import { useForm } from "antd/es/form/Form";
import { LockOutlined } from "@ant-design/icons";
import { CiMail } from "react-icons/ci";

export default function SignInPage({form = useForm , setTypeForm}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {type,id} = useParams(); // đây là id product bên page detail product
  const {email , password} = form.getFieldsValue();

  const mutation = useMutationHooks(
    (data) => userService.loginUser(data) // data chính là inputValues ở dưới
  )

  const { data , isLoading , isSuccess  } = mutation;  

  const onFinish = (inputValues) => {
    mutation.mutate(inputValues);
  }

  useEffect(() => {
    if(isSuccess && data?.status === 'OK'){
      form.resetFields();
      if(!id){
        navigate('/');
      }else{
        navigate(`/product-details/${type}/${id}`)
      }
      if(data?.accessToken){
        localStorage.setItem('accessToken',data?.accessToken);
        const decoded = jwt_decode(data?.accessToken);
        if(decoded.payload?._id){
          handGetDetailsUser(data?.accessToken);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isSuccess])

  const handGetDetailsUser = async (token) => {
    const res = await userService.getDetailsUser(token);
    dispatch(updateUser({...res?.data, accessToken: token}))
  } 

  return ( 
    <WrapperFormLogin>
      <WrapperFormLeft>
        <HeaderForm>
          <h4>Đăng nhập bằng Email</h4>
          <p>Vui lòng đăng nhập email và mật khẩu</p>
        </HeaderForm>
        <Form
          name="basic"
          form={form}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
            position: "relative"
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* {email} */}
          <Form.Item
            name="email" 
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập email!',
              }
            ]}
            help={email && data?.msg.includes('email') ? data?.msg : undefined}
            validateStatus={email && data?.msg.includes('email') ? "error" : undefined}
          >
            <Input 
              prefix={<CiMail className="site-form-item-icon" />} 
              placeholder="abc@gmail.com"
            />
          </Form.Item>
          
          {/* {password} */}
          <Form.Item  
            name="password"       
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu',
              },
            ]}
            help={password && data?.msg.includes('mật khẩu') ? data?.msg : undefined}
            validateStatus={password && data?.msg.includes('mật khẩu') ? "error" : undefined}
          >
            <Input.Password 
              prefix={<LockOutlined className="site-form-item-icon" />}   
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <LoadingComponent isloading={isLoading}>
              <Button className="btn-login" type="primary" htmlType="submit">
                Đăng nhập
              </Button>
            </LoadingComponent>
            <p className="forgot-password">Quên mật khẩu ?</p>
            <p className="create-account">Chưa có tài khoản ? 
              <span onClick={() => setTypeForm('sign-up')} className="link-redirect">Tạo tài khoản</span> 
            </p>
          </Form.Item>
        </Form>
      </WrapperFormLeft>
      <WrapperImageRight>
        <Image width="203px" height="203px" src="https://salt.tikicdn.com/ts/upload/eb/f3/a3/25b2ccba8f33a5157f161b6a50f64a60.png" preview={false}/>
        <div className="content">
          <h4 style={{marginBottom: "10px"}}>Mua sắm tại đây</h4>
          <span>Siêu ưu đãi mỗi ngày</span>
        </div>
      </WrapperImageRight>
    </WrapperFormLogin>
  )
}
