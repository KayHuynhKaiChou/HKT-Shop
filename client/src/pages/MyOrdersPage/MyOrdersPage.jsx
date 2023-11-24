import { useDispatch, useSelector } from "react-redux";
import { WrapperContainerMyOrder, WrapperMyOrder } from "./style";
import { Button} from "antd";
import * as orderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { convertPrice , convertDateAndTime } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../redux/slices/orderSlice";
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import { CheckCircleOutlined } from "@ant-design/icons";
import NotOrderComponent from "../../components/NotOrderComponent/NotOrderComponent";
import { useState } from "react";
import { statusOrder } from "../../utils/constant";

export default function MyOrdersPage() {
  const user = useSelector(state => state?.user);
  const [codeOrders , setCodeOrders] = useState([])
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchAllOrderByUser = async () => {
    const res = await orderService.getAllOrderByUser(user?.id);
    return res.data;
  }

  const {isLoading : isLoadingOrders , data : orders} = useQuery({queryKey: ['orders'], queryFn: fetchAllOrderByUser})

  const handleBuyAgain = (orderItems) => {
    orderItems.forEach(orderItem => {
      dispatch(addOrderProduct({orderItem}))
    })
    navigate('/cart');
  }

  const handleHiddenPros = (codeOrder) => {
    if(codeOrders.includes(codeOrder)){
      setCodeOrders(codeOrders.filter(code => code !== codeOrder))
    }else{
      setCodeOrders([...codeOrders, codeOrder])
    }
  }

  const handleTakeTwoPros = (codeOrder , orderItems) => {
    return codeOrders.includes(codeOrder) ? orderItems.slice(0,2) : orderItems
  }

  return (
    <LoadingComponent tip="Loading" isloading={isLoadingOrders} >
      <div>
        <WrapperMyOrder>
          {orders?.length === 0 ? <NotOrderComponent/> : 
          orders?.map(order => (
            <WrapperContainerMyOrder key={order.codeOrder}>
              {order?.status === 'CANCELLED' ? (
                <div className="order-cancel">{statusOrder[order?.status]}</div>
              ) : (
                <>
                  <div className="order-status">
                    <div className="order-status__label">Thanh toán:</div>
                    <div className="order-status__value">{order?.isPaid ? 'đã thanh toán' : 'chưa thanh toán'}</div>
                  </div>
                  <div className="order-status">
                    <div className="order-status__label">Trạng thái:</div>
                    <div className="order-status__value">
                      {order?.status !== 'PENDING' ? (
                        <div className="order-approve">
                          <CheckCircleOutlined style={{color:"#fff", background:"rgb(0, 171, 86)", borderRadius:"50%" , marginRight: "7px"}}/>
                          <div>{statusOrder[order?.status]} - Dự kiến giao hàng : {convertDateAndTime(order?.createdAt,3).date}</div>                        
                        </div>
                      ) : statusOrder[order?.status]}
                    </div>
                  </div>              
                </>
              )}
              <div className="my-order-divider"></div>
              <div className="my-order-body">
                {handleTakeTwoPros(order?.codeOrder , order?.orderItems)?.map((item , index) => (
                  <>
                    <div key={item?.product} className="product">
                      <div className="detail">
                        <div className="product-img" style={{backgroundImage: `url(${item?.image})`}}>
                          <span className="quantity">x{item?.amount}</span>
                        </div>
                        <div className="product-info">{item?.name}</div>
                      </div>
                      <div className="price">{convertPrice(item?.price)}</div>
                    </div>
                    <div className="my-order-divider"></div>               
                  </>
                ))}
              {order?.orderItems.length > 2 && (
                <div className="my-order-act">
                  <button onClick={() => handleHiddenPros(order?.codeOrder)}>
                    {(codeOrders.includes(order?.codeOrder) ? 'Xem thêm' : 'Ẩn bớt') + ` ${order?.orderItems.length - 2} sản phẩm`}
                  </button>
                </div>
              )}
              </div>
              <div className="my-order-footer">
                <div className="total-money">
                  <div className="total-money__label">Tổng tiền:</div>
                  <div className="total-money__value">{convertPrice(order?.totalPrice)}</div>
                </div>
                <div className="button-group">
                  {order?.status === 'CANCELLED' ? <Button style={{marginRight:"10px"}} onClick={() => handleBuyAgain(order?.orderItems)}>Mua lại</Button> : null}
                  <Button onClick={() => navigate(`/customer/view-detail?id=${order?._id}`)}>Xem chi tiết</Button>
                </div>
              </div>
            </WrapperContainerMyOrder>

          ))}
        </WrapperMyOrder>
      </div>
    </LoadingComponent>
  )
}
