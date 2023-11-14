import { Card } from "antd";
import { styled } from "styled-components";

export const CardCustome = styled(Card)`
    .view-detail{
        display: none;
    }
    .btn-view-detail{
        display: none;
    }
    &:hover{
        .view-detail{
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 61%;
            background-color: black;
            opacity: 0.5;
            border-radius: 5px 5px 0 0;
        }
        .btn-view-detail{
            display: block;
            position: absolute;
            top: 25%;
            right: 23%;
        }
    }
    
`

export const InforProduct = styled.div`
    display: flex;
    flex-direction: column;
    padding: 4px 8px;
    gap: 4px;
`

export const NameAccessProduct = styled.div`
    min-height: 70px;
`

export const NameProduct = styled.div`
    margin-top : 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 44px;
`

export const AccessProduct = styled.div`
    display : flex;
    align-items: center;
`

export const YellowStars = styled.div`
    display : flex;

    .ant-rate-star{
        margin-inline-end: 7px !important;
    }

    .ant-rate-star:last-child{
        margin-inline-end: 0px !important
    }
`

export const HaveSold = styled.div`
    position : relative;
    margin-left: 8px;
    padding-left: 8px;
    color : rgb(128, 128, 137);
    font-size : 12px
`

export const PriceDiscountProduct = styled.div`
    display : flex;
    align-items: center;
    line-height: 150%;
`

export const PriceProduct = styled.div`
    font-size: 18px;
    font-weight: 500;
    color: rgb(73 73 73);
`

export const DiscountProduct = styled.div`
    font-size: 15px;
    font-weight: 500;
    color: rgb(73 73 73);
    padding : 0px 4px;
    border-radius : 1000px;
    background: rgb(245, 245, 250);
    margin-left : 4px;
    margin-top: 3px;
`