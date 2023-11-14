/* eslint-disable no-unused-vars */
import { EyeOutlined, FileExcelFilled, LikeOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, Modal, Row, Space } from "antd";
import { useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { WrapperAdminProduct } from "../AdminProductComponent/style";
import TableComponent from "../TableComponent/TableComponent";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as orderService from '../../services/OrderService'
import {convertDateAndTime , convertPrice, exportExcel} from '../../utils/utils'
import { WrapperTableProducts } from "../../pages/DetailsOrderPage/style";


// eslint-disable-next-line react/prop-types
export default function AdminOrder({orderType}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected , setRowSelected] = useState('');
  const [listApproveOrder, setListApproveOrder] = useState([]);
  const queryClient = useQueryClient();

  const fetchAllOrders = async () => {
    const res = await orderService.getAllOrder();
    return res.data
  }

  const {data : orders , isLoading : isLoadingOrders} = useQuery({queryKey:['all-orders-1'], queryFn: fetchAllOrders})

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
          title: 'Mã đơn hàng',
          dataIndex: 'codeOrder',
          render: (text) => <a>{text}</a>,
          width : 200,
          sorter: (a,b) => a.codeOrder.length - b.codeOrder.length,
          ...getColumnSearchProps('codeOrder')
      },
      {
          title: 'Khách hàng',
          dataIndex: ['shippingAddress','fullName'],
          render: (shippingAddress) => <span>{shippingAddress.fullName}</span>,
          sorter: (a,b) => a.shippingAddress.fullName - b.shippingAddress.fullName,
          ...getColumnSearchProps(['shippingAddress','fullName'])
      },
      {
          title: 'Ngày tạo',
          dataIndex: 'createdAt',
          render: (createdAt) => <span>{convertDateAndTime(createdAt).date} {convertDateAndTime(createdAt).time}</span>,
          align: 'center',
          sorter: (a,b) => a.createdAt - b.createdAt
      },
      {
          title: 'Thanh toán',
          dataIndex: 'isPaid',
          render: (isPaid) => {return isPaid ? <span style={{color:"green"}}>Đã thanh toán</span> : <span style={{color:"blue"}}>chưa thanh toán</span>}
      },
      {
          title: 'Trạng thái',
          dataIndex: 'isApprove',
          render: (isApprove) => {return isApprove ? <span style={{color:"green"}}>Đã phê duyệt</span> : <span style={{color:"orange"}}>Đang chờ phê duyệt</span>},
          className: (orderType === 'Đơn hàng đã hủy') ? 'hidden-column' : ''
      },
      {
          title: 'Trạng thái',
          dataIndex: 'isCancel',
          render: () => <span style={{color:"red"}}>Đã hủy</span>,
          className: !(orderType === 'Đơn hàng đã hủy') ? 'hidden-column' : ''
      },
      {
        title: 'Tổng tiền',
        dataIndex: 'totalPrice',
        render: (totalPrice) => <span>{convertPrice(totalPrice)}</span>,
        sorter: (a,b) => a.totalPrice - b.totalPrice,
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
        onFilter: ([start,end], record) => (end ? (record.price <= end && record.price >= start) : (record.price >= start)),
      },
      {
          title: 'Action',
          dataIndex: 'action',
          align: 'center',
          render: () => <EyeOutlined style={{fontSize:"20px"}} onClick={handleViewDetailsOrder}/>
      }
  ];

  const handleViewDetailsOrder = () => {
    setIsModalOpen(true)
    console.log(rowSelected)
    //const {data : order , isLoading : isLoadingOrder} = useQuery({queryKey:['all-orders'], queryFn: fetchAllOrders})
  }

  // approve orders

  const handleApproveOrder = async () => {
    await orderService.approveOrder(listApproveOrder?.map(order => ({...order, isApprove: true})))
    queryClient.invalidateQueries(['all-orders-1'])
  }

  const setTypeOrder = () => {
    switch (orderType) {
      case 'Đơn hàng trực tuyến':
        return {
          typeOrder : orders?.filter(order => !order.isApprove && !order?.isCancel),
          isRowSelection : true
        }
      case 'Đơn hàng đã duyệt':
        return {
          typeOrder : orders?.filter(order => order.isApprove),
          isRowSelection : false
        }
      default:
        return {
          typeOrder : orders?.filter(order => order.isCancel),
          isRowSelection : false
        }
    }
  }

  const listOrdersExcel = useMemo(() => {
    return setTypeOrder().typeOrder?.map(order => ({
      codeOrder : order.codeOrder,
      fullName : order.shippingAddress.fullName,
      createdAt : convertDateAndTime(order.createdAt).date,
      paymentMethod : order.paymentMethod,
      deliveryMethod : order.deliveryMethod,
      totalPrice : order.totalPrice
    }))
  },[orders])

  const columnsExcel = () => {
    const columnExcel =  columns?.filter(column => column.title !== 'Action' && column.title !== 'Trạng thái')?.map(column => column.title);
    columnExcel.splice(columnExcel.length - 1 , 0 , 'Vận chuyển');
    return columnExcel
  }

  return (    
    <>
      <WrapperAdminProduct>
          <Row style={{justifyContent:"end", margin:"10px 0"}}>
              <Col style={{textAlign:"end"}} span={6}>
                {orderType === 'Đơn hàng đã duyệt' && (
                  <Button
                    className="custome-btn-excel"
                    onClick={() => exportExcel(
                      columnsExcel(),
                      listOrdersExcel,
                      'Danh sách đơn hàng đã hoàn tất'
                    )}
                  >
                    <FileExcelFilled />
                    Export excel
                  </Button>
                )}
                {orderType === 'Đơn hàng trực tuyến' && (
                  <Button 
                    className="custome-btn-approve"
                    disabled={listApproveOrder.length===0}
                    onClick={handleApproveOrder}
                  >
                    <LikeOutlined />
                    Phê duyệt đơn hàng
                  </Button>
                )}
              </Col>
          </Row>
          <TableComponent 
              columns={columns} 
              listData={setTypeOrder().typeOrder || [] } 
              isLoading={isLoadingOrders}
              setListApproveOrder={setListApproveOrder}
              isRowSelection = {setTypeOrder().isRowSelection} 
              onRow={(record,rowIndex) => {
                return {
                    onClick : event => {
                        setRowSelected(record)
                    }
                }
            }}                                
          />
      </WrapperAdminProduct>
      <Modal 
        width={'1020px'}
        title={`Mã đơn hàng: ${rowSelected?.codeOrder}`} 
        open={isModalOpen} 
        footer={null} 
        onCancel={() => setIsModalOpen(false)}
      >
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
              {rowSelected?.orderItems?.map(item => (
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
                  <td>{convertPrice(rowSelected?.itemsPrice)}</td>
              </tr>
              <tr>
                  <td colSpan="4">
                      <span>Phí vận chuyển</span>
                  </td>
                  <td>{convertPrice(rowSelected?.shippingPrice)}</td>
              </tr>
              <tr>
                  <td colSpan="4">
                      <span>Tổng cộng</span>
                  </td>
                  <td>
                      <span className="sum">{convertPrice(rowSelected?.totalPrice)}</span>
                  </td>
              </tr>
          </tfoot>
        </WrapperTableProducts>
      </Modal>
    </> 
  )
}
