import { useNavigate, useSearchParams } from "react-router-dom";
import {CustomeModalCancel, WrapperHeader, WrapperInfoOrder, WrapperTableProducts } from "./style";
import * as orderService from "../../services/OrderService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { convertDateAndTime, convertPrice } from "../../utils/utils";
import {orderConstant} from '../../utils/constant'
import { Button } from "antd";
import { useState } from "react";
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'

export default function DetailsOrderPage() {
    const [query] = useSearchParams(); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const fetchOrderDetails = async(context) => {
        const res = await orderService.getOrderDetails(context?.queryKey[1]);
        return res.data;
    }

    const {isLoading : isLoadingOrder , data : order} = useQuery({queryKey: ['order', query.get('id')], queryFn: fetchOrderDetails})
    console.log(isLoadingOrder)

    const handleCancelOrder = async () => {
        await orderService.cancelOrder({...order,isCancel: true} ,order?._id);
        // khi orderService.cancelOrder thực thi xong thì setIsModal... thực thi và chạy lại DetailsOrderPage() , thì useQuery sẽ chạy lại
        // nhưng , nó vẫn sẽ trả về order cũ vì React Query sử dụng một bộ nhớ đệm để lưu trữ dữ liệu đã lấy để tối ưu hóa hiệu suất và tránh việc gọi lại API mỗi lần bạn gọi lại useQuery
        // nói cách khác thì phải mất 1 lúc sau thì useQuery mới lấy được order đã update, do đá cách khắc phục là : 1. Bạn trả về order đã update ở response rồi res.data để lấy như bình thường,
        // hoặc bạn có thể use :
        queryClient.invalidateQueries(['order',query.get('id')])
        setIsModalOpen(true)
    }

    return (
        <LoadingComponent tip="Loading" isloading={isLoadingOrder} >
            <div style={{backgroundColor:"#efefef"}}>
                <WrapperHeader>
                    <div className="code-order">{`Chi tiết đơn hàng #${order?.codeOrder}`}</div>
                    <div className="date-created">{`Ngày đặt hàng : ${convertDateAndTime(order?.createdAt).time} ${convertDateAndTime(order?.createdAt).date}`}</div>
                </WrapperHeader>
                <WrapperInfoOrder>
                    <div className="order-detail">
                        <div className="label">ĐỊA CHỈ NGƯỜI NHẬN</div>
                        <div className="value">
                            <div className="value-name">{order?.shippingAddress.fullName}</div>
                            <div className="value-address">
                                <span>Địa chỉ: {order?.shippingAddress.address}, {order?.shippingAddress.city}</span>
                            </div>
                            <div className="value-address">
                                <span>Điện thoại: {order?.shippingAddress.phone}</span>
                            </div>
                        </div>
                    </div>
                    <div className="order-detail">
                        <div className="label">HÌNH THỨC GIAO HÀNG</div>
                        <div className="value">
                            <div 
                                className="value-delivery"
                                dangerouslySetInnerHTML={{ __html: order?.deliveryMethod === 'fast' ? orderConstant?.delivery.fast : orderConstant?.delivery.fast }}  
                            />
                            <div className="value-feeship">
                                <span>Phí vận chuyển: </span>{order?.shippingPrice}
                            </div>
                        </div>
                    </div>
                    <div className="order-detail">
                        <div className="label">HÌNH THỨC THANH TOÁN</div>
                        <div className="value">{order?.paymentMethod === 'later_money' ? orderConstant?.payment.later_money : orderConstant?.payment.paypal}</div>
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
                        {order?.orderItems?.map(item => (
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
                            <td colSpan="4">
                                <span>Tạm tính</span>
                            </td>
                            <td>{convertPrice(order?.itemsPrice)}</td>
                        </tr>
                        <tr>
                            <td colSpan="4">
                                <span>Phí vận chuyển</span>
                            </td>
                            <td>{convertPrice(order?.shippingPrice)}</td>
                        </tr>
                        <tr>
                            <td colSpan="4">
                                <span>Tổng cộng</span>
                            </td>
                            <td>
                                <span className="sum">{convertPrice(order?.totalPrice)}</span>
                            </td>
                        </tr>
                        {order?.isCancel ? null : (
                            <tr>
                                <td colSpan="4">
                                    
                                </td>
                                <td>
                                    <Button onClick={handleCancelOrder}>Hủy đơn hàng</Button>
                                </td>
                            </tr>
                        )}
                    </tfoot>
                </WrapperTableProducts>
                <div className="redirect" onClick={() => navigate('/customer/my-order')}>{`<< Quay lại đơn hàng của tôi`}</div>
                <CustomeModalCancel width={'380px'} bodyStyle={{textAlign: "center"}} title="Cancel Order" open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)}>
                    <img src="https://salt.tikicdn.com/ts/upload/03/b2/49/d6e0011868792350aa44bcbd7e6ffeeb.png" alt="" />
                    <p>Đơn hàng của bạn đã được huỷ :
                    <br/>
                    Tiki mong được tiếp tục phục vụ bạn trong tương lai.
                    </p>
                    <Button onClick={() => navigate('/')}>Tiếp tục mua sắm</Button>
                </CustomeModalCancel>
            </div>
        </LoadingComponent>
    )
}
