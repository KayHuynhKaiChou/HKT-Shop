import { Button, Form, Input, Modal, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../redux/slices/userSlice';
import { listProvinces } from '../../utils/utils';

export default function ModalFormAddressShip({isModalOpen , setIsModalOpen}) {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [listCity , setListCity] = useState([]);
    const [form] = Form.useForm();

    const handleOnFinish = (inputValues) => {
        dispatch(updateUser({...user, ...inputValues}))
        setIsModalOpen(false)
    };

    useEffect(() => {
        if(isModalOpen){
            form.setFieldsValue({
                name : user?.name,
                phone : user?.phone,
                city: user?.city,
                address: user?.address
            })
        }
    },[isModalOpen])

    useEffect(() => {
        listProvinces().then(fetchList => {
          const listNameCity = Object.values(fetchList).map(city => ({value: city.name , label: city.name}));
          setListCity(listNameCity)
        })
    },[])

    return (
        <Modal width="527px" title={"Địa chỉ giao hàng"} footer={null} open={isModalOpen} onCancel={() => setIsModalOpen(false)}>
            <Form
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 18,
                }}
                layout="horizontal"
                style={{
                    maxWidth: 500,
                }}
                onFinish={handleOnFinish}
                autoComplete="on"
                form={form}
            >
                <Form.Item
                    label="Họ và Tên"
                    name="name"
                >
                    <Input value={user?.name} name="name" />
                </Form.Item>

                <Form.Item
                    label="Số Điện thoại"
                    name="phone"
                >
                    <Input value={user?.phone} name="phone" />
                </Form.Item>

                <Form.Item label="Tỉnh/Thành phố" name="city">
                    <Select
                        name="city"
                        mode="single"
                        style={{
                            width: '100%',
                        }}
                        value={user?.city}
                        placeholder="Chọn Tỉnh/Thành phố"
                        options={listCity}
                    />
                </Form.Item>

                <Form.Item
                    label="Địa chỉ"
                    name="address"
                >
                    <Input.TextArea name="address" value={user?.address} placeholder="Ví dụ : 52 Trần Hưng Đạo , phường Đống Đa , ..." size="small" rows={2} />
                </Form.Item>

                <Form.Item
                    wrapperCol={{ offset: 16 }}
                >
                    <Button style={{ width: "100%", padding: 0 }} className="btn-login" type="primary" htmlType="submit">
                        Giao đến địa chỉ này
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
