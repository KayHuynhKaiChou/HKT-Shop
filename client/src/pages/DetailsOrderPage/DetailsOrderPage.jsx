import { useNavigate, useSearchParams } from "react-router-dom";
import {CustomeModalCancel} from "./style";
import * as orderService from "../../services/OrderService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "antd";
import { useState } from "react";
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import DetailOrderComponent from "../../components/DetailOrderComponent/DetailOrderComponent";

export default function DetailsOrderPage() {
    const [query] = useSearchParams(); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const orderId = query.get('id');

    const handleCancelOrder = async () => {
        await orderService.cancelOrder(orderId);
        // khi orderService.cancelOrder thực thi xong thì setIsModal... thực thi và chạy lại DetailsOrderPage() , thì useQuery sẽ chạy lại
        // nhưng , nó vẫn sẽ trả về order cũ vì React Query sử dụng một bộ nhớ đệm để lưu trữ dữ liệu đã lấy để tối ưu hóa hiệu suất và tránh việc gọi lại API mỗi lần bạn gọi lại useQuery
        // nói cách khác thì phải mất 1 lúc sau thì useQuery mới lấy được order đã update, do đá cách khắc phục là : 1. Bạn trả về order đã update ở response rồi res.data để lấy như bình thường,
        // hoặc bạn có thể use :
        queryClient.invalidateQueries(['order-detail',orderId])
        setIsModalOpen(true)
    }

    return (
        <LoadingComponent tip="Loading" isloading={false} >
            <div style={{backgroundColor:"#efefef"}}>
                <DetailOrderComponent
                    idOrder = {orderId}
                    handleCancelOrder = {handleCancelOrder}
                />
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
