import { Upload } from "antd";
import { styled } from "styled-components";

export const WrapperProfile = styled.div`
    background-color: #efefef;
`

export const FormProfile = styled.div`
    padding : 20px;
    background-color: #fff;
    min-width : 600px;
    border-radius : 10px;
`

export const WrapperHeader = styled.div`
    font-size : 18px;
    font-weight : bold;
    margin-bottom : 20px;
`

export const WrapperContentProfile = styled.div`
    display: flex;
`
export const WrapperAvatar = styled.div`
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;


    div {
        text-align: center;
    }

    img {
        margin : 10px 0;
        width : 200px !important;
        height : 200px !important;
        border-radius : 50%;
        border: 1px solid #e4e4e4;
        object-fit: cover;
    }

`

export const WrapperUpload = styled(Upload)`
    .ant-upload-list.ant-upload-list-text {
        display: none;
    }
`

export const WrapperTextInform = styled.div`
    width: 60%;
    padding-left: 20px;
    border-left: 1px solid #e6e6e6;

    .flex-start{
        justify-content: flex-start;
    }
`


export const WrapperItem = styled.div`
    display : flex;
    margin-bottom : 30px;
    align-items : center;

    button{
        margin-left: 15px;
    }
`

export const WrapperLabel = styled.div`
    min-width : 120px;
`

export const WrapperButton = styled.div`
    display: flex;
    justify-content: right;
`
