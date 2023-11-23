import { AppstoreOutlined, HomeOutlined, LineChartOutlined, RightOutlined, ShopTwoTone, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import {getItem} from '../../utils/utils'
import { Menu } from 'antd';
import { WrapperAdmin, WrapperManageObject } from './style';
import { useState } from 'react';
import AdminUser from '../../components/AdminUserComponent/AdminUser';
import AdminProduct from '../../components/AdminProductComponent/AdminProduct';
import AdminOrder from '../../components/AdminOrderComponent/AdminOrder';
import AdminDashboard from '../../components/AdminDashboard/AdminDashboard';
import { useNavigate } from 'react-router-dom';
import AdminVoucher from '../../components/AdminVoucherComponent/AdminVoucher';
import { BiSolidDiscount } from "react-icons/bi";

export default function AdminPage() {
  const navigate = useNavigate();
  const [keySelected, setKeySelected] = useState('Thống kê');
  const items = [
    getItem(<span>{'Thống kê'}</span>, 'Thống kê', <LineChartOutlined style={{fontSize:"20px",marginRight: '5px'}}/>),
    getItem(<span>{'Người dùng'}</span>, 'Người dùng', <UserOutlined style={{fontSize:"20px",marginRight: '5px'}}/>),
    getItem(<span>{'Sản phẩm'}</span>, 'Sản phẩm', <AppstoreOutlined style={{fontSize:"20px",marginRight: '5px'}} />),
    getItem(<span>{'Voucher'}</span>, 'Voucher', <BiSolidDiscount style={{fontSize:"20px",marginRight: '5px'}} />),
    getItem(<span>{'Đơn hàng'}</span>, 'Đơn hàng', <ShoppingCartOutlined style={{fontSize:"20px",marginRight: '5px'}} />),   
  ];

  const handleOnCLick = ({ key }) => {
    setKeySelected(key)
  }

  const renderPage = (key) => {
    switch (key) {
      case 'Thống kê':
        return (
          <AdminDashboard />
        )
      case 'Người dùng':
        return (
          <AdminUser />
        )
      case 'Sản phẩm':
        return (
          <AdminProduct />
        )
      case 'Voucher':
        return (
          <AdminVoucher />
        )
      case 'Đơn hàng':
        return (
          <AdminOrder/>
        )
      default:
        return <></>
    }
  }

  return (
    <WrapperAdmin>
      <div className="menu">
        <div onClick={() => navigate('/')} className="title-header">
          <ShopTwoTone style={{fontSize:"35px"}}/>
          <span>HKT SHOP</span>
        </div>
        <Menu     
          defaultSelectedKeys={['Thống kê']}  
          mode="inline"
          theme="dark"
          style={{
            //width: "20%",
            boxShadow: '1px 1px 2px #ccc',
            height: '100vh'
          }}
          items={items}
          onClick={handleOnCLick}
        />
      </div>
      <WrapperManageObject>
        <HeaderComponent nameHeader={keySelected} isPaddingLR={false} isHiddenSearch={true} isHiddenCart={true}/>
        <div className='wrapper-body-admin'>
          <div className='path-system'>
            <div className='page-main' onClick={() => navigate('/')}><HomeOutlined />Trang chủ</div>
            <RightOutlined style={{margin:"0 5px"}}/> 
            <div>Quản lý hệ thống</div>
            <RightOutlined style={{margin:"0 5px"}}/> 
            <div>{keySelected}</div>
          </div>
          {renderPage(keySelected)}
        </div>
      </WrapperManageObject>
    </WrapperAdmin>
  )
}
