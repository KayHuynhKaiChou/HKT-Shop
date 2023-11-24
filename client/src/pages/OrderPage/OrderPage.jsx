import { Button , Progress, message} from "antd";
import { CustomCheckBox, CustomCheckIconCircle, WrapperCart, WrapperCartContent, WrapperCartItem, WrapperCartItems, WrapperCartLeft, WrapperCartPrice, WrapperCartRight, WrapperCartTitle, WrapperHeaderCart, WrapperProgressPrice, WrapperVouchersChoice } from "./style";
import {useDispatch, useSelector} from 'react-redux'
import { WrapperQuantityChoose } from "../ProductDetailsPage/style";
import { changeAmount, removeAllOrderProduct, removeOrderProduct, setOrderItemsSelected } from "../../redux/slices/orderSlice";
import { useEffect, useMemo, useState } from "react";
import {calculatePriceFinal, convertPrice , handleChangeAmountBuy} from '../../utils/utils'
import { useNavigate } from 'react-router-dom'
import { BiSolidDiscount } from "react-icons/bi";
import { CheckCircleOutlined, ShoppingOutlined } from "@ant-design/icons";
import FormModalVoucher from "../../components/FormModalVoucherComponent/FormModalVoucher";

export default function OrderPage() {
  
  const dispatch = useDispatch();
  const vouchersSelected = useSelector(state => state.voucher.vouchersSelected);
  const order = useSelector(state => state.order); 
  const [listChecked , setListChecked] = useState(
    order?.orderItemsSelected.map((itemSelected) => itemSelected.product)
  );
  const [isModalMyVoucherOpen , setIsModalMyVoucherOpen] = useState(false);  
  const [percent, setPercent] = useState(0);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const messageBody = (msg = '') => {
    return {
      //type: 'success',
      content: (
        <div
          style={{
            backgroundColor: "black",
            backgroundClip: "border-box",
            padding: "10px 80px",
            borderRadius: "5px",
            color : "#fff"
          }}
        >
          {msg}
        </div>
      ),
      className: 'custome-msg',
      style: {
        marginTop: '40vh',
      },
      duration: 2           
    }
  }

  const handleSetAmountProduct = (action , amountChange , amountRemain , idItem) => {
    const amount = handleChangeAmountBuy(action , amountChange , amountRemain);
    if(amount){
      dispatch(changeAmount({
        idItem ,
        amountChange : amount
      }))
    }
  }

  // useEffect(() => {
  //   setListChecked(order?.orderItemsSelected.map((itemSelected) => itemSelected.product))
  // },[order?.orderItemsSelected])

  const handleDeleteOrderProduct = (idProduct) => {
    setListChecked([...listChecked].filter(IdChecked => IdChecked !== idProduct))
    dispatch(removeOrderProduct({idProduct}))
  }

  const handleDeleteAllOrderProduct = () => {
    if(listChecked.length === 0){
      messageApi.open('Vui lòng chọn sản phẩm để xóa');
    }else{
      dispatch(removeAllOrderProduct({idsProduct : listChecked}))
      setListChecked([])
    }
  }

  const handleSelectedItem = (e) => {
    if(listChecked.includes(e.target.value)){
      const filterListChecked = listChecked.filter((itemId) => itemId !== e.target.value);
      setListChecked(filterListChecked)
    }else{ 
      setListChecked([...listChecked,e.target.value])
    }
  }

  const handleSelectedAllItems = (e) => {
    if(e.target.checked){
      setListChecked(
        order?.orderItems.map((item) => item.product)
      )
    }else{
      setListChecked([])
    }
  }

  const totalOriginPrice = useMemo(() => { // theo orderSelected
    return order?.orderItemsSelected?.reduce((total,item) => {
      return total + (calculatePriceFinal(item.price , item.discount) * item.amount)
    },0)
  },[order?.orderItemsSelected , order?.totalQuantity])

  const totalDiscount = useMemo(() => { 
    return vouchersSelected.reduce((totalDis , vou) => {
      const [type , value] = vou.discount.split('-');
      if(type === 'number'){
        return totalDis + (+value)
      }else{
        return totalDis + (+totalOriginPrice)*value/100
      }
    },0)
  },[vouchersSelected.length])

  const totalMoneyPay = useMemo(() => { // theo orderSelected
    if(+totalOriginPrice <= +totalDiscount){
      return 0;
    }else{
      return Number.parseInt(totalOriginPrice)-Number.parseInt(totalDiscount)
    }
  },[order?.orderItemsSelected , order?.totalQuantity , vouchersSelected.length])

  useEffect(() => {
    setPercent(totalMoneyPay/300000*100)
  },[totalMoneyPay])

  // thưc hiện việc set các item đã đc select vào orderItemsSelected ở orderSilde.js
  useEffect(() => {
    dispatch(setOrderItemsSelected({idsProduct : listChecked}))
  },[listChecked])

  const handleConfirmBuyProduct = () => {
    if(listChecked?.length === 0){
      messageApi.open(messageBody('Vui lòng chọn sản phẩm để thực hiện thanh toán'))
    }else{
      navigate('/cart/payment',{ state : {
        totalOriginPrice,
        totalDiscount,
        freeShip : percent>=50 ? 15000 : percent>=100 ? 30000 : 0,
        totalMoneyPay,
      } })
    }
  }


  return (
    <div style={{padding: "10px 120px", backgroundColor:"#efefef" , height:"100vh"}}>
      {contextHolder}
      <WrapperCart>
        <WrapperCartTitle>Giỏ hàng</WrapperCartTitle>       
        <WrapperCartContent>
          <WrapperCartLeft>
            <WrapperProgressPrice>
              <Progress 
                percent={percent} 
                status="active" 
                showInfo={false} 
                strokeColor={'rgb(0, 171, 86)'}
              />
              <div className="step-price-first">
                0k
              </div>
              <div className="step-price-half">
                <div className="free-ship">Freeship 15k</div>
                <CustomCheckIconCircle style={{
                  background: percent>=50 ? 'rgb(0, 171, 86)' : 'rgba(0, 0, 0, 0.06)'
                }}/>
                150k
              </div>
              <div className="step-price-last">
                <div className="free-ship">Freeship 30k</div>
                <CustomCheckIconCircle style={{
                  background: percent>=100 ? 'rgb(0, 171, 86)' : 'rgba(0, 0, 0, 0.06)'
                }}/>
                300k
              </div>
            </WrapperProgressPrice>
            <WrapperHeaderCart>
              <label className="all-items">
                <CustomCheckBox onChange={handleSelectedAllItems} checked={listChecked?.length === order?.orderItems?.length} style={{paddingRight:"16px"}}/>
                <div>Tất cả ({order?.orderItems?.label} sản phẩm)</div>
              </label>
              <div>Đơn giá</div>
              <div>Số lượng</div>
              <div>Thành tiền</div>
              <div onClick={handleDeleteAllOrderProduct}>
                <img className="remove-all" src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/trash.svg" alt="" />
              </div>
            </WrapperHeaderCart>
            <WrapperCartItems>
              {order?.orderItems.map((item) => (
                <WrapperCartItem key={item?.product}>
                  <label className="all-items">
                    <CustomCheckBox onChange={handleSelectedItem} value={item?.product} checked={listChecked?.includes(item?.product)} style={{paddingRight:"16px"}}/>
                    <img className="item-image" src={item?.image} alt="" />
                    <div className="item-name">{item?.name}</div>
                  </label>
                  <div>{convertPrice(calculatePriceFinal(item?.price , item?.discount))}</div>
                  <WrapperQuantityChoose>
                    <div className="action-num-pro">
                      <button 
                        className="decrease" 
                        disabled={item.amount<=1}
                        onClick={() => handleSetAmountProduct(
                          'DECREASE',
                          item.amount - 1,
                          item.countInStock,
                          item.product // id của product
                        )}                      
                      >
                        <img src="https://frontend.tikicdn.com/_desktop-next/static/img/pdp_revamp_v2/icons-remove.svg" alt="" />
                      </button>
                      <input 
                        value={item?.amount} 
                        type="number" 
                        onChange={e => handleSetAmountProduct(
                          'INPUT',
                          +e.target.value,
                          item.countInStock,
                          item.product
                        )}
                      />
                      <button 
                        className="increase" 
                        disabled={item.amount>=999}
                        onClick={() => handleSetAmountProduct(
                          'INCREASE',
                          item.amount + 1,
                          item.countInStock,
                          item.product
                        )}                      
                      >
                        <img src="https://frontend.tikicdn.com/_desktop-next/static/img/pdp_revamp_v2/icons-add.svg" alt="" />
                      </button>
                    </div>
                    {item?.countInStock <=5 ? (
                      <span style={{width:"100%",justifyContent:"flex-start",marginTop:5}} className="count-in-stock">Chỉ còn {item?.countInStock} sản phẩm</span>
                    ) : null}
                  </WrapperQuantityChoose>
                  <div style={{color:"red"}}>{convertPrice(calculatePriceFinal(item?.price , item?.discount) * item?.amount)}</div>
                  <div onClick={() => handleDeleteOrderProduct(item?.product)}>
                    <img className="remove-all" src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/trash.svg" alt="" />
                  </div>
                </WrapperCartItem>
              ))}
            </WrapperCartItems>
          </WrapperCartLeft>
          <WrapperCartRight>
            <WrapperVouchersChoice>
              <div className="vou-header">
                <div className="header-content">HKT Shop khuyến mãi</div>
                <div className="header-ability">Có thể chọn 2</div>
              </div>
              <div className="vou-body">
                <div className="list-vou">
                  {vouchersSelected.map(vou => (
                    <div className="vou-item">
                      <div className="vou-img">
                      <svg width="100%" height="100%" viewBox="0 0 106 106" fill="none" xmlns:xlink="http://www.w3.org/1999/xlink" class="sYRxe3">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M0 2a2 2 0 0 1 2-2h106v106H2a2 2 0 0 1-2-2v-3a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 0 0 0-6V2Z" fill="#EE4D2D"></path>
                          <path clip-rule="evenodd" d="M.25 2.25a2 2 0 0 1 2-2M0 101.25a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m2.25 101a2 2 0 0 1-2-2" stroke="#000" opacity="0.15" stroke-width="0.5"></path>
                          <path clip-rule="evenodd" d="M2 0.25h108m0 105.5H2m-1.75-1.75v-3m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6V2Z" opacity="0.15" stroke="#000" stroke-width="0.5"></path><path d="M106 .5v105Z" stroke="#000" stroke-opacity="0.15"></path>
                      </svg>        
                      <div className="vou-title">
                          <ShoppingOutlined style={{fontSize:"20px"}}/>
                          <div>HKT SHOP</div>
                      </div>
                      </div>
                      <div className="vou-content">
                        {vou.content}
                      </div>
                      <div className="vou-act">
                        <CheckCircleOutlined />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="other-vou" onClick={() => setIsModalMyVoucherOpen(true)}>
                  <BiSolidDiscount/>
                  Hiển thị thêm voucher của bạn
                </div>
              </div>
            </WrapperVouchersChoice>
            <WrapperCartPrice>
              <ul className="price-items">
                <li className="price-item">
                  <div className="price-text">Tạm tính</div>
                  <div className="price-value">{listChecked?.length===0 ? convertPrice(0) : convertPrice(totalOriginPrice)}</div>
                </li>
                <li className="price-item">
                  <div className="price-text">Giảm giá</div>
                  <div className="price-value">-{listChecked?.length===0 ? convertPrice(0) : convertPrice(totalDiscount)}</div>
                </li>
              </ul>
              <div className="price-total">
                <div className="price-text">Tổng tiền</div>
                <div className="price-content">{listChecked?.length===0 ? convertPrice(0) : convertPrice(totalMoneyPay)}</div>
              </div>
            </WrapperCartPrice>
            <Button onClick={handleConfirmBuyProduct}>Mua hàng ({listChecked?.length})</Button>
          </WrapperCartRight>
        </WrapperCartContent>
      </WrapperCart>
    
      {/* {form modal my voucher} */}
      <FormModalVoucher isModalOpen={isModalMyVoucherOpen} setIsModalOpen={setIsModalMyVoucherOpen} />
    </div>
  )
}
