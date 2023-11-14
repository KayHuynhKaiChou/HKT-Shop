import { Menu } from "antd";
import { WrapperCustomer } from "./style";
import { getItem } from "../../utils/utils";
import { SolutionOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import ProfilePage from "../ProfilePage/ProfilePage";
import MyOrdersPage from "../MyOrdersPage/MyOrdersPage";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DetailsOrderPage from "../DetailsOrderPage/DetailsOrderPage";
import { BiSolidDiscount } from "react-icons/bi";
import MyVouchersPage from "../MyVouchersPage/MyVouchersPage";
import MyAddressShipPage from "../MyAddressShipPage/MyAddressShipPage";

export default function CustomerPage() {
    const user = useSelector(state => state.user);
    const {menu} = useParams();
    const navigate = useNavigate();
    const [keySelected, setKeySelected] = useState(menu);
    const items = [
        getItem(<span>{'Thông tin tài khoản'}</span>, 'profile-user', <UserOutlined style={{fontSize:"20px",marginRight: '13px'}}/>),
        getItem(<span>{'Đơn hàng của tôi'}</span>, 'my-order', <SolutionOutlined style={{fontSize:"20px",marginRight: '13px'}}/>),
        getItem(<span>{'Kho voucher'}</span>, 'my-voucher', <BiSolidDiscount style={{fontSize:"20px",marginRight: '13px'}}/>),
        getItem(<span>{'Sổ địa chỉ'}</span>, 'my-address', <BiSolidDiscount style={{fontSize:"20px",marginRight: '13px'}}/>),
    ];

    const dictionary = (key) => {
        switch (key) {
            case 'profile-user':
                return 'Thông tin tài khoản'
            case 'my-order':
                return 'Đơn hàng của tôi'
            case 'my-voucher':
                return 'Kho voucher'
            case 'my-address':
                return 'Sổ địa chỉ'
            default:
                break;
        }
    }

    const renderPage = () => {
        switch (keySelected) {
            case 'profile-user':
                return (
                    <ProfilePage />
                )
            case 'my-order':
                return (
                    <MyOrdersPage />
                )
            case 'view-detail':
                return (
                    <DetailsOrderPage/>
                )
            case 'my-voucher':
                return (
                    <MyVouchersPage/>
                )
            case 'my-address':
                return (
                    <MyAddressShipPage/>
                )
          default:
            return <></>
        }
    }

    const handleConvertMenu = ({key}) => {
        navigate(`/customer/${key}`)
    }

    useEffect(() => {
        setKeySelected(menu)
    },[menu])

    return (
        <WrapperCustomer>
            <div className="menu-customer">
                <div className="menu-customer__header">
                    <img src={user?.avatar} alt="" />
                    {user?.name}
                </div>
                <Menu   
                    selectedKeys={keySelected}  
                    //defaultSelectedKeys={'products'}  
                    mode="inline"
                    theme=""
                    items={items}
                    onClick={handleConvertMenu}                    
                />
            </div>
            <div className="ui-customer">
                <div className="ui-customer__header">{dictionary(keySelected)}</div>
                {renderPage()}
            </div>
        </WrapperCustomer>
    )
}
