/* eslint-disable no-unused-vars */
import { Button, Col, Drawer, Empty, Image, Input, Row, Space } from "antd";
import { WrapperAdminProduct } from "../AdminProductComponent/style";
import TableComponent from "../TableComponent/TableComponent";
import Highlighter from "react-highlight-words";
import { CheckCircleOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import * as userService from '../../services/UserService'
import * as orderService from '../../services/OrderService'
import { convertDateAndTime, convertPrice } from '../../utils/utils'
import { WrapperContainerMyOrder, WrapperMyOrder } from "../../pages/MyOrdersPage/style";
import { FormProfile, WrapperAvatar, WrapperContentProfile, WrapperHeader, WrapperItem, WrapperLabel, WrapperTextInform } from "../../pages/ProfilePage/style";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import NotOrderComponent from "../NotOrderComponent/NotOrderComponent";

export default function AdminUser() {
  const [rowSelected , setRowSelected] = useState('');
  const [isLoading , setIsLoading] = useState(true);
  const [isOpenDraw , setIsOpenDraw] = useState(false);

  const fetchAllUsers = async () => {
    const res = await userService.getAllUsers();
    return res.data
  }

  const fetchAllOrders = async () => {
    const res = await orderService.getAllOrder();
    return res.data
  }

  const resultQueries = useQueries({
    queries : [
        {queryKey: ['users'], queryFn: fetchAllUsers},
        {queryKey: ['all-orders-2'], queryFn: fetchAllOrders},
    ]
  })

  const inforMoreUser = (idUser) => {
    const ordersUser = resultQueries[1]?.data?.filter(order => order?.user === idUser);
    return {
      totalMoneyUsed : ordersUser?.filter(order => order?.isPaid)?.reduce((total, order) => total + order?.totalPrice,0),
      orders : {
        quanlity : ordersUser?.filter(order => !order?.isCancel)?.length,
        details : ordersUser
      }
    }
  }

  const userRefresh = useMemo(() => {
    return resultQueries[0]?.data?.map(user => {
      const infor = inforMoreUser(user?._id);
      return {
        ...user, 
        totalMoneyUsed : infor?.totalMoneyUsed , 
        quanlityOrder : infor?.orders.quanlity ,
        detailOrders : infor?.orders.details
      }
    })
  },[resultQueries[0] , resultQueries[1]])

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  },[userRefresh])

  const handleViewDetailsOrder = () => {
    setIsOpenDraw(true);
  }

  // Search and filter Product --------------------------------------------------------------------

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>

            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? '#1677ff' : undefined,
          }}
        />
      ),
      onFilter: (value, record) =>{
        if(dataIndex?.length){
          return record[dataIndex[0]][dataIndex[1]].toString().toLowerCase().includes(value.toLowerCase())
        }
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      },
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: '#ffc069',
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
  });

  const columns = [
      {
          title: 'Họ và tên',
          dataIndex: 'name',
          render: (text) => <a>{text}</a>,
          width : 200,
          sorter: (a,b) => a.name.length - b.name.length,
          ...getColumnSearchProps('name')
      },
      {
          title: 'Email',
          dataIndex: 'email',
          render: (email) => <span>{email}</span>,
          sorter: (a,b) => a.email - b.email,
          ...getColumnSearchProps(['shippingAddress','fullName'])
      },
      {
          title: 'Số điện thoại',
          dataIndex: 'phone',
          render: (phone) => <span>{phone}</span>,
          align: 'center',
          sorter: (a,b) => a.phone - b.phone
      },
      {
        title: 'Tổng tiền đã tiêu',
        dataIndex: 'totalMoneyUsed',
        render: (totalMoneyUsed) => <span>{convertPrice(totalMoneyUsed)}</span>,
        align: 'center',
        sorter: (a,b) => a.totalMoneyUsed - b.totalMoneyUsed,
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
        onFilter: ([start,end], record) => (end ? (record.totalMoneyUsed <= end && record.totalMoneyUsed >= start) : (record.totalMoneyUsed >= start)),
      },
      {
        title: 'Tổng đơn hàng',
        dataIndex: 'quanlityOrder',
        render: (quanlityOrder) => <span>{quanlityOrder}</span>,
        align: 'center',
        sorter: (a,b) => a.quanlityOrder - b.quanlityOrder,
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
        onFilter: ([start,end], record) => (end ? (record.quanlityOrder <= end && record.quanlityOrder >= start) : (record.quanlityOrder >= start)),
      },
      {
          title: 'Chi tiết',
          dataIndex: 'detailOrder',
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
              <Row style={{justifyContent:"space-between", margin:"10px 0"}}>
                  <Col span={12}>

                  </Col>
                  <Col style={{textAlign:"end"}} span={4}>
                      <Button
              
                      >
                        Phê duyệt đơn hàng
                      </Button>
                  </Col>
              </Row>
              <TableComponent 
                  columns={columns} 
                  listData={userRefresh || [] } 
                  isLoading={resultQueries[0]?.isLoading}
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
                          <WrapperLabel>Phone</WrapperLabel>
                          <div>{rowSelected?.phone}</div>
                      </WrapperItem>
                      <WrapperItem className="flex-start">
                          <WrapperLabel>Address</WrapperLabel>
                          <div>{rowSelected?.address}</div>
                      </WrapperItem>
                      <WrapperItem className="flex-start">
                          <WrapperLabel>City</WrapperLabel>
                          <div>{rowSelected?.city}</div>
                      </WrapperItem>
                  </WrapperTextInform>                   
              </WrapperContentProfile>
            </FormProfile>
            <WrapperMyOrder style={{marginTop: "20px"}}>
              <WrapperHeader className="custome-header-order">Đơn hàng người dùng</WrapperHeader>
              {rowSelected?.detailOrders?.length === 0 ? <NotOrderComponent/> : 
              rowSelected?.detailOrders?.map(order => (
                <WrapperContainerMyOrder key={order.codeOrder}>
                  {order?.isCancel ? (
                    <div className="order-cancel">Đã hủy</div>
                  ) : (
                    <>
                      <div className="order-status">
                        <div className="order-status__label">Thanh toán:</div>
                        <div className="order-status__value">{order?.isPaid ? 'đã thanh toán' : 'chưa thanh toán'}</div>
                      </div>
                      <div className="order-status">
                        <div className="order-status__label">Vận chuyển:</div>
                        <div className="order-status__value">{order?.isDelivered ? 'đã giao hàng' : 'đang vận chuyển'}</div>
                      </div>
                      <div className="order-status">
                        <div className="order-status__label">Trạng thái:</div>
                        <div className="order-status__value">
                          {order?.isApprove ? (
                            <div className="order-approve">
                              <CheckCircleOutlined style={{color:"#fff", background:"rgb(0, 171, 86)", borderRadius:"50%" , marginRight: "7px"}}/>
                              <div>đã phê duyệt - Dự kiến giao hàng : {convertDateAndTime(order?.createdAt,3).date}</div>                        
                            </div>
                          ) : 'đang chờ phê duyệt'}
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
