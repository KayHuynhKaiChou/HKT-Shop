import {AiOutlinePlus } from 'react-icons/ai'
import { Button, Input, Modal, Select , Form, Checkbox, Radio, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { getListDistricts, getListProvincesCity, getListWards, toastMSGObject} from '../../utils/utils';
import { getAddressShipsByUser , createAddressShip, updateAddressShip, deleteAddressShip } from '../../services/UserService';
import { useMutation, useQuery} from '@tanstack/react-query';
import { toast } from 'react-toastify';
import AddressShipItem from './AddressShipItem';
import { WrapperAddressShipComponent } from './style';
import provinces from '../../data/provinces.json';
import districts from '../../data/districts.json';
import wards from '../../data/wards.json';


export default function AddressShipComponent() {
  const [isModalOpen , setIsOpenModal] = useState(false);
  const [listProvinces , setListProvinces] = useState([]);
  const [listDistricts , setListDistricts] = useState([]); 
  const [listWards , setListWards] = useState([]); 
  const [form] = Form.useForm();
  const [isDisableCheckBox , setIsDisableCheckBox] = useState(false);
  const initialAddressShip = {
    fullName : '',
    phone : '',
    province : '',
    district : '',
    ward : '',
    addressDetail : '',
    type : '',
    default : false
  }
  const [addressShipping , setAddressShipping] = useState({
    ...initialAddressShip
  });
  const [isFormEdit , setIsFormEdit] = useState(false);


  const handleCancelModal = () => {
    setIsOpenModal(false);
    form.resetFields();
    setListDistricts([]);
    setListWards([]);
  }

  useEffect(() => {
    const fetchProvincesCity = async () => {
      //const data = await getListProvincesCity()
      setListProvinces(provinces)
    } 
    fetchProvincesCity();
  },[])

  const handleOnChangeInput = (e) => {
    setAddressShipping({
      ...addressShipping,
      [e.target.name] : e.target.name !== "default" ? e.target.value : e.target.checked
    })
  }

  const handleOnChangeProvince = async (nameCity , value) => {
    setAddressShipping({
      ...addressShipping ,
      province : nameCity + '-' + value.key,
      district : '',
      ward : ''
    })
    if(nameCity){
      setListDistricts([]);
      setListWards([]);
      form.setFieldsValue({
        district : "",
        ward : ""
      })
    }
    //setListDistricts(await getListDistricts(value.key))
    setListDistricts(districts.filter(district => district.province_id == value.key))
  }

  const handleOnChangeDistrict = async (nameDistrict , value) => {
    setAddressShipping({
      ...addressShipping ,
      district : nameDistrict + '-' + value.key
    })
    if(nameDistrict){
      setListWards([]);
      form.setFieldsValue({
        ward : ""
      })
    }
    //setListWards(await getListWards(value.key));
    setListWards(wards.filter(ward => ward.district_id == value.key))
  }

  const handleOnChangeWard = async (nameWard) => {
    setAddressShipping({
      ...addressShipping,
      ward : nameWard
    })
  }

  // handle get address ship by user

  const fetchGetAddressShipByUser = async () => {
    const res = await getAddressShipsByUser();
    return res
  }

  const queryAddressShip = useQuery({queryKey : ['get-addresses-ship-0'] , queryFn:fetchGetAddressShipByUser })
  const {data : listAddressShip} = queryAddressShip

  const handleShowFormAddressShip = () => {
    setIsOpenModal(true);
    setAddressShipping({...initialAddressShip})
  }

  // handle create new address ship

  const mutationCreateAddress = useMutation(
    async (data) => {
      const res = await createAddressShip(data)
      return res
    }
  )

  const {data : responseCreate , isSuccess : isSuccessCreate} = mutationCreateAddress;

  useEffect(() => {
    if(isSuccessCreate && responseCreate?.success){
      toast.success(responseCreate?.message, toastMSGObject({}))
      handleCancelModal();
    }
    // else{
    //   toast.error(responseCreate?.message , toastMSGObject({}))
    // }
  },[isSuccessCreate])

  const handleCreateAddressShip = () => {
    mutationCreateAddress.mutate({
      ...addressShipping
    } , {
      onSettled : () => {
        queryAddressShip.refetch();
      }
    })
  }

  // handle edit address ship

  const mutationEditAddress = useMutation(
    async (data) => {
      const res = await updateAddressShip(data);
      return res
    }
  )

  const {data : responseUpdate , isSuccess : isSuccessUpdate} = mutationEditAddress;

  useEffect(() => {
    if(isSuccessUpdate && responseUpdate?.success){
      toast.success(responseUpdate?.message, toastMSGObject({}))
      handleCancelModal();
    }
  },[isSuccessUpdate])

  const handleEditAddressShip = () => {
    mutationEditAddress.mutate({
      ...form.getFieldValue(),
      default : addressShipping.default
    } , {
      onSettled : () => {
        queryAddressShip.refetch();
      }
    })
  }


  const handleShowDetailAddressShip = async (address) => {
    setIsFormEdit(true);
    setIsOpenModal(true);
    const [province_name , province_id] = address.province.split('-');
    const [district_name , district_id] = address.district.split('-');
    form.setFieldsValue({
      ...address,
      province : province_name,
      district : district_name
    })
    setIsDisableCheckBox(address.default)
    setAddressShipping({...address})
    //setListDistricts(await getListDistricts(province_id))
    //setListWards(await getListWards(district_id))
    setListDistricts(districts.filter(district => district.province_id == province_id))
    setListWards(wards.filter(ward => ward.district_id == district_id))
  }

  // handle Delete address ship

  const mutationDeleteAddress = useMutation(
    async (data) => await deleteAddressShip(data)
  )

  const handleDeleteAddressShip = async (idAddressShip) => {
    if(confirm('Bạn chắc chắn muốn xóa địa chỉ này')){
      mutationDeleteAddress.mutate(idAddressShip, {
        onSettled : () => {
          queryAddressShip.refetch();
        }
      })
    }
  }

  const showTextToolTip = () => {
    return listAddressShip?.length === 0 ? `
      Địa chỉ đầu tiên của bạn được cài đặt làm Địa Chỉ Mặc Định. 
      Vui lòng thêm địa chỉ thứ hai để có thể thay đổi cài đặt này.
    ` : `
      Mỗi tài khoản phải có 1 địa chỉ mặc định.
    `
  }

  return (
    <WrapperAddressShipComponent>
      <div className="add-address" onClick={handleShowFormAddressShip}>
        <AiOutlinePlus />
        <span>Thêm địa chỉ ship mới</span>
      </div>
      {listAddressShip && listAddressShip?.map((address) => (
        <AddressShipItem 
          key={address._id}
          id={address._id}
          fullName={address.fullName}
          phone={address.phone}
          province={address.province}
          district={address.district}
          ward={address.ward}
          addressDetail={address.addressDetail}
          type={address.type}
          default={address.default}
          handleDeleteAddressShip={handleDeleteAddressShip}
          handleShowDetailAddressShip={handleShowDetailAddressShip}
        />
      ))}
      <Modal title={isFormEdit ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"} open={isModalOpen} footer={null} onCancel={handleCancelModal}>
        <Form
          name="wrap"
          form={form}
          labelCol={{ flex: '130px' }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
          style={{ maxWidth: 600 }}         
          onFinish={isFormEdit ? handleEditAddressShip : handleCreateAddressShip}
        >
          <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true }]}>
            <Input placeholder='Nhập Họ và tên' name='fullName' value={addressShipping.fullName} onChange={handleOnChangeInput}/>
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true }]}>
            <Input placeholder='Nhập Số điện thoại' name='phone' value={addressShipping.phone} onChange={handleOnChangeInput}/>
          </Form.Item>

          <Form.Item label="Tỉnh/thành phố" name="province" rules={[{ required: true }]}>
            <Select
              defaultValue={'---Chọn tỉnh/thành phố---'}
              onChange={handleOnChangeProvince}
            >
              <Select.Option value = {""}>---Chọn tỉnh/thành phố---</Select.Option>
              {listProvinces?.map(p => (
                <Select.Option key={p["province_id"]} value={p["province_name"]}>{p["province_name"]}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Quận/huyện" name="district" rules={[{ required: true }]}>
            <Select
              //value={addressShipping.district}
              disabled = {listDistricts.length === 0}
              defaultValue={'---Chọn quận/huyện---'}
              onChange={handleOnChangeDistrict}
            >
              <Select.Option value = {""}>---Chọn quận/huyện---</Select.Option>
              {listDistricts.map(d => (
                <Select.Option key={d["district_id"]} value={d["district_name"]}>{d["district_name"]}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Phường/xã" name="ward" rules={[{ required: true }]}>
            <Select
              disabled = {listWards.length === 0}
              defaultValue={'---Chọn phường/xã---'}
              onChange={handleOnChangeWard}
            >
              <Select.Option value={""}>---Chọn phường/xã---</Select.Option>
              {listWards.map(w => (
                <Select.Option key={w["ward_id"]} value={w["ward_name"]}>{w["ward_name"]}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Số nhà" name="addressDetail" rules={[{ required: true }]}>
            <Input.TextArea 
              placeholder='ví dụ : 52 Trần Hưng Đạo ...' 
              name='addressDetail'
              value={addressShipping.addressDetail}
              onChange={handleOnChangeInput}
            />
          </Form.Item>

          <Form.Item label="Loại địa chỉ" name="type">
            <Radio.Group name="type" onChange={handleOnChangeInput} value={addressShipping.type}>
              <Radio value={"HOME"}>HOME</Radio>
              <Radio value={"WORK"}>WORK</Radio>
              <Radio value={"OTHER"}>OTHER</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label=" " name="default">
            {listAddressShip?.length === 0 || isDisableCheckBox ? (
              <Tooltip title={showTextToolTip()}>
                <Checkbox 
                  className={'disable-checkbox'}
                  disabled
                  name="default" 
                  onChange={handleOnChangeInput} 
                  checked={addressShipping.default}
                >
                  Thiết lập như địa chỉ mặc định
                </Checkbox>                
              </Tooltip>
            ) : (
              <Checkbox 
                name="default" 
                onChange={handleOnChangeInput} 
                checked={addressShipping.default}
              >
                Thiết lập như địa chỉ mặc định
              </Checkbox>
            )}
          </Form.Item>

          <Form.Item label=" " >
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>     
    </WrapperAddressShipComponent>
  )
}
