/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Table } from "antd";
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'

export default function TableComponent(props) {
    const {
        columns = [] , 
        listData = [] , 
        isLoading = false , 
        onRow , 
        pageSize = 6 , 
        isRowSelection = true , 
        setListApproveOrder = ''
    } = props;

    const dataSource = listData?.map(data => ({...data, key : data._id}))

    return (
        <LoadingComponent isloading={isLoading}>
            <Table
                rowSelection={isRowSelection && {
                    type: "checkbox",
                    onChange: (selectedRowKeys, selectedRows) => {
                        setListApproveOrder && setListApproveOrder(selectedRows)
                        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                    },
                }}
                columns={columns}
                dataSource={dataSource}
                onRow={onRow}
                bordered={true}
                pagination={{
                    pageSize,
                }}
                
            />
        </LoadingComponent>
    )
}
