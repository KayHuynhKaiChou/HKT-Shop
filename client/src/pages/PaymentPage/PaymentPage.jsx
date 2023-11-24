import { Button,Modal,Radio, Tag} from "antd";
import { WrapperCartPrice } from "../OrderPage/style";
import { CustomRadio, WrapperAddressShip, WrapperLeft, WrapperMethods, WrapperPayment, WrapperRight, WrapperShipping } from "./style";
import { useSelector } from "react-redux";
import { convertPrice, toastMSGObject} from "../../utils/utils";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {useMutationHooks} from "../../hooks/useMutationHook"
import { PayPalButton } from "react-paypal-button-v2";
import * as orderService from '../../services/OrderService'
import * as paymentService from '../../services/PaymentService'
import * as message from '../../components/MessageComponent/MessageComponent' 
import { UpOutlined } from "@ant-design/icons";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import { getAddressShipsByUser } from "../../services/UserService";
import { useQuery } from "@tanstack/react-query";
import AddressShipItem from '../../components/AddressShipComponent/AddressShipItem'
import { WrapperAddressShipComponent } from "../../components/AddressShipComponent/style";
import { ToastContainer, toast } from "react-toastify";


export default function PaymentPage() {
    const [isLoading , setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {state} = useLocation();
    const order = useSelector(state => state.order);
    const [isOpenModalAddress , setIsOpenModalAddress] = useState(false)
    const [delivery , setDelivery] = useState('FAST')
    const [payment , setPayment] = useState('LATER_MONEY')
    const [sdkReady , setSdkReady] = useState(false);
    const [isShowOrderSelected , setIsShowOrderSelected] = useState(false);
    const [addressShipSelect, setAddressShipSelect] = useState({});

    // handle address ship
    const fetchGetAddressShipByUser = async () => {
        const res = await getAddressShipsByUser();
        return res;
    };

    const queryAddressShip = useQuery(["addresses-ship-by-user-1"],fetchGetAddressShipByUser);
    const { data: listAddressShip, isSuccess: isSuccessListAddressShip } = queryAddressShip;
    queryAddressShip.refetch();
    
    useEffect(() => {
        isSuccessListAddressShip &&
        setAddressShipSelect(
            listAddressShip?.find((as) => as.default)
        );
    }, [isSuccessListAddressShip, listAddressShip]);

    useEffect(() => {
        isSuccessListAddressShip && setIsOpenModalAddress(false);
    }, [addressShipSelect]);
    // calculate Price Final -----------------------------------------------------------------
    const priceDelivery = useMemo(() => { // khuyến mãi vận chuyển
        return delivery === 'FAST' ? 32000 : 45000
    },[delivery])

    const priceFinal = useMemo(() => { // khuyến mãi vận chuyển
        return state?.totalMoneyPay + (priceDelivery - state?.freeShip)
    },[delivery])

    const quantityProductsSelected = useMemo(() => {
        return order?.orderItemsSelected?.reduce((total , order) => total + order.amount , 0)
    },[order?.orderItemsSelected])

    // Add an Order ----------------------------------------------------------
    const mutationAddOrder = useMutationHooks(
        data => orderService.createOrder(data)
    )

    const handleAddOrder = () => {
        if(listAddressShip.length === 0){
            toast.info("Sổ địa chỉ của bạn đang trống" , toastMSGObject({theme:"colored"}));
            return;
        }
        setIsLoading(true);
        mutationAddOrder.mutate({
            orderItems: order?.orderItemsSelected, 
            deliveryMethod: delivery,
            paymentMethod: payment,
            addressShipId: addressShipSelect._id,
            itemsPrice: state?.totalMoneyPay,
            shippingPrice: priceDelivery - state?.freeShip,
            totalPrice: priceFinal,
        })
    }

    const {data : orderCreated, isSuccess : isSuccessCreated , isError : isErrorCreated } = mutationAddOrder

    useEffect(() => {
        if(isSuccessCreated){
            navigate('/cart/payment/success',{ state : orderCreated?.data});
        }else if(isErrorCreated){
            message.error(); 
        }
    },[isSuccessCreated , isErrorCreated])

    // payment
    const addPaypalScript = async () => {
        const { data } = await paymentService.getConfig()
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
        script.async = true;
        script.onload = () => {
          setSdkReady(true)
        }
        document.body.appendChild(script)
    }

    const onSuccessPaypal = (details) => {
        mutationAddOrder.mutate({
            orderItems: order?.orderItemsSelected, 
            deliveryMethod: delivery,
            paymentMethod: payment,
            addressShipId: addressShipSelect._id,
            itemsPrice: state?.totalMoneyPay,
            shippingPrice: priceDelivery - state?.freeShip,
            totalPrice: priceFinal,
        })
    }
    
    useEffect(() => {
        if(!window.paypal) {
            addPaypalScript()
        }else {
            setSdkReady(true)
        }
    }, [])

    return (
        <>
            <ToastContainer/>
            <HeaderComponent nameHeader = 'Thanh toán' isHiddenSearch={true} isHiddenCart={true}/>
            <div style={{padding: "10px 120px", backgroundColor:"#efefef" , height:"100vh"}}>
                <WrapperMethods>
                    <WrapperLeft>
                        <WrapperShipping>
                            <div className="method-title">Chọn hình thức giao hàng</div>
                            <CustomRadio value={delivery} onChange={(e) => setDelivery(e.target.value)}>
                                <Radio value="FAST"><span className="method-value" >FAST</span> Giao hàng tiết kiệm</Radio>
                                <Radio value="GOJEK"><span className="method-value" >GO_JEK</span> Giao hàng tiết kiệm</Radio>
                            </CustomRadio>
                        </WrapperShipping>
                        <WrapperPayment>
                            <div className="method-title">Chọn hình thức thanh toán</div>
                            <CustomRadio value={payment} onChange={(e) => setPayment(e.target.value)}>
                                <Radio value="LATER_MONEY"> Thanh toán tiền mặt khi nhận hàng</Radio>
                                <Radio value="PAYPAL"> Thanh toán tiền bằng paypal</Radio>  
                            </CustomRadio>
                        </WrapperPayment>
                    </WrapperLeft>

                    <WrapperRight>
                        <WrapperAddressShip>
                            {listAddressShip?.length === 0 ? (
                                <div className="not-address">
                                    <div className="not-address__title">Hiện tại sổ địa chỉ của bạn đang trống</div>
                                    <div 
                                        className="not-address__act"
                                        onClick={() => navigate("/customer/my-address")}
                                    >
                                        Thêm địa chỉ mới tại đây
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="block-header">
                                        <div className="block-header__title">Giao tới</div>
                                        <div className="block-header__nav" onClick={() => setIsOpenModalAddress(true)}>Thay đổi</div>
                                    </div>
                                    <div className="customer-info">
                                        <div className="customer-info__name">{addressShipSelect?.fullName}</div>
                                        <i></i>
                                        <div className="customer-info__phone">{addressShipSelect?.phone}</div>
                                    </div>
                                    <div className="address-ship">
                                        <Tag color="success">{addressShipSelect?.type}</Tag>
                                        {addressShipSelect?.addressDetail}, {addressShipSelect?.ward}, {addressShipSelect?.district.split('-')[0]}, {addressShipSelect?.province.split('-')[0]}
                                    </div>
                                </>
                            )}
                        </WrapperAddressShip>
                        <WrapperCartPrice>
                            <div className="order-selected">
                                <div className="order-selected__title">
                                    <h3>Đơn hàng</h3>
                                    <div onClick={() => navigate('/cart')}>Thay đổi</div>
                                </div>
                                <div className="order-selected__action">
                                    <p className="order-selected__quantity">{`${state?.product ? 1 : quantityProductsSelected} sản phẩm.`}</p>
                                    <p className="order-selected__infor">
                                        {isShowOrderSelected ? (
                                            <div onClick={() => setIsShowOrderSelected(false)}>
                                                Thu gọn
                                                <UpOutlined className="rotation_minus180" />
                                            </div>
                                        ) : (
                                            <div onClick={() => setIsShowOrderSelected(true)}>
                                                Xem thông tin
                                                <UpOutlined className='rotation_plus180' />                                      
                                            </div>  
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className={isShowOrderSelected ? 'showList' : 'hiddenList'}>
                                <div className="list-products">
                                    {state?.product ? (
                                        <div key={state?.product.codeOrder} className="product">
                                            <div className="product-info">
                                                <div className="product-info__qty">x{state?.product.quantity}</div>
                                                <div className="product-info__name">{state?.product.name}</div>
                                            </div>
                                            <div className="product-price">{convertPrice(state?.product.price)}</div>
                                        </div>
                                    ) : 
                                        order?.orderItemsSelected?.map(order => (
                                            <div key={order.codeOrder} className="product">
                                                <div className="product-info">
                                                    <div className="product-info__qty">x{order.amount}</div>
                                                    <div className="product-info__name">{order.name}</div>
                                                </div>
                                                <div className="product-price">{convertPrice(order.price)}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <ul className="price-items">
                                <li className="price-item">
                                    <div className="price-text">Tạm tính</div>
                                    <div className="price-value">{convertPrice(state?.totalMoneyPay)}</div>
                                </li>
                                <li className="price-item">
                                    <div className="price-text">Phí vận chuyển</div>
                                    <div className="price-value">{convertPrice(priceDelivery)}</div>
                                </li>
                                <li className="price-item">
                                    <div className="price-text">khuyến mãi vận chuyển</div>
                                    <div style={{color: 'rgb(0, 171, 86)'}} className="price-value">-{convertPrice(state?.freeShip)}</div>
                                </li>
                            </ul>
                            <div className="price-total">
                                <div className="price-text">Tổng tiền</div>
                                <div className="price-content">{convertPrice(priceFinal)}</div>
                            </div>
                        </WrapperCartPrice>
                        {payment === 'paypal' && sdkReady ? (
                            <div style={{width:"100%",marginTop: '15px'}}>
                                <PayPalButton
                                    amount={Math.round(priceFinal * 0.000041)}
                                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                    onSuccess={onSuccessPaypal}
                                    //
                                    onError={(error) => {
                                        if (error.name === 'CHECKOUT_FAILED') {
                                            alert('Tài khoản của bạn không đủ tiền để thanh toán.');
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <Button onClick={handleAddOrder} >
                                {isLoading ? (
                                    <>
                                        . . . <span>Đang đặt hàng</span>                                    
                                    </>
                                ) : 'Đặt hàng' }                             
                            </Button>
                        )}
                    </WrapperRight>
                </WrapperMethods>               
            </div>
            {/* {form change address ship} */}
            {/* <ModalFormAddressShip isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} /> */}
            <Modal
                title="Sổ địa chỉ của bạn"
                open={isOpenModalAddress}
                footer={null}
                onCancel={() => setIsOpenModalAddress(false)}
                width={720}
            >
                <div id="AddressShipComponent">
                    <WrapperAddressShipComponent>
                        <div className="instructor-address">
                            Vui lòng chọn địa chỉ giao hàng có sẵn bên dưới
                        </div>
                        {listAddressShip &&
                            listAddressShip?.map((address) => (
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
                                    setAddressShipSelect={setAddressShipSelect}
                                />
                            ))
                        }
                        <div className="redirect-profile">
                            Bạn muốn giao hàng đến địa chỉ khác?
                            <span onClick={() => navigate("/customer/my-address")}>
                            {" "}
                            Thêm địa chỉ mới tại đây
                            </span>
                        </div>
                    </WrapperAddressShipComponent>
                </div>
            </Modal>
        </>
    )
}
