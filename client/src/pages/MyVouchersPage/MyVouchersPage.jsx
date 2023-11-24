import { useDispatch, useSelector } from "react-redux"
import * as voucherService from '../../services/VoucherService'
import { useQuery } from "@tanstack/react-query";
import { WrapperVouchers } from "../VoucherPage/style";
import VoucherComponent from "../../components/VoucherComponent/VoucherComponent";
import { Col } from "antd";
import {convertPrice, isExpiredVoucher, toastMSGObject } from "../../utils/utils";
import { conditionVoucher } from "../../utils/constant";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useEffect } from "react";
import * as userService from "../../services/UserService"
import { toast } from 'react-toastify';
import { updateUser } from "../../redux/slices/userSlice";
import { WrapperEmptyVoucher } from "./style";

export default function MyVouchersPage({isModalForm = false}) {

    const user = useSelector(state => state.user); 
    const dispatch = useDispatch();

    
    const fetchGetVoucherByUser = async (context) => {

        const res = await voucherService.getVoucherByUser(context?.queryKey[1]);
        return res.data
    }

    const { data : vouchersByUser , refetch} = useQuery({queryKey : ['vouchers-by-user-0',user.id] , queryFn : fetchGetVoucherByUser}, {enabled : false})

    const mutationRemoveVouExpired = useMutationHooks(
        async (data) => {
            const { id, accessToken, ...rests } = data;
            return await userService.updateUser(rests, accessToken);
        }
    )

    const {data , isSuccess : isSuccessReVouEx} = mutationRemoveVouExpired;

    useEffect(() => {
        if(isSuccessReVouEx){
            refetch();
            toast('Có voucher hết hạn đã rời khỏi kho của bạn' , toastMSGObject({}));
        }
    },[data , isSuccessReVouEx])

    // tiến hành remove những voucher hết hạn ra khỏi kho voucher của user
    useEffect(() => {
        if(vouchersByUser){
            const expiredVou = vouchersByUser.find(vou => isExpiredVoucher(vou.expiredDate));
            const expiredVouRegister = user.listVouRegister.find(vou => isExpiredVoucher(vou.expiredDate));
            if(expiredVou || expiredVouRegister){
                const vouchersUnexpired = user.listVouchers.filter(vouId => vouId !== expiredVou._id);
                const vouchersUnexpiredRegister = user.listVouRegister.filter(vou => vou._id !== expiredVou._id);
                mutationRemoveVouExpired.mutate({
                   ...user,
                   listVouchers : vouchersUnexpired,
                   listVouRegister : vouchersUnexpiredRegister 
                })
                dispatch(updateUser({
                    ...user,
                    listVouchers: vouchersUnexpired,
                    listVouRegister: vouchersUnexpiredRegister 
                }))
            }
        }
    },[vouchersByUser])

    return (
        <div style={{
            background:"#fff",
            padding: `${isModalForm ? 0 : 16}px`
        }}>
            {user?.listVouRegister.length === 0 && user?.listVouchers.length === 0 ? (
                <WrapperEmptyVoucher>
                    <div className="vou-emp-cover">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='120' 
                        viewBox='0 0 140 120' fill='none'%3E%3Cpath fillRule='evenodd' clipRule='evenodd' d='M0 0h140v140H0V0z' 
                        fillOpacity='0' /%3E%3Cpath d='M63 115a4 4 0 100-8 4 4 0 000 8zM77 23a4 4 0 100-8 4 4 0 000 8z' 
                        stroke='%23E8E8E8' strokeWidth='2' /%3E%3Cpath fillRule='evenodd' clipRule='evenodd' d='M123 92a1 1 0 
                        011 1v2.999l3 .001a1 1 0 010 2h-3v3a1 1 0 01-2 0v-3h-3a1 1 0 010-2h3v-3a1 1 0 011-1zM39 23a1 1 0 011 1v2.999L43 27a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3h-3a1 1 0 110-2h3v-3a1 1 0 011-1z' 
                        fill='%23E8E8E8' /%3E%3Cpath d='M90.4 59.426a1.5 1.5 0 00-2.122-2.121L67.065 78.518a1.5 1.5 0 102.121 2.122L90.4 59.426z' 
                        fill='%23BDBDBD' /%3E%3Cpath d='M70 67a6 6 0 100-12 6 6 0 000 12zM88 83a6 6 0 100-12 6 6 0 000 12z' stroke='%23BDBDBD' strokeWidth='3' /%3E%3Cpath 
                        clipRule='evenodd' d='M110 43a4 4 0 014 4v13a9 9 0 00-9 9 9 9 0 009 9v13a4 4 0 01-4 4H30a4 4 0 01-4-4V78a9 9 0 100-18V47a4 4 0 014-4h80z' 
                        stroke='%23BDBDBD' strokeWidth='2' /%3E%3Cpath d='M50.5 47h-2a1.5 1.5 0 00-1.5 1.5v41a1.5 1.5 0 001.5 1.5h2a1.5 1.5 0 001.5-1.5v-41a1.5 1.5 0 00-1.5-1.5z' 
                        fill='%23E8E8E8' /%3E%3C/svg%3E"/>
                        <div className="content-main">Kho voucher của bạn đang trống</div>
                        <div className="content-support">Tìm các voucher hấp dẫn đang chờ bạn</div>
                        <button>Tìm voucher</button>
                    </div>
                </WrapperEmptyVoucher>
            ) : (
                <WrapperVouchers gutter={[16, 16]}>
                    {user.listVouRegister.map((voucher) => {
                        const [type , value] = voucher?.condition?.split('-')
                        const condition = conditionVoucher.find(con => con.key === type)?.title
                        return (
                            <Col 
                                style={{height:"120px"}} 
                                span={isModalForm ? 24 : 12}
                                key={voucher?._id}>
                                <VoucherComponent 
                                    voucher = {voucher}
                                    condition = {condition}
                                />
                            </Col>
                        )
                    })}
                    {vouchersByUser?.map(voucher => {
                        const [type , value] = voucher?.condition?.split('-')
                        const condition = conditionVoucher.find(con => con.key === type)?.title.replace('Áp dụng cho', '') +' '+ (type === 'min' ? convertPrice(value) : value)
                        return (
                            <Col 
                                style={{height:"120px"}} 
                                span={isModalForm ? 24 : 12} 
                                key={voucher?._id}
                            >
                                <VoucherComponent
                                    voucher = {voucher}
                                    condition = {condition}                               
                                />
                            </Col>
                        )
                    })}
                </WrapperVouchers>
            )}
        </div>
    )
}
