import { styled } from "styled-components";

export const WrapperMyOrder = styled.div`
    min-width : 970px;

    .my-order-header{
        font-size: 19px;
        line-height: 21px;
        font-weight: 300;
        margin: 20px 0px 15px;
    }

    .custome-header-order{
        background: #fff;
        border-radius: 5px;
        padding: 15px;
    }
`

export const WrapperContainerMyOrder = styled.div`
    background: #fff;
    border-radius: 5px;
    padding : 15px;
    margin-bottom: 30px;

    .order-cancel{
        color: rgb(128, 128, 137);
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
    }

    .order-cancel::before{
        content: "";
        display: block;
        background: url(https://frontend.tikicdn.com/_desktop-next/static/img/account/block.png) center center / 20px 20px no-repeat;
        width: 20px;
        height: 20px;
        float: left;
        margin: 0px 6px 0px 0px;
    }

    .order-status{
        display : flex;
        align-items: center;

        .order-status__label{
            min-width: 75px;
        }

        .order-status__value{
            margin-left : 8px;

            .order-approve{
                display: flex;
                align-items: center;
                color: rgb(0, 171, 86);
            }
        }
    }
    
    .my-order-divider {
        margin : 10px 0;
        border-bottom: 1px solid rgb(235, 235, 240);
    }

    .my-order-body{
        .product{
            display : flex;
            justify-content: space-between;

            .detail{
                display : flex;

                .product-img{
                    width: 80px;
                    height: 80px;
                    border-radius: 4px;
                    border: 0.5px solid rgb(238, 238, 238);
                    background-repeat: no-repeat;
                    background-size: 90%;
                    background-position: center center;
                    position: relative;

                    .quantity{
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        font-size: 12px;
                        line-height: 26px;
                        font-weight: 400;
                        color: rgb(128, 128, 137);
                        text-align: center;
                        width: 28px;
                        height: 28px;
                        background-color: rgb(235, 235, 240);
                        border-top-left-radius: 10px;
                    }
                }

                .product-info{
                    margin: 0px 12px;
                    display: flex;
                    flex-direction: column;
                    width: 600px;
                }

                .price{
                    color: rgb(56, 56, 61);
                    font-size: 14px;
                    font-weight: 400;
                    display: flex;
                    flex-direction: column;
                }
            }
        }
    }

    .my-order-act{
        button{
            border: 1px solid rgb(221, 221, 227);
            font-size: 12px;
            font-weight: 400;
            color: rgb(100, 100, 109);
        }
    }

    .my-order-footer{
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .total-money{
            font-size: 17px;
            display: flex;
            margin-bottom: 12px;

            .total-money__label{
                font-weight: 300;
                color: rgb(128, 128, 137);
                margin-right: 8px;
            }
            .total-money__value{
                font-weight: 400;
                color: rgb(56, 56, 61);
            }
        }
        .button-group{

        }
    }

`