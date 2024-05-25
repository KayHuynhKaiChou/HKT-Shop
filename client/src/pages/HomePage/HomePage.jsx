import { Col, Empty, Image, Row } from "antd";
import CardComponent from "../../components/CardComponent/CardComponent";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import { WrapperAllProducts, WrapperButton, WrapperCategories, WrapperContainerHome, WrapperProductsDealHot, WrapperProductsSellest } from "./style";
import * as productService from '../../services/ProductService'
import {useQuery} from '@tanstack/react-query'
import { useEffect, useMemo, useState } from "react";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useDispatch, useSelector } from "react-redux";
import { updateTypesList } from "../../redux/slices/productSlice";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  // const searchText = useSelector(state => state?.product?.search);
  // const searchDebounce = useDebounce(searchText, 500)
  const typesProduct = useSelector(state => state?.product?.typesProduct);
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(6)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchProductsAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1] 
    //const search = context?.queryKey && context?.queryKey[2] // queryKey[1] là searchDebounce
    const res = await productService.getAllProduct('',limit)
    return res
  }

  const fetchAllTypeProduct = async () => {
    const res = await productService.getAllTypeProduct();
    return res.data
  }

  const {data: products , isPreviousData} = useQuery(['products-paginate',limit], fetchProductsAll , {retry : 3, retryDeplay : 1000, keepPreviousData: true}) //keepPreviousData: true sẽ giữ lại data trước đó (6 prod) và tự động thêm data mới khi click "xem thêm" mà ko phải kiểu 6 products sẽ mất và hiện lại 7 products
  const {data: allProducts , isSuccess : isSuccessAllProducts} = useQuery(['all-products-0'], fetchProductsAll ) 
  const {data: allTypes , isSuccess : isSuccessTypes} = useQuery(['all-types'], fetchAllTypeProduct ) 

  useEffect(() => {
    if(allProducts && allTypes && typesProduct?.length == 0){
        const typeRefresh = allTypes?.map(type => {
          return {
            name : type,
            image : allProducts?.data?.find(product => product?.type === type)?.image
          }
        })
        dispatch(updateTypesList(typeRefresh))
    }
    if(allProducts && allTypes) {
      setIsLoading(false)
    }
  },[isSuccessTypes , isSuccessAllProducts]) 

  const productsMostSelling = useMemo(() => {
    return allProducts ? allProducts?.data?.sort((a,b) => b.selled - a.selled)?.slice(0,8) : []
  },[allProducts])

  const productsDealHot = useMemo(() => {
    return allProducts ? allProducts?.data?.sort((a,b) => b.discount - a.discount)?.slice(0,8) : []
  },[allProducts])

  
  return (
    <LoadingComponent delay={0} isloading={isLoading}>
      {isLoading ? ( <Empty/> ) : (
        <WrapperContainerHome id="container" >
          <Row gutter={20} style={{paddingTop:"20px"}}>
            <Col span={16}>
              <SliderComponent />
            </Col>
            <Col span={8} onClick={() => navigate('/voucher')}>
              <Image style={{borderRadius:"10px" , cursor:"pointer"}} height={"100%"} src="https://thuvienmuasam.com/uploads/default/original/2X/1/1ae37050401d2baa4ed2fabfae2258dc01d83af3.jpeg" preview={false} />
            </Col>
          </Row>

          <WrapperCategories >
            <div className="cate-title">Danh mục sản phẩm</div>
            <SliderComponent list={typesProduct} nameList = {'types-product'}/>
          </WrapperCategories>

          <WrapperProductsSellest >
            <div className="sellest-title">Sản phẩm bán chạy</div>
            <SliderComponent list={productsMostSelling} nameList = {'products-sellest'}/>
          </WrapperProductsSellest>

          <WrapperProductsDealHot >
            <div className="deal-hot-title">Deal hot</div>
            <SliderComponent list={productsDealHot} nameList = {'products-deal-hot'}/>
          </WrapperProductsDealHot>

          <WrapperAllProducts >
            <div className="all-products-title">Gợi ý cho bạn ({products?.data?.length})</div>
            <Row gutter={[5,5]}>
                {products?.data?.map((product) => {
                  return (
                    <Col span={4} key={product._id}>
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
                      />
                    </Col>
                  )
                })}
            </Row>
            <div className="all-products-button">
              {products?.data?.length === 0 ? (<div>Not found product</div>) : (
                <WrapperButton
                  onClick={() => setLimit((prev) => prev + 6)}
                  disabled={products?.total === products?.data?.length || products?.totalPage <= 1}
                >
                  {isPreviousData ? 'Load more' : "Xem thêm"} 
                </WrapperButton>
              )}
            </div>
          </WrapperAllProducts>
        </WrapperContainerHome>
      )}
    </LoadingComponent>
  )
}
