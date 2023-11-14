import styled from "styled-components";

export const WrapperAddressShipComponent = styled.div`
    .add-address{
        background-color: rgb(255, 255, 255);
        font-size: 15px;
        height: 60px;
        border: 1px dashed rgb(216, 216, 216);
        margin: 0px 0px 20px;
        display: flex;
        justify-content: center;
        align-items: center;

        svg,span{
            cursor: pointer;
        }

        svg{
            color: rgb(120, 120, 120);
            font-size: 28px;
            margin: 0px 20px;
        }

        span,.action{
            color: rgb(11, 116, 229);
        }
    }

    .address-ship{
        padding: 10px;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;

        .name{
            text-transform: uppercase;
            margin: 0px 0px 10px;

            >span{
                text-transform: none;
                margin-left: 15px ; 
                color: rgb(38, 188, 78);
            }

            svg{
                position: relative;
                top: 3px;
            }
        }

        .address{
            span{
                color: rgb(120, 120, 120);
            }
        }

        .phone{
            span{
                color: rgb(120, 120, 120);
            }
        }

        .action{
            min-width: 67px;

            svg{
                margin-right: 5px;
                position: relative;
                top: 3px;
            }

            .act-delete{
                cursor: pointer;
                color: rgb(254, 43, 43);
            }

            .act-edit{
                cursor: pointer;
                color: rgb(11, 116, 229);
            }

            .btn-address{
                border: 1px solid rgb(2, 159, 209);
                color: rgb(255, 255, 255);
                background: rgb(0, 182, 240);
                margin-top: 15px;

                &__default{
                    border: 1px solid rgb(85, 86, 73);
                    color: rgb(255, 255, 255);
                    background: rgb(98, 100, 85);
                    margin-top: 15px;
                }
            }
        }
    }

    .instructor-address{
        margin-top: 10px;
        margin-bottom: 20px;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.1;
    }

    .redirect-profile{
        font-size: 13px;
        margin-top: 20px;
        margin-bottom: 10px;

        span{
            color: rgb(0, 127, 240);
            cursor: pointer;
        }
    }
`