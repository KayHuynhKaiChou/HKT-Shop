import { Col } from "antd"
import VoucherComponent from "../../components/VoucherComponent/VoucherComponent"
import { WrapperVoucherBackground, WrapperVoucherPage, WrapperVouchers } from "./style"
import { useQuery } from "@tanstack/react-query"
import * as voucherService from '../../services/VoucherService'
import { conditionVoucher } from "../../utils/constant"
import { convertPrice, toastMSGObject } from "../../utils/utils"
import { useMutationHooks } from "../../hooks/useMutationHook"
import * as userService from "../../services/UserService"
import { useDispatch, useSelector } from "react-redux"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateUser } from "../../redux/slices/userSlice"
import { useEffect } from "react"

export default function VoucherPage() {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const getAllVoucher = async () => {
        const res = await voucherService.getAllVoucher();
        return res.data
    }

    const {data : listVoucher , isSuccess : isSuccessVouchers} = useQuery({queryKey : ['all-voucher-1'], queryFn : getAllVoucher})

    // add voucher to User

    const mutation = useMutationHooks(
        async (data) => {
            const { id, accessToken, ...rests } = data
            await userService.updateUser(rests, accessToken);
        }
    )

    const { data, isLoading, isSuccess, isError } = mutation

    useEffect(() => {
        if(isSuccess){
            toast.success('Voucher đã được lưu', toastMSGObject({}));
        }else if(isError){
            toast.error('Voucher không lưu thành công', toastMSGObject({}));
        }
    },[isSuccess , isError])

    const handleGetVoucherByUser = async (idVoucher) => {
        if(!user.name){
            toast.error('Vui lòng đăng nhập để lấy voucher' , toastMSGObject({}))
        }else if(user.listVouchers.includes(idVoucher)){
            toast.warn('Bạn chỉ được lấy voucher này 1 lần', toastMSGObject({}));
        }else{
            const newListIdVouchers = [...user.listVouchers , idVoucher]
            mutation.mutate({
                ...user,
                listVouchers : newListIdVouchers
            })
            dispatch(updateUser({...user, listVouchers: newListIdVouchers}))
            await voucherService.decreaseQuantityVoucher(idVoucher);
        }
    }

    const renderVoucherEmpty = () => (
        <div className="voucher-empty">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='120' 
                viewBox='0 0 140 120' fill='none'%3E%3Cpath fillRule='evenodd' clipRule='evenodd' d='M0 0h140v140H0V0z' 
                fillOpacity='0' /%3E%3Cpath d='M63 115a4 4 0 100-8 4 4 0 000 8zM77 23a4 4 0 100-8 4 4 0 000 8z' 
                stroke='%23E8E8E8' strokeWidth='2' /%3E%3Cpath fillRule='evenodd' clipRule='evenodd' d='M123 92a1 1 0 
                011 1v2.999l3 .001a1 1 0 010 2h-3v3a1 1 0 01-2 0v-3h-3a1 1 0 010-2h3v-3a1 1 0 011-1zM39 23a1 1 0 011 1v2.999L43 27a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3h-3a1 1 0 110-2h3v-3a1 1 0 011-1z' 
                fill='%23E8E8E8' /%3E%3Cpath d='M90.4 59.426a1.5 1.5 0 00-2.122-2.121L67.065 78.518a1.5 1.5 0 102.121 2.122L90.4 59.426z' 
                fill='%23BDBDBD' /%3E%3Cpath d='M70 67a6 6 0 100-12 6 6 0 000 12zM88 83a6 6 0 100-12 6 6 0 000 12z' stroke='%23BDBDBD' strokeWidth='3' /%3E%3Cpath 
                clipRule='evenodd' d='M110 43a4 4 0 014 4v13a9 9 0 00-9 9 9 9 0 009 9v13a4 4 0 01-4 4H30a4 4 0 01-4-4V78a9 9 0 100-18V47a4 4 0 014-4h80z' 
                stroke='%23BDBDBD' strokeWidth='2' /%3E%3Cpath d='M50.5 47h-2a1.5 1.5 0 00-1.5 1.5v41a1.5 1.5 0 001.5 1.5h2a1.5 1.5 0 001.5-1.5v-41a1.5 1.5 0 00-1.5-1.5z' 
                fill='%23E8E8E8' /%3E%3C/svg%3E"
            />
            <div>Hiện tại ko có voucher</div>
        </div>
    )

    return (
        <WrapperVoucherPage>
            {conditionVoucher.map(co => (
                <WrapperVoucherBackground key={co.key}>
                    <div className="title">
                        <img src="https://frontend.tikicdn.com/_desktop-next/static/img/mycoupon/coupon_code.svg" alt="" />
                        {`Voucher ${co.title}`}
                    </div>
                    <WrapperVouchers gutter={[16, 16]}>
                        {listVoucher?.filter(voucher => voucher.condition.includes(co.key) && !voucher.isNewUser)?.length === 0 && (
                            renderVoucherEmpty()
                        )}
                        {listVoucher?.filter(voucher => voucher.condition.includes(co.key) && !voucher.isNewUser)?.map(voucher => {
                            const condition = co.title.replace('Áp dụng cho', '') + ' ' + (co.key === 'min' ? convertPrice(voucher.condition.split('-')[1]) : voucher.condition.split('-')[1])
                            return (
                                <Col 
                                    className="voucher-item" 
                                    sm={24}
                                    lg={12} 
                                    key={voucher?._id}
                                >
                                    <VoucherComponent 
                                        voucher={voucher}
                                        condition={condition}
                                        handleGetVoucherByUser = {handleGetVoucherByUser}
                                    />
                                </Col>
                            )
                        })}
                    </WrapperVouchers>
                </WrapperVoucherBackground>
            ))}
            
        </WrapperVoucherPage>
    )
}
