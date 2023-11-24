import { Button, Col, Drawer, Empty, Image,Row} from "antd";
import { WrapperAdminProduct } from "../AdminProductComponent/style";
import TableComponent from "../TableComponent/TableComponent";
import { CheckCircleOutlined, EyeOutlined} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as userService from '../../services/UserService'
import * as orderService from '../../services/OrderService'
import { convertDateAndTime, convertPrice } from '../../utils/utils'
import { WrapperContainerMyOrder, WrapperMyOrder } from "../../pages/MyOrdersPage/style";
import { FormProfile, WrapperAvatar, WrapperContentProfile, WrapperHeader, WrapperItem, WrapperLabel, WrapperTextInform } from "../../pages/ProfilePage/style";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import NotOrderComponent from "../NotOrderComponent/NotOrderComponent";
import { statusOrder } from "../../utils/constant";

export default function AdminUser() {
  const [rowSelected , setRowSelected] = useState(''); 
  const [isLoading , setIsLoading] = useState(true);
  const [isOpenDraw , setIsOpenDraw] = useState(false);

  const fetchAllUsers = async () => {
    const res = await userService.getAllUsers();
    return res.data
  }

  const {data : listUsers , isLoading : isLoadingListUsers} = useQuery({queryKey: ['listUsers'], queryFn: fetchAllUsers})

  // const inforMoreUser = (idUser) => {
  //   const ordersUser = resultQueries[1]?.data?.filter(order => order?.user === idUser);
  //   return {
  //     totalMoneyUsed : ordersUser?.filter(order => order?.isPaid)?.reduce((total, order) => total + order?.totalPrice,0),
  //     orders : {
  //       quanlity : ordersUser?.filter(order => !order?.isCancel)?.length,
  //       details : ordersUser
  //     }
  //   }
  // }

  // const userRefresh = useMemo(() => {
  //   return resultQueries[0]?.data?.map(user => {
  //     const infor = inforMoreUser(user?._id);
  //     return {
  //       ...user, 
  //       totalMoneyUsed : infor?.totalMoneyUsed , 
  //       quanlityOrder : infor?.orders.quanlity ,
  //       detailOrders : infor?.orders.details
  //     }
  //   })
  // },[resultQueries[0] , resultQueries[1]])

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000);
  },[])

  const handleViewDetailsOrder = () => {
    setIsOpenDraw(true);
  }

  const columns = [
      {
          title: 'Họ và tên',
          dataIndex: 'name',
          render: (text) => <a>{text}</a>,
          width : 200,
          sorter: (a,b) => a.name.length - b.name.length,
          isSearchProps: true
      },
      {
          title: 'Email',
          dataIndex: 'email',
          render: (email) => <span>{email}</span>,
          sorter: (a,b) => a.email - b.email,
          isSearchProps: true
      },
      {
        title: 'Tổng tiền đã tiêu',
        dataIndex: 'totalSpentMoney',
        render: (totalSpentMoney) => <span>{convertPrice(totalSpentMoney)}</span>,
        align: 'center',
        sorter: (a,b) => a.totalSpentMoney - b.totalSpentMoney,
            filters: [
                {
                    text: 'Dưới 200k',
                    value: [0,200000],
                },
                {
                    text: 'Từ 200k đến 500k',
                    value: [200000,500000],
                },
                {
                    text: 'Từ 500k đến 2000k',
                    value: [500000,2000000],
                },
                {
                    text: 'Trên 2000k',
                    value: [2000000],
                },
              ],
        onFilter: ([start,end], record) => (end ? (record.totalSpentMoney <= end && record.totalSpentMoney >= start) : (record.totalSpentMoney >= start)),
      },
      {
        title: 'Tổng đơn hàng',
        dataIndex: 'totalOrders',
        render: (totalOrders) => <span>{totalOrders}</span>,
        align: 'center',
        sorter: (a,b) => a.totalOrders - b.totalOrders,
            filters: [
                {
                    text: 'Dưới 10',
                    value: [0,10],
                },
                {
                    text: 'Từ 10 đến 30',
                    value: [10,30],
                },
                {
                    text: 'Trên 30',
                    value: [30],
                },
              ],
        onFilter: ([start,end], record) => (end ? (record.totalOrders <= end && record.totalOrders >= start) : (record.totalOrders >= start)),
      },
      {
          title: 'Chi tiết',
          align: 'center',
          width: 100,
          render: () => <EyeOutlined style={{fontSize:"20px"}} onClick={handleViewDetailsOrder}/>
      },
  ];

  return (
    <LoadingComponent delay={0} isloading={isLoading}>
      {isLoading ? <Empty description="Đang tải dữ liệu" /> : (
        <>
          <WrapperAdminProduct>
              <div>Tổng số lượng khách hàng : {listUsers?.length}</div>
              <TableComponent 
                  columns={columns} 
                  listData={listUsers} 
                  isLoading={isLoadingListUsers}
                  isRowSelection = {false} 
                  onRow={(record,rowIndex) => {
                    return {
                        onClick : event => {
                            setRowSelected(record)
                        }
                    }
                }}                                
              />
          </WrapperAdminProduct>
          <Drawer
              title="Chi tiết người dùng"
              width={1050}
              onClose={() => setIsOpenDraw(false)}
              open={isOpenDraw}         
              style={{background: "#f1eeee"}}
          >
            <FormProfile>
              <WrapperHeader>Thông tin người dùng</WrapperHeader>
              <WrapperContentProfile>
                  <WrapperAvatar>
                      <WrapperLabel>Avatar</WrapperLabel>
                      <Image src={rowSelected?.avatar} preview={false}/>
                  </WrapperAvatar>
                  <WrapperTextInform>
                      <WrapperItem className="flex-start">
                          <WrapperLabel>Name</WrapperLabel>
                          <div>{rowSelected?.name}</div>
                      </WrapperItem>
                      <WrapperItem className="flex-start">
                          <WrapperLabel>Email</WrapperLabel>
                          <div>{rowSelected?.email}</div>
                      </WrapperItem>
                      <WrapperItem className="flex-start">
                          <WrapperLabel>Birthdate</WrapperLabel>
                          <div>{rowSelected?.birthdate || 'Chưa có thông tin'}</div>
                      </WrapperItem>
                      <WrapperItem className="flex-start">
                          <WrapperLabel>Gender</WrapperLabel>
                          <div>{rowSelected?.gender || 'Chưa có thông tin'}</div>
                      </WrapperItem>
                  </WrapperTextInform>                   
              </WrapperContentProfile>
            </FormProfile>
            <WrapperMyOrder style={{marginTop: "20px"}}>
              <WrapperHeader className="custome-header-order">Đơn hàng người dùng</WrapperHeader>
              {rowSelected?.orders?.length === 0 ? <NotOrderComponent/> : 
              rowSelected?.orders?.map(order => (
                <WrapperContainerMyOrder key={order.codeOrder}>
                  {order.status === 'CANCELLED' ? (
                    <div className="order-cancel">Đã hủy</div>
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
                    {order?.orderItems?.map(item => (
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
                  </div>
                  <div className="my-order-footer">
                    <div className="total-money">
                      <div className="total-money__label">Tổng tiền:</div>
                      <div className="total-money__value">{convertPrice(order?.totalPrice)}</div>
                    </div>
                  </div>
                </WrapperContainerMyOrder>
              ))}
            </WrapperMyOrder>
          </Drawer>
        </>
      )}
    </LoadingComponent>
  )
}
