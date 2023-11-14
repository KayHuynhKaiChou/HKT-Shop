import { Row } from "antd";
import { styled } from "styled-components";

export const WrapperTypeProduct = styled(Row)`
    margin: 0 !important;
    padding : 10px 120px;
    background-color: rgb(245, 245, 250);
    height: fit-content;

    img.img-type {
        width : 30px;
        height : 30px;
        border-radius : 50%;
        border: 1px solid #d7d7d7;
    }

    .type-title{
        margin: 0px;
        line-height: 20px;
        color: rgb(56, 56, 61);
        font-size: 16px;
        padding: 12px 0px 12px 30px;
        font-weight: 500;
    }

    .type-name{
        color: rgb(39, 39, 42);
        font-weight: 400;
        font-size: 14px;
        line-height: 150%;
        text-transform: capitalize;
    }

    .ant-menu-item{
        display: flex;
        align-items: center;
    }

    .pros-by-type{
        display: flex;
        gap: 5px;
        flex-wrap: wrap;

        .pro-info{
            flex-basis : 19%;
        }
    }
`