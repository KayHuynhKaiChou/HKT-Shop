import { styled } from "styled-components";

export const WrapperOrderSuccess = styled.div`
    display : flex;
`

export const WrapperLeftSuccess = styled.div`
    flex : 1 1 750px;
    background-color: #fff;
    border-radius: 5px;
    min-height : 512px;
`

export const WrapperContainerSuccess = styled.div`
    padding: 40px;
    border-radius: 8px;
    display: flex;
    position: relative;
    overflow: hidden;

    .success-icon{
        margin-right: 32px;
        z-index: 1;
    }

    .background-success{
        position: absolute;
        width: 100%;
        height: 112px;
        left: 0px;
        top: 0px;
        z-index: 0;
    }

    .background-success::before {
        position: absolute;
        display: block;
        content: "";
        height: 100%;
        width: 100%;
        background: linear-gradient(119.64deg, rgb(11, 190, 229) 9.56%, rgb(56, 86, 243) 73.79%);
        z-index: 1;
    }

    .background-success::after {
        position: absolute;
        display: block;
        content: "";
        height: 100%;
        width: 100%;
        background-image: url(https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/confetti.svg);
        z-index: 2;
    }

    .success-content{
        flex: 1 1 0%;
        z-index: 1;
    }

    .success-content__header{
        color: rgb(255, 255, 255);
        margin-bottom: 32px;
    }

    .title{
        font-size: 24px;
        line-height: 32px;
        margin: 0px 0px 4px;
        font-weight: 500;
    }

    .sub-title{
        font-size: 18px;
        line-height: 24px;
        margin: 0px;
        font-weight: 500;
    }


    .success-content__summary {
        
    }

    .summary-item {
        display : flex;
        justify-content : space-between;
        align-items : center;
        height: 44px;
        font-size: 14px;
        line-height: 20px;
        border-bottom: 1px solid rgb(235, 235, 240);
    }

    .summary-item:last-child {
        border-bottom: none;
    }

    .summary-item__label {
        color: rgb(128, 128, 137);
    }

    .summary-item__value {
        color: rgb(56, 56, 61);
    }

    .value-large{
        font-size: 18px;
        line-height: 24px;
        font-weight: 500;
    }

    button{
        margin-top : 15px;
        width : 100%;
        height : 45px;
        padding : 10px 40px !important;
    }

`

export const WrapperRightSuccess = styled.div`
    flex : 1 1 calc(100% - 750px - 20px);
    margin-left : 20px;
    background-color: #fff;
    border-radius: 5px;
    align-self: flex-start;
    max-height: 250px; 
    overflow-y: auto;

    .order-email{
        padding: 12px 16px;
    }

    .order-header {
        font-size: 14px;
        line-height: 20px;
        padding: 12px 16px;
        font-weight: 500;
        display : flex;
        justify-content: space-between;

        &__title {
            color: rgb(56, 56, 61);
        }
    
        &__link {
            color: rgb(11, 116, 229);
        }
    }


    .order-divider {
        border-bottom: 1px solid rgb(235, 235, 240);
    }

    .order-body {
        padding: 8px 16px 20px;
        font-size: 14px;
        line-height: 20px;

        &__item{
            display:flex;
            align-items: center;
            margin-bottom: 12px;

            &--image{
                max-height: 48px;
            }
        
            &--name {
                margin-left : 7px;
                color: rgb(128, 128, 137);
                font-size: 14px;
                line-height: 20px;
            }
        }
    
    }


`