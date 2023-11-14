import styled from "styled-components"

export const WrapperCustomer = styled.div`
    padding : 0px 120px;
    display : flex;
    align-items: start;
    background : #efefef;
    min-height : 100vh;

    .menu-customer{
        margin-right : 20px;
        position: sticky;
        top: 20px;

        .ant-menu-item-selected{
            background-color: rgb(200 200 202);
        }

        .menu-customer__header{
            display: flex;
            align-items: center;
            margin-left: 14px;
            font-size: 18px;
            font-weight: 500;
            padding: 6px;

            img {
                margin-right : 10px;
                width : 40px;
                height : 40px;
                border-radius : 50%;
                object-fit: cover;
            }
        }
    }

    .ui-customer{
        flex: 2;
        .ui-customer__header{
            font-size: 20px;
            line-height: 32px;
            font-weight: 300;
            margin: 4px 0px 12px;
        }

    }
`