import { Button, Col, Drawer, Empty, Form, Image, Input, Modal, Row, Select, Space, Tabs} from "antd";
import { WrapperAddProductModal, WrapperAdminProduct} from "./style";
import TableComponent from "../TableComponent/TableComponent";
import { useEffect, useMemo,useState } from "react";
import { DeleteOutlined, EditOutlined, FileExcelFilled, PlusOutlined} from "@ant-design/icons";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as productService from '../../services/ProductService'
import { useQuery } from "@tanstack/react-query";
import * as message from '../../components/MessageComponent/MessageComponent'
import { useDispatch, useSelector } from "react-redux";
import { updateTypesList } from "../../redux/slices/productSlice";
import { convertPrice, exportExcel } from "../../utils/utils";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import addImage from '../../assets/images/addImage.jpg'

export default function AdminProduct() {
    const [isLoading , setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawOpen, setIsDrawOpen] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [formAdd] = Form.useForm();
    const [formEdit] = Form.useForm();
    const [rowSelected , setRowSelected] = useState('');
    const typesProduct = useSelector(state => state?.product?.typesProduct);
    const dispatch = useDispatch();
    const inittial = () => ({
        name: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        type: '',
        countInStock: '',
        newType: '',
        discount: '',
    })
    const [stateProduct, setStateProduct] = useState(inittial());
    const [keyTab, setKeyTab] = useState('');
    const [isOnChangeQuill , setIsOnChangeQuill] = useState(false); // lí do có thằng này là vì khi edit 1 product , ta sẽ form.setFieldsValue , khi đó
    // react-quill sẽ đc set value và onChange của quill sẽ thực thi , onChange của react-quill khác với onChange của input là chỉ cần thay đổi value là đã gọi onChange rồi
    // ko nhất thiết phải nhập tự bàn phím mới kích hoạt onChange

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setStateProduct(inittial());
        formAdd.resetFields();
    }

    const handleCloseDraw = () => {
        setIsOnChangeQuill(false);
        setIsDrawOpen(false);
        setStateProduct({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: '',
            discount: '',
          })
        formEdit.resetFields()
    }

    const renderAction = () => {
        return (
        <div>
            <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
            <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsDrawOpen(true)} />
        </div>
        )
    }

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 500);
    },[])

    // get all products ----------------------------------------------------------------------
    const getAllProduct = async() => {
        const res = await productService.getAllProduct();
        return res.data
    }

    const queryProducts = useQuery({queryKey: ['all-products-1'], queryFn: getAllProduct})
    const {isLoading : isLoadingProducts , data : products} = queryProducts;

    // create new product ----------------------------------------------------------------------
    const mutation = useMutationHooks(
        (data) => productService.createProduct(data)
    )

    const { data, isSuccess, isError } = mutation

    useEffect(() => {
        if(isSuccess || data?.status == "OK"){
            if(stateProduct.newType){
                dispatch(updateTypesList([...typesProduct, {name : stateProduct.newType , image : stateProduct.image}]))
            }
            message.success(`Thêm sản phẩm mới thành công`);
            handleCancelCreate();
        }else if(isError){
            message.error(`Có trường thông tin sản phẩm ko hợp lệ`);
        }
    },[isSuccess,isError])

    const handleCreateProduct = () => {
        mutation.mutate({
            ...stateProduct,
            type : stateProduct.newType.toLowerCase() || stateProduct.type.toLowerCase()
        },{
            // đc dùng để sau khi update thì tự queryProducts lại để getAllProduct 
            onSettled: () => {
                queryProducts.refetch()
            }
        });

    }  

    // update info product ----------------------------------------------------------------------
    const mutationUpdate = useMutationHooks(
        //call back này chỉ nhận đúng 1 đối số là data
        (data) => productService.updateProduct(rowSelected?._id , data)
    )

    const { data : dataUpdated, isSuccess : isSuccessUpdated , isError : isErrorUpdated } = mutationUpdate

    useEffect(() => {
        if(isSuccessUpdated || data?.status == "OK"){
            message.success('Cập nhập thông tin sản phẩm thành công');
            handleCloseDraw();
        }else if(isErrorUpdated){
            message.error(`Có trường thông tin sản phẩm ko hợp lệ`);
        }
    },[isSuccessUpdated,isErrorUpdated])

    useEffect(() => {
        if (rowSelected && isDrawOpen) {
            const productToEdit = {
                name: rowSelected.name,
                price: rowSelected.price,
                description: rowSelected.description,
                rating: rowSelected.rating,
                image: rowSelected.image,
                type: rowSelected.type,
                countInStock: rowSelected.countInStock,
                discount: rowSelected.discount,
            }
            setIsOnChangeQuill(true);
            setStateProduct(productToEdit);
            formEdit.setFieldsValue(productToEdit);
        }
    }, [rowSelected, isDrawOpen])

    const handleUpdateProduct = () => {
        mutationUpdate.mutate(stateProduct,{
            onSettled: () => {
                queryProducts.refetch()
            }
        })
    }

    // delete product ----------------------------------------------------------------------

    const mutationDelete = useMutationHooks(
        (data) => productService.deleteProduct(data)
    )

    const { data : dataDeleted , isSuccess : isSuccessDeleted , isError : isErrorDeleted } = mutationDelete

    useEffect(() => {
        if(isSuccessDeleted && dataDeleted?.status === 'OK'){
            message.success('Xóa sản phẩm thành công');
            setIsModalOpenDelete(false)
        }else if(isErrorDeleted){
            message.error('Xóa sản phẩm thất bại');
        }
    },[isSuccessDeleted,isErrorDeleted])
    
    const handleDeleteProduct = () => {
        mutationDelete.mutate(rowSelected?._id,{
            onSettled : () => {
                queryProducts.refetch()
            }
        })
    }

    // const handleOnchangeAvatar = async ({fileList}) => {
    //     const file = fileList[0]
    //     if (!file.url && !file.preview) {
    //         file.preview = await getBase64(file.originFileObj );
    //     }
    //     setAvatar(file.preview);
    // }

    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name] : e.target.value
        })
    }

    const columns = [
        {
            title: 'Tên chi tiết',
            dataIndex: 'name',
            render: (text) => <span>{text}</span>,
            width : 600,
            sorter: (a,b) => a.name.length - b.name.length,
            isSearchProps : true
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            render: (price) => <span>{convertPrice(price)}</span>,
            sorter: (a,b) => a.price - b.price,
            filters: [
                {
                    text: 'Dưới 50k',
                    value: [0,50000],
                },
                {
                    text: 'Từ 50k đến 200k',
                    value: [50000,200000],
                },
                {
                    text: 'Từ 200k đến 500k',
                    value: [200000,500000],
                },
                {
                    text: 'Từ 500k đến 1000k',
                    value: [500000,1000000],
                },
                {
                    text: 'Trên 1000k',
                    value: [1000000],
                },
              ],
              onFilter: ([start,end], record) => (end ? (record.price <= end && record.price >= start) : (record.price >= start)),
        },
        {
            title: 'Đã bán',
            dataIndex: 'selled',
            align: 'center',
            sorter: (a,b) => a.selled - b.selled
        },
        {
            title: 'Danh mục',
            dataIndex: 'type',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        }
    ];

    const itemTab = useMemo(() => {
        if(products?.length > 0){
            const itemTab = [{name:'Tất cả',image:''},...typesProduct].map(type => {
                const productsByType = products?.filter(pro => pro.type === type.name || type.name === 'Tất cả');
                return {
                    key : type?.name ,
                    label : type?.name,
                    children : (
                        <TableComponent 
                            columns={columns} 
                            listData={productsByType} 
                            isLoading={isLoadingProducts}
                            onRow={(record,rowIndex) => {
                                return {
                                    onClick : event => {
                                        setRowSelected(record)
                                    }
                                }
                            }} 
                            isRowSelection={false}                   
                        />
                    )
                }
            }) 
            return itemTab          
        }
        return null
    },[products,typesProduct])

    const productsByTypeExcel = useMemo(() => {
        if(keyTab === 'Tất cả'){
            return products?.map(product => {
                const {__v,createdAt,updatedAt, ...field} = product
                return field
            })
        }else{
            const productsByType = products?.filter(product => product.type === keyTab);
            return productsByType?.map(product => {
                const {__v,createdAt,updatedAt, ...field} = product
                return field
            })
        }
    },[keyTab])

    const columnsExcel = useMemo(() => {
        return ['Id', 'Tên' , 'Link ảnh' , 'Danh mục' , 'Giá tiền' , 'Số hàng tồn kho' , 'Tỷ lệ' , 'Mô tả' , 'giảm giá(%)' , 'Số hàng đã bán']
    },[])

    return (
        <LoadingComponent delay={0} isloading={isLoading}> 
            {isLoading ? <Empty description="Đang tải dữ liệu"/> : (
                <WrapperAdminProduct>
                    <Tabs 
                        type="card" 
                        onChange={key => setKeyTab(key)}
                        tabBarExtraContent={
                            <>
                                <Button 
                                    className="custome-btn-excel"
                                    style={{marginRight:"10px"}}
                                    onClick={() => exportExcel(
                                    columnsExcel,
                                    productsByTypeExcel, 
                                    `Danh sách sản phẩm về ${keyTab} `
                                    )}
                                >
                                    <FileExcelFilled />
                                    Xuất file excel
                                </Button>
                                <Button 
                                    className="custome-btn-add"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <PlusOutlined />
                                    Thêm sản phẩm mới
                                </Button>
                            </>
                        } 
                        items={itemTab}
                    />
                </WrapperAdminProduct>
            )}     
            
            {/* form create new product */}
            <WrapperAddProductModal 
                title="Tạo mới sản phẩm" 
                width={'100%'}
                open={isModalOpen} 
                footer={null} 
                onCancel={handleCloseModal}
            >
                <Form
                    name="basic"
                    labelCol={{span: 8,}}
                    wrapperCol={{span: 16,}}
                    autoComplete="off"
                    form={formAdd}
                    onFinish={handleCreateProduct}
                >
                    <Row gutter={32} >
                        <Col span={8} style={{borderRight: "1px solid #d5d5d5"}}>
                            <Form.Item
                                label="Tên sản phẩm"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên sản phẩm',
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập tên sản phẩm" value={stateProduct.name} onChange={handleOnChange} name="name" />
                            </Form.Item>

                            <Form.Item
                                label="Danh mục"
                                name="type"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn danh mục sản phẩm',
                                    },
                                ]}
                            >
                                <Select
                                    value={stateProduct.type}
                                    onChange={(value) => setStateProduct({ ...stateProduct, type: value, newType: '' })}
                                    placeholder="Danh mục sản phẩm"
                                >
                                    {typesProduct?.map((type, i) => (
                                        <Select.Option key={i} value={type?.name}>{type?.name}</Select.Option>
                                    ))}
                                    <Select.Option value={'Thêm danh mục'}>{'Thêm danh mục'}</Select.Option>
                                </Select>
                            </Form.Item>

                            {stateProduct.type === 'Thêm danh mục' && (
                                <Form.Item
                                    label="Danh mục mới"
                                    name="newType"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập danh mục mới',
                                        },
                                        {
                                            validator: (_, value) =>
                                                value && !typesProduct?.some(type => type.name.toLowerCase() === value.toLowerCase())
                                                    ? Promise.resolve()
                                                    : Promise.reject("Danh mục mới không được trùng danh mục đã có sẵn"),
                                        },
                                    ]}


                                //help={invalidInput.newType ? 'Danh mục mới không được trùng danh mục đã có sẵn' : ''}
                                //validateStatus={invalidInput.newType ? "error" : ''}
                                >
                                    <Input placeholder="Danh mục sản phẩm mới" value={stateProduct.newType} onChange={handleOnChange} name="newType" />
                                </Form.Item>
                            )}

                            <Form.Item
                                label="Số hàng trong kho"
                                name="countInStock"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số hàng tồn kho',
                                    },
                                    {
                                        validator: (_, value) =>
                                            value && +value > 0
                                                ? Promise.resolve()
                                                : Promise.reject("Số hàng phải là 1 số dương"),
                                    },
                                ]}
                            //help={invalidInput.countInStock ? 'Số hàng phải là 1 số dương' : ''}
                            //validateStatus={invalidInput.countInStock ? "error" : ''}
                            >
                                <Input placeholder="Số hàng phải là 1 số dương" type="number" value={stateProduct.countInStock} onChange={handleOnChange} name="countInStock" />
                            </Form.Item>

                            <Form.Item
                                label="Giá tiền"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giá tiền',
                                    },
                                    {
                                        validator: (_, value) =>
                                            value && (/^\d+$/.test(value.replace(/,/g, '')) && parseInt(value.replace(/,/g, ''), 10) % 500 === 0)
                                                ? Promise.resolve()
                                                : Promise.reject("Giá tiền phải đúng định dạng nh 1000, 300000,..."),
                                    },
                                ]}
                            //help={invalidInput.price ? 'Giá tiền phải đúng định dạng nh 1000, 300000,...' : ''}
                            //validateStatus={invalidInput.price ? "error" : ''}
                            >
                                <Input placeholder="Giá tiền : 10000 , 2500 , 120000 ,..." type="number" value={stateProduct.price} onChange={handleOnChange} name="price" />
                            </Form.Item>

                            <Form.Item
                                label="Tỉ lệ"
                                name="rating"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tỉ lệ!',
                                    },
                                ]}
                            >
                                <Input type="number" value={stateProduct.rating} onChange={handleOnChange} name="rating" />
                            </Form.Item>

                            <Form.Item
                                label="Giảm giá"
                                name="discount"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giảm giá!',
                                    },
                                    {
                                        validator: (_, value) =>
                                            value && (+value >= 0 && +value <= 100)
                                                ? Promise.resolve()
                                                : Promise.reject("Giảm giá phải từ 0% đến 100%"),
                                    },
                                ]}
                            //help={invalidInput.discount ? 'Giảm giá phải từ 0% đến 100%' : ''}
                            //validateStatus={invalidInput.discount ? "error" : ''}
                            >
                                <Input placeholder="Giảm giá chỉ từ 0% đến 100%" type="number" value={stateProduct.discount} onChange={handleOnChange} name="discount" />
                            </Form.Item>

                            <Form.Item
                                label="Ảnh"
                                name="image"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập link ảnh!',
                                    },
                                    {
                                        validator: (_, value) =>
                                            value && (/\.(jpeg|jpg|png)$/i.test(value))
                                                ? Promise.resolve()
                                                : Promise.reject("file ảnh tuân theo đuôi .jpeg .jpg"),
                                    },
                                ]}
                            //help={invalidInput.image ? 'file ảnh tuân theo đuôi .jpeg .jpg' : ''}
                            //validateStatus={invalidInput.image ? "error" : ''}
                            >
                                <Input placeholder="file ảnh tuân theo đuôi .jpeg .jpg" value={stateProduct.image} onChange={handleOnChange} name="image" />
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button block type="primary" htmlType="submit">
                                    Tạo mới
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Image style={{paddingLeft:"15px"}} src={stateProduct.image || addImage} preview={false}/>               
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Mô tả"
                                name="description"
                                className="des-field"
                                wrapperCol={{span: 24,}}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mô tả!',
                                    },
                                ]}
                            >
                                <ReactQuill 
                                    style={{height:"355px" , width:"100%"}} 
                                    theme="snow" 
                                    value={stateProduct.description} 
                                    onChange={(value) => setStateProduct({...stateProduct , description : value})} 
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </WrapperAddProductModal>

            {/* form update a product */}
            <Drawer
                title="Cập nhập thông tin sản phẩm"
                width={"100%"}
                onClose={handleCloseDraw}
                open={isDrawOpen}
                bodyStyle={{paddingBottom: 10}}
                extra={
                    <Space>
                        <Button onClick={handleCloseDraw}>Hủy</Button>
                        <Button onClick={handleUpdateProduct} type="primary">
                            Cập nhật
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={formEdit} hideRequiredMark>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Tên sản phẩm"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập tên sản phẩm',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Nhập tên sản phẩm" onChange={handleOnChange} value={stateProduct.name} name="name" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        name="type"
                                        label="Danh mục"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter user type',
                                            },
                                        ]}
                                    >
                                        <Select
                                            value={stateProduct.type}
                                            onChange={(value) => setStateProduct({ ...stateProduct, type: value })}
                                        >
                                            {typesProduct?.map((type, i) => (
                                                <Select.Option key={i} value={type?.name}>{type?.name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Số hàng trong kho"
                                        name="countInStock"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập số hàng tồn kho',
                                            },
                                            {
                                                validator: (_, value) =>
                                                    value && +value > 0
                                                        ? Promise.resolve()
                                                        : Promise.reject("Số hàng phải là 1 số dương"),
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Please enter user quantity of stock" onChange={handleOnChange} value={stateProduct.countInStock} name="countInStock" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Giá tiền"
                                        name="price"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập giá tiền',
                                            },
                                            {
                                                validator: (_, value) =>
                                                    value && (/^\d+$/.test(value.replace(/,/g, '')) && parseInt(value.replace(/,/g, ''), 10) % 500 === 0)
                                                        ? Promise.resolve()
                                                        : Promise.reject("Giá tiền phải đúng định dạng nh 1000, 300000,..."),
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Giá tiền phải đúng định dạng nh 1000, 300000,..." onChange={handleOnChange} value={stateProduct.price} name="price" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Tỷ lệ"
                                        name="rating"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter user rating',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Please enter user rating" onChange={handleOnChange} value={stateProduct.rating} name="rating" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Giảm giá"
                                        name="discount"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập giảm giá!',
                                            },
                                            {
                                                validator: (_, value) =>
                                                    value && (+value >= 0 && +value <= 100)
                                                        ? Promise.resolve()
                                                        : Promise.reject("Giảm giá phải từ 0% đến 100%"),
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Please enter user discount" onChange={handleOnChange} value={stateProduct.discount} name="discount" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Ảnh"
                                        name="image"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter user image',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Please enter user image" onChange={handleOnChange} value={stateProduct.image} name="image" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Image src={stateProduct.image} preview={false} />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Mô tả"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'please enter url description',
                                    },
                                ]}
                            >
                                <ReactQuill
                                    style={{ height: "300px", width: "100%" }}
                                    theme="snow"
                                    value={stateProduct.description}
                                    onChange={(value) => isOnChangeQuill && setStateProduct({ ...stateProduct, description: value })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>

            {/* form delete product */}
            <Modal title="Xóa sản phẩm" open={isModalOpenDelete} onOk={handleDeleteProduct} onCancel={() => setIsModalOpenDelete(false)}>
                <div>Bạn chắc chắn muốn xóa sản phẩm này , khi đó sản phẩm này sẽ bị xóa vĩnh viễn</div>
            </Modal>
        </LoadingComponent>
    )
}
