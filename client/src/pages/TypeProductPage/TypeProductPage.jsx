import { Col, Menu, Pagination} from "antd";
import CardComponent from "../../components/CardComponent/CardComponent";
import { WrapperTypeProduct } from "./style";
import { useLocation, useNavigate} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import * as productService from '../../services/ProductService'
import PathProductComponent from "../../components/PathProductComponent/PathProductComponent";
import { useSelector } from "react-redux";
import { convertUTF8toUnicode, getItem } from "../../utils/utils";

export default function TypeProductPage() {
  const [isLoading , setIsLoading] = useState(true);
  const typesProduct = useSelector(state => state?.product?.typesProduct);
  const { state }  = useLocation();
  const [keySelected, setKeySelected] = useState(state);
  const navigate = useNavigate();
  const [productsAtPage , setProductsAtPage] = useState([]);
  const initPagination = {
    page : 0, //trang hiện tại , ex : trang 1 , ...
    limit : 10,
    products : 0,
    totalPage : 1 // tổng trang để chứa hết số lượng items , giả sử có 8 pro thì cần 2 page
  }
  const [pagination , setPagination] = useState(initPagination)

  const fetchProductsByType = (pagination) => {
    productService.getProductsByType(state, pagination.page , pagination.limit)
      .then(res => {
        if(res?.status === "OK"){
          setProductsAtPage(res?.data)
          setPagination({...pagination, products : res?.total})
        }
      })
  }

  useEffect(() => {
    fetchProductsByType(pagination)
  },[pagination.page, pagination.limit]);

  useEffect(() => {
    setKeySelected(state)
    fetchProductsByType(initPagination)
  },[state])

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000);
  },[])

  const listItems = useMemo(() => {
    return typesProduct?.map(type => {
      return getItem(<span className="type-name">{type?.name}</span>, type?.name , <img className="img-type" src={type?.image} alt=""/>)
    })
  },[typesProduct?.length])

  const handleConvertType = ({key}) => {
    const typeFormat = convertUTF8toUnicode(key).split(' ').join('-')
    navigate(`/product/${typeFormat}` , {state : key})
  }

  return (
    <WrapperTypeProduct gutter={[15]}>
        <Col span={24}>
          <PathProductComponent typePro={keySelected} />
        </Col>
        <Col style={{borderRadius: "8px" , background:"#fff"}} span={4}>
          <div className="type-title">Danh mục sản phẩm</div>
          <Menu   
              title="Danh mục sản phẩm"
              selectedKeys={keySelected}  
              //defaultSelectedKeys={'products'}  
              theme="light"
              items={listItems}
              onClick={handleConvertType}              
          />
        </Col>
        <Col span={20} style={{minHeight:"84vh"}}>
          <div className="pros-by-type">
              {productsAtPage?.map(product => (
                <div className="pro-info" key = {product._id}>
                  <CardComponent 
                    countInStock={product.countInStock}
                    description={product.description}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    selled={product.selled}
                    discount={product.discount}
                    id={product._id}
                    isLoading={isLoading}
                  />
                </div>
              ))}
          </div>
          <Pagination style={{marginTop:10}} current={pagination.page + 1} total={pagination.products} pageSize={pagination.limit} onChange={(page,pageSize) => setPagination({...pagination, page: page - 1, limit: pageSize})}/>
        </Col>
    </WrapperTypeProduct>
  )
}
