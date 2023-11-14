import { WrapperChart, WrapperStatistic } from "./style";
import {useQueries} from '@tanstack/react-query'
import * as userService from '../../services/UserService'
import * as productService from '../../services/ProductService'
import * as orderService from '../../services/OrderService'
import { convertPrice } from "../../utils/utils";
import LineChartComponent from "./LineChartComponent";
import { useEffect, useMemo, useState } from "react";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { Empty } from "antd";
import { DollarOutlined, DropboxOutlined, ShoppingCartOutlined, UsergroupAddOutlined } from "@ant-design/icons";

export default function AdminDashboard() {
    const [isLoading , setIsLoading] = useState(true);

    const fetchAllUsers = async () => {
        const res = await userService.getAllUsers();
        return res.data
    }

    const fetchAllProducts = async () => {
        const res = await productService.getAllProduct();
        console.log(res.data)
        return res.data
    }

    const fetchTypesProduct = async () => {
        const res = await productService.getAllTypeProduct();
        return res.data
    }

    const fetchAllOrders = async () => {
        const res = await orderService.getAllOrder();
        return res.data
    }

    const resultQueries = useQueries({
        queries : [
            {queryKey: ['users'], queryFn: fetchAllUsers},
            {queryKey: ['all-products-1'], queryFn: fetchAllProducts},
            {queryKey: ['type-product'], queryFn: fetchTypesProduct},
            {queryKey: ['all-orders-0'], queryFn: fetchAllOrders},
        ]
    })


    const totalRevenue = useMemo(() => {
        return resultQueries[3].data?.filter(order => !order?.isCancel).reduce((total,order) => {
            return total + order?.totalPrice
        },0)
    },[resultQueries[3]])

    const totalProductSold = useMemo(() => {
        return resultQueries[1].data?.reduce((total,product) => total + product?.selled , 0)
    },[resultQueries[1]])

    const statisticTypeProduct = useMemo(() => { // hàm thống kê theo type product , trả 1 mảng gồm các object và mỗi object gồm {type,numberSold,numberStock}
        return resultQueries[2].data?.reduce((acc,typePro) => {
            return [
                ...acc, 
                {
                    type: typePro,
                    numberSold : resultQueries[1].data?.filter(product => product.type == typePro).reduce((total,product) => total + product?.selled , 0),
                    numberStock : resultQueries[1].data?.filter(product => product.type == typePro).reduce((total,product) => total + product?.countInStock , 0)
                }
            ]
        },[])
    },[resultQueries[2],resultQueries[1]])

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 500);
    },[totalProductSold])

    return (
        <LoadingComponent delay={0} isloading={isLoading}>
            {isLoading ? <Empty/> : (
                <>
                    <WrapperStatistic>
                        <div className="statistic design-product">
                            <div className="statis-content">
                                <div className="sta-label">Số lượng sản phẩm</div>
                                <div className="sta-value">{totalProductSold || 0}</div>
                                <div className="sta-note">Sản phẩm đã bán</div>
                            </div>
                            <DropboxOutlined />
                        </div>
                        <div className="statistic design-order">
                            <div className="statis-content">
                                <div className="sta-label">Số lượng đơn hàng</div>
                                <div className="sta-value">{resultQueries[2].data?.length || 0}</div>
                                <div className="sta-note">Đơn hàng đã giao</div>
                            </div>
                            <ShoppingCartOutlined />
                        </div>
                        <div className="statistic design-customer">
                            <div className="statis-content">
                                <div className="sta-label">Số lượng khách hàng</div>
                                <div className="sta-value">{resultQueries[0].data?.length || 0}</div>
                                <div className="sta-note">Khách hàng đã đăng ký</div>
                            </div>
                            <UsergroupAddOutlined />
                        </div>
                        <div className="statistic design-money">
                            <div className="statis-content">
                                <div className="sta-label">Tổng doanh thu</div>
                                <div className="sta-value">{convertPrice(totalRevenue || 0)}</div>
                                <div className="sta-note">Doanh thu từ đơn hàng</div>
                            </div>
                            <DollarOutlined />                       
                        </div>
                    </WrapperStatistic>
                    <WrapperChart>
                        <div className="chart-title">Biểu đồ các loại sản phẩm</div>
                        <LineChartComponent statisticTypeProduct={statisticTypeProduct}/>
                    </WrapperChart>           
                </>
            )}
        </LoadingComponent>
    )
}
