import { Button, Form, Image, Input, message } from "antd";
import { HeaderForm, WrapperFormLeft, WrapperFormLogin, WrapperImageRight} from "./style";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as userService from "../../services/UserService"
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { LeftOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import {useSelector } from "react-redux";


export default function SignUpPage({form = useForm , setIsModalOpen , setTypeForm}) {
  const {email , password , confirmPassword} = form.getFieldsValue();
  const user = useSelector(state => state.user);

  // handle sign up
  const mutationSignUp = useMutationHooks(
    (data) => userService.signupUser(data)
  )

  const { data, isLoading , isSuccess } = mutationSignUp;

  const handleSignUp = (inputValues) => {
    mutationSignUp.mutate(inputValues); // rerender lại component này
  }

  useEffect(() => {
    if(isSuccess && data?.status !== "ERR"){
      form.resetFields();
      message.success('Đăng ký tài khoản thành công')
      setIsModalOpen(false);
      setTypeForm('sign-in');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isSuccess])

  return (
    <WrapperFormLogin>
      <WrapperFormLeft>
        <LeftOutlined onClick={() => setTypeForm('sign-in')}/>
        <HeaderForm>
          <h4>Đăng ký bằng Email</h4>
          <p>Vui lòng đăng ký email và mật khẩu</p>
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
            maxWidth: 600,position: "relative"
          }}
          initialValues={{
            remember: true,
            position: "relative"
          }}
          onFinish={handleSignUp}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              }
            ]}
            help={email && data?.msg.includes('email') ? data?.msg : undefined}
            validateStatus={email && data?.msg.includes('email') ? "error" : undefined}
          >
            <Input placeholder="abc@gmail.com" />
          </Form.Item>

          <Form.Item  
            name="password"          
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password placeholder="Mật khẩu"/>
          </Form.Item>

          <Form.Item 
            name="confirmPassword"           
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              }
            ]}
            help={confirmPassword && data?.msg.includes('Mật khẩu xác thực') ? data?.msg : undefined}
            validateStatus={confirmPassword && data?.msg.includes('Mật khẩu xác thực') ? "error" : undefined}
          >
            <Input.Password placeholder="Nhập lại mật khẩu"/>
          </Form.Item>

          <Form.Item>
            <LoadingComponent isloading={isLoading}>
              <Button className="btn-login" type="primary" htmlType="submit">
                Đăng ký
              </Button>
            </LoadingComponent>
            <p className="create-account">Bạn đã có tài khoản ? 
              <span className="link-redirect" onClick={() => setTypeForm('sign-in')}>Đăng nhập ngay</span> 
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
