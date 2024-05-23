import { styled } from "styled-components";

export const WrapperAdmin = styled.div`
    display: flex;
    justify-content: flex-end;
    min-height: 100vh;

    .menu {
        width: 20%;
        background: #001529;
        position: fixed;
        left: 0;
        height: 100vh;
        
        .title-header{
            background: #001529;
            padding: 20px 16px;
            display: flex;
            align-items: center;
            cursor: pointer;

            span:last-child{
                color: #fff;
                flex: 1;
                padding: 0 45px 0 15px;
                font-size: 20px;
                font-weight: bold;
            }
        }

        span{
            font-size: 16px;
        }
    }
`

export const WrapperManageObject = styled.div`
    width : 80%;
    //height: 100vh;

    .kGwyCy {
        padding : 10px !important;
        justify-content: space-between !important;
    }

    .ant-col.ant-col-6.css-dev-only-do-not-override-17a39f8{
        padding : 0px !important;
        justify-content: end;
    }

    .path-system{
        display: flex;
        align-items: center;
        padding : 10px 0;

        .page-main:hover {
            cursor : pointer;
            color: blue;
        }
    }

    .wrapper-body-admin{
        padding: 0 8px;
    }

    button.custome-btn-excel{
        color: #fff;
        background: green;

        &:hover{
            color: #fff !important;
            background: #18a718 !important;
            border-color: #18a718 !important;
        }

        &:active{
            border-color: #18a718 !important;
        }
    }

    button.custome-btn-add{
        color: #fff;
        background: #3434f5;
        &:hover{
            color: #fff !important;
            background: #5454ff !important;
            border-color: #5454ff !important;
        }

        &:active{
            border-color: #5454ff !important;
        }
    }

    button.custome-btn-approve{
        color: #fff;
        background: #2fcf1a;
        &:hover{
            color: #fff !important;
            background: #55ff3e !important;
            border-color: #55ff3e !important;
        }

        &:active{
            border-color: #55ff3e !important;
        }
    }
`