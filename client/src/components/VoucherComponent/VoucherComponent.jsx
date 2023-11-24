import { useLocation, useNavigate } from "react-router-dom";
import { calculatePriceFinal, convertDateAndTime, isExpiredVoucher, toastMSGObject } from "../../utils/utils";
import { WrapperVoucherAction, WrapperVoucherComponent, WrapperVoucherContent, WrapperVoucherImage } from "./style";
import {RightOutlined, ShoppingOutlined} from '@ant-design/icons';
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addVoucherSelected, removeVoucherSelected } from "../../redux/slices/voucherSlice";
import notMeetCondition from '../../assets/images/notMeetCondition.svg'
import { toast } from "react-toastify";
import { Badge } from "antd";

export default function VoucherComponent(props) {
    const {
        voucher,
        condition,
        handleGetVoucherByUser,
    } = props
    const locate = useLocation();
    const navigate = useNavigate();
    const [percentFS , setPercentFS] = useState(100);
    const [isBtnActive , setIsBtnActive] = useState(false);
    const dispatch = useDispatch();
    const vouchersSelected = useSelector(state => state.voucher.vouchersSelected);
    const order = useSelector(state => state.order);

    const isExpiredCoupon = useMemo(() => {
        return isExpiredVoucher(voucher?.expiredDate);
    },[voucher?.expiredDate])

    useEffect(() => {
        if(locate.pathname === '/cart' && vouchersSelected.some(vou => vou._id === voucher._id)){
            setIsBtnActive(true)
        }   
    },[])

    const handleApplyVoucher = async () => { // apply and cancel apply
        if(order.orderItemsSelected.length !== 0){
            setIsBtnActive(isBtnActive => !isBtnActive);
            if(isBtnActive){
                dispatch(removeVoucherSelected(voucher)) 
            }else{
                toast.success(`🙂 Áp dụng voucher ${voucher.content} thành công`, toastMSGObject({autoClose : 1000}))
                dispatch(addVoucherSelected(voucher))
            }
        }else{
            toast('🙂 Vui lòng chọn sản phẩm trước khi sử dụng voucher', toastMSGObject({theme : 'dark'}))
        }
    }

    const totalOriginPrice = useMemo(() => { // theo orderSelected
        return order?.orderItemsSelected?.reduce((total,item) => {
          return total + (calculatePriceFinal(item.price , item.discount) * item.amount)
        },0)
    },[order?.orderItemsSelected])

    // check xem voucher có thỏa mãn condition
    const isVouMeetCondition = useMemo(() => {
        const [typeCon , valueCon] = voucher.condition.split('-');
        switch (typeCon) {
            case 'cate':
                return order.orderItemsSelected.some(pro => pro.type === valueCon)
            case 'min':
                return totalOriginPrice >= +valueCon
            default:
                return true;
        }
    },[order.orderItemsSelected])

    useEffect(() => {
        if(!isVouMeetCondition){
            setIsBtnActive(false)
            dispatch(removeVoucherSelected(voucher)) 
        }
    },[isVouMeetCondition])

    const classifyBtnVoucher = useMemo(() => {
        if(locate.pathname === '/voucher'){
            return (
                <button 
                    className= {isExpiredCoupon || voucher?.remainQuantity===0 ? 'btn-unaction' : 'btn-action'}
                    onClick={() => !isExpiredCoupon && handleGetVoucherByUser(voucher?._id)}
                >
                    <div>{voucher?.remainQuantity===0 ? 'Hết lượt sử dụng' : 'lưu'}</div>
                    {voucher?.remainQuantity!==0 && !isExpiredCoupon && (<span>Lưu ngay</span>)}
                </button>
            )
        }else if(locate.pathname === '/customer/my-voucher'){
            setPercentFS(80);
            return (
                <div className="use-act" onClick={() => navigate('/cart')}>
                    Dùng ngay 
                    <RightOutlined />
                </div>
            )
        }else{
            setPercentFS(80);
            return (
                <div className="vou-act" onClick={handleApplyVoucher}>
                    {isVouMeetCondition ? (
                        <button>
                            {isBtnActive ? 'Bỏ chọn' : 'Áp dụng'}
                        </button>
                    ) : (
                        <img src={notMeetCondition} alt="not-meet-con" />
                    )}
                </div>
            )
        }
    },[locate.pathname , isBtnActive , order.orderItemsSelected])

    return (
        <Badge.Ribbon text={voucher.isNewUser ? 'Khách hàng mới' : 'Số lượng có hạn'} color={voucher.isNewUser ? 'cyan' : 'green'} placement="start" >
            <WrapperVoucherComponent className={isBtnActive && "voucher-apply-active"}>
                <WrapperVoucherImage percentFontSize={percentFS}>
                    <svg width="100%" height="100%" viewBox="0 0 112 106" fill="none" xmlns:xlink="http://www.w3.org/1999/xlink" class="sYRxe3">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 2a2 2 0 0 1 2-2h106v106H2a2 2 0 0 1-2-2v-3a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 0 0 0-6V2Z" fill="#EE4D2D"></path>
                        <path clip-rule="evenodd" d="M.25 2.25a2 2 0 0 1 2-2M0 101.25a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m2.25 101a2 2 0 0 1-2-2" stroke="#000" opacity="0.15" stroke-width="0.5"></path>
                        <path clip-rule="evenodd" d="M2 0.25h108m0 105.5H2m-1.75-1.75v-3m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6V2Z" opacity="0.15" stroke="#000" stroke-width="0.5"></path><path d="M106 .5v105Z" stroke="#000" stroke-opacity="0.15"></path>
                    </svg>        
                    <div className="voucher-title">
                        <ShoppingOutlined style={{fontSize: `${50*percentFS/100}px`}}/>
                        <div>HKT SHOP</div>
                    </div>
                </WrapperVoucherImage>
                <WrapperVoucherContent percentFontSize={percentFS}>
                    <div className="name">{voucher?.content}</div>
                    <div className="condition">{condition}</div>
                    <div className="expired-date">
                        {isExpiredCoupon ? 'Đã hết HSD' : `HSD: ${convertDateAndTime(voucher?.expiredDate).date}`}
                    </div>
                </WrapperVoucherContent>
                <WrapperVoucherAction percentFontSize={percentFS}>
                    {classifyBtnVoucher}
                </WrapperVoucherAction>
            </WrapperVoucherComponent>
        </Badge.Ribbon>
    )
}
