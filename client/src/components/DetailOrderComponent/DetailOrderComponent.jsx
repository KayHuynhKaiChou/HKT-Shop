import { useQuery } from '@tanstack/react-query';
import React from 'react'
import * as orderService from '../../services/OrderService'
import { Button } from 'antd';
import { WrapperHeaderOrder, WrapperInfoOrder, WrapperTableProducts } from './style';
import { convertDateAndTime, convertPrice } from '../../utils/utils';
import { orderConstant } from '../../utils/constant';
import { useSelector } from 'react-redux';

export default function DetailOrderComponent(props) {
    const{
        idOrder,
        handleCancelOrder
    } = props
    const user = useSelector((state) => state.user)

    const fetchOrderDetails = async(context) => {
        const res = await orderService.getOrderDetails(context?.queryKey[1]);
        return res.data;
    }

    const {isLoading : isLoadingOrder , data : orderDetail} = useQuery({queryKey: ['order-detail', idOrder], queryFn: fetchOrderDetails})


    return (
        <>
            <WrapperHeaderOrder>
                <div className="code-order">{`Chi tiết đơn hàng #${orderDetail?.codeOrder}`}</div>
                <div className="date-created">{`Ngày đặt hàng : ${convertDateAndTime(orderDetail?.createdAt).time} ${convertDateAndTime(orderDetail?.createdAt).date}`}</div>
            </WrapperHeaderOrder>
            <WrapperInfoOrder>
                <div className="order-detail">
                    <div className="label">ĐỊA CHỈ NGƯỜI NHẬN</div>
                    <div className="value">
                        <div className="value-name">{orderDetail?.shippingAddress.fullName}</div>
                        <div className="value-address">
                            <span>Địa chỉ: {orderDetail?.shippingAddress.addressDetail}, {orderDetail?.shippingAddress.ward},
                                {orderDetail?.shippingAddress?.district?.split("-")[0]}, {orderDetail?.shippingAddress?.province?.split("-")[0]}
                            </span>
                        </div>
                        <div className="value-address">
                            <span>Điện thoại: {orderDetail?.shippingAddress.phone}</span>
                        </div>
                    </div>
                </div>
                <div className="order-detail">
                    <div className="label">HÌNH THỨC GIAO HÀNG</div>
                    <div className="value">
                        <div
                            className="value-delivery"
                            dangerouslySetInnerHTML={{ __html: orderDetail?.deliveryMethod === 'FAST' ? orderConstant?.delivery.fast : orderConstant?.delivery.gojek }}
                        />
                        <div className="value-feeship">
                            <span>Phí vận chuyển: </span>{orderDetail?.shippingPrice}
                        </div>
                    </div>
                </div>
                <div className="order-detail">
                    <div className="label">HÌNH THỨC THANH TOÁN</div>
                    <div className="value">{orderDetail?.paymentMethod === 'LATER_MONEY' ? orderConstant?.payment.later_money : orderConstant?.payment.paypal}</div>
                </div>
            </WrapperInfoOrder>
            <WrapperTableProducts>
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Giảm giá</th>
                        <th>Tạm tính</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDetail?.orderItems?.map(item => (
                        <tr key={item?.product}>
                            <td>
                                <div className="product-item">
                                    <img src={item?.image} alt="" />
                                    <div className="product-name">{item?.name}</div>
                                </div>
                            </td>
                            <td>{convertPrice(item?.price)}</td>
                            <td>{item?.amount}</td>
                            <td>{convertPrice(item?.price * item?.discount / 100)}</td>
                            <td>{convertPrice(item?.price - (item?.price * item?.discount / 100))}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={4}>
                            <span>Tạm tính</span>
                        </td>
                        <td>{convertPrice(orderDetail?.itemsPrice)}</td>
                    </tr>
                    <tr>
                        <td colSpan={4}>
                            <span>Phí vận chuyển</span>
                        </td>
                        <td>{convertPrice(orderDetail?.shippingPrice)}</td>
                    </tr>
                    <tr>
                        <td colSpan={4}>
                            <span>Tổng cộng</span>
                        </td>
                        <td>
                            <span className="sum">{convertPrice(orderDetail?.totalPrice)}</span>
                        </td>
                    </tr>
                    {orderDetail?.status === 'CANCELLED' || user.isAdmin ? null : (
                        <tr>
                            <td colSpan={4}>

                            </td>
                            <td>
                                <Button onClick={handleCancelOrder}>Hủy đơn hàng</Button>
                            </td>
                        </tr>
                    )}
                </tfoot>
            </WrapperTableProducts>
        </>
    )
}

