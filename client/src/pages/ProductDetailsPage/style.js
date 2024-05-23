import { Col } from "antd"
import { styled } from "styled-components"

export const WrapperImgProduct = styled(Col)`
    padding-right : 15px;
    border-right : 1px solid rgb(242, 242, 242);
    position: sticky; // muốn thằng sticky này hoạt động thì thằng cha set align-items : start khi cha display : flex;
    top: 5px; 

    .ant-image{
        background-color : #fff;
        padding: 10px;
        border-radius: 10px;
    }
` 
export const WrapperDetailProduct = styled(Col)`
    background-color : #fff;
    padding : 15px 0;
    border-radius: 10px;
` 
export const WrapperDetailHeader = styled.div`
    padding: 0 15px;
    h1 {
        margin: 0px 0px 4px;
        color: rgb(39, 39, 42);
        font-size: 24px;
        font-weight: 500;
        line-height: 150%;
        word-break: break-word;
        white-space: break-spaces;
    }

    div.have-sold {
        font-size: 15px;
        line-height: 24px;
        color: rgb(120, 120, 120);
    }
`
export const WrapperDetailBody = styled.div`
    padding: 0 15px;
    div.price {
        border-radius: 5px;
        background-color: rgb(250, 250, 250);
        padding: 16px 12px;
        color: rgb(255, 66, 78);
        font-size: 32px;
        line-height: 40px;
        margin-right: 8px;
        font-weight: 500;
        display: flex;
        align-items: center;

        .price-final{
            margin-right: 15px;
        }

        .price-discount{
            font-weight: 400;
            font-size: 16px;
            line-height: 150%;
            padding: 0px 4px;
            background: rgb(226 226 231);
            border-radius: 8px;
            color: rgb(39, 39, 42);
        }

    }
`

export const WrapperQuantityChoose = styled.div`
    padding : 10px 0;

    .action-num-pro{
        display: flex;

        button.decrease{
            cursor : pointer;
            border-right: none;
            border-radius: 4px 0px 0px 4px;
            padding: 4px;
        }
    
        button.increase{
            cursor : pointer;
            border-left: none;
            border-radius: 0px 4px 4px 0px;
            padding: 4px;
        }

        button.decrease:disabled,
        button.increase:disabled{
            opacity: 0.6;
            cursor: default;
        }
    
        input {
            width: 40px;
            border: 1px solid rgb(236, 236, 236);
            text-align : center;
            outline: none;

            &:focus{
                border: 1px solid #c0c0c0;
            }
        }
    }


    div.group-button{
        margin-top: 16px;
        flex: 1 1 0%;
        display: flex;

        button.buy-action {
            color: rgb(255, 255, 255);
            background-color: rgb(255, 57, 69);
            width: 230px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            height: 48px;
    
            &:hover {
                color: #fff !important; 
                opacity: 0.8;
            }
    
            &:focus {
                outline : none;
            }
        }
    
        button.buy-before {
            border: 1px solid rgb(13, 92, 182);
            font-size: 15px;
            line-height: 1.6;
            color: rgb(13, 92, 182);
            width: 230px;
            height: 48px;
            margin-left: 15px;
    
            &:hover {
                opacity : 0.5;
            }
        }

    }

    .count-in-stock{
        width: 25%;
        display: flex;
        color: red;
        font-size: 14px;
        word-break: break-word;
        align-items: center;
        justify-content: center;
    }

`

export const WrapperDescribe = styled.div`
    border-top: 15px solid #efefef;
    padding: 15px;

    .describe-title{
        font-weight: 600;
        font-size: 16px;
        line-height: 150%;
        color: rgb(39, 39, 42);
    }

    .describe-content{
        color: rgb(36, 36, 36);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
    }
`

export const WrapperProductsByCategory = styled.div`
    border-top: 15px solid #efefef;
    padding: 15px;
    
    .category-title{
        font-weight: 600;
        font-size: 16px;
        line-height: 150%;
        color: rgb(39, 39, 42);
        margin-bottom: 10px;
    }
`