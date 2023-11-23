import { EyeOutlined, FileExcelFilled, LikeOutlined} from "@ant-design/icons";
import { Button, Col, Modal, Row, Steps,} from "antd";
import { useMemo, useState } from "react";
import { WrapperAdminProduct } from "../AdminProductComponent/style";
import TableComponent from "../TableComponent/TableComponent";
import { useQuery} from "@tanstack/react-query";
import * as orderService from '../../services/OrderService'
import {convertDateAndTime , convertPrice, exportExcel} from '../../utils/utils'
import DetailOrderComponent from "../DetailOrderComponent/DetailOrderComponent";
import { statusOrder } from "../../utils/constant";
import { WrapperAdminOrder } from "./style";


export default function AdminOrder() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected , setRowSelected] = useState('');
  const [statusCurrent , setStatusCurrent] = useState(1);

  const fetchAllOrders = async () => {
    const res = await orderService.getAllOrder();
    return res.data
  }

  const queryOrders = useQuery({queryKey:['all-orders-1'], queryFn: fetchAllOrders}) 
  const {data : orders , isLoading : isLoadingOrders} = queryOrders

  const columns = [
      {
          title: 'Mã đơn hàng',
          dataIndex: 'codeOrder',
          render: (text) => <a>{text}</a>,
          width : 200,
          sorter: (a,b) => a.codeOrder.length - b.codeOrder.length,
          isSearchProps: true
      },
      {
          title: 'Khách hàng',
          dataIndex: ['shippingAddress','fullName'],
          render: (shippingAddress) => <span>{shippingAddress.fullName}</span>,
          sorter: (a,b) => a.shippingAddress.fullName - b.shippingAddress.fullName,
          isSearchProps: true
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
          dataIndex: 'status',
          render: (status) => <span className={status.toLowerCase()}>{statusOrder[status]}</span>,
          filters: [
            {
                text: statusOrder.PENDING,
                value: 'PENDING',
            },
            {
                text: statusOrder.PROCESSING,
                value: 'PROCESSING',
            },
            {
                text: statusOrder.DELIVERING,
                value: 'DELIVERING',
            },
            {
                text: statusOrder.COMPLETED,
                value: 'COMPLETE',
            },
            {
                text: statusOrder.CANCELLED,
                value: 'CANCELLED',
            },
        ],
        onFilter: (status, record) => (status === record.status),

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
          render: () => <EyeOutlined style={{fontSize:"20px"}} onClick={() => setIsModalOpen(true)}/>
      }
  ];

  // change status order
  const handleChangeStatusOrder = async () => {
    setStatusCurrent(statusCurrent + 1);
    const statusChange = items.find((_ , index) => index === statusCurrent).title
    await orderService.changeStatusOrder(statusChange , rowSelected._id)
    setRowSelected({...rowSelected , status : statusChange})
    queryOrders.refetch();
  }


  const listOrdersExcel = useMemo(() => {
    return orders?.map(order => ({
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

  const items = useMemo(() => {
    const listKeys = []
    for(const key of Object.keys(statusOrder)){
      key !== 'CANCELLED' && listKeys.push({
        title : key,
        description : statusOrder[key]
      })
    }
    return listKeys
  },[])

  return (    
    <>
      <WrapperAdminOrder>
          <Row style={{justifyContent:"end", margin:"10px 0"}}>
              <Col span={18}>
                Tổng số lượng đơn hàng đã đặt: {orders?.length} 
              </Col>
              <Col style={{textAlign:"end"}} span={6}>
                <Button
                  className="custome-btn-excel"
                  onClick={() => exportExcel(
                    columnsExcel(),
                    listOrdersExcel,
                    'Danh sách đơn hàng đã hoàn tất'
                  )}
                >
                  <FileExcelFilled />
                  Xuất file excel
                </Button>
              </Col>
          </Row>
          <TableComponent 
              columns={columns} 
              listData={orders} 
              isLoading={isLoadingOrders}
              isRowSelection = {false} 
              onRow={(record,rowIndex) => {
                return {
                    onClick : event => {
                        setRowSelected(record)
                        items.forEach((status , index) => {
                          if(status.title === record.status){
                            setStatusCurrent(index+1)
                          }                       
                        })
                    }
                }
            }}                                
          />
      </WrapperAdminOrder>
      <Modal 
        width={'1050px'}
        title={`Thông tin đơn hàng ${rowSelected?.codeOrder}`} 
        open={isModalOpen} 
        footer={null} 
        onCancel={() => setIsModalOpen(false)}
        className="order-detail__admin"
      >
        {rowSelected.status === 'CANCELLED' ? (
          <DetailOrderComponent idOrder = {rowSelected._id} />
        ) : (
          <Row>
            <Col span={6}>
              <Steps
                size="small"
                direction="vertical"
                current={statusCurrent}
                items={items}
              />
              <Button disabled={rowSelected.status === 'COMPLETED'} onClick={handleChangeStatusOrder}>Thay đổi trạng thái</Button>
            </Col>
            <Col span={18}>
              <DetailOrderComponent idOrder = {rowSelected._id} />
            </Col>
          </Row>
        )}
      </Modal>
    </> 
  )
}
