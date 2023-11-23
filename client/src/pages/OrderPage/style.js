import { Checkbox } from "antd"
import {CheckCircleOutlined} from '@ant-design/icons'
import { styled } from "styled-components"

export const WrapperCart = styled.div`
    
`

export const WrapperCartTitle = styled.div`
    font-size: 20px;
    font-weight: 500;
    color: rgb(0, 0, 0);
    line-height: 28px;
    text-transform: uppercase;
`

export const WrapperCartContent = styled.div`
    display : flex;

`

export const WrapperCartLeft = styled.div`
    flex : 1 1 910px;

    .all-items{
        display: flex;
        padding-right: 30px;
    }

    img.remove-all{
        cursor: pointer;
        width: 18px;
        height: 18px;
    }
`

export const WrapperProgressPrice = styled.div`
    padding : 30px 10px;
    background-color : #fff;
    border-radius : 5px;
    position : relative;

    .step-price-first{
        position : absolute;
        top : 55%;
    }

    .step-price-half{
        position : absolute;
        top : 13%;
        display : flex;
        flex-direction: column;
        left : 45.5%;
        align-items: center;
    }

    .step-price-last{
        position : absolute;
        top : 13%;
        display : flex;
        flex-direction: column;
        right : 1%;
        align-items: end;
    }
`

export const CustomCheckIconCircle = styled(CheckCircleOutlined)`
    color: #fff;
    margin: "10px 0";
    width: 16px;
    border-radius: 50%;
    display: block;
`

export const WrapperHeaderCart = styled.div`
    display: grid;
    grid-template-columns: 398px 190px 130px 130px 30px;
    background-color : #fff;
    margin-top : 10px;
    padding : 9px 16px;
    border-radius : 5px;

`

export const WrapperCartItems = styled.div`
    background-color : #fff;
    margin-top : 10px;
    border-radius : 5px;
`

export const WrapperCartItem = styled.div`
    display: grid;
    grid-template-columns: 398px 171px 150px 130px 30px;
    padding : 9px 16px;
    align-items : center;

    img.item-image {
        width : 75px;
        height : 75px;
        object-fit : contain;

    }

    .item-name {
        height : 75px;
        padding-left: 8px;
        text-overflow: ellipsis;
        overflow: hidden;
    }
`

export const CustomCheckBox = styled(Checkbox)`

`

export const WrapperCartRight = styled.div`
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

export const WrapperCartPrice = styled.div`
    background-color : #fff;
    margin-top : 15px;

    ul.price-items{
        margin : 0px;
        list-style: none;
        padding: 16px;
        border-bottom: 1px solid rgb(244, 244, 244);

        li.price-item{
            display : flex;
            justify-content : space-between;
            margin-bottom: 10px;

            .price-text{
                font-weight: 300;
                color: rgb(51, 51, 51);
                display: inline-block;
            }
            .price-value{
        
            }
        }
    }

    .price-total{
        padding: 17px 20px;
        display: flex;
        justify-content : space-between;

        .price-text{
    
        }

        .price-content{
            font-weight: 500;
            font-size: 20px;
            line-height: 32px;
            color: rgb(255, 66, 78);
        }
    }



    .order-selected{
        font-size: 14px;
        line-height: 20px;
        padding: 16px;
        border-bottom: 1px solid rgb(235, 235, 240);

        .order-selected__title{
            display: flex;
            align-items: center;
            justify-content: space-between;
            h3{
                font-weight: 500;
                color: rgb(56, 56, 61);
                margin: 0px;
            }
            div{
                font-size: 16px;
                color: rgb(11, 116, 229);
                cursor: pointer;

                &:hover{
                    color: rgb(74 161 255);
                }
            }
        }

        .order-selected__action{
            display: flex;
            align-items: center;
            margin-top: 5px;

            .order-selected__quantity{
                color: rgb(128, 128, 137);
                font-weight: 400;
                margin: 0px 10px 0px 0px;
            }

            .order-selected__infor{
                display: flex;
                -webkit-box-align: center;
                align-items: center;
                color: rgb(11, 116, 229);
                font-weight: 400;
                margin: 0px;
                cursor: pointer;

                span{
                    padding: 5px 0 0 5px;
                }

                .rotation_plus180 svg{
                    transform: rotate(180deg);
                    transition-duration: 0.25s;
                }

                .rotation_minus180 svg{
                    transform: rotate(0deg);
                    transition-duration: 0.25s;
                }
            }
        }
        
    }

    .list-products{
        border-bottom: 1px solid rgb(235, 235, 240);
        padding: 12px 16px;
        font-size: 12px;
        line-height: 16px;
        margin-bottom: 12px;
        display: grid;
        gap: 4px;
        transition: width 0.5s; /* Thời gian hiệu ứng (0.5 giây) */
        overflow: hidden; 

        .product{
            display: flex;
            justify-content: space-between;
            .product-info{
                display: flex;
                .product-info__qty{
                    width: 30px;
                    margin-right: 8px;
                    font-weight: 500;
                    flex-shrink: 0;
                }
                .product-info__name{
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                    max-width: 156px;
                    font-weight: 400;
                }
            }

            .product-price{

            }
        }
    }

    .hiddenList{
        display: block;
        transition: max-height 0.5s ease-in-out 0s;
        overflow: hidden;
        max-height: 0px;
    }

    .showList{
        display: block;
        max-height: 1000px;
        transition: max-height 0.5s ease-in-out 0s;
        overflow: hidden;
    }
`

export const WrapperVouchersChoice = styled.div`
    background-color : #fff;
    padding: 15px;
    border-radius: 5px;

    .vou-header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        line-height: 20px;

        .header-content{
            color: rgb(36, 36, 36);
            text-transform: capitalize;
            font-weight: 500;
        }

        .header-ability{
            color: rgb(120, 120, 120);
        }
    }

    .vou-body{
        padding-top:15px;

        .list-vou {
            .vou-item:first-child{
                margin: 0;
            }
            .vou-item{
                display: flex;
                align-items: center;
                filter: drop-shadow(0 0 6px rgba(0,0,0,.09));
                background: #fff;
                margin-top: 10px;
                .vou-img{
                    position: relative;
                    height: 80px;
                    width: 80px;
                    .sYRxe3 path {
                        fill: rgb(26, 148, 255); /* Đổi màu fill thành màu đỏ (#FF0000) */
                    }

                    .vou-title{
                        position: absolute;
                        top: 30%;
                        left: 14%;
                        color: #fff;
                        text-align: center;
                        font-size: 13px;
                    }
                }
                .vou-content {
                    margin-left: 10px;
                    flex: 2;
                }
                .vou-act {
                    margin-right: 10px;
                    span{
                        font-size: 25px;
                        color: rgb(0, 171, 86);
                    }
                }
            }
        }
        .other-vou {
            color: rgb(11, 116, 229);
            font-size: 14px;
            line-height: 20px;
            cursor: pointer;
            margin-top: 15px;
            display: flex;
            align-items: center;

            svg{
                font-size: 20px;
                margin: 1px 7px 0 0;
            }
        }
    }
`
