import { useLocation, useNavigate } from "react-router-dom";
import { WrapperContainerSuccess, WrapperLeftSuccess, WrapperOrderSuccess, WrapperRightSuccess } from "./style";
import { Button } from 'antd'
import { convertPrice } from "../../utils/utils";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeAllOrderProduct } from "../../redux/slices/orderSlice";
import { resetVoucher } from "../../redux/slices/voucherSlice";
import * as userService from "../../services/UserService"
import { updateUser } from "../../redux/slices/userSlice";

export default function OrderSuccessPage() {
  const {state} = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const vouchersSelected = useSelector(state => state.voucher.vouchersSelected);

  const vouchersRemainAfterUse = useMemo(() => {
    const idsVouSelected = vouchersSelected.map(vouSelected => vouSelected._id)
    return user.listVouchers.filter(vouId => !idsVouSelected.includes(vouId))
  },[])


  useEffect(() => {
    dispatch(removeAllOrderProduct(
      { idsProduct : state?.orderItems?.map(item => item.product)}
      ));
    if(vouchersSelected.length !== 0){
      const vouRegisterSelected = vouchersSelected.find(vou => vou.isNewUser)
      dispatch(updateUser({
        ...user, 
        listVouchers: vouchersRemainAfterUse,
        listVouRegister: vouRegisterSelected && []
      }));
      dispatch(resetVoucher());
    }
  },[])

  useEffect(() => {
    if(vouchersSelected.length === 0){
      const {id ,accessToken, ...rests} = user
      userService.updateUser(id, rests, accessToken);
    }
  },[user.listVouchers.length])


  return (
    <>
      <HeaderComponent nameHeader = 'Thành công' isHiddenSearch={true} isHiddenCart={true}/>
      <div style={{padding: "10px 130px", backgroundColor:"#efefef" , height:"100vh"}}>
        <WrapperOrderSuccess>
          <WrapperLeftSuccess>
              <WrapperContainerSuccess>
                  <img className="success-icon" src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/tiki-mascot-congrat.svg" alt="" />
                  <div className="background-success"></div>
                  <div className="success-content">
                    <div className="success-content__header">
                      <h1 className="title">Yay, đặt hàng thành công!</h1>
                      <h3 className="sub-title">
                        {state?.isPaid ? `Bạn đã thanh toán ${convertPrice(state?.totalPrice)} bằng ${state?.paymentMethod}` : `Chuẩn bị tiền mặt ${convertPrice(state?.totalPrice)}` }
                      </h3>
                    </div>
                    <div className="success-content__summary">
                      <div className="summary-item">
                        <div className="summary-item__label">Phương thức thanh toán</div>
                        <div className="summary-item__value">{state?.paymentMethod === 'LATER_MONEY' ? ' Thanh toán tiền mặt khi nhận hàng' : state?.paymentMethod}</div>
                      </div>
                      <div className="summary-item">
                        <div className="summary-item__label">Tổng cộng</div>
                        <div className="summary-item__value value-large">{convertPrice(state?.totalPrice)}</div>
                      </div>
                    </div>
                    <Button onClick={() => navigate('/')}>Quay về trang chủ</Button>
                  </div>
              </WrapperContainerSuccess>
          </WrapperLeftSuccess>
          <WrapperRightSuccess>
            <div className="order-email">
              <div>Thông tin chi tiết đơn hàng {state?.codeOrder} đã được gửi đến email <b>{user.email}</b></div>
            </div>
            <div className="order-header">
              <div className="order-header__title">Mã đơn hàng : {state?.codeOrder}</div>
              <div 
                className="order-header__link"
                onClick={() => navigate(`/customer/view-detail?id=${state?._id}`)}
              >
                Xem đơn hàng
              </div>
            </div>
            <div className="order-divider"></div>
            <div className="order-body">
              {state?.orderItems.map(item => (
                <div key={item?.product} className="order-body__item">
                  <div className="order-body__item--image">
                    <img style={{width:"48px", height:"48px" , objectFit: "contain"}} src={item?.image} alt="" />
                  </div>
                  <div className="order-body__item--name">{item?.name}</div>
                </div>
              ))}
            </div>
          </WrapperRightSuccess>
        </WrapperOrderSuccess>
      </div>
    </>
  )
}
