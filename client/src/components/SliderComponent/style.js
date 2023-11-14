import Slider from "react-slick";
import styled from "styled-components";

export const SliderImages = styled(Slider)`
    .slick-slide>div{
        padding: 0px !important;
    }
    &:hover{
        .slick-next,
        .slick-prev {
            display: block !important;
        }
    }

    .slick-list{
        border-radius : 10px;
    }

    .slick-next,
    .slick-prev {
        padding: 14px;
        width: 2vw;
        height: 2vw;
        cursor: pointer;
        border: none;
        border-radius : 0;
        background-color: black;
        z-index: 99 !important;
        display:none !important;
        opacity : 0.5;

        &:hover{
            opacity: 0.8;
        }
    }

    .slick-next{
        right : 0 !important;
    }

    .slick-prev{
        left : 0 !important;
    }
`

export const SliderCategories = styled(Slider)`
    

    .slick-next,
    .slick-prev {
        padding: 14px;
        width: 1vw;
        height: 1vw;
        cursor: pointer;
        border: none;
        border-radius: 5vw;
        background-color: #fff;
        z-index: 99 !important;
        box-shadow: rgb(35 35 35 / 50%) 0px 0px 20px 5px;

        &:hover{
            opacity : 0.8;
        } 
    }
`