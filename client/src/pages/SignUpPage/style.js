import { styled } from "styled-components";

export const WrapperFormLogin = styled.div`
    display: flex;
`

export const HeaderForm = styled.div`
    margin: 30px 0;
    h4 {
        margin: 0px 0px 10px;
        font-size: 24px;
        font-weight: 500;
    }

    p {
        margin: 0px;
        font-size: 15px;
        line-height: 20px;
    }

`

export const WrapperFormLeft = styled.div`
    width: 410px;
    padding: 40px 45px 24px;
    background: rgb(255, 255, 255);
    border-radius: 20px 0px 0px 20px;

    input {
        width: 410px;
    }

    .ant-form-item-control-input{
        width: 410px !important;
    }

    button.btn-login {
        width : 100%;
        background-color : rgb(255, 66, 78);
        font-size : 18px;
        display: flex;
        justify-content: center;
        align-items: center;

        &: hover {
            background-color : rgb(255, 66, 78) !important;
            opacity : 0.85;
            border-color : transparent !important;
        }
    }
`

export const WrapperImageRight = styled.div`
    background: linear-gradient(136deg, rgb(240, 248, 255) -1%, rgb(219, 238, 255) 85%);
    width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 0px 10px 10px 0px;

    .content{
        margin-top : 40px;
        color : rgb(11, 116, 229);
    }
`

export const WrapperMsgErr = styled.span`
    color: red;
    position: absolute;
    top: ${(props) => props.top || '0'};
`
