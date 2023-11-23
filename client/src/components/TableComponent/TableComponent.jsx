import { Button,Input, Space } from "antd";
import {SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {useRef, useState , useMemo} from "react";
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
    } = props;

    const dataSource = listData?.map((data , index) => ({...data, key : index}))

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
        onFilter: (value, record) => {
            if (dataIndex?.length) {
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

    const columnsCustome = useMemo(() => {
        return columns.map(column => {
            if(column?.isSearchProps){
                delete column.isSearchProps
                return {
                    ...column,
                    ...getColumnSearchProps(column.dataIndex)
                }
            }
            return column
        })
    },[])

    return (
        <LoadingComponent isloading={isLoading}>
            <Table
                rowSelection={isRowSelection && {
                    type: "checkbox",
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                    },
                }}
                columns={columnsCustome}
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
