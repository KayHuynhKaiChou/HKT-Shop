import { Modal, Row } from 'antd'
import styled from 'styled-components'

export const WrapperHeader = styled(Row)`
    padding : 10px ${({isPaddingLR}) => isPaddingLR ? '120px' : '8px'};
    background-image: linear-gradient(180deg, rgb(26, 148, 255), #627bff);
    align-items : center;
    justify-content: space-between;
    margin: 0 !important;
    color: #fff;
    position: fixed;
    top: 0;
    z-index: 1000;
    width: 100%;

    .ant-select-selector , .ant-select-selection-search-input {
        height: 40px !important;
    }

    .ant-select-selection-placeholder{
        line-height: 38px !important;
    }

    .header-title{
        margin-left: 10px;
        border-left: 2px solid #fff;
        padding-left: 10px;
        font-size: 24px;
    }
`

export const WrapperTextHeader = styled.span`
    font-size : 28px;
    color : #fff;
    font-weight : bold;
    text-align : left;
`

export const WrapperMainPageHeader = styled.div`
    display:flex;
    align-items: center;
    margin-right: 20px;

    cursor : pointer;
    padding : 5px;
    border-radius : 10px;

    &:hover{
        background : #91befd;
    }

    .main-page{
    }
`

export const WrapperAccountHeader = styled.div`
    display : flex;
    align-items : center;
    font-size : 14px;
    gap : 5px;
    cursor : pointer;
    padding : 5px;
    border-radius : 10px;

    &:hover{
        background : #91befd;
    }

    img {
        width: 35px !important;
        height: 35px !important;
        border-radius: 50%;
        object-fit: cover;
    }

    .name{
        text-transform: capitalize;
    }
`

export const WrapperCartHeader = styled.div`
    margin-left : 20px;
    padding : 5px;
    border-radius : 10px;
    cursor : pointer;

    &:hover{
        background : #91befd;
    }
`

export const CustomModal = styled(Modal)`
    .ant-modal-content{
        padding : 0px !important;
    }

    span.link-redirect {
        color: #5555ff;
        cursor: pointer;
        margin-left: 5px;
    }
`

export const WrapperContentPopover = styled.div`
    cursor : pointer;
    padding : 7px 0;
    font-size : 16px;

    &:hover {
        color : #fff;
        background-color : #bcbcbc;
    }
`

export const WrapperMSGCartPopover = styled.div`

    .msg-title{
        position : relative;
        display: flex;
        color: rgb(51, 51, 51);
        font-size: 13px;
        margin-right: 30px;

        span{
            margin-right : 5px;
            font-size: 20px;
            color: #fff;
            background: rgb(76, 175, 80);
            border-radius: 50%
        }
    }

    button{
        width : 100%;
        margin-top: 16px;
        padding: 10px 0px;
        color: rgb(255, 255, 255);
        font-size: 14px;
        font-weight: 400;
        text-align: center;
        white-space: nowrap;
        background-color: rgb(255, 57, 69);
        border-radius: 4px;
    }
`
