import {AutoComplete, Badge, Col, Form, Image, Popover} from 'antd'
import { CustomModal, WrapperAccountHeader, WrapperCartHeader, WrapperContentPopover, WrapperHeader, WrapperMSGCartPopover, WrapperMainPageHeader, WrapperTextHeader } from './style'
import { CheckCircleOutlined, CloseOutlined, CloseSquareFilled, HomeOutlined, SearchOutlined, ShoppingCartOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react';
import SignInPage from '../../pages/SignInPage/SignInPage';
import SignUpPage from '../../pages/SignUpPage/SignUpPage';
import { useDispatch, useSelector } from 'react-redux'
import { resetUser } from '../../redux/slices/userSlice'
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { searchProduct } from '../../redux/slices/productSlice';
import { useDebounce } from '../../hooks/userDebounce';
import * as productService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query';
import { resetOrder } from '../../redux/slices/orderSlice';
import * as userService from '../../services/UserService'

export default function HeaderComponent(props) {
  const {
    setVisiblePopoverCart, 
    visiblePopoverCart, 
    clickBuyToShowModal = false,
    setClickBuyToShowModal,
    nameHeader = 'HKT SHOP' ,
    isHiddenSearch = false, 
    isHiddenCart = false , 
    isPaddingLR = true
  } = props
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [typeForm , setTypeForm] = useState('sign-in')
  const navigate = useNavigate();
  const searchText = useSelector(state => state?.product?.search);
  const searchDebounce = useDebounce(searchText, 500);
  const location = useLocation();
  const autoCompleteRef = useRef();
  const [formLogin] = Form.useForm();
  const [formRegister] = Form.useForm();
  const [visible, setVisible] = useState(false);

  // đc tạo ra để ngăn hiện form login khi user vẫn còn lưu phiên đăng nhập
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(user.name ? false : true)
    },[1000])

    return () => {
      clearTimeout(timer)
    }
  },[user.name])

  const handlePopoverVisibleChange = (visible) => {
    setVisible(visible);
  }

  const handleLogOut = async () => {
    navigate('/');
    await userService.logout();
    localStorage.removeItem('accessToken');
    dispatch(resetUser());
    dispatch(resetOrder());
  }

  // form login sẽ ẩn dựa vào user
  useEffect(() => {
    if(user.name){
      setIsModalOpen(false);
      setClickBuyToShowModal && setClickBuyToShowModal(false);
    }
  },[user])

  const contentUser = (
    <div>
      {user?.isAdmin ? (
        <WrapperContentPopover onClick={() => navigate('/system/admin')}>Quản lý hệ thống</WrapperContentPopover>
      ) : (
        <>
          <WrapperContentPopover onClick={() => navigate('/customer/profile-user')}>Thông tin tài khoản</WrapperContentPopover>
          <WrapperContentPopover onClick={() => navigate('/customer/my-order')}>Đơn hàng của tôi</WrapperContentPopover>                        
        </>
      )}
      <WrapperContentPopover onClick={handleLogOut} >Đăng xuất</WrapperContentPopover>
    </div>
  )

  const contentCart = (
    <WrapperMSGCartPopover>
      <div className="msg-title">
        <CheckCircleOutlined />
        Thêm vào giỏ hàng thành công
      </div>
      <button onClick={() => navigate('/cart')}>Xem giỏ hàng và thanh toán</button>
      <CloseOutlined onClick={() => setVisiblePopoverCart(false)} style={{position:"absolute" , top:8, right:8 }}/>
    </WrapperMSGCartPopover>
  )

  //filter product
  const fetchProductsAll = async (context) => {
    const search = context?.queryKey && context?.queryKey[1] // queryKey[1] là searchDebounce
    const res = await productService.getAllProduct(search)
    return res.data
  }

  const {data: products} = useQuery(['all-products-0',searchDebounce], fetchProductsAll )

  const handleRedirectToProduct = (value) => {
    const p = products?.find(product => product.name === value)
    navigate(`/product-details/${p.type}/${p._id}`)
  }

  useEffect(() => {
    isPopoverOpen && setIsPopoverOpen(false); // popover của cart sẽ ẩn 
    visible && setVisible(false);
    // làm mất focus của auto complete khi navigate sang component hoặc page khác 
    autoCompleteRef.current?.blur()
  },[location.pathname])

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    formLogin.resetFields();
    formRegister.resetFields();
  }

  return (
    <>     
      <WrapperHeader isPaddingLR={isPaddingLR} gutter={16}>
        <Col span={nameHeader !== 'HKT SHOP' ? 10 : 6}>
          <ShoppingOutlined style={{fontSize: "28px" , marginRight:"10px"}}/>
          <WrapperTextHeader>HKT Shop</WrapperTextHeader>
          {nameHeader !== 'HKT SHOP' ? (
              <span className='header-title'>{nameHeader}</span>
          ) : null}
        </Col>
        {!isHiddenSearch && (
        <Col span={10}>
          <AutoComplete
            ref={autoCompleteRef}
            style={{
              width: "85%",
            }}
            suffixIcon={<SearchOutlined style={{marginTop:'8px'}}/>}
            menuItemSelectedIcon={<SearchOutlined/>}
            placeholder="Bạn cần tìm gì ?"
            options={products?.map(product => {
              return {
                label : product.name,
                value : product.name 
              }
            })}
            onSearch={value => dispatch(searchProduct(value))}
            filterOption={true}
            onSelect={handleRedirectToProduct}
            allowClear={{
              clearIcon: <CloseSquareFilled />,
            }}
          >
          </AutoComplete>
        </Col>
        )}
        <Col span={8} style={{display:'flex', color:"#fff", justifyContent:"end", alignItems:"center"}}>
          <WrapperMainPageHeader onClick={() => navigate('/')}>
            <HomeOutlined style={{fontSize: "35px", marginRight:"5px"}}/>
            <div className='main-page'>Trang chủ</div>
          </WrapperMainPageHeader>
          <LoadingComponent isloading={false} >
            {(user?.avatar && user?.name) ? (
              <Popover 
                content={contentUser} 
                open={isPopoverOpen || visible} 
                placement='bottomLeft' 
                onVisibleChange={handlePopoverVisibleChange}
              >
                <WrapperAccountHeader onClick={() => setIsPopoverOpen(true)}>
                  <Image src={user.avatar} preview={false} />
                  <div className='name'>{user.name.substring(user.name.lastIndexOf(" ")+1)}</div>                 
                </WrapperAccountHeader>
              </Popover>
            ) : (
              <WrapperAccountHeader onClick={handleOpenModal} style={{display:"flex", alignItems:"center"}}>
                <UserOutlined style={{fontSize: "35px", marginRight:"5px"}}/>                   
                <div>Đăng nhập</div>
              </WrapperAccountHeader>
            )}
          </LoadingComponent>
          {(!user?.isAdmin && !isHiddenCart) && (
            <Popover content={contentCart} trigger={''} open={visiblePopoverCart} placement='bottomLeft'>
              <WrapperCartHeader onClick={() => navigate('/cart')}>
                <Badge count={order?.totalQuantity} size='small'>
                  <ShoppingCartOutlined style={{fontSize: "35px",color:"#fff"}}/>
                </Badge>
                <span>Giỏ hàng</span>
              </WrapperCartHeader>          
            </Popover>
          )}
        </Col>
      </WrapperHeader>
      <CustomModal width="727px" title={null} footer={null} open={clickBuyToShowModal || isModalOpen} onCancel={handleCloseModal}>        
          {typeForm === 'sign-in' ? <SignInPage form={formLogin} setTypeForm={setTypeForm} /> : <SignUpPage form={formRegister} setIsModalOpen={setIsModalOpen} setTypeForm={setTypeForm}/> }   
      </CustomModal>
    </>
  )
}
