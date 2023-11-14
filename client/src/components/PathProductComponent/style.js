import { styled } from "styled-components";

export const WrapperPathProduct = styled.div`
    display : flex ;
    margin-bottom: 10px;
    align-items: center;

    .path{
        color: rgb(128, 128, 137);
        font-size: 16px;
        line-height: 20px;
        font-weight: 300;
        white-space: nowrap;
    }

    .anticon.anticon-right{
        margin : 0 5px;
        color: rgb(128, 128, 137) !important;
    }

    .link-active:hover{
        cursor: pointer;
        text-decoration: underline;
    }
`