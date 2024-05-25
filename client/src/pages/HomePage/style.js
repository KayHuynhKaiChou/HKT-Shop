import { Button } from "antd";
import { styled } from "styled-components";

export const WrapperContainerHome = styled.div`
    padding: 0 120px;
    background: #ececec;   
`

export const WrapperButton = styled(Button)`
    cursor: pointer;
    width: 240px;
    height : 50px;
    margin-top: 12px;
    padding: 0px 12px;
    border-radius: 4px;
    border: 1px solid rgb(10, 104, 255);
    color: rgb(10, 104, 255);
    font-size: 16px;
    line-height: 150%;
    text-align: center;
    &:hover {
        background-color : rgba(0, 96, 255, 0.12);
    }
`

export const WrapperCategories = styled.div`
    margin : 20px 0;
    background : #fff;
    border-radius : 10px;

    .cate-title{
        font-size: 1rem;
        line-height: 1.25rem;
        font-weight: 700;
        text-transform: uppercase;
        padding : 10px;
        border-bottom : 1px solid #efefef;
    }

    .cate-item{
        border-right : 1px solid #efefef;
        display: flex !important;
        gap : 1px;
        flex-direction: column;
        align-items: center;
        cursor: pointer;

        img{
            width : 80px;
            height : 80px;
            margin-top : 10px;
            border-radius: 50%;
            border: 1px solid #dadada;
            object-fit: cover;
        }

        .cate-item__name{
            text-transform: capitalize;
            word-break: break-word;
            font-size: 18px;
            line-height: 35px;
        }

        &:hover{
            transform: translateZ(0);
            z-index: 1;
            border-color: rgba(0,0,0,.12);
            border-width: 1px;
            box-shadow: 0 0 0.8125rem 0 rgba(0,0,0,.05);
            opacity: 0.8;
        }
    }
`

export const WrapperProductsSellest = styled.div`
    margin : 20px 0;
    background : #fff;
    border-radius : 10px;

    .sellest-title{
        font-size: 1rem;
        line-height: 1.25rem;
        font-weight: 700;
        text-transform: uppercase;
        padding : 10px;
        border-bottom : 1px solid #efefef;
    }
`

export const WrapperProductsDealHot = styled.div`
    margin : 20px 0;
    background : #fff;
    border-radius : 10px;

    .deal-hot-title{
        font-size: 1rem;
        line-height: 1.25rem;
        font-weight: 700;
        text-transform: uppercase;
        padding : 10px;
        border-bottom : 1px solid #efefef;
    }
`

export const WrapperAllProducts = styled.div`
    .all-products-title{
        font-size: 1rem;
        line-height: 1.25rem;
        font-weight: 700;
        text-transform: uppercase;
        padding : 10px;
        background : #fff;
        border-radius : 10px;
        margin-bottom : 20px;
    }

    .all-products-button{
        display: flex;
        justify-content: center;
    }
`