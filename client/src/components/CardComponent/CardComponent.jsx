/* eslint-disable react/prop-types */
//import {StarFilled} from '@ant-design/icons'
import { Button, Popover, Rate, Tooltip } from 'antd'
import { AccessProduct, CardCustome, DiscountProduct, HaveSold, InforProduct, NameAccessProduct, NameProduct, PriceDiscountProduct, PriceProduct, YellowStars } from './style';
import {useNavigate} from 'react-router-dom'
import {calculatePriceFinal, convertPrice} from '../../utils/utils'

export default function CardComponent(props) {

    const { 
        isShowAssess = true, 
        countInStock, 
        description, 
        image, 
        name, 
        price, 
        rating, 
        type, 
        discount, 
        selled, 
        id , 
        isLoading = false
    } = props
    const navigate = useNavigate()

    const handleConvertDetailProduct = () => {
        if(countInStock > 0){
            navigate(`/product-details/${type}/${id}`)
        }
    }
    
    return (
        <Tooltip 
            color='red' 
            title={<div className='number-pro-0'>Hết hàng</div>} 
            trigger={countInStock === 0 ? 'hover' : null} 
            placement='top'
        >
            <CardCustome
                hoverable           
                bodyStyle={{ padding: "10px"}}
                cover={<img style={{position:"relative"}} alt="example" src={image} />}
                bordered={true}
                loading={isLoading}
                style={{cursor: countInStock === 0 ? 'not-allowed' : 'pointer'}}
            >   
                {countInStock > 0 && (
                    <>
                        <div className='view-detail'></div> 
                        <Button 
                            onClick={() => handleConvertDetailProduct()}
                            className='btn-view-detail'
                        >
                            Xem chi tiết
                        </Button>      
                    </>
                )} 
                <InforProduct>
                    <NameAccessProduct>
                        <NameProduct>{name}</NameProduct>
                        {isShowAssess && (
                            <AccessProduct>
                                <YellowStars>
                                    <Rate style={{fontSize:"11px"}} allowHalf disabled defaultValue={rating}/>
                                </YellowStars>
                                <HaveSold className='haveSold'>Đã bán <span>{selled}</span></HaveSold>
                            </AccessProduct>
                        )}
                    </NameAccessProduct>
                    <PriceDiscountProduct>
                        <PriceProduct>
                            {convertPrice(calculatePriceFinal(price,discount))}
                        </PriceProduct>
                        <DiscountProduct>-{discount}%</DiscountProduct>
                    </PriceDiscountProduct>
                </InforProduct>           
            </CardCustome>
        </Tooltip>
    )
}
