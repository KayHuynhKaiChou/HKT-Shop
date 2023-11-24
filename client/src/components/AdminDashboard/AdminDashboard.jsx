import { WrapperChart, WrapperStatistic } from "./style";
import {useQueries} from '@tanstack/react-query'
import * as dashboardService from '../../services/DashboardService'
import { convertPrice } from "../../utils/utils";
import LineChartComponent from "./LineChartComponent";
import { useEffect, useMemo, useState } from "react";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { Empty } from "antd";
import { DollarOutlined, DropboxOutlined, ShoppingCartOutlined, UsergroupAddOutlined } from "@ant-design/icons";

export default function AdminDashboard() {
    const [isLoading , setIsLoading] = useState(true);

    const fetchGetReports = async () => {
        const res = await dashboardService.getReports();
        return res.data
    }

    const fetchGetStatistic = async () => {
        const res = await dashboardService.getStatistic()
        return res.data
    }

    const resultQueries = useQueries({
        queries : [
            {queryKey: ['reports'], queryFn: fetchGetReports},
            {queryKey: ['statistic'], queryFn: fetchGetStatistic},
        ]
    })

    const dataReport = useMemo(() => {
        return resultQueries[0].data
    },[resultQueries[0]])

    const dataStatistic = useMemo(() => {
        return resultQueries[1].data
    },[resultQueries[1]])

    // const statisticTypeProduct = useMemo(() => { // hàm thống kê theo type product , trả 1 mảng gồm các object và mỗi object gồm {type,numberSold,numberStock}
    //     return resultQueries[2].data?.reduce((acc,typePro) => {
    //         return [
    //             ...acc, 
    //             {
    //                 type: typePro,
    //                 numberSold : resultQueries[1].data?.filter(product => product.type == typePro).reduce((total,product) => total + product?.selled , 0),
    //                 numberStock : resultQueries[1].data?.filter(product => product.type == typePro).reduce((total,product) => total + product?.countInStock , 0)
    //             }
    //         ]
    //     },[])
    // },[resultQueries[2],resultQueries[1]])

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 1000);
    },[])

    return (
        <LoadingComponent delay={0} isloading={isLoading}>
            {isLoading ? <Empty/> : (
                <>
                    <WrapperStatistic>
                        <div className="statistic design-product">
                            <div className="statis-content">
                                <div className="sta-label">Số lượng sản phẩm</div>
                                <div className="sta-value">{dataReport?.totalSoldProducts}</div>
                                <div className="sta-note">Sản phẩm đã bán</div>
                            </div>
                            <DropboxOutlined />
                        </div>
                        <div className="statistic design-order">
                            <div className="statis-content">
                                <div className="sta-label">Số lượng đơn hàng</div>
                                <div className="sta-value">{dataReport?.totalOrder}</div>
                                <div className="sta-note">Đơn hàng đã giao</div>
                            </div>
                            <ShoppingCartOutlined />
                        </div>
                        <div className="statistic design-customer">
                            <div className="statis-content">
                                <div className="sta-label">Số lượng khách hàng</div>
                                <div className="sta-value">{dataReport?.totalUsers}</div>
                                <div className="sta-note">Khách hàng đã đăng ký</div>
                            </div>
                            <UsergroupAddOutlined />
                        </div>
                        <div className="statistic design-money">
                            <div className="statis-content">
                                <div className="sta-label">Tổng doanh thu</div>
                                <div className="sta-value">{convertPrice(dataReport?.totalRevenue)}</div>
                                <div className="sta-note">Doanh thu từ đơn hàng</div>
                            </div>
                            <DollarOutlined />                       
                        </div>
                    </WrapperStatistic>
                    <WrapperChart>
                        <div className="chart-title">Biểu đồ các loại sản phẩm</div>
                        <LineChartComponent statisticTypeProduct={dataStatistic}/>
                    </WrapperChart>           
                </>
            )}
        </LoadingComponent>
    )
}
