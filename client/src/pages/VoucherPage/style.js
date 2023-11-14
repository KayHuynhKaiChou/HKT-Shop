import { Row } from "antd";
import styled from "styled-components";

export const WrapperVoucherPage = styled.div`
    padding: 0 120px;
    background: #fff;
    display: flex;
    flex-direction: column;
`

export const WrapperVoucherBackground = styled.div`
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40px;
    border-radius: 10px;
    .title{
        margin: 10px 0;
        font-size: 25px;

        img{
            margin-right: 5px;
        }
    }
`

export const WrapperVouchers = styled(Row)`
    border-radius: 5px;

    .voucher-empty{
        margin-bottom: 40px;
    }

    .voucher-item{
        height: 150px;
        /* position: relative;
        background: #fff;
        display: flex;
        filter: drop-shadow(0 0 6px rgba(0,0,0,.09));
        background-clip: content-box;

        .vou-new-user, .vou-new-user::before{
            position: absolute;
            left: 0;
        }

        .vou-new-user::before{
            content: "";
            border-style: solid;
            bottom: -5px;
            border-color: #872c1a;
            border-left-color: transparent!important;
            border-bottom-color: transparent!important;
        }

        .vou-new-user{
            background: #ee4d2d;
            padding: 4px 8px;
            border-radius: 0 4px 4px 0;
            font-weight: 600;
            font-size: 20px;
            line-height: 23px;
            color: #fff;
            transform: translateX(-6px);
            top: 8px;
            max-width: 212px;
            box-sizing: border-box;

            .title{
                font-weight: 600;
                font-size: 16px;
                line-height: 23px;
                color: #fff;
            }
        }

        .vou-content{
            flex: 3;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .name{
                padding-left: 20px;
                font-weight: 700;
                font-size: 24px;
                line-height: 32px;
            }
            .condition{
                padding: 0 20px;
                font-size: 18px;
                line-height: 28px;
                margin-top: 4px;
            }
            .condition::first-letter{
                text-transform: uppercase;
            }
            .expired-date{
                margin-top: 4px;
                padding: 0 20px;
                color: rgb(117, 117, 117);
            }
        }

        .vou-action{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            
            .btn-unaction{
                pointer-events: none;
                opacity: 0.8;
                background: gray;
            }

            button{
                background: rgb(26, 148, 255);
                color: #fff;
                font-size: 18px;
                padding: 10px 15px;
                margin: 0 10px;
            }

        }

        .use-act{
            position: absolute;
            color: #1677ff;
            right: 10px;
            top: 38px;
            cursor: pointer;

            svg{
                font-size: 11px;
                margin-left: 3px;
            }

            &:hover{
                opacity: 0.8;
            }
        } */
    }
`