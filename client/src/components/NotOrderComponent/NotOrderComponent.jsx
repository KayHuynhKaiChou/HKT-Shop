import { ViewNotOrder } from "./style";
import orderIcon from '../../assets/images/order.png'

export default function NotOrderComponent() {
  return (
    <ViewNotOrder>
        <div className="not-order">
            <img className="not-order-icon" src={orderIcon}></img>
            <div className="not-order-msg">Chưa có đơn hàng</div>
        </div>
    </ViewNotOrder>
  )
}
