import { Modal } from "antd";
import { styled } from "styled-components";

export const WrapperAdminProduct = styled.div`

`
export const WrapperAddProductModal = styled(Modal)`
    min-width : 880px ;

    /* .ant-modal-body{
        display : flex;
    } */

    img {
        width : 400px !important;
        height : 96% !important;
        object-fit : cover;
    }

    .ant-col.ant-col-8.ant-form-item-label.css-dev-only-do-not-override-17a39f8{
        text-align : start;
    }

    .ant-col-8:nth-child(2){
        border-left: 1px solid #d5d5d5;
        border-right: 1px solid #d5d5d5;
    }
    
    .des-field .ant-row{
        display: block !important;
    }
`
