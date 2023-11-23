import { Radio } from "antd"
import { styled } from "styled-components"


export const WrapperMethods = styled.div`
    display : flex;
`

export const WrapperLeft = styled.div`
    flex : 1 1 910px;
   
`

export const WrapperShipping = styled.div`
    background: #fff;
    padding : 16px;

    .method-title{
        color: rgb(56, 56, 61);
        font-weight: 700;
        font-size: 18px;
        line-height: 24px;
    }
`

export const CustomRadio = styled(Radio.Group)`
    margin-top: 15px;
    background: rgb(240, 248, 255);
    border: 1px solid rgb(194, 225, 255);
    width: 500px;
    border-radius: 4px;
    height: 100px;
    padding: 16px;
    font-weight: normal;
    display:flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;

    span.method-value{
        color: #ea8500;
        font-weight: bold;
    }
`

export const WrapperPayment = styled.div`
    background: #fff;
    padding : 16px;

    .method-title{
        color: rgb(56, 56, 61);
        font-weight: 700;
        font-size: 18px;
        line-height: 24px;
    }
`

export const WrapperRight = styled.div`
    flex : 1 1 calc(100% - 910px - 20px);
    margin-left : 20px;

    button {
        width : 100%;
        background: rgb(255, 66, 78);
        color: rgb(255, 255, 255);
        text-align: center;
        border-radius: 4px;
        border: none;
        margin: 15px 0px 0px;
    }

    button:hover{
        opacity : 0.8;
        color: rgb(255, 255, 255) !important;
    }
`

export const WrapperAddressShip = styled.div`
    background-color : #fff;
    padding : 16px;
    border-radius : 5px;

    .not-address{
        text-align: center;

        &__act{
            color: rgb(26, 148, 255);
            cursor: pointer;
        }
    }

    .block-header{
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;

        &__title{
            color: rgb(128, 128, 137);
            font-weight: normal;
        }
    
        &__nav{
            color: rgb(11, 116, 229);
            cursor: pointer;

            &:hover{
                color: rgb(74 161 255);
            }
        }
    }


    .customer-info{
        display: flex;
        align-items: center;
        color: rgb(56, 56, 61);
        font-weight: 600;

        &__name{
            word-break: break-word;
        }

        &__phone{
            flex-shrink: 0;
        }

        i{
            display: block;
            width: 1px;
            height: 20px;
            background-color: rgb(235, 235, 240);
            margin: 0px 8px;
        }
    }

    .address-ship{
        color: rgb(128, 128, 137);
        font-weight: normal;
    }

`
