import styled from "styled-components"

export const WrapperHeaderOrder = styled.div`
    display: flex;
    flex-direction : column;

    .code-order{
        font-size: 19px;
        font-weight: 300;
    }
    .date-created{
        align-self :flex-end;
        font-size: 13px;
        color: rgb(36, 36, 36);
        line-height: 1.5;
    }
`

export const WrapperInfoOrder = styled.div`
    display: flex;
    margin: 10px 0px 20px;
    font-size: 13px;
    color: rgb(36, 36, 36);
    line-height: 1.5;
    min-height: 150px;

    .order-detail:first-child {
        margin-left: 0px;
    }

    .order-detail{
        color: rgba(0, 0, 0, 0.65);
        width: 33.3333%;
        margin: 0px 5px;
        display: flex;
        flex-direction : column;
        

        .label{
            font-size: 13px;
            text-transform: uppercase;
            margin: 0px 0px 15px;
            color: rgb(36, 36, 36);
        }
        .value{
            background: #fff;
            padding: 10px;
            border-radius: 4px;
            flex: 1;

            .value-delivery span span{
                color: rgb(249 175 78);
                font-weight: bold;
            }
        }
    }
    
    .order-detail:last-child {
        margin-right: 0px;
    }
`

export const WrapperTableProducts = styled.table`
    width: 100%;
    color: rgb(66, 66, 66);
    display: table;
    font-size: 13px;
    background: rgb(255, 255, 255);
    border-radius: 4px;
    border-collapse: collapse;
    border-spacing: 0px;
    line-height: 1.5;
    word-break: break-word;

    thead{
        tr{
            th{
                display: table-cell;
                padding: 20px 15px;
                border-top: none;
                min-width: 100px;
                position: relative;
                background: 0px 0px;
                color: rgb(120, 120, 120);
                font-size: 15px;
                font-weight: 400;
                border-bottom: 1px solid rgb(244, 244, 244);
                text-align: left;
            }
        
            th:first-child {
                border-left: none;
            }
        
            th:last-child {
                text-align: right;
            }
        }
    }

    tbody {
        tr{
            border-bottom: 1px solid rgb(244, 244, 244);
            td:last-child{
                text-align: right;
            }

            td{
                
                display: table-cell;
                padding: 20px 15px;
                color: rgb(36, 36, 36);
                vertical-align: top;
                min-width: 100px;

                .product-item{
                    display: flex;

                    img{
                        width: 60px;
                        height: 60px;
                        margin-right: 15px;
                    }

                    .product-name{
                        max-width: 340px;
                        font-size: 14px;
                        color: rgb(36, 36, 36);
                    }
                }
            }
        }
    }

    tfoot{
        tr{
            td{
                text-align: right;
                display: table-cell;
                padding: 10px 20px;
                color: rgb(36, 36, 36);

                .sum{
                    color: rgb(255, 59, 39);
                    font-size: 18px;
                    width: 101px;
                    display: block;
                }

                span{
                    color: rgb(120, 120, 120);
                    font-size: 14px;
                }

                button{
                    border: none;
                    background: #ffd54c;
                    span{
                        color: black !important;
                    }
                }
            }
        }
    }
`