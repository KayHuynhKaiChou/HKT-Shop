import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import * as voucherService from '../../services/VoucherService'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { Button, DatePicker, Empty, Form, Input, Select, Space, Tabs} from "antd";
import * as message from '../../components/MessageComponent/MessageComponent'
import { WrapperAddProductModal, WrapperAdminProduct } from "../AdminProductComponent/style";
import TableComponent from '../../components/TableComponent/TableComponent'
import Highlighter from "react-highlight-words";
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import {convertPrice , convertDateAndTime} from '../../utils/utils'
import { conditionVoucher } from "../../utils/constant";
import dayjs from 'dayjs'

export default function AdminVoucher() {
  const [isLoading , setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyTab, setKeyTab] = useState('');
  const typesProduct = useSelector(state => state?.product?.typesProduct);
  const [rowSelected , setRowSelected] = useState('');
  const [isFormEdit , setIsFormEdit] = useState(false);
  const [form] = Form.useForm();
  const inittial = () => ({
    content : '',
    discount : {
      type:'number',
      value:''
    },
    isNewUser : false,
    remainQuantity : '',
    condition : {
      type : 'all',
      value : ''   // gửi về db ta gửi condition:{ type : ''}
    },
    expiredDate : '',
    expiredTime : '',
  })
  const [voucher , setVoucher] = useState(inittial()); 

  const getAllVoucher = async () => {
    const res = await voucherService.getAllVoucher();
    return res.data
  }

  const queryVouchers = useQuery({queryKey: ['all-voucher-0'], queryFn: getAllVoucher});
  const {data : listVoucher , isLoading : isLoadingVouchers} = queryVouchers

  const customeListVoucher = (voucherByCdt) => {
    const [type , value] = voucherByCdt.condition.split('-');
    const {key , title} = conditionVoucher.find(c => c.key === type);
    const [disType , disPrice] = voucherByCdt.discount.split('-')
    return {
      ...voucherByCdt,
      isNewUser : voucherByCdt.isNewUser ? 'Khách hàng mới' : 'Khách hàng bình thường',
      condition : `${title} ${Number(value) ? convertPrice(value) : value}`,
      expiredDate : !voucherByCdt.isNewUser ? convertDateAndTime(voucherByCdt.expiredDate).date : voucherByCdt.expiredTime,
      discount : disPrice 
    }      
  }

  const handleOnChange = (e) => {
    setVoucher({
      ...voucher,
      [e.target.name] : e.target.value
    })
  }

  const handleDetailsVoucher = () => {
  }

  // create new voucher

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCancelModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setVoucher(inittial());
  }

  const mutationAction = useMutationHooks(
    (data) => {
      if(isFormEdit){
        return voucherService.updateVoucher(rowSelected._id , data)
      }else{
        return voucherService.createVoucher(data)
      }
    }

  )

  const {data : dataVoucher , isSuccess : isSuccessVoucher , isError : isErrorVoucher} = mutationAction;

  useEffect(() => {
    if(isSuccessVoucher && dataVoucher?.status === 'OK'){
      message.success(isFormEdit ? 'Cập nhật voucher thành công' : 'Thêm voucher thành công')
      handleCancelModal();
    }else if(isErrorVoucher){
      message.error(`Có trường thông tin sản phẩm ko hợp lệ`);
    }
  },[isSuccessVoucher , isErrorVoucher])

  const handleActionVoucher = () => {
    const voucherCustome = {...voucher};
    if(voucher.isNewUser){
      delete voucherCustome.remainQuantity;
      delete voucherCustome.expiredDate
    }else{
      voucherCustome.remainQuantity = +voucherCustome.remainQuantity;
      delete voucherCustome.expiredTime;
    }
    // voucher.isNewUser ? delete voucherCustome.remainQuantity : 
    // voucher.isNewUser ? delete voucherCustome.expiredDate : delete voucherCustome.expiredTime;
    mutationAction.mutate({
      ...voucherCustome,
      condition : voucher.condition.type + '-' +voucher.condition.value,
      discount : voucher.discount.type + '-' +voucher.discount.value
    },{
      onSettled: () => {
        queryVouchers.refetch()
      }
    })
  }

  // handle get voucher by Id in order to edit

  const fetchGetVoucherById = (idVou) => {
    voucherService.getVoucherById(idVou)
      .then(res => {
        const vouResponse = res.data;
        setVoucher({
          content : vouResponse.content,
          discount : {
            type: vouResponse.discount.split('-')[0],
            value: vouResponse.discount.split('-')[1]
          },
          isNewUser : vouResponse.isNewUser,
          remainQuantity : vouResponse.remainQuantity,
          condition : {
            type: vouResponse.condition.split('-')[0],
            value: vouResponse.condition.split('-')[1]
          },
          expiredDate : vouResponse.expiredDate.split('T')[0],
          expiredTime : vouResponse.expiredTime,
        })
        form.setFieldsValue({
          content : vouResponse.content,
          discountType : vouResponse.discount.split('-')[0],
          discountValue : vouResponse.discount.split('-')[1],
          isNewUser : vouResponse.isNewUser,
          remainQuantity : vouResponse.remainQuantity,
          conditionType : vouResponse.condition.split('-')[0],
          conditionValue : vouResponse.condition.split('-')[1],
          expiredDate : dayjs(vouResponse.expiredDate), //2023-10-31T00:00:00.000Z
          expiredTime : vouResponse.expiredTime,
        })
      })
  }

  useEffect(() => {
    if(rowSelected) {
      fetchGetVoucherById(rowSelected._id)
      setIsFormEdit(true);
      setIsModalOpen(true);
    }
  },[rowSelected])

  // handle edit voucher

  const renderAction = () => {
    return (
      <div>
          <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
          <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsVoucher} />
      </div>
    )
  }

  const columns = [
    {
      title: 'Nội dung',
      dataIndex: 'content',
      render: (text) => <a>{text}</a>,
      width: 150,
      sorter: (a, b) => a.content.length - b.content.length,
      isSearchProps:true
    },
    {
      title: 'Số tiền giảm',
      dataIndex: 'discount',
      render: (discount) => {
        if(discount >=0 && discount <=100){
          return <a>{`${discount} %`}</a>
        }else{
          return <a>{convertPrice(discount)}</a>
        }
      },
      sorter: (a, b) => a.discount - b.discount,
      filters: [
        {
          text: 'Giảm theo số tiền',
          value: false,
        },
        {
          text: 'Giảm theo phần trăm',
          value: true,
        }
      ],
      onFilter: (isPercent , record) => isPercent ? (record.discount >=0 && record.discount <=100) : (record.discount > 10000)
    },
    {
      title: 'Điều kiện áp dụng',
      dataIndex: 'condition',
      width: 260,
      align: 'left',
      sorter: (a, b) => a.condition - b.condition
    },
    {
      title: 'Đối tượng áp dụng',
      dataIndex: 'isNewUser',
    },
    {
      title: 'Số lượng',
      dataIndex: 'remainQuantity',
      align: 'center',
      sorter: (a, b) => a.remainQuantity - b.remainQuantity
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiredDate',
      align: 'center',
      render : (expired) => {
        return (typeof expired === 'number' ? (<span>{`Sau ${expired} ngày`}</span>) : (<span>{expired}</span>))
      },
      sorter: (a, b) => a.expiredDate - b.expiredDate
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    }
  ];

  const itemTab = useMemo(() => {
    if (listVoucher?.length > 0) {
      return conditionVoucher?.map(cdt => {
        const vouchersByCdt = listVoucher?.filter(vou => vou.condition.split('-')[0] == cdt.key).map(vou => {
          return customeListVoucher(vou);
        });
        return {
          key: cdt.title,
          label: cdt.title,
          children: (
            <TableComponent
              columns={columns}
              listData={vouchersByCdt}
              isLoading={isLoadingVouchers}
              onRow={(record, rowIndex) => {
                return {
                  onClick: event => {
                    setRowSelected(record)
                  }
                }
              }}
            />
          )
        }
      })
    }
    return null
  }, [listVoucher])

  const renderFieldByCondition = () => {
    switch (voucher.condition.type) {
      case 'min':
        return (
          <Form.Item
            label="Số tiền tối thiểu"
            name="conditionValue"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập số tiền tối thiểu',
              },
              {
                validator: (_, value) =>
                  value && (/^\d+$/.test(value.replace(/,/g, '')) && parseInt(value.replace(/,/g, ''), 10) % 500 === 0)
                    ? Promise.resolve()
                    : Promise.reject("Giá tiền phải đúng định dạng: 1000, 300000,..."),
              },
            ]}
          //help={invalidInput.countInStock ? 'Số hàng phải là 1 số dương' : ''}
          //validateStatus={invalidInput.countInStock ? "error" : ''}
          >
            <Input allowClear placeholder="Số lượng voucher phải là 1 số dương" type="number" value={voucher.condition.value} onChange={e => setVoucher({...voucher, condition : {...voucher.condition , value : e.target.value}})} name="conditionValue" />
          </Form.Item>
        )
        case 'cate':
          return (
            <Form.Item
              label="Danh mục sản phẩm"
              name="conditionValue"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Danh mục sản phẩm',
                },
              ]}
            //help={invalidInput.countInStock ? 'Số hàng phải là 1 số dương' : ''}
            //validateStatus={invalidInput.countInStock ? "error" : ''}
            >
              <Select
                onChange={value => setVoucher({...voucher, condition : {...voucher.condition , value}})}
                value={voucher.condition.value}
              >
                {typesProduct?.map((type,i) => (
                  <Select.Option key={i} value={type.name}>{type.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )    
      default:
        return<></>
    }
  }

  const renderFieldByDiscount = () => {
    switch (voucher.discount.type) {
      case 'number':
        return (
          <Form.Item
            label="Số tiền giảm"
            name="discountValue"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập số tiền giảm',
              },
              {
                validator: (_, value) =>
                  value && (/^\d+$/.test(value.replace(/,/g, '')) && parseInt(value.replace(/,/g, ''), 10) % 500 === 0)
                    ? Promise.resolve()
                    : Promise.reject("Giá tiền phải đúng định dạng: 1000, 300000,..."),
              },
            ]}
          //help={invalidInput.Value ? 'Giá tiền phải đúng định dạng nh 1000, 300000,...' : ''}
          //validateStatus={invalidInput.Value ? "error" : ''}
          >
            <Input placeholder="Giá tiền : 10000 , 2500 , 120000 ,..." type="number" value={voucher.discount.value} onChange={e => setVoucher({...voucher , discount : {...voucher.discount , value : e.target.value}})} name="discountValue" />
          </Form.Item>
        )  
        case 'percent':
          return (
            <Form.Item
              label="Số phần trăm"
              name="discountValue"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số phần trăm',
                },
                {
                  validator: (_, value) =>
                    value && (+value >= 0 && +value <= 100)
                      ? Promise.resolve()
                      : Promise.reject("Phần trăm chỉ từ 0% đến 100%"),
                },
              ]}
            //help={invalidInput.price ? 'Giá tiền phải đúng định dạng nh 1000, 300000,...' : ''}
            //validateStatus={invalidInput.price ? "error" : ''}
            >
              <Input placeholder="Phần trăm chỉ từ 0% đến 100%" type="number" value={voucher.discount.value} onChange={e => setVoucher({...voucher , discount : {...voucher.discount , value : e.target.value}})} name="discountValue" />
            </Form.Item>
          )  
      default:
        break;
    }
  }

  const renderFieldByTypeBuyer = () => {
    if(voucher.isNewUser){
      return(

        <Form.Item
          label="Thời gian hết hạn"
          name="expiredTime"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập khoảng thời gian hết hạn',
            },
            {
              validator: (_, value) =>
                value && +value > 0
                  ? Promise.resolve()
                  : Promise.reject("khoảng thời gian hết hạn phải là 1 số dương"),
            },
          ]}
        //help={invalidInput.countInStock ? 'Số hàng phải là 1 số dương' : ''}
        //validateStatus={invalidInput.countInStock ? "error" : ''}
        >
          <Input placeholder="Khoảng thời gian hết hạn kể từ lúc đăng kí 1 tài khoản" type="number" value={voucher.expiredTime} onChange={handleOnChange} name="expiredTime" />
        </Form.Item>
      )
    }else{
      return (
        <Form.Item
          label="Ngày hết hạn"
          name="expiredDate"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn ngày hết hạn',
            },
            {
              validator: (_, value) =>
                value && (new Date(value) >= new Date())
                  ? Promise.resolve()
                  : Promise.reject("Ngày hết hạn ko thể ở quá khứ hoặc hiện tại"),
            },
          ]}
        //help={invalidInput.expiredDate ? 'Giảm giá phải từ 0% đến 100%' : ''}
        //validateStatus={invalidInput.expiredDate ? "error" : ''}
        >
          <DatePicker onChange={(date, dateString) => setVoucher({ ...voucher, expiredDate: dateString })} />
        </Form.Item>
      )
    }
  }

  useEffect(() => {
    form.setFieldsValue({ conditionValue : voucher.condition.value , discountValue : voucher.discount.value})
  },[voucher.condition.type , voucher.discount.type])

  return (
    <LoadingComponent delay={0} isloading={isLoading}>
      {isLoading ? <Empty description="Đang tải dữ liệu" /> : (
        <WrapperAdminProduct>
          <Tabs
            type="card"
            onChange={key => setKeyTab(key)}
            tabBarExtraContent={
              <>
                {/* <Button
                  className="custome-btn-excel"
                  style={{ marginRight: "10px" }}
                  onClick={() => exportExcel(
                    columnsExcel,
                    productsByTypeExcel,
                    `Danh sách sản phẩm về ${keyTab} `
                  )}
                >
                  <FileExcelFilled />
                  Export excel
                </Button> */}
                <Button
                  className="custome-btn-add"
                  onClick={handleOpenModal}
                >
                  <PlusOutlined />
                  Thêm mới voucher
                </Button>
              </>
            }
            items={itemTab}
          />
        </WrapperAdminProduct>
      )}

      {/* form create new product */}
      <WrapperAddProductModal 
        style={{minWidth:520}} 
        title={isFormEdit ? "Cập nhật thông tin Voucher" : "Tạo mới Voucher"} 
        open={isModalOpen} 
        footer={null} 
        onCancel={handleCancelModal}
      >
        <Form
          name="basic"
          labelCol={{ span: 8, }}
          wrapperCol={{ span: 16, }}
          style={{ width: "100%"}}
          autoComplete="off"
          form={form}
          onFinish={handleActionVoucher}
        >
          <Form.Item
            label="Nội dung"
            name="content"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên sản phẩm',
              },
            ]}
          >
            <Input placeholder="Nhập nội dung miêu tả voucher" value={voucher.content} onChange={handleOnChange} name="content" />
          </Form.Item>

          <Form.Item
            label="Điều kiện áp dụng"
            name="conditionType"
          >
            <Select
              defaultValue={voucher.condition.type === 'all' && 'Tất cả các sản phẩm'}
              onChange={(value) => setVoucher({ ...voucher, condition: { value : '', type : value}})}
              placeholder="Điều kiện áp dụng"
            >
              {conditionVoucher.map(cdt => (
                <Select.Option value={cdt.key}>{cdt.title}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          {voucher.condition.type && renderFieldByCondition()}

          {!voucher.isNewUser && (
            <Form.Item
              label="Số lượng voucher"
              name="remainQuantity"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số lượng voucher',
                },
                {
                  validator: (_, value) =>
                    value && +value > 0
                      ? Promise.resolve()
                      : Promise.reject("Số lượng voucher phải là 1 số dương"),
                },
              ]}
            //help={invalidInput.countInStock ? 'Số hàng phải là 1 số dương' : ''}
            //validateStatus={invalidInput.countInStock ? "error" : ''}
            >
              <Input placeholder="Số lượng voucher phải là 1 số dương" type="number" value={voucher.remainQuantity} onChange={handleOnChange} name="remainQuantity" />
            </Form.Item>
          )}

          <Form.Item
            label="Đối tượng áp dụng"
            name="isNewUser"
          >
            <Select
              defaultValue={voucher.isNewUser ? 'Khách hàng mới' : 'Khách hàng bình thường'}
              onChange={(value) => setVoucher({...voucher , isNewUser : value})}
            >
              <Select.Option value={false} >Khách hàng bình thường</Select.Option>
              <Select.Option value={true} >Khách hàng mới</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Loại voucher"
            name="discountType"
          >
            <Select
              defaultValue={voucher.discount.type === 'number' && 'Giảm theo số tiền'}
              onChange={value => setVoucher({...voucher , discount : {value: '' , type : value}})}
            >
              <Select.Option value="number">Giảm theo số tiền</Select.Option>
              <Select.Option value="percent">Giảm theo phần trăm</Select.Option>
            </Select>
          </Form.Item>
          {voucher.discount.type && renderFieldByDiscount()}

          {renderFieldByTypeBuyer()}

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button block type="primary" htmlType="submit">
              {isFormEdit ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Form.Item>
        </Form>
      </WrapperAddProductModal>
    </LoadingComponent>
  )
}
