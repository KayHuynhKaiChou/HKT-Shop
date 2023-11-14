/* eslint-disable react/prop-types */
import { Image } from 'antd'
import slider1 from '../../assets/images/slider1.png'
import slider2 from '../../assets/images/slider2.png'
import slider3 from '../../assets/images/slider3.png'
import slider4 from '../../assets/images/slider4.png'
import leftArrow from '../../assets/images/left-arrow.svg'
import rightArrow from '../../assets/images/right-arrow.svg'
import { useNavigate } from 'react-router-dom'
import { SliderCategories, SliderImages } from './style'
import CardComponent from '../CardComponent/CardComponent'

export default function SliderComponent({list = [slider1,slider2,slider3,slider4] , nameList = 'images'}) {

    const navigate = useNavigate();
    const arrowCustom = () => {
        switch (nameList) {
            case 'images':
                return {
                    prevArrow : <img src='https://icones.pro/wp-content/uploads/2021/06/symbole-fleche-gauche-gris.png' />,
                    nextArrow : <img src='https://icones.pro/wp-content/uploads/2021/06/symbole-fleche-droite-grise.png'/>,
                }
            case 'types-product':
                return {
                    prevArrow : <img src={leftArrow} />,
                    nextArrow : <img src={rightArrow} />
                }
            default:
                return {
                    prevArrow : <img src={leftArrow} />,
                    nextArrow : <img src={rightArrow} />
                }
        }
    }
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: nameList === 'images' ? 1 : (nameList === 'types-product' || nameList === 'products-category') ? 4 : 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        ...arrowCustom()
    };

    const uiSlider = () => {
        switch (nameList) {
            case 'images':
                return (
                    <SliderImages {...settings}>
                        {list?.map((urlImg,i) => (
                            <Image key={i} src={urlImg} preview={false} width="100%" alt='slider'/>
                        ))}
                    </SliderImages>
                )
                
            case 'types-product':
                return (
                    <SliderCategories {...settings}>
                        {list?.map((type,i) => (
                            <div className='cate-item' key={i} onClick={() => navigate(`/product/${type?.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, {state: type?.name})}>
                                <img src={type?.image} />
                                <div className='cate-item__name'>{type?.name}</div>
                            </div>
                        ))}
                    </SliderCategories>
                )
            case 'products-sellest':
                return (
                    <SliderCategories {...settings}>
                        {list?.map((product,i) => (
                            <CardComponent
                                key = {i}
                                isShowAssess={true}
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
                        ))}
                    </SliderCategories>
                )
            case 'products-deal-hot' :
                return (
                    <SliderCategories {...settings}>
                        {list?.map((product,i) => (
                            <CardComponent
                                key = {i}
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
                        ))}
                    </SliderCategories>
                )
            
            case 'products-category' :
                return (
                    <SliderCategories {...settings}>
                        {list?.map((product,i) => (
                            <CardComponent
                                key = {i}
                                isShowAssess={false}
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
                        ))}
                    </SliderCategories>
                )
            
            default:
                break;
        }
    }

    return (
        <>
            {uiSlider()}        
        </>
    );
}
