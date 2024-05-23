import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { WrapperDescribe, WrapperDetailBody, WrapperDetailHeader, WrapperDetailProduct, WrapperImgProduct, WrapperProductsByCategory, WrapperQuantityChoose } from "./style";
import { Button, Empty, Image, Row} from "antd";
import * as productService from '../../services/ProductService'
import { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux'
import PathProductComponent from "../../components/PathProductComponent/PathProductComponent";
import { addOrderProduct } from "../../redux/slices/orderSlice";
import {calculatePriceFinal, convertPrice, handleChangeAmountBuy, initFacebookSDK} from '../../utils/utils'
import LikeButtonComponent from "../../components/LikeButtonComponent/LikeButtonComponent";
import CommentComponent from "../../components/CommentComponent/CommentComponent";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { BsFillCartPlusFill } from "react-icons/bs";
import parse from 'html-react-parser';


export default function ProductDetailsPage() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [clickBuyToShowModal, setClickBuyToShowModal] = useState(false);
  const {type,id} = useParams();
  const [amountBuy , setAmountBuy] = useState(1);
  const dispatch = useDispatch();
  const [visiblePopoverCart , setVisiblePopoverCart] = useState(0);

  useEffect(() => {
    initFacebookSDK()
  }, [])

  useEffect(() => {
    setAmountBuy(1);
  },[id])
  
  const handleAddProductToOrder = () => {
    if(!user?.id){
      setClickBuyToShowModal(true)
    }else{
      setVisiblePopoverCart(true);
      dispatch(addOrderProduct({
        orderItem: {
          product: productDetails?._id,
          name: productDetails?.name,
          type: productDetails?.type,
          amount: amountBuy,
          image: productDetails?.image,
          price: productDetails?.price,
          discount: productDetails?.discount,
          countInStock: productDetails?.countInStock
        }
      }))
    }
  }

  const handleBuySelectedProduct = () => {
    navigate('/cart/payment' , {state : {
      totalOriginPrice : productDetails?.price,
      totalDiscount : productDetails?.price * productDetails.discount/100,
      freeShip : productDetails?.price >= 150000 ? 15000 : productDetails?.price >= 300000 ? 30000 : 0,
      totalMoneyPay : Number.parseInt(productDetails?.price)-Number.parseInt(productDetails?.price * productDetails.discount/100),
      product : {...productDetails , quantity : amountBuy}
    }})
  }

  const fetchGetDetailProduct = async (context) => {
    const idPro = context?.queryKey && context?.queryKey[1];
    if(idPro){
      const res = await productService.getDetailsProduct(idPro);
      return res.data
    }
  }

  const fetchProductsAll = async (context) => {
    const cate = context?.queryKey && context?.queryKey[1];
    if(cate){
      const res = await productService.getProductsByType(cate,undefined,undefined)
      return res.data
    }
  }

  const {data : productDetails , isSuccess : isSuccessProductDetails} = useQuery(['product-details',id] , fetchGetDetailProduct )
  const {data: productsByType , isSuccess : isSuccessProductsByType} = useQuery(['products-by-type',type], fetchProductsAll ) 

  const handleSetAmountProduct = (action , amountChange ) => {
    const amount = handleChangeAmountBuy(action , amountChange , productDetails?.countInStock );
    if(amount){
      setAmountBuy(amount)
    }
  }

  return (   
    <>
      <HeaderComponent 
        setVisiblePopoverCart={setVisiblePopoverCart} 
        visiblePopoverCart={visiblePopoverCart} 
        clickBuyToShowModal={clickBuyToShowModal}
        setClickBuyToShowModal={setClickBuyToShowModal}
      />
      <LoadingComponent delay={0} isloading={!(isSuccessProductDetails && isSuccessProductsByType)}>
      {!(isSuccessProductDetails && isSuccessProductsByType) 
      ? <Empty description={'Đang tải thông tin sản phẩm'}/> 
      : (
        <div style={{padding:"10px 120px", backgroundColor:"#efefef"}}>
          <PathProductComponent typePro = {type} namePro = {productDetails?.name}/>
          <Row style={{alignItems: "start"}}>
            <WrapperImgProduct span={8}>
              <Image width="100%" preview={false} src={productDetails?.image} />
            </WrapperImgProduct>
            <WrapperDetailProduct span={16}>
              <WrapperDetailHeader>
                  <h1>{productDetails?.name}</h1>
                  <div className="have-sold">Đã bán {productDetails?.selled}</div>
              </WrapperDetailHeader>
              <WrapperDetailBody>
                  <div className="price">
                    <div className="price-final">
                      {convertPrice(calculatePriceFinal(productDetails?.price , productDetails?.discount))}
                    </div>
                    <div className="price-discount">
                      -{productDetails?.discount}%
                    </div>
                  </div>
                  <LikeButtonComponent 
                  //https://developers.facebook.com/docs/plugins/
                    dataHref={'https://developers.facebook.com/docs/plugins/'} 
                  />
                  <WrapperQuantityChoose>
                    <h3>Số lượng</h3>
                    <div className="action-num-pro">
                      <button 
                        className="decrease" 
                        disabled={amountBuy<=1} 
                        onClick={() => handleSetAmountProduct('DECREASE',amountBuy-1) }
                      >
                        <img src="https://frontend.tikicdn.com/_desktop-next/static/img/pdp_revamp_v2/icons-remove.svg" alt="" />
                      </button>
                      <input 
                        value={amountBuy} 
                        type="number" 
                        name="amountBuy" 
                        onChange={(e) => handleSetAmountProduct('INPUT',+e.target.value)}
                      />
                      <button 
                        className="increase" 
                        disabled={amountBuy>=999} 
                        onClick={() => handleSetAmountProduct('INCREASE',amountBuy+1)}
                      >
                        <img src="https://frontend.tikicdn.com/_desktop-next/static/img/pdp_revamp_v2/icons-add.svg" alt="" />
                      </button>
                      {productDetails?.countInStock <= 5 ? (
                        <span className="count-in-stock">{`Chỉ còn lại ${productDetails?.countInStock} sản phẩm`}</span>
                      ) : null}
                    </div>
                    {!user.isAdmin && (
                      <div className="group-button">
                          <Button className="buy-action" onClick={handleBuySelectedProduct}>
                              Mua ngay
                          </Button>
                          <Button className="buy-before" onClick={handleAddProductToOrder}>
                            <BsFillCartPlusFill style={{fontSize:'18px', marginRight:5}}/>
                            Thêm vào giỏ hàng
                          </Button>
                      </div>
                    )}
                  </WrapperQuantityChoose>
              </WrapperDetailBody>
              <WrapperDescribe>
                <div className="describe-title">Mô tả sản phẩm</div>
                <div className="describe-content">{parse(productDetails?.description)}</div>
              </WrapperDescribe>
              <WrapperProductsByCategory>
                <div className="category-title" >Sản phẩm liên quan</div>
                <SliderComponent list={productsByType} nameList = {'products-category'} ></SliderComponent>
              </WrapperProductsByCategory>
              <CommentComponent
              //"https://developers.facebook.com/docs/plugins/comments#configurator" 
                dataHref={"https://developers.facebook.com/docs/plugins/comments#configurator"} 
                //width="1270" 
              />
            </WrapperDetailProduct>
          </Row>
        </div>
      )}
      </LoadingComponent>
    </>
  )
}
